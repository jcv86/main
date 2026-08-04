import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { resolveServerUser } from '@/lib/auth/server-user'

const requestSchema = z.object({
  question: z.string().trim().min(2).max(1_000),
  answer: z.string().trim().min(1).max(8_000),
  context: z.string().trim().max(4_000).optional().default(''),
})

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

  const openaiApiKey = process.env.OPENAI_API_KEY
  if (!openaiApiKey) {
    return NextResponse.json(
      { error: 'AI coaching is not configured', code: 'coaching_not_configured' },
      { status: 503 },
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
              'Eres un coach de práctica de entrevistas. No aconsejes ni decidas por la persona. Devuelve una observación breve en español que ayude a hacer la respuesta más clara, específica, verificable y relevante. Máximo tres oraciones.',
          },
          {
            role: 'user',
            content: [
              `Pregunta: ${parsed.data.question}`,
              `Respuesta: ${parsed.data.answer}`,
              parsed.data.context ? `Contexto: ${parsed.data.context}` : '',
            ]
              .filter(Boolean)
              .join('\n\n'),
          },
        ],
        temperature: 0.4,
        max_tokens: 180,
        store: false,
      }),
      signal: AbortSignal.timeout(20_000),
    })

    if (!response.ok) {
      console.error('[a3/coach-suggestion] OpenAI request failed', response.status)
      return NextResponse.json(
        { error: 'Coach suggestion unavailable', code: 'coach_generation_failed' },
        { status: 502 },
      )
    }

    const data = await response.json()
    const suggestion = data.choices?.[0]?.message?.content
    if (typeof suggestion !== 'string' || !suggestion.trim()) {
      return NextResponse.json(
        { error: 'Coach suggestion unavailable', code: 'empty_coach_response' },
        { status: 502 },
      )
    }

    return NextResponse.json(
      { suggestion: suggestion.trim().slice(0, 2_000) },
      { headers: { 'Cache-Control': 'private, no-store' } },
    )
  } catch (error) {
    console.error(
      '[a3/coach-suggestion] generation failed',
      error instanceof Error ? error.message : 'unknown_error',
    )
    return NextResponse.json(
      { error: 'Coach suggestion unavailable', code: 'coach_generation_failed' },
      { status: 502 },
    )
  }
}
