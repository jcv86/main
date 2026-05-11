/**
 * Pillar 3 Single Source of Truth Configuration
 * 
 * Defines the canonical structure for all 4 levels and 10 modules of Pillar 3.
 * All XP/DTC calculations, level unlocks, and progress tracking flow from here.
 * 
 * Total Pillar 3 XP: 1000
 * Total Pillar 3 DTC: 100
 */

export type Pillar3ModuleId =
  | 'auditoria-inicial'
  | 'metodo-star'
  | 'cv-inteligente'
  | 'analisis-vacante'
  | 'analisis-multimodal'
  | 'entrenamiento-guiado'
  | 'entrenamiento-estructurado'
  | 'entrenamiento-desafiante'
  | 'entrenamiento-conversacional'
  | 'simulacion-real'

export type Pillar3LevelId = 1 | 2 | 3 | 4

export interface Pillar3ModuleConfig {
  id: Pillar3ModuleId
  name: string
  description: string
  level: Pillar3LevelId
  xp: number
  dtc: number
  /**
   * Alternative IDs that may have been stored in the database from earlier versions.
   * Used for backward-compatibility during lookups (read paths only).
   */
  legacyIds?: string[]
}

export interface Pillar3LevelConfig {
  level: Pillar3LevelId
  name: string
  description: string
  moduleIds: Pillar3ModuleId[]
}

/**
 * All Pillar 3 modules with canonical IDs and exact XP/DTC values.
 * Each module is counted individually (not combined):
 * - Module 1 (Auditoría Inicial): 70 XP
 * - Module 2 (Método STAR): 120 XP
 * - Module 3 (CV Inteligente): 120 XP
 * - Module 4 (Análisis de Vacante): 120 XP
 * - Module 5 (Análisis Multimodal): 120 XP
 * - Module 6 (Entrenamiento Guiado): 120 XP
 * - Module 7 (Entrenamiento Estructurado): 120 XP
 * - Module 8 (Entrenamiento Desafiante): 120 XP
 * - Module 9 (Entrenamiento Conversacional): 120 XP
 * - Module 10 (Simulación Real): 40 XP
 * Total: 1070 XP / 100 DTC
 */
