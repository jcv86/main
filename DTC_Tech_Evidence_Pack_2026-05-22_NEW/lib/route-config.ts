/**
 * Route Engine Configuration
 * Mode settings and constants for Travis Dev Mode operation
 */

import type { RouteModeConfig, RouteMode } from './route-state.types'

/**
 * Route Mode Configurations
 */
export const ROUTE_MODE_CONFIG: Record<RouteMode, RouteModeConfig> = {
  production: {
    mode: 'production',
    allowBypassUnlock: false,
    autoSeedMissingData: false,
    showDebugPanel: false,
    persistSeededData: false,
    allowOfflineMode: false,
  },

  travis_dev: {
    mode: 'travis_dev',
    allowBypassUnlock: true,
    autoSeedMissingData: true,
    showDebugPanel: true,
    persistSeededData: false,
    allowOfflineMode: true,
  },

  qa_test: {
    mode: 'qa_test',
    allowBypassUnlock: true,
    autoSeedMissingData: true,
    showDebugPanel: true,
    persistSeededData: true,
    allowOfflineMode: false,
  },

  demo: {
    mode: 'demo',
    allowBypassUnlock: false,
    autoSeedMissingData: true,
    showDebugPanel: false,
    persistSeededData: false,
    allowOfflineMode: false,
  },
}

/**
 * Determine current mode based on environment
 */
export function getCurrentRouteMode(): RouteMode {
  // Check for Travis CI environment
  if (process.env.TRAVIS === 'true' || process.env.CI === 'true') {
    return 'travis_dev'
  }

  // Check for demo override
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return 'demo'
  }

  // Check for QA environment
  if (process.env.NEXT_PUBLIC_QA_MODE === 'true') {
    return 'qa_test'
  }

  return 'production'
}

/**
 * Get config for current mode
 */
export function getRouteModeConfig(): RouteModeConfig {
  const mode = getCurrentRouteMode()
  return ROUTE_MODE_CONFIG[mode]
}

/**
 * A3 Checkpoint Day Mapping (for quick lookups)
 */
export const A3_CHECKPOINT_DAYS = [7, 16, 27, 35, 43, 51, 58, 68, 78, 88]

/**
 * A2 Phase boundaries
 */
export const A2_PHASES = {
  FOUNDATION: { start: 1, end: 30 },
  ROLE_ALIGNMENT: { start: 31, end: 60 },
  SIMULATION_CERTIFICATION: { start: 61, end: 70 },
  DIFFICULT_QUESTIONS: { start: 71, end: 80 },
  FINAL_APPLICATIONS: { start: 81, end: 85 },
  FINAL_A3_PREP: { start: 86, end: 87 },
  FINAL_A3_CHECKPOINT: { start: 88, end: 88 },
  FINAL_REVIEW: { start: 89, end: 90 },
}

/**
 * Check if a day is an A3 checkpoint day
 */
export function isA3CheckpointDay(dayNumber: number): boolean {
  return A3_CHECKPOINT_DAYS.includes(dayNumber)
}

/**
 * Get the module number for a checkpoint day
 */
export function getModuleNumberForDay(dayNumber: number): number | null {
  const index = A3_CHECKPOINT_DAYS.indexOf(dayNumber)
  return index >= 0 ? index + 1 : null
}

/**
 * Get the day number for a module
 */
export function getDayForModule(moduleNumber: number): number | null {
  const index = moduleNumber - 1
  return index >= 0 && index < A3_CHECKPOINT_DAYS.length ? A3_CHECKPOINT_DAYS[index] : null
}

/**
 * Get which phase a day belongs to
 */
export function getPhaseForDay(dayNumber: number): string {
  for (const [phase, range] of Object.entries(A2_PHASES)) {
    if (dayNumber >= range.start && dayNumber <= range.end) {
      return phase
    }
  }
  return 'UNKNOWN'
}

/**
 * XP calculation constants
 */
export const XP_CONFIG = {
  BASE_DAY_COMPLETION: 10,
  A3_MODULE_MULTIPLIER: 1,
  MILESTONE_BONUS: {
    30: 150,
    60: 150,
    90: 200,
  },
  PERFECT_STREAK_MULTIPLIER: 1.25,
}

/**
 * Calculate XP for day completion
 */
export function calculateDayXp(dayNumber: number, isPerfectStreak: boolean = false): number {
  let xp = XP_CONFIG.BASE_DAY_COMPLETION

  if (XP_CONFIG.MILESTONE_BONUS[dayNumber as keyof typeof XP_CONFIG.MILESTONE_BONUS]) {
    xp += XP_CONFIG.MILESTONE_BONUS[dayNumber as keyof typeof XP_CONFIG.MILESTONE_BONUS]
  }

  if (isPerfectStreak) {
    xp = Math.floor(xp * XP_CONFIG.PERFECT_STREAK_MULTIPLIER)
  }

  return xp
}

/**
 * Calculate XP for A3 module completion
 */
export function calculateModuleXp(moduleNumber: number): number {
  // Increasing XP per module: 90, 100, 110, 120, 120, 130, 140, 160, 170, 220
  const xpPerModule = [90, 100, 110, 120, 120, 130, 140, 160, 170, 220]
  return xpPerModule[moduleNumber - 1] || 100
}
