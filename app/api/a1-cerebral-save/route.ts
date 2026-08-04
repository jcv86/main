import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { executeCommand } from '@/lib/dtc-agentos/commands/execute-command'
import { validateAndScoreDiscResponses } from '@/lib/a1/disc-scoring'

const CLIENT_OWNED_FIELDS = [
  'user_id',
  'questions',
  'disc_profile',
  'dominant_pattern',
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeResponseTimings(value: unknown) {
  if (!Array.isArray(value)) return []

  const seen = new Set<number>()
  const timings: Array<{
    questionId: number
    responseTime: number
  }> = []

  for (const item of value.slice(0, 28)) {
    if (!isRecord(item)) continue
    const questionId = Number(item.questionId)
    const responseTime = Number(item.responseTime)
    if (!Number.isInteger(questionId) || questionId < 1 || questionId > 28) continue
    if (!Number.isFinite(responseTime) || responseTime < 0 || responseTime > 3_600) continue
    if (seen.has(questionId)) continue

    seen.add(questionId)
    timings.push({ questionId, responseTime: Math.round(responseTime) })
  }

  return timings
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Debes iniciar sesión para guardar la evaluación.' },
        { status: 401 },
      )
    }

    let payload: unknown
    try {
      payload = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'La solicitud no contiene JSON válido.' },
        { status: 400 },
      )
    }

    if (!isRecord(payload)) {
      return NextResponse.json(
        { error: 'La solicitud debe ser un objeto.' },
        { status: 400 },
      )
    }

    const forbiddenField = CLIENT_OWNED_FIELDS.find((field) => field in payload)
    if (forbiddenField) {
      return NextResponse.json(
        {
          error: `El campo ${forbiddenField} es calculado o resuelto por el servidor.`,
          code: 'client_owned_a1_field_rejected',
        },
        { status: 400 },
      )
    }

    const scoring = validateAndScoreDiscResponses(payload.responses)
    if (!scoring.valid || !scoring.value) {
      return NextResponse.json(
        {
          error: 'Las respuestas del cuestionario no son válidas.',
          code: 'invalid_disc_responses',
          details: scoring.errors.slice(0, 8),
        },
        { status: 422 },
      )
    }

    const responseTimings = normalizeResponseTimings(payload.response_timings)
    const completedAt = new Date().toISOString()

    const { data: existingUser, error: userLookupError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (userLookupError) {
      console.error('[a1] Failed to inspect public.users record:', userLookupError)
      return NextResponse.json(
        { error: 'No pudimos verificar tu perfil.' },
        { status: 500 },
      )
    }

    if (!existingUser) {
      const { error: userInsertError } = await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        full_name:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || null,
        created_at: completedAt,
        updated_at: completedAt,
      })

      if (userInsertError && userInsertError.code !== '23505') {
        console.error('[a1] Failed to create public.users record:', userInsertError)
        return NextResponse.json(
          { error: 'No pudimos preparar tu perfil.' },
          { status: 500 },
        )
      }
    }

    const correlationId = crypto.randomUUID()
    const { data, error: saveError } = await supabase.rpc(
      'save_a1_cerebral_with_career_identity',
      {
        p_responses: scoring.value.responses,
        p_questions: scoring.value.questions,
        p_disc_profile: scoring.value.scores,
        p_dominant_pattern: scoring.value.dominantPattern,
        p_secondary_pattern: scoring.value.secondaryPattern,
        p_correlation_id: correlationId,
      },
    )

    if (saveError) {
      console.error('[a1] Atomic assessment dual-write failed:', saveError)
      return NextResponse.json(
        { error: 'No pudimos guardar la evaluación.' },
        { status: 500 },
      )
    }

    const saved = Array.isArray(data) ? data[0] : data
    const assessmentId = saved?.assessment_id

    if (!assessmentId) {
      console.error('[a1] Dual-write returned no assessment id', { correlationId })
      return NextResponse.json(
        { error: 'No pudimos confirmar la evaluación guardada.' },
        { status: 500 },
      )
    }

    try {
      const memoryResult = await executeCommand({
        userId: user.id,
        commandId: '/dtc:a1-identity-audit',
        agentId: 'coach',
        modeId: 'identity-audit',
        params: {
          testId: assessmentId,
          responses: scoring.value.responses,
          discProfile: scoring.value.scores,
          dominantPattern: scoring.value.dominantPattern,
          secondaryPattern: scoring.value.secondaryPattern,
          responseTimings,
          correlationId,
        },
      })

      if (!memoryResult.success) {
        console.error('[a1] Failed to capture supplemental A1 memory:', memoryResult.error)
      }
    } catch (memoryError) {
      // AgentOS memory remains supplemental. The canonical A1 assessment and
      // Career Identity evidence were already committed atomically by the RPC.
      console.error('[a1] Exception capturing supplemental A1 memory:', memoryError)
    }

    return NextResponse.json(
      {
        success: true,
        assessmentId,
        profile: scoring.value.scores,
        dominantPattern: scoring.value.dominantPattern,
        secondaryPattern: scoring.value.secondaryPattern,
        careerIdentityVersion: saved?.identity_version,
        correlationId,
      },
      {
        headers: { 'Cache-Control': 'private, no-store' },
      },
    )
  } catch (error) {
    console.error('[a1] Unexpected A1 assessment error:', error)
    return NextResponse.json(
      { error: 'No pudimos procesar la evaluación.' },
      { status: 500 },
    )
  }
}
