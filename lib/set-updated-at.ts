/**
 * Helper functions for A1 cycle management
 * Note: The actual set_updated_at trigger is defined in the SQL migration.
 * This file provides TypeScript utilities for working with the A1 system.
 */

export interface A1CycleStatus {
  cycleId: string
  userID: string
  status: 'active' | 'completed' | 'archived'
  startedAt: Date
  endsAt: Date
}

export interface A1CheckinResult {
  cycleId: string
  resultId: string
  overallScore: number
  dimensionScores: {
    energia: number
    enfoque: number
    relaciones: number
    planEjecutivo: number
  }
}

export interface MissionCompletionResult {
  status: 'SUCCESS' | 'ALREADY_COMPLETED'
  pointsTotal: number
  progressPct: number
}

/**
 * Helper to validate A1 raw answers
 * Raw answers must be an array of 20 integers (1-10)
 */
export function validateA1RawAnswers(answers: unknown[]): answers is number[] {
  if (!Array.isArray(answers)) return false
  if (answers.length !== 20) return false
  return answers.every(
    (val) => typeof val === 'number' && val >= 1 && val <= 10
  )
}

/**
 * Helper to calculate DISC profile from dimension scores
 */
export function calculateDISCProfile(
  energia: number,
  enfoque: number,
  relaciones: number,
  planEjecutivo: number
): 'energia' | 'enfoque' | 'relaciones' | 'plan_ejecutivo' {
  const scores = { energia, enfoque, relaciones, plan_ejecutivo: planEjecutivo }
  const highest = Object.entries(scores).reduce((prev, current) =>
    current[1] > prev[1] ? current : prev
  )
  return highest[0] as 'energia' | 'enfoque' | 'relaciones' | 'plan_ejecutivo'
}

/**
 * Helper to calculate progress percentage
 */
export function calculateProgressPercentage(
  missionsCompleted: number,
  totalMissions: number
): number {
  if (totalMissions === 0) return 0
  return Math.round((missionsCompleted / totalMissions) * 100)
}

/**
 * Helper to format cycle end date
 */
export function calculateCycleEndDate(
  startDate: Date,
  cycleLengthDays: number = 30
): Date {
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + cycleLengthDays)
  return endDate
}

/**
 * Helper to check if cycle is still active
 */
export function isCycleActive(endDate: Date): boolean {
  return new Date() < endDate
}

export default {
  validateA1RawAnswers,
  calculateDISCProfile,
  calculateProgressPercentage,
  calculateCycleEndDate,
  isCycleActive,
}
