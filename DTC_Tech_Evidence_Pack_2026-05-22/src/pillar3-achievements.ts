/**
 * Pillar 3 Achievement Milestones
 * Tracks progress from 0% to 100% with rewards and achievements
 */

export interface Achievement {
  id: string
  milestone: number // 0, 25, 50, 75, 100
  title: string
  description: string
  icon: string
  points: number
  unlockedAt?: string
}

export interface TrainingModule {
  id: string
  name: string
  type: 'lesson' | 'test' | 'simulation'
  points: number
  category: string
}

// Define all Pillar 3 training modules and their point values
export const PILLAR3_MODULES: TrainingModule[] = [
  // Interview 0 - Auditoría Inicial
  { id: 'interview-0', name: 'Auditoría Inicial', type: 'test', points: 100, category: 'Fundamentals' },
  
  // Entrenamiento Guiado - 4 lessons
  { id: 'lección-1', name: 'Situación (S)', type: 'lesson', points: 50, category: 'STAR Method' },
  { id: 'lección-2', name: 'Tarea (T)', type: 'lesson', points: 50, category: 'STAR Method' },
  { id: 'lección-3', name: 'Acción (A)', type: 'lesson', points: 50, category: 'STAR Method' },
  { id: 'lección-4', name: 'Resultado (R)', type: 'lesson', points: 50, category: 'STAR Method' },
  
  // Entrenamiento Estructurado
  { id: 'entrenamiento-estructurado', name: 'Entrenamiento Estructurado', type: 'test', points: 150, category: 'Progressive Training' },
  
  // Entrenamiento Desafiante
  { id: 'entrenamiento-desafiante', name: 'Entrenamiento Desafiante', type: 'test', points: 200, category: 'Progressive Training' },
  
  // Conversational Interview
  { id: 'conversational-interview', name: 'Entrevista Conversacional', type: 'test', points: 150, category: 'Advanced' },
  
  // Simulaciones
  { id: 'simulaciones-guiado', name: 'Simulación Guiada', type: 'simulation', points: 100, category: 'Simulations' },
  { id: 'simulaciones-estructurada', name: 'Simulación Estructurada', type: 'simulation', points: 120, category: 'Simulations' },
  { id: 'simulaciones-desafiante', name: 'Simulación Desafiante', type: 'simulation', points: 150, category: 'Simulations' },
  { id: 'simulaciones-maestria', name: 'Simulación Maestría', type: 'simulation', points: 200, category: 'Simulations' },
]

// Calculate total possible points
const TOTAL_POSSIBLE_POINTS = PILLAR3_MODULES.reduce((sum, module) => sum + module.points, 0)

// Achievement milestones
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'starter',
    milestone: 0,
    title: 'Iniciador',
    description: 'Comienza tu viaje de entrenamiento intensivo',
    icon: '🚀',
    points: 0,
  },
  {
    id: 'quarter-way',
    milestone: 25,
    title: 'En Movimiento',
    description: `Has completado ${Math.round(TOTAL_POSSIBLE_POINTS * 0.25)} puntos de entrenamiento`,
    icon: '⚡',
    points: 250,
  },
  {
    id: 'halfway',
    milestone: 50,
    title: 'Punto Medio',
    description: `Has dominado la mitad del programa - ${Math.round(TOTAL_POSSIBLE_POINTS * 0.5)} puntos`,
    icon: '🎯',
    points: 500,
  },
  {
    id: 'three-quarter',
    milestone: 75,
    title: 'Casi Maestro',
    description: `Has alcanzado ${Math.round(TOTAL_POSSIBLE_POINTS * 0.75)} puntos - Casi completo!`,
    icon: '⭐',
    points: 750,
  },
  {
    id: 'master',
    milestone: 100,
    title: 'Maestría Entrevistas',
    description: `¡Felicidades! Has completado todo el programa de Pillar 3 - ${TOTAL_POSSIBLE_POINTS} puntos`,
    icon: '👑',
    points: 1000,
  },
]

/**
 * Calculate progress percentage based on completed modules and their points
 */
export function calculateProgressPercentage(completedModuleIds: string[]): number {
  const completedPoints = completedModuleIds.reduce((sum, moduleId) => {
    const module = PILLAR3_MODULES.find((m) => m.id === moduleId)
    return sum + (module?.points || 0)
  }, 0)

  return Math.round((completedPoints / TOTAL_POSSIBLE_POINTS) * 100)
}

/**
 * Get the current achievement milestone
 */
export function getCurrentAchievement(progressPercentage: number): Achievement {
  let currentAchievement = ACHIEVEMENTS[0]
  
  for (const achievement of ACHIEVEMENTS) {
    if (progressPercentage >= achievement.milestone) {
      currentAchievement = achievement
    }
  }
  
  return currentAchievement
}

/**
 * Get next achievement to unlock
 */
export function getNextAchievement(progressPercentage: number): Achievement | null {
  for (const achievement of ACHIEVEMENTS) {
    if (progressPercentage < achievement.milestone) {
      return achievement
    }
  }
  return null
}

/**
 * Get points needed to reach next milestone
 */
export function getPointsToNextMilestone(progressPercentage: number): number {
  const nextAchievement = getNextAchievement(progressPercentage)
  if (!nextAchievement) return 0
  
  const nextMilestonePercentage = nextAchievement.milestone
  const currentMilestonePoints = Math.round((progressPercentage / 100) * TOTAL_POSSIBLE_POINTS)
  const nextMilestonePoints = Math.round((nextMilestonePercentage / 100) * TOTAL_POSSIBLE_POINTS)
  
  return nextMilestonePoints - currentMilestonePoints
}

/**
 * Get all unlocked achievements for a progress percentage
 */
export function getUnlockedAchievements(progressPercentage: number): Achievement[] {
  return ACHIEVEMENTS.filter((a) => progressPercentage >= a.milestone)
}

/**
 * Calculate total XP points earned
 */
export function calculateTotalPoints(completedModuleIds: string[]): number {
  return completedModuleIds.reduce((sum, moduleId) => {
    const module = PILLAR3_MODULES.find((m) => m.id === moduleId)
    return sum + (module?.points || 0)
  }, 0)
}
