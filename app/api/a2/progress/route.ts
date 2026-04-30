import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/a2/progress
 * Calculate user progress through A2 (90-day journey)
 * Returns current month and overall progress percentage based on completed tasks
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          current_month: 1,
          progress_percentage: 0,
          completed_tasks: 0,
          total_tasks: 90,
          status: 'not_started',
        },
        { status: 200 }
      )
    }

    const userId = user.id

    // Fetch user's personalized route
    const { data: profileData } = await supabase
      .from('despegar_profiles')
      .select('id, personalized_route')
      .eq('user_id', userId)
      .single()

    if (!profileData?.personalized_route) {
      return NextResponse.json(
        {
          current_month: 1,
          progress_percentage: 0,
          completed_tasks: 0,
          total_tasks: 90,
          status: 'not_started',
        },
        { status: 200 }
      )
    }

    const route = profileData.personalized_route as any
    
    // Fetch completed tasks for this user
    const { data: completions } = await supabase
      .from('task_completions')
      .select('phase_days, task_day, task_title')
      .eq('user_id', userId)

    // Convert completions to set for fast lookup
    const completedTasks = new Set(
      (completions || []).map(c => `${c.phase_days}-${c.task_day}-${c.task_title}`)
    )

    // Get all tasks from the route
    const allTasks = [
      ...(route.route_30days || []),
      ...(route.route_60days || []),
      ...(route.route_90days || [])
    ]

    // Calculate which tasks from each phase are completed
    const completed30days = (route.route_30days || []).filter((task: any) =>
      completedTasks.has(`30-${task.day}-${task.title}`)
    ).length

    const completed60days = (route.route_60days || []).filter((task: any) =>
      completedTasks.has(`60-${task.day}-${task.title}`)
    ).length

    const completed90days = (route.route_90days || []).filter((task: any) =>
      completedTasks.has(`90-${task.day}-${task.title}`)
    ).length

    const totalCompleted = completed30days + completed60days + completed90days
    const totalTasks = allTasks.length
    const progressPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0

    // Determine current month based on which phase has most completion
    let currentMonth = 1
    if (completed30days === (route.route_30days || []).length && completed30days > 0) {
      currentMonth = 2
      if (completed60days === (route.route_60days || []).length && completed60days > 0) {
        currentMonth = 3
      }
    } else if (completed60days > 0 && completed30days < (route.route_30days || []).length) {
      // If working on month 2
      currentMonth = 2
    }

    const status = 
      progressPercentage === 0 ? 'not_started' :
      progressPercentage < 50 ? 'in_progress' :
      progressPercentage < 100 ? 'near_completion' :
      'completed'

    return NextResponse.json(
      {
        current_month: currentMonth,
        progress_percentage: progressPercentage,
        completed_tasks: totalCompleted,
        total_tasks: totalTasks,
        status,
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
