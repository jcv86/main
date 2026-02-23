'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface A4StrategicScore {
  current_score: number
  trend: 'increasing' | 'stable' | 'decreasing'
  days_active: number
  last_activity: Date | null
  level: 'beginner' | 'intermediate' | 'advanced' | 'master'
}

export function useA4StrategicScore(userId: string | undefined) {
  const [score, setScore] = useState<A4StrategicScore | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const loadScore = async () => {
      try {
        // Get latest score with 7-day moving average
        const { data, error } = await supabase
          .from('a4_strategic_scores')
          .select('score, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(7)

        if (error) throw error

        if (!data || data.length === 0) {
          // First time - initialize at 50 (neutral)
          const initialScore = 50
          await supabase.from('a4_strategic_scores').insert({
            user_id: userId,
            current_score: initialScore,
            source: 'initialization',
          })

          setScore({
            current_score: initialScore,
            trend: 'stable',
            days_active: 0,
            last_activity: new Date(),
            level: 'beginner',
          })
        } else {
          // Calculate 7-day moving average
          const avg = data.reduce((sum, record) => sum + record.score, 0) / data.length
          const currentScore = data[0].score

          // Apply decay: -0.1% per day without activity
          const lastDate = new Date(data[0].created_at)
          const daysInactive = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
          const decayFactor = Math.pow(0.999, daysInactive)
          const adjustedScore = Math.max(0, currentScore * decayFactor)

          // Determine trend
          const previousScore = data.length > 1 ? data[1].score : currentScore
          const trend: 'increasing' | 'stable' | 'decreasing' =
            adjustedScore > previousScore + 2 ? 'increasing' : adjustedScore < previousScore - 2 ? 'decreasing' : 'stable'

          // Determine level
          const level: 'beginner' | 'intermediate' | 'advanced' | 'master' =
            adjustedScore < 30 ? 'beginner' : adjustedScore < 60 ? 'intermediate' : adjustedScore < 85 ? 'advanced' : 'master'

          setScore({
            current_score: Math.round(adjustedScore * 10) / 10,
            trend,
            days_active: data.length,
            last_activity: lastDate,
            level,
          })
        }
      } catch (error) {
        console.error('[v0] Error loading A4 strategic score:', error)
      } finally {
        setLoading(false)
      }
    }

    loadScore()
  }, [userId, supabase])

  const recordScore = async (sourceScore: number, source: 'radar' | 'quiz' | 'action_conversion') => {
    if (!userId) return

    try {
      const { error } = await supabase.from('a4_strategic_scores').insert({
        user_id: userId,
        current_score: sourceScore,
        source,
      })

      if (error) throw error

      // Reload score
      const { data } = await supabase
        .from('a4_strategic_scores')
        .select('score, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(7)

      if (data && data.length > 0) {
        const avg = data.reduce((sum, record) => sum + record.score, 0) / data.length
        setScore((prev) =>
          prev
            ? {
                ...prev,
                current_score: Math.round(avg * 10) / 10,
              }
            : null
        )
      }
    } catch (error) {
      console.error('[v0] Error recording A4 score:', error)
    }
  }

  return { score, loading, recordScore }
}
