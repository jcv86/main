// Gamification system for the career development platform
export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "reading" | "learning" | "career" | "social" | "milestone"
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
  requirements: {
    type: "books_read" | "pages_read" | "streak_days" | "tests_completed" | "skills_assessed" | "time_spent"
    value: number
  }
  unlocked: boolean
  unlockedAt?: string
}

export interface UserStats {
  totalPoints: number
  level: number
  currentStreak: number
  longestStreak: number
  booksCompleted: number
  pagesRead: number
  timeSpent: number // in minutes
  testsCompleted: number
  skillsAssessed: number
  achievements: Achievement[]
}

export interface LevelInfo {
  level: number
  title: string
  minPoints: number
  maxPoints: number
  benefits: string[]
}

// Level system
export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    title: "Aprendiz",
    minPoints: 0,
    maxPoints: 499,
    benefits: ["Acceso a libros gratuitos", "Seguimiento básico de progreso"],
  },
  {
    level: 2,
    title: "Estudiante",
    minPoints: 500,
    maxPoints: 1499,
    benefits: ["Acceso a más contenido", "Estadísticas detalladas", "Primeros logros"],
  },
  {
    level: 3,
    title: "Practicante",
    minPoints: 1500,
    maxPoints: 3499,
    benefits: ["Recomendaciones personalizadas", "Metas personalizadas", "Insignias especiales"],
  },
  {
    level: 4,
    title: "Experto",
    minPoints: 3500,
    maxPoints: 7499,
    benefits: ["Contenido premium", "Mentorías virtuales", "Certificados"],
  },
  {
    level: 5,
    title: "Maestro",
    minPoints: 7500,
    maxPoints: 14999,
    benefits: ["Acceso VIP", "Contenido exclusivo", "Networking premium"],
  },
  {
    level: 6,
    title: "Gurú",
    minPoints: 15000,
    maxPoints: 29999,
    benefits: ["Todas las funciones", "Acceso anticipado", "Comunidad élite"],
  },
  {
    level: 7,
    title: "Leyenda",
    minPoints: 30000,
    maxPoints: Number.POSITIVE_INFINITY,
    benefits: ["Estatus legendario", "Reconocimiento especial", "Influencia en la plataforma"],
  },
]

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  // Reading Achievements
  {
    id: "first_book",
    title: "Primer Libro",
    description: "Completa tu primer libro",
    icon: "📖",
    category: "reading",
    points: 100,
    rarity: "common",
    requirements: { type: "books_read", value: 1 },
    unlocked: false,
  },
  {
    id: "bookworm",
    title: "Ratón de Biblioteca",
    description: "Lee 5 libros completos",
    icon: "🐛",
    category: "reading",
    points: 500,
    rarity: "rare",
    requirements: { type: "books_read", value: 5 },
    unlocked: false,
  },
  {
    id: "scholar",
    title: "Erudito",
    description: "Lee 10 libros completos",
    icon: "🎓",
    category: "reading",
    points: 1000,
    rarity: "epic",
    requirements: { type: "books_read", value: 10 },
    unlocked: false,
  },
  {
    id: "page_turner",
    title: "Devorador de Páginas",
    description: "Lee 1000 páginas",
    icon: "📚",
    category: "reading",
    points: 300,
    rarity: "common",
    requirements: { type: "pages_read", value: 1000 },
    unlocked: false,
  },
  {
    id: "speed_reader",
    title: "Lector Veloz",
    description: "Lee 5000 páginas",
    icon: "⚡",
    category: "reading",
    points: 800,
    rarity: "rare",
    requirements: { type: "pages_read", value: 5000 },
    unlocked: false,
  },

  // Streak Achievements
  {
    id: "consistent",
    title: "Consistente",
    description: "Mantén una racha de lectura de 7 días",
    icon: "🔥",
    category: "reading",
    points: 200,
    rarity: "common",
    requirements: { type: "streak_days", value: 7 },
    unlocked: false,
  },
  {
    id: "dedicated",
    title: "Dedicado",
    description: "Mantén una racha de lectura de 30 días",
    icon: "💪",
    category: "reading",
    points: 600,
    rarity: "rare",
    requirements: { type: "streak_days", value: 30 },
    unlocked: false,
  },
  {
    id: "unstoppable",
    title: "Imparable",
    description: "Mantén una racha de lectura de 100 días",
    icon: "🚀",
    category: "reading",
    points: 1500,
    rarity: "legendary",
    requirements: { type: "streak_days", value: 100 },
    unlocked: false,
  },

  // Learning Achievements
  {
    id: "test_taker",
    title: "Evaluador",
    description: "Completa tu primera evaluación",
    icon: "✅",
    category: "learning",
    points: 50,
    rarity: "common",
    requirements: { type: "tests_completed", value: 1 },
    unlocked: false,
  },
  {
    id: "skill_explorer",
    title: "Explorador de Habilidades",
    description: "Evalúa 5 habilidades diferentes",
    icon: "🎯",
    category: "learning",
    points: 250,
    rarity: "common",
    requirements: { type: "skills_assessed", value: 5 },
    unlocked: false,
  },
  {
    id: "knowledge_seeker",
    title: "Buscador de Conocimiento",
    description: "Completa 10 evaluaciones",
    icon: "🔍",
    category: "learning",
    points: 400,
    rarity: "rare",
    requirements: { type: "tests_completed", value: 10 },
    unlocked: false,
  },

  // Time-based Achievements
  {
    id: "time_investor",
    title: "Inversor de Tiempo",
    description: "Dedica 10 horas al aprendizaje",
    icon: "⏰",
    category: "learning",
    points: 300,
    rarity: "common",
    requirements: { type: "time_spent", value: 600 }, // 10 hours in minutes
    unlocked: false,
  },
  {
    id: "marathon_learner",
    title: "Aprendiz Maratonista",
    description: "Dedica 50 horas al aprendizaje",
    icon: "🏃",
    category: "learning",
    points: 1000,
    rarity: "epic",
    requirements: { type: "time_spent", value: 3000 }, // 50 hours in minutes
    unlocked: false,
  },

  // Milestone Achievements
  {
    id: "level_up",
    title: "Subida de Nivel",
    description: "Alcanza el nivel 2",
    icon: "⬆️",
    category: "milestone",
    points: 100,
    rarity: "common",
    requirements: { type: "books_read", value: 1 }, // Custom logic needed
    unlocked: false,
  },
  {
    id: "expert_status",
    title: "Estatus de Experto",
    description: "Alcanza el nivel 4",
    icon: "👑",
    category: "milestone",
    points: 500,
    rarity: "epic",
    requirements: { type: "books_read", value: 1 }, // Custom logic needed
    unlocked: false,
  },
]

