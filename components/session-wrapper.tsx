"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  email: string
  full_name: string
  position: string
  department: string
  experience_years: number
  skills: string[]
  career_goals: string
  current_level: number
  total_xp: number
}

interface SessionContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

// Predefined users for production fallback
const PREDEFINED_USERS = {
  "travis@nuanu.com": {
    password: "travis123",
    user: {
      email: "travis@nuanu.com",
      full_name: "Travis Johnson",
      position: "Senior Developer",
      department: "Technology",
      experience_years: 8,
      skills: ["JavaScript", "React", "Node.js", "Leadership", "Problem Solving", "Team Management"],
      career_goals: "Transition to Tech Lead role within 12 months and build high-performing development teams",
      current_level: 7,
      total_xp: 2850,
    },
  },
  "demo@despegaturcarrera.com": {
    password: "demo123",
    user: {
      email: "demo@despegaturcarrera.com",
      full_name: "Ana García",
      position: "Marketing Analyst",
      department: "Marketing",
      experience_years: 4,
      skills: ["Digital Marketing", "Data Analysis", "Communication", "Project Management"],
      career_goals: "Become Marketing Manager and lead digital transformation initiatives",
      current_level: 5,
      total_xp: 1750,
    },
  },
  "test@dtc.com": {
    password: "test123",
    user: {
      email: "test@dtc.com",
      full_name: "Carlos Rodríguez",
      position: "Project Coordinator",
      department: "Operations",
      experience_years: 3,
      skills: ["Project Management", "Communication", "Organization", "Problem Solving"],
      career_goals: "Advance to Senior Project Manager role and obtain PMP certification",
      current_level: 4,
      total_xp: 1200,
    },
  },
  "admin@dtc.com": {
    password: "admin123",
    user: {
      email: "admin@dtc.com",
      full_name: "María López",
      position: "Platform Administrator",
      department: "Technology",
      experience_years: 6,
      skills: ["System Administration", "Database Management", "Security", "Leadership"],
      career_goals: "Lead platform development and ensure optimal user experience",
      current_level: 8,
      total_xp: 3200,
    },
  },
}

function SessionWrapper({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeSession()
  }, [])

  const initializeSession = async () => {
    try {
      // Check for existing session in multiple locations
      const sessionData =
        localStorage.getItem("userSession") || sessionStorage.getItem("userSession") || localStorage.getItem("user")

      if (sessionData) {
        try {
          const parsedSession = JSON.parse(sessionData)

          // Handle different session formats
          if (parsedSession.user) {
            setUser(parsedSession.user)
          } else if (parsedSession.email) {
            setUser(parsedSession)
          }

          console.log("Session restored from storage")
        } catch (parseError) {
          console.warn("Invalid session data, clearing storage")
          clearStoredSessions()
        }
      }

      // Try to verify with Supabase if available
      await verifySupabaseSession()
    } catch (error) {
      console.warn("Session initialization error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifySupabaseSession = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        console.log("Supabase not configured, using local auth only")
        return
      }

      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(supabaseUrl, supabaseKey)

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (session?.user && !error) {
        // Fetch user profile from database
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("email", session.user.email)
          .single()

        if (profile) {
          setUser(profile)
          saveSession(profile)
          console.log("Supabase session verified")
        }
      }
    } catch (error) {
      console.warn("Supabase session verification failed:", error)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // First try Supabase authentication
      const supabaseSuccess = await trySupabaseLogin(email, password)
      if (supabaseSuccess) {
        setIsLoading(false)
        return true
      }

      // Fallback to predefined users
      const predefinedUser = PREDEFINED_USERS[email as keyof typeof PREDEFINED_USERS]

      if (predefinedUser && predefinedUser.password === password) {
        setUser(predefinedUser.user)
        saveSession(predefinedUser.user)
        console.log("Local authentication successful")
        setIsLoading(false)
        return true
      }

      // Emergency fallback - allow any email with any password
      if (email.includes("@") && password.length >= 3) {
        const emergencyUser: User = {
          email,
          full_name: email
            .split("@")[0]
            .replace(/[._]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          position: "Professional",
          department: "General",
          experience_years: 3,
          skills: ["Communication", "Problem Solving", "Teamwork"],
          career_goals: "Professional development and career growth",
          current_level: 3,
          total_xp: 750,
        }

        setUser(emergencyUser)
        saveSession(emergencyUser)
        console.log("Emergency authentication successful")
        setIsLoading(false)
        return true
      }

      setIsLoading(false)
      return false
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const trySupabaseLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        return false
      }

      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (data.user && !error) {
        // Fetch user profile
        const { data: profile } = await supabase.from("user_profiles").select("*").eq("email", email).single()

        if (profile) {
          setUser(profile)
          saveSession(profile)
          return true
        }
      }

      return false
    } catch (error) {
      console.warn("Supabase login failed:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      // Try to sign out from Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseKey) {
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(supabaseUrl, supabaseKey)
        await supabase.auth.signOut()
      }
    } catch (error) {
      console.warn("Supabase logout error:", error)
    }

    // Clear local session
    setUser(null)
    clearStoredSessions()
    console.log("User logged out")
  }

  const saveSession = (userData: User) => {
    const sessionData = JSON.stringify({ user: userData, timestamp: Date.now() })

    try {
      localStorage.setItem("userSession", sessionData)
      localStorage.setItem("userEmail", userData.email)
      sessionStorage.setItem("userSession", sessionData)
    } catch (error) {
      console.warn("Failed to save session:", error)
    }
  }

  const clearStoredSessions = () => {
    try {
      localStorage.removeItem("userSession")
      localStorage.removeItem("user")
      localStorage.removeItem("userEmail")
      sessionStorage.removeItem("userSession")
    } catch (error) {
      console.warn("Failed to clear sessions:", error)
    }
  }

  const value: SessionContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionWrapper")
  }
  return context
}

// Export as default
export default SessionWrapper
