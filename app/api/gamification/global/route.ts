import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  emptyGamificationSummary,
  getGamificationSummary,
} from '@/lib/gamification/server-summary'
import {
  DTC_REQUEST_ID_HEADER,
  resolveRequestId,
} from '@/lib/observability/request-id'
import { logOperationalError } from '@/lib/observability/server-log'

type AvailabilityReason = 'unauthenticated' | 'unavailable' | null

function toApiPayload(
  summary: Awaited<ReturnType<typeof getGamificationSummary>>,
  requestId: string,
  available = true,
  availabilityReason: AvailabilityReason = null,
) {
  return {
    request_id: requestId,
    available,
    availability_reason: availabilityReason,
    total_xp: summary.totalXp,
    current_level: summary.currentLevel,
    level_label: summary.levelLabel,
    xp_to_next_level: summary.xpToNextLevel,
    xp_progress_percent: summary.xpProgressPercent,
    daily_streak: summary.dailyStreak,
    total_points: summary.totalPoints,
    badges: summary.badges,
    sections: {
      a3: {
        name: 'Entrenamiento',
        xp: summary.training.xp,
        completed: summary.training.completed,
        total: summary.training.total,
        progress: summary.training.progress,
      },
      training: {
        name: 'Prácticas y simulaciones',
        completed: summary.training.practicesCompleted,
        interviews: summary.training.interviewsCompleted,
      },
      a4: {
        name: 'Radar Estratégico',
        xp: 0,
        completed: summary.radar.completed,
        total: summary.radar.total,
        progress: summary.radar.progress,
      },
    },
    breakdown: {
      a3_xp: summary.training.xp,
      training_xp: 0,
      a4_xp: 0,
      interview_bonus: summary.interviewBonus,
    },
  }
}

function jsonResponse(
  payload: ReturnType<typeof toApiPayload>,
  requestId: string,
  cacheControl = 'no-store',
) {
  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': cacheControl,
      [DTC_REQUEST_ID_HEADER]: requestId,
    },
  })
}

export async function GET(request: Request) {
  const requestId = resolveRequestId(request.headers)

  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return jsonResponse(
        toApiPayload(
          emptyGamificationSummary(),
          requestId,
          false,
          'unauthenticated',
        ),
        requestId,
      )
    }

    const summary = await getGamificationSummary(currentUser.id)
    return jsonResponse(toApiPayload(summary, requestId), requestId, 'private, no-store')
  } catch (error) {
    logOperationalError({
      event: 'gamification.global.failed',
      requestId,
      route: '/api/gamification/global',
      status: 200,
      error,
    })
    return jsonResponse(
      toApiPayload(
        emptyGamificationSummary(),
        requestId,
        false,
        'unavailable',
      ),
      requestId,
    )
  }
}