// Points system
export const POINTS = {
  PAGE_READ: 1,
  CHAPTER_COMPLETED: 10,
  BOOK_COMPLETED: 100,
  TEST_COMPLETED: 50,
  SKILL_ASSESSED: 25,
  DAILY_LOGIN: 5,
  STREAK_BONUS: 2, // per day of streak
  ACHIEVEMENT_BONUS: 50,
}

// Utility functions
export function calculateLevel(points: number): number {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (points >= LEVELS[i].minPoints) {
      return LEVELS[i].level
    }
  }
  return 1
}

export function getLevelInfo(level: number): LevelInfo {
  return LEVELS.find((l) => l.level === level) || LEVELS[0]
}

export function getNextLevelInfo(currentLevel: number): LevelInfo | null {
  return LEVELS.find((l) => l.level === currentLevel + 1) || null
}

export function calculateProgressToNextLevel(points: number): { current: number; needed: number; percentage: number } {
  const currentLevel = calculateLevel(points)
  const nextLevel = getNextLevelInfo(currentLevel)

  if (!nextLevel) {
    return { current: points, needed: 0, percentage: 100 }
  }

  const currentLevelInfo = getLevelInfo(currentLevel)
  const pointsInCurrentLevel = points - currentLevelInfo.minPoints
  const pointsNeededForNextLevel = nextLevel.minPoints - currentLevelInfo.minPoints

  return {
    current: pointsInCurrentLevel,
    needed: pointsNeededForNextLevel,
    percentage: Math.round((pointsInCurrentLevel / pointsNeededForNextLevel) * 100),
  }
}

export function checkAchievements(userStats: UserStats): Achievement[] {
  const newAchievements: Achievement[] = []

  for (const achievement of ACHIEVEMENTS) {
    if (achievement.unlocked) continue

    let requirementMet = false

    switch (achievement.requirements.type) {
      case "books_read":
        requirementMet = userStats.booksCompleted >= achievement.requirements.value
        break
      case "pages_read":
        requirementMet = userStats.pagesRead >= achievement.requirements.value
        break
      case "streak_days":
        requirementMet = userStats.currentStreak >= achievement.requirements.value
        break
      case "tests_completed":
        requirementMet = userStats.testsCompleted >= achievement.requirements.value
        break
      case "skills_assessed":
        requirementMet = userStats.skillsAssessed >= achievement.requirements.value
        break
      case "time_spent":
        requirementMet = userStats.timeSpent >= achievement.requirements.value
        break
    }

    if (requirementMet) {
      const unlockedAchievement = {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      }
      newAchievements.push(unlockedAchievement)
    }
  }

  return newAchievements
}

export function awardPoints(userStats: UserStats, action: keyof typeof POINTS, amount = 1): number {
  const basePoints = POINTS[action] * amount
  let bonusPoints = 0

  // Streak bonus
  if (action === "PAGE_READ" && userStats.currentStreak > 0) {
    bonusPoints += Math.floor(userStats.currentStreak / 7) * POINTS.STREAK_BONUS
  }

  return basePoints + bonusPoints
}

// Mock user stats for demo
export const mockUserStats: UserStats = {
  totalPoints: 1250,
  level: 3,
  currentStreak: 12,
  longestStreak: 25,
  booksCompleted: 2,
  pagesRead: 847,
  timeSpent: 420, // 7 hours
  testsCompleted: 3,
  skillsAssessed: 8,
  achievements: [
    { ...ACHIEVEMENTS[0], unlocked: true, unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { ...ACHIEVEMENTS[3], unlocked: true, unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { ...ACHIEVEMENTS[5], unlocked: true, unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { ...ACHIEVEMENTS[7], unlocked: true, unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { ...ACHIEVEMENTS[9], unlocked: true, unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  ],
}
