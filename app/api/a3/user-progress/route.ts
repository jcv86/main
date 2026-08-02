import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextResponse } from 'next/server'

// New A3 module structure
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

// Legacy numeric keys → slug mapping (data saved before slug migration)
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

const TOTAL_XP = 1340

export async function GET() {
  try {
    const supabase = createAdminClient()
    const currentUser = await resolveServerUser()
    const userId = currentUser?.id ?? null

    // Default module states - first module available, rest locked
    const defaultModuleStates: Record<string, string> = {}
    MODULE_ORDER.forEach((id, index) => {
      defaultModuleStates[id] = index === 0 ? 'available' : 'locked'
    })

    if (!userId) {
      // Return default state for unauthenticated users
      return NextResponse.json({
        success: true,
        progress: {
          totalXp: 0,
          maxXp: TOTAL_XP,
          progressPct: 0,
          completedModules: 0,
          totalModules: MODULE_ORDER.length,
          moduleStates: defaultModuleStates,
          completedModuleIds: [],
          a2CurrentDay: 1,
        },
      })
    }

    // Fetch A2 user progress to get current day
    const { data: a2Data } = await supabase
      .from('a2_user_route_progress')
      .select('dia_actual')
      .eq('user_id', userId)
      .single()

    const a2CurrentDay = a2Data?.dia_actual || 1

    // Fetch user progress from database
    const { data: progressData, error: progressError } = await supabase
      .from('a3_user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('[v0] Error fetching a3_user_progress:', progressError)
    }

    if (progressData) {
      const moduleStates: Record<string, string> = {
        ...defaultModuleStates,
        ...(progressData.module_states || {}),
      }
      const completedModuleIds = Array.from(
        new Set((progressData.completed_module_ids || []).map(normalizeModuleId)),
      )
      const totalXp = progressData.total_xp || 0

      // Rebuild missing/unlocked state using canonical IDs.
      MODULE_ORDER.forEach((id, index) => {
        if (completedModuleIds.includes(id)) {
          moduleStates[id] = 'completed'
          return
        }

        if (index === 0) {
          moduleStates[id] = moduleStates[id] === 'completed' ? 'completed' : 'available'
          return
        }

        const previousId = MODULE_ORDER[index - 1]
        if (completedModuleIds.includes(previousId) && moduleStates[id] === 'locked') {
          moduleStates[id] = 'available'
        }
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
          a2CurrentDay,
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
        moduleStates: defaultModuleStates,
        completedModuleIds: [],
        a2CurrentDay,
      },
    })
  } catch (error) {
    console.error('[v0] Error in user-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
