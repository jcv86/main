'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface BitacoraEntry {
  id: string
  user_id: string
  date: string
  type: 'daily' | 'weekly'
  title: string
  reflection: string
  insights: string[]
  mood: number // 1-5
  actionsTaken: number
  nextSteps: string
  created_at: string
  updated_at: string
}

export function useBitacora() {
  const [entries, setEntries] = useState<BitacoraEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  // Load entries from Supabase
  const loadEntries = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setError('No user found')
        return
      }

      const { data, error: queryError } = await supabase
        .from('a2_user_bitacora')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (queryError) throw queryError
      setEntries(data || [])
      setError(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Add new entry
  const addEntry = async (entry: Omit<BitacoraEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('No user found')

      const { data, error: insertError } = await supabase
        .from('a2_user_bitacora')
        .insert([
          {
            user_id: user.id,
            ...entry
          }
        ])
        .select()
        .single()

      if (insertError) throw insertError
      
      setEntries([data, ...entries])
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  // Update entry
  const updateEntry = async (id: string, updates: Partial<BitacoraEntry>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('a2_user_bitacora')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      
      setEntries(entries.map(e => e.id === id ? data : e))
      return data
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  // Delete entry
  const deleteEntry = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('a2_user_bitacora')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      
      setEntries(entries.filter(e => e.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }

  // Get stats
  const getStats = () => {
    const dailyEntries = entries.filter(e => e.type === 'daily')
    return {
      total: entries.length,
      dailyCount: dailyEntries.length,
      avgMood: dailyEntries.length 
        ? Math.round(dailyEntries.reduce((sum, e) => sum + e.mood, 0) / dailyEntries.length)
        : 0,
      totalActions: dailyEntries.reduce((sum, e) => sum + e.actionsTaken, 0)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  return {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    getStats,
    reload: loadEntries
  }
}
