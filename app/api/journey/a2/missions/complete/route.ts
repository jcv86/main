import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface CompleteMissionBody {
  missionId?: unknown
  evidence?: unknown
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  let body: CompleteMissionBody
  try {
    body = await request.json() as CompleteMissionBody
  } catch {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  if (typeof body.missionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(body.missionId)) {
    return NextResponse.json({ error: 'Misión inválida' }, { status: 400 })
  }

  const evidence = body.evidence && typeof body.evidence === 'object' && !Array.isArray(body.evidence)
    ? body.evidence
    : {}

  const { data, error } = await supabase.rpc('complete_a2_mission', {
    p_mission_id: body.missionId,
    p_evidence: evidence,
  })

  if (error) {
    const status = error.message.includes('day_locked') ? 409 : error.message.includes('mission_not_found') ? 404 : 500
    const message = status === 409
      ? 'Completa las tareas del día actual antes de avanzar.'
      : status === 404
        ? 'La misión no existe.'
        : 'No pudimos completar la misión.'
    return NextResponse.json({ error: message }, { status })
  }

  return NextResponse.json({ success: true, progression: data })
}
