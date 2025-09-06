"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

interface User {
  id: string
  email: string
  name: string
  role?: string
}

interface Session {
  user: User | null
  authenticated: boolean
}

interface SessionContextType {
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  demoLogin: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const {
          data: { session: supabaseSession },
        } = await supabase.auth.getSession()

        if (supabaseSession?.user) {
          setSession({
            user: {
              id: supabaseSession.user.id,
              email: supabaseSession.user.email || "",
              name: supabaseSession.user.user_metadata?.name || supabaseSession.user.email || "",
              role: supabaseSession.user.user_metadata?.role || "user",
            },
            authenticated: true,
          })
        } else {
          // Check for demo session
          const demoSession = localStorage.getItem("demo_session")
          if (demoSession) {
            const demoUser = JSON.parse(demoSession)
            setSession({
              user: demoUser,
              authenticated: true,
            })
          } else {
            setSession({ user: null, authenticated: false })
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
        setSession({ user: null, authenticated: false })
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, supabaseSession) => {
      if (supabaseSession?.user) {
        setSession({
          user: {
            id: supabaseSession.user.id,
            email: supabaseSession.user.email || "",
            name: supabaseSession.user.user_metadata?.name || supabaseSession.user.email || "",
            role: supabaseSession.user.user_metadata?.role || "user",
          },
          authenticated: true,
        })
      } else {
        // Check for demo session when auth session is null
        const demoSession = localStorage.getItem("demo_session")
        if (demoSession) {
          const demoUser = JSON.parse(demoSession)
          setSession({
            user: demoUser,
            authenticated: true,
          })
        } else {
          setSession({ user: null, authenticated: false })
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        setSession({
          user: {
            id: data.user.id,
            email: data.user.email || "",
            name: data.user.user_metadata?.name || data.user.email || "",
            role: data.user.user_metadata?.role || "user",
          },
          authenticated: true,
        })
        return { success: true }
      }

      return { success: false, error: "Error de autenticación" }
    } catch (error) {
      return { success: false, error: "Error inesperado" }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: "user",
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // For demo purposes, we'll consider signup successful even if email confirmation is required
        setSession({
          user: {
            id: data.user.id,
            email: data.user.email || "",
            name: name,
            role: "user",
          },
          authenticated: true,
        })
        return { success: true }
      }

      return { success: false, error: "Error al crear la cuenta" }
    } catch (error) {
      return { success: false, error: "Error inesperado" }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem("demo_session")
      setSession({ user: null, authenticated: false })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const demoLogin = async () => {
    const demoUser = {
      id: "demo-user-id",
      email: "demo@dtcplatform.com",
      name: "Usuario Demo",
      role: "demo",
    }

    localStorage.setItem("demo_session", JSON.stringify(demoUser))
    setSession({
      user: demoUser,
      authenticated: true,
    })
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        loading,
        signIn,
        signUp,
        signOut,
        demoLogin,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
