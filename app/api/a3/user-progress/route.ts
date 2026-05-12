import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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

const MODULE_XP: Record<string, number> = {
  'career-mirror': 80,
  'value-mining-lab': 100,
  'cv-builder-studio': 120,
  'job-decoder': 100,
  'answer-architecture': 120,
  'coach-practice-room': 130,
  'communication-gym': 140,
  'first-recruiter-simulation': 160,
  'risk-difficult-questions-lab': 170,
  'basic-interview-mission': 220,
}

const TOTAL_XP = 1340

export async function GET() {
  try {
    const supabase = createAdminClient()
    
    // Get user ID from demo_user cookie
    const cookieStore = await cookies()
    const demoUserCookie = cookieStore.get('demo_user')
    let userId: string | null = null
    
    if (demoUserCookie) {
      try {
        const demoUser = JSON.parse(demoUserCookie.value)
        userId = demoUser.id
      } catch {
        // Invalid cookie
      }
    }

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
          totalModules: 10,
          moduleStates: defaultModuleStates,
          completedModuleIds: [],
        },
      })
    }

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
      // User has progress data
      const moduleStates = progressData.module_states || defaultModuleStates
      const completedModuleIds = progressData.completed_module_ids || []
      const totalXp = progressData.total_xp || 0

      // Ensure all modules have a state
      MODULE_ORDER.forEach((id, index) => {
        if (!moduleStates[id]) {
          // Determine state based on previous module
          if (index === 0) {
            moduleStates[id] = 'available'
          } else {
            const prevId = MODULE_ORDER[index - 1]
            moduleStates[id] = completedModuleIds.includes(prevId) ? 'available' : 'locked'
          }
        }
      })

      return NextResponse.json({
        success: true,
        progress: {
          totalXp,
          maxXp: TOTAL_XP,
          progressPct: Math.round((totalXp / TOTAL_XP) * 100),
          completedModules: completedModuleIds.length,
          totalModules: 10,
          moduleStates,
          completedModuleIds,
        },
      })
    }

    // No progress data - return defaults
    return NextResponse.json({
      success: true,
      progress: {
        totalXp: 0,
        maxXp: TOTAL_XP,
        progressPct: 0,
        completedModules: 0,
        totalModules: 10,
        moduleStates: defaultModuleStates,
        completedModuleIds: [],
      },
    })
  } catch (error) {
    console.error('[v0] Error in user-progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
