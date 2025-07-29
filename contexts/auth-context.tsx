"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase, isDemoMode } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isDemoMode: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        if (isDemoMode) {
          // Set demo user immediately
          const demoUser = {
            id: "demo-user-id",
            email: "demo@example.com",
            user_metadata: {
              first_name: "Demo",
              last_name: "User",
            },
          } as User

          const demoSession = {
            user: demoUser,
            access_token: "demo-token",
            refresh_token: "demo-refresh-token",
          } as Session

          setUser(demoUser)
          setSession(demoSession)
          setLoading(false)
          return
        }

        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      if (isDemoMode) {
        // In demo mode, always "succeed" with demo user
        const demoUser = {
          id: "demo-user-id",
          email: email,
          user_metadata: {
            first_name: "Demo",
            last_name: "User",
          },
        } as User

        const demoSession = {
          user: demoUser,
          access_token: "demo-token",
          refresh_token: "demo-refresh-token",
        } as Session

        setUser(demoUser)
        setSession(demoSession)
        return { error: null }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      if (isDemoMode) {
        // In demo mode, always "succeed" with demo user
        const demoUser = {
          id: "demo-user-id",
          email: email,
          user_metadata: {
            first_name: userData?.firstName || "Demo",
            last_name: userData?.lastName || "User",
          },
        } as User

        const demoSession = {
          user: demoUser,
          access_token: "demo-token",
          refresh_token: "demo-refresh-token",
        } as Session

        setUser(demoUser)
        setSession(demoSession)
        return { error: null }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      if (isDemoMode) {
        setUser(null)
        setSession(null)
        return
      }

      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    session,
    loading,
    isDemoMode,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
