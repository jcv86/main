import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/gamification/recalculate-rankings
 * 
 * Admin endpoint to recalculate all user rankings based on XP
 * Requires authentication
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (optional - can be removed or implemented with roles)
    // For now, only allow the system to call this

    // Fetch all user gamification profiles sorted by XP
    const { data: profiles, error: profilesError } = await supabase
      .from('user_gamification_profile')
      .select(
        `id, user_id, total_xp, xp_a1_total, xp_a2_total, xp_a3_total`
      )
      .order('total_xp', { ascending: false })

    if (profilesError) {
      throw new Error('Failed to fetch profiles')
    }

    // Calculate rankings and tiers
    const rankings = profiles.map((profile, index) => {
      const rank = index + 1
      let tier = 'Rising'

      if (rank <= 10) tier = 'Diamond'
      else if (rank <= 50) tier = 'Platinum'
      else if (rank <= 100) tier = 'Gold'
      else if (rank <= 500) tier = 'Silver'
      else if (rank <= 1000) tier = 'Bronze'

      return {
        user_id: profile.user_id,
        rank,
        tier,
        general_score: profile.total_xp,
        a1_score: profile.xp_a1_total,
        a2_score: profile.xp_a2_total,
        a3_score: profile.xp_a3_total,
        xp_a1: profile.xp_a1_total,
        xp_a2: profile.xp_a2_total,
        xp_a3: profile.xp_a3_total,
        last_rank_update: new Date().toISOString(),
      }
    })

    // Upsert rankings
    const { error: upsertError } = await supabase
      .from('user_rankings')
      .upsert(rankings, { onConflict: 'user_id' })

    if (upsertError) {
      throw new Error(`Failed to upsert rankings: ${upsertError.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Rankings recalculated successfully',
      total_users: rankings.length,
      sample_rankings: rankings.slice(0, 10),
    })
  } catch (error) {
    console.error('[v0] Error recalculating rankings:', error)
    return NextResponse.json(
      { error: 'Failed to recalculate rankings' },
      { status: 500 }
    )
  }
}
