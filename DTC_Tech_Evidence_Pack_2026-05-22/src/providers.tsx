'use client'

import type React from 'react'
import { SessionWrapper } from '@/components/session-wrapper'
import { CoachStrategicProvider } from '@/components/coach-strategic-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { RouteStateProvider } from '@/lib/route-context'
import { DevRouteDebugPanel } from '@/components/dev-route-debug-panel'
import { Toaster } from '@/components/ui/toaster'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="theme-preference">
      <SessionWrapper>
        <RouteStateProvider>
          <CoachStrategicProvider>
            {children}
            <Toaster />
            <DevRouteDebugPanel />
          </CoachStrategicProvider>
        </RouteStateProvider>
      </SessionWrapper>
    </ThemeProvider>
  )
}
