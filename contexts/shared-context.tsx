'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UserContext {
  a2_mission: string | null
  a2_current_sprint: string | null
  a2_goals: string[]
  a4_relevant_news: string[]
  a4_market_opportunities: string[]
  a4_skill_gaps: string[]
  user_profile: {
    strengths: string[]
    gaps: string[]
    preferred_industries: string[]
  } | null
}

interface SharedContextType {
  context: UserContext
  loading: boolean
  updateA2Mission: (mission: string) => Promise<void>
  updateA4Relevance: (news: string[], opportunities: string[]) => Promise<void>
  syncContext: () => Promise<void>
}

const SharedContext = createContext<SharedContextType | undefined>(undefined)

export function SharedContextProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const [context, setContext] = useState<UserContext>({
    a2_mission: null,
    a2_current_sprint: null,
    a2_goals: [],
    a4_relevant_news: [],
    a4_market_opportunities: [],
    a4_skill_gaps: [],
    user_profile: null,
  })
  const [loading, setLoading] = useState(true)

  const syncContext = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get A2 data (mission, sprint, goals)
      const { data: a2Data } = await supabase
        .from('despega_a2_missions')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Get A4 data (relevant news, market opportunities)
      const { data: a4Data } = await supabase
        .from('despega_a4_news_feed')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false })
        .limit(5)

      // Get user profile from A1 results
      const { data: profileData } = await supabase
        .from('despega_a1_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setContext(prev => ({
        ...prev,
        a2_mission: a2Data?.mision || null,
        a2_current_sprint: a2Data?.semana_actual || null,
        a2_goals: a2Data?.objetivos || [],
        a4_relevant_news: a4Data?.map((item: any) => item.titular) || [],
        user_profile: profileData ? {
          strengths: profileData.fortalezas || [],
          gaps: profileData.brechas || [],
          preferred_industries: profileData.industrias_preferidas || [],
        } : null,
      }))
    } catch (error) {
      console.error('Error syncing context:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateA2Mission = async (mission: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Update or insert mission
      await supabase.from('despega_a2_missions').upsert({
        user_id: user.id,
        user_email: user.email,
        mision: mission,
        updated_at: new Date().toISOString(),
      })

      setContext(prev => ({ ...prev, a2_mission: mission }))
    } catch (error) {
      console.error('Error updating A2 mission:', error)
    }
  }

  const updateA4Relevance = async (news: string[], opportunities: string[]) => {
    setContext(prev => ({
      ...prev,
      a4_relevant_news: news,
      a4_market_opportunities: opportunities,
    }))
  }

  useEffect(() => {
    syncContext()
  }, [])

  return (
    <SharedContext.Provider value={{ context, loading, updateA2Mission, updateA4Relevance, syncContext }}>
      {children}
    </SharedContext.Provider>
  )
}

export function useSharedContext() {
  const context = useContext(SharedContext)
  if (context === undefined) {
    throw new Error('useSharedContext must be used within SharedContextProvider')
  }
  return context
}
