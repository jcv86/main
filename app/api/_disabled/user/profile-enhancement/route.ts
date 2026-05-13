import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/user/profile-enhancement
 * 
 * Fetches enhanced profile data including gamification stats and DTC coins
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
    const userId = searchParams.get('userId') || user.id

    // Fetch user profile
    const { data: userProfile, error: userError } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email')
      .eq('id', userId)
      .single()

    if (userError) {
      console.warn('[v0] Error fetching user profile:', userError)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Fetch gamification profile
    const { data: gamProfile, error: gamError } = await supabase
      .from('user_gamification_profile')
      .select(
        'total_xp, current_level, daily_streak, xp_a1_total, xp_a2_total, xp_a3_total'
      )
      .eq('user_id', userId)
      .single()

    if (gamError) {
      console.warn('[v0] Error fetching gamification profile:', gamError)
    }

    // Fetch ranking
    const { data: ranking, error: rankError } = await supabase
      .from('user_rankings')
      .select('rank, tier, xp_a1, xp_a2, xp_a3')
      .eq('user_id', userId)
      .single()

    if (rankError) {
      console.warn('[v0] Error fetching ranking:', rankError)
    }

    // Fetch DTC balance
    const { data: dtcBalance, error: dtcError } = await supabase
      .from('user_dtc_balance')
      .select('balance, lifetime_earned, lifetime_spent')
      .eq('user_id', userId)
      .single()

    if (dtcError) {
      console.warn('[v0] Error fetching DTC balance:', dtcError)
    }

    // Fetch achievements
    const { data: achievements, error: achError } = await supabase
      .from('achievements')
      .select('title, earned_at')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false })
      .limit(20)

    if (achError) {
      console.warn('[v0] Error fetching achievements:', achError)
    }

    // Get mission count
    const { count: missionsCount, error: missionsError } = await supabase
      .from('a3_user_missions')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'completed')

    if (missionsError) {
      console.warn('[v0] Error counting missions:', missionsError)
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userProfile.id,
        full_name: userProfile.full_name || 'User',
        avatar_url: userProfile.avatar_url,
        email: userProfile.email,
      },
      gamification: {
        total_xp: gamProfile?.total_xp || 0,
        current_level: gamProfile?.current_level || 1,
        daily_streak: gamProfile?.daily_streak || 0,
        missions_completed: missionsCount || 0,
        lifetime_earned_dtc: dtcBalance?.lifetime_earned || 0,
      },
      ranking: {
        rank: ranking?.rank || 999999,
        tier: ranking?.tier || 'Rising',
        xp_a1: ranking?.xp_a1 || 0,
        xp_a2: ranking?.xp_a2 || 0,
        xp_a3: ranking?.xp_a3 || 0,
      },
      dtc: {
        balance: dtcBalance?.balance || 0,
        lifetime_earned: dtcBalance?.lifetime_earned || 0,
        lifetime_spent: dtcBalance?.lifetime_spent || 0,
      },
      achievements: (achievements || []).map((ach) => ({
        title: ach.title,
        earned_at: ach.earned_at,
      })),
    })
  } catch (error) {
    console.error('[v0] Error in profile enhancement API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
