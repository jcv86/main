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

    // Calculate month percentages
    const total30Days = (route.route_30days || []).length || 30
    const total60Days = (route.route_60days || []).length || 30
    const total90Days = (route.route_90days || []).length || 30

    const month1Percentage = Math.round((completed30days / total30Days) * 100)
    const month2Percentage = Math.round((completed60days / total60Days) * 100)
    const month3Percentage = Math.round((completed90days / total90Days) * 100)

    return NextResponse.json(
      {
        current_month: currentMonth,
        progress_percentage: progressPercentage,
        completed_tasks: totalCompleted,
        total_tasks: totalTasks,
        status,
        month_progress: [
          { month: 1, percentage: month1Percentage, completed: completed30days === total30Days },
          { month: 2, percentage: month2Percentage, completed: completed60days === total60Days },
          { month: 3, percentage: month3Percentage, completed: completed90days === total90Days },
        ],
        milestones: [
          { month: 1, title: '30 días - Primer milestone', status: completed30days === total30Days ? 'completed' : completed30days > 0 ? 'in_progress' : 'pending' },
          { month: 2, title: '60 días - Segundo milestone', status: completed60days === total60Days ? 'completed' : completed60days > 0 ? 'in_progress' : 'pending' },
          { month: 3, title: '90 días - Completado', status: completed90days === total90Days ? 'completed' : completed90days > 0 ? 'in_progress' : 'pending' },
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const userId = user.id

    // Mark day as completed
    const { error: insertError } = await supabase
      .from('task_completions')
      .insert({
        user_id: userId,
        phase_days: dayNumber <= 30 ? 30 : dayNumber <= 60 ? 60 : 90,
        task_day: dayNumber,
        task_title: `Day ${dayNumber}`,
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
