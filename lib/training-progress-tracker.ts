import { createClient } from '@supabase/supabase-js'
import { getCurrentUser } from './auth-helper'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

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

/**
 * Save a training session to the database
 */
export async function saveTrainingSession(session: TrainingSession) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Calculate XP based on score and time
    const baseXP = Math.round((session.score / 100) * 100)
    const timeBonus = session.time_spent_seconds < 600 ? 25 : 0 // 10 min bonus
    const completionBonus = session.questions_completed === session.total_questions ? 50 : 0
    const totalXP = baseXP + timeBonus + completionBonus

    // Calculate Points (fixed amount per completion)
    const pointsPerCompletion = 100
    const totalPoints = pointsPerCompletion

    // Determine rewards/achievements
    const rewards: string[] = []
    if (session.score >= 90) rewards.push('excellent_performance')
    if (session.score >= 80) rewards.push('strong_performance')
    if (session.time_spent_seconds < 300) rewards.push('speed_demon')
    if (session.questions_completed === session.total_questions) rewards.push('completion_master')
    if (session.level === 'avanzado' && session.score >= 85) rewards.push('advanced_challenger')

    // Check if this training module was already completed for XP purposes
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
      // User already completed this training - no XP awarded, but they can still practice
      isFirstCompletion = false
      xpToAward = 0
      completionId = existingCompletion.id
    } else {
      // First completion - award XP and track it
      const { data: newCompletion, error: insertError } = await supabase
        .from('a3_training_module_completions')
        .insert([
          {
            user_id: user.id,
            training_type: session.training_type,
            xp_amount: totalXP,
            xp_awarded_at: new Date().toISOString(),
            is_first_completion: true
          }
        ])
        .select()

      if (insertError) {
        console.error('[v0] Error tracking completion:', insertError)
      } else if (newCompletion && newCompletion.length > 0) {
        completionId = newCompletion[0].id
      }
    }

    // Insert training session record
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
            completion_tracking_id: completionId
          } || {}
        }
      ])
      .select()

    if (error) throw error

    // Update user gamification profile (XP only if first completion)
    if (isFirstCompletion) {
      await updateGamificationProfile(user.id, xpToAward, totalPoints, rewards, session.score)
    } else {
      // Still update points even on repeat, but don't add XP
      await updateGamificationProfile(user.id, 0, totalPoints, rewards, session.score)
    }

    // Track analytics
    await trackTrainingAnalytics(user.id, session.training_type, session.level, session.score, isFirstCompletion)

    return { 
      success: true, 
      xpEarned: xpToAward, 
      pointsEarned: totalPoints, 
      rewards,
      isFirstCompletion,
      message: isFirstCompletion 
        ? `+${xpToAward} XP awarded for first completion!` 
        : 'Great practice! No additional XP this time (you already earned XP for this module)'
    }
  } catch (error) {
    console.error('[v0] Error saving training session:', error)
    throw error
  }
}

/**
 * Get user's training progress summary
 */
export async function getUserTrainingProgress(): Promise<TrainingProgress> {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Get all training sessions for user
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
        unlocked_badges: []
      }
    }

    // Calculate progress metrics
    const total_trainings = sessions.length
    const total_time_spent = sessions.reduce((sum, s) => sum + (s.time_spent_seconds || 0), 0)
    const average_score = Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / total_trainings)
    const total_xp_earned = sessions.reduce((sum, s) => sum + (s.xp_earned || 0), 0)
    const total_points_earned = sessions.reduce((sum, s) => sum + (s.points_earned || 0), 0)
    
    // Get unique rewards
    const allRewards = sessions.flatMap(s => s.rewards_earned || [])
    const uniqueRewards = Array.from(new Set(allRewards))
    const total_rewards_earned = uniqueRewards.length

    // Calculate streak
    const streak = calculateStreak(sessions)
    
    // Get best score
    const best_score = Math.max(...sessions.map(s => s.score))

    return {
      total_trainings,
      total_time_spent,
      average_score,
      total_xp_earned,
      total_points_earned,
      total_rewards_earned,
      consecutive_days: streak,
      best_score,
      training_streak: streak,
      unlocked_badges: uniqueRewards
    }
  } catch (error) {
    console.error('[v0] Error getting training progress:', error)
    throw error
  }
}

