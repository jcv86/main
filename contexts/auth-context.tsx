"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, isDemoMode } from "@/lib/supabase"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const isDemo = isDemoMode()

  useEffect(() => {
    const initAuth = async () => {
      if (isDemo) {
        // Demo mode - check localStorage
        try {
          const savedUser = localStorage.getItem("demo_user")
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser)
            setUser(parsedUser)
          }
        } catch (error) {
          console.error("Error parsing saved demo user:", error)
          localStorage.removeItem("demo_user")
        }
        setLoading(false)
        return
      }

      // Supabase mode
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Session error:", error.message)
          setLoading(false)
          return
        }

        if (session?.user) {
          const supabaseUser = session.user
          const appUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "Usuario",
            email: supabaseUser.email || "",
            avatar:
              supabaseUser.user_metadata?.avatar_url ||
              `/placeholder.svg?height=40&width=40&text=${(supabaseUser.user_metadata?.name || "U").charAt(0).toUpperCase()}`,
          }
          setUser(appUser)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    if (!isDemo) {
      // Listen for auth changes in Supabase mode
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const supabaseUser = session.user
          const appUser: User = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "Usuario",
            email: supabaseUser.email || "",
            avatar:
              supabaseUser.user_metadata?.avatar_url ||
              `/placeholder.svg?height=40&width=40&text=${(supabaseUser.user_metadata?.name || "U").charAt(0).toUpperCase()}`,
          }
          setUser(appUser)
        } else {
          setUser(null)
        }
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    }
  }, [isDemo])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      if (isDemo) {
        // Demo mode authentication - accept any credentials
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Create demo user based on input
        const demoUser: User = {
          id: "demo-user-" + Date.now(),
          name: email.split("@")[0] || "Usuario Demo",
          email: email,
          avatar: `/placeholder.svg?height=40&width=40&text=${email.charAt(0).toUpperCase()}`,
        }

        setUser(demoUser)
        localStorage.setItem("demo_user", JSON.stringify(demoUser))
        return true
      }

      // Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error.message)
        return false
      }

      return !!data.user
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      if (isDemo) {
        // Demo mode registration
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const demoUser: User = {
          id: "demo-user-" + Date.now(),
          name,
          email,
          avatar: `/placeholder.svg?height=40&width=40&text=${name.charAt(0).toUpperCase()}`,
        }

        setUser(demoUser)
        localStorage.setItem("demo_user", JSON.stringify(demoUser))
        return true
      }

      // Supabase registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        console.error("Registration error:", error.message)
        return false
      }

      return !!data.user
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      if (isDemo) {
        setUser(null)
        localStorage.removeItem("demo_user")
      } else {
        await supabase.auth.signOut()
        setUser(null)
      }
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isDemo }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
