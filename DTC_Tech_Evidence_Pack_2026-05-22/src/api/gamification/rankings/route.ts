import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/gamification/rankings
 * 
 * Fetches user rankings with comprehensive gamification stats.
 * Supports filtering by score type and pagination.
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

    // Query params
    const searchParams = request.nextUrl.searchParams
    const scoreType = searchParams.get('scoreType') || 'total_xp'
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch rankings from despega_rankings table
    const { data: rankings, error: rankingsError } = await supabase
      .from('despega_rankings')
      .select(
        `id, user_id, score_general, score_a1_cerebral, score_a2_rutas, 
         score_camino_persona, score_camino_profesional, score_aterrizaje, 
         rank_general, total_dias_activos, streak_actual, 
         total_misiones_completadas, mejor_streak`
      )
      .order(scoreType === 'total_xp' ? 'score_general' : 'rank_general', { ascending: false })
      .range(offset, offset + limit - 1)

    if (rankingsError) {
      console.error('[v0] Error fetching rankings:', rankingsError)
      return NextResponse.json(
        { error: 'Failed to fetch rankings' },
        { status: 500 }
      )
    }

    // Enrich with user profile data
    const userIds = rankings.map(r => r.user_id)
    
    const { data: profiles, error: profilesError } = await supabase
      .from('users')
      .select('id, full_name, avatar_url, email')
      .in('id', userIds)

    if (profilesError) {
      console.error('[v0] Error fetching user profiles:', profilesError)
    }

    const profileMap = (profiles || []).reduce((acc: any, profile: any) => {
      acc[profile.id] = profile
      return acc
    }, {})

    // Get current user rank
    const { data: userRank, error: userRankError } = await supabase
      .from('despega_rankings')
      .select('rank_general')
      .eq('user_id', user.id)
      .single()

    if (userRankError) {
      console.warn('[v0] Could not fetch user rank:', userRankError)
    }

    const enrichedRankings = rankings.map((rank, index) => ({
      rank: offset + index + 1,
      user: profileMap[rank.user_id] || { id: rank.user_id, full_name: 'Unknown User' },
      scores: {
        general: rank.score_general,
        a1_cerebral: rank.score_a1_cerebral,
        a2_rutas: rank.score_a2_rutas,
        camino_persona: rank.score_camino_persona,
        camino_profesional: rank.score_camino_profesional,
        aterrizaje: rank.score_aterrizaje,
      },
      stats: {
        active_days: rank.total_dias_activos,
        current_streak: rank.streak_actual,
        best_streak: rank.mejor_streak,
        missions_completed: rank.total_misiones_completadas,
      },
      ranking: {
        general: rank.rank_general,
      }
    }))

    return NextResponse.json({
      success: true,
      rankings: enrichedRankings,
      pagination: {
        limit,
        offset,
        total: rankings.length === limit ? offset + limit : offset + rankings.length
      },
      current_user_rank: userRank?.rank_general || null
    })
  } catch (error) {
    console.error('[v0] Error in rankings API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rankings' },
      { status: 500 }
    )
  }
}
