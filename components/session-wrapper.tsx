"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@supabase/supabase-js"

interface User {
  email: string
  full_name?: string
  name?: string
  position?: string
  department?: string
  id?: string
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
    const initializeAuth = async () => {
      try {
        // Check Supabase session first
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (session?.user && !error) {
          console.log("Found Supabase session:", session.user)
          setUser({
            email: session.user.email!,
            full_name: session.user.user_metadata?.name || session.user.email!.split("@")[0],
            name: session.user.user_metadata?.name || session.user.email!.split("@")[0],
            id: session.user.id,
            position: "Team Member",
            department: "Technology",
          })
          setIsLoading(false)
          return
        }
      } catch (error) {
        console.log("Supabase not available, checking local storage:", error)
      }

      // Check local storage sessions
      const checkLocalSessions = () => {
        // Check multiple storage locations
        const sources = [
          localStorage.getItem("dtc_session"),
          localStorage.getItem("user"),
          sessionStorage.getItem("dtc_session"),
        ]

        for (const source of sources) {
          if (source) {
            try {
              const parsed = JSON.parse(source)

              // Handle different session formats
              if (parsed.user) {
                console.log("Found session with user object:", parsed.user)
                setUser(parsed.user)
                setIsLoading(false)
                return true
              } else if (parsed.email) {
                console.log("Found direct user object:", parsed)
                setUser(parsed)
                setIsLoading(false)
                return true
              }
            } catch (error) {
              console.error("Error parsing stored session:", error)
            }
          }
        }
        return false
      }

      if (!checkLocalSessions()) {
        console.log("No valid session found")
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const updateUser = (newUser: User | null) => {
    setUser(newUser)
    if (newUser) {
      // Store in multiple formats for compatibility
      const sessionData = {
        user: newUser,
        authenticated: true,
        timestamp: Date.now(),
      }

      localStorage.setItem("dtc_session", JSON.stringify(sessionData))
      localStorage.setItem("user", JSON.stringify(newUser))
      sessionStorage.setItem("dtc_session", JSON.stringify(sessionData))
    } else {
      // Clear all session data
      localStorage.removeItem("dtc_session")
      localStorage.removeItem("user")
      sessionStorage.removeItem("dtc_session")
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
