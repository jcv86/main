import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextResponse } from 'next/server'

const TOTAL_A3_MODULES = 10
const XP_PER_LEVEL = 1000

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (value && typeof value === 'object') {
    return Object.keys(value)
  }

  return []
}

function emptyPayload() {
  return {
    total_xp: 0,
    current_level: 1,
    level_label: 'Bronze',
    xp_to_next_level: XP_PER_LEVEL,
    daily_streak: 0,
    total_points: 0,
    badges: [],
    sections: {},
    breakdown: {
      a3_xp: 0,
      training_xp: 0,
      a4_xp: 0,
      interview_bonus: 0,
    },
  }
}

/**
 * Consolidated gamification dashboard built from tables that exist in the
 * active DTC Supabase project.
 */
export async function GET() {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json(emptyPayload(), { status: 200 })
    }

    const userId = currentUser.id
    const supabase = createAdminClient()

    const [
      coreProgressResult,
      profileResult,
      trainingResult,
      a4Result,
      dtcResult,
    ] = await Promise.all([
      supabase
        .from('a3_user_progress')
        .select('total_xp, completed_module_ids, updated_at')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('user_gamification_profile')
        .select(
          'current_level, current_xp, total_xp, interview_streak, total_interviews_completed, badges, achievements',
        )
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('a3_training_module_completions')
        .select('id, training_type, xp_amount, is_first_completion, first_completion_at, created_at')
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

    if (coreProgressResult.error) {
      console.error('[v0] Error fetching canonical A3 progress:', coreProgressResult.error)
    }
    if (profileResult.error) {
      console.error('[v0] Error fetching gamification profile:', profileResult.error)
    }
    if (trainingResult.error) {
      console.error('[v0] Error fetching A3 training completions:', trainingResult.error)
    }
    if (a4Result.error) {
      console.error('[v0] Error fetching A4 progress:', a4Result.error)
    }
    if (dtcResult.error) {
      console.error('[v0] Error fetching DTC balance:', dtcResult.error)
    }

    const coreProgress = coreProgressResult.data
    const profile = profileResult.data
    const trainingCompletions = trainingResult.data || []
    const a4Modules = a4Result.data || []

    const completedA3Ids = Array.from(
      new Set(stringList(coreProgress?.completed_module_ids)),
    )
    const coreA3Xp = Math.max(0, Number(coreProgress?.total_xp) || 0)
    const profileXp = Math.max(0, Number(profile?.total_xp) || 0)
    const trainingXp = trainingCompletions.reduce(
      (sum, completion) =>
        completion.is_first_completion === false
          ? sum
          : sum + Math.max(0, Number(completion.xp_amount) || 0),
      0,
    )
    const interviewBonus = Math.max(0, profileXp - trainingXp)
    const totalXp = coreA3Xp + profileXp
    const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1
    const xpToNextLevel = currentLevel * XP_PER_LEVEL - totalXp

    const completedA4 = a4Modules.filter((module) => module.completado).length
    const totalA4 = a4Modules.length
    const a4Progress =
      totalA4 > 0
        ? Math.round(
            a4Modules.reduce(
              (sum, module) => sum + Math.max(0, Number(module.progreso_porcentaje) || 0),
              0,
            ) / totalA4,
          )
        : 0

    const badges = [
      ...stringList(profile?.badges),
      ...stringList(profile?.achievements),
    ]

    if (totalXp >= 2500) badges.push('🚀 2.5k XP')
    if (totalXp >= 5000) badges.push('💎 5k XP Master')
    if (totalXp >= 10000) badges.push('🌟 10k XP Legend')
    if (completedA3Ids.length >= TOTAL_A3_MODULES) badges.push('🎤 A3 completado')
    if (totalA4 > 0 && completedA4 === totalA4) badges.push('🎓 A4 completado')

    return NextResponse.json(
      {
        total_xp: totalXp,
        current_level: currentLevel,
        level_label: profile?.current_level || 'Bronze',
        xp_to_next_level: xpToNextLevel,
        daily_streak: Math.max(0, Number(profile?.interview_streak) || 0),
        total_points: Math.max(0, Number(dtcResult.data?.balance) || 0),
        badges: [...new Set(badges)],
        sections: {
          a3: {
            name: 'Entrenamiento',
            xp: coreA3Xp,
            completed: completedA3Ids.length,
            total: TOTAL_A3_MODULES,
            progress: Math.min(
              100,
              Math.round((completedA3Ids.length / TOTAL_A3_MODULES) * 100),
            ),
          },
          training: {
            name: 'Prácticas y simulaciones',
            xp: trainingXp,
            completed: trainingCompletions.length,
            interviews: Math.max(0, Number(profile?.total_interviews_completed) || 0),
          },
          a4: {
            name: 'Radar Estratégico',
            xp: 0,
            completed: completedA4,
            total: totalA4,
            progress: a4Progress,
          },
        },
        breakdown: {
          a3_xp: coreA3Xp,
          training_xp: trainingXp,
          a4_xp: 0,
          interview_bonus: interviewBonus,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('[v0] Error fetching global gamification:', error)
    return NextResponse.json(emptyPayload(), { status: 200 })
  }
}
