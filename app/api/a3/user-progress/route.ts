import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { getA2ProgressSnapshot } from '@/lib/a2/server-progress'
import { getA3AllModulesAccessState } from '@/lib/a3-access-control'
import {
  A3_MODULES,
  A3_MODULE_IDS,
  A3_TOTAL_XP,
  normalizeA3ModuleId,
  type A3ModuleId,
} from '@/lib/a3/module-catalog'
import { NextResponse } from 'next/server'

function normalizeCompletedModuleIds(value: unknown): A3ModuleId[] {
  if (!Array.isArray(value)) return []
  return Array.from(
    new Set(
      value
        .map(normalizeA3ModuleId)
        .filter((id): id is A3ModuleId => Boolean(id)),
    ),
  )
}

function isoValue(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null
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
          accessStates: [],
          moduleResults: {},
          nextAvailableModuleId: null,
          a2CurrentDay: 1,
          route: {
            currentModuleNumber: 1,
            totalCompleted: 0,
            canReplayModules7To10: false,
            advancedUnlockedAt: null,
            proUnlockedAt: null,
            routeCompletedAt: null,
          },
        },
      })
    }

    const [
      a2Snapshot,
      accessStates,
      progressResult,
      routeResult,
      completionResult,
    ] = await Promise.all([
      getA2ProgressSnapshot(userId, supabase),
      getA3AllModulesAccessState(userId, supabase),
      supabase
        .from('a3_user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('a3_route_progression')
        .select(
          'current_module_number, total_completed, can_replay_modules_7_10, advanced_unlocked_at, pro_unlocked_at, route_completed_at',
        )
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('a3_module_completion')
        .select('module_id, module_number, best_score, total_attempts, completed_at')
        .eq('user_id', userId),
    ])

    if (progressResult.error) {
      console.error('[v0] Error fetching a3_user_progress:', progressResult.error)
    }
    if (routeResult.error) {
      console.error('[v0] Error fetching a3_route_progression:', routeResult.error)
    }
    if (completionResult.error) {
      console.error('[v0] Error fetching a3_module_completion:', completionResult.error)
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

    const moduleResults = Object.fromEntries(
      (completionResult.data || [])
        .map((row: Record<string, unknown>) => {
          const moduleId = normalizeA3ModuleId(row.module_id)
          if (!moduleId) return null
          return [
            moduleId,
            {
              bestScore: Math.max(0, Number(row.best_score) || 0),
              totalAttempts: Math.max(0, Number(row.total_attempts) || 0),
              completedAt: isoValue(row.completed_at),
            },
          ] as const
        })
        .filter(
          (entry): entry is readonly [
            A3ModuleId,
            { bestScore: number; totalAttempts: number; completedAt: string | null },
          ] => Boolean(entry),
        ),
    )

    const nextAvailableModule = accessStates.find(
      (state) => state.status === 'available' || state.status === 'in_progress',
    )
    const routeData = routeResult.data
    const derivedCurrentModuleNumber = nextAvailableModule?.moduleNumber ||
      (completedModuleIds.length === A3_MODULES.length ? A3_MODULES.length : 1)

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
        accessStates,
        moduleResults,
        nextAvailableModuleId: nextAvailableModule?.moduleId || null,
        a2CurrentDay: a2Snapshot.currentDay,
        route: {
          currentModuleNumber: Math.max(
            1,
            Math.min(
              A3_MODULES.length,
              Number(routeData?.current_module_number) || derivedCurrentModuleNumber,
            ),
          ),
          totalCompleted: Math.max(
            completedModuleIds.length,
            Number(routeData?.total_completed) || 0,
          ),
          canReplayModules7To10: Boolean(routeData?.can_replay_modules_7_10),
          advancedUnlockedAt: isoValue(routeData?.advanced_unlocked_at),
          proUnlockedAt: isoValue(routeData?.pro_unlocked_at),
          routeCompletedAt: isoValue(routeData?.route_completed_at),
        },
      },
    })
  } catch (error) {
    console.error('[v0] Error in user-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
