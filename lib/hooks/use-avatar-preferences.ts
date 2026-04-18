'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AvatarPreferences {
  user_avatar_id?: string // Legacy field, kept for backwards compatibility
  user_avatar_url?: string | null // User's profile photo URL
  user_avatar_source?: string // 'profile' | 'camera' | 'google' | 'linkedin'
  interviewer_avatar_id: string
}

export function useAvatarPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<AvatarPreferences>({
    user_avatar_id: 'professional-1', // Kept for backwards compatibility
    user_avatar_url: null,
    user_avatar_source: 'profile',
    interviewer_avatar_id: 'interviewer-classic-1'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchPreferences = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from('avatar_preferences')
          .select('user_avatar_id, user_avatar_url, user_avatar_source, interviewer_avatar_id')
          .eq('user_id', userId)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError
        }

        if (data) {
          setPreferences({
            user_avatar_id: data.user_avatar_id,
            user_avatar_url: data.user_avatar_url,
            user_avatar_source: data.user_avatar_source,
            interviewer_avatar_id: data.interviewer_avatar_id
          })
        }
      } catch (err) {
        console.error('[v0] Error fetching avatar preferences:', err)
        setError(err instanceof Error ? err.message : 'Error loading preferences')
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [userId])

  const updatePreferences = async (updates: Partial<AvatarPreferences>) => {
    if (!userId) return

    try {
      const supabase = createClient()
      const newPreferences = { ...preferences, ...updates }

      // Try to update first
      const { error: updateError } = await supabase
        .from('avatar_preferences')
        .update(newPreferences)
        .eq('user_id', userId)

      // If no rows updated, insert
      if (updateError?.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('avatar_preferences')
          .insert({
            user_id: userId,
            ...newPreferences
          })

        if (insertError) throw insertError
      } else if (updateError) {
        throw updateError
      }

      setPreferences(newPreferences)
    } catch (err) {
      console.error('[v0] Error updating avatar preferences:', err)
      setError(err instanceof Error ? err.message : 'Error saving preferences')
    }
  }

  return {
    preferences,
    loading,
    error,
    updatePreferences
  }
}
