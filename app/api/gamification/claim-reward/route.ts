import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/gamification/claim-reward
 * 
 * Claims XP and DTC rewards for completed routes
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

    const { routeId, xpAmount, dtcAmount } = await request.json()

    if (!routeId || xpAmount === undefined || dtcAmount === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update user gamification profile with XP
    const { data: profile, error: profileError } = await supabase
      .from('user_gamification_profile')
      .select('xp_a2_total, total_xp')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('[v0] Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const newA2XP = (profile.xp_a2_total || 0) + xpAmount
    const newTotalXP = (profile.total_xp || 0) + xpAmount

    const { error: updateProfileError } = await supabase
      .from('user_gamification_profile')
      .update({
        xp_a2_total: newA2XP,
        total_xp: newTotalXP,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    if (updateProfileError) {
      console.error('[v0] Error updating profile:', updateProfileError)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }

    // Update DTC balance
    const { data: dtcBalance, error: dtcError } = await supabase
      .from('user_dtc_balance')
      .select('balance, lifetime_earned')
      .eq('user_id', user.id)
      .single()

    if (!dtcError && dtcBalance) {
      const newBalance = (dtcBalance.balance || 0) + dtcAmount
      const newLifetimeEarned = (dtcBalance.lifetime_earned || 0) + dtcAmount

      await supabase
        .from('user_dtc_balance')
        .update({
          balance: newBalance,
          lifetime_earned: newLifetimeEarned,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
    }

    // Record transaction
    await supabase
      .from('dtc_transactions')
      .insert([{
        user_id: user.id,
        amount: dtcAmount,
        transaction_type: 'earn',
        description: `Route completion reward: ${routeId}`,
        metadata: { source: 'route_completion', route_id: routeId }
      }])

    // Log activity
    await supabase
      .from('achievements')
      .insert([{
        user_id: user.id,
        title: 'Route Reward Claimed',
        description: `Claimed ${xpAmount} XP and ${dtcAmount} DTC`,
        category: 'reward',
        earned_at: new Date().toISOString(),
      }])

    return NextResponse.json({
      success: true,
      xp_awarded: xpAmount,
      dtc_awarded: dtcAmount,
      new_total_xp: newTotalXP,
      message: 'Rewards claimed successfully!'
    })
  } catch (error) {
    console.error('[v0] Error claiming reward:', error)
    return NextResponse.json(
      { error: 'Failed to claim reward' },
      { status: 500 }
    )
  }
}
