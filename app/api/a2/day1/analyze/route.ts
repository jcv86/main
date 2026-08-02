import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  analyzeA2Day1Submission,
  buildDay1PersistencePayload,
  type Day1Input,
} from '@/lib/a2/day1-scoring'

function asInput(value: unknown): Day1Input {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Day1Input)
    : {}
}

export async function POST(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    let input: Day1Input
    try {
      input = asInput(await request.json())
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const userId = currentUser.id
    const analysis = analyzeA2Day1Submission(userId, input)
    const now = new Date().toISOString()
    const supabase = createAdminClient()
    const payload = buildDay1PersistencePayload(userId, input, analysis, now)

    const { data: existing, error: lookupError } = await supabase
      .from('a2_day1_submissions')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (lookupError) {
      console.error('[v0] Error finding Day 1 submission:', lookupError)
      return NextResponse.json(
        { error: 'No pudimos guardar el análisis.' },
        { status: 500 },
      )
    }

    const { error: saveError } = existing
      ? await supabase
          .from('a2_day1_submissions')
          .update(payload)
          .eq('id', existing.id)
      : await supabase.from('a2_day1_submissions').insert({
          ...payload,
          created_at: now,
        })

    if (saveError) {
      console.error('[v0] Error saving Day 1 analysis:', saveError)
      return NextResponse.json(
        { error: 'No pudimos guardar el análisis.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, analysis })
  } catch (error) {
    console.error('[v0] Day 1 analysis error:', error)
    return NextResponse.json(
      { error: 'No pudimos analizar tu ruta.' },
      { status: 500 },
    )
  }
}
