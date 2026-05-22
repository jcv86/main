import { NextRequest, NextResponse } from 'next/server'
import { getA2DailyTask } from '@/lib/a2-daily-tasks'

export async function GET(request: NextRequest) {
  try {
    const day = request.nextUrl.searchParams.get('day')
    
    if (!day || isNaN(parseInt(day))) {
      return NextResponse.json(
        { error: 'Day parameter required and must be a number' },
        { status: 400 }
      )
    }

    const dayNumber = parseInt(day)
    if (dayNumber < 1 || dayNumber > 90) {
      return NextResponse.json(
        { error: 'Day must be between 1 and 90' },
        { status: 400 }
      )
    }

    const task = getA2DailyTask(dayNumber)

    if (!task) {
      // Return a rest day if no task defined
      return NextResponse.json({
        day: dayNumber,
        type: 'rest',
        title: 'Rest Day - Consolidate Learning',
        description: 'Review progress, consolidate learnings, prepare for next tasks',
        duration: 30,
        priority: 'low',
        xpReward: 20,
        isRestDay: true
      })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('[v0] Error fetching daily task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily task' },
      { status: 500 }
    )
  }
}