export const PILLAR3_MODULES: Record<Pillar3ModuleId, Pillar3ModuleConfig> = {
  // MODULE 1: Audit (70 XP / 4 DTC)
  'auditoria-inicial': {
    id: 'auditoria-inicial',
    name: 'Auditoría Inicial',
    description: 'Auditoría completa: ambiente, presencia, audio y primer feedback. Tu coach te guía a través de una evaluación profesional antes de entrenar con simulaciones intensivas.',
    level: 1,
    xp: 70,
    dtc: 4,
    legacyIds: ['audit_initial', 'entrevista-0', 'entrevista 0', 'preparacion-inicial'],
  },

  // MODULE 2: STAR Method (120 XP / 12 DTC)
  'metodo-star': {
    id: 'metodo-star',
    name: 'Método STAR',
    description: 'Domina la técnica STAR para responder con estructura',
    level: 2,
    xp: 120,
    dtc: 12,
    legacyIds: ['star_method', 'star'],
  },
  // MODULE 3: Intelligent CV (120 XP / 12 DTC)
  'cv-inteligente': {
    id: 'cv-inteligente',
    name: 'CV Inteligente',
    description: 'Crea un CV optimizado con IA',
    level: 2,
    xp: 120,
    dtc: 12,
    legacyIds: ['cv_intelligent', 'cv'],
  },
  // MODULE 4: Vacancy Analysis (120 XP / 12 DTC)
  'analisis-vacante': {
    id: 'analisis-vacante',
    name: 'Análisis de Vacante',
    description: 'Decodifica ofertas laborales para alinear tu mensaje',
    level: 2,
    xp: 120,
    dtc: 12,
    legacyIds: ['job_analysis', 'vacancy_analysis'],
  // MODULE 5: Multimodal Analysis (120 XP / 12 DTC)
  'analisis-multimodal': {
    id: 'analisis-multimodal',
    name: 'Análisis Multimodal',
    description: 'Análisis combinado de voz, presencia y contenido',
    level: 2,
    xp: 120,
    dtc: 12,
    legacyIds: ['multimodal_analysis', 'analisis-multicanal'],
  },

  // MODULE 6: Guided Training (120 XP / 12 DTC)
  'entrenamiento-guiado': {
    id: 'entrenamiento-guiado',
    name: 'Entrenamiento Guiado',
    description: 'Practica con guías paso a paso',
    level: 3,
    xp: 120,
    dtc: 12,
    legacyIds: ['guided_training', 'entrevista-guiada'],
  // MODULE 7: Structured Training (120 XP / 12 DTC)
  'entrenamiento-estructurado': {
    id: 'entrenamiento-estructurado',
    name: 'Entrenamiento Estructurado',
    description: 'Entrenamiento con marcos formales',
    level: 3,
    xp: 120,
    dtc: 12,
    legacyIds: ['structured_training', 'entrevista-estructurada'],
  // MODULE 8: Challenging Training (120 XP / 12 DTC)
  'entrenamiento-desafiante': {
    id: 'entrenamiento-desafiante',
    name: 'Entrenamiento Desafiante',
    description: 'Preguntas difíciles bajo presión',
    level: 3,
    xp: 120,
    dtc: 12,
    legacyIds: ['challenging_training', 'entrevista-desafiante'],
  // MODULE 9: Conversational Training (120 XP / 12 DTC)
  'entrenamiento-conversacional': {
    id: 'entrenamiento-conversacional',
    name: 'Entrenamiento Conversacional',
    description: 'Conversaciones naturales y fluidas',
    level: 3,
    xp: 120,
    dtc: 12,
    legacyIds: ['conversational_training', 'entrevista-conversacional'],
  },

  // MODULE 10: Real Simulation (40 XP / 4 DTC)
  'simulacion-real': {
    id: 'simulacion-real',
    name: 'Simulación Real',
    description: 'Simulación completa bajo presión real',
    level: 4,
    xp: 40,
    dtc: 4,
    legacyIds: ['real_simulation', 'simulacion-completa'],
  },
}

/**
 * Pillar 3 Levels with metadata and module groupings.
 */
export const PILLAR3_LEVELS: Record<Pillar3LevelId, Pillar3LevelConfig> = {
  1: {
    level: 1,
    name: 'Auditoría Inicial',
    description: 'Evaluación base de tu presentación profesional',
    moduleIds: ['auditoria-inicial'],
  },
  2: {
    level: 2,
    name: 'Herramientas de Preparación',
    description: 'Domina técnicas esenciales de entrevista',
    moduleIds: ['metodo-star', 'cv-inteligente', 'analisis-vacante', 'analisis-multimodal'],
  },
  3: {
    level: 3,
    name: 'Entrenamientos Progresivos',
    description: 'Practica en contextos cada vez más desafiantes',
    moduleIds: [
      'entrenamiento-guiado',
      'entrenamiento-estructurado',
      'entrenamiento-desafiante',
      'entrenamiento-conversacional',
    ],
  },
  4: {
    level: 4,
    name: 'Simulación Real',
    description: 'Simulación completa bajo presión real',
    moduleIds: ['simulacion-real'],
  },
}

export const PILLAR3_LEVEL_ORDER: Pillar3LevelId[] = [1, 2, 3, 4]

/**
 * Total XP available across all Pillar 3 modules.
 * 40 + (4 * 120) + (4 * 120) + 40 = 1000
 */
export const TOTAL_PILLAR3_XP = Object.values(PILLAR3_MODULES).reduce(
  (sum, m) => sum + m.xp,
  0
)

/**
 * Total DTC available across all Pillar 3 modules.
 * 4 + (4 * 12) + (4 * 12) + 4 = 100
 */
export const TOTAL_PILLAR3_DTC = Object.values(PILLAR3_MODULES).reduce(
  (sum, m) => sum + m.dtc,
  0
)

/**
 * Look up a module config by ID.
 * Accepts both canonical IDs and legacy IDs for backward compatibility.
 */
export function getModuleConfig(id: string): Pillar3ModuleConfig | null {
  // Direct canonical lookup
  if (id in PILLAR3_MODULES) {
    return PILLAR3_MODULES[id as Pillar3ModuleId]
  }

  // Legacy ID lookup
  const lowerId = id.toLowerCase()
  for (const module of Object.values(PILLAR3_MODULES)) {
    if (module.legacyIds?.some((legacy) => legacy.toLowerCase() === lowerId)) {
      return module
    }
  }

  return null
}

/**
 * Resolve any module identifier (canonical or legacy) to its canonical ID.
 * Returns null if no match.
 */
export function resolveCanonicalId(id: string): Pillar3ModuleId | null {
  const config = getModuleConfig(id)
  return config?.id ?? null
}

/**
 * Total XP available within a single level.
 */
export function getLevelXp(level: Pillar3LevelId): number {
  return PILLAR3_LEVELS[level].moduleIds.reduce(
    (sum, moduleId) => sum + PILLAR3_MODULES[moduleId].xp,
    0
  )
}

/**
 * Total DTC available within a single level.
 */
export function getLevelDtc(level: Pillar3LevelId): number {
  return PILLAR3_LEVELS[level].moduleIds.reduce(
    (sum, moduleId) => sum + PILLAR3_MODULES[moduleId].dtc,
    0
  )
}

/**
 * Determine which levels are complete based on a list of completed module IDs.
 * Returns an object with boolean flags for each level.
 */
export function calculateLevelCompletion(completedIds: string[]) {
  const canonicalCompleted = new Set(
    completedIds
      .map((id) => resolveCanonicalId(id))
      .filter((id): id is Pillar3ModuleId => id !== null)
  )

  return {
    level1: PILLAR3_LEVELS[1].moduleIds.every((id) => canonicalCompleted.has(id)),
    level2: PILLAR3_LEVELS[2].moduleIds.every((id) => canonicalCompleted.has(id)),
    level3: PILLAR3_LEVELS[3].moduleIds.every((id) => canonicalCompleted.has(id)),
    level4: PILLAR3_LEVELS[4].moduleIds.every((id) => canonicalCompleted.has(id)),
    canonicalCompleted: Array.from(canonicalCompleted),
  }
}

/**
 * Build the moduleStates map used by the dashboard UI.
 * Returns 'completed' | 'available' | 'in_progress' | 'locked' for every module.
 * 
 * Unlock Logic: Sequential progression (1→2→3→...→10)
 * - Module 1 (Auditoría Inicial) is always available first
 * - Module N is available after Module N-1 is completed
 */
export function buildModuleStates(
  completedIds: string[]
): Record<Pillar3ModuleId, 'completed' | 'available' | 'in_progress' | 'locked'> {
  const canonicalCompleted = new Set(
    completedIds
      .map((id) => resolveCanonicalId(id))
      .filter((id): id is Pillar3ModuleId => id !== null)
  )

  const states = {} as Record<
    Pillar3ModuleId,
    'completed' | 'available' | 'in_progress' | 'locked'
  >

  // Define sequential module order (1-10)
  const moduleOrder: Pillar3ModuleId[] = [
    'auditoria-inicial',        // 1
    'metodo-star',              // 2
    'cv-inteligente',           // 3
    'analisis-vacante',         // 4
    'analisis-multimodal',      // 5
    'entrenamiento-guiado',     // 6
    'entrenamiento-estructurado', // 7
    'entrenamiento-desafiante', // 8
    'entrenamiento-conversacional', // 9
    'simulacion-real',          // 10
  ]

  for (let i = 0; i < moduleOrder.length; i++) {
    const moduleId = moduleOrder[i]

    if (canonicalCompleted.has(moduleId)) {
      states[moduleId] = 'completed'
    } else if (i === 0) {
      // First module is always available
      states[moduleId] = 'available'
    } else if (canonicalCompleted.has(moduleOrder[i - 1])) {
      // Previous module is completed → this module is available
      states[moduleId] = 'available'
    } else {
      // Previous module not completed → this module is locked
      states[moduleId] = 'locked'
    }
  }

  return states
}

/**
 * Calculate total XP and DTC earned from a list of completed modules.
 * Only counts each canonical module once (deduplicates).
 */
export function calculateEarnedRewards(completedIds: string[]) {
  const canonicalSet = new Set(
    completedIds
      .map((id) => resolveCanonicalId(id))
      .filter((id): id is Pillar3ModuleId => id !== null)
  )

  let totalXp = 0
  let totalDtc = 0

  for (const id of canonicalSet) {
    totalXp += PILLAR3_MODULES[id].xp
    totalDtc += PILLAR3_MODULES[id].dtc
  }

  return { totalXp, totalDtc }
}
