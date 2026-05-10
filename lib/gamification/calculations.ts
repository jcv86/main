/**
 * Gamification utility functions for XP, level calculations and DTC coin management
 */

export const LEVEL_CONFIG = {
  BASE_XP_PER_LEVEL: 1000,
  XP_INCREMENT_PER_LEVEL: 100, // Each level requires 100 more XP than the previous
  MAX_LEVEL: 100,
}

export const XP_SOURCES = {
  A3_SESSION_COMPLETE: 150,
  A3_SESSION_PERFECT: 200,
  A4_QUIZ_COMPLETE: 100,
  A4_QUIZ_PERFECT: 150,
  A4_ARTICLE_READ: 50,
  INTERVIEW_PREP: 200,
  INTERVIEW_COMPLETE: 500,
  DAILY_STREAK: 50,
  WEEKLY_CHALLENGE: 300,
  BADGE_UNLOCK: 100,
  MISSION_COMPLETE: 250,
}

export const DTC_SOURCES = {
  INTERVIEW_COMPLETE: 100,
  PERFECT_SCORE: 50,
  FIRST_INTERVIEW: 250,
  WEEKLY_ACHIEVEMENT: 100,
  BADGE_UNLOCK: 75,
  REFER_USER: 150,
}

/**
 * Calculate the XP required to reach the next level
 */
export function getXPForLevel(level: number): number {
  if (level <= 1) return LEVEL_CONFIG.BASE_XP_PER_LEVEL
  if (level > LEVEL_CONFIG.MAX_LEVEL) return Infinity
  return LEVEL_CONFIG.BASE_XP_PER_LEVEL + (level - 1) * LEVEL_CONFIG.XP_INCREMENT_PER_LEVEL
}

/**
 * Calculate cumulative XP needed to reach a specific level from level 1
 */
export function getCumulativeXPForLevel(level: number): number {
  if (level <= 1) return 0
  let total = 0
  for (let i = 1; i < level; i++) {
    total += getXPForLevel(i)
  }
  return total
}

/**
 * Get current level based on total XP
 */
export function getLevelFromXP(totalXP: number): { level: number; currentXP: number; nextLevelXP: number } {
  let level = 1
  let cumulativeXP = 0

  while (level < LEVEL_CONFIG.MAX_LEVEL) {
    const xpForNextLevel = getXPForLevel(level + 1)
    const nextCumulativeXP = cumulativeXP + xpForNextLevel

    if (totalXP < nextCumulativeXP) {
      break
    }

    cumulativeXP = nextCumulativeXP
    level += 1
  }

  const currentLevelXP = getCumulativeXPForLevel(level)
  const nextLevelXP = getCumulativeXPForLevel(level + 1)
  const currentXP = totalXP - currentLevelXP

  return {
    level,
    currentXP,
    nextLevelXP: nextLevelXP - currentLevelXP,
  }
}

/**
 * Get XP breakdown by section
 */
export function getXPBreakdown(
  a3XP: number,
  a4XP: number,
  interviewXP: number
) {
  const total = a3XP + a4XP + interviewXP

  if (total === 0) {
    return {
      a3: { xp: 0, percentage: 0 },
      a4: { xp: 0, percentage: 0 },
      interviews: { xp: 0, percentage: 0 },
      total,
    }
  }

  return {
    a3: { xp: a3XP, percentage: Math.round((a3XP / total) * 100) },
    a4: { xp: a4XP, percentage: Math.round((a4XP / total) * 100) },
    interviews: { xp: interviewXP, percentage: Math.round((interviewXP / total) * 100) },
    total,
  }
}

/**
 * Calculate ranking tier based on global rank
 */
export function getRankingTier(rank: number): {
  tier: string
  color: string
  icon: string
  description: string
} {
  if (rank <= 10) {
    return {
      tier: 'Diamond',
      color: '#00d4ff',
      icon: '💎',
      description: 'Top 10 users',
    }
  } else if (rank <= 50) {
    return {
      tier: 'Platinum',
      color: '#e5ad00',
      icon: '⭐',
      description: 'Top 50 users',
    }
  } else if (rank <= 100) {
    return {
      tier: 'Gold',
      color: '#ffd700',
      icon: '🏆',
      description: 'Top 100 users',
    }
  } else if (rank <= 500) {
    return {
      tier: 'Silver',
      color: '#c0c0c0',
      icon: '🥈',
      description: 'Top 500 users',
    }
  } else if (rank <= 1000) {
    return {
      tier: 'Bronze',
      color: '#cd7f32',
      icon: '🥉',
      description: 'Top 1000 users',
    }
  } else {
    return {
      tier: 'Rising',
      color: '#888888',
      icon: '📈',
      description: 'Growing member',
    }
  }
}

/**
 * Calculate percentile rank
 */
export function getPercentileRank(currentRank: number, totalUsers: number): number {
  if (totalUsers === 0) return 100
  return Math.round((1 - currentRank / totalUsers) * 100)
}

/**
 * Validate DTC transaction
 */
export function validateDTCTransaction(
  currentBalance: number,
  amount: number,
  type: 'earn' | 'spend'
): { valid: boolean; error?: string } {
  if (amount < 0) {
    return { valid: false, error: 'Amount must be positive' }
  }

  if (type === 'spend' && currentBalance < amount) {
    return { valid: false, error: 'Insufficient DTC balance' }
  }

  return { valid: true }
}

/**
 * Calculate DTC earning from interview performance
 */
export function calculateDTCFromInterview(
  score: number,
  maxScore: number = 1000
): number {
  const percentage = (score / maxScore) * 100

  if (percentage >= 90) {
    return DTC_SOURCES.PERFECT_SCORE + DTC_SOURCES.INTERVIEW_COMPLETE
  } else if (percentage >= 70) {
    return DTC_SOURCES.INTERVIEW_COMPLETE
  } else if (percentage >= 50) {
    return Math.floor(DTC_SOURCES.INTERVIEW_COMPLETE * 0.5)
  }

  return 0
}

/**
 * Format XP for display
 */
export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M XP`
  } else if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K XP`
  }
  return `${xp} XP`
}

/**
 * Format DTC for display
 */
export function formatDTC(dtc: number): string {
  return `${dtc} DTC`
}

/**
 * Get streak status
 */
export function getStreakStatus(currentStreak: number): {
  status: string
  emoji: string
  message: string
} {
  if (currentStreak === 0) {
    return {
      status: 'inactive',
      emoji: '⏹️',
      message: 'Start your streak today!',
    }
  } else if (currentStreak <= 2) {
    return {
      status: 'starting',
      emoji: '🔥',
      message: `Great start! ${currentStreak} day${currentStreak > 1 ? 's' : ''}`,
    }
  } else if (currentStreak <= 7) {
    return {
      status: 'active',
      emoji: '🔥',
      message: `Week on fire! ${currentStreak} days`,
    }
  } else if (currentStreak <= 30) {
    return {
      status: 'hot',
      emoji: '🌟',
      message: `Incredible! ${currentStreak} days in a row`,
    }
  } else {
    return {
      status: 'legendary',
      emoji: '👑',
      message: `Legendary streak! ${currentStreak} days!`,
    }
  }
}
