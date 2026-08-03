import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import {
  checkA3ModuleAccess,
  getA3AccessDenialMessage,
} from '@/lib/a3-access-control'
import { extractCoachPracticeContext } from '@/lib/a3/coach-practice'

export async function GET() {
  const currentUser = await resolveServerUser()
  if (!currentUser) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const access = await checkA3ModuleAccess(
    currentUser.id,
    'coach-practice-room',
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

  const [cvResult, decoderResult, answersResult] = await Promise.all([
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
  ])

  if (cvResult.error || decoderResult.error || answersResult.error) {
    console.error('[v0] Coach practice context error:', {
      cv: cvResult.error,
      decoder: decoderResult.error,
      answers: answersResult.error,
    })
    return NextResponse.json(
      { error: 'No pudimos cargar el contexto verificado de la práctica.' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    context: extractCoachPracticeContext(
      cvResult.data?.deliverable,
      decoderResult.data?.deliverable,
      answersResult.data?.deliverable,
    ),
  })
}
