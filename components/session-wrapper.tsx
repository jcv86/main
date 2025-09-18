"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

interface User {
  id: string
  email: string
  name?: string
}

interface SessionContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        // Check local storage first
        const localSession = localStorage.getItem("dtc_session")
        if (localSession) {
          const sessionData = JSON.parse(localSession)
          if (sessionData.authenticated && sessionData.user) {
            setUser(sessionData.user)
            setIsLoading(false)
            return
          }
        }

        // Check Supabase session if available
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

          const {
            data: { user: supabaseUser },
          } = await supabase.auth.getUser()
          if (supabaseUser) {
            const userData = {
              id: supabaseUser.id,
              email: supabaseUser.email || "",
              name: supabaseUser.user_metadata?.name || supabaseUser.email,
            }
            setUser(userData)
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simple demo login - in production, use proper authentication
      if (email && password) {
        const userData = {
          id: "demo-user-id",
          email: email,
          name: email.split("@")[0],
        }

        setUser(userData)
        localStorage.setItem(
          "dtc_session",
          JSON.stringify({
            authenticated: true,
            user: userData,
            timestamp: Date.now(),
          }),
        )

        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("dtc_session")
  }

  return <SessionContext.Provider value={{ user, isLoading, login, logout }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)

  // Provide safe fallbacks during SSR
  if (typeof window === "undefined") {
    return {
      user: null,
      isLoading: true,
      login: async () => false,
      logout: () => {},
    }
  }

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionWrapper")
  }

  return context
}
