import { NextResponse } from 'next/server'
import { resolveServerUser } from '@/lib/auth/server-user'
import {
  emptyGamificationSummary,
  getGamificationSummary,
} from '@/lib/gamification/server-summary'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const currentUser = await resolveServerUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const summary = await getGamificationSummary(currentUser.id)

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (error) {
    console.error('[v0] Error fetching gamification profile:', error)
    return NextResponse.json(
      {
        success: false,
        summary: emptyGamificationSummary(),
        error: 'Failed to fetch profile',
      },
      { status: 500 },
    )
  }
}
