'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

interface User {
  id: string
  email: string
  name?: string
  image?: string
}

interface SessionContextType {
  user: User | null
  isLoading: boolean
  session: Session | null
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionWrapperProps {
  children: ReactNode
}

export function SessionWrapper({ children }: SessionWrapperProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Skip if supabase client is not available
    if (!supabase) {
      console.log('[v0] Supabase client not available')
      setIsLoading(false)
      return
    }

    // Flag to track if this component is mounted
    let isMounted = true
    let unsubscribe: (() => void) | null = null

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (isMounted) {
          setSession(session)
        }
      } catch (error) {
        console.error('[v0] Error getting session:', error)
        if (isMounted) setSession(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (isMounted) {
          setSession(newSession)
          setIsLoading(false)
        }
      }
    )
    unsubscribe = subscription?.unsubscribe || null

    // Cleanup function
    return () => {
      isMounted = false
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [supabase])

  // Transform Supabase session to our User interface
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || undefined,
        image: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || undefined,
      }
    : null

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setSession(null)
  }

  return (
    <SessionContext.Provider value={{ user, isLoading, session, signOut }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)

  if (context === undefined) {
    throw new Error('useSession must be used within a SessionWrapper')
  }

  return context
}
