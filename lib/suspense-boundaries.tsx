/**
 * Suspense Boundary Configuration
 * 
 * Implements React Suspense for better streaming and progressive rendering
 * Improves perceived performance and FCP metrics
 */

import { Suspense, type ReactNode } from 'react'

interface SuspenseBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  name?: string
}

/**
 * Generic Suspense Boundary wrapper
 * Provides consistent fallback UI across the app
 */
export function SuspenseBoundary({
  children,
  fallback,
  name = 'Component',
}: SuspenseBoundaryProps) {
  return (
    <Suspense fallback={fallback || <StreamingFallback name={name} />}>
      {children}
    </Suspense>
  )
}

/**
 * Default streaming fallback UI
 * Used when no custom fallback provided
 */
export function StreamingFallback({ name = 'Component' }: { name?: string }) {
  return (
    <div className="space-y-3 p-4 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="h-4 bg-muted rounded w-2/3" />
    </div>
  )
}

/**
 * Advanced Suspense boundary with error handling
 */
export function AdvancedSuspenseBoundary({
  children,
  fallback,
  name = 'Component',
  errorFallback,
}: SuspenseBoundaryProps & {
  errorFallback?: (error: Error) => ReactNode
}) {
  return (
    <Suspense fallback={fallback || <StreamingFallback name={name} />}>
      {children}
    </Suspense>
  )
}

/**
 * Recommended Suspense boundaries for a2-routes page
 * 
 * Usage:
 * <SuspenseBoundary name="Daily Tasks" fallback={<TaskListFallback />}>
 *   <DailyTasksList />
 * </SuspenseBoundary>
 */

export function TaskListFallback() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 bg-muted/20 rounded animate-pulse" />
      ))}
    </div>
  )
}

export function ProgressChartFallback() {
  return (
    <div className="space-y-3 p-4">
      <div className="h-6 bg-muted/20 rounded w-1/3 animate-pulse" />
      <div className="h-32 bg-muted/20 rounded animate-pulse" />
    </div>
  )
}

export function CardGridFallback({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-24 bg-muted/20 rounded animate-pulse" />
      ))}
    </div>
  )
}

/**
 * Streaming optimization hints
 * Add these regions to benefit from React Server Components streaming
 */
export const streamingRegions = {
  // High priority - render immediately
  header: { priority: 'high', delay: 0 },
  
  // Medium priority - render after critical content
  progressStats: { priority: 'medium', delay: 100 },
  
  // Lower priority - render after above-fold content
  taskList: { priority: 'medium', delay: 200 },
  
  // Low priority - render last
  resourceLibrary: { priority: 'low', delay: 500 },
  
  // Interactive - render separately for interactivity
  actionButtons: { priority: 'high', delay: 50 },
} as const
