import { createClient } from '@/lib/supabase'

/**
 * Recomendaciones de tareas basadas en capacidad actual
 */
export async function recommendTasksForToday(userId: string) {
  const supabase = createClient()

  // 1. Obtener capacidad de hoy
  const { data: capacity } = await supabase
    .from('daily_capacity')
    .select('effective_capacity, success_probability')
    .eq('user_id', userId)
    .eq('date', new Date().toISOString().split('T')[0])
    .single()

  if (!capacity) {
    throw new Error('No capacity data for today')
  }

  const { effective_capacity, success_probability } = capacity
  
  // 2. Calcular cuántas tareas recomendar
  let recommendedTaskCount = 3
  if (success_probability > 75) {
    recommendedTaskCount = 5
  } else if (success_probability > 50) {
    recommendedTaskCount = 4
  } else if (success_probability < 25) {
    recommendedTaskCount = 2
  }

  return {
    effective_capacity,
    success_probability,
    recommended_task_count: recommendedTaskCount,
    warning: success_probability <= 15 ? 'CRITICAL' : success_probability <= 68 ? 'ALERT' : 'OK',
    message: 
      success_probability <= 15 
        ? 'Tu capacidad está crítica. Reduce carga.'
        : success_probability <= 68 
        ? 'En zona de compromiso fuerte. Mantén este ritmo.'
        : 'Capacidad sostenible. Buen momento para trabajar.',
  }
}

/**
 * Crear tarea recomendada por CIP
 */
export async function createCIPTask(
  userId: string,
  title: string,
  category: 'deep_work' | 'learning' | 'rest' | 'collaboration',
  estimatedDuration: number,
  priority: 1 | 2 | 3 = 2
) {
  const supabase = createClient()

  // Obtener P_success
  const { data: capacity } = await supabase
    .from('daily_capacity')
    .select('success_probability')
    .eq('user_id', userId)
    .eq('date', new Date().toISOString().split('T')[0])
    .single()

  const success_probability = capacity?.success_probability || 50

  const { data, error } = await supabase
    .from('cip_tasks')
    .insert({
      user_id: userId,
      title,
      category,
      priority,
      estimated_duration: estimatedDuration,
      predicted_success_rate: success_probability,
      recommended: true,
      status: 'pending',
    })
    .select()

  if (error) throw error
  return data[0]
}

/**
 * Completar tarea y actualizar capacidad
 */
export async function completeTask(
  userId: string,
  taskId: string,
  actualDuration: number,
  success: boolean
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('cip_tasks')
    .update({
      status: success ? 'completed' : 'failed',
      actual_duration: actualDuration,
      completed_at: new Date().toISOString(),
      capacity_used: (actualDuration / 60) * 10, // Aproximado: 10% por hora
    })
    .eq('id', taskId)
    .select()

  if (error) throw error

  // Registrar en log de tareas
  if (success) {
    await supabase
      .from('capacity_alerts')
      .insert({
        user_id: userId,
        alert_type: 'task_completed',
        message: `Task "${data[0].title}" completed in ${actualDuration}min`,
      })
  }

  return data[0]
}

/**
 * Obtener resumen diario de tareas
 */
export async function getDailyTaskSummary(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('cip_daily_task_summary')
    .select('*')
    .eq('user_id', userId)
    .eq('date', new Date().toISOString().split('T')[0])
    .single()

  if (error) return null
  return data
}
