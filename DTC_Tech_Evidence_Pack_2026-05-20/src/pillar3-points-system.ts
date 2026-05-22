/**
 * Pillar 3 Points Distribution System
 * Total: 1000 points = 100% progress
 * - Guía del Coach - Auditoría Inicial: 40 points
 * - Metodo STAR: 120 points
 * - CV Inteligente: 120 points
 * - Análisis de Vacante: 120 points
 * - Análisis Multimodal: 120 points
 * - Entrenamientos Guiados: 120 points
 * - Entrenamientos Estructurados: 120 points
 * - Entrenamientos Desafiantes: 120 points
 * - Entrenamientos Conversionales: 120 points
 */

export const PILLAR3_POINTS_CONFIG = {
  // Part 1: Guía del Coach - Auditoría Inicial (Initial Audit)
  audit_initial: {
    id: 'audit_initial',
    name: 'Guía del Coach - Auditoría Inicial',
    description: 'Initial preparation and audit with coach',
    totalPoints: 40,
    lessons: 1,
    pointsPerLesson: 40,
  },

  // Part 2a: Método STAR (STAR Method Training)
  star_method: {
    id: 'star_method',
    name: 'Método STAR',
    description: 'Structured response methodology',
    totalPoints: 120,
    lessons: 4,
    pointsPerLesson: 30,
  },

  // Part 2b: CV Inteligente (CV Optimization)
  cv_intelligent: {
    id: 'cv_intelligent',
    name: 'CV Inteligente',
    description: 'ATS optimization and CV enhancement',
    totalPoints: 120,
    lessons: 4,
    pointsPerLesson: 30,
  },

  // Part 2c: Análisis de Vacante (Job Analysis)
  job_analysis: {
    id: 'job_analysis',
    name: 'Análisis de Vacante',
    description: 'Job posting analysis and strategy',
    totalPoints: 120,
    lessons: 4,
    pointsPerLesson: 30,
  },

  // Part 2d: Análisis Multimodal (Video Analysis)
  multimodal_analysis: {
    id: 'multimodal_analysis',
    name: 'Análisis Multimodal',
    description: 'AI video feedback and coach analysis',
    totalPoints: 120,
    lessons: 4,
    pointsPerLesson: 30,
  },

  // Part 3a: Entrenamientos Progresivos - Guiado (Guided Level)
  training_guided: {
    id: 'training_guided',
    name: 'Entrenamientos Progresivos - Guiado',
    description: 'Guided training level with structured questions',
    totalPoints: 120,
    lessons: 4,
    pointsPerLesson: 30,
  },

  // Part 3b: Entrenamientos Progresivos - Estructurado (Structured Level)
  training_structured: {
    id: 'training_structured',
    name: 'Entrenamientos Progresivos - Estructurado',
    description: 'Structured training level',
    totalPoints: 120,
    lessons: 4,
    pointsPerLesson: 30,
  },

  // Part 3c: Entrenamientos Progresivos - Desafiante (Challenging Level)
  training_challenging: {
    id: 'training_challenging',
    name: 'Entrenamientos Progresivos - Desafiante',
    description: 'Challenging training level',
    totalPoints: 120,
    lessons: 4,
    pointsPerLesson: 30,
  },

  // Part 3d: Entrenamientos Progresivos - Conversacional (Conversational Level)
  training_conversational: {
    id: 'training_conversational',
    name: 'Entrenamientos Progresivos - Conversacional',
    description: 'Conversational training level',
    totalPoints: 120,
    lessons: 4,
    pointsPerLesson: 30,
  },
}

/**
 * Get points for a specific training module
 */
export function getPointsForModule(moduleId: string): number {
  const config = Object.values(PILLAR3_POINTS_CONFIG).find(
    (m) => m.id === moduleId
  )
  return config?.totalPoints || 0
}

/**
 * Get points per lesson for a specific module
 */
export function getPointsPerLesson(moduleId: string): number {
  const config = Object.values(PILLAR3_POINTS_CONFIG).find(
    (m) => m.id === moduleId
  )
  return config?.pointsPerLesson || 0
}

/**
 * Calculate total possible points across all modules
 */
export function getTotalPossiblePoints(): number {
  return Object.values(PILLAR3_POINTS_CONFIG).reduce(
    (sum, module) => sum + module.totalPoints,
    0
  )
}

/**
 * Get completion percentage based on total points earned
 */
export function getCompletionPercentage(pointsEarned: number): number {
  const totalPoints = getTotalPossiblePoints()
  return Math.min((pointsEarned / totalPoints) * 100, 100)
}

/**
 * Map module IDs to database training types
 */
export const MODULE_TO_TRAINING_TYPE = {
  audit_initial: 'audit_initial',
  star_method: 'star_method',
  cv_intelligent: 'cv_intelligent',
  job_analysis: 'job_analysis',
  multimodal_analysis: 'multimodal_analysis',
  training_guided: 'training_guided',
  training_structured: 'training_structured',
  training_challenging: 'training_challenging',
  training_conversational: 'training_conversational',
}

/**
 * Get all modules in order
 */
export const ALL_MODULES_ORDER = [
  'audit_initial',
  'star_method',
  'cv_intelligent',
  'job_analysis',
  'multimodal_analysis',
  'training_guided',
  'training_structured',
  'training_challenging',
  'training_conversational',
]

/**
 * Get the position of a module among all 9 training modules
 */
export function getModulePosition(moduleId: string): number {
  const position = ALL_MODULES_ORDER.findIndex((id) => id === moduleId)
  return position !== -1 ? position + 1 : 1 // Returns 1-indexed position
}

/**
 * Get total number of training modules
 */
export function getTotalModules(): number {
  return ALL_MODULES_ORDER.length
}

/**
 * Calculate progress for all modules
 */
export function calculateModuleProgress(
  completedTrainings: Array<{ training_id: string; completed_at: string }>
) {
  const modules = Object.entries(PILLAR3_POINTS_CONFIG).map(([key, config]) => ({
    id: config.id,
    name: config.name,
    description: config.description,
    totalPoints: config.totalPoints,
    lessons: config.lessons,
    pointsPerLesson: config.pointsPerLesson,
  }))

  return modules.map((module) => {
    const completedCount = completedTrainings.filter((t) =>
      t.training_id.includes(module.id)
    ).length

    return {
      ...module,
      completedLessons: completedCount,
      progressPercentage: (completedCount / module.lessons) * 100,
      pointsEarned: completedCount * module.pointsPerLesson,
    }
  })
}
