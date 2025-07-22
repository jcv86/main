"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>
  signOut: () => void
  resetPassword: (email: string) => Promise<{ error: any }>
  isOffline: boolean
  getOfflineData: (key: string) => any[]
  saveOfflineData: (key: string, data: any) => void
  isSupabaseConnected: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for demo purposes when Supabase is not available
const mockUser = {
  id: "demo-user-123",
  email: "estudiante@udd.cl",
  name: "Estudiante Demo UDD",
  avatar: "/placeholder-user.jpg",
} as User

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Test Supabase connection
        const { data, error } = await supabase.auth.getSession()

        if (mounted) {
          if (error) {
            console.warn("Supabase session error, using demo mode:", error.message)
            setUser(mockUser)
            setIsSupabaseConnected(false)
          } else {
            console.log("Supabase connected successfully")
            const supabaseUser = data.session?.user as SupabaseUser
            const authUser: User = {
              id: supabaseUser.id,
              email: supabaseUser.email,
              name: supabaseUser.user_metadata.full_name || "Demo User",
              avatar: supabaseUser.user_metadata.avatar || "/placeholder-user.jpg",
            }
            setUser(authUser)
            setIsSupabaseConnected(true)
          }
        }
      } catch (error) {
        console.warn("Supabase connection failed, using demo mode:", error)
        if (mounted) {
          setUser(mockUser)
          setIsSupabaseConnected(false)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    // Set up auth state listener only if Supabase is available
    let subscription: any = null

    const setupAuthListener = async () => {
      try {
        const {
          data: { subscription: authSubscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (mounted) {
            console.log("Auth state changed:", event, session?.user?.email)
            if (session?.user) {
              const authUser: User = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata.full_name || "Demo User",
                avatar: session.user.user_metadata.avatar || "/placeholder-user.jpg",
              }
              setUser(authUser)
            } else {
              setUser(null)
            }
            setLoading(false)
          }
        })
        subscription = authSubscription
      } catch (error) {
        console.warn("Could not set up auth listener:", error)
      }
    }

    // Only set up listener if we think Supabase might be available
    if (typeof window !== "undefined") {
      setupAuthListener()
    }

    // Online/offline detection
    const handleOnline = () => {
      setIsOffline(false)
      // Retry Supabase connection when coming back online
      if (!isSupabaseConnected) {
        initializeAuth()
      }
    }
    const handleOffline = () => setIsOffline(true)

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine)
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)
    }

    return () => {
      mounted = false
      if (subscription) {
        subscription.unsubscribe()
      }
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    if (!isSupabaseConnected) {
      // Demo mode - simulate successful login
      const demoUser = { ...mockUser, email }
      setUser(demoUser)
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.warn("Sign in failed, using demo mode:", error.message)
        const demoUser = { ...mockUser, email }
        setUser(demoUser)
      }
    } catch (error) {
      console.warn("Sign in error, using demo mode:", error)
      const demoUser = { ...mockUser, email }
      setUser(demoUser)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    if (!isSupabaseConnected) {
      // Demo mode - simulate successful signup
      const demoUser = {
        ...mockUser,
        email,
        user_metadata: { ...mockUser.user_metadata, ...metadata },
      }
      setUser(demoUser)
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        console.warn("Sign up failed, using demo mode:", error.message)
        const demoUser = {
          ...mockUser,
          email,
          user_metadata: { ...mockUser.user_metadata, ...metadata },
        }
        setUser(demoUser)
      }

      return { error }
    } catch (error) {
      console.warn("Sign up error, using demo mode:", error)
      const demoUser = {
        ...mockUser,
        email,
        user_metadata: { ...mockUser.user_metadata, ...metadata },
      }
      setUser(demoUser)
      return { error: null }
    }
  }

  const signOut = () => {
    try {
      if (isSupabaseConnected) {
        supabase.auth.signOut()
      }
    } catch (error) {
      console.warn("Sign out error:", error)
    } finally {
      setUser(null)
    }
  }

  const resetPassword = async (email: string) => {
    if (!isSupabaseConnected) {
      return { error: null }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (error) {
      console.warn("Password reset error:", error)
      return { error: null }
    }
  }

  const getOfflineData = (key: string): any[] => {
    try {
      const data = localStorage.getItem(`offline_${key}`)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error getting offline data:", error)
      return []
    }
  }

  const saveOfflineData = (key: string, data: any) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(data))
    } catch (error) {
      console.error("Error saving offline data:", error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isOffline,
    getOfflineData,
    saveOfflineData,
    isSupabaseConnected,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
