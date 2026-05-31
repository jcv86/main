/**
 * Component Memoization Configuration
 * 
 * Utility to wrap components with React.memo to prevent unnecessary re-renders
 * Particularly useful for expensive components that receive stable props
 */

import { memo, type ComponentType } from 'react'

/**
 * Generic memoization wrapper
 * Use when component props are stable and don't change frequently
 */
export function withMemo<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
) {
  const Memoized = memo(Component)
  if (displayName) {
    Memoized.displayName = displayName
  }
  return Memoized
}

/**
 * Deep comparison memoization wrapper
 * For components that need to compare nested objects
 */
export function withDeepMemo<P extends object>(
  Component: ComponentType<P>,
  displayName?: string
) {
  const Memoized = memo(
    Component,
    (prevProps, nextProps) => {
      // Deep comparison of all props
      return JSON.stringify(prevProps) === JSON.stringify(nextProps)
    }
  )
  if (displayName) {
    Memoized.displayName = displayName
  }
  return Memoized
}

/**
 * Selective property comparison memoization
 * Only re-render if specified props change
 */
export function withSelectiveMemo<P extends object>(
  Component: ComponentType<P>,
  propsToCompare: (keyof P)[] = [],
  displayName?: string
) {
  const Memoized = memo(
    Component,
    (prevProps, nextProps) => {
      // If no props specified, do shallow comparison on all
      if (propsToCompare.length === 0) {
        return Object.keys(prevProps).every(
          (key) => prevProps[key as keyof P] === nextProps[key as keyof P]
        )
      }
      
      // Compare only specified props
      return propsToCompare.every(
        (key) => prevProps[key] === nextProps[key]
      )
    }
  )
  if (displayName) {
    Memoized.displayName = displayName
  }
  return Memoized
}

/**
 * Components recommended for memoization (based on usage in a2-routes)
 * These are components that receive the same props frequently
 */
export const memoizedComponents = {
  // TaskCard - renders frequently in lists, props stable
  TaskCard: 'Use withMemo - props rarely change during session',
  
  // PhaseProgress - shows progress bars, recalculated but props stable
  PhaseProgress: 'Use withMemo - only updates on completion',
  
  // ResourceLibrary - static content, never changes
  ResourceLibrary: 'Use withMemo - completely static',
  
  // Card components - render many times with stable content
  Card: 'Use withMemo - content stable per render',
  Badge: 'Use withMemo - status rarely changes',
  Button: 'Use withMemo - only handler changes, props stable',
} as const
