import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { CONOZCAMONOS_2_QUESTIONS } from '@/lib/conozcamonos-2-questions'

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function responseFor(
  responses: Record<string, unknown>,
  questionId: number,
): unknown {
  return responses[String(questionId)] ?? responses[questionId as unknown as string]
}

function validateResponses(value: unknown): string[] {
  const responses = objectValue(value)
  const errors: string[] = []

  for (const question of CONOZCAMONOS_2_QUESTIONS) {
    const answer = responseFor(responses, question.id)

    if (question.type === 'checkbox') {
      if (!Array.isArray(answer) || answer.length === 0) {
        errors.push(`Completa: ${question.question}`)
      }
      continue
    }

    const text = typeof answer === 'string' ? answer.trim() : ''
    const minimumLength = question.type === 'text' ? 10 : 1
    if (text.length < minimumLength) {
      errors.push(`Completa: ${question.question}`)
    }
  }

  return errors
}

export async function POST(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    let body: { responses?: unknown }
    try {
      body = (await request.json()) as { responses?: unknown }
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const validationErrors = validateResponses(body.responses)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Completa todas las respuestas antes de continuar.',
          validation: { errors: validationErrors },
        },
        { status: 422 },
      )
    }

    const userId = currentUser.id
    const supabase = createAdminClient()
    const [profileResult, a1Result] = await Promise.all([
      supabase
        .from('despega_user_profiles')
        .select('onboarding_conozcamonos_1_completed, onboarding_completed')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('a1_cerebral_assessment')
        .select('user_id')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    if (profileResult.error || a1Result.error) {
      console.error('[v0] C2 prerequisite lookup error:', {
        profile: profileResult.error,
        a1: a1Result.error,
      })
      return NextResponse.json(
        { error: 'No pudimos verificar los pasos anteriores de A1.' },
        { status: 500 },
      )
    }

    const c1Completed = Boolean(
      profileResult.data?.onboarding_conozcamonos_1_completed ||
        profileResult.data?.onboarding_completed,
    )
    if (!c1Completed || !a1Result.data) {
      return NextResponse.json(
        { error: 'Completa Conozcámonos 1 y Despega Cerebral antes de continuar.' },
        { status: 409 },
      )
    }

    const now = new Date().toISOString()
    const responses = objectValue(body.responses)
    const { data: existing, error: lookupError } = await supabase
      .from('canon_conozcamonos_2_responses')
      .select('id')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lookupError) {
      return NextResponse.json(
        { error: 'No pudimos verificar tus respuestas anteriores.' },
        { status: 500 },
      )
    }

    const { error: saveError } = existing
      ? await supabase
          .from('canon_conozcamonos_2_responses')
          .update({ responses, completed_at: now })
          .eq('id', existing.id)
      : await supabase.from('canon_conozcamonos_2_responses').insert({
          user_id: userId,
          responses,
          completed_at: now,
        })

    if (saveError) {
      console.error('[v0] C2 response persistence error:', saveError)
      return NextResponse.json(
        { error: 'No pudimos guardar tus respuestas.' },
        { status: 500 },
      )
    }

    const { error: profileError } = await supabase
      .from('despega_user_profiles')
      .upsert(
        {
          user_id: userId,
          conozcamonos_2_completed: true,
          onboarding_conozcamonos_2_completed: true,
          onboarding_conozcamonos_2_completed_at: now,
        },
        { onConflict: 'user_id' },
      )

    if (profileError) {
      console.error('[v0] C2 profile persistence error:', profileError)
      return NextResponse.json(
        { error: 'Las respuestas se guardaron, pero no pudimos cerrar Conozcámonos 2.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      nextPath: '/despega/a1-report',
    })
  } catch (error) {
    console.error('[v0] Complete C2 error:', error)
    return NextResponse.json(
      { error: 'No pudimos completar Conozcámonos 2.' },
      { status: 500 },
    )
  }
}
