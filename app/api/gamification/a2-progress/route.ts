import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/gamification/a2-progress
 *
 * Returns A2 progress for the verified current user. XP/DTC projections are
 * informational only and are never exposed as claimable rewards.
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const routeId = request.nextUrl.searchParams.get('routeId')
    if (!routeId) {
      return NextResponse.json({ error: 'routeId is required' }, { status: 400 })
    }

    const userId = currentUser.id
    const supabase = createAdminClient()

    const { data: routeProgress, error: routeError } = await supabase
      .from('a2_user_route_progress')
      .select(
        `id, route_id, porcentaje_completado, estado,
         a2_learning_routes(nombre)`,
      )
      .eq('user_id', userId)
      .eq('route_id', routeId)
      .single()

    if (routeError) {
      console.warn('[v0] No active route found:', routeError)
      return NextResponse.json({ error: 'No route progress found' }, { status: 404 })
    }

    const { data: missions, error: missionsError } = await supabase
      .from('a2_user_missions')
      .select('id, estado, progreso_porcentaje')
      .eq('user_id', userId)
      .eq('route_id', routeProgress.route_id)

    if (missionsError) {
      console.warn('[v0] Error fetching missions:', missionsError)
    }

    const completedMissions = (missions || []).filter(
      (mission) => mission.estado === 'completada',
    ).length
    const totalMissions = missions?.length || 0

    const { data: gamProfile, error: gamError } = await supabase
      .from('user_gamification_profile')
      .select('xp_a2_total, current_level')
      .eq('user_id', userId)
      .single()

    if (gamError) {
      console.warn('[v0] Error fetching gamification profile:', gamError)
    }

    const progressPercentage = Math.max(
      0,
      Math.min(100, routeProgress.porcentaje_completado || 0),
    )
    const estimatedXP = Math.round((progressPercentage / 100) * 5000)
    const estimatedDTC = Math.round((progressPercentage / 100) * 500)

    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('title, description, earned_at')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(5)

    if (achievementsError) {
      console.warn('[v0] Error fetching achievements:', achievementsError)
    }

    return NextResponse.json({
      success: true,
      route_name:
        (routeProgress?.a2_learning_routes as { nombre?: string } | null)?.nombre ||
        'Learning Route',
      progress_percentage: progressPercentage,
      missions_completed: completedMissions,
      total_missions: totalMissions,
      current_level: gamProfile?.current_level || 1,
      level_xp: gamProfile?.xp_a2_total || 0,
      // Kept for backwards-compatible UI rendering. No manual claim is allowed.
      xp_earned_this_route: 0,
      dtc_earned_this_route: 0,
      estimated_xp_at_completion: estimatedXP,
      estimated_dtc_at_completion: estimatedDTC,
      rewards_claimable: false,
      recent_milestones: (achievements || []).map((achievement) => ({
        name: achievement.title,
        description: achievement.description,
        xp_reward: 0,
        dtc_reward: 0,
        earned_at: achievement.earned_at,
      })),
      route_id: routeProgress.route_id,
    })
  } catch (error) {
    console.error('[v0] Error in A2 progress API:', error)
    return NextResponse.json({ error: 'Failed to fetch A2 progress' }, { status: 500 })
  }
}
