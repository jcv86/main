/**
 * A2 Helper Functions
 * Utilities for accessing and managing daily missions
 */

import type { A2DailyMission, A2DayStatus } from './a2-mission.types'
import { A3_CHECKPOINT_MAP, getA3CheckpointForDay, arePreviousModulesCompleted } from './a3-checkpoint-map'

/**
 * Global A2 daily missions repository
 * Will be imported from a2-days-config.ts
 * Placeholder for TypeScript - actual import happens at runtime
 */
let A2_MISSIONS: Record<number, A2DailyMission> = {}

/**
 * Initialize the missions repository
 * Must be called once at app startup
 */
export function initializeA2Missions(missions: Record<number, A2DailyMission>) {
  A2_MISSIONS = missions
}

/**
 * Get mission data for a specific day
 * @param day - Day number 1-90
 * @returns A2DailyMission object or undefined if day not found
 */
export function getA2MissionByDay(day: number): A2DailyMission | undefined {
  if (day < 1 || day > 90) return undefined
  return A2_MISSIONS[day]
}

/**
 * Get all missions in a date range
 * @param startDay - Starting day
 * @param endDay - Ending day (inclusive)
 * @returns Array of missions in range
 */
export function getA2MissionsByRange(
  startDay: number,
  endDay: number
): A2DailyMission[] {
  const missions: A2DailyMission[] = []
  for (let i = startDay; i <= endDay; i++) {
    const mission = A2_MISSIONS[i]
    if (mission) missions.push(mission)
  }
  return missions
}

/**
 * Get missions for a phase (Foundation, Role Alignment, or Simulation & Certification)
 */
export function getA2MissionsByPhase(
  phase: "Foundation" | "Role Alignment" | "Simulation & Certification"
): A2DailyMission[] {
  return Object.values(A2_MISSIONS).filter(m => m.phaseLabel === phase)
}

/**
 * Check if a day is an A3 checkpoint day
 * @param day - Day number
 * @returns true if this day has an A3 checkpoint
 */
export function isA2CheckpointDay(day: number): boolean {
  return day in A3_CHECKPOINT_MAP
}

/**
 * Get the A3 checkpoint for a day (if any)
 * @param day - Day number
 * @returns Checkpoint metadata or undefined
 */
export function getA2A3CheckpointInfo(day: number) {
  return getA3CheckpointForDay(day)
}

/**
 * Determine day unlock status
 * @param day - Target day
 * @param completedDays - Array of completed day numbers
 * @param day1Passed - Whether user passed Day 1 DTC validation
 * @returns Status of the day
 */
export function getA2DayStatus(
  day: number,
  completedDays: number[],
  day1Passed: boolean
): A2DayStatus {
  // Day 1 special case - available when A1/setup complete (handled by parent)
  if (day === 1) {
    if (completedDays.includes(1)) return 'completed'
    return 'available' // Day 1 is always available to start
  }

  // Day 1 is gate for all other days
  if (!day1Passed) return 'locked'

  // Check if previous day completed
  if (!completedDays.includes(day - 1)) return 'locked'

  // Determine availability
  if (completedDays.includes(day)) return 'completed'
  if (completedDays.includes(day - 1)) return 'available'

  return 'locked'
}

/**
 * Get the next available day for user
 * @param completedDays - Array of completed day numbers
 * @param day1Passed - Whether Day 1 is passed
 * @returns Next day number or null if all done
 */
export function getNextAvailableDay(
  completedDays: number[],
  day1Passed: boolean
): number | null {
  // If Day 1 not passed, that's next
  if (!completedDays.includes(1)) return 1

  // After Day 1 passes, find next uncompleted
  for (let day = 2; day <= 90; day++) {
    if (!completedDays.includes(day)) return day
  }

  return null // All days complete
}

/**
 * Calculate route completion percentage
 * @param completedDays - Array of completed day numbers
 * @param totalDays - Total days in route (90, 60, or 30)
 * @returns Percentage 0-100
 */
export function calculateRouteProgress(
  completedDays: number[],
  totalDays: number = 90
): number {
  if (totalDays === 0) return 0
  return Math.round((completedDays.length / totalDays) * 100)
}

