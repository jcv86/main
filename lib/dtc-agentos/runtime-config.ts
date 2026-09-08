/** Pure configuration: importing this module never initializes AI providers or adapters. */
/**
 * Module IDs that use coaching mode (modules 1-6)
 */
export const COACHING_MODULES = [
  'auditoria-inicial',
  'metodo-star',
  'cv-inteligente',
  'analisis-vacante',
  'analisis-multimodal',
  'entrenamiento-guiado',
] as const

/**
 * Module IDs that use interview simulation (modules 7-10)
 */
export const INTERVIEW_MODULES = [
  'entrenamiento-estructurado',
  'simulacion-real',
  'sala-practica',
  'evaluacion-final',
] as const

/**
 * All module IDs in order
 */
export const ALL_MODULES = [
  ...COACHING_MODULES,
  ...INTERVIEW_MODULES,
] as const

/**
 * Interview levels
 */
export const INTERVIEW_LEVELS = ['basic', 'advanced', 'pro'] as const
export type InterviewLevel = typeof INTERVIEW_LEVELS[number]

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Determine if a module ID is a coaching module
 */
export function isCoachingModule(moduleId: string): boolean {
  return COACHING_MODULES.includes(moduleId as typeof COACHING_MODULES[number])
}

/**
 * Determine if a module ID is an interview module
 */
export function isInterviewModule(moduleId: string): boolean {
  return INTERVIEW_MODULES.includes(moduleId as typeof INTERVIEW_MODULES[number])
}

/**
 * Get module number from ID (1-10)
 */
export function getModuleNumber(moduleId: string): number {
  const index = ALL_MODULES.indexOf(moduleId as typeof ALL_MODULES[number])
  return index >= 0 ? index + 1 : -1
}

/**
 * Get module ID from number
 */
export function getModuleId(moduleNumber: number): string | null {
  if (moduleNumber < 1 || moduleNumber > ALL_MODULES.length) return null
  return ALL_MODULES[moduleNumber - 1]
}

/**
 * Check if a user is in dev mode
 */
export function isDevMode(userId?: string): boolean {
  // Dev users have specific patterns
  if (!userId) return false
  
  const devPatterns = [
    'dev-',
    'test-',
    'demo-',
    'travis',
    'ana',
    'carlos',
    'maria',
  ]
  
  const lowerUserId = userId.toLowerCase()
  return devPatterns.some(pattern => lowerUserId.includes(pattern))
}

/**
 * Format duration in milliseconds to human readable
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

