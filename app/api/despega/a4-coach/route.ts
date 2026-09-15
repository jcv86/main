import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveServerUser } from '@/lib/auth/server-user'
import { buildVeraCoachPolicyPrompt, routeVeraQuery } from '@/lib/vera/brain-v2'
import { evidencePackToPrompt } from '@/lib/vera/context-pack'
import { runVeraTool } from '@/lib/vera/tool-catalog'
import { DTC_REQUEST_ID_HEADER, resolveRequestId } from '@/lib/observability/request-id'
import { logOperationalError, logOperationalEvent } from '@/lib/observability/server-log'

const requestSchema = z.object({
  message: z.string().trim().min(2).max(2_000),
  context: z.unknown().optional(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'coach']),
        content: z.string().trim().min(1).max(3_000),
      }),
    )
    .max(16)
    .optional()
    .default([]),
})

const A4_SPECIALIZATION = `Estás acompañando A4 · Radar Estratégico de Despega Tu Carrera.
Tu especialidad es traducir señales del mercado laboral chileno a contexto comprensible.
Explica conceptos antes de interpretarlos. No hagas recomendaciones financieras personalizadas ni editorialices políticamente.
Cuando exista evidencia verificada del recorrido del usuario, úsala como contexto, no como destino: no conviertas un resultado psicométrico en una sentencia.
Responde en español de Chile, con lenguaje adulto y claro. Prioriza contexto → conexión con evidencia → pregunta o siguiente experimento.`

function unverifiedTopicHint(value: unknown) {
  if (typeof value === 'string') return value.trim().slice(0, 600)
  if (!value || typeof value !== 'object') return ''

  const candidate = value as Record<string, unknown>
  const topic = candidate.topicContext ?? candidate.newsContext ?? candidate.topic
  return typeof topic === 'string' ? topic.trim().slice(0, 600) : ''
}

function errorResponse(requestId: string, status: number, code: string, message: string) {
  return NextResponse.json(
    { error: message, code, request_id: requestId },
    {
      status,
      headers: {
        'Cache-Control': 'private, no-store',
        [DTC_REQUEST_ID_HEADER]: requestId,
      },
    },
  )
}

export async function POST(request: NextRequest) {
  const requestId = resolveRequestId(request.headers)
  const resolvedUser = await resolveServerUser()
  if (!resolvedUser) {
    return errorResponse(requestId, 401, 'authentication_required', 'Unauthorized')
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return errorResponse(requestId, 400, 'invalid_json', 'Invalid JSON')
  }

  const parsed = requestSchema.safeParse(payload)
  if (!parsed.success) {
    return errorResponse(requestId, 400, 'invalid_coaching_request', 'Invalid coaching request')
  }

  const routing = routeVeraQuery(parsed.data.message)
  const topicHint = unverifiedTopicHint(parsed.data.context)
  let evidencePrompt = ''
  let toolUsed = false

  if (routing.needsJourneyContext) {
    try {
      const evidence = await runVeraTool('journey_context')
      if (evidence) {
        evidencePrompt = evidencePackToPrompt(evidence)
        toolUsed = true
      }
    } catch (error) {
      logOperationalError({
        event: 'vera.tool.journey_context_failed',
        requestId,
        route: '/api/despega/a4-coach',
        status: 'degraded',
        metadata: { track: routing.track, intent: routing.intent },
        error,
      })
    }
  }

  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    return errorResponse(requestId, 503, 'coaching_not_configured', 'AI coaching is not configured')
  }

  const history = parsed.data.conversationHistory.map((message) => ({
    role: (message.role === 'coach' ? 'assistant' : message.role) as 'user' | 'assistant',
    content: message.content,
  }))

  const systemPrompt = [
    buildVeraCoachPolicyPrompt(routing.intent),
    A4_SPECIALIZATION,
    routing.track === 'agentic'
      ? 'Estás en modo Agentic Coach: usa la evidencia disponible, conecta piezas y explicita los trade-offs.'
      : 'Estás en modo Fast Coach: responde con precisión y brevedad; no inventes contexto personal ausente.',
  ].join('\n\n')

  const userMessage = [
    evidencePrompt ? `EVIDENCIA VERIFICADA DEL RECORRIDO:\n${evidencePrompt}` : '',
    topicHint ? `CONTEXTO TEMÁTICO APORTADO POR EL CLIENTE (NO VERIFICADO):\n${topicHint}` : '',
    `PREGUNTA ACTUAL:\n${parsed.data.message}`,
  ]
    .filter(Boolean)
    .join('\n\n')

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: userMessage },
        ],
        temperature: routing.track === 'agentic' ? 0.45 : 0.35,
        max_tokens: routing.track === 'agentic' ? 750 : 500,
        stream: true,
        store: false,
      }),
      signal: AbortSignal.timeout(25_000),
    })

    if (!response.ok) {
      logOperationalEvent({
        event: 'vera.openai.failed',
        requestId,
        route: '/api/despega/a4-coach',
        status: response.status,
        metadata: { track: routing.track, intent: routing.intent, tool_used: toolUsed },
      })
      return errorResponse(requestId, 502, 'coach_generation_failed', 'Coach response unavailable')
    }

    logOperationalEvent({
      event: 'vera.route.completed',
      requestId,
      route: '/api/despega/a4-coach',
      status: 200,
      metadata: {
        track: routing.track,
        intent: routing.intent,
        tool_used: toolUsed,
        history_items: history.length,
      },
    })

    const encoder = new TextEncoder()
    const customStream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader()
        if (!reader) {
          controller.close()
          return
        }

        try {
          const decoder = new TextDecoder()
          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')

            for (let i = 0; i < lines.length - 1; i++) {
              const line = lines[i].trim()
              if (!line.startsWith('data: ')) continue
              const data = line.slice(6)
              if (data === '[DONE]') continue

              try {
                const event = JSON.parse(data)
                const content = event.choices?.[0]?.delta?.content
                if (typeof content === 'string' && content) {
                  controller.enqueue(encoder.encode(content))
                }
              } catch {
                // Ignore malformed upstream SSE fragments.
              }
            }

            buffer = lines[lines.length - 1]
          }
        } catch (error) {
          logOperationalError({
            event: 'vera.stream.failed',
            requestId,
            route: '/api/despega/a4-coach',
            status: 'stream_error',
            metadata: { track: routing.track, intent: routing.intent },
            error,
          })
          controller.error(error)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'private, no-store',
        [DTC_REQUEST_ID_HEADER]: requestId,
        'x-vera-track': routing.track,
        'x-vera-intent': routing.intent,
      },
    })
  } catch (error) {
    logOperationalError({
      event: 'vera.generation.failed',
      requestId,
      route: '/api/despega/a4-coach',
      status: 502,
      metadata: { track: routing.track, intent: routing.intent, tool_used: toolUsed },
      error,
    })
    return errorResponse(requestId, 502, 'coach_generation_failed', 'Coach response unavailable')
  }
}
