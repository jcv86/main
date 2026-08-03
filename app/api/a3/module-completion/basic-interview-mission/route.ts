import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  checkA3ModuleAccess,
  getA3AccessDenialMessage,
} from '@/lib/a3-access-control'
import { A3_MODULES } from '@/lib/a3/module-catalog'
import { getActiveA3Module } from '@/lib/a3/active-module'
import { validateBasicInterviewMissionSubmission } from '@/lib/a3/basic-interview-mission-validation'
import { extractBasicInterviewContext } from '@/lib/a3/basic-interview-mission'

interface AtomicCompletionResult {
  isFirstCompletion: boolean
  xpAwarded: number
  totalXp: number
  bestScore: number
  totalAttempts: number
  routeCompleted: boolean
  a4Unlocked: boolean
  session: Record<string, unknown>
  completion: Record<string, unknown>
  progress: Record<string, unknown>
  journey: Record<string, unknown> | null
  profile: Record<string, unknown> | null
}

function isAtomicCompletionResult(value: unknown): value is AtomicCompletionResult {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const result = value as Record<string, unknown>
  return (
    typeof result.isFirstCompletion === 'boolean' &&
    typeof result.xpAwarded === 'number' &&
    typeof result.totalXp === 'number' &&
    typeof result.bestScore === 'number' &&
    typeof result.totalAttempts === 'number' &&
    typeof result.routeCompleted === 'boolean' &&
    typeof result.a4Unlocked === 'boolean'
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

    const module = getActiveA3Module(body.moduleId)
    const moduleNumber = Number(body.moduleNumber)
    if (
      !module ||
      module.id !== 'basic-interview-mission' ||
      !Number.isInteger(moduleNumber) ||
      module.number !== moduleNumber
    ) {
      return NextResponse.json(
        { error: 'La identidad del módulo no es válida.' },
        { status: 400 },
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

    const [cvResult, decoderResult, answersResult, simulationResult, difficultResult] =
      await Promise.all([
        supabase
          .from('a3_module_completion')
          .select('module_id, deliverable, completed_at')
          .eq('user_id', userId)
          .in('module_id', ['cv-builder-studio', 'module-3'])
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('a3_module_completion')
          .select('module_id, deliverable, completed_at')
          .eq('user_id', userId)
          .in('module_id', ['job-decoder', 'module-4'])
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('a3_module_completion')
          .select('module_id, deliverable, completed_at')
          .eq('user_id', userId)
          .in('module_id', ['answer-architecture', 'module-5'])
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('a3_module_completion')
          .select('module_id, deliverable, completed_at')
          .eq('user_id', userId)
          .in('module_id', ['first-recruiter-simulation', 'module-8'])
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('a3_module_completion')
          .select('module_id, deliverable, completed_at')
          .eq('user_id', userId)
          .in('module_id', ['risk-difficult-questions-lab', 'module-9'])
          .order('completed_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])

    if (
      cvResult.error ||
      decoderResult.error ||
      answersResult.error ||
      simulationResult.error ||
      difficultResult.error
    ) {
      console.error('[v0] Basic interview completion context error:', {
        cv: cvResult.error,
        decoder: decoderResult.error,
        answers: answersResult.error,
        simulation: simulationResult.error,
        difficult: difficultResult.error,
      })
      return NextResponse.json(
        { error: 'No pudimos verificar la evidencia completa de la ruta.' },
        { status: 500 },
      )
    }

    const validation = validateBasicInterviewMissionSubmission(
      module,
      body.responses,
      body.deliverable,
      extractBasicInterviewContext(
        cvResult.data?.deliverable,
        decoderResult.data?.deliverable,
        answersResult.data?.deliverable,
        simulationResult.data?.deliverable,
        difficultResult.data?.deliverable,
      ),
    )

    if (!validation.passed) {
      return NextResponse.json(
        {
          error: 'La misión final necesita más desarrollo antes de cerrar la ruta.',
          validation,
        },
        { status: 422 },
      )
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
        p_feedback: {
          passScore: validation.passScore,
          strengths: validation.strengths,
          criteria: validation.criteria,
          routeCompleted: true,
        },
        p_responses: validation.responses,
        p_deliverable: validation.deliverable,
        p_next_module_id: module.id,
        p_next_module_number: module.number,
        p_total_modules: A3_MODULES.length,
        p_unlock_advanced: false,
        p_complete_route: true,
      },
    )

    if (error) {
      console.error('[v0] Basic interview atomic completion error:', error)
      return NextResponse.json(
        {
          error: 'No pudimos cerrar la ruta. No se aplicó ningún avance parcial.',
          code: 'A3_ATOMIC_COMPLETION_FAILED',
        },
        { status: 500 },
      )
    }

    if (!isAtomicCompletionResult(data)) {
      console.error('[v0] Invalid basic interview completion response:', data)
      return NextResponse.json(
        {
          error: 'La finalización no devolvió un resultado válido.',
          code: 'A3_ATOMIC_COMPLETION_INVALID_RESPONSE',
        },
        { status: 500 },
      )
    }

    if (!data.routeCompleted || !data.a4Unlocked) {
      console.error('[v0] A3 completed without canonical A4 transition:', data)
      return NextResponse.json(
        {
          error: 'Entrenamiento se guardó, pero Radar Estratégico no confirmó su desbloqueo.',
          code: 'A3_A4_TRANSITION_NOT_CONFIRMED',
        },
        { status: 500 },
      )
    }

    const proUnlocked = Boolean(data.progress?.pro_unlocked_at)

    return NextResponse.json({
      success: true,
      routeCompleted: data.routeCompleted,
      a4Unlocked: data.a4Unlocked,
      proUnlocked,
      nextPath: '/despega/a4?unlocked=training-complete',
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
      nextModule: module.number,
      session: data.session,
      completion: data.completion,
      progress: data.progress,
      journey: data.journey,
      profile: data.profile,
    })
  } catch (error) {
    console.error('[v0] Basic interview mission completion error:', error)
    return NextResponse.json(
      { error: 'No pudimos completar la misión final.' },
      { status: 500 },
    )
  }
}
