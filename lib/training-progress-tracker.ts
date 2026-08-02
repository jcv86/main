'use client'

import { createClient } from '@/lib/supabase/client'
import type { TrainingSessionData } from '@/lib/types/training'

interface TrainingRewards {
  badges?: string[]
  achievements?: string[]
  [key: string]: unknown
}

interface CompletionResult {
  success: boolean
  xpAwarded: number
  pointsAwarded: number
  isFirstCompletion: boolean
  completionId?: string
}

export async function trackTrainingCompletion(
  session: TrainingSessionData,
): Promise<CompletionResult> {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const completionKey = `${session.training_type}_${session.level}`
    const { data: existingCompletion, error: completionError } = await supabase
      .from('training_completion_tracking')
      .select('*')
      .eq('user_id', user.id)
      .eq('completion_key', completionKey)
      .maybeSingle()

    if (completionError) {
      console.error('[v0] Error checking completion:', completionError)
    }

    const isFirstCompletion = !existingCompletion
    const baseXp = calculateXP(session.score, session.level)
    const xpToAward = isFirstCompletion ? baseXp : 0
    const totalPoints = calculatePoints(session.score, session.time_spent_seconds)
    const rewards = calculateRewards(session) as TrainingRewards

    let completionId: string | undefined

    if (existingCompletion) {
      const { error: updateError } = await supabase
        .from('training_completion_tracking')
        .update({
          completion_count: (existingCompletion.completion_count || 0) + 1,
          best_score: Math.max(existingCompletion.best_score || 0, session.score),
          last_completed_at: session.completed_at,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCompletion.id)

      if (updateError) {
        console.error('[v0] Error updating completion:', updateError)
      } else {
        completionId = existingCompletion.id
      }
    } else {
      const { data: newCompletion, error: insertError } = await supabase
        .from('training_completion_tracking')
        .insert([
          {
            user_id: user.id,
            completion_key: completionKey,
            training_type: session.training_type,
            level: session.level,
            completion_count: 1,
            best_score: session.score,
            first_completed_at: session.completed_at,
            last_completed_at: session.completed_at,
          },
        ])
        .select()

      if (insertError) {
        console.error('[v0] Error tracking completion:', insertError)
      } else if (newCompletion && newCompletion.length > 0) {
        completionId = newCompletion[0].id
      }
    }

    const { error } = await supabase
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
      xpAwarded: xpToAward,
      pointsAwarded: totalPoints,
      isFirstCompletion,
      completionId,
    }
  } catch (error) {
    console.error('[v0] Error tracking training completion:', error)
    throw error
  }
}

function calculateXP(score: number, level: string): number {
  const baseXP = 100
  const scoreMultiplier = score / 100
  const levelMultiplier =
    level === 'advanced' ? 1.5 : level === 'intermediate' ? 1.25 : 1

  return Math.round(baseXP * scoreMultiplier * levelMultiplier)
}

function calculatePoints(score: number, timeSpent: number): number {
  const scorePoints = Math.round(score * 10)
  const efficiencyBonus = timeSpent < 300 ? 100 : 0
  return scorePoints + efficiencyBonus
}

function calculateRewards(session: TrainingSessionData): TrainingRewards {
  const rewards: TrainingRewards = {}

  if (session.score >= 90) {
    rewards.badges = ['high_performer']
  }

  if (session.score === 100) {
    rewards.achievements = ['perfect_score']
  }

  return rewards
}

async function updateGamificationProfile(
  userId: string,
  xp: number,
  points: number,
  rewards: TrainingRewards,
  score: number,
) {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('user_gamification_profile')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  const currentBadges = Array.isArray(profile?.badges) ? profile.badges : []
  const nextBadges = Array.from(
    new Set([...currentBadges, ...(rewards.badges || [])]),
  )

  const payload = {
    user_id: userId,
    total_xp: (profile?.total_xp || 0) + xp,
    total_points: (profile?.total_points || 0) + points,
    badges: nextBadges,
    best_training_score: Math.max(profile?.best_training_score || 0, score),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('user_gamification_profile')
    .upsert(payload, { onConflict: 'user_id' })

  if (error) {
    console.error('[v0] Error updating gamification profile:', error)
  }
}

async function trackTrainingAnalytics(
  userId: string,
  trainingType: string,
  level: string,
  score: number,
  isFirstCompletion: boolean,
) {
  const supabase = createClient()
  const { error } = await supabase.from('training_analytics').insert({
    user_id: userId,
    training_type: trainingType,
    level,
    score,
    is_first_completion: isFirstCompletion,
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error('[v0] Error tracking training analytics:', error)
  }
}
