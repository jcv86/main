import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getJourneyForCurrentUser } from '@/lib/journey/service'
import { readJourneyFlow } from '@/lib/journey/flow-service'
import { readGuidedNextAction } from '@/lib/journey/next-action-service'
import { loadA1AgentContext } from '@/lib/dtc-agentos/context/a1-context'
import { checkA2PilotAccess } from '@/lib/a2/api-access'
import {
  a2AssistantRequestSchema, buildA2AssistantMessages,
  A2_ASSISTANT_ACTOR_HEADER, A2_ASSISTANT_EXPECTED_ACTOR_HEADER,
  type A2A1Evidence,
} from '@/lib/a2/assistant-contract'
import type { GuidedNextAction } from '@/lib/journey/next-action'
import { DTC_REQUEST_ID_HEADER, resolveRequestId } from '@/lib/observability/request-id'
import { logOperationalEvent } from '@/lib/observability/server-log'

const MAX_BODY_BYTES = 64_000

async function readBoundedJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) throw new Error('too_large')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('invalid_json')
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let bytes = 0, text = ''
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      bytes += value.byteLength
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel()
        throw new Error('too_large')
      }
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  } finally { reader.releaseLock() }
}

export async function POST(request: Request) {
  const requestId = resolveRequestId(request.headers)
  let actorId: string | undefined
  let guidance: GuidedNextAction | undefined
  const respond = (body: Record<string, unknown>, status: number) => NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
      [DTC_REQUEST_ID_HEADER]: requestId,
      ...(actorId ? { [A2_ASSISTANT_ACTOR_HEADER]: actorId } : {}),
    },
  })
  const fail = (status: number, code: string, error: string) => respond({ error, code, ...(guidance ? { guidance } : {}) }, status)

  try {
    const client = await createClient()
    const { data: { user }, error: authError } = await client.auth.getUser()
    if (authError || !user) return fail(401, 'authentication_required', 'Vuelve a iniciar sesión para continuar.')
    actorId = user.id
    if (request.headers.get(A2_ASSISTANT_EXPECTED_ACTOR_HEADER) !== actorId) {
      return fail(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
    }
    const origin = request.headers.get('origin')
    const fetchSite = request.headers.get('sec-fetch-site')
    if (origin !== new URL(request.url).origin || (fetchSite !== null && fetchSite !== 'same-origin')) {
      return fail(403, 'origin_not_allowed', 'Abre el asistente desde Tu Ruta.')
    }
    if ((request.headers.get('content-type') || '').split(';')[0].trim().toLowerCase() !== 'application/json') {
      return fail(415, 'invalid_content_type', 'La consulta debe enviarse como JSON.')
    }
    let payload: unknown
    try { payload = await readBoundedJson(request) } catch (error) {
      const oversized = error instanceof Error && error.message === 'too_large'
      return fail(oversized ? 413 : 400, oversized ? 'request_too_large' : 'invalid_json', oversized ? 'La consulta es demasiado larga.' : 'No pudimos leer la consulta.')
    }
    const parsed = a2AssistantRequestSchema.safeParse(payload)
    if (!parsed.success) return fail(400, 'invalid_assistant_request', 'Revisa el texto de la consulta y vuelve a intentarlo.')

    const pilot = await checkA2PilotAccess(actorId)
    if (pilot !== 'allowed') return fail(pilot === 'denied' ? 403 : 503, 'pilot_access_unavailable', pilot === 'denied' ? 'Necesitas acceso al piloto para usar el asistente.' : 'No pudimos verificar el acceso al piloto. Intenta nuevamente.')
    const journey = await getJourneyForCurrentUser()
    if (!journey || journey.user.id !== actorId) return fail(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
    if (!journey.access.a2) return fail(403, 'journey_access_required', 'Completa tu punto de partida antes de abrir el asistente de Tu Ruta.')
    const flow = await readJourneyFlow(journey, client)
    guidance = await readGuidedNextAction(journey, flow, client)

    let a1: A2A1Evidence
    try { a1 = { status: 'available', data: await loadA1AgentContext(client, actorId) } }
    catch (error) {
      if (error instanceof Error && error.message === 'A1_CONTEXT_ACCESS_DENIED') {
        guidance = undefined
        return fail(409, 'session_changed', 'La sesión cambió. Recarga la página antes de continuar.')
      }
      a1 = { status: 'unavailable' }
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) return fail(503, 'assistant_not_configured', 'El asistente no está disponible ahora. Puedes continuar con tu siguiente acción.')
    let response: Response
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: buildA2AssistantMessages(parsed.data, flow, guidance, a1),
          temperature: 0.35, max_tokens: 600, store: false,
        }),
        signal: AbortSignal.timeout(25_000),
      })
    } catch {
      return fail(503, 'assistant_unavailable', 'La respuesta tardó o no pudo llegar. Tu pregunta se conserva; puedes reintentar.')
    }
    if (!response.ok) return fail(502, 'assistant_generation_failed', 'El asistente no pudo responder. Tu pregunta se conserva; puedes reintentar.')
    const result = await response.json().catch(() => null)
    const text = result?.choices?.[0]?.message?.content
    if (typeof text !== 'string' || !text.trim() || text.length > 6_000) {
      return fail(502, 'assistant_invalid_response', 'No recibimos una respuesta válida. Puedes reintentar.')
    }
    logOperationalEvent({ event: 'a2.assistant.completed', requestId, route: '/api/despega/a2-coach', status: 200,
      metadata: { history_items: parsed.data.conversationHistory.length, a1_available: a1.status === 'available' } })
    return respond({ response: text.trim(), guidance }, 200)
  } catch {
    logOperationalEvent({ event: 'a2.assistant.context_unavailable', requestId, route: '/api/despega/a2-coach', status: 503 })
    return fail(503, 'context_unavailable', 'No pudimos verificar tu recorrido. Tu pregunta se conserva; recarga o vuelve a intentarlo.')
  }
}
