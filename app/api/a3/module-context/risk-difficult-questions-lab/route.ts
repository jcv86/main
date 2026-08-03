import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import {
  checkA3ModuleAccess,
  getA3AccessDenialMessage,
} from '@/lib/a3-access-control'
import { extractDifficultQuestionsContext } from '@/lib/a3/difficult-questions'

export async function GET() {
  const currentUser = await resolveServerUser()
  if (!currentUser) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const access = await checkA3ModuleAccess(
    currentUser.id,
    'risk-difficult-questions-lab',
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

  const [cvResult, decoderResult, simulationResult] = await Promise.all([
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
      .in('module_id', ['first-recruiter-simulation', 'module-8'])
      .order('completed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (cvResult.error || decoderResult.error || simulationResult.error) {
    console.error('[v0] Difficult questions context error:', {
      cv: cvResult.error,
      decoder: decoderResult.error,
      simulation: simulationResult.error,
    })
    return NextResponse.json(
      { error: 'No pudimos cargar el CV, la oferta y la simulación verificadas.' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    context: extractDifficultQuestionsContext(
      cvResult.data?.deliverable,
      decoderResult.data?.deliverable,
      simulationResult.data?.deliverable,
    ),
  })
}