/**
 * Get training history with pagination
 */
export async function getTrainingHistory(limit = 10, offset = 0) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

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

/**
 * Update user's gamification profile
 */
async function updateGamificationProfile(
  userId: string,
  xpEarned: number,
  pointsEarned: number,
  rewards: string[],
  score: number
) {
  try {
    // Get current profile
    const { data: profile, error: fetchError } = await supabase
      .from('user_gamification_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

    const currentXP = profile?.total_xp || 0
    const newTotalXP = currentXP + xpEarned
    const newLevel = Math.floor(newTotalXP / 1000) + 1

    // Update gamification profile with both XP and Points
    const { error: updateError } = await supabase
      .from('user_gamification_profile')
      .upsert([
        {
          user_id: userId,
          current_xp: newTotalXP % 1000,
          total_xp: newTotalXP,
          current_level: newLevel,
          best_interview_streak: Math.max(profile?.best_interview_streak || 0, 1),
          total_interviews_completed: (profile?.total_interviews_completed || 0) + 1,
          updated_at: new Date().toISOString()
        }
      ])

    if (updateError) console.error('[v0] Error updating gamification profile:', updateError)

    // Track points in a separate transaction/history if needed
    // (You may want to add a points_history table for audit trail)
    // For now, points are stored in user_dtc_balance table
    const { data: dtcBalance, error: fetchDTCError } = await supabase
      .from('user_dtc_balance')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchDTCError && fetchDTCError.code !== 'PGRST116') throw fetchDTCError

    const currentBalance = dtcBalance?.balance || 0
    const newBalance = currentBalance + pointsEarned

    const { error: updateDTCError } = await supabase
      .from('user_dtc_balance')
      .upsert([
        {
          user_id: userId,
          balance: newBalance,
          lifetime_earned: (dtcBalance?.lifetime_earned || 0) + pointsEarned,
          updated_at: new Date().toISOString()
        }
      ])

    if (updateDTCError) console.error('[v0] Error updating DTC balance:', updateDTCError)
  } catch (error) {
    console.error('[v0] Error in updateGamificationProfile:', error)
  }
}

/**
 * Track training analytics
 */
async function trackTrainingAnalytics(
  userId: string,
  trainingType: string,
  level: string,
  score: number,
  isFirstCompletion: boolean = true
) {
  try {
    await supabase
      .from('v1_analytics')
      .insert([
        {
          user_id: userId,
          event_type: 'training_completed',
          stage: trainingType,
          metadata: {
            level,
            score,
            isFirstCompletion,
            timestamp: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        }
      ])
  } catch (error) {
    console.error('[v0] Error tracking analytics:', error)
  }
}

/**
 * Calculate consecutive days streak
 */
function calculateStreak(sessions: any[]): number {
  if (!sessions || sessions.length === 0) return 0

  let streak = 1
  let currentDate = new Date(sessions[0].completed_at)

  for (let i = 1; i < sessions.length; i++) {
    const previousDate = new Date(sessions[i].completed_at)
    const daysDiff = Math.floor(
      (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysDiff === 1) {
      streak++
      currentDate = previousDate
    } else if (daysDiff > 1) {
      break
    }
  }

  return streak
}

/**
 * Get achievement badges
 */
export function getAchievementBadges(rewards: string[]) {
  const badgeMap: Record<string, { label: string; icon: string; color: string }> = {
    excellent_performance: { label: '¡Excelente!', icon: '🏆', color: 'gold' },
    strong_performance: { label: 'Muy Bien', icon: '⭐', color: 'blue' },
    speed_demon: { label: 'Rápido', icon: '⚡', color: 'purple' },
    completion_master: { label: 'Maestro', icon: '✨', color: 'green' },
    advanced_challenger: { label: 'Campeón', icon: '👑', color: 'red' }
  }

  return rewards.map(r => badgeMap[r]).filter(Boolean)
}
