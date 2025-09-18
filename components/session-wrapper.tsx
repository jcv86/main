"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name?: string
}

interface SessionContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionWrapper({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate session check
    const checkSession = async () => {
      try {
        // For demo purposes, set a default user
        setUser({
          id: "demo-user",
          email: "demo@example.com",
          name: "Demo User",
        })
      } catch (error) {
        console.error("Session check failed:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate sign in
      setUser({
        id: "user-" + Date.now(),
        email,
        name: email.split("@")[0],
      })
    } catch (error) {
      console.error("Sign in failed:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      setUser(null)
    } catch (error) {
      console.error("Sign out failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return <SessionContext.Provider value={{ user, loading, signIn, signOut }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    // Return safe defaults during SSR
    if (typeof window === "undefined") {
      return {
        user: null,
        loading: true,
        signIn: async () => {},
        signOut: async () => {},
      }
    }
    throw new Error("useSession must be used within a SessionWrapper")
  }
  return context
}
