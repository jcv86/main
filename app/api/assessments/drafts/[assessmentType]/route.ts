import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isAssessmentType, validateAssessmentDraft } from '@/lib/assessment-drafts'

type RouteContext = { params: Promise<{ assessmentType: string }> }

const noStore = { 'Cache-Control': 'private, no-store' }

export async function GET(_request: NextRequest, context: RouteContext) {
  const { assessmentType } = await context.params
  if (!isAssessmentType(assessmentType)) return NextResponse.json({ error: 'Evaluación desconocida.' }, { status: 404, headers: noStore })
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401, headers: noStore })
  const { data, error } = await supabase.from('assessment_drafts').select('schema_version,current_question,answers,timings,updated_at,completed_at').eq('user_id', user.id).eq('assessment_type', assessmentType).maybeSingle()
  if (error) return NextResponse.json({ error: 'No pudimos recuperar tu avance.' }, { status: 503, headers: noStore })
  if (!data || data.completed_at) return NextResponse.json({ draft: null }, { headers: noStore })
  return NextResponse.json({ draft: { assessmentType, schemaVersion: data.schema_version, currentQuestion: data.current_question, answers: data.answers, timings: data.timings, updatedAt: data.updated_at, completedAt: data.completed_at } }, { headers: noStore })
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { assessmentType } = await context.params
  if (!isAssessmentType(assessmentType)) return NextResponse.json({ error: 'Evaluación desconocida.' }, { status: 404, headers: noStore })
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401, headers: noStore })
  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido.' }, { status: 400, headers: noStore }) }
  const validation = validateAssessmentDraft(assessmentType, body)
  if ('error' in validation) return NextResponse.json({ error: validation.error }, { status: 422, headers: noStore })
  const draft = validation.draft
  const { data, error } = await supabase.from('assessment_drafts').upsert({ user_id: user.id, assessment_type: assessmentType, schema_version: draft.schemaVersion, current_question: draft.currentQuestion, answers: draft.answers, timings: draft.timings, updated_at: new Date().toISOString(), completed_at: null }, { onConflict: 'user_id,assessment_type' }).select('updated_at').single()
  if (error) return NextResponse.json({ error: 'No pudimos guardar tu avance.' }, { status: 503, headers: noStore })
  return NextResponse.json({ saved: true, updatedAt: data.updated_at }, { headers: noStore })
}

export async function POST(_request: NextRequest, context: RouteContext) {
  const { assessmentType } = await context.params
  if (!isAssessmentType(assessmentType)) return NextResponse.json({ error: 'Evaluación desconocida.' }, { status: 404, headers: noStore })
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401, headers: noStore })
  const { error } = await supabase.from('assessment_drafts').update({ completed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('user_id', user.id).eq('assessment_type', assessmentType).is('completed_at', null)
  if (error) return NextResponse.json({ error: 'No pudimos cerrar el borrador.' }, { status: 503, headers: noStore })
  return NextResponse.json({ completed: true }, { headers: noStore })
}
