import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  emptyGamificationSummary,
  getGamificationSummary,
} from '@/lib/gamification/server-summary'

function toApiPayload(summary: Awaited<ReturnType<typeof getGamificationSummary>>) {
  return {
    total_xp: summary.totalXp,
    current_level: summary.currentLevel,
    level_label: summary.levelLabel,
    xp_to_next_level: summary.xpToNextLevel,
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

export async function GET() {
  try {
    const currentUser = await resolveServerUser()
    if (!currentUser) {
      return NextResponse.json(toApiPayload(emptyGamificationSummary()))
    }

    const summary = await getGamificationSummary(currentUser.id)
    return NextResponse.json(toApiPayload(summary))
  } catch (error) {
    console.error('[v0] Error fetching global gamification:', error)
    return NextResponse.json(toApiPayload(emptyGamificationSummary()))
  }
}
