import { createAdminClient } from '@/lib/supabase/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import { NextRequest, NextResponse } from 'next/server'
import { getA2ProgressSnapshot, resolveA2Route } from '@/lib/a2/server-progress'

const TOTAL_DAYS = 90

function monthStatus(completed: number) {
  if (completed >= 30) return 'completed'
  if (completed > 0) return 'in_progress'
  return 'pending'
}

function emptyProgress() {
  return {
    current_month: 1,
    current_day: 1,
    highest_unlocked_day: 1,
    progress_percentage: 0,
    completed_tasks: 0,
    completed_days: [],
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

/**
 * GET /api/a2/progress
 *
 * Returns the real A2 state for the verified current user. The canonical source
 * is `despega_journey_state`; task completions provide the progress history.
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
        .select('day, completed_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null),
    ])

    if (completionsResult.error) {
      console.error('[v0] Error fetching A2 completions:', completionsResult.error)
    }

    const completedDays = Array.from(
      new Set(
        (completionsResult.data || [])
          .map((completion) => Number(completion.day))
          .filter((day) => Number.isInteger(day) && day >= 1 && day <= TOTAL_DAYS),
      ),
    ).sort((left, right) => left - right)

    const totalCompleted = completedDays.length
    const progressPercentage = Math.min(
      100,
      Math.round((totalCompleted / TOTAL_DAYS) * 100),
    )
    const currentMonth = snapshot.currentDay <= 30 ? 1 : snapshot.currentDay <= 60 ? 2 : 3
    const status =
      totalCompleted === 0
        ? 'not_started'
        : totalCompleted >= TOTAL_DAYS
          ? 'completed'
          : 'in_progress'

    const monthCounts = [
      completedDays.filter((day) => day >= 1 && day <= 30).length,
      completedDays.filter((day) => day >= 31 && day <= 60).length,
      completedDays.filter((day) => day >= 61 && day <= 90).length,
    ]

    return NextResponse.json(
      {
        current_month: currentMonth,
        current_day: snapshot.currentDay,
        highest_unlocked_day: snapshot.highestUnlockedDay,
        progress_source: snapshot.source,
        progress_percentage: progressPercentage,
        completed_tasks: totalCompleted,
        completed_days: completedDays,
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
