"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
      } finally {
        setLoading(false)
      }
    }

    // Only run on client side
    if (typeof window !== "undefined") {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in real app, validate with backend
      if (email && password) {
        const mockUser: User = {
          id: "1",
          name: "Usuario Demo",
          email: email,
          avatar: "/placeholder.svg?height=40&width=40&text=U",
        }

        setUser(mockUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(mockUser))
        }
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock registration - in real app, create user in backend
      if (name && email && password) {
        const mockUser: User = {
          id: "1",
          name: name,
          email: email,
          avatar: "/placeholder.svg?height=40&width=40&text=" + name.charAt(0).toUpperCase(),
        }

        setUser(mockUser)
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(mockUser))
        }
        return true
      }

      return false
    } catch (error) {
      console.error("Register error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
