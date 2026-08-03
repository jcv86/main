import 'server-only'

import { createAdminClient } from '@/lib/supabase/server'

const TOTAL_TRAINING_MODULES = 10
const XP_PER_LEVEL = 1000

export interface GamificationSummary {
  totalXp: number
  currentLevel: number
  levelLabel: string
  xpToNextLevel: number
  dailyStreak: number
  totalPoints: number
  badges: string[]
  training: {
    xp: number
    completed: number
    total: number
    progress: number
    practicesCompleted: number
    interviewsCompleted: number
  }
  radar: {
    completed: number
    total: number
    progress: number
  }
  interviewBonus: number
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (value && typeof value === 'object') return Object.keys(value)
  return []
}

export function emptyGamificationSummary(): GamificationSummary {
  return {
    totalXp: 0,
    currentLevel: 1,
    levelLabel: 'Bronze',
    xpToNextLevel: XP_PER_LEVEL,
    dailyStreak: 0,
    totalPoints: 0,
    badges: [],
    training: {
      xp: 0,
      completed: 0,
      total: TOTAL_TRAINING_MODULES,
      progress: 0,
      practicesCompleted: 0,
      interviewsCompleted: 0,
    },
    radar: { completed: 0, total: 0, progress: 0 },
    interviewBonus: 0,
  }
}

export async function getGamificationSummary(
  userId: string,
): Promise<GamificationSummary> {
  const supabase = createAdminClient()

  const [coreResult, profileResult, trainingResult, radarResult, balanceResult] =
    await Promise.all([
      supabase
        .from('a3_user_progress')
        .select('total_xp, completed_module_ids')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('user_gamification_profile')
        .select(
          'current_level, total_xp, interview_streak, total_interviews_completed, badges, achievements',
        )
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('a3_training_module_completions')
        .select('xp_amount, is_first_completion')
        .eq('user_id', userId),
      supabase
        .from('a4_module_progress')
        .select('completado, progreso_porcentaje')
        .eq('user_id', userId),
      supabase
        .from('user_dtc_balance')
        .select('balance')
        .eq('user_id', userId)
        .maybeSingle(),
    ])

  const core = coreResult.data
  const profile = profileResult.data
  const practices = trainingResult.data || []
  const radarModules = radarResult.data || []

  const completedModuleIds = Array.from(
    new Set(stringList(core?.completed_module_ids)),
  )
  const coreXp = Math.max(0, Number(core?.total_xp) || 0)
  const profileXp = Math.max(0, Number(profile?.total_xp) || 0)
  const practiceXp = practices.reduce(
    (sum, practice) =>
      practice.is_first_completion === false
        ? sum
        : sum + Math.max(0, Number(practice.xp_amount) || 0),
    0,
  )
  const totalXp = coreXp + profileXp
  const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1
  const xpToNextLevel = currentLevel * XP_PER_LEVEL - totalXp

  const completedRadar = radarModules.filter((module) => module.completado).length
  const radarProgress = radarModules.length
    ? Math.round(
        radarModules.reduce(
          (sum, module) =>
            sum + Math.max(0, Number(module.progreso_porcentaje) || 0),
          0,
        ) / radarModules.length,
      )
    : 0

  const badges = [
    ...stringList(profile?.badges),
    ...stringList(profile?.achievements),
  ]
  if (totalXp >= 2500) badges.push('2.5k XP')
  if (totalXp >= 5000) badges.push('5k XP')
  if (totalXp >= 10000) badges.push('10k XP')
  if (completedModuleIds.length >= TOTAL_TRAINING_MODULES) {
    badges.push('Entrenamiento completado')
  }
  if (radarModules.length > 0 && completedRadar === radarModules.length) {
    badges.push('Radar completado')
  }

  return {
    totalXp,
    currentLevel,
    levelLabel:
      typeof profile?.current_level === 'string'
        ? profile.current_level
        : `Nivel ${currentLevel}`,
    xpToNextLevel,
    dailyStreak: Math.max(0, Number(profile?.interview_streak) || 0),
    totalPoints: Math.max(0, Number(balanceResult.data?.balance) || 0),
    badges: [...new Set(badges)],
    training: {
      xp: coreXp,
      completed: completedModuleIds.length,
      total: TOTAL_TRAINING_MODULES,
      progress: Math.min(
        100,
        Math.round(
          (completedModuleIds.length / TOTAL_TRAINING_MODULES) * 100,
        ),
      ),
      practicesCompleted: practices.length,
      interviewsCompleted: Math.max(
        0,
        Number(profile?.total_interviews_completed) || 0,
      ),
    },
    radar: {
      completed: completedRadar,
      total: radarModules.length,
      progress: radarProgress,
    },
    interviewBonus: Math.max(0, profileXp - practiceXp),
  }
}
