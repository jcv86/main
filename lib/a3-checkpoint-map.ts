/**
 * A3 Checkpoint Day Mapping
 * Maps each A2 day to its corresponding A3 module
 * Strict 10-checkpoint schedule: Days 7, 16, 27, 35, 43, 51, 58, 68, 78, 88
 */

import type { A3Checkpoint } from './a2-mission.types'

/**
 * Complete A3 checkpoint mapping for 90-day route
 * Key: A2 day number
 * Value: A3 checkpoint metadata
 */
export const A3_CHECKPOINT_MAP: Record<number, A3Checkpoint> = {
  7: {
    moduleNumber: 1,
    moduleId: 'career-mirror',
    moduleTitle: 'Espejo de Carrera',
    route: '/despega/a3/career-mirror',
    requiredPreviousModules: [],  // First module - no prerequisites
  },
  16: {
    moduleNumber: 2,
    moduleId: 'value-mining-lab',
    moduleTitle: 'Laboratorio de Minería de Valor',
    route: '/despega/a3/value-mining-lab',
    requiredPreviousModules: ['career-mirror'],
  },
  27: {
    moduleNumber: 3,
    moduleId: 'cv-builder-studio',
    moduleTitle: 'Estudio Constructor de CV',
    route: '/despega/a3/cv-builder-studio',
    requiredPreviousModules: ['career-mirror', 'value-mining-lab'],
  },
  35: {
    moduleNumber: 4,
    moduleId: 'job-decoder',
    moduleTitle: 'Decodificador de Ofertas',
    route: '/despega/a3/job-decoder',
    requiredPreviousModules: ['career-mirror', 'value-mining-lab', 'cv-builder-studio'],
  },
  43: {
    moduleNumber: 5,
    moduleId: 'answer-architecture',
    moduleTitle: 'Arquitectura de Respuestas',
    route: '/despega/a3/answer-architecture',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
    ],
  },
  51: {
    moduleNumber: 6,
    moduleId: 'coach-practice-room',
    moduleTitle: 'Sala de Práctica del Coach',
    route: '/despega/a3/coach-practice-room',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
    ],
  },
  58: {
    moduleNumber: 7,
    moduleId: 'communication-gym',
    moduleTitle: 'Gimnasio de Comunicación',
    route: '/despega/a3/communication-gym',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
      'coach-practice-room',
    ],
  },
  68: {
    moduleNumber: 8,
    moduleId: 'first-recruiter-simulation',
    moduleTitle: 'Primera Simulación con Reclutador',
    route: '/despega/a3/first-recruiter-simulation',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
      'coach-practice-room',
      'communication-gym',
    ],
  },
  78: {
    moduleNumber: 9,
    moduleId: 'risk-difficult-questions-lab',
    moduleTitle: 'Laboratorio de Preguntas Difíciles',
    route: '/despega/a3/risk-difficult-questions-lab',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
      'coach-practice-room',
      'communication-gym',
      'first-recruiter-simulation',
    ],
  },
  88: {
    moduleNumber: 10,
    moduleId: 'basic-interview-mission',
    moduleTitle: 'Misión de Entrevista Básica',
    route: '/despega/a3/basic-interview-mission',
    requiredPreviousModules: [
      'career-mirror',
      'value-mining-lab',
      'cv-builder-studio',
      'job-decoder',
      'answer-architecture',
      'coach-practice-room',
      'communication-gym',
      'first-recruiter-simulation',
      'risk-difficult-questions-lab',
    ],
  },
}

/**
 * Get A3 checkpoint for a given A2 day
 * Returns checkpoint if day is a checkpoint day, undefined otherwise
 */
export function getA3CheckpointForDay(day: number): A3Checkpoint | undefined {
  return A3_CHECKPOINT_MAP[day]
}

/**
 * Check if a given day is an A3 checkpoint day
 */
export function isA3CheckpointDay(day: number): boolean {
  return day in A3_CHECKPOINT_MAP
}

/**
 * Get all checkpoint days in order
 */
export function getAllCheckpointDays(): number[] {
  return Object.keys(A3_CHECKPOINT_MAP)
    .map(Number)
    .sort((a, b) => a - b)
}

/**
 * Get next checkpoint day after given day
 */
export function getNextCheckpointDay(currentDay: number): number | null {
  const checkpointDays = getAllCheckpointDays()
  const nextDay = checkpointDays.find(day => day > currentDay)
  return nextDay || null
}

/**
 * Get previous checkpoint day before given day
 */
export function getPreviousCheckpointDay(currentDay: number): number | null {
  const checkpointDays = getAllCheckpointDays()
  const previousDay = checkpointDays.reverse().find(day => day < currentDay)
  return previousDay || null
}

/**
 * Get A3 module by its ID
 */
export function getA3ModuleById(
  moduleId: string
): A3Checkpoint | undefined {
  return Object.values(A3_CHECKPOINT_MAP).find(cp => cp.moduleId === moduleId)
}

/**
 * Get A3 module by module number (1-10)
 */
export function getA3ModuleByNumber(
  moduleNumber: number
): A3Checkpoint | undefined {
  return Object.values(A3_CHECKPOINT_MAP).find(cp => cp.moduleNumber === moduleNumber)
}

/**
 * Check if all previous modules are completed for a checkpoint
 * Helper for access control validation
 */
export function arePreviousModulesCompleted(
  checkpoint: A3Checkpoint,
  completedModuleIds: string[]
): boolean {
  return checkpoint.requiredPreviousModules.every(moduleId =>
    completedModuleIds.includes(moduleId)
  )
}
