import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { getA2ProgressSnapshot } from '@/lib/a2/server-progress'
import { getA3AllModulesAccessState } from '@/lib/a3-access-control'
import { NextResponse } from 'next/server'

const MODULE_ORDER = [
  'career-mirror',
  'value-mining-lab',
  'cv-builder-studio',
  'job-decoder',
  'answer-architecture',
  'coach-practice-room',
  'communication-gym',
  'first-recruiter-simulation',
  'risk-difficult-questions-lab',
  'basic-interview-mission',
]

const NUMERIC_TO_SLUG: Record<string, string> = {
  'module-1': 'career-mirror',
  'module-2': 'value-mining-lab',
  'module-3': 'cv-builder-studio',
  'module-4': 'job-decoder',
  'module-5': 'answer-architecture',
  'module-6': 'coach-practice-room',
  'module-7': 'communication-gym',
  'module-8': 'first-recruiter-simulation',
  'module-9': 'risk-difficult-questions-lab',
  'module-10': 'basic-interview-mission',
}

function normalizeModuleId(id: string): string {
  return NUMERIC_TO_SLUG[id] ?? id
}

function normalizeCompletedModuleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  const ids = value
    .filter((id): id is string => typeof id === 'string')
    .map(normalizeModuleId)

  return Array.from(new Set<string>(ids))
}

const TOTAL_XP = 1340

export async function GET() {
  try {
    const supabase = createAdminClient()
    const currentUser = await resolveServerUser()
    const userId = currentUser?.id ?? null

    const unauthenticatedStates: Record<string, string> = {}
    MODULE_ORDER.forEach((id) => {
      unauthenticatedStates[id] = 'locked'
    })

    if (!userId) {
      return NextResponse.json({
        success: true,
        progress: {
          totalXp: 0,
          maxXp: TOTAL_XP,
          progressPct: 0,
          completedModules: 0,
          totalModules: MODULE_ORDER.length,
          moduleStates: unauthenticatedStates,
          completedModuleIds: [],
          a2CurrentDay: 1,
        },
      })
    }

    const [a2Snapshot, accessStates, progressResult] = await Promise.all([
      getA2ProgressSnapshot(userId, supabase),
      getA3AllModulesAccessState(userId, supabase),
      supabase
        .from('a3_user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
    ])

    if (progressResult.error) {
      console.error('[v0] Error fetching a3_user_progress:', progressResult.error)
    }

    const moduleStates: Record<string, string> = {}
    MODULE_ORDER.forEach((id) => {
      moduleStates[id] = 'locked'
    })
    accessStates.forEach((state) => {
      moduleStates[state.moduleId] = state.status
    })

    const progressData = progressResult.data
    if (progressData) {
      const completedModuleIds = normalizeCompletedModuleIds(
        progressData.completed_module_ids,
      )
      const totalXp = Math.max(0, Number(progressData.total_xp) || 0)

      completedModuleIds.forEach((id) => {
        moduleStates[id] = 'completed'
      })

      return NextResponse.json({
        success: true,
        progress: {
          totalXp,
          maxXp: TOTAL_XP,
          progressPct: Math.min(100, Math.round((totalXp / TOTAL_XP) * 100)),
          completedModules: completedModuleIds.length,
          totalModules: MODULE_ORDER.length,
          moduleStates,
          completedModuleIds,
          a2CurrentDay: a2Snapshot.currentDay,
        },
      })
    }

    return NextResponse.json({
      success: true,
      progress: {
        totalXp: 0,
        maxXp: TOTAL_XP,
        progressPct: 0,
        completedModules: 0,
        totalModules: MODULE_ORDER.length,
        moduleStates,
        completedModuleIds: [],
        a2CurrentDay: a2Snapshot.currentDay,
      },
    })
  } catch (error) {
    console.error('[v0] Error in user-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
