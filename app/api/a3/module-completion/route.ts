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
} from '@/lib/a3/module-catalog'
import { validateA3ModuleSubmission } from '@/lib/a3/module-validation'

interface AtomicCompletionResult {
  isFirstCompletion: boolean
  xpAwarded: number
  totalXp: number
  bestScore: number
  totalAttempts: number
  session: Record<string, unknown>
  completion: Record<string, unknown>
  progress: Record<string, unknown>
}

function isAtomicCompletionResult(value: unknown): value is AtomicCompletionResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const result = value as Record<string, unknown>
  return (
    typeof result.isFirstCompletion === 'boolean' &&
    typeof result.xpAwarded === 'number' &&
    typeof result.totalXp === 'number' &&
    typeof result.bestScore === 'number' &&
    typeof result.totalAttempts === 'number'
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

    const nextModule = A3_MODULES[module.number]
    const feedback = {
      passScore: validation.passScore,
      strengths: validation.strengths,
      criteria: validation.criteria,
    }

    const { data, error } = await (supabase as any).rpc(
      'complete_a3_module_atomic',
      {
        p_user_id: userId,
        p_module_id: module.id,
        p_module_number: module.number,
        p_module_xp: module.xp,
        p_checkpoint_day: module.checkpointDay,
        p_training_type: module.trainingType,
        p_score: validation.score,
        p_pass_score: validation.passScore,
        p_feedback: feedback,
        p_responses: validation.responses,
        p_deliverable: validation.deliverable,
        p_next_module_id: nextModule?.id || module.id,
        p_next_module_number: nextModule?.number || module.number,
        p_total_modules: A3_MODULES.length,
        p_unlock_advanced: module.number === 6,
        p_complete_route: module.number === A3_MODULES.length,
      },
    )

    if (error) {
      console.error('[v0] A3 atomic completion error:', error)
      return NextResponse.json(
        {
          error: 'No pudimos registrar la finalización completa. No se aplicó ningún avance parcial.',
          code: 'A3_ATOMIC_COMPLETION_FAILED',
        },
        { status: 500 },
      )
    }

    if (!isAtomicCompletionResult(data)) {
      console.error('[v0] Invalid A3 atomic completion response:', data)
      return NextResponse.json(
        {
          error: 'La finalización no devolvió un resultado válido.',
          code: 'A3_ATOMIC_COMPLETION_INVALID_RESPONSE',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      moduleId: module.id,
      moduleName: module.title,
      moduleNumber: module.number,
      isFirstCompletion: data.isFirstCompletion,
      xpAwarded: data.xpAwarded,
      totalXp: data.totalXp,
      score: validation.score,
      bestScore: data.bestScore,
      totalAttempts: data.totalAttempts,
      validation,
      nextModule: nextModule?.number || module.number,
      session: data.session,
      completion: data.completion,
      progress: data.progress,
    })
  } catch (error) {
    console.error('[v0] A3 module completion error:', error)
    return NextResponse.json(
      { error: 'No pudimos completar el entrenamiento.' },
      { status: 500 },
    )
  }
}
