import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/gamification/streak
 * 
 * Fetches user's daily streak data and milestone progress
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

    // Update activity for today
    const today = new Date().toISOString().split('T')[0]

    const { data: profile, error: profileError } = await supabase
      .from('user_gamification_profile')
      .select('daily_streak, last_activity_date')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('[v0] Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const lastActivityDate = profile.last_activity_date
    const lastActivityDay = lastActivityDate
      ? new Date(lastActivityDate).toISOString().split('T')[0]
      : null
    const today_date = today

    let newStreak = profile.daily_streak || 0

    if (lastActivityDay !== today_date) {
      if (lastActivityDay === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]) {
        newStreak = (profile.daily_streak || 0) + 1
      } else {
        newStreak = 1
      }
    }

    // Update profile
    await supabase
      .from('user_gamification_profile')
      .update({
        daily_streak: newStreak,
        last_activity_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    // Fetch updated activity log for last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: activities } = await supabase
      .from('gamification_activity_log')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })

    const activityDates = new Set(
      activities
        ? activities.map((a) => new Date(a.created_at).toISOString().split('T')[0])
        : []
    )

    // Build 7-day activity log
    const activityLog = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      activityLog.push({
        date: dateStr,
        active: activityDates.has(dateStr),
      })
    }

    // Calculate next milestone
    const milestones = [3, 7, 14, 30, 60, 100]
    const nextMilestone =
      milestones.find((m) => m > newStreak) || 100
    const daysUntilMilestone = Math.max(0, nextMilestone - newStreak)

    return NextResponse.json({
      current_streak: newStreak,
      longest_streak: profile.daily_streak || 0,
      last_activity_date: today,
      next_milestone: nextMilestone,
      days_until_milestone: daysUntilMilestone,
      is_active_today: lastActivityDay === today_date,
      activity_log: activityLog,
    })
  } catch (error) {
    console.error('[v0] Error in streak API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streak' },
      { status: 500 }
    )
  }
}

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

    const { data: profile, error: profileError } = await supabase
      .from('user_gamification_profile')
      .select('daily_streak, last_activity_date')
      .eq('user_id', userId)
      .single()

    if (profileError) {
      console.error('[v0] Error fetching profile:', profileError)
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const today = new Date().toISOString().split('T')[0]
    const lastActivityDate = profile.last_activity_date
    const lastActivityDay = lastActivityDate
      ? new Date(lastActivityDate).toISOString().split('T')[0]
      : null

    // Fetch activity log for last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: activities } = await supabase
      .from('gamification_activity_log')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())

    const activityDates = new Set(
      activities
        ? activities.map((a) => new Date(a.created_at).toISOString().split('T')[0])
        : []
    )

    // Build activity log
    const activityLog = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      activityLog.push({
        date: dateStr,
        active: activityDates.has(dateStr),
      })
    }

    // Calculate next milestone
    const milestones = [3, 7, 14, 30, 60, 100]
    const currentStreak = profile.daily_streak || 0
    const nextMilestone = milestones.find((m) => m > currentStreak) || 100
    const daysUntilMilestone = Math.max(0, nextMilestone - currentStreak)

    return NextResponse.json({
      current_streak: currentStreak,
      longest_streak: currentStreak,
      last_activity_date: lastActivityDate || today,
      next_milestone: nextMilestone,
      days_until_milestone: daysUntilMilestone,
      is_active_today: lastActivityDay === today,
      activity_log: activityLog,
    })
  } catch (error) {
    console.error('[v0] Error in streak API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch streak' },
      { status: 500 }
    )
  }
}
