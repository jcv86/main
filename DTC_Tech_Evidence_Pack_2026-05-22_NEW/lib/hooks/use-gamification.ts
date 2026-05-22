'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface GamificationData {
  user_id: string
  current_level: number
  current_xp: number
  xp_for_next_level: number
  current_streak: number
  longest_streak: number
  total_interviews: number
  average_score: number
  badges_earned: Badge[]
  recent_achievements: Achievement[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon_url: string
  earned_at: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface Achievement {
  id: string
  type: 'interview_completed' | 'streak_milestone' | 'level_up' | 'badge_earned' | 'score_milestone'
  title: string
  description: string
  xp_gained: number
  created_at: string
}

export function useGamification(userId?: string) {
  const [gamification, setGamification] = useState<GamificationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchGamificationData()
  }, [userId])

  const fetchGamificationData = async () => {
    try {
      const supabase = createClient()
      
      // Get user gamification profile
      const { data, error: fetchError } = await supabase
        .from('user_gamification_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (!data) {
        // Create default profile
        const defaultProfile = {
          user_id: userId,
          current_level: 1,
          current_xp: 0,
          xp_for_next_level: 100,
          current_streak: 0,
          longest_streak: 0,
          total_interviews: 0,
          average_score: 0
        }

        const { data: newProfile } = await supabase
          .from('user_gamification_profiles')
          .insert([defaultProfile])
          .select()
          .single()

        setGamification({
          ...newProfile,
          badges_earned: [],
          recent_achievements: []
        })
      } else {
        // Fetch badges and achievements
        const { data: badges } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', userId)
          .order('earned_at', { ascending: false })

        const { data: achievements } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5)

        setGamification({
          ...data,
          badges_earned: badges || [],
          recent_achievements: achievements || []
        })
      }
    } catch (err) {
      console.error('[v0] Error fetching gamification data:', err)
      setError(err instanceof Error ? err.message : 'Error loading gamification data')
    } finally {
      setLoading(false)
    }
  }

  const awardXP = async (amount: number, source: string) => {
    if (!userId || !gamification) return

    try {
      // Update XP
      const newXP = gamification.current_xp + amount
      let newLevel = gamification.current_level
      let newXPForNext = gamification.xp_for_next_level

      // Check level ups
      if (newXP >= gamification.xp_for_next_level) {
        newLevel += 1
        newXPForNext = Math.round(gamification.xp_for_next_level * 1.2)
      }

      const supabase = createClient()

      await supabase
        .from('user_gamification_profiles')
        .update({
          current_xp: newXP,
          current_level: newLevel,
          xp_for_next_level: newXPForNext
        })
        .eq('user_id', userId)

      // Log achievement
      await supabase
        .from('user_achievements')
        .insert([{
          user_id: userId,
          type: 'interview_completed',
          title: `Earned ${amount} XP`,
          description: `from ${source}`,
          xp_gained: amount
        }])

      setGamification({
        ...gamification,
        current_xp: newXP,
        current_level: newLevel,
        xp_for_next_level: newXPForNext
      })
    } catch (err) {
      console.error('[v0] Error awarding XP:', err)
    }
  }

  const updateStreak = async () => {
    if (!userId || !gamification) return

    try {
      const supabase = createClient()
      const today = new Date().toISOString().split('T')[0]

      // Check if already completed today
      const { data: todayInterview } = await supabase
        .from('interview_sessions')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .single()

      if (todayInterview) return // Already completed today

      const newStreak = gamification.current_streak + 1
      const newLongestStreak = Math.max(newStreak, gamification.longest_streak)

      await supabase
        .from('user_gamification_profiles')
        .update({
          current_streak: newStreak,
          longest_streak: newLongestStreak
        })
        .eq('user_id', userId)

      setGamification({
        ...gamification,
        current_streak: newStreak,
        longest_streak: newLongestStreak
      })
    } catch (err) {
      console.error('[v0] Error updating streak:', err)
    }
  }

  const awardBadge = async (badgeId: string, badgeData: Omit<Badge, 'earned_at'>) => {
    if (!userId) return

    try {
      const supabase = createClient()

      await supabase
        .from('user_badges')
        .insert([{
          user_id: userId,
          badge_id: badgeId,
          ...badgeData,
          earned_at: new Date().toISOString()
        }])

      // Refresh gamification data
      await fetchGamificationData()
    } catch (err) {
      console.error('[v0] Error awarding badge:', err)
    }
  }

  return {
    gamification,
    loading,
    error,
    awardXP,
    updateStreak,
    awardBadge,
    refresh: fetchGamificationData
  }
}
