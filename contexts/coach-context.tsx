'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

export interface CoachContextData {
  userId: string | null
  userName: string | null
  currentProgress: {
    actionsCompleted: number
    streak: number
    totalActions: number
    successRate: number
    sprintProgress: number
    currentMood: number
  }
  coachMessages: string[]
  isLoadingCoach: boolean
  updateProgress: () => Promise<void>
}

const CoachContext = createContext<CoachContextData | undefined>(undefined)

export function CoachProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [currentProgress, setCurrentProgress] = useState({
    actionsCompleted: 0,
    streak: 0,
    totalActions: 0,
    successRate: 0,
    sprintProgress: 0,
    currentMood: 3,
  })
  const [coachMessages, setCoachMessages] = useState<string[]>([
    'Bienvenido a tu transformación de 90 días',
  ])
  const [isLoadingCoach, setIsLoadingCoach] = useState(false)
  const [supabaseError, setSupabaseError] = useState<string | null>(null)

  // Create supabase client only on first render
  const supabaseRef = React.useRef<any>(null)

  useEffect(() => {
    try {
      supabaseRef.current = createClient()
    } catch (error) {
      console.error('[v0] Failed to initialize Supabase client:', error)
      setSupabaseError('Supabase configuration error')
    }
  }, [])

  // Initialize user and load progress
  useEffect(() => {
    const initCoach = async () => {
      try {
        if (!supabaseRef.current) {
          console.warn('[v0] Supabase client not initialized')
          return
        }

        const { data: { user }, error } = await supabaseRef.current.auth.getUser()
        
        if (error) {
          console.warn('[v0] User not authenticated:', error.message)
          return
        }

        if (!user) {
          console.warn('[v0] No user session found')
          return
        }

        setUserId(user.id)
        setUserName(user.email?.split('@')[0] || 'Usuario')

        console.log('[v0] Coach initialized for user:', user.id)

        // Load initial progress
        await loadProgress(user.id)
      } catch (error) {
        console.error('[v0] Coach init error:', error)
      }
    }

    // Wait for supabase to be ready
    const timer = setTimeout(() => {
      initCoach()
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const loadProgress = async (uid: string) => {
    try {
      setIsLoadingCoach(true)

      if (!supabaseRef.current) {
        console.warn('[v0] Supabase client not available')
        return
      }

      // Get user profile and stats
      const { data: profile } = await supabaseRef.current
        .from('despega_user_profiles')
        .select('*')
        .eq('user_id', uid)
        .single()

      // Get bitácora entries for stats
      const { data: bitacora } = await supabaseRef.current
        .from('a2_user_bitacora')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })

      // Get daily actions completed
      const { data: dailyActions } = await supabaseRef.current
        .from('a2_user_daily_actions')
        .select('*')
        .eq('user_id', uid)
        .eq('completada', true)

      // Calculate stats
      const actionsCompleted = dailyActions?.length || 0
      const totalActions = dailyActions?.length || 0
      const successRate = totalActions > 0 ? Math.round((actionsCompleted / totalActions) * 100) : 0
      const currentMood = bitacora?.[0]?.mood || 3
      const streak = calculateStreak(dailyActions || [])

      setCurrentProgress({
        actionsCompleted,
        streak,
        totalActions,
        successRate,
        sprintProgress: profile?.a2_sprint_progress || 0,
        currentMood,
      })

      // Generate coach message based on progress
      const message = generateCoachMessage(
        actionsCompleted,
        streak,
        successRate,
        currentMood,
        userName || 'Usuario'
      )
      setCoachMessages([message])

      // COACH OMNIPRESENTE: Obtener contexto completo de A1+A2+A3+A4
      console.log('[v0] Loading omnipresent coach context...')
      try {
        const contextResponse = await fetch(`/api/despega/get-coach-context?user_id=${uid}`)
        if (contextResponse.ok) {
          const contextData = await contextResponse.json()
          if (contextData.context && contextData.context.contexto_completo) {
            console.log('[v0] Coach context loaded:', contextData.context.contexto_completo)
            // El Coach ahora tiene acceso a contexto completo para sus mensajes personalizados
            // contexto_completo contiene: Perfil DISC + Misión A2 + Entrenamiento A3 + Foco A4
          }
        }
      } catch (error) {
        console.warn('[v0] Could not load coach context (non-critical):', error)
      }

      console.log('[v0] Coach progress loaded:', {
        actionsCompleted,
        streak,
        successRate,
        currentMood,
      })
    } catch (error) {
      console.error('[v0] Error loading coach progress:', error)
    } finally {
      setIsLoadingCoach(false)
    }
  }

  const updateProgress = async () => {
    if (!userId) return
    console.log('[v0] Coach updating progress...')
    await loadProgress(userId)
  }

  return (
    <CoachContext.Provider
      value={{
        userId,
        userName,
        currentProgress,
        coachMessages,
        isLoadingCoach,
        updateProgress,
      }}
    >
      {children}
    </CoachContext.Provider>
  )
}

export function useCoach() {
  const context = useContext(CoachContext)
  if (!context) {
    throw new Error('useCoach must be used within CoachProvider')
  }
  return context
}

// Helper functions
function calculateStreak(actions: any[]): number {
  if (actions.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < actions.length; i++) {
    const actionDate = new Date(actions[i].fecha_accion || actions[i].created_at)
    actionDate.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((today.getTime() - actionDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === i) {
      streak++
    } else {
      break
    }
  }

  return streak
}

function generateCoachMessage(
  completed: number,
  streak: number,
  successRate: number,
  mood: number,
  name: string
): string {
  const messages: string[] = []

  if (streak >= 5) {
    messages.push(`${name}, tu racha de ${streak} días es impresionante. La consistencia es tu superpoder.`)
  } else if (streak >= 3) {
    messages.push(`Llevas ${streak} días consecutivos. Momentum en movimiento.`)
  } else if (completed > 0) {
    messages.push(`Has completado ${completed} acciones. Cada paso cuenta.`)
  } else {
    messages.push('Tu transformación comienza con el primer paso. ¿Listo?')
  }

  if (successRate >= 80) {
    messages.push('Tu tasa de éxito es del ' + successRate + '%. Sigue así.')
  } else if (successRate >= 50) {
    messages.push('Progreso visible. Enfócate en la consistencia.')
  }

  if (mood >= 4) {
    messages.push('Tu energía está alta. Aprovecha este momento.')
  } else if (mood <= 2) {
    messages.push('Reconoce cómo te sientes. A veces el avance es lento.')
  }

  return messages.join(' ')
}
