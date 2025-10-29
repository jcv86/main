"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
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

const VALID_USERS = {
  "travis@nuanu.com": {
    password: "travis123",
    name: "Travis Herrera",
    id: "64738eef-ee31-4da9-8270-9adfaa46c74b",
  },
  "demo@dtcfinal.com": {
    password: "demo123",
    name: "Demo User",
    id: "11111111-1111-1111-1111-111111111111",
  },
  "demo@example.com": {
    password: "demo123",
    name: "Usuario Demo",
    id: "550e8400-e29b-41d4-a716-446655440000",
  },
  "juanvial@gn.cl": {
    password: "juan123",
    name: "Juan Vial",
    id: "6a0d1e5a-c5ad-41e0-9d95-f9dabd266203",
  },
  "demo@careercoach.cl": {
    password: "demo123",
    name: "Demo Career Coach",
    id: "dd3c6c05-5e0a-4601-a47a-03b50d9adf43",
  },
  "joacocovavarruubias@gmail.com": {
    password: "joaco123",
    name: "Joaquín Covarrubias",
    id: "0af87597-ed1a-4416-9558-1f2adeac2113",
  },
  "joacocovarrubiaev@gmail.com": {
    password: "joaco123",
    name: "Joaquín Covarrubias V",
    id: "149d4995-8e0f-45c0-b452-30ab470bb942",
  },
}

async function getUserUuidFromDatabase(email: string): Promise<string | null> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return null
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

    const { data, error } = await supabase.from("users").select("id").eq("email", email).single()

    if (error || !data) {
      console.log("[v0] User not found in database:", email)
      return null
    }

    console.log("[v0] Found user UUID in database:", data.id)
    return data.id
  } catch (error) {
    console.error("[v0] Error fetching user UUID:", error)
    return null
  }
}

export function SessionWrapper({ children }: SessionWrapperProps) {
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
            console.log("[v0] Session loaded from localStorage:", sessionData.user)
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
            console.log("[v0] Session loaded from Supabase:", userData)
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
      console.log("[v0] Login attempt for:", email)

      const validUser = VALID_USERS[email as keyof typeof VALID_USERS]

      if (!validUser) {
        console.log("[v0] User not found:", email)
        return false
      }

      if (validUser.password !== password) {
        console.log("[v0] Invalid password for:", email)
        return false
      }

      const realUserId = await getUserUuidFromDatabase(email)

      const userData = {
        id: realUserId || validUser.id, // Fallback to mock ID if database query fails
        email: email,
        name: validUser.name,
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

      if (VALID_USERS[email as keyof typeof VALID_USERS]) {
        console.log("[v0] User already exists:", email)
        return false
      }

      // Simple demo signup - in production, use proper authentication
      if (email && password && name) {
        const userData = {
          id: `user-${Date.now()}`,
          email: email,
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
      }

      return false
    } catch (error) {
      console.error("Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("[v0] Logging out user:", user?.email)
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
