import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = await createClient()
    const { userId } = params

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get A1 progress
    const { data: a1Progress } = await supabase
      .from('a1_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    // Get A2 progress
    const { data: a2Progress } = await supabase
      .from('a2_user_route_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    // Get A3 progress
    const { data: a3Progress } = await supabase
      .from('a3_progreso_entrevistas')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    // Get A4 progress
    const { data: a4Progress } = await supabase
      .from('a4_strategic_score')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    // Get completed missions count
    const { data: missionsData, count: missionsCount } = await supabase
      .from('despega_user_misiones')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('completed', true)

    // Calculate overall progress percentage
    const progressPercentages = {
      a1: a1Progress?.tests_completed ? 100 : 0,
      a2: a2Progress?.porcentaje_completado || 0,
      a3: a3Progress ? Math.min((a3Progress.entrevistas_completadas || 0) * 10, 100) : 0,
      a4: a4Progress?.score ? Math.min((a4Progress.score / 100) * 100, 100) : 0
    }

    const overallProgress = Math.round(
      (progressPercentages.a1 + progressPercentages.a2 + progressPercentages.a3 + progressPercentages.a4) / 4
    )

    return NextResponse.json({
      userId,
      overall: overallProgress,
      phases: progressPercentages,
      missionsCompleted: missionsCount || 0,
      lastUpdated: new Date().toISOString(),
      details: {
        a1: a1Progress,
        a2: a2Progress,
        a3: a3Progress,
        a4: a4Progress
      }
    })
  } catch (error) {
    console.error('[v0] Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = await createClient()
    const { userId } = params
    const body = await request.json()

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { phase, percentage, milestone } = body

    console.log(`[v0] Updating progress for user ${userId}, phase: ${phase}`)

    // Update specific phase progress
    let updateResult
    switch (phase) {
      case 'A2':
        updateResult = await supabase
          .from('a2_user_route_progress')
          .update({ 
            porcentaje_completado: percentage,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        break
      case 'A3':
        updateResult = await supabase
          .from('a3_progreso_entrevistas')
          .update({ 
            puntuacion_promedio: percentage,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        break
      case 'A4':
        updateResult = await supabase
          .from('a4_strategic_score')
          .update({ 
            score: percentage,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
        break
    }

    // Log the update
    if (milestone) {
      await supabase
        .from('despega_pilar_progress')
        .insert({
          user_id: userId,
          pilar: phase,
          progreso: percentage,
          score: percentage,
          created_at: new Date().toISOString()
        })
    }

    return NextResponse.json({
      success: true,
      phase,
      percentage,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[v0] Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
