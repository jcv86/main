import { NextRequest, NextResponse } from 'next/server'
import { getA2DailyTask } from '@/lib/a2-daily-tasks'
import { getAdaptiveA2Task } from '@/lib/a2-adaptive-tasks'
import { createClient } from '@/lib/supabase/server'

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

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Try to get adaptive task if user is authenticated
    let task = null
    if (user) {
      task = await getAdaptiveA2Task({
        userId: user.id,
        dayNumber,
      })
    }

    // Fall back to static task if no adaptive task
    if (!task) {
      task = getA2DailyTask(dayNumber)
    }

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
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'CDN-Cache-Control': 'max-age=3600'
        }
      })
    }

    const response = NextResponse.json(task)
    // Cache adaptive tasks for shorter duration since they change per user
    const cacheControl = user ? 
      'private, s-maxage=300, stale-while-revalidate=600' : // 5 min for logged-in users
      'public, s-maxage=3600, stale-while-revalidate=86400' // 1 hour for static tasks
    
    response.headers.set('Cache-Control', cacheControl)
    response.headers.set('CDN-Cache-Control', user ? 'max-age=300' : 'max-age=3600')
    return response
  } catch (error) {
    console.error('[v0] Error fetching daily task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily task' },
      { status: 500 }
    )
  }
}
