import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { A2_DAYS } from '@/lib/a2-days-config'
import { getA3CheckpointForDay } from '@/lib/a3-checkpoint-map'
import { getA2ProgressSnapshot, resolveA2Route } from '@/lib/a2/server-progress'

interface CompleteDayBody {
  dayNumber?: unknown
  submission?: unknown
}

function phaseForDay(day: number): number {
  if (day <= 10) return 1
  if (day <= 30) return 2
  if (day <= 60) return 3
  return 4
}

function objectValue(value: unknown): Record<string, any> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {}
}

function stringValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

async function persistDay1Submission(
  supabase: any,
  userId: string,
  submission: Record<string, any>,
  now: string,
) {
  const totalScore = Number(submission.totalScore)
  const hasScore = Number.isFinite(totalScore)
  const rawStatus = submission.passStatus
  const passFailStatus =
    rawStatus === 'pass' ? 'pass' : rawStatus === 'fail' ? 'needs_revision' : null

  const payload = {
    user_id: userId,
    vision_role: stringValue(submission.targetRole),
    vision_environment:
      stringValue(submission.hypothesis) || stringValue(submission.mainBlocker),
    vision_desired_outcome: stringValue(submission.change30Days),
    milestone_day10: stringValue(submission.gates?.identity),
    milestone_day20: stringValue(submission.gates?.evidence),
    milestone_day30:
      stringValue(submission.roadmap) || stringValue(submission.gates?.material),
    action_plan: submission,
    analysis_score: hasScore
      ? Math.max(0, Math.min(100, Math.round(totalScore)))
      : null,
    analysis_result: {
      scores: submission.scores || null,
      gates: submission.gates || null,
      roadmap: submission.roadmap || null,
    },
    analysis_status: hasScore ? 'completed' : 'pending',
    pass_fail_status: passFailStatus,
    current_step: 8,
    completed_steps: [1, 2, 3, 4, 5, 6, 7, 8],
    completed_at: passFailStatus === 'pass' ? now : null,
    updated_at: now,
  }

  const { data: existing, error: lookupError } = await supabase
    .from('a2_day1_submissions')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (lookupError) {
    console.error('[v0] Error reading Day 1 submission:', lookupError)
    return
  }

  const { error } = existing
    ? await supabase.from('a2_day1_submissions').update(payload).eq('id', existing.id)
    : await supabase.from('a2_day1_submissions').insert({
        ...payload,
        created_at: now,
      })

  if (error) console.error('[v0] Error saving Day 1 submission:', error)
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
        },
        { status: 409 },
      )
    }

    const { data: existingCompletion, error: completionLookupError } =
      await supabase
        .from('a2_user_task_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('day', day)
        .limit(1)
        .maybeSingle()

    if (completionLookupError) {
      console.error('[v0] Error checking A2 completion:', completionLookupError)
      return NextResponse.json(
        { error: 'No pudimos verificar el avance.' },
        { status: 500 },
      )
    }

    const taskTitle = A2_DAYS[day]?.title || `Día ${day}`
    const { error: completionError } = existingCompletion
      ? await supabase
          .from('a2_user_task_completions')
          .update({
            phase: phaseForDay(day),
            task_title: taskTitle,
            completed_at: now,
            updated_at: now,
          })
          .eq('id', existingCompletion.id)
      : await supabase.from('a2_user_task_completions').insert({
          user_id: userId,
          phase: phaseForDay(day),
          day,
          task_title: taskTitle,
          completed_at: now,
          created_at: now,
          updated_at: now,
        })

    if (completionError) {
      console.error('[v0] Error marking A2 day complete:', completionError)
      return NextResponse.json(
        { error: 'No pudimos registrar el avance. Intenta nuevamente.' },
        { status: 500 },
      )
    }

    if (day === 1 && Object.keys(submission).length > 0) {
      await persistDay1Submission(supabase, userId, submission, now)
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
    const nextDay =
      day >= snapshot.highestUnlockedDay
        ? Math.min(90, day + 1)
        : snapshot.highestUnlockedDay
    const highestUnlockedDay = Math.max(snapshot.highestUnlockedDay, nextDay)
    const progressPercentage = Math.min(
      100,
      Math.round((totalCompleted / 90) * 100),
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

    const nextCheckpoint = getA3CheckpointForDay(nextDay)

    return NextResponse.json({
      success: true,
      progression: {
        day,
        alreadyCompleted: Boolean(existingCompletion),
        nextDay,
        currentDay: nextDay,
        highestUnlockedDay,
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
