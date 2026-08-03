import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { createAdminClient } from '@/lib/supabase/server'
import {
  checkA3ModuleAccess,
  getA3AccessDenialMessage,
} from '@/lib/a3-access-control'
import { extractCommunicationGymContext } from '@/lib/a3/communication-gym'

export async function GET() {
  const currentUser = await resolveServerUser()
  if (!currentUser) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const access = await checkA3ModuleAccess(
    currentUser.id,
    'communication-gym',
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

  const [coachResult, decoderResult] = await Promise.all([
    supabase
      .from('a3_module_completion')
      .select('module_id, deliverable, completed_at')
      .eq('user_id', currentUser.id)
      .in('module_id', ['coach-practice-room', 'module-6'])
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
  ])

  if (coachResult.error || decoderResult.error) {
    console.error('[v0] Communication gym context error:', {
      coach: coachResult.error,
      decoder: decoderResult.error,
    })
    return NextResponse.json(
      { error: 'No pudimos cargar la práctica y la oferta verificadas.' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    success: true,
    context: extractCommunicationGymContext(
      coachResult.data?.deliverable,
      decoderResult.data?.deliverable,
    ),
  })
}
