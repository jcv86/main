"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar: string
  profile: {
    position: string
    department: string
    experience_years: number
    career_goals: string[]
    skills: string[]
    level: number
    points: number
  }
}

interface SessionContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

// Test users for quick access - only demo user now
const testUsers: User[] = [
  {
    id: "demo-001",
    email: "demo@example.com",
    name: "Usuario Demo",
    role: "User",
    avatar: "/placeholder.svg?height=40&width=40",
    profile: {
      position: "Desarrollador Frontend",
      department: "Tecnología",
      experience_years: 3,
      career_goals: ["Liderazgo Técnico", "Especialización en UX", "Gestión de Equipos"],
      skills: ["JavaScript", "React", "CSS", "Comunicación", "Trabajo en Equipo"],
      level: 2,
      points: 1250,
    },
  },
]

async function checkExistingSession(): Promise<User | null> {
  try {
    // Check localStorage first
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("currentUser")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          if (userData && userData.id && userData.email) {
            return userData
          }
        } catch (parseError) {
          console.warn("Failed to parse stored user data:", parseError)
          localStorage.removeItem("currentUser")
        }
      }
    }

    // Try to dynamically import and use Supabase
    try {
      const { createClient } = await import("../lib/supabase")
      const supabase = createClient()

      if (supabase && supabase.auth && typeof supabase.auth.getSession === "function") {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.warn("Supabase session error:", error)
        }

        if (session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
            role: session.user.user_metadata?.role || "User",
            avatar: session.user.user_metadata?.avatar || "/placeholder.svg?height=40&width=40",
            profile: session.user.user_metadata?.profile || {
              position: "New User",
              department: "General",
              experience_years: 0,
              career_goals: ["Explore Platform"],
              skills: ["Learning"],
              level: 1,
              points: 0,
            },
          }

          // Store in localStorage for persistence
          if (typeof window !== "undefined") {
            localStorage.setItem("currentUser", JSON.stringify(userData))
          }

          return userData
        }
      }
    } catch (supabaseError) {
      console.warn("Supabase not available, using fallback:", supabaseError)
    }

    return null
  } catch (error) {
    console.error("Session check error:", error)
    return null
  }
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initializeSession = async () => {
      try {
        const existingUser = await checkExistingSession()
        if (mounted) {
          setUser(existingUser)
        }
      } catch (error) {
        console.error("Failed to initialize session:", error)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeSession()

    return () => {
      mounted = false
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      // Check test users first (only demo user now)
      const testUser = testUsers.find((u) => u.email === email)
      if (testUser && password) {
        setUser(testUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(testUser))
        }
        return { success: true }
      }

      // Try Supabase authentication
      try {
        const { createClient } = await import("../lib/supabase")
        const supabase = createClient()

        if (supabase && supabase.auth && typeof supabase.auth.signInWithPassword === "function") {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password })

          if (error) {
            return { success: false, error: error.message }
          }

          if (data.user) {
            const userData: User = {
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.name || email.split("@")[0],
              role: data.user.user_metadata?.role || "User",
              avatar: data.user.user_metadata?.avatar || "/placeholder.svg?height=40&width=40",
              profile: data.user.user_metadata?.profile || {
                position: "New User",
                department: "General",
                experience_years: 0,
                career_goals: ["Explore Platform"],
                skills: ["Learning"],
                level: 1,
                points: 0,
              },
            }

            setUser(userData)
            if (typeof window !== "undefined") {
              localStorage.setItem("currentUser", JSON.stringify(userData))
            }
            return { success: true }
          }
        }
      } catch (supabaseError) {
        console.warn("Supabase sign in failed, using mock auth:", supabaseError)
      }

      // Fallback: Mock authentication for any valid email/password
      if (email && password && email.includes("@")) {
        const mockUser: User = {
          id: Date.now().toString(),
          email: email,
          name: email.split("@")[0],
          role: "User",
          avatar: "/placeholder.svg?height=40&width=40",
          profile: {
            position: "New User",
            department: "General",
            experience_years: 0,
            career_goals: ["Explore Platform"],
            skills: ["Learning"],
            level: 1,
            points: 0,
          },
        }

        setUser(mockUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(mockUser))
        }
        return { success: true }
      }

      return { success: false, error: "Invalid credentials" }
    } catch (error) {
      console.error("Sign in error:", error)
      return { success: false, error: "Authentication failed" }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    email: string,
    password: string,
    name?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true)

      // Try Supabase signup
      try {
        const { createClient } = await import("../lib/supabase")
        const supabase = createClient()

        if (supabase && supabase.auth && typeof supabase.auth.signUp === "function") {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name || email.split("@")[0],
              },
            },
          })

          if (error) {
            return { success: false, error: error.message }
          }

          if (data.user) {
            const userData: User = {
              id: data.user.id,
              email: data.user.email || email,
              name: name || data.user.user_metadata?.name || email.split("@")[0],
              role: "User",
              avatar: "/placeholder.svg?height=40&width=40",
              profile: {
                position: "New User",
                department: "General",
                experience_years: 0,
                career_goals: ["Explore Platform"],
                skills: ["Learning"],
                level: 1,
                points: 0,
              },
            }

            setUser(userData)
            if (typeof window !== "undefined") {
              localStorage.setItem("currentUser", JSON.stringify(userData))
            }
            return { success: true }
          }
        }
      } catch (supabaseError) {
        console.warn("Supabase sign up failed, using mock auth:", supabaseError)
      }

      // Fallback: Mock signup for any valid email/password
      if (email && password && email.includes("@")) {
        const mockUser: User = {
          id: Date.now().toString(),
          email: email,
          name: name || email.split("@")[0],
          role: "User",
          avatar: "/placeholder.svg?height=40&width=40",
          profile: {
            position: "New User",
            department: "General",
            experience_years: 0,
            career_goals: ["Explore Platform"],
            skills: ["Learning"],
            level: 1,
            points: 0,
          },
        }

        setUser(mockUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("currentUser", JSON.stringify(mockUser))
        }
        return { success: true }
      }

      return { success: false, error: "Invalid signup data" }
    } catch (error) {
      console.error("Sign up error:", error)
      return { success: false, error: "Signup failed" }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      // Try Supabase signout
      try {
        const { createClient } = await import("../lib/supabase")
        const supabase = createClient()

        if (supabase && supabase.auth && typeof supabase.auth.signOut === "function") {
          await supabase.auth.signOut()
        }
      } catch (supabaseError) {
        console.warn("Supabase sign out failed:", supabaseError)
      }

      // Clear local state and storage
      setUser(null)
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentUser")
      }
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const contextValue: SessionContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    setUser,
  }

  return <SessionContext.Provider value={contextValue}>{children}</SessionContext.Provider>
}
