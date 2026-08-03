import { createClient as createServerClient } from '@/lib/supabase/server'
import { getCurrentUser } from './auth-helper'

/** Get Supabase server client. */
async function getSupabaseClient() {
  return await createServerClient()
}

export interface TrainingSession {
  user_id: string
  training_type: string
  level: 'basico' | 'intermedio' | 'avanzado'
  score: number
  time_spent_seconds: number
  questions_completed: number
  total_questions: number
  xp_earned: number
  points_earned: number
  rewards_earned: string[]
  started_at: string
  completed_at: string
  metadata?: Record<string, any>
}

export interface TrainingProgress {
  total_trainings: number
  total_time_spent: number
  average_score: number
  total_xp_earned: number
  total_points_earned: number
  total_rewards_earned: number
  consecutive_days: number
  best_score: number
  training_streak: number
  unlocked_badges: string[]
}

export async function saveTrainingSession(session: TrainingSession) {
  try {
    const supabase = await getSupabaseClient()
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const baseXP = Math.round((session.score / 100) * 100)
    const timeBonus = session.time_spent_seconds < 600 ? 25 : 0
    const completionBonus =
      session.questions_completed === session.total_questions ? 50 : 0
    const totalXP = baseXP + timeBonus + completionBonus
    const totalPoints = 100

    const rewards: string[] = []
    if (session.score >= 90) rewards.push('excellent_performance')
    if (session.score >= 80) rewards.push('strong_performance')
    if (session.time_spent_seconds < 300) rewards.push('speed_demon')
    if (session.questions_completed === session.total_questions) {
      rewards.push('completion_master')
    }
    if (session.level === 'avanzado' && session.score >= 85) {
      rewards.push('advanced_challenger')
    }

    const { data: existingCompletion } = await supabase
      .from('a3_training_module_completions')
      .select('*')
      .eq('user_id', user.id)
      .eq('training_type', session.training_type)
      .single()

    let xpToAward = totalXP
    let isFirstCompletion = true
    let completionId: string | null = null

    if (existingCompletion) {
      isFirstCompletion = false
      xpToAward = 0
      completionId = existingCompletion.id
    } else {
      const { data: newCompletion, error: insertError } = await supabase
        .from('a3_training_module_completions')
        .insert([
          {
            user_id: user.id,
            training_type: session.training_type,
            xp_amount: totalXP,
            xp_awarded_at: new Date().toISOString(),
            is_first_completion: true,
          },
        ])
        .select()

      if (insertError) {
        console.error('[v0] Error tracking completion:', insertError)
      } else if (newCompletion && newCompletion.length > 0) {
        completionId = newCompletion[0].id
      }
    }

    const { data, error } = await supabase
      .from('a3_training_sessions')
      .insert([
        {
          user_id: user.id,
          training_type: session.training_type,
          level: session.level,
          score: session.score,
          time_spent_seconds: session.time_spent_seconds,
          questions_completed: session.questions_completed,
          total_questions: session.total_questions,
          xp_earned: xpToAward,
          points_earned: totalPoints,
          rewards_earned: rewards,
          started_at: session.started_at,
          completed_at: session.completed_at,
          metadata: {
            ...session.metadata,
            is_first_completion: isFirstCompletion,
            completion_tracking_id: completionId,
          },
        },
      ])
      .select()

    if (error) throw error

    if (isFirstCompletion) {
      await updateGamificationProfile(
        user.id,
        xpToAward,
        totalPoints,
        rewards,
        session.score,
      )
    } else {
      await updateGamificationProfile(
        user.id,
        0,
        totalPoints,
        rewards,
        session.score,
      )
    }

    await trackTrainingAnalytics(
      user.id,
      session.training_type,
      session.level,
      session.score,
      isFirstCompletion,
    )

    return {
      success: true,
      data,
      xpEarned: xpToAward,
      pointsEarned: totalPoints,
      rewards,
      isFirstCompletion,
      message: isFirstCompletion
        ? `+${xpToAward} XP awarded for first completion!`
        : 'Great practice! No additional XP this time (you already earned XP for this module)',
    }
  } catch (error) {
    console.error('[v0] Error saving training session:', error)
    throw error
  }
}

