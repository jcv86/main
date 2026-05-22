'use client'

/**
 * Route State Context Provider
 * Global state management for C1→A1→C2→A2→A3 connection flow
 * Provides hooks for accessing route state across the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type {
  UserRouteState,
  RouteContext,
  A2DayContext,
  A3ModuleContext,
  RouteMode,
} from './route-state.types'
import {
  createEmptyRouteState,
  initializeA2Route,
  initializeA3Route,
  getFullRouteContext,
  getA2DayContext,
  getA3ModuleContext,
  canAccessDay,
  canAccessA3Module,
} from './route-engine'
import { seedTravisForDay, seedTravisCompleteRoute } from './route-seeds'

// ═══════════════════════════════════════════════════════════════════════════
// CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface RouteStateContextType {
  // State
  routeState: UserRouteState
  isLoading: boolean
  error: string | null

  // Actions
  initializeRoute: (mode: RouteMode) => Promise<void>
  updateRouteState: (updates: Partial<UserRouteState>) => void
  seedRouteForDay: (dayNumber: number) => void
  seedCompletRoute: () => void
  clearSeededData: () => void

  // Getters
  getContext: () => RouteContext
  getDayContext: (day: number) => A2DayContext | null
  getModuleContext: (moduleId: string) => A3ModuleContext | null
  canAccessDay: (day: number) => boolean
  canAccessModule: (moduleId: string) => boolean
}

const RouteStateContext = createContext<RouteStateContextType | undefined>(undefined)

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface RouteStateProviderProps {
  children: ReactNode
  userId?: string
  initialMode?: RouteMode
}

export function RouteStateProvider({ 
  children, 
  userId = 'demo-travis',
  initialMode = 'production' 
}: RouteStateProviderProps) {
  const [routeState, setRouteState] = useState<UserRouteState>(
    createEmptyRouteState(userId, initialMode)
  )
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize route on mount
  useEffect(() => {
    const initializeRoute = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // In production, load from Supabase
        // In Travis mode, seed with demo data
        if (initialMode === 'travis_dev') {
          const seededState = seedTravisCompleteRoute()
          setRouteState(seededState)
        } else {
          // Initialize empty structure
          let state = createEmptyRouteState(userId, initialMode)
          state.a2 = initializeA2Route(userId)
          state.a3 = initializeA3Route(userId)
          setRouteState(state)
        }

        setIsLoading(false)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize route'
        setError(message)
        setIsLoading(false)
      }
    }

    initializeRoute()
  }, [userId, initialMode])

  const handleInitializeRoute = async (mode: RouteMode) => {
    try {
      setIsLoading(true)
      let state = createEmptyRouteState(userId, mode)
      state.a2 = initializeA2Route(userId)
      state.a3 = initializeA3Route(userId)
      setRouteState(state)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateRouteState = (updates: Partial<UserRouteState>) => {
    setRouteState(prev => ({
      ...prev,
      ...updates,
      lastUpdated: new Date(),
    }))
  }

  const handleSeedRouteForDay = (dayNumber: number) => {
    try {
      const seededState = seedTravisForDay(dayNumber)
      setRouteState(seededState)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to seed data'
      setError(message)
    }
  }

  const handleSeedCompleteRoute = () => {
    try {
      const seededState = seedTravisCompleteRoute()
      setRouteState(seededState)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to seed complete route'
      setError(message)
    }
  }

  const handleClearSeededData = () => {
    try {
      setRouteState(createEmptyRouteState(userId, 'production'))
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear data'
      setError(message)
    }
  }

  const value: RouteStateContextType = {
    routeState,
    isLoading,
    error,
    initializeRoute: handleInitializeRoute,
    updateRouteState: handleUpdateRouteState,
    seedRouteForDay: handleSeedRouteForDay,
    seedCompletRoute: handleSeedCompleteRoute,
    clearSeededData: handleClearSeededData,
    getContext: () => getFullRouteContext(routeState),
    getDayContext: (day) => getA2DayContext(routeState, day),
    getModuleContext: (moduleId) => getA3ModuleContext(routeState, moduleId),
    canAccessDay: (day) => canAccessDay(routeState, day),
    canAccessModule: (moduleId) => canAccessA3Module(routeState, moduleId),
  }

  return <RouteStateContext.Provider value={value}>{children}</RouteStateContext.Provider>
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Main hook for accessing route state
 */
export function useRouteState() {
  const context = useContext(RouteStateContext)
  if (!context) {
    throw new Error('useRouteState must be used within RouteStateProvider')
  }
  
  // Add helper functions for debug panel
  const isDev = context.routeState.mode === 'travis_dev' || context.routeState.mode === 'qa_test'
  
  return {
    ...context,
    state: context.routeState, // Alias for compatibility
    updateState: context.updateRouteState, // Alias for compatibility
    isDev,
  }
}

/**
 * Hook for accessing A2 day-specific context
 * Automatically seeds data if missing in Travis mode
 */
export function useA2DayContext(dayNumber: number) {
  const { routeState, seedRouteForDay, getDayContext } = useRouteState()

  const context = getDayContext(dayNumber)

  // Auto-seed if in Travis mode and context is missing
  useEffect(() => {
    if (
      routeState.mode === 'travis_dev' &&
      !context &&
      routeState.a2?.days[dayNumber]?.status === 'locked'
    ) {
      seedRouteForDay(dayNumber)
    }
  }, [dayNumber, context, routeState.mode, routeState.a2?.days, seedRouteForDay])

  return context
}

/**
 * Hook for accessing A3 module-specific context
 * Automatically seeds data if missing in Travis mode
 */
export function useA3ModuleContext(moduleId: string) {
  const { routeState, seedRouteForDay, getModuleContext } = useRouteState()

  const context = getModuleContext(moduleId)

  // Auto-seed if in Travis mode and module locked
  useEffect(() => {
    if (
      routeState.mode === 'travis_dev' &&
      !context &&
      routeState.a3?.modules[moduleId]?.status === 'locked'
    ) {
      // Find which day this module is on and seed
      const module = routeState.a3?.modules[moduleId]
      if (module) {
        seedRouteForDay(module.dayNumber)
      }
    }
  }, [moduleId, context, routeState.mode, routeState.a3?.modules, seedRouteForDay])

  return context
}

/**
 * Hook for accessing full route context with all sections
 */
export function useFullRouteContext() {
  const { getContext } = useRouteState()
  return getContext()
}

/**
 * Hook for C1 Professional Identity
 */
export function useC1Identity() {
  const { routeState } = useRouteState()
  return routeState.c1 || null
}

/**
 * Hook for A1 Communication Profile
 */
export function useA1Profile() {
  const { routeState } = useRouteState()
  return routeState.a1 || null
}

/**
 * Hook for C2 Evidence Vault
 */
export function useC2Vault() {
  const { routeState } = useRouteState()
  return routeState.c2 || null
}

/**
 * Hook for A2 Day progress
 */
export function useA2Progress() {
  const { routeState } = useRouteState()
  return routeState.a2 || null
}

/**
 * Hook for A3 Module progress
 */
export function useA3Progress() {
  const { routeState } = useRouteState()
  return routeState.a3 || null
}

/**
 * Hook for checking if user can access a specific day
 */
export function useCanAccessDay(dayNumber: number) {
  const { canAccessDay } = useRouteState()
  return canAccessDay(dayNumber)
}

/**
 * Hook for checking if user can access a specific A3 module
 */
export function useCanAccessModule(moduleId: string) {
  const { canAccessModule } = useRouteState()
  return canAccessModule(moduleId)
}
