'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useSession as useNextAuthSession } from 'next-auth/react'
import type { Session } from 'next-auth'

interface User {
  id: string
  email: string
  name?: string
  image?: string
}

interface SessionContextType {
  user: User | null
  isLoading: boolean
  session: Session | null
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

interface SessionWrapperProps {
  children: ReactNode
}

export function SessionWrapper({ children }: SessionWrapperProps) {
  const { data: session, status } = useNextAuthSession()
  const isLoading = status === 'loading'

  // Transform NextAuth session to our User interface
  const user: User | null = session?.user
    ? {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || undefined,
        image: session.user.image || undefined,
      }
    : null

  return (
    <SessionContext.Provider value={{ user, isLoading, session }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)

  if (context === undefined) {
    throw new Error('useSession must be used within a SessionWrapper')
  }

  return context
}
