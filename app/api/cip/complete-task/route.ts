import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

/**
 * Registra que se completó una tarea y actualiza capacidad
 * POST /api/cip/complete-task
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, taskId, taskDifficulty, timeSpent } = body

    if (!userId || !taskId) {
      return NextResponse.json(
        { error: 'userId and taskId required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Record task session
    const { data: taskSession, error: sessionError } = await supabase
      .from('task_sessions')
      .insert({
        user_id: userId,
        task_id: taskId,
        difficulty_level: taskDifficulty || 2,
        duration_minutes: timeSpent || 30,
        status: 'completed',
      })
      .select()
      .single()

    if (sessionError) throw sessionError

    // Get current capacity and update it
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyCapacity } = await supabase
      .from('daily_capacity')
      .select('effective_capacity, success_probability')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle()

    // Simulate capacity drain from task (simplified model)
    const capacityDrain = (taskDifficulty || 2) * 8 // Each level = ~8% drain
    const newCapacity = Math.max(10, (dailyCapacity?.effective_capacity || 50) - capacityDrain)

    // Update or create daily capacity
    if (dailyCapacity) {
      await supabase
        .from('daily_capacity')
        .update({
          effective_capacity: newCapacity,
          success_probability: newCapacity * 0.85,
        })
        .eq('user_id', userId)
        .eq('date', today)
    }

    return NextResponse.json({
      success: true,
      taskSession,
      newCapacity,
      message: `Tarea completada. Capacidad restante: ${newCapacity.toFixed(1)}%`,
    })
  } catch (error) {
    console.error('[CIP] Error completing task:', error)
    return NextResponse.json(
      { error: 'Failed to complete task' },
      { status: 500 }
    )
  }
}
