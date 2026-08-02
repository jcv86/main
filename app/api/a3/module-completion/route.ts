import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'

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

export async function POST(request: NextRequest) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const {
      moduleId,
      moduleName,
      moduleNumber,
      trainingType,
      responses,
      careerMirrorCard,
    } = body

    if (
      typeof moduleId !== 'string' ||
      !Number.isInteger(moduleNumber) ||
      typeof trainingType !== 'string'
    ) {
      return NextResponse.json({ error: 'Missing or invalid required fields' }, { status: 400 })
    }

    const expectedModuleNumber = MODULE_ORDER.indexOf(moduleId) + 1
    if (!MODULE_XP[moduleId] || expectedModuleNumber !== moduleNumber) {
      return NextResponse.json({ error: 'Invalid module identity' }, { status: 400 })
    }

    const userId = currentUser.id
    const supabase = createAdminClient()
    const now = new Date().toISOString()
    const safeResponses = Array.isArray(responses)
      ? responses.map((value) => (typeof value === 'string' ? value : ''))
      : []
    const safeDeliverable =
      careerMirrorCard && typeof careerMirrorCard === 'object' ? careerMirrorCard : {}

    const { data: existingCompletion, error: existingCompletionError } = await supabase
      .from('a3_module_completion')
      .select('module_id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .maybeSingle()

    if (existingCompletionError) {
      console.error('[v0] Completion lookup error:', existingCompletionError)
      return NextResponse.json({ error: 'Failed to verify completion' }, { status: 500 })
    }

    const isFirstCompletion = !existingCompletion

    const { data: sessionData, error: sessionError } = await supabase
      .from('a3_session_attempts')
      .insert([
        {
          user_id: userId,
          module_id: moduleId,
          module_number: moduleNumber,
          session_type:
            trainingType === 'coach' ? 'coach_training' : 'interviewer_simulation',
          lead_character: 'coach',
          difficulty: 'adaptive',
          is_route_checkpoint: true,
          status: 'completed',
          progress: 100,
          score: 100,
          transcript: JSON.stringify({
            q1_career_direction: safeResponses[0] || '',
            q2_professional_identity: safeResponses[1] || '',
            q3_core_values: safeResponses[2] || '',
            q4_personal_brand: safeResponses[3] || '',
          }),
          deliverable: safeDeliverable,
          session_completed_at: now,
        },
      ])
      .select()

    if (sessionError) {
      console.error('[v0] Session recording error:', sessionError)
      return NextResponse.json({ error: 'Failed to record session' }, { status: 500 })
    }

    const { data: completionData, error: completionError } = await supabase
      .from('a3_module_completion')
      .upsert(
        [
          {
            user_id: userId,
            module_id: moduleId,
            module_number: moduleNumber,
            completed_at: now,
            best_score: 100,
            deliverable: safeDeliverable,
          },
        ],
        { onConflict: 'user_id,module_id' },
      )
      .select()

    if (completionError) {
      console.error('[v0] Completion recording error:', completionError)
      return NextResponse.json({ error: 'Failed to record completion' }, { status: 500 })
    }

    const { data: currentProgress, error: getProgressError } = await supabase
      .from('a3_route_progression')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (getProgressError && getProgressError.code !== 'PGRST116') {
      console.error('[v0] Error fetching route progression:', getProgressError)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    const nextModuleNumber = moduleNumber < MODULE_ORDER.length ? moduleNumber + 1 : moduleNumber
    const progressionUpdates: Record<string, unknown> = {
      user_id: userId,
      current_module_number: Math.max(
        currentProgress?.current_module_number || 1,
        nextModuleNumber,
      ),
      total_completed:
        (currentProgress?.total_completed || 0) + (isFirstCompletion ? 1 : 0),
      updated_at: now,
    }

    if (moduleNumber === 6 && !currentProgress?.can_replay_modules_7_10) {
      progressionUpdates.can_replay_modules_7_10 = true
      progressionUpdates.advanced_unlocked_at = now
    }

    if (moduleNumber === MODULE_ORDER.length) {
      progressionUpdates.pro_unlocked_at = currentProgress?.pro_unlocked_at || now
      progressionUpdates.route_completed_at = currentProgress?.route_completed_at || now
    }

    const { data: progressionData, error: progressionError } = await supabase
      .from('a3_route_progression')
      .upsert(progressionUpdates, { onConflict: 'user_id' })
      .select()

    if (progressionError) {
      console.error('[v0] Route progression update error:', progressionError)
      return NextResponse.json({ error: 'Failed to update route progression' }, { status: 500 })
    }

    const { data: existingUserProgress, error: userProgressError } = await supabase
      .from('a3_user_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (userProgressError && userProgressError.code !== 'PGRST116') {
      console.error('[v0] Error fetching user progress:', userProgressError)
      return NextResponse.json({ error: 'Failed to fetch user progress' }, { status: 500 })
    }

    const moduleStates: Record<string, string> = {
      ...(existingUserProgress?.module_states || {}),
    }
    const completedModuleIds = Array.from(
      new Set((existingUserProgress?.completed_module_ids || []).map(normalizeModuleId)),
    )

    if (!completedModuleIds.includes(moduleId)) {
      completedModuleIds.push(moduleId)
    }
    moduleStates[moduleId] = 'completed'

    if (moduleNumber < MODULE_ORDER.length) {
      const nextModuleId = MODULE_ORDER[moduleNumber]
      if (!moduleStates[nextModuleId] || moduleStates[nextModuleId] === 'locked') {
        moduleStates[nextModuleId] = 'available'
      }
    }

    const xpAwarded = isFirstCompletion ? MODULE_XP[moduleId] : 0
    const totalXp = (existingUserProgress?.total_xp || 0) + xpAwarded

    const { error: canonicalProgressError } = await supabase
      .from('a3_user_progress')
      .upsert(
        {
          user_id: userId,
          module_states: moduleStates,
          completed_module_ids: completedModuleIds,
          total_xp: totalXp,
          created_at: existingUserProgress?.created_at || now,
          updated_at: now,
        },
        { onConflict: 'user_id' },
      )

    if (canonicalProgressError) {
      console.error('[v0] Canonical progress update error:', canonicalProgressError)
      return NextResponse.json({ error: 'Failed to update canonical progress' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      moduleId,
      moduleName: typeof moduleName === 'string' ? moduleName : moduleId,
      moduleNumber,
      isFirstCompletion,
      xpAwarded,
      totalXp,
      nextModule: nextModuleNumber,
      session: sessionData?.[0],
      completion: completionData?.[0],
      progress: progressionData?.[0],
    })
  } catch (error) {
    console.error('[v0] Module completion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
