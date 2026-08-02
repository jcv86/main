import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { getA2ProgressSnapshot } from '@/lib/a2/server-progress'
import { getA3AllModulesAccessState } from '@/lib/a3-access-control'
import {
  A3_MODULE_IDS,
  A3_TOTAL_XP,
  normalizeA3ModuleId,
} from '@/lib/a3/module-catalog'
import { NextResponse } from 'next/server'

function normalizeCompletedModuleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return Array.from(
    new Set(
      value
        .map(normalizeA3ModuleId)
        .filter((id): id is NonNullable<typeof id> => Boolean(id)),
    ),
  )
}

export async function GET() {
  try {
    const supabase = createAdminClient()
    const currentUser = await resolveServerUser()
    const userId = currentUser?.id ?? null

    const unauthenticatedStates = Object.fromEntries(
      A3_MODULE_IDS.map((id) => [id, 'locked']),
    )

    if (!userId) {
      return NextResponse.json({
        success: true,
        progress: {
          totalXp: 0,
          maxXp: A3_TOTAL_XP,
          progressPct: 0,
          completedModules: 0,
          totalModules: A3_MODULE_IDS.length,
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

    const moduleStates: Record<string, string> = Object.fromEntries(
      A3_MODULE_IDS.map((id) => [id, 'locked']),
    )
    accessStates.forEach((state) => {
      moduleStates[state.moduleId] = state.status
    })

    const progressData = progressResult.data
    const completedModuleIds = normalizeCompletedModuleIds(
      progressData?.completed_module_ids,
    )
    const totalXp = Math.max(0, Number(progressData?.total_xp) || 0)

    completedModuleIds.forEach((id) => {
      moduleStates[id] = 'completed'
    })

    return NextResponse.json({
      success: true,
      progress: {
        totalXp,
        maxXp: A3_TOTAL_XP,
        progressPct: Math.min(
          100,
          Math.round((totalXp / A3_TOTAL_XP) * 100),
        ),
        completedModules: completedModuleIds.length,
        totalModules: A3_MODULE_IDS.length,
        moduleStates,
        completedModuleIds,
        a2CurrentDay: a2Snapshot.currentDay,
      },
    })
  } catch (error) {
    console.error('[v0] Error in user-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
