import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface A4Progress {
  pointsEarned: number
  testsCompleted: number
  resourcesUsed: number
  streak: number
  badges: string[]
}

export interface A4Test {
  id: string
  titulo: string
  categoria: string
  preguntas: string[]
  respuestas_usuario: string[]
  puntos_ganados: number
  badge_desbloqueado?: string
}

export function useA4Progress() {
  const [progress, setProgress] = useState<A4Progress>({
    pointsEarned: 0,
    testsCompleted: 0,
    resourcesUsed: 0,
    streak: 0,
    badges: [],
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  // Load user's A4 progress
  const loadProgress = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: stats } = await supabase
        .from('despega_pilar_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('pilar', 'a4')
        .single()

      if (stats) {
        setProgress({
          pointsEarned: stats.score || 0,
          testsCompleted: stats.ciclo_dia || 0,
          resourcesUsed: 0,
          streak: stats.ciclo_dia || 0,
          badges: [],
        })
      }
    } catch (error) {
      console.log('[v0] Error loading A4 progress:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Complete a test and earn points
  const completeTest = useCallback(async (test: A4Test) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Save test completion
      const { data: testRecord } = await supabase
        .from('a4_user_test_completion')
        .insert({
          user_id: user.id,
          test_id: test.id,
          respuestas: test.respuestas_usuario,
          puntos_ganados: test.puntos_ganados,
          completado_at: new Date(),
        })
        .select()
        .single()

      // Update progress
      const newProgress = {
        ...progress,
        pointsEarned: progress.pointsEarned + test.puntos_ganados,
        testsCompleted: progress.testsCompleted + 1,
      }

      // Check if badge was earned
      if (test.badge_desbloqueado) {
        newProgress.badges = [...progress.badges, test.badge_desbloqueado]
      }

      setProgress(newProgress)

      // Update database
      await supabase
        .from('despega_pilar_progress')
        .upsert({
          user_id: user.id,
          pilar: 'a4',
          score: newProgress.pointsEarned,
          ciclo_dia: newProgress.testsCompleted,
        })

      return testRecord
    } catch (error) {
      console.log('[v0] Error completing test:', error)
      throw error
    }
  }, [progress, supabase])

  // Save a resource
  const saveResource = useCallback(async (resourceId: string, resourceType: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from('a4_user_saved_resources')
        .insert({
          user_id: user.id,
          resource_id: resourceId,
          resource_type: resourceType,
          saved_at: new Date(),
        })

      setProgress(prev => ({
        ...prev,
        resourcesUsed: prev.resourcesUsed + 1,
      }))
    } catch (error) {
      console.log('[v0] Error saving resource:', error)
    }
  }, [supabase])

  return {
    progress,
    loading,
    loadProgress,
    completeTest,
    saveResource,
  }
}
