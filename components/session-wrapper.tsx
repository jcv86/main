"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"

interface User {
  id: string
  email: string
  name: string
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
        const {
          data: { session: supabaseSession },
        } = await supabase.auth.getSession()

        if (supabaseSession?.user) {
          setUser({
            id: supabaseSession.user.id,
            email: supabaseSession.user.email || "",
            name: supabaseSession.user.user_metadata?.name || supabaseSession.user.email || "",
          })
        } else {
          const session = localStorage.getItem("dtc_session")
          if (session) {
            const parsed = JSON.parse(session)
            if (parsed.authenticated && parsed.user) {
              setUser(parsed.user)
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
        })
      } else {
        const session = localStorage.getItem("dtc_session")
        if (session) {
          const parsed = JSON.parse(session)
          if (parsed.authenticated && parsed.user) {
            setUser(parsed.user)
          }
        } else {
          setUser(null)
        }
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = () => {
    supabase.auth.signOut()
    localStorage.removeItem("dtc_session")
    setUser(null)
    window.location.href = "/"
  }

  return <SessionContext.Provider value={{ user, loading, signOut }}>{children}</SessionContext.Provider>
}
