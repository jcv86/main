"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  userRole: "admin" | "moderator" | "user"
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userRole, setUserRole] = useState<"admin" | "moderator" | "user">("user")

  const supabase = createClient()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem("demo-user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          await checkUserRole(userData.id)
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()
  }, [])

  const checkUserRole = async (userId: string) => {
    try {
      // Check if user is admin (travis@nuanu.com)
      const adminStatus = userId === "11111111-1111-1111-1111-111111111111"
      const role = adminStatus ? "admin" : "user"

      setIsAdmin(adminStatus)
      setUserRole(role)
    } catch (error) {
      console.error("Error checking user role:", error)
      setIsAdmin(false)
      setUserRole("user")
    }
  }

  const setCookie = (name: string, value: string, days = 1) => {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      if (data.user) {
        setUser(data.user)
        localStorage.setItem("demo-user", JSON.stringify(data.user))

        // Set cookie for middleware
        setCookie("demo-user", JSON.stringify(data.user), 7)

        await checkUserRole(data.user.id)
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      if (data.user) {
        setUser(data.user)
        localStorage.setItem("demo-user", JSON.stringify(data.user))
        setCookie("demo-user", JSON.stringify(data.user), 7)
        await checkUserRole(data.user.id)
      }

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAdmin(false)
      setUserRole("user")
      localStorage.removeItem("demo-user")

      // Clear cookie
      document.cookie = "demo-user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    loading,
    isAdmin,
    userRole,
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
