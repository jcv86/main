"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
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
  const [loading, setLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful login
      setUser({
        id: "1",
        name: "Usuario Demo",
        email: email,
        avatar: "/placeholder-user.jpg",
        role: "user",
      })
    } catch (error) {
      throw new Error("Error al iniciar sesión")
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setLoading(true)
    try {
      // Simulate registration API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful registration
      setUser({
        id: "1",
        name: name,
        email: email,
        avatar: "/placeholder-user.jpg",
        role: "user",
      })
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
