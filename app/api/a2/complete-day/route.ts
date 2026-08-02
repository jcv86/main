import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { A2_DAILY_MISSIONS } from '@/lib/a2-missions-full'
import { getA3CheckpointForDay } from '@/lib/a3-checkpoint-map'
import { getA2ProgressSnapshot, resolveA2Route } from '@/lib/a2/server-progress'
import { resolveA2HorizonProgression } from '@/lib/a2/horizon'
import {
  requiresUniversalA2Submission,
  validateA2MissionSubmission,
  type A2MissionValidationResult,
} from '@/lib/a2/day-submission'
import {
  analyzeA2Day1Submission,
  buildDay1PersistencePayload,
  type Day1Analysis,
  type Day1Input,
} from '@/lib/a2/day1-scoring'

interface CompleteDayBody {
  dayNumber?: unknown
  submission?: unknown
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

function phaseForDay(day: number): number {
  if (day <= 10) return 1
  if (day <= 30) return 2
  if (day <= 60) return 3
  return 4
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function completedModuleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === 'string')
        .map(normalizeModuleId),
    ),
  )
}

async function persistDay1Submission(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  submission: Day1Input,
  analysis: Day1Analysis,
  now: string,
) {
  const payload = buildDay1PersistencePayload(userId, submission, analysis, now)
  const { data: existing, error: lookupError } = await supabase
    .from('a2_day1_submissions')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lookupError) throw lookupError

  const { error } = existing
    ? await supabase
        .from('a2_day1_submissions')
        .update(payload)
        .eq('id', existing.id)
    : await supabase.from('a2_day1_submissions').insert({
        ...payload,
        created_at: now,
      })

  if (error) throw error
}

