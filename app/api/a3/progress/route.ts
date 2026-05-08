import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Pillar 3 has 7 main trainings, each worth ~143 XP (totaling 1000 XP)
const TOTAL_TRAININGS = 7
const TOTAL_XP_TARGET = 1000
const XP_PER_TRAINING = Math.floor(TOTAL_XP_TARGET / TOTAL_TRAININGS) // 142 XP each

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Default empty response
    const emptyResponse = {
      totalXP: 0,
      totalXPTarget: TOTAL_XP_TARGET,
      completedTrainings: 0,
      totalTrainings: TOTAL_TRAININGS,
      percentage: 0,
      completedModules: [] as string[],
    }

    if (!user) {
      console.log('[v0] No authenticated user, returning empty progress')
      return NextResponse.json(emptyResponse, { status: 200 })
    }

    // Fetch ALL training completions for this user (each row = one completed training)
    const { data: completions, error } = await supabase
      .from('a3_training_module_completions')
      .select('training_type, training_module_id, xp_amount, is_first_completion')
      .eq('user_id', user.id)

    if (error) {
      console.error('[v0] Error fetching completions:', error)
      return NextResponse.json(emptyResponse, { status: 200 })
    }

    // Count unique completed trainings (by training_type)
    const uniqueTrainings = new Set<string>()
    let totalXP = 0

    if (completions) {
      completions.forEach((c) => {
        const key = c.training_type || c.training_module_id
        if (key) uniqueTrainings.add(key)
        // Only count XP from first completions
        if (c.is_first_completion) {
          totalXP += c.xp_amount || 0
        }
      })
    }

    const completedTrainings = uniqueTrainings.size
    // Calculate percentage based on XP earned (capped at 100%)
    const percentage = Math.min(Math.round((totalXP / TOTAL_XP_TARGET) * 100), 100)

    console.log('[v0] Progress for user:', user.id, '| XP:', totalXP, '| Trainings:', completedTrainings, '| %:', percentage)

    return NextResponse.json({
      totalXP,
      totalXPTarget: TOTAL_XP_TARGET,
      completedTrainings,
      totalTrainings: TOTAL_TRAININGS,
      percentage,
      completedModules: Array.from(uniqueTrainings),
    }, { status: 200 })

  } catch (error) {
    console.error('[v0] Error in /api/a3/progress:', error)
    return NextResponse.json({
      totalXP: 0,
      totalXPTarget: TOTAL_XP_TARGET,
      completedTrainings: 0,
      totalTrainings: TOTAL_TRAININGS,
      percentage: 0,
      completedModules: [],
    }, { status: 200 })
  }
}
