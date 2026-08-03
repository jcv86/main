import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import {
  checkA3ModuleAccess,
  getA3AccessDenialMessage,
} from '@/lib/a3-access-control'
import { extractBasicInterviewContext } from '@/lib/a3/basic-interview-mission'

export async function GET() {
  const currentUser = await resolveServerUser()
  if (!currentUser) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const access = await checkA3ModuleAccess(
    currentUser.id,
    'basic-interview-mission',
    supabase,
  )
  if (!access.canAccess) {
    return NextResponse.json(
      {
        error: getA3AccessDenialMessage(access),
        access: {
          currentDay: access.currentDay,
          checkpointDay: access.checkpointDay,
          blockReasons: access.blockReasons,
        },
      },
      { status: 403 },
    )
  }

  const [cvResult, decoderResult, answersResult, simulationResult, difficultResult] =
    await Promise.all([
      supabase
        .from('a3_module_completion')
        .select('module_id, deliverable, completed_at')
        .eq('user_id', currentUser.id)
        .in('module_id', ['cv-builder-studio', 'module-3'])
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('a3_module_completion')
        .select('module_id, deliverable, completed_at')
        .eq('user_id', currentUser.id)
        .in('module_id', ['job-decoder', 'module-4'])
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('a3_module_completion')
        .select('module_id, deliverable, completed_at')
        .eq('user_id', currentUser.id)
        .in('module_id', ['answer-architecture', 'module-5'])
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('a3_module_completion')
        .select('module_id, deliverable, completed_at')
        .eq('user_id', currentUser.id)
        .in('module_id', ['first-recruiter-simulation', 'module-8'])
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('a3_module_completion')
        .select('module_id, deliverable, completed_at')
        .eq('user_id', currentUser.id)
        .in('module_id', ['risk-difficult-questions-lab', 'module-9'])
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

  if (
    cvResult.error ||
    decoderResult.error ||
    answersResult.error ||
    simulationResult.error ||
    difficultResult.error
  ) {
    console.error('[v0] Basic interview mission context error:', {
      cv: cvResult.error,
      decoder: decoderResult.error,
      answers: answersResult.error,
      simulation: simulationResult.error,
      difficult: difficultResult.error,
    })
    return NextResponse.json(
      { error: 'No pudimos cargar la evidencia verificada de la ruta.' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    context: extractBasicInterviewContext(
      cvResult.data?.deliverable,
      decoderResult.data?.deliverable,
      answersResult.data?.deliverable,
      simulationResult.data?.deliverable,
      difficultResult.data?.deliverable,
    ),
  })
}
