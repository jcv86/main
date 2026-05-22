export type BadgeType = 'first-step' | 'quarter-complete' | 'half-complete' | 'three-quarter-complete' | 'full-complete'

export interface Badge {
  id: BadgeType
  title: string
  description: string
  icon: string
  color: string
  requiredPercentage: number
  earnedAt?: string
}

export const BADGES: Record<BadgeType, Badge> = {
  'first-step': {
    id: 'first-step',
    title: 'Primer Paso',
    description: 'Completaste tu primera tarea en A2',
    icon: '🚀',
    color: 'from-blue-400 to-cyan-400',
    requiredPercentage: 1
  },
  'quarter-complete': {
    id: 'quarter-complete',
    title: '25% del Camino',
    description: 'Completaste el 25% de las tareas',
    icon: '📈',
    color: 'from-emerald-400 to-teal-400',
    requiredPercentage: 25
  },
  'half-complete': {
    id: 'half-complete',
    title: 'Mitad del Camino',
    description: 'Completaste el 50% de las tareas',
    icon: '⚡',
    color: 'from-purple-400 to-pink-400',
    requiredPercentage: 50
  },
  'three-quarter-complete': {
    id: 'three-quarter-complete',
    title: '75% Completo',
    description: 'Estás casi ahí! Completaste el 75%',
    icon: '💪',
    color: 'from-orange-400 to-red-400',
    requiredPercentage: 75
  },
  'full-complete': {
    id: 'full-complete',
    title: 'Maestría Alcanzada',
    description: 'Completaste todas las tareas - ¡Felicidades!',
    icon: '🏆',
    color: 'from-amber-300 to-yellow-400',
    requiredPercentage: 100
  }
}

export function calculateBadges(completedTasks: number, totalTasks: number): BadgeType[] {
  if (totalTasks === 0) return []
  
  const percentage = (completedTasks / totalTasks) * 100
  const unlockedBadges: BadgeType[] = []

  Object.entries(BADGES).forEach(([_, badge]) => {
    if (percentage >= badge.requiredPercentage) {
      unlockedBadges.push(badge.id)
    }
  })

  return unlockedBadges
}

export function getNextBadge(completedTasks: number, totalTasks: number): Badge | null {
  if (totalTasks === 0) return null
  
  const percentage = (completedTasks / totalTasks) * 100
  const unlockedBadges = calculateBadges(completedTasks, totalTasks)

  // Find the next badge not yet earned
  for (const badgeId of Object.keys(BADGES)) {
    if (!unlockedBadges.includes(badgeId as BadgeType)) {
      const badge = BADGES[badgeId as BadgeType]
      return {
        ...badge,
        requiredPercentage: badge.requiredPercentage
      }
    }
  }

  return null
}

export function getProgressToNextBadge(completedTasks: number, totalTasks: number): {
  percentage: number
  tasksNeeded: number
} {
  if (totalTasks === 0) return { percentage: 0, tasksNeeded: 0 }
  
  const currentPercentage = (completedTasks / totalTasks) * 100
  const nextBadge = getNextBadge(completedTasks, totalTasks)

  if (!nextBadge) {
    return { percentage: 100, tasksNeeded: 0 }
  }

  const tasksNeeded = Math.ceil((nextBadge.requiredPercentage * totalTasks) / 100) - completedTasks
  const progressPercentage = ((currentPercentage - (nextBadge.requiredPercentage - 25)) / 25) * 100

  return {
    percentage: Math.max(0, Math.min(100, progressPercentage)),
    tasksNeeded: Math.max(0, tasksNeeded)
  }
}
