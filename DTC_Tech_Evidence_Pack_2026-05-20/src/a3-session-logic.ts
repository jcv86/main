// A3 Session Logic - Lock, Replay, and Progression Management

export const MODULE_MAP = {
  1: { id: 'career-mirror', name: 'Espejo de Carrera', type: 'coach_training' as const, minA2Day: 15 },
  2: { id: 'value-mining-lab', name: 'Laboratorio de Minería de Valor', type: 'coach_training' as const, minA2Day: 16 },
  3: { id: 'cv-builder-studio', name: 'Estudio Constructor de CV', type: 'coach_training' as const, minA2Day: 27 },
  4: { id: 'job-decoder', name: 'Decodificador de Ofertas', type: 'coach_training' as const, minA2Day: 35 },
  5: { id: 'answer-architecture', name: 'Arquitectura de Respuestas', type: 'coach_training' as const, minA2Day: 43 },
  6: { id: 'coach-practice-room', name: 'Sala de Práctica del Coach', type: 'coach_training' as const, minA2Day: 51 },
  7: { id: 'communication-gym', name: 'Gimnasio de Comunicación', type: 'interviewer_simulation' as const, minA2Day: 58 },
  8: { id: 'first-recruiter-simulation', name: 'Primera Simulación con Reclutador', type: 'interviewer_simulation' as const, minA2Day: 68 },
  9: { id: 'risk-difficult-questions-lab', name: 'Laboratorio de Preguntas Difíciles', type: 'interviewer_simulation' as const, minA2Day: 78 },
  10: { id: 'basic-interview-mission', name: 'Misión de Entrevista Básica', type: 'interviewer_simulation' as const, minA2Day: 88 }
} as const

export type ModuleNumber = keyof typeof MODULE_MAP

export interface A3ProgressState {
  currentModuleNumber: number
  completedModules: number[]
  routeLevel: 'basic' | 'advanced' | 'pro'
  canReplayModules7To10: boolean
  basicRouteCompletedAt?: Date
}

export interface A3SessionMetadata {
  moduleNumber: ModuleNumber
  moduleId: string
  moduleName: string
  sessionType: 'coach_training' | 'interviewer_simulation'
  character: 'coach' | 'sofia' | 'elena' | 'bruno'
  difficulty: 'adaptive' | 'basic' | 'advanced' | 'pro'
  isReplay: boolean
  relatedA2Day: number
}

/**
 * Check if module is locked based on progression
 */
export function isModuleLocked(
  moduleNumber: ModuleNumber,
  completedModules: number[],
  currentA2Day: number
): boolean {
  const module = MODULE_MAP[moduleNumber]
  
  // Check A2 checkpoint requirement
  if (currentA2Day < module.minA2Day) {
    return true
  }

  // Check sequential unlock (must complete previous module first)
  if (moduleNumber > 1) {
    const previousModuleNumber = (moduleNumber - 1) as ModuleNumber
    if (!completedModules.includes(previousModuleNumber)) {
      return true
    }
  }

  return false
}

/**
 * Get lock reason for UI display
 */
export function getLockReason(
  moduleNumber: ModuleNumber,
  completedModules: number[],
  currentA2Day: number
): string | null {
  const module = MODULE_MAP[moduleNumber]
  
  if (currentA2Day < module.minA2Day) {
    return `Este checkpoint todavía no está disponible. Tu ruta lo desbloqueará cuando completes la preparación necesaria (Día ${module.minA2Day}).`
  }

  if (moduleNumber > 1) {
    const previousModuleNumber = (moduleNumber - 1) as ModuleNumber
    const prevModule = MODULE_MAP[previousModuleNumber]
    if (!completedModules.includes(previousModuleNumber)) {
      return `Completa ${prevModule.name} primero para desbloquear este módulo.`
    }
  }

  return null
}

/**
 * Get character options for a module based on progression
 */
export function getAvailableCharacters(
  moduleNumber: ModuleNumber,
  routeLevel: 'basic' | 'advanced' | 'pro',
  canReplay: boolean
): Array<'coach' | 'sofia' | 'elena' | 'bruno'> {
  const module = MODULE_MAP[moduleNumber]
  
  // Modules 1-6 only have coach
  if (module.type === 'coach_training') {
    return ['coach']
  }

  // Modules 7-10 during basic route - only Sofia
  if (routeLevel === 'basic' && !canReplay) {
    return ['sofia']
  }

  // Modules 7-10 after basic completion - all available
  if (routeLevel === 'basic' && canReplay) {
    return ['sofia', 'elena', 'bruno']
  }

  // Advanced and Pro routes
  if (routeLevel === 'advanced') {
    return ['elena', 'bruno']
  }

  return ['bruno']
}

/**
 * Get difficulty level for character
 */
export function getDifficultyForCharacter(
  character: 'coach' | 'sofia' | 'elena' | 'bruno'
): 'adaptive' | 'basic' | 'advanced' | 'pro' {
  switch (character) {
    case 'coach':
      return 'adaptive'
    case 'sofia':
      return 'basic'
    case 'elena':
      return 'advanced'
    case 'bruno':
      return 'pro'
  }
}

/**
 * Check if character selection is locked (only Sofia during basic non-replay)
 */
export function isCharacterSelectionLocked(
  moduleNumber: ModuleNumber,
  routeLevel: 'basic' | 'advanced' | 'pro',
  canReplay: boolean
): boolean {
  const module = MODULE_MAP[moduleNumber]
  
  // Modules 1-6 don't have character selection
  if (module.type === 'coach_training') {
    return true
  }

  // Locked to Sofia during basic non-replay
  return routeLevel === 'basic' && !canReplay
}

/**
 * Get character unlock message
 */
export function getCharacterUnlockMessage(): string {
  return 'Los niveles Advanced y Pro se activan después de completar el Nivel Básico. Practica con diferentes entrevistadores para mejorar.'
}

/**
 * Format session metadata for display
 */
export function formatSessionMetadata(metadata: A3SessionMetadata): {
  sessionTypeLabel: string
  characterLabel: string
  difficultyLabel: string
} {
  const sessionTypeLabel = metadata.sessionType === 'coach_training'
    ? 'Entrevista de Entrenamiento con Coach'
    : 'Simulación con Entrevistador'

  const characterLabel: Record<string, string> = {
    coach: 'Coach IA',
    sofia: 'Sofia (Basic)',
    elena: 'Elena (Advanced)',
    bruno: 'Bruno (Pro)'
  }

  const difficultyLabel: Record<string, string> = {
    adaptive: 'Adaptativo',
    basic: 'Básico',
    advanced: 'Avanzado',
    pro: 'Pro'
  }

  return {
    sessionTypeLabel,
    characterLabel: characterLabel[metadata.character] || metadata.character,
    difficultyLabel: difficultyLabel[metadata.difficulty] || metadata.difficulty
  }
}

export default {
  MODULE_MAP,
  isModuleLocked,
  getLockReason,
  getAvailableCharacters,
  getDifficultyForCharacter,
  isCharacterSelectionLocked,
  getCharacterUnlockMessage,
  formatSessionMetadata
}
