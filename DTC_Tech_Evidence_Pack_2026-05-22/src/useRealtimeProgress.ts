'use client'

import { useEffect, useRef, useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { createClient } from '@/lib/supabase'

interface ProgressUpdate {
  userId: string
  phase: 'A1' | 'A2' | 'A3' | 'A4'
  percentage: number
  milestone?: string
  timestamp: Date
}

const fetcher = async (key: string) => {
  const response = await fetch(key)
  if (!response.ok) throw new Error('Failed to fetch progress')
  return response.json()
}

export function useRealtimeProgress(userId: string | null) {
  const supabase = createClient()
  const subscriptionRef = useRef<any>(null)

  const { data: progress, isLoading, error } = useSWR(
    userId ? `/api/progress/${userId}` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      dedupingInterval: 2000
    }
  )

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return

    const subscribe = async () => {
      subscriptionRef.current = supabase
        .channel(`user-progress-${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'despega_user_misiones',
            filter: `user_id=eq.${userId}`
          },
          async (payload) => {
            console.log('[v0] Real-time progress update:', payload)
            // Revalidate the progress data
            await mutate(`/api/progress/${userId}`)
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'despega_pilar_progress',
            filter: `user_id=eq.${userId}`
          },
          async (payload) => {
            console.log('[v0] Pilar progress update:', payload)
            await mutate(`/api/progress/${userId}`)
          }
        )
        .subscribe()
    }

    subscribe()

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current)
      }
    }
  }, [userId, supabase])

  const updateProgress = useCallback(
    async (update: Partial<ProgressUpdate>) => {
      if (!userId) return

      try {
        const response = await fetch(`/api/progress/${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        })

        if (!response.ok) throw new Error('Failed to update progress')
        
        const result = await response.json()
        console.log('[v0] Progress updated:', result)
        
        // Revalidate immediately
        await mutate(`/api/progress/${userId}`)
        
        return result
      } catch (error) {
        console.error('[v0] Error updating progress:', error)
        throw error
      }
    },
    [userId]
  )

  return {
    progress,
    isLoading,
    error,
    updateProgress,
    isSubscribed: !!subscriptionRef.current
  }
}
