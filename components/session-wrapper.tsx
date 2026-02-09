"use client"
import { createContext, useContext, useState, useEffect, useRef } from "react"
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
  const [isMounted, setIsMounted] = useState(false)
  const isUpdatingRef = useRef(false)
  const supabaseRef = useRef<any>(null)

  // Only initialize on client side
  useEffect(() => {
    setIsMounted(true)
    
    if (!supabaseRef.current) {
      try {
        supabaseRef.current = createClient()
      } catch (error) {
        console.error("[v0] Failed to initialize Supabase:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (!isMounted || !supabaseRef.current) return

    const supabase = supabaseRef.current
    
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.email,
          }
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("[v0] Session check error:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isUpdatingRef.current) return

      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || session.user.email,
        }
        setUser(userData)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [isMounted])

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabaseRef.current) return false
    
    try {
      setIsLoading(true)
      const { data, error } = await supabaseRef.current.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Login error:", error.message)
        return false
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.full_name || data.user.email,
        })
        return true
      }
      return false
    } catch (error) {
      console.error("[v0] Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    if (!supabaseRef.current) return false
    
    try {
      setIsLoading(true)
      const { data, error } = await supabaseRef.current.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      })

      if (error) {
        console.error("[v0] Signup error:", error.message)
        return false
      }

      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          name: name,
        })
        return true
      }
      return false
    } catch (error) {
      console.error("[v0] Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    if (supabaseRef.current) {
      supabaseRef.current.auth.signOut().catch((error: any) => {
        console.error("[v0] Logout error:", error)
      })
    }
    setUser(null)
  }

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <SessionContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)

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
