import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyDemoSessionToken, DEMO_COOKIE_NAME } from '@/lib/auth/demo-user'

/**
 * GET /api/a2/progress
 * Calculate user progress through A2 (90-day journey)
 * Returns current month and overall progress percentage based on completed tasks
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    // Fallback to demo cookie if no session
    let userId = user?.id
    if (!userId) {
      const cookieStore = await cookies()
      const demoToken = cookieStore.get(DEMO_COOKIE_NAME)?.value
      const demoUser = await verifyDemoSessionToken(demoToken)
      userId = demoUser?.id
    }

    if (!userId) {
      return NextResponse.json(
        {
          current_month: 1,
          progress_percentage: 0,
          completed_tasks: 0,
          total_tasks: 90,
          status: 'not_started',
          month_progress: [
            { month: 1, percentage: 0, completed: false },
            { month: 2, percentage: 0, completed: false },
            { month: 3, percentage: 0, completed: false },
          ],
          milestones: [
            { month: 1, title: '30 días - Primer milestone', status: 'pending' },
            { month: 2, title: '60 días - Segundo milestone', status: 'pending' },
            { month: 3, title: '90 días - Completado', status: 'pending' },
          ],
        },
        { status: 200 }
      )
    }

    // Fetch completed days from a2_user_task_completions
    const { data: completions } = await supabase
      .from('a2_user_task_completions')
      .select('day, completed_at')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)

    // Get unique completed days
    const completedDays = new Set(
      (completions || []).map((c) => c.day)
    )

    // Calculate progress based on completed days (max 90 days)
    const totalCompleted = completedDays.size
    const totalDays = 90
    const progressPercentage = Math.round((totalCompleted / totalDays) * 100)

    // Determine current month based on day progression
    // Month 1: Days 1-30
    // Month 2: Days 31-60
    // Month 3: Days 61-90
    let currentMonth = 1
    if (totalCompleted > 30) {
      currentMonth = 2
    }
    if (totalCompleted > 60) {
      currentMonth = 3
    }

    // If no completions yet, show month 1
    if (totalCompleted === 0) {
      currentMonth = 1
    }

    const status = 
      progressPercentage === 0 ? 'not_started' :
      progressPercentage < 50 ? 'in_progress' :
      progressPercentage < 100 ? 'near_completion' :
      'completed'

    // Calculate month percentages
    const month1Completed = Array.from(completedDays).filter((d) => d >= 1 && d <= 30).length
    const month2Completed = Array.from(completedDays).filter((d) => d >= 31 && d <= 60).length
    const month3Completed = Array.from(completedDays).filter((d) => d >= 61 && d <= 90).length

    const month1Percentage = Math.round((month1Completed / 30) * 100)
    const month2Percentage = Math.round((month2Completed / 30) * 100)
    const month3Percentage = Math.round((month3Completed / 30) * 100)

    return NextResponse.json(
      {
        current_month: currentMonth,
        progress_percentage: progressPercentage,
        completed_tasks: totalCompleted,
        total_tasks: totalDays,
        status,
        month_progress: [
          { month: 1, percentage: month1Percentage, completed: month1Percentage === 100 },
          { month: 2, percentage: month2Percentage, completed: month2Percentage === 100 },
          { month: 3, percentage: month3Percentage, completed: month3Percentage === 100 },
        ],
        milestones: [
          { month: 1, title: '30 días - Primer milestone', status: month1Percentage === 100 ? 'completed' : month1Completed > 0 ? 'in_progress' : 'pending' },
          { month: 2, title: '60 días - Segundo milestone', status: month2Percentage === 100 ? 'completed' : month2Completed > 0 ? 'in_progress' : 'pending' },
          { month: 3, title: '90 días - Completado', status: month3Percentage === 100 ? 'completed' : month3Completed > 0 ? 'in_progress' : 'pending' },
        ],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching A2 progress:', error)
    return NextResponse.json(
      {
        current_month: 1,
        progress_percentage: 0,
        completed_tasks: 0,
        total_tasks: 90,
        status: 'error',
      },
      { status: 200 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dayNumber } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // Fallback to demo cookie if no session
    let userId = user?.id
    if (!userId) {
      const cookieStore = await cookies()
      const demoToken = cookieStore.get(DEMO_COOKIE_NAME)?.value
      const demoUser = await verifyDemoSessionToken(demoToken)
      userId = demoUser?.id
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Mark day as completed in a2_user_task_completions
    const { error: insertError } = await supabase
      .from('a2_user_task_completions')
      .insert({
        user_id: userId,
        day: dayNumber,
        completed_at: new Date().toISOString(),
      })

    if (insertError && insertError.code !== '23505') { // 23505 is unique constraint violation
      console.error('[v0] Error marking day complete:', insertError)
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Day ${dayNumber} marked as completed`,
    })
  } catch (error) {
    console.error('[v0] Progress update error:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
