"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

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
  const isDemo = true // Always use demo mode to avoid Supabase errors

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Demo mode - check localStorage
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
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)

      // Simulate network delay
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

      // Simulate network delay
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
    } catch (error) {
      console.error("Registration error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      localStorage.removeItem("demo_user")
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
