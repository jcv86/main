import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createClient } from '@/lib/supabase/server'

const requestSchema = z.object({
  question: z.string().trim().min(2).max(600),
  currentAnswer: z.string().trim().max(6_000).default(''),
})

const responseSchema = z.object({
  suggestion: z.string().trim().min(1).max(2_000),
  tips: z.array(z.string().trim().min(1).max(500)).min(1).max(5),
})

const fallbackSuggestions: Record<string, { suggestion: string; tips: string[] }> = {
  'rol profesional': {
    suggestion:
      'Especifica el nivel de responsabilidad, el sector y el tipo de problemas que quieres resolver en ese rol.',
    tips: ['Incluye dos o tres cargos concretos', 'Menciona el tipo de industria', 'Conecta el rol con evidencia propia'],
  },
  'ambiente de trabajo': {
    suggestion:
      'Describe las condiciones en que rindes mejor y qué tipo de equipo o liderazgo facilita ese desempeño.',
    tips: ['Distingue remoto, híbrido o presencial', 'Describe el tamaño de equipo', 'Explica qué necesitas del liderazgo'],
  },
  '30 días': {
    suggestion:
      'Define un cambio observable para los próximos 30 días y una evidencia concreta que permita verificarlo.',
    tips: ['Usa una meta medible', 'Divide el objetivo en hitos', 'Define una señal de avance'],
  },
  visión: {
    suggestion:
      'Conecta tu dirección de largo plazo con una decisión concreta que puedas comenzar a ejecutar ahora.',
    tips: ['Acota el horizonte', 'Nombra las capacidades necesarias', 'Identifica la siguiente decisión'],
  },
  default: {
    suggestion:
      'Haz la respuesta más específica y verificable: explica qué quieres cambiar, por qué importa y qué evidencia mostraría avance.',
    tips: ['Usa un ejemplo concreto', 'Evita conceptos demasiado amplios', 'Revisa que exista una acción observable'],
  },
}

function fallbackFor(question: string) {
  const normalized = question.toLowerCase()
  for (const [key, value] of Object.entries(fallbackSuggestions)) {
    if (key !== 'default' && normalized.includes(key)) return value
  }
  return fallbackSuggestions.default
}

function extractJson(text: string) {
  const trimmed = text.trim()
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
  return JSON.parse(withoutFence)
}

export async function POST(request: NextRequest) {
  const resolvedUser = await resolveServerUser()
  if (!resolvedUser) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'authentication_required' },
      { status: 401 },
    )
  }

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON', code: 'invalid_json' },
      { status: 400 },
    )
  }

  const parsed = requestSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid coaching request', code: 'invalid_coaching_request' },
      { status: 400 },
    )
  }

  const fallback = fallbackFor(parsed.data.question)
  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    return NextResponse.json(fallback, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  }

  let c1Context = ''
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('conozcamonos_1_responses')
      .select('role, environment, desired_outcome')
      .eq('user_id', resolvedUser.id)
      .maybeSingle()

    if (data) {
      c1Context = [
        `Rol buscado: ${String(data.role || 'No especificado').slice(0, 300)}`,
        `Ambiente ideal: ${String(data.environment || 'No especificado').slice(0, 300)}`,
        `Objetivo: ${String(data.desired_outcome || 'No especificado').slice(0, 500)}`,
      ].join('\n')
    }
  } catch (contextError) {
    console.warn(
      '[a2/coach-assist] context unavailable',
      contextError instanceof Error ? contextError.message : 'unknown_error',
    )
  }

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
          {
            role: 'system',
            content:
              'Eres un coach de desarrollo profesional. No aconsejes ni decidas por la persona. Formula observaciones breves que ayuden a volver su respuesta más específica, verificable y conectada con evidencia. Responde solo JSON válido con suggestion y tips.',
          },
          {
            role: 'user',
            content: [
              c1Context ? `Contexto verificado del usuario:\n${c1Context}` : '',
              `Pregunta: ${parsed.data.question}`,
              `Respuesta actual: ${parsed.data.currentAnswer || 'Sin respuesta todavía'}`,
              'Devuelve una sugerencia breve y entre 2 y 4 tips concretos.',
            ]
              .filter(Boolean)
              .join('\n\n'),
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 500,
        store: false,
      }),
      signal: AbortSignal.timeout(20_000),
    })

    if (!response.ok) {
      console.error('[a2/coach-assist] OpenAI request failed', response.status)
      return NextResponse.json(fallback, {
        headers: { 'Cache-Control': 'private, no-store' },
      })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (typeof content !== 'string') {
      return NextResponse.json(fallback, {
        headers: { 'Cache-Control': 'private, no-store' },
      })
    }

    const validated = responseSchema.safeParse(extractJson(content))
    return NextResponse.json(validated.success ? validated.data : fallback, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  } catch (error) {
    console.error(
      '[a2/coach-assist] generation failed',
      error instanceof Error ? error.message : 'unknown_error',
    )
    return NextResponse.json(fallback, {
      headers: { 'Cache-Control': 'private, no-store' },
    })
  }
}
