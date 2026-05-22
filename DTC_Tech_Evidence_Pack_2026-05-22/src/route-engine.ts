/**
 * Route State Engine - Core Logic
 * 18 functions for initialization, validation, context retrieval, and progression
 */

import type {
  UserRouteState,
  C1ProfessionalIdentity,
  A1CommunicationProfile,
  C2EvidenceVault,
  A2RouteState,
  A2DayState,
  A3RouteState,
  A3ModuleState,
  RouteMode,
  RouteContext,
  A2DayContext,
  A3ModuleContext,
} from './route-state.types'
import { A3_CHECKPOINT_MAP } from './a3-checkpoint-map'
import { A2_DAILY_MISSIONS } from './a2-missions-full'

// ═══════════════════════════════════════════════════════════════════════════
// 1. INITIALIZATION & FACTORY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function createEmptyRouteState(userId: string, mode: RouteMode = 'production'): UserRouteState {
  const now = new Date()
  return {
    userId,
    mode,
    status: 'incomplete',
    lastUpdated: now,
    createdAt: now,
    dataQuality: {
      c1Complete: false,
      a1Complete: false,
      c2Complete: false,
      a2Complete: false,
      a3Complete: false,
    },
    seededDataUsed: false,
  }
}

export function initializeA2Route(userId: string): A2RouteState {
  const days: Record<number, A2DayState> = {}
  
  for (let i = 1; i <= 90; i++) {
    days[i] = {
      dayNumber: i,
      slug: `dia-${i}`,
      status: i === 1 ? 'available' : 'locked',
    }
  }

  return {
    userId,
    currentDay: 1,
    totalDaysCompleted: 0,
    days,
    missedDaysToday: [],
    xpEarned: 0,
  }
}

