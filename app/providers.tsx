'use client'

import type React from 'react'
import { SessionWrapper } from '@/components/session-wrapper'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
// Temporarily disabled CoachStrategicProvider to fix session persistence
// import { CoachStrategicProvider } from '@/components/coach-strategic-provider'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="theme-preference">
      <SessionWrapper>
        {/* CoachStrategicProvider temporarily disabled - causes supabase.auth errors when Supabase credentials missing */}
        {/* <CoachStrategicProvider> */}
          {children}
          <Toaster />
        {/* </CoachStrategicProvider> */}
      </SessionWrapper>
    </ThemeProvider>
  )
}
