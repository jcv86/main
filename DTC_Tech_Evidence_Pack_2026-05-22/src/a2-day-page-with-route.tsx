'use client'

import { useA2DayContext } from '@/lib/route-context'
import { A2DayPageTemplate } from './a2-day-page-template'
import { Loader2 } from 'lucide-react'

interface A2DayPageWithRouteProps {
  dayNumber: number
  onComplete?: () => void
  children?: React.ReactNode
  userId?: string
}

/**
 * A2DayPageWithRoute is a wrapper that integrates route state context with the day page template.
 * It automatically loads C1, A1, C2 context and provides them to the page.
 * In Travis dev mode, it auto-seeds missing prerequisites.
 */
export function A2DayPageWithRoute({
  dayNumber,
  onComplete,
  children,
  userId,
}: A2DayPageWithRouteProps) {
  // Get day context with auto-backfilling in dev mode
  const dayContext = useA2DayContext(dayNumber)

  // Loading state while context is being prepared
  if (!dayContext) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-slate-400">Preparando Día {dayNumber}...</p>
        </div>
      </div>
    )
  }

  // If day is not unlocked and not in dev mode, show lock message
  if (!dayContext.isUnlocked && !dayContext.isDev) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-slate-900/50 border border-purple-500/40 rounded-[28px] p-6 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Día bloqueado</h2>
          <p className="text-slate-400 mb-4">{dayContext.lockReason}</p>
          <p className="text-xs text-slate-500">
            Completa el día anterior para desbloquear este contenido.
          </p>
        </div>
      </div>
    )
  }

  // Render day page with full context
  return (
    <A2DayPageTemplate
      dayNumber={dayNumber}
      onComplete={onComplete}
      userId={userId}
      routeContext={dayContext}
    >
      {children}
    </A2DayPageTemplate>
  )
}