export function initializeA3Route(userId: string): A3RouteState {
  const modules: Record<string, A3ModuleState> = {}
  
  // Create state for all 10 checkpoint modules
  const checkpointDays = [7, 16, 27, 35, 43, 51, 58, 68, 78, 88]
  
  checkpointDays.forEach((day, index) => {
    const checkpoint = A3_CHECKPOINT_MAP[day]
    if (checkpoint) {
      modules[checkpoint.moduleId] = {
        moduleId: checkpoint.moduleId,
        moduleNumber: checkpoint.moduleNumber,
        dayNumber: day,
        status: 'locked',
        unlocked: false,
        prerequisitesComplete: false,
        attempts: [],
        certificationStatus: 'not_certified',
      }
    }
  })

  return {
    userId,
    modules,
    completedModuleCount: 0,
    totalXp: 0,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. UNLOCK & ACCESS CONTROL
// ═══════════════════════════════════════════════════════════════════════════

export function canAccessDay(state: UserRouteState, dayNumber: number): boolean {
  if (state.mode !== 'production' && state.mode !== 'demo') {
    return true // Travis/QA modes bypass unlock checks
  }

  const dayState = state.a2?.days[dayNumber]
  if (!dayState) return false

  // Day 1 always accessible after account creation
  if (dayNumber === 1) return true

  // Check previous day completed
  const previousDay = state.a2?.days[dayNumber - 1]
  if (previousDay?.status !== 'completed') return false

  // Check A3 prerequisites
  const mission = A2_DAILY_MISSIONS[dayNumber]
  if (mission?.unlockRequirements?.requiredCompletedA3Modules) {
    const required = mission.unlockRequirements.requiredCompletedA3Modules
    const completed = Object.values(state.a3?.modules || {})
      .filter(m => m.certificationStatus === 'certified')
      .map(m => m.moduleId)

    const allComplete = required.every(moduleId => completed.includes(moduleId))
    if (!allComplete) return false
  }

  return true
}

export function canAccessA3Module(state: UserRouteState, moduleId: string): boolean {
  if (state.mode !== 'production' && state.mode !== 'demo') {
    return true // Travis/QA modes bypass unlock checks
  }

  const module = state.a3?.modules[moduleId]
  if (!module) return false

  // Check all previous modules completed
  const checkpoint = A3_CHECKPOINT_MAP[module.dayNumber]
  if (!checkpoint) return false

  if (checkpoint.requiredPreviousModules.length === 0) {
    return true // First module - no prerequisites
  }

  const allPreviousComplete = checkpoint.requiredPreviousModules.every(prevId => {
    const prevModule = state.a3?.modules[prevId]
    return prevModule?.certificationStatus === 'certified'
  })

  return allPreviousComplete
}

export function getLockReason(state: UserRouteState, dayNumber: number): string | null {
  if (canAccessDay(state, dayNumber)) return null

  const mission = A2_DAILY_MISSIONS[dayNumber]
  
  if (dayNumber > 1 && state.a2?.days[dayNumber - 1]?.status !== 'completed') {
    return `Completa Día ${dayNumber - 1} primero`
  }

  if (mission?.unlockRequirements?.requiredCompletedA3Modules) {
    const required = mission.unlockRequirements.requiredCompletedA3Modules
    const missing = required.filter(id => {
      const module = state.a3?.modules[id]
      return module?.certificationStatus !== 'certified'
    })
    return `Módulos pendientes: ${missing.join(', ')}`
  }

  return 'No desbloqueado'
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. CONTEXT RETRIEVAL
// ═══════════════════════════════════════════════════════════════════════════

export function getFullRouteContext(state: UserRouteState): RouteContext {
  const missingData: string[] = []

  if (!state.dataQuality.c1Complete || !state.c1) missingData.push('C1 Professional Identity')
  if (!state.dataQuality.a1Complete || !state.a1) missingData.push('A1 Communication Profile')
  if (!state.dataQuality.c2Complete || !state.c2) missingData.push('C2 Evidence Vault')
  if (!state.dataQuality.a2Complete || !state.a2) missingData.push('A2 Mission Progress')
  if (!state.dataQuality.a3Complete || !state.a3) missingData.push('A3 Modules')

  return {
    fullState: state,
    c1Context: state.c1 || null,
    a1Context: state.a1 || null,
    c2Context: state.c2 || null,
    a2Context: state.a2 || null,
    a3Context: state.a3 || null,
    missingData,
    canAccess: (day) => canAccessDay(state, day),
    canAccessModule: (moduleId) => canAccessA3Module(state, moduleId),
  }
}

export function getA2DayContext(state: UserRouteState, dayNumber: number): A2DayContext | null {
  const dayState = state.a2?.days[dayNumber]
  const mission = A2_DAILY_MISSIONS[dayNumber]

  if (!dayState || !mission) return null

  const isUnlocked = canAccessDay(state, dayNumber)
  const lockReason = isUnlocked ? undefined : getLockReason(state, dayNumber) || undefined
  const isDev = state.mode === 'travis_dev' || state.mode === 'qa_test'

  return {
    day: dayState,
    mission,
    c1: state.c1 || null,
    a1: state.a1 || null,
    c2: state.c2 || null,
    isUnlocked,
    isDev,
    lockReason,
  }
}

export function getA3ModuleContext(state: UserRouteState, moduleId: string): A3ModuleContext | null {
  const module = state.a3?.modules[moduleId]
  const checkpoint = Object.values(A3_CHECKPOINT_MAP).find(cp => cp.moduleId === moduleId)

  if (!module || !checkpoint) return null

  const isUnlocked = canAccessA3Module(state, moduleId)
  const lockReason = isUnlocked ? undefined : 'Complete previous modules first'
  const isDev = state.mode === 'travis_dev' || state.mode === 'qa_test'

  const previousModules = checkpoint.requiredPreviousModules
    .map(id => state.a3?.modules[id])
    .filter(m => m !== undefined) as A3ModuleState[]

  return {
    module,
    checkpoint,
    c1: state.c1 || null,
    a1: state.a1 || null,
    a2: state.a2 || null,
    isUnlocked,
    isDev,
    lockReason,
    previousModules,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. PROGRESSION & COMPLETION
// ═══════════════════════════════════════════════════════════════════════════

export function completeA2Day(state: A2RouteState, dayNumber: number, xpEarned: number = 0): A2RouteState {
  const updatedState = { ...state }
  const dayState = { ...updatedState.days[dayNumber] }
  
  dayState.status = 'completed'
  dayState.completedAt = new Date()

  // Unlock next day
  if (dayNumber < 90) {
    updatedState.days[dayNumber + 1].status = 'available'
  }

  updatedState.days[dayNumber] = dayState
  updatedState.totalDaysCompleted += 1
  updatedState.xpEarned += xpEarned

  return updatedState
}

export function completeA3Module(state: A3RouteState, moduleId: string, xpEarned: number = 0): A3RouteState {
  const updatedState = { ...state }
  const module = updatedState.modules[moduleId]

  if (!module) return state

  module.certificationStatus = 'certified'
  module.status = 'completed'
  updatedState.completedModuleCount += 1
  updatedState.totalXp += xpEarned

  // Check if all modules completed
  const allCompleted = Object.values(updatedState.modules).every(
    m => m.certificationStatus === 'certified'
  )
  if (allCompleted) {
    updatedState.completedAt = new Date()
  }

  return updatedState
}

// Wrapper functions for UserRouteState
export function completeUserA2Day(state: UserRouteState, dayNumber: number, xpEarned: number = 0): UserRouteState {
  if (!state.a2) return state
  
  const updatedA2 = completeA2Day(state.a2, dayNumber, xpEarned)
  return {
    ...state,
    a2: updatedA2,
    lastUpdated: new Date(),
  }
}

export function completeUserA3Module(state: UserRouteState, moduleId: string, xpEarned: number = 0): UserRouteState {
  if (!state.a3) return state
  
  const updatedA3 = completeA3Module(state.a3, moduleId, xpEarned)
  return {
    ...state,
    a3: updatedA3,
    lastUpdated: new Date(),
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. DATA QUALITY & VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

export function validateRouteState(state: UserRouteState): string[] {
  const errors: string[] = []

  if (!state.userId) errors.push('Missing userId')
  if (!state.mode) errors.push('Missing mode')

  // Check data completeness
  if (!state.c1) errors.push('C1 Professional Identity not initialized')
  if (!state.a1) errors.push('A1 Communication Profile not initialized')
  if (!state.c2) errors.push('C2 Evidence Vault not initialized')
  if (!state.a2) errors.push('A2 Route not initialized')
  if (!state.a3) errors.push('A3 Route not initialized')

  // Validate A2 consistency
  if (state.a2 && state.a2.currentDay < 1 || state.a2.currentDay > 90) {
    errors.push('Invalid currentDay in A2')
  }

  return errors
}

export function getMissingData(state: UserRouteState): string[] {
  const missing: string[] = []

  if (!state.c1) missing.push('C1 Professional Identity')
  if (!state.a1) missing.push('A1 Communication Profile')
  if (!state.c2) missing.push('C2 Evidence Vault')
  if (!state.a2 || Object.values(state.a2.days).every(d => d.status === 'locked')) {
    missing.push('A2 Progress Data')
  }
  if (!state.a3 || Object.values(state.a3.modules).every(m => m.status === 'locked')) {
    missing.push('A3 Module Data')
  }

  return missing
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. HELPER: Get Mission Config
// ═══════════════════════════════════════════════════════════════════════════

export function getMissionConfig(dayNumber: number) {
  return A2_DAILY_MISSIONS[dayNumber] || null
}

export function getCheckpointConfig(moduleId: string) {
  return Object.values(A3_CHECKPOINT_MAP).find(cp => cp.moduleId === moduleId) || null
}