export async function POST(request: Request) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    let body: CompleteDayBody
    try {
      body = (await request.json()) as CompleteDayBody
    } catch {
      return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 })
    }

    const day =
      typeof body.dayNumber === 'number' ? body.dayNumber : Number(body.dayNumber)
    if (!Number.isInteger(day) || day < 1 || day > 90) {
      return NextResponse.json(
        { error: 'El día debe estar entre 1 y 90.' },
        { status: 400 },
      )
    }

    const mission = A2_DAILY_MISSIONS[day]
    if (!mission) {
      return NextResponse.json(
        { error: 'La misión solicitada no está configurada.' },
        { status: 404 },
      )
    }

    const submission = objectValue(body.submission)
    const userId = currentUser.id
    const supabase = createAdminClient()
    const now = new Date().toISOString()
    const snapshot = await getA2ProgressSnapshot(userId, supabase)

    if (day > snapshot.highestUnlockedDay) {
      return NextResponse.json(
        {
          error: 'Completa el día actual antes de avanzar.',
          currentDay: snapshot.currentDay,
          highestUnlockedDay: snapshot.highestUnlockedDay,
          activeHorizon: snapshot.activeHorizon,
        },
        { status: 409 },
      )
    }

    const [completionLookup, previousCompletionsResult] = await Promise.all([
      supabase
        .from('a2_user_task_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('day', day)
        .limit(1)
        .maybeSingle(),
      supabase
        .from('a2_user_task_completions')
        .select('day')
        .eq('user_id', userId)
        .not('completed_at', 'is', null),
    ])

    if (completionLookup.error) {
      console.error('[v0] Error checking A2 completion:', completionLookup.error)
      return NextResponse.json(
        { error: 'No pudimos verificar el avance.' },
        { status: 500 },
      )
    }
    if (previousCompletionsResult.error) {
      console.error(
        '[v0] Error checking A2 prerequisites:',
        previousCompletionsResult.error,
      )
      return NextResponse.json(
        { error: 'No pudimos verificar los prerrequisitos del día.' },
        { status: 500 },
      )
    }

    const existingCompletion = completionLookup.data
    const completedBefore = new Set(
      (previousCompletionsResult.data || [])
        .map((completion) => Number(completion.day))
        .filter((completedDay) => Number.isInteger(completedDay)),
    )

    const requiredPreviousDay = mission.unlockRequirements.requiredPreviousDay
    if (
      !existingCompletion &&
      requiredPreviousDay &&
      !completedBefore.has(requiredPreviousDay)
    ) {
      return NextResponse.json(
        {
          error: `Completa primero el Día ${requiredPreviousDay}.`,
          requiredPreviousDay,
        },
        { status: 409 },
      )
    }

    const requiredA3Modules = Array.from(
      new Set(
        [
          ...(mission.unlockRequirements.requiredCompletedA3Modules || []),
          ...(mission.a3Checkpoint ? [mission.a3Checkpoint.moduleId] : []),
        ].map(normalizeModuleId),
      ),
    )

    if (!existingCompletion && requiredA3Modules.length > 0) {
      const { data: a3Progress, error: a3ProgressError } = await supabase
        .from('a3_user_progress')
        .select('completed_module_ids')
        .eq('user_id', userId)
        .maybeSingle()

      if (a3ProgressError) {
        console.error('[v0] Error checking A3 prerequisites:', a3ProgressError)
        return NextResponse.json(
          { error: 'No pudimos verificar tu progreso de Entrenamiento.' },
          { status: 500 },
        )
      }

      const completedA3Modules = completedModuleIds(
        a3Progress?.completed_module_ids,
      )
      const missingA3Modules = requiredA3Modules.filter(
        (moduleId) => !completedA3Modules.includes(moduleId),
      )

      if (missingA3Modules.length > 0) {
        return NextResponse.json(
          {
            error: mission.a3Checkpoint
              ? `Completa ${mission.a3Checkpoint.moduleTitle} antes de cerrar este día.`
              : 'Completa los entrenamientos requeridos antes de avanzar.',
            requiredModules: requiredA3Modules,
            missingModules: missingA3Modules,
            checkpoint: mission.a3Checkpoint || null,
          },
          { status: 409 },
        )
      }
    }

    let day1Analysis: Day1Analysis | null = null
    let missionValidation: A2MissionValidationResult | null = null

    if (day === 1) {
      if (Object.keys(submission).length === 0) {
        return NextResponse.json(
          { error: 'Completa el contrato de ruta antes de desbloquear el Día 2.' },
          { status: 400 },
        )
      }

      day1Analysis = analyzeA2Day1Submission(userId, submission as Day1Input)

      if (!day1Analysis.passed) {
        if (!existingCompletion) {
          try {
            await persistDay1Submission(
              supabase,
              userId,
              submission as Day1Input,
              day1Analysis,
              now,
            )
          } catch (saveError) {
            console.error('[v0] Error saving Day 1 revision:', saveError)
          }
        }

        return NextResponse.json(
          {
            error: 'Tu contrato de ruta necesita revisión antes de avanzar.',
            analysis: day1Analysis,
          },
          { status: 422 },
        )
      }

      try {
        await persistDay1Submission(
          supabase,
          userId,
          submission as Day1Input,
          day1Analysis,
          now,
        )
      } catch (saveError) {
        console.error('[v0] Error saving approved Day 1:', saveError)
        return NextResponse.json(
          { error: 'No pudimos guardar la evaluación del Día 1.' },
          { status: 500 },
        )
      }
    } else if (requiresUniversalA2Submission(mission)) {
      missionValidation = validateA2MissionSubmission(mission, submission)

      if (!missionValidation.passed) {
        return NextResponse.json(
          {
            error: 'El entregable necesita ajustes antes de avanzar.',
            validation: missionValidation,
          },
          { status: 422 },
        )
      }
    }

    const validationStatus =
      day === 1
        ? 'specialized'
        : mission.missionType === 'a3_checkpoint'
          ? 'checkpoint'
          : requiresUniversalA2Submission(mission)
            ? 'structural'
            : 'specialized'
    const persistedSubmission = missionValidation?.normalized || submission
    const persistedValidation =
      missionValidation ||
      (day1Analysis
        ? {
            passed: day1Analysis.passed,
            score: day1Analysis.totalScore,
            passScore: 75,
            mode: 'specialized_day_1',
            feedback: day1Analysis.feedback,
            strengths: day1Analysis.strengths,
            improvements: day1Analysis.improvements,
          }
        : {
            passed: true,
            score: 100,
            passScore: 100,
            mode:
              mission.missionType === 'a3_checkpoint'
                ? 'checkpoint'
                : 'specialized_experience',
          })

    const completionPayload = {
      phase: phaseForDay(day),
      task_title: mission.title,
      mission_type: mission.missionType,
      submission: persistedSubmission,
      validation_status: validationStatus,
      validation_result: persistedValidation,
      completed_at: now,
      updated_at: now,
    }

    const { error: completionError } = existingCompletion
      ? await supabase
          .from('a2_user_task_completions')
          .update(completionPayload as any)
          .eq('id', existingCompletion.id)
      : await supabase.from('a2_user_task_completions').insert({
          user_id: userId,
          day,
          created_at: now,
          ...completionPayload,
        } as any)

    if (completionError) {
      console.error('[v0] Error marking A2 day complete:', completionError)
      return NextResponse.json(
        { error: 'No pudimos registrar el avance. Intenta nuevamente.' },
        { status: 500 },
      )
    }

    const { data: completions, error: completionsError } = await supabase
      .from('a2_user_task_completions')
      .select('day')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)

    if (completionsError) {
      console.error('[v0] Error recounting A2 completions:', completionsError)
    }

    const completedDays = Array.from(
      new Set((completions || []).map((completion) => Number(completion.day))),
    )
      .filter((completedDay) => Number.isInteger(completedDay))
      .sort((left, right) => left - right)
    const totalCompleted = completedDays.length
    const horizonProgression = resolveA2HorizonProgression(
      day,
      snapshot.highestUnlockedDay,
      snapshot.activeHorizon,
    )
    const { nextDay, highestUnlockedDay, extensionRequired, nextHorizon } =
      horizonProgression
    const progressPercentage = Math.min(
      100,
      Math.round((totalCompleted / snapshot.activeHorizon) * 100),
    )
    const route = await resolveA2Route(userId, supabase)

    const { data: existingJourney, error: journeyLookupError } = await supabase
      .from('despega_journey_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (journeyLookupError) {
      console.error('[v0] Error reading journey state:', journeyLookupError)
    }

    const journeyPayload = {
      user_id: userId,
      current_module: day >= 60 ? 'A4' : day >= 30 ? 'A3' : 'A2',
      current_a2_day: nextDay,
      highest_a2_day_unlocked: highestUnlockedDay,
      a1_completed_at: existingJourney?.a1_completed_at || null,
      a2_started_at: existingJourney?.a2_started_at || now,
      a2_completed_at:
        day === 90
          ? existingJourney?.a2_completed_at || now
          : existingJourney?.a2_completed_at || null,
      a3_unlocked_at:
        day >= 30
          ? existingJourney?.a3_unlocked_at || now
          : existingJourney?.a3_unlocked_at || null,
      a4_unlocked_at:
        day >= 60
          ? existingJourney?.a4_unlocked_at || now
          : existingJourney?.a4_unlocked_at || null,
      version: (existingJourney?.version || 0) + 1,
      metadata: {
        ...(existingJourney?.metadata || {}),
        route_id: route?.id || null,
        route_code: route?.code || null,
        a2_horizon: snapshot.activeHorizon,
        a2_extension_required: extensionRequired,
        a2_next_horizon: nextHorizon,
      },
      updated_at: now,
      created_at: existingJourney?.created_at || now,
    }

    const { error: journeyError } = await supabase
      .from('despega_journey_state')
      .upsert(journeyPayload, { onConflict: 'user_id' })

    if (journeyError) {
      console.error('[v0] Error updating canonical A2 journey:', journeyError)
      return NextResponse.json(
        { error: 'No pudimos actualizar la ruta.' },
        { status: 500 },
      )
    }

    if (route) {
      const { data: existingRouteProgress, error: routeLookupError } = await supabase
        .from('a2_user_route_progress')
        .select('id, fecha_inicio, fecha_fin')
        .eq('user_id', userId)
        .eq('route_id', route.id)
        .maybeSingle()

      if (routeLookupError) {
        console.error('[v0] Error reading route progress:', routeLookupError)
      }

      const routeProgressPayload = {
        user_id: userId,
        route_id: route.id,
        fecha_inicio: existingRouteProgress?.fecha_inicio || now,
        dia_actual: nextDay,
        porcentaje_completado: progressPercentage,
        estado: totalCompleted >= 90 ? 'completado' : 'activo',
        fecha_fin:
          totalCompleted >= 90
            ? existingRouteProgress?.fecha_fin || now
            : existingRouteProgress?.fecha_fin || null,
        updated_at: now,
      }

      const { error: routeProgressError } = existingRouteProgress
        ? await supabase
            .from('a2_user_route_progress')
            .update(routeProgressPayload)
            .eq('id', existingRouteProgress.id)
        : await supabase.from('a2_user_route_progress').insert({
            ...routeProgressPayload,
            created_at: now,
          })

      if (routeProgressError) {
        console.error(
          '[v0] Error syncing compatibility A2 route progress:',
          routeProgressError,
        )
      }
    }

    const nextCheckpoint = extensionRequired
      ? null
      : getA3CheckpointForDay(nextDay)

    return NextResponse.json({
      success: true,
      analysis: day1Analysis,
      validation: missionValidation,
      progression: {
        day,
        alreadyCompleted: Boolean(existingCompletion),
        nextDay,
        currentDay: nextDay,
        highestUnlockedDay,
        activeHorizon: snapshot.activeHorizon,
        extensionRequired,
        nextHorizon,
        completedDays,
        progressPercentage,
        route,
      },
      a3_unlocks: nextCheckpoint
        ? [
            {
              day: nextDay,
              moduleId: nextCheckpoint.moduleId,
              moduleTitle: nextCheckpoint.moduleTitle,
              route: nextCheckpoint.route,
            },
          ]
        : [],
    })
  } catch (error) {
    console.error('[v0] A2 complete-day error:', error)
    return NextResponse.json(
      { error: 'No pudimos completar el día.' },
      { status: 500 },
    )
  }
}
