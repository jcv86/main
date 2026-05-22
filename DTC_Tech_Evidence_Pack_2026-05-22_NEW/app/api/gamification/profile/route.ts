import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Initialize Supabase only if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json({
        profile: null,
        message: 'Database not configured'
      })
    }

    // Get gamification profile
    const { data: profile } = await supabase
      .from('user_gamification_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get DTC balance
    const { data: balance } = await supabase
      .from('user_dtc_balance')
      .select('*')
      .eq('user_id', userId)
      .single()

    // Get recent interviews
    const { data: recentInterviews } = await supabase
      .from('interview_session_gamification')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      success: true,
      profile: profile || {
        current_level: 'Bronze',
        current_xp: 0,
        total_xp: 0,
        interview_streak: 0,
        best_interview_streak: 0,
        total_interviews_completed: 0,
        total_tips_earned_free: 0,
        total_tips_earned_premium: 0,
        badges: []
      },
      balance: balance || { balance: 0, lifetime_earned: 0, lifetime_spent: 0 },
      recentInterviews: recentInterviews || []
    })
  } catch (error) {
    console.error('Error fetching gamification profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
