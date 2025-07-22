"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user for demo mode
const DEMO_USER = {
  id: "00000000-0000-0000-0000-000000000000",
  email: "demo@example.com",
  user_metadata: {
    full_name: "Usuario Demo",
    avatar_url: "/placeholder-user.jpg",
  },
  app_metadata: {},
  aud: "authenticated",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
} as User

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Always use demo mode for now to avoid Supabase initialization issues
    setUser(DEMO_USER)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Always succeed in demo mode
    setUser(DEMO_USER)
    return { error: null }
  }

  const signUp = async (email: string, password: string) => {
    // Always succeed in demo mode
    setUser(DEMO_USER)
    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    return { error: null }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
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
