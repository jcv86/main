// A2 Day Progression & Unlocking System
// Tracks user progress through 90-day journey and unlocks A3 modules

export interface UserA2Progress {
  userId: string
  currentDay: number
  completedDays: number[]
  unlockedDays: number[]
  unlockedA3Modules: string[]
  lastCompletedDate: Date
  journeyStartDate: Date
}

export interface DayCompletion {
  dayNumber: number
  completedDate: Date
  timeSpent: number // in minutes
  notes?: string
  score?: number // 0-100
}

// Map days to A3 modules that unlock
export const A2_TO_A3_UNLOCKS: Record<number, string> = {
  3: 'rol-objetivo',
  6: 'marca-personal',
  10: 'estrategia-busqueda',
  12: 'logros-medibles',
  15: 'portafolio-digital',
  20: 'presentacion-profesional',
  31: 'busqueda-activa',
  35: 'primera-entrevista',
  40: 'accion-real-iniciada',
  50: 'semana-8-checkpoint',
  55: 'oferta-aceptada',
  60: 'fase-accion-completa',
  61: 'solidificacion-inicial',
  69: 'integracion-completa',
  75: 'refinement-phase-complete',
  85: 'recta-final-iniciada',
  90: 'dia-90-completado'
}

// Get next day to unlock
export function getNextUnlockedDay(currentDay: number): number {
  return Math.min(currentDay + 1, 90)
}

// Get all A3 modules unlocked by a specific day
export function getUnlockedA3ModulesByDay(day: number): string[] {
  const modules: string[] = []
  for (let d = 1; d <= day; d++) {
    if (A2_TO_A3_UNLOCKS[d]) {
      modules.push(A2_TO_A3_UNLOCKS[d])
    }
  }
  return modules
}

// Complete a day
export function completeDay(
  progress: UserA2Progress,
  dayNumber: number,
  completion: DayCompletion
): UserA2Progress {
  if (dayNumber < 1 || dayNumber > 90) {
    throw new Error('Invalid day number')
  }

  if (!progress.completedDays.includes(dayNumber)) {
    progress.completedDays.push(dayNumber)
  }

  // Unlock next days
  const nextDay = getNextUnlockedDay(dayNumber)
  if (!progress.unlockedDays.includes(nextDay)) {
    progress.unlockedDays.push(nextDay)
  }

  // Check for A3 module unlocks
  if (A2_TO_A3_UNLOCKS[dayNumber]) {
    const module = A2_TO_A3_UNLOCKS[dayNumber]
    if (!progress.unlockedA3Modules.includes(module)) {
      progress.unlockedA3Modules.push(module)
    }
  }

  // Update current day
  progress.currentDay = Math.max(progress.currentDay, dayNumber)
  progress.lastCompletedDate = completion.completedDate

  return progress
}

// Calculate progress percentage
export function getProgressPercentage(progress: UserA2Progress): number {
  return Math.round((progress.completedDays.length / 90) * 100)
}

// Check if day is unlocked
export function isDayUnlocked(progress: UserA2Progress, dayNumber: number): boolean {
  return progress.unlockedDays.includes(dayNumber)
}

// Get estimated days until completion
export function estimateDaysUntilCompletion(progress: UserA2Progress): number {
  const completed = progress.completedDays.length
  return 90 - completed
}

// Initialize new user progress
export function initializeUserProgress(userId: string): UserA2Progress {
  return {
    userId,
    currentDay: 1,
    completedDays: [],
    unlockedDays: [1, 2, 3], // First 3 days unlocked by default
    unlockedA3Modules: getUnlockedA3ModulesByDay(3), // Modules unlocked by day 3
    lastCompletedDate: new Date(),
    journeyStartDate: new Date()
  }
}

// Get phase info for a day
export function getPhaseInfo(dayNumber: number): { name: string; color: string } {
  if (dayNumber >= 1 && dayNumber <= 10) {
    return { name: 'Claridad', color: 'blue' }
  } else if (dayNumber >= 11 && dayNumber <= 30) {
    return { name: 'Material', color: 'purple' }
  } else if (dayNumber >= 31 && dayNumber <= 60) {
    return { name: 'Acción Real', color: 'green' }
  } else {
    return { name: 'Refinamiento', color: 'amber' }
  }
}

// Get recommended A3 modules for user based on progress
export function getRecommendedA3Modules(progress: UserA2Progress): string[] {
  return progress.unlockedA3Modules
}

// Check if user should access specific day
export function canAccessDay(progress: UserA2Progress, dayNumber: number): boolean {
  // Can always access unlocked days
  if (progress.unlockedDays.includes(dayNumber)) {
    return true
  }
  // Can access current day if it's unlocked
  if (dayNumber === progress.currentDay) {
    return progress.unlockedDays.includes(dayNumber)
  }
  return false
}

// Generate milestone data for progress tracking
export interface MilestoneData {
  dayNumber: number
  type: 'checkpoint' | 'a3-unlock' | 'phase-end'
  title: string
  description: string
  isCompleted: boolean
}

export function getMilestones(progress: UserA2Progress): MilestoneData[] {
  const milestones: MilestoneData[] = []

  const checkpoints = [10, 20, 30, 40, 50, 60, 70, 80, 90]
  const phaseEnds = [10, 30, 60, 90]

  for (let day = 1; day <= 90; day++) {
    if (A2_TO_A3_UNLOCKS[day]) {
      milestones.push({
        dayNumber: day,
        type: 'a3-unlock',
        title: `Desbloquea: ${A2_TO_A3_UNLOCKS[day]}`,
        description: `Módulo A3 disponible`,
        isCompleted: progress.completedDays.includes(day)
      })
    }

    if (phaseEnds.includes(day)) {
      const phaseName = getPhaseInfo(day).name
      milestones.push({
        dayNumber: day,
        type: 'phase-end',
        title: `Fin de fase: ${phaseName}`,
        description: `Checkpoint de ${phaseName}`,
        isCompleted: progress.completedDays.includes(day)
      })
    }
  }

  return milestones.sort((a, b) => a.dayNumber - b.dayNumber)
}
