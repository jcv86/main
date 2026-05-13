import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get gamification data
    const { data: gamifData, error: gamifError } = await supabase
      .from('user_gamification')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (gamifError && gamifError.code !== 'PGRST116') throw gamifError

    // Get user journey progress for phase levels
    const { data: progressData } = await supabase
      .from('user_journey_progress')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get achievements
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id)

    // Calculate current level from total XP
    const totalXp = gamifData?.total_xp || 0
    const currentLevel = Math.floor(totalXp / 1000) + 1
    const xpInCurrentLevel = totalXp % 1000
    const xpToNextLevel = 1000 - xpInCurrentLevel

    // Get user rank
    const { data: rankData } = await supabase
      .rpc('get_user_weekly_rank', { user_id: user.id })

    // Calculate phase levels based on progress
    const phaseLevel: Record<string, number> = {
      'a1': Math.floor((progressData?.a1_progress || 0) / 25) + 1,
      'a2': Math.floor((progressData?.a2_progress || 0) / 25) + 1,
      'a3': Math.floor((progressData?.a3_progress || 0) / 25) + 1,
      'a4': Math.floor((progressData?.a4_progress || 0) / 25) + 1,
      'current': Math.floor((progressData?.a3_progress || 0) / 25) + 1,
    }

    // Calculate phase XP
    const phaseXp: Record<string, number> = {
      'a1': (progressData?.a1_progress || 0) * 5,
      'a2': (progressData?.a2_progress || 0) * 5,
      'a3': (progressData?.a3_progress || 0) * 5,
      'a4': (progressData?.a4_progress || 0) * 5,
      'current': (progressData?.a3_progress || 0) * 5,
    }

    // Check if user completed daily challenges today
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyChallenges } = await supabase
      .from('user_daily_challenges')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)

    const dailyChallengesCompleted = dailyChallenges?.filter(c => c.completed).length || 0

    // Check last activity
    const { data: lastActivity } = await supabase
      .from('user_activity_log')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    // Check if streak is still active (last activity within 24 hours)
    const lastActivityTime = lastActivity?.created_at ? new Date(lastActivity.created_at).getTime() : 0
    const isStreakActive = (Date.now() - lastActivityTime) < 86400000

    return NextResponse.json({
      daily_streak: gamifData?.daily_streak || 0,
      total_xp: totalXp,
      current_level: currentLevel,
      xp_to_next_level: xpToNextLevel,
      phase_level: phaseLevel,
      phase_xp: phaseXp,
      daily_challenges_completed: dailyChallengesCompleted,
      total_achievements: achievements?.length || 0,
      weekly_rank: rankData?.rank || 0,
      total_users: rankData?.total_users || 0,
      last_activity: lastActivity?.created_at || null,
      streak_active: isStreakActive,
    })
  } catch (error) {
    console.error('[v0] Gamification API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gamification data' },
      { status: 500 }
    )
  }
}
