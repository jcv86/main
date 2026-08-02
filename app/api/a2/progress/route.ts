import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextRequest, NextResponse } from 'next/server'
import { getA2ProgressSnapshot, resolveA2Route } from '@/lib/a2/server-progress'
import { nextA2Horizon } from '@/lib/a2/horizon'

const TOTAL_DAYS = 90

interface CompletionRow {
  day: unknown
  mission_type?: unknown
  validation_status?: unknown
  validation_result?: unknown
  submission?: unknown
  completed_at?: unknown
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function numberValue(value: unknown): number | null {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

function monthStatus(completed: number) {
  if (completed >= 30) return 'completed'
  if (completed > 0) return 'in_progress'
  return 'pending'
}

function emptyValidationSummary() {
  return {
    validated_days: 0,
    evidence_days: 0,
    structural_days: 0,
    specialized_days: 0,
    checkpoint_days: 0,
    legacy_days: 0,
    average_score: null as number | null,
  }
}

function emptyProgress() {
  return {
    current_month: 1,
    current_day: 1,
    highest_unlocked_day: 1,
    active_horizon: 30,
    next_horizon: 60,
    extension_available: false,
    cycle_complete: false,
    progress_percentage: 0,
    completed_tasks: 0,
    completed_days: [] as number[],
    day_records: [] as Array<Record<string, unknown>>,
    validation_summary: emptyValidationSummary(),
    total_tasks: TOTAL_DAYS,
    status: 'not_started',
    route: null,
    month_progress: [
      { month: 1, percentage: 0, completed: false },
      { month: 2, percentage: 0, completed: false },
      { month: 3, percentage: 0, completed: false },
    ],
    milestones: [
      { month: 1, title: 'Primer ciclo de 30 días', status: 'pending' },
      { month: 2, title: 'Extensión a 60 días', status: 'pending' },
      { month: 3, title: 'Integración a 90 días', status: 'pending' },
    ],
  }
}

function normalizeCompletion(row: CompletionRow) {
  const day = Number(row.day)
  const validation = objectValue(row.validation_result)
  const submission = objectValue(row.submission)
  const validationStatus = textValue(row.validation_status) || 'legacy'
  const score = numberValue(validation.score)
  const passScore = numberValue(validation.passScore)
  const artifactUrl = textValue(submission.artifactUrl)
  const hasEvidence =
    Object.keys(submission).length > 0 &&
    ['summary', 'evidence', 'reflection', 'metrics', 'artifactUrl'].some(
      (key) => textValue(submission[key]).trim().length > 0,
    )

  return {
    day,
    mission_type: textValue(row.mission_type) || null,
    validation_status: validationStatus,
    score,
    pass_score: passScore,
    passed: validation.passed !== false,
    has_evidence: hasEvidence,
    artifact_url: artifactUrl || null,
    completed_at: textValue(row.completed_at) || null,
  }
}

/**
 * GET /api/a2/progress
 *
 * Returns canonical A2 progression, evidence quality and the explicit active
 * horizon. Completing Day 30/60 exposes an extension decision rather than
 * silently unlocking the next cycle.
 */
export async function GET() {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json(emptyProgress(), { status: 200 })
    }

    const userId = currentUser.id
    const supabase = createAdminClient()
    const [snapshot, route, completionsResult] = await Promise.all([
      getA2ProgressSnapshot(userId, supabase),
      resolveA2Route(userId, supabase),
      supabase
        .from('a2_user_task_completions')
        .select(
          'day, mission_type, validation_status, validation_result, submission, completed_at',
        )
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false }),
    ])

    if (completionsResult.error) {
      console.error('[v0] Error fetching A2 completions:', completionsResult.error)
    }

    const recordByDay = new Map<number, ReturnType<typeof normalizeCompletion>>()
    for (const rawRow of (completionsResult.data || []) as CompletionRow[]) {
      const record = normalizeCompletion(rawRow)
      if (
        Number.isInteger(record.day) &&
        record.day >= 1 &&
        record.day <= TOTAL_DAYS &&
        !recordByDay.has(record.day)
      ) {
        recordByDay.set(record.day, record)
      }
    }

    const dayRecords = Array.from(recordByDay.values()).sort(
      (left, right) => left.day - right.day,
    )
    const completedDays = dayRecords.map((record) => record.day)
    const totalCompleted = completedDays.length
    const completedInsideHorizon = completedDays.filter(
      (day) => day <= snapshot.activeHorizon,
    ).length
    const progressPercentage = Math.min(
      100,
      Math.round((completedInsideHorizon / snapshot.activeHorizon) * 100),
    )
    const currentMonth =
      snapshot.currentDay <= 30 ? 1 : snapshot.currentDay <= 60 ? 2 : 3
    const nextHorizon = nextA2Horizon(snapshot.activeHorizon)
    const cycleComplete = completedDays.includes(snapshot.activeHorizon)
    const extensionAvailable = cycleComplete && nextHorizon !== null
    const status =
      totalCompleted === 0
        ? 'not_started'
        : snapshot.activeHorizon === 90 && cycleComplete
          ? 'completed'
          : extensionAvailable
            ? 'awaiting_extension'
            : 'in_progress'

    const monthCounts = [
      completedDays.filter((day) => day >= 1 && day <= 30).length,
      completedDays.filter((day) => day >= 31 && day <= 60).length,
      completedDays.filter((day) => day >= 61 && day <= 90).length,
    ]
    const scoredRecords = dayRecords.filter(
      (record) => record.score !== null && record.validation_status !== 'legacy',
    )
    const validationSummary = {
      validated_days: dayRecords.filter((record) =>
        ['structural', 'specialized', 'checkpoint'].includes(
          record.validation_status,
        ),
      ).length,
      evidence_days: dayRecords.filter((record) => record.has_evidence).length,
      structural_days: dayRecords.filter(
        (record) => record.validation_status === 'structural',
      ).length,
      specialized_days: dayRecords.filter(
        (record) => record.validation_status === 'specialized',
      ).length,
      checkpoint_days: dayRecords.filter(
        (record) => record.validation_status === 'checkpoint',
      ).length,
      legacy_days: dayRecords.filter(
        (record) => record.validation_status === 'legacy',
      ).length,
      average_score:
        scoredRecords.length > 0
          ? Math.round(
              scoredRecords.reduce(
                (sum, record) => sum + (record.score || 0),
                0,
              ) / scoredRecords.length,
            )
          : null,
    }

    return NextResponse.json(
      {
        current_month: currentMonth,
        current_day: snapshot.currentDay,
        highest_unlocked_day: snapshot.highestUnlockedDay,
        active_horizon: snapshot.activeHorizon,
        next_horizon: nextHorizon,
        extension_available: extensionAvailable,
        cycle_complete: cycleComplete,
        progress_source: snapshot.source,
        progress_percentage: progressPercentage,
        completed_tasks: totalCompleted,
        completed_days: completedDays,
        day_records: dayRecords,
        validation_summary: validationSummary,
        total_tasks: TOTAL_DAYS,
        status,
        route,
        month_progress: monthCounts.map((completed, index) => ({
          month: index + 1,
          percentage: Math.min(100, Math.round((completed / 30) * 100)),
          completed: completed >= 30,
        })),
        milestones: [
          {
            month: 1,
            title: 'Primer ciclo de 30 días',
            status: monthStatus(monthCounts[0]),
          },
          {
            month: 2,
            title: 'Extensión a 60 días',
            status: monthStatus(monthCounts[1]),
          },
          {
            month: 3,
            title: 'Integración a 90 días',
            status: monthStatus(monthCounts[2]),
          },
        ],
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('[v0] Error fetching A2 progress:', error)
    return NextResponse.json(
      { ...emptyProgress(), status: 'error' },
      { status: 200 },
    )
  }
}

/**
 * Compatibility POST: all writes are delegated to the canonical complete-day
 * endpoint so there is only one progression implementation.
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const target = new URL('/api/a2/complete-day', request.url)

  return fetch(target, {
    method: 'POST',
    headers: {
      'Content-Type': request.headers.get('content-type') || 'application/json',
      cookie: request.headers.get('cookie') || '',
    },
    body,
  })
}
