import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      sessionId,
      interviewType,
      difficultyLevel,
      totalQuestions,
      timeSpentMinutes,
      overallScore,
      tipsFreeUsed,
      tipsPremiumUsed,
      dtcSpentThisSession
    } = await request.json()

    // Calculate XP earned (based on score and time)
    const baseXp = 100
    const scoreBonus = Math.floor((overallScore || 0) * 0.5)
    const timeBonus = timeSpentMinutes >= 15 ? 50 : Math.floor(timeSpentMinutes * 3)
    const xpEarned = baseXp + scoreBonus + timeBonus

    // Determine if streak should be maintained
    const yesterdayInterview = await supabase
      .from('interview_session_gamification')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
      .lte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const streakMaintained = !!yesterdayInterview.data

    // Save session gamification data
    const { data: sessionData, error: sessionError } = await supabase
      .from('interview_session_gamification')
      .insert([{
        user_id: userId,
        session_id: sessionId,
        interview_type: interviewType,
        difficulty_level: difficultyLevel,
        total_tips_used_free: tipsFreeUsed || 0,
        total_tips_used_premium: tipsPremiumUsed || 0,
        total_questions: totalQuestions,
        time_spent_minutes: timeSpentMinutes,
        overall_score: overallScore,
        tips_purchased_this_session: tipsPremiumUsed || 0,
        dtc_spent_this_session: dtcSpentThisSession || 0,
        xp_earned: xpEarned,
        streak_maintained: streakMaintained
      }])
      .select()

    if (sessionError) throw sessionError

    // Update gamification profile
    const { data: profile } = await supabase
      .from('user_gamification_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profile) {
      const newTotalXp = (profile.total_xp || 0) + xpEarned
      const newInterviewCount = (profile.total_interviews_completed || 0) + 1
      const newStreak = streakMaintained ? (profile.interview_streak || 0) + 1 : 1

      // Determine new level based on XP
      const newLevel = calculateLevel(newTotalXp)

      // Check for badges
      const unlockedBadges = checkBadgeUnlock({
        totalXp: newTotalXp,
        interviewCount: newInterviewCount,
        streak: newStreak,
        score: overallScore
      })

      const { error: profileError } = await supabase
        .from('user_gamification_profile')
        .update({
          current_level: newLevel,
          current_xp: newTotalXp % 500, // XP resets per level
          total_xp: newTotalXp,
          interview_streak: newStreak,
          best_interview_streak: Math.max(newStreak, profile.best_interview_streak || 0),
          total_interviews_completed: newInterviewCount,
          total_tips_earned_free: (profile.total_tips_earned_free || 0) + (tipsFreeUsed || 0),
          total_tips_earned_premium: (profile.total_tips_earned_premium || 0) + (tipsPremiumUsed || 0),
          badges: JSON.stringify([
            ...JSON.parse(profile.badges || '[]'),
            ...unlockedBadges
          ])
        })
        .eq('user_id', userId)

      if (profileError) throw profileError
    } else {
      // Create new profile
      await supabase
        .from('user_gamification_profile')
        .insert([{
          user_id: userId,
          current_level: calculateLevel(xpEarned),
          current_xp: xpEarned,
          total_xp: xpEarned,
          interview_streak: 1,
          best_interview_streak: 1,
          total_interviews_completed: 1,
          total_tips_earned_free: tipsFreeUsed || 0,
          total_tips_earned_premium: tipsPremiumUsed || 0
        }])
    }

    // Distribute free tips for next interview (3 per interview)
    await supabase
      .from('user_dtc_balance')
      .update({
        total_tips_earned_free: (profile?.total_tips_earned_free || 0) + 3
      })
      .eq('user_id', userId)

    return NextResponse.json({
      success: true,
      xpEarned,
      streakMaintained,
      sessionData: sessionData?.[0]
    })
  } catch (error) {
    console.error('Error tracking interview gamification:', error)
    return NextResponse.json(
      { error: 'Failed to track gamification' },
      { status: 500 }
    )
  }
}

function calculateLevel(totalXp: number): string {
  const levels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond']
  const levelThresholds = [0, 500, 1500, 3500, 7000]

  for (let i = levels.length - 1; i >= 0; i--) {
    if (totalXp >= levelThresholds[i]) {
      return levels[i]
    }
  }
  return 'Bronze'
}

function checkBadgeUnlock(metrics: {
  totalXp: number
  interviewCount: number
  streak: number
  score: number
}): string[] {
  const badges: string[] = []

  // Badge conditions
  if (metrics.interviewCount === 1) badges.push('First Interview')
  if (metrics.interviewCount === 5) badges.push('Interview Starter')
  if (metrics.interviewCount === 10) badges.push('Interview Master')
  if (metrics.interviewCount === 25) badges.push('Interview Legend')
  if (metrics.streak === 7) badges.push('Week Warrior')
  if (metrics.streak === 30) badges.push('Monthly Master')
  if (metrics.score >= 90) badges.push('Perfect Score')
  if (metrics.totalXp >= 500) badges.push('Bronze Graduate')
  if (metrics.totalXp >= 1500) badges.push('Silver Climber')
  if (metrics.totalXp >= 3500) badges.push('Gold Achiever')

  return badges
}