export async function getUserTrainingProgress(): Promise<TrainingProgress> {
  try {
    const supabase = await getSupabaseClient()
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data: sessions, error } = await supabase
      .from('a3_training_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (error) throw error

    if (!sessions || sessions.length === 0) {
      return {
        total_trainings: 0,
        total_time_spent: 0,
        average_score: 0,
        total_xp_earned: 0,
        total_points_earned: 0,
        total_rewards_earned: 0,
        consecutive_days: 0,
        best_score: 0,
        training_streak: 0,
        unlocked_badges: [],
      }
    }

    const total_trainings = sessions.length
    const total_time_spent = sessions.reduce(
      (sum, item) => sum + (item.time_spent_seconds || 0),
      0,
    )
    const average_score = Math.round(
      sessions.reduce((sum, item) => sum + item.score, 0) / total_trainings,
    )
    const total_xp_earned = sessions.reduce(
      (sum, item) => sum + (item.xp_earned || 0),
      0,
    )
    const total_points_earned = sessions.reduce(
      (sum, item) => sum + (item.points_earned || 0),
      0,
    )
    const allRewards = sessions.flatMap((item) => item.rewards_earned || [])
    const uniqueRewards = Array.from(new Set(allRewards)) as string[]
    const streak = calculateStreak(sessions)
    const best_score = Math.max(...sessions.map((item) => item.score))

    return {
      total_trainings,
      total_time_spent,
      average_score,
      total_xp_earned,
      total_points_earned,
      total_rewards_earned: uniqueRewards.length,
      consecutive_days: streak,
      best_score,
      training_streak: streak,
      unlocked_badges: uniqueRewards,
    }
  } catch (error) {
    console.error('[v0] Error getting training progress:', error)
    throw error
  }
}

export async function getTrainingHistory(limit = 10, offset = 0) {
  try {
    const supabase = await getSupabaseClient()
    const user = await getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data: sessions, error, count } = await supabase
      .from('a3_training_sessions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return { sessions: sessions || [], total: count || 0 }
  } catch (error) {
    console.error('[v0] Error getting training history:', error)
    throw error
  }
}

async function updateGamificationProfile(
  userId: string,
  xpEarned: number,
  pointsEarned: number,
  rewards: string[],
  score: number,
) {
  try {
    const supabase = await getSupabaseClient()
    const { data: profile, error: fetchError } = await supabase
      .from('user_gamification_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

    const currentXP = profile?.total_xp || 0
    const newTotalXP = currentXP + xpEarned
    const newLevel = Math.floor(newTotalXP / 1000) + 1

    const { error: updateError } = await supabase
      .from('user_gamification_profile')
      .upsert([
        {
          user_id: userId,
          current_xp: newTotalXP % 1000,
          total_xp: newTotalXP,
          current_level: newLevel,
          best_interview_streak: Math.max(
            profile?.best_interview_streak || 0,
            1,
          ),
          total_interviews_completed:
            (profile?.total_interviews_completed || 0) + 1,
          updated_at: new Date().toISOString(),
        },
      ])

    if (updateError) {
      console.error('[v0] Error updating gamification profile:', updateError)
    }

    const { data: dtcBalance, error: fetchDTCError } = await supabase
      .from('user_dtc_balance')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchDTCError && fetchDTCError.code !== 'PGRST116') {
      throw fetchDTCError
    }

    const currentBalance = dtcBalance?.balance || 0
    const newBalance = currentBalance + pointsEarned

    const { error: updateDTCError } = await supabase
      .from('user_dtc_balance')
      .upsert([
        {
          user_id: userId,
          balance: newBalance,
          lifetime_earned:
            (dtcBalance?.lifetime_earned || 0) + pointsEarned,
          updated_at: new Date().toISOString(),
        },
      ])

    if (updateDTCError) {
      console.error('[v0] Error updating DTC balance:', updateDTCError)
    }

    void rewards
    void score
  } catch (error) {
    console.error('[v0] Error in updateGamificationProfile:', error)
  }
}

async function trackTrainingAnalytics(
  userId: string,
  trainingType: string,
  level: string,
  score: number,
  isFirstCompletion = true,
) {
  try {
    const supabase = await getSupabaseClient()
    await supabase.from('v1_analytics').insert([
      {
        user_id: userId,
        event_type: 'training_completed',
        stage: trainingType,
        metadata: {
          level,
          score,
          isFirstCompletion,
          timestamp: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      },
    ])
  } catch (error) {
    console.error('[v0] Error tracking analytics:', error)
  }
}

function calculateStreak(sessions: any[]): number {
  if (!sessions || sessions.length === 0) return 0

  let streak = 1
  let currentDate = new Date(sessions[0].completed_at)

  for (let index = 1; index < sessions.length; index += 1) {
    const previousDate = new Date(sessions[index].completed_at)
    const daysDiff = Math.floor(
      (currentDate.getTime() - previousDate.getTime()) /
        (1000 * 60 * 60 * 24),
    )

    if (daysDiff === 1) {
      streak += 1
      currentDate = previousDate
    } else if (daysDiff > 1) {
      break
    }
  }

  return streak
}

export function getAchievementBadges(rewards: string[]) {
  const badgeMap: Record<
    string,
    { label: string; icon: string; color: string }
  > = {
    excellent_performance: { label: '¡Excelente!', icon: '🏆', color: 'gold' },
    strong_performance: { label: 'Muy Bien', icon: '⭐', color: 'blue' },
    speed_demon: { label: 'Rápido', icon: '⚡', color: 'purple' },
    completion_master: { label: 'Maestro', icon: '✨', color: 'green' },
    advanced_challenger: { label: 'Campeón', icon: '👑', color: 'red' },
  }

  return rewards.map((reward) => badgeMap[reward]).filter(Boolean)
}
