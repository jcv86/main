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
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking for existing session
    const timer = setTimeout(() => {
      // Mock user for demo
      setUser({
        id: "1",
        name: "Usuario Demo",
        email: "demo@carreerpro.com",
        avatar: "/placeholder-user.jpg",
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setUser({
      id: "1",
      name: "Usuario Demo",
      email: email,
      avatar: "/placeholder-user.jpg",
    })
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
