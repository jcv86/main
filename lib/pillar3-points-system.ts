/**
 * Pillar 3 Points Distribution System
 * Total: 1000 points divided across 7 main training parts
 * Points are awarded when users complete lessons/tests
 */

export const PILLAR3_POINTS_CONFIG = {
  // Part 1: Guía del Coach - Auditoría Inicial (Initial Audit)
  audit_initial: {
    id: 'audit_initial',
    name: 'Guía del Coach - Auditoría Inicial',
    description: 'Initial preparation and audit with coach',
    totalPoints: 100,
    lessons: 1,
    pointsPerLesson: 100,
  },

  // Part 2a: Método STAR (STAR Method Training)
  star_method: {
    id: 'star_method',
    name: 'Método STAR',
    description: 'Structured response methodology',
    totalPoints: 150,
    lessons: 4, // 4 lessons in guided training
    pointsPerLesson: 37.5,
  },

  // Part 2b: CV Inteligente (CV Optimization)
  cv_intelligent: {
    id: 'cv_intelligent',
    name: 'CV Inteligente',
    description: 'ATS optimization and CV enhancement',
    totalPoints: 100,
    lessons: 1,
    pointsPerLesson: 100,
  },

  // Part 2c: Análisis de Vacante (Job Analysis)
  job_analysis: {
    id: 'job_analysis',
    name: 'Análisis de Vacante',
    description: 'Job posting analysis and strategy',
    totalPoints: 100,
    lessons: 1,
    pointsPerLesson: 100,
  },

  // Part 2d: Análisis Multimodal (Video Analysis)
  multimodal_analysis: {
    id: 'multimodal_analysis',
    name: 'Análisis Multimodal',
    description: 'AI video feedback and coach analysis',
    totalPoints: 100,
    lessons: 1,
    pointsPerLesson: 100,
  },

  // Part 3a: Entrenamientos Progresivos - Guiado (Guided Level)
  training_guided: {
    id: 'training_guided',
    name: 'Entrenamientos Progresivos - Guiado',
    description: 'Guided training level with structured questions',
    totalPoints: 150,
    lessons: 4, // Multiple simulation questions
    pointsPerLesson: 37.5,
  },

  // Part 3b: Entrenamientos Progresivos - Avanzado (Structured/Challenging/Conversational)
  training_advanced: {
    id: 'training_advanced',
    name: 'Entrenamientos Progresivos - Avanzado',
    description: 'Advanced training: Structured, Challenging, and Conversational levels',
    totalPoints: 200,
    lessons: 12, // 4 questions × 3 levels
    pointsPerLesson: 16.67,
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
  star_method: 'entrenamiento_guiado',
  cv_intelligent: 'cv_optimization',
  job_analysis: 'job_analysis',
  multimodal_analysis: 'multimodal_analysis',
  training_guided: 'simulaciones_guiado',
  training_advanced: 'simulaciones_avanzado',
}

/**
 * Get all modules configuration
 */
export function getAllModules() {
  return Object.values(PILLAR3_POINTS_CONFIG).map((module) => ({
    ...module,
    progressPercentage: 0, // Will be calculated based on user progress
  }))
}

/**
 * Calculate progress for all modules
 */
export function calculateModuleProgress(
  completedTrainings: Array<{ training_id: string; completed_at: string }>
) {
  const modules = getAllModules()

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
