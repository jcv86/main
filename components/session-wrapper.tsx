"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface SessionContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionWrapper({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user session
    const timer = setTimeout(() => {
      setUser({
        id: "demo-user-1",
        name: "Travis",
        email: "demo@example.com",
      })
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return <SessionContext.Provider value={{ user, setUser, isLoading }}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionWrapper")
  }
  return context
}

export default SessionWrapper
