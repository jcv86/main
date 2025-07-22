"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const checkAuth = async () => {
      try {
        // For demo purposes, we'll set a mock user
        const mockUser = {
          id: "1",
          name: "Usuario Demo",
          email: "demo@ejemplo.com",
          avatar: "/placeholder-user.jpg",
        }
        setUser(mockUser)
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock login - in real app, this would call your auth API
      const mockUser = {
        id: "1",
        name: "Usuario Demo",
        email: email,
        avatar: "/placeholder-user.jpg",
      }
      setUser(mockUser)
    } catch (error) {
      throw new Error("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Mock registration - in real app, this would call your auth API
      const mockUser = {
        id: "1",
        name: name,
        email: email,
        avatar: "/placeholder-user.jpg",
      }
      setUser(mockUser)
    } catch (error) {
      throw new Error("Error al registrarse")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, register, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
