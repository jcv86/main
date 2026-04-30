import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/a2/progress
 * Calculate user progress through A2 (90-day journey)
 * Returns current month and overall progress percentage
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        {
          current_month: 1,
          current_week: 1,
          progress_percentage: 0,
          month_progress: [
            { month: 1, percentage: 0, completed: false },
            { month: 2, percentage: 0, completed: false },
            { month: 3, percentage: 0, completed: false },
          ],
          milestones: [],
          status: 'not_started',
        },
        { status: 200 }
      )
    }

    const userId = user.id

    // Fetch A2 progress from database
    const { data: a2Progress } = await supabase
      .from('a2_user_progress')
      .select('mes_actual, semana_actual, progreso_porcentaje, fecha_inicio, completed_activities')
      .eq('user_id', userId)
      .single()

    if (!a2Progress) {
      return NextResponse.json(
        {
          current_month: 1,
          current_week: 1,
          progress_percentage: 0,
          month_progress: [
            { month: 1, percentage: 0, completed: false },
            { month: 2, percentage: 0, completed: false },
            { month: 3, percentage: 0, completed: false },
          ],
          milestones: [],
          status: 'not_started',
        },
        { status: 200 }
      )
    }

    const currentMonth = a2Progress.mes_actual || 1
    const currentWeek = a2Progress.semana_actual || 1
    const overallProgress = a2Progress.progreso_porcentaje || 0

    // Calculate progress per month (approximate)
    const monthProgress = [
      { month: 1, percentage: currentMonth >= 1 ? Math.min(overallProgress * 0.4, 100) : 0, completed: currentMonth > 1 },
      { month: 2, percentage: currentMonth >= 2 ? Math.min(overallProgress * 0.35, 100) : 0, completed: currentMonth > 2 },
      { month: 3, percentage: currentMonth >= 3 ? Math.min(overallProgress * 0.25, 100) : 0, completed: currentMonth > 3 },
    ]

    // Define milestones for each month
    const milestones = [
      { month: 1, title: 'Tus Objetivos', status: currentMonth >= 1 ? 'completed' : 'pending' },
      { month: 1, title: 'Tu Ruta Personalizada', status: currentMonth >= 1 ? 'completed' : 'pending' },
      { month: 2, title: 'Evaluaciones Intermedias', status: currentMonth >= 2 ? 'completed' : 'pending' },
      { month: 2, title: 'Ajustes y Mejoras', status: currentMonth >= 2 ? 'completed' : 'pending' },
      { month: 3, title: 'Evaluación Final', status: currentMonth >= 3 ? 'completed' : 'pending' },
      { month: 3, title: 'Plan de Acción', status: currentMonth >= 3 ? 'completed' : 'pending' },
    ]

    const status = 
      overallProgress === 0 ? 'not_started' :
      overallProgress < 50 ? 'in_progress' :
      overallProgress < 100 ? 'near_completion' :
      'completed'

    return NextResponse.json(
      {
        current_month: currentMonth,
        current_week: currentWeek,
        progress_percentage: Math.round(overallProgress),
        month_progress: monthProgress,
        milestones: milestones.filter((m) => m.month === currentMonth),
        status,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error fetching A2 progress:', error)
    return NextResponse.json(
      {
        current_month: 1,
        current_week: 1,
        progress_percentage: 0,
        month_progress: [
          { month: 1, percentage: 0, completed: false },
          { month: 2, percentage: 0, completed: false },
          { month: 3, percentage: 0, completed: false },
        ],
        milestones: [],
        status: 'error',
      },
      { status: 200 }
    )
  }
}
