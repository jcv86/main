import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { A2_DAILY_MISSIONS } from '@/lib/a2-missions-full'
import {
  getA2ProgressSnapshot,
  resolveA2Route,
} from '@/lib/a2/server-progress'
import { normalizeA2MissionSubmission } from '@/lib/a2/day-submission'
import { buildA2RouteAdaptation } from '@/lib/a2/route-adaptation'

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

function normalizeModuleId(value: string): string {
  return NUMERIC_TO_SLUG[value] ?? value
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

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ day: string }> },
) {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { day: rawDay } = await params
    const day = Number(rawDay)
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

    const userId = currentUser.id
    const supabase = createAdminClient()
    const [snapshot, route] = await Promise.all([
      getA2ProgressSnapshot(userId, supabase),
      resolveA2Route(userId, supabase),
    ])
    const adaptation = buildA2RouteAdaptation(route, mission)
    const previousDay = mission.unlockRequirements.requiredPreviousDay

    const [completionResult, previousResult, a3Result] = await Promise.all([
      supabase
        .from('a2_user_task_completions')
        .select(
          'id, mission_type, submission, validation_status, validation_result, completed_at, updated_at',
        )
        .eq('user_id', userId)
        .eq('day', day)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      previousDay
        ? supabase
            .from('a2_user_task_completions')
            .select('id, completed_at')
            .eq('user_id', userId)
            .eq('day', previousDay)
            .not('completed_at', 'is', null)
            .limit(1)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from('a3_user_progress')
        .select('completed_module_ids')
        .eq('user_id', userId)
        .maybeSingle(),
    ])

    if (completionResult.error) {
      console.error('[v0] Error reading A2 day completion:', completionResult.error)
    }
    if (previousResult.error) {
      console.error('[v0] Error reading previous A2 day:', previousResult.error)
    }
    if (a3Result.error) {
      console.error('[v0] Error reading A3 day prerequisites:', a3Result.error)
    }

    const completion = completionResult.data
    const isCompleted = Boolean(completion?.completed_at)
    const previousCompleted = !previousDay || Boolean(previousResult.data?.completed_at)
    const withinUnlockedRange = day <= snapshot.highestUnlockedDay
    const completedA3Modules = completedModuleIds(
      a3Result.data?.completed_module_ids,
    )
    const requiredA3Modules = Array.from(
      new Set(
        [
          ...(mission.unlockRequirements.requiredCompletedA3Modules || []),
          ...(mission.a3Checkpoint ? [mission.a3Checkpoint.moduleId] : []),
        ].map(normalizeModuleId),
      ),
    )
    const missingA3Modules = requiredA3Modules.filter(
      (moduleId) => !completedA3Modules.includes(moduleId),
    )

    const blockReasons: string[] = []
    if (!isCompleted && !withinUnlockedRange) {
      blockReasons.push(
        `Este día aún no está disponible. Actualmente puedes avanzar hasta el Día ${snapshot.highestUnlockedDay}.`,
      )
    }
    if (!isCompleted && !previousCompleted && previousDay) {
      blockReasons.push(`Completa primero el Día ${previousDay}.`)
    }

    const canAccess = isCompleted || (withinUnlockedRange && previousCompleted)
    const persistedSubmission = normalizeA2MissionSubmission(
      mission,
      completion?.submission,
    )
    const validation = objectValue(completion?.validation_result)

    return NextResponse.json({
      success: true,
      day,
      mission: {
        day: mission.day,
        slug: mission.slug,
        missionType: mission.missionType,
        title: mission.title,
        subtitle: mission.subtitle,
        deliverable: mission.deliverable,
      },
      route: route
        ? {
            id: route.id,
            code: route.code,
            name: route.name,
            description: route.description,
            source: route.source,
          }
        : null,
      adaptation,
      access: {
        canAccess,
        blockReasons,
        currentDay: snapshot.currentDay,
        highestUnlockedDay: snapshot.highestUnlockedDay,
        activeHorizon: snapshot.activeHorizon,
        requiredPreviousDay: previousDay || null,
        previousCompleted,
      },
      completion: completion
        ? {
            id: completion.id,
            isCompleted,
            missionType: completion.mission_type || mission.missionType,
            validationStatus: completion.validation_status || 'legacy',
            validation,
            submission: persistedSubmission,
            completedAt: completion.completed_at || null,
            updatedAt: completion.updated_at || null,
          }
        : null,
      checkpoint: mission.a3Checkpoint
        ? {
            ...mission.a3Checkpoint,
            completed: missingA3Modules.length === 0,
            missingModules: missingA3Modules,
          }
        : null,
    })
  } catch (error) {
    console.error('[v0] A2 day-state error:', error)
    return NextResponse.json(
      { error: 'No pudimos verificar el estado del día.' },
      { status: 500 },
    )
  }
}
