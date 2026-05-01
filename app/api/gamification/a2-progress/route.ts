import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/gamification/a2-progress
 * 
 * Fetches gamification progress for A2 routes including XP, DTC, and milestones
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const routeId = searchParams.get('routeId')
    const userId = searchParams.get('userId') || user.id

    // Fetch A2 route progress
    const { data: routeProgress, error: routeError } = await supabase
      .from('a2_user_route_progress')
      .select(
        `id, route_id, porcentaje_completado, estado, 
         a2_learning_routes!inner(nombre)`
      )
      .eq('user_id', userId)
      .eq('route_id', routeId || null)
      .single()

    if (routeError) {
      console.warn('[v0] No active route found:', routeError)
      return NextResponse.json(
        { error: 'No route progress found' },
        { status: 404 }
      )
    }

    // Get mission data
    const { data: missions, error: missionsError } = await supabase
      .from('a2_user_missions')
      .select('id, estado, progreso_porcentaje')
      .eq('user_id', userId)
      .eq('route_id', routeProgress.route_id)

    if (missionsError) {
      console.warn('[v0] Error fetching missions:', missionsError)
    }

    const completedMissions = (missions || []).filter((m) => m.estado === 'completada').length
    const totalMissions = missions?.length || 0

    // Get user gamification profile for XP tracking
    const { data: gamProfile, error: gamError } = await supabase
      .from('user_gamification_profile')
      .select('xp_a2_total, current_level')
      .eq('user_id', userId)
      .single()

    if (gamError) {
      console.warn('[v0] Error fetching gamification profile:', gamError)
    }

    // Calculate estimated XP/DTC earnings based on progress
    const progressPercentage = routeProgress.porcentaje_completado || 0
    const baseXPPerRoute = 5000 // Base XP for completing a full route
    const baseDTCPerRoute = 500 // Base DTC for completing a full route

    const estimatedXP = Math.round((progressPercentage / 100) * baseXPPerRoute)
    const estimatedDTC = Math.round((progressPercentage / 100) * baseDTCPerRoute)

    // Get recent achievements/milestones for this route
    const { data: achievements, error: achError } = await supabase
      .from('achievements')
      .select('title, description, earned_at')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(5)

    if (achError) {
      console.warn('[v0] Error fetching achievements:', achError)
    }

    return NextResponse.json({
      success: true,
      route_name: routeProgress.a2_learning_routes?.nombre || 'Learning Route',
      progress_percentage: progressPercentage,
      missions_completed: completedMissions,
      total_missions: totalMissions,
      current_level: gamProfile?.current_level || 1,
      level_xp: gamProfile?.xp_a2_total || 0,
      xp_earned_this_route: estimatedXP,
      dtc_earned_this_route: estimatedDTC,
      recent_milestones: (achievements || []).map((ach) => ({
        name: ach.title,
        description: ach.description,
        xp_reward: 100, // Base reward, could be dynamic
        dtc_reward: 50,
        earned_at: ach.earned_at,
      })),
      route_id: routeProgress.route_id,
      user_id: userId,
    })
  } catch (error) {
    console.error('[v0] Error in A2 progress API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch A2 progress' },
      { status: 500 }
    )
  }
}
