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

interface SessionContextType {
  user: User | null
  loading: boolean
  signOut: () => void
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  loading: true,
  signOut: () => {},
})

export function useSession() {
  return useContext(SessionContext)
}

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // First check Supabase auth
        const {
          data: { session: supabaseSession },
        } = await supabase.auth.getSession()

        if (supabaseSession?.user) {
          setUser({
            id: supabaseSession.user.id,
            email: supabaseSession.user.email || "",
            name: supabaseSession.user.user_metadata?.name || supabaseSession.user.email || "",
            role: supabaseSession.user.user_metadata?.role || "user",
          })
        } else {
          // Check localStorage for demo session
          const session = localStorage.getItem("dtc_session")
          if (session) {
            try {
              const parsed = JSON.parse(session)
              if (parsed.authenticated && parsed.user) {
                setUser(parsed.user)
              }
            } catch (e) {
              console.error("Error parsing session:", e)
              localStorage.removeItem("dtc_session")
            }
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
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
        setUser({
          id: supabaseSession.user.id,
          email: supabaseSession.user.email || "",
          name: supabaseSession.user.user_metadata?.name || supabaseSession.user.email || "",
          role: supabaseSession.user.user_metadata?.role || "user",
        })
      } else {
        // Check localStorage for demo session when auth session is null
        const session = localStorage.getItem("dtc_session")
        if (session) {
          try {
            const parsed = JSON.parse(session)
            if (parsed.authenticated && parsed.user) {
              setUser(parsed.user)
            } else {
              setUser(null)
            }
          } catch (e) {
            console.error("Error parsing session:", e)
            localStorage.removeItem("dtc_session")
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem("dtc_session")
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("Sign out error:", error)
      // Force logout even if Supabase fails
      localStorage.removeItem("dtc_session")
      setUser(null)
      window.location.href = "/"
    }
  }

  return <SessionContext.Provider value={{ user, loading, signOut }}>{children}</SessionContext.Provider>
}
