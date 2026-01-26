import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/utils/supabase/server'

/**
 * Verifica si hay capacidad disponible para completar una tarea
 * GET /api/cip/task-capacity-check?userId=XXX&taskDifficulty=1-5
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const taskDifficulty = parseInt(searchParams.get('taskDifficulty') || '2')

  if (!userId) {
    return NextResponse.json(
      { error: 'userId required' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Get today's capacity
    const today = new Date().toISOString().split('T')[0]
    const { data: dailyCapacity, error: capacityError } = await supabase
      .from('daily_capacity')
      .select('effective_capacity, success_probability')
      .eq('user_id', userId)
      .eq('date', today)
      .maybeSingle()

    if (capacityError) throw capacityError

    // If no capacity data for today, use a1_base
    const { data: profile } = await supabase
      .from('user_capacity_profile')
      .select('a1_base_capacity')
      .eq('user_id', userId)
      .maybeSingle()

    const effectiveCapacity = dailyCapacity?.effective_capacity || profile?.a1_base_capacity || 50
    const successProbability = dailyCapacity?.success_probability || 50

    // Task requires ~25% capacity per difficulty level
    const taskCapacityNeeded = taskDifficulty * 15

    // Calculate if there's enough capacity
    const hasCapacity = effectiveCapacity >= taskCapacityNeeded
    const recommendedAction = 
      successProbability <= 15 ? 'CRITICAL_NO_TASK' :
      successProbability <= 68 && taskCapacityNeeded > effectiveCapacity ? 'REDUCE_DIFFICULTY' :
      'PROCEED'

    return NextResponse.json({
      userId,
      date: today,
      effectiveCapacity,
      successProbability,
      taskDifficulty,
      taskCapacityNeeded,
      hasCapacity,
      recommendedAction,
      message: 
        recommendedAction === 'CRITICAL_NO_TASK' ? 'Capacidad crítica. Descansa primero.' :
        recommendedAction === 'REDUCE_DIFFICULTY' ? 'Considera una tarea más simple hoy.' :
        'Adelante. Tienes capacidad disponible.',
    })
  } catch (error) {
    console.error('[CIP] Error checking capacity:', error)
    return NextResponse.json(
      { error: 'Failed to check capacity' },
      { status: 500 }
    )
  }
}
