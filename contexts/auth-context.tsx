"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    setTimeout(() => {
      // Mock user for demo
      setUser({
        id: "1",
        name: "Usuario Demo",
        email: "demo@example.com",
        avatar: "/placeholder-user.jpg",
        role: "user",
      })
      setLoading(false)
    }, 1000)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUser({
      id: "1",
      name: "Usuario Demo",
      email: email,
      avatar: "/placeholder-user.jpg",
      role: "user",
    })
    setLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
