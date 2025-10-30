"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import type { ReactNode } from "react"

interface User {
  id: string
  email: string
  name?: string
}

interface SessionContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionWrapperProps {
  children: ReactNode
}

export function SessionWrapper({ children }: SessionWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email,
          }
          console.log("[v0] Session loaded from Supabase Auth:", userData)
          setUser(userData)

          // Also save to localStorage for compatibility
          localStorage.setItem(
            "dtc_session",
            JSON.stringify({
              authenticated: true,
              user: userData,
              timestamp: Date.now(),
            }),
          )
          setIsLoading(false)
          return
        }

        // Fallback: Check local storage
        const localSession = localStorage.getItem("dtc_session")
        if (localSession) {
          const sessionData = JSON.parse(localSession)
          if (sessionData.authenticated && sessionData.user) {
            console.log("[v0] Session loaded from localStorage:", sessionData.user)
            setUser(sessionData.user)
          }
        }
      } catch (error) {
        console.error("Session check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.email,
        }
        console.log("[v0] Auth state changed:", userData)
        setUser(userData)
        localStorage.setItem(
          "dtc_session",
          JSON.stringify({
            authenticated: true,
            user: userData,
            timestamp: Date.now(),
          }),
        )
      } else {
        setUser(null)
        localStorage.removeItem("dtc_session")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log("[v0] Login attempt for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error.message)
        return false
      }

      if (!data.user) {
        console.log("[v0] No user returned from login")
        return false
      }

      const userData = {
        id: data.user.id,
        email: data.user.email || "",
        name: data.user.user_metadata?.full_name || data.user.email,
      }

      console.log("[v0] Login successful:", userData)
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
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      console.log("[v0] Signup attempt for:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        console.error("[v0] Signup error:", error.message)
        return false
      }

      if (!data.user) {
        console.log("[v0] No user returned from signup")
        return false
      }

      const userData = {
        id: data.user.id,
        email: data.user.email || "",
        name: name,
      }

      console.log("[v0] Signup successful:", userData)
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
    } catch (error) {
      console.error("Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    console.log("[v0] Logging out user:", user?.email)

    await supabase.auth.signOut()

    setUser(null)
    localStorage.removeItem("dtc_session")
  }

  return (
    <SessionContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)

  // Provide safe fallbacks during SSR
  if (typeof window === "undefined") {
    return {
      user: null,
      isLoading: true,
      login: async () => false,
      signup: async () => false,
      logout: () => {},
    }
  }

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionWrapper")
  }

  return context
}
