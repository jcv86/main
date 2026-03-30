'use client'

import type React from 'react'
import { SessionProvider } from 'next-auth/react'
import { SessionWrapper } from '@/components/session-wrapper'
import { CoachStrategicProvider } from '@/components/coach-strategic-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme-preference">
      <SessionProvider>
        <CoachStrategicProvider>
          <SessionWrapper>
            {children}
            <Toaster />
          </SessionWrapper>
        </CoachStrategicProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
