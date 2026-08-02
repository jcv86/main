import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  checkA3ModuleAccess,
  getA3AccessDenialMessage,
} from '@/lib/a3-access-control'
import {
  A3_MODULES,
  getA3Module,
  normalizeA3ModuleId,
} from '@/lib/a3/module-catalog'
import { validateA3ModuleSubmission } from '@/lib/a3/module-validation'

function normalizedCompletedIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return Array.from(
    new Set(
      value
        .map(normalizeA3ModuleId)
        .filter((id): id is NonNullable<typeof id> => Boolean(id)),
    ),
  )
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    let body: Record<string, unknown>
    try {
      body = (await request.json()) as Record<string, unknown>
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const module = getA3Module(body.moduleId)
    const moduleNumber = Number(body.moduleNumber)
    if (!module || !Number.isInteger(moduleNumber) || module.number !== moduleNumber) {
      return NextResponse.json(
        { error: 'La identidad del módulo no es válida.' },
        { status: 400 },
      )
    }

    if (!module.completionContract.enabled) {
      return NextResponse.json(
        {
          error: 'Este entrenamiento aún no tiene una finalización verificable habilitada.',
          code: 'A3_COMPLETION_CONTRACT_NOT_READY',
          moduleId: module.id,
        },
        { status: 409 },
      )
    }

    const validation = validateA3ModuleSubmission(
      module,
      body.responses,
      body.deliverable || body.careerMirrorCard,
    )
    if (!validation.passed) {
      return NextResponse.json(
        {
          error: 'El entrenamiento necesita más desarrollo antes de completarse.',
          validation,
        },
        { status: 422 },
      )
    }

    const userId = currentUser.id
    const supabase = createAdminClient()
    const access = await checkA3ModuleAccess(userId, module.id, supabase)

    if (!access.canAccess) {
      return NextResponse.json(
        {
          error: getA3AccessDenialMessage(access),
          access: {
            currentDay: access.currentDay,
            checkpointDay: access.checkpointDay,
            day1Status: access.day1Status,
            blockReasons: access.blockReasons,
          },
        },
        { status: 403 },
      )
    }

    const now = new Date().toISOString()
    const [existingCompletionResult, existingUserProgressResult] =
      await Promise.all([
        supabase
          .from('a3_module_completion')
          .select('module_id, best_score, total_attempts')
          .eq('user_id', userId)
          .eq('module_id', module.id)
          .maybeSingle(),
        supabase
          .from('a3_user_progress')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
      ])

    if (existingCompletionResult.error) {
      console.error('[v0] A3 completion lookup error:', existingCompletionResult.error)
      return NextResponse.json(
        { error: 'No pudimos verificar la finalización anterior.' },
        { status: 500 },
      )
    }
    if (existingUserProgressResult.error) {
      console.error('[v0] A3 progress lookup error:', existingUserProgressResult.error)
      return NextResponse.json(
        { error: 'No pudimos verificar el progreso de Entrenamiento.' },
        { status: 500 },
      )
    }

    const existingCompletion = existingCompletionResult.data
    const existingUserProgress = existingUserProgressResult.data
    const completedModuleIds = normalizedCompletedIds(
      existingUserProgress?.completed_module_ids,
    )
    const isFirstCompletion =
      !existingCompletion && !completedModuleIds.includes(module.id)

    const sessionType =
      module.trainingType === 'coach'
        ? 'coach_training'
        : 'interviewer_simulation'
    const { data: sessionData, error: sessionError } = await supabase
      .from('a3_session_attempts')
      .insert({
        user_id: userId,
        module_id: module.id,
        module_number: module.number,
        session_type: sessionType,
        lead_character: module.trainingType === 'coach' ? 'coach' : 'interviewer',
        difficulty: 'adaptive',
        is_route_checkpoint: true,
        is_replay: !isFirstCompletion,
        related_a2_day: module.checkpointDay,
        status: 'completed',
        progress: 100,
        score: validation.score,
        feedback: JSON.stringify({
          passScore: validation.passScore,
          strengths: validation.strengths,
          criteria: validation.criteria,
        }),
        transcript: { responses: validation.responses },
        deliverable: validation.deliverable,
        session_completed_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (sessionError) {
      console.error('[v0] A3 session recording error:', sessionError)
      return NextResponse.json(
        { error: 'No pudimos registrar la sesión.' },
        { status: 500 },
      )
    }

    const bestScore = Math.max(
      Number(existingCompletion?.best_score) || 0,
      validation.score,
    )
    const totalAttempts = (Number(existingCompletion?.total_attempts) || 0) + 1
    const { data: completionData, error: completionError } = await supabase
      .from('a3_module_completion')
      .upsert(
        {
          user_id: userId,
          module_id: module.id,
          module_number: module.number,
          completed_at: existingCompletion ? undefined : now,
          total_attempts: totalAttempts,
          best_score: bestScore,
          deliverable: validation.deliverable,
        },
        { onConflict: 'user_id,module_id' },
      )
      .select()
      .single()

    if (completionError) {
      console.error('[v0] A3 completion recording error:', completionError)
      return NextResponse.json(
        { error: 'No pudimos registrar la finalización.' },
        { status: 500 },
      )
    }

    const { data: currentProgress, error: getProgressError } = await supabase
      .from('a3_route_progression')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (getProgressError) {
      console.error('[v0] A3 route progression lookup error:', getProgressError)
      return NextResponse.json(
        { error: 'No pudimos verificar la progresión de Entrenamiento.' },
        { status: 500 },
      )
    }

    const nextModuleNumber =
      module.number < A3_MODULES.length ? module.number + 1 : module.number
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

    if (module.number === 6 && !currentProgress?.can_replay_modules_7_10) {
      progressionUpdates.can_replay_modules_7_10 = true
      progressionUpdates.advanced_unlocked_at = now
    }
    if (module.number === A3_MODULES.length) {
      progressionUpdates.pro_unlocked_at = currentProgress?.pro_unlocked_at || now
      progressionUpdates.route_completed_at =
        currentProgress?.route_completed_at || now
    }

    const { data: progressionData, error: progressionError } = await supabase
      .from('a3_route_progression')
      .upsert(progressionUpdates, { onConflict: 'user_id' })
      .select()
      .single()

    if (progressionError) {
      console.error('[v0] A3 route progression update error:', progressionError)
      return NextResponse.json(
        { error: 'No pudimos actualizar la progresión.' },
        { status: 500 },
      )
    }

    const moduleStates: Record<string, string> = {
      ...(existingUserProgress?.module_states || {}),
      [module.id]: 'completed',
    }
    if (!completedModuleIds.includes(module.id)) completedModuleIds.push(module.id)

    const nextModule = A3_MODULES[module.number]
    if (
      nextModule &&
      (!moduleStates[nextModule.id] || moduleStates[nextModule.id] === 'locked')
    ) {
      moduleStates[nextModule.id] = 'available'
    }

    const xpAwarded = isFirstCompletion ? module.xp : 0
    const totalXp = (existingUserProgress?.total_xp || 0) + xpAwarded
    const { error: canonicalProgressError } = await supabase
      .from('a3_user_progress')
      .upsert(
        {
          user_id: userId,
          module_states: moduleStates,
          completed_module_ids: completedModuleIds,
          total_xp: totalXp,
          current_module: nextModule?.id || module.id,
          created_at: existingUserProgress?.created_at || now,
          updated_at: now,
        },
        { onConflict: 'user_id' },
      )

    if (canonicalProgressError) {
      console.error('[v0] A3 canonical progress update error:', canonicalProgressError)
      return NextResponse.json(
        { error: 'No pudimos actualizar el progreso canónico.' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      moduleId: module.id,
      moduleName: module.title,
      moduleNumber: module.number,
      isFirstCompletion,
      xpAwarded,
      totalXp,
      score: validation.score,
      bestScore,
      validation,
      nextModule: nextModule?.number || module.number,
      session: sessionData,
      completion: completionData,
      progress: progressionData,
    })
  } catch (error) {
    console.error('[v0] A3 module completion error:', error)
    return NextResponse.json(
      { error: 'No pudimos completar el entrenamiento.' },
      { status: 500 },
    )
  }
}
