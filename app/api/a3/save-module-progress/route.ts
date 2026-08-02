import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextResponse } from 'next/server'

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

const ALLOWED_STATUSES = new Set(['available', 'in_progress', 'completed'])

function normalizeModuleId(id: string): string {
  return NUMERIC_TO_SLUG[id] ?? id
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { moduleId, status } = body

    if (!moduleId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: moduleId and status' },
        { status: 400 },
      )
    }

    if (!MODULE_XP[moduleId]) {
      return NextResponse.json({ error: 'Invalid moduleId' }, { status: 400 })
    }

    if (!ALLOWED_STATUSES.has(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userId = currentUser.id
    const supabase = createAdminClient()

    const { data: existingProgress, error: fetchError } = await supabase
      .from('a3_user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('[v0] Error fetching progress:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    const now = new Date().toISOString()
    const currentIndex = MODULE_ORDER.indexOf(moduleId)

    if (existingProgress) {
      const moduleStates: Record<string, string> = {
        ...(existingProgress.module_states || {}),
      }
      const completedModuleIds = Array.from(
        new Set((existingProgress.completed_module_ids || []).map(normalizeModuleId)),
      )
      const wasAlreadyCompleted = completedModuleIds.includes(moduleId)
      const isCompletingNow = status === 'completed' && !wasAlreadyCompleted
      const xpAwarded = isCompletingNow ? MODULE_XP[moduleId] : 0

      moduleStates[moduleId] = wasAlreadyCompleted ? 'completed' : status

      if (isCompletingNow) {
        completedModuleIds.push(moduleId)
      }

      if (status === 'completed' && currentIndex < MODULE_ORDER.length - 1) {
        const nextModuleId = MODULE_ORDER[currentIndex + 1]
        if (!moduleStates[nextModuleId] || moduleStates[nextModuleId] === 'locked') {
          moduleStates[nextModuleId] = 'available'
        }
      }

      const newTotalXp = (existingProgress.total_xp || 0) + xpAwarded
      const { error: updateError } = await supabase
        .from('a3_user_progress')
        .update({
          module_states: moduleStates,
          completed_module_ids: completedModuleIds,
          total_xp: newTotalXp,
          updated_at: now,
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('[v0] Error updating progress:', updateError)
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        isFirstCompletion: isCompletingNow,
        xpAwarded,
        totalXp: newTotalXp,
        moduleStates,
        completedModuleIds,
        nextModuleUnlocked:
          status === 'completed' && currentIndex < MODULE_ORDER.length - 1
            ? MODULE_ORDER[currentIndex + 1]
            : null,
      })
    }

    const moduleStates: Record<string, string> = {}
    MODULE_ORDER.forEach((id, index) => {
      if (id === moduleId) {
        moduleStates[id] = status
      } else if (index === 0) {
        moduleStates[id] = 'available'
      } else {
        moduleStates[id] = 'locked'
      }
    })

    if (status === 'completed' && currentIndex < MODULE_ORDER.length - 1) {
      moduleStates[MODULE_ORDER[currentIndex + 1]] = 'available'
    }

    const completedModuleIds = status === 'completed' ? [moduleId] : []
    const totalXp = status === 'completed' ? MODULE_XP[moduleId] : 0

    const { error: insertError } = await supabase.from('a3_user_progress').insert({
      user_id: userId,
      module_states: moduleStates,
      completed_module_ids: completedModuleIds,
      total_xp: totalXp,
      created_at: now,
      updated_at: now,
    })

    if (insertError) {
      console.error('[v0] Error inserting progress:', insertError)
      return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      isFirstCompletion: status === 'completed',
      xpAwarded: totalXp,
      totalXp,
      moduleStates,
      completedModuleIds,
      nextModuleUnlocked:
        status === 'completed' && currentIndex < MODULE_ORDER.length - 1
          ? MODULE_ORDER[currentIndex + 1]
          : null,
    })
  } catch (error) {
    console.error('[v0] Error in save-module-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
