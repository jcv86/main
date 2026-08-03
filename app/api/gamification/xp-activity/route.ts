import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Public XP writes remain disabled. Rewards are awarded only by the verified
 * activity endpoint that owns the underlying completion.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: 'Direct XP activity writes have been disabled',
      code: 'XP_ACTIVITY_WRITE_DEPRECATED',
      message: 'XP is awarded only by verified server-side activities.',
    },
    { status: 410 },
  )
}

/**
 * Read-only XP history derived from the active DTC tables. The historical
 * `xp_activity_logs` migration was never applied to the production project.
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rawLimit = Number.parseInt(request.nextUrl.searchParams.get('limit') || '50', 10)
    const limit = Number.isFinite(rawLimit) ? Math.max(1, Math.min(rawLimit, 100)) : 50
    const requestedSection = request.nextUrl.searchParams.get('section')
    const allowedSections = new Set(['A3', 'A4', 'INTERVIEW', 'BONUS'])
    const section =
      requestedSection && allowedSections.has(requestedSection) ? requestedSection : null

    const userId = currentUser.id
    const supabase = createAdminClient()

    const [coreResult, trainingResult, profileResult] = await Promise.all([
      supabase
        .from('a3_user_progress')
        .select('id, total_xp, completed_module_ids, created_at, updated_at')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('a3_training_module_completions')
        .select('id, training_type, xp_amount, is_first_completion, first_completion_at, created_at')
        .eq('user_id', userId),
      supabase
        .from('user_gamification_profile')
        .select('total_xp, updated_at')
        .eq('user_id', userId)
        .maybeSingle(),
    ])

    if (coreResult.error) {
      console.error('[v0] Error fetching core XP history:', coreResult.error)
    }
    if (trainingResult.error) {
      console.error('[v0] Error fetching training XP history:', trainingResult.error)
    }
    if (profileResult.error) {
      console.error('[v0] Error fetching interview XP history:', profileResult.error)
    }

    const trainingCompletions = trainingResult.data || []
    const trainingXp = trainingCompletions.reduce(
      (sum, completion) =>
        completion.is_first_completion === false
          ? sum
          : sum + Math.max(0, Number(completion.xp_amount) || 0),
      0,
    )
    const profileXp = Math.max(0, Number(profileResult.data?.total_xp) || 0)
    const interviewXp = Math.max(0, profileXp - trainingXp)

    const activities: Array<Record<string, unknown>> = []

    if (coreResult.data && Number(coreResult.data.total_xp) > 0) {
      activities.push({
        id: `core-${coreResult.data.id}`,
        user_id: userId,
        section: 'A3',
        activity_type: 'core_progress_total',
        xp_amount: Number(coreResult.data.total_xp),
        reference_id: coreResult.data.id,
        metadata: {
          completed_module_ids: coreResult.data.completed_module_ids || [],
          derived: true,
        },
        created_at: coreResult.data.updated_at || coreResult.data.created_at,
      })
    }

    trainingCompletions.forEach((completion) => {
      const xpAmount = Math.max(0, Number(completion.xp_amount) || 0)
      if (completion.is_first_completion === false || xpAmount === 0) return

      activities.push({
        id: completion.id,
        user_id: userId,
        section: 'A3',
        activity_type: 'training_completed',
        xp_amount: xpAmount,
        reference_id: completion.training_type,
        metadata: {
          training_type: completion.training_type,
          derived: true,
        },
        created_at: completion.first_completion_at || completion.created_at,
      })
    })

    if (interviewXp > 0) {
      activities.push({
        id: `interview-total-${userId}`,
        user_id: userId,
        section: 'INTERVIEW',
        activity_type: 'interview_xp_total',
        xp_amount: interviewXp,
        reference_id: null,
        metadata: { derived: true },
        created_at: profileResult.data?.updated_at || new Date(0).toISOString(),
      })
    }

    const filtered = section
      ? activities.filter((activity) => activity.section === section)
      : activities

    filtered.sort((left, right) => {
      const leftTime = new Date(String(left.created_at || 0)).getTime()
      const rightTime = new Date(String(right.created_at || 0)).getTime()
      return rightTime - leftTime
    })

    return NextResponse.json({ activities: filtered.slice(0, limit), derived: true })
  } catch (error) {
    console.error('[v0] Error in xp-activity GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
