import { NextRequest, NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import { checkA4Access, getA4AccessDenialMessage } from '@/lib/a4/access-control'
import {
  validateDecisionInput,
  validateDecisionUpdate,
} from '@/lib/a4/strategic-radar'

const DECISION_COLUMNS = [
  'id',
  'signal_id',
  'decision',
  'rationale',
  'expected_evidence',
  'status',
  'review_on',
  'outcome',
  'reviewed_at',
  'created_at',
  'updated_at',
].join(',')

async function resolveA4Request() {
  const currentUser = await resolveServerUser()
  if (!currentUser) {
    return {
      response: NextResponse.json({ error: 'No autenticado' }, { status: 401 }),
      currentUser: null,
      supabase: null,
    }
  }

  const supabase = createAdminClient()
  const access = await checkA4Access(currentUser.id, supabase)
  if (!access.canAccess) {
    return {
      response: NextResponse.json(
        { error: getA4AccessDenialMessage(), code: access.reason },
        { status: 403 },
      ),
      currentUser: null,
      supabase: null,
    }
  }

  return { response: null, currentUser, supabase }
}

export async function GET() {
  try {
    const resolved = await resolveA4Request()
    if (resolved.response) return resolved.response

    const { data, error } = await resolved.supabase!
      .from('a4_decision_log')
      .select(DECISION_COLUMNS)
      .eq('user_id', resolved.currentUser!.id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('[v0] A4 decision list error:', error)
      return NextResponse.json(
        { error: 'No pudimos cargar la bitácora de decisiones.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, decisions: data ?? [] })
  } catch (error) {
    console.error('[v0] A4 decision GET error:', error)
    return NextResponse.json(
      { error: 'No pudimos cargar la bitácora de decisiones.' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const resolved = await resolveA4Request()
    if (resolved.response) return resolved.response

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const validation = validateDecisionInput(body)
    if (!validation.valid || !validation.value) {
      return NextResponse.json(
        {
          error: 'La decisión necesita un fundamento y una revisión verificables.',
          validation,
        },
        { status: 422 },
      )
    }

    const value = validation.value
    const { data: signal, error: signalError } = await resolved.supabase!
      .from('a4_verified_signals')
      .select('id,status')
      .eq('id', value.signalId)
      .eq('user_id', resolved.currentUser!.id)
      .maybeSingle()

    if (signalError) {
      console.error('[v0] A4 decision signal verification error:', signalError)
      return NextResponse.json(
        { error: 'No pudimos verificar la señal vinculada.' },
        { status: 500 },
      )
    }
    if (!signal || signal.status !== 'active') {
      return NextResponse.json(
        { error: 'La decisión debe vincularse a una señal activa de tu cuenta.' },
        { status: 422 },
      )
    }

    const { data, error } = await resolved.supabase!
      .from('a4_decision_log')
      .insert({
        user_id: resolved.currentUser!.id,
        signal_id: value.signalId,
        decision: value.decision,
        rationale: value.rationale,
        expected_evidence: value.expectedEvidence,
        status: value.status,
        review_on: value.reviewOn,
      })
      .select(DECISION_COLUMNS)
      .single()

    if (error || !data) {
      console.error('[v0] A4 decision insert error:', error)
      return NextResponse.json(
        { error: 'No pudimos guardar la decisión.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, decision: data }, { status: 201 })
  } catch (error) {
    console.error('[v0] A4 decision POST error:', error)
    return NextResponse.json(
      { error: 'No pudimos guardar la decisión.' },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const resolved = await resolveA4Request()
    if (resolved.response) return resolved.response

    let body: Record<string, unknown>
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const decisionId =
      typeof body.decisionId === 'string' ? body.decisionId.trim() : ''
    if (!decisionId) {
      return NextResponse.json(
        { error: 'La decisión no es válida.' },
        { status: 400 },
      )
    }

    const validation = validateDecisionUpdate(body)
    if (!validation.valid || !validation.value) {
      return NextResponse.json(
        { error: 'La actualización necesita más información.', validation },
        { status: 422 },
      )
    }

    const value = validation.value
    const { data, error } = await resolved.supabase!
      .from('a4_decision_log')
      .update({
        status: value.status,
        outcome: value.outcome,
        reviewed_at: value.status === 'reviewed' ? new Date().toISOString() : null,
      })
      .eq('id', decisionId)
      .eq('user_id', resolved.currentUser!.id)
      .select(DECISION_COLUMNS)
      .maybeSingle()

    if (error) {
      console.error('[v0] A4 decision update error:', error)
      return NextResponse.json(
        { error: 'No pudimos actualizar la decisión.' },
        { status: 500 },
      )
    }
    if (!data) {
      return NextResponse.json({ error: 'Decisión no encontrada.' }, { status: 404 })
    }

    return NextResponse.json({ success: true, decision: data })
  } catch (error) {
    console.error('[v0] A4 decision PATCH error:', error)
    return NextResponse.json(
      { error: 'No pudimos actualizar la decisión.' },
      { status: 500 },
    )
  }
}