/**
 * Get current day in user's journey
 * Current day = highest completed day + 1, capped at 90
 * @param completedDays - Array of completed day numbers
 * @returns Current day number
 */
export function getCurrentA2Day(completedDays: number[]): number {
  if (completedDays.length === 0) return 1
  const maxCompleted = Math.max(...completedDays)
  return Math.min(maxCompleted + 1, 90)
}

/**
 * Check if user can access an A3 module
 * Implements the critical gate logic:
 * 1. Day 1 must be passed
 * 2. Current day must be the checkpoint day
 * 3. All previous modules must be completed
 *
 * @param params - Access control parameters
 * @returns true if access allowed, false otherwise
 */
export function canOpenA3Module({
  currentDay,
  day1Passed,
  requestedModuleId,
  completedA3Modules = [],
}: {
  currentDay: number
  day1Passed: boolean
  requestedModuleId: string
  completedA3Modules?: string[]
}): boolean {
  // Rule 1: Day 1 must be passed
  if (!day1Passed) {
    return false
  }

  // Rule 2: Get checkpoint for current day
  const checkpoint = getA3CheckpointForDay(currentDay)
  if (!checkpoint) {
    return false // Today is not a checkpoint day
  }

  // Rule 3: Requested module must match checkpoint day
  if (checkpoint.moduleId !== requestedModuleId) {
    return false // Wrong module for this day
  }

  // Rule 4: All previous modules must be completed
  if (!arePreviousModulesCompleted(checkpoint, completedA3Modules)) {
    return false // Prerequisites not met
  }

  return true
}

/**
 * Get reason why A3 module is blocked (for UI messaging)
 * @param params - Same as canOpenA3Module
 * @returns Descriptive reason string or empty if allowed
 */
export function getA3BlockReason({
  currentDay,
  day1Passed,
  requestedModuleId,
  completedA3Modules = [],
}: {
  currentDay: number
  day1Passed: boolean
  requestedModuleId: string
  completedA3Modules?: string[]
}): string {
  if (!day1Passed) {
    return 'Debes completar y aprobar el Día 1 para acceder a los módulos A3.'
  }

  const checkpoint = getA3CheckpointForDay(currentDay)
  if (!checkpoint) {
    return 'Este módulo se desbloqueará en un día de control especial de la ruta.'
  }

  if (checkpoint.moduleId !== requestedModuleId) {
    return `Este módulo se desbloqueará el Día ${
      Object.entries(A3_CHECKPOINT_MAP).find(
        ([, cp]) => cp.moduleId === requestedModuleId
      )?.[0]
    } de tu ruta.`
  }

  // Find first incomplete required module
  const incompleteModule = checkpoint.requiredPreviousModules.find(
    m => !completedA3Modules.includes(m)
  )
  if (incompleteModule) {
    const requiredCheckpoint = Object.values(A3_CHECKPOINT_MAP).find(
      cp => cp.moduleId === incompleteModule
    )
    return `Debes completar primero: ${requiredCheckpoint?.moduleTitle}`
  }

  return 'Acceso denegado'
}

/**
 * Get summary of what phase user is in
 */
export function getPhaseInfo(currentDay: number): {
  phase: "Foundation" | "Role Alignment" | "Simulation & Certification"
  daysInPhase: number
  daysCompleted: number
  description: string
} {
  if (currentDay <= 30) {
    return {
      phase: 'Foundation',
      daysInPhase: 30,
      daysCompleted: Math.min(currentDay - 1, 30),
      description: 'Construyes tu identidad, evidencia y CV',
    }
  } else if (currentDay <= 60) {
    return {
      phase: 'Role Alignment',
      daysInPhase: 30,
      daysCompleted: Math.min(currentDay - 31, 30),
      description: 'Estudias el mercado, construyes respuestas y practicas',
    }
  } else {
    return {
      phase: 'Simulation & Certification',
      daysInPhase: 30,
      daysCompleted: Math.min(currentDay - 61, 30),
      description: 'Realizas simulaciones, dominas preguntas difíciles y certificas',
    }
  }
}
