"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  email: string
  full_name?: string
  position?: string
  department?: string
}

interface SessionContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionWrapperProps {
  children: ReactNode
}

export default function SessionWrapper({ children }: SessionWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const updateUser = (newUser: User | null) => {
    setUser(newUser)
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser))
    } else {
      localStorage.removeItem("user")
    }
  }

  return <SessionContext.Provider value={{ user, setUser: updateUser, isLoading }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionWrapper")
  }
  return context
}

// Named export for compatibility
export { SessionWrapper }
