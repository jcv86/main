// ============================================
// CIP - Capacity Calculation Logic
// Fase 2: Funciones de cálculo de capacidad
// ============================================

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ============================================
// 1. INICIALIZACIÓN (Cold Start)
// ============================================

export async function initializeUserCapacity(userId: string, a1Base: number = 100) {
  console.log('[v0] CIP: Inicializando capacidad para usuario:', userId)

  try {
    const { data, error } = await supabase
      .from('user_capacity_profile')
      .insert({
        user_id: userId,
        a1_base_capacity: a1Base,
        progression_phase: 'A1_Base',
        active_mode: 'focus',
        total_days_tracked: 0,
      })
      .select()
      .single()

    if (error) throw error

    console.log('[v0] CIP: Usuario inicializado exitosamente')
    return data
  } catch (error) {
    console.error('[v0] CIP Error en inicialización:', error)
    throw error
  }
}

// ============================================
// 2. CÁLCULO DE CAPACIDAD EFECTIVA
// ============================================

interface CapacityFactors {
  energyLevel: number // 0-100
  moodRating: number // 1-10
  sleepQuality: number // 1-10
  stressLevel: number // 1-10 (inverso: 10=sin estrés, 1=muy estresado)
  recoveryTime: number // días desde último descanso
}

export async function calculateEffectiveCapacity(
  userId: string,
  factors: CapacityFactors
): Promise<number> {
  console.log('[v0] CIP: Calculando capacidad efectiva para:', userId)

  try {
    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('user_capacity_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) throw profileError

    const a1Base = profile.a1_base_capacity

    // FÓRMULA: T_capacidad_actual = A1_Base * (E/100) * (M/10) * (S/10) * (Stress/10) * recovery_factor
    // Donde:
    // E = Energy (0-100)
    // M = Mood (1-10)
    // S = Sleep (1-10)
    // Stress = Stress Inverso (1-10, donde 10=sin estrés)
    // recovery_factor = min(1 + recoveryTime * 0.05, 1.3) - mejora 5% por día de descanso, máx 30%

    const energyFactor = factors.energyLevel / 100
    const moodFactor = factors.moodRating / 10
    const sleepFactor = factors.sleepQuality / 10
    const stressFactor = factors.stressLevel / 10
    const recoveryFactor = Math.min(1 + factors.recoveryTime * 0.05, 1.3)

    const effectiveCapacity =
      a1Base * energyFactor * moodFactor * sleepFactor * stressFactor * recoveryFactor

    console.log('[v0] CIP: Capacidad efectiva calculada:', effectiveCapacity)

    return Math.round(effectiveCapacity * 100) / 100 // Redondear a 2 decimales
  } catch (error) {
    console.error('[v0] CIP Error en cálculo de capacidad:', error)
    throw error
  }
}

// ============================================
// 3. CÁLCULO DE PROBABILIDAD DE ÉXITO
// ============================================

interface TaskContext {
  plannedTasks: number // Cantidad de tareas planeadas para hoy
  averageTaskDuration: number // Minutos promedio por tarea
  historicalCompletionRate: number // 0-100: % historico de tareas completadas
}

export async function calculateSuccessProbability(
  userId: string,
  effectiveCapacity: number,
  taskContext: TaskContext
): Promise<number> {
  console.log('[v0] CIP: Calculando probabilidad de éxito para:', userId)

  try {
    // P_success = (T_capacidad_actual / T_requerida) * H_historico * 100
    // Donde T_requerida = plannedTasks * averageTaskDuration

    const requiredCapacity = taskContext.plannedTasks * (taskContext.averageTaskDuration / 60)
    const capacityRatio = Math.min(effectiveCapacity / requiredCapacity, 1.0) // Max 100%
    const historicalFactor = taskContext.historicalCompletionRate / 100

    const successProbability = capacityRatio * historicalFactor * 100

    console.log('[v0] CIP: Probabilidad de éxito:', successProbability + '%')

    return Math.round(successProbability)
  } catch (error) {
    console.error('[v0] CIP Error en cálculo de probabilidad:', error)
    throw error
  }
}

// ============================================
// 4. VERIFICACIÓN DE UMBRALES Y ALERTAS
// ============================================

export async function checkCapacityThresholds(
  userId: string,
  successProbability: number,
  effectiveCapacity: number
) {
  console.log('[v0] CIP: Verificando umbrales para:', userId)

  const alerts = []

  try {
    // ALERTA 1: Zona de "Compromiso Fuerte" (68%)
    if (successProbability >= 68 && successProbability < 85) {
      const alertData = {
        user_id: userId,
        alert_type: 'strong_commitment',
        severity: 'info',
        threshold_percentage: 68,
        actual_capacity: successProbability,
        message: `¡Excelente! Tu probabilidad de éxito es ${successProbability}%. Estás en zona de compromiso fuerte.`,
        suggested_action:
          'Mantén este ritmo. Es sostenible y productivo. Pero monitorea tu energía.',
      }

      const { data: alert, error: alertError } = await supabase
        .from('capacity_alerts')
        .insert(alertData)
        .select()
        .single()

      if (!alertError) alerts.push(alert)
      console.log('[v0] CIP: Alerta 68% disparada')
    }

    // ALERTA 2: Zona de "Dificultad Alta / Frustración" (15% - CRITICAL)
    if (successProbability <= 15) {
      const alertData = {
        user_id: userId,
        alert_type: 'high_difficulty',
        severity: 'critical',
        threshold_percentage: 15,
        actual_capacity: successProbability,
        message: `⚠️ ALERTA: Tu probabilidad de éxito es solo ${successProbability}%. Zona de alta dificultad.`,
        suggested_action:
          'Reduce tareas planeadas, busca descanso, o ajusta tu A1_Base. No bloquea el sistema pero advierte riesgo de frustración.',
      }

      const { data: alert, error: alertError } = await supabase
        .from('capacity_alerts')
        .insert(alertData)
        .select()
        .single()

      if (!alertError) alerts.push(alert)
      console.log('[v0] CIP: Alerta CRÍTICA 15% disparada')
    }

    // ALERTA 3: Capacidad muy baja (< 10%)
    if (successProbability < 10) {
      const alertData = {
        user_id: userId,
        alert_type: 'critical_low_capacity',
        severity: 'critical',
        threshold_percentage: 10,
        actual_capacity: successProbability,
        message: `🚨 CRÍTICO: Tu capacidad es ${successProbability}%. Recomendamos descanso urgente.`,
        suggested_action:
          'Descansa hoy. El sistema no bloquea pero tu bienestar debe ser prioridad.',
      }

      const { data: alert, error: alertError } = await supabase
        .from('capacity_alerts')
        .insert(alertData)
        .select()
        .single()

      if (!alertError) alerts.push(alert)
      console.log('[v0] CIP: Alerta CRÍTICA < 10% disparada')
    }

    return alerts
  } catch (error) {
    console.error('[v0] CIP Error en verificación de umbrales:', error)
    throw error
  }
}

// ============================================
// 5. PROGRESIÓN AUTOMÁTICA DE FASES
// ============================================

export async function advancePhaseIfNeeded(userId: string) {
  console.log('[v0] CIP: Verificando progresión de fase para:', userId)

  try {
    const { data: profile, error: profileError } = await supabase
      .from('user_capacity_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) throw profileError

    const phaseStart = new Date(profile.phase_start_date)
    const daysSincePhaseStart = Math.floor((Date.now() - phaseStart.getTime()) / (1000 * 60 * 60 * 24))

    let newPhase = profile.progression_phase
    let shouldUpdate = false

    // Progresión automática: A1_Base → A1_30 → A1_60 → A1_90
    if (profile.progression_phase === 'A1_Base' && daysSincePhaseStart >= 30) {
      newPhase = 'A1_30dias'
      shouldUpdate = true
      console.log('[v0] CIP: Progresión a A1_30dias')
    } else if (profile.progression_phase === 'A1_30dias' && daysSincePhaseStart >= 60) {
      newPhase = 'A1_60dias'
      shouldUpdate = true
      console.log('[v0] CIP: Progresión a A1_60dias')
    } else if (profile.progression_phase === 'A1_60dias' && daysSincePhaseStart >= 90) {
      newPhase = 'A1_90dias'
      shouldUpdate = true
      console.log('[v0] CIP: Progresión a A1_90dias')
    }

    if (shouldUpdate) {
      const { data: updated, error: updateError } = await supabase
        .from('user_capacity_profile')
        .update({
          progression_phase: newPhase,
          phase_start_date: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single()

      if (updateError) throw updateError
      return updated
    }

    return profile
  } catch (error) {
    console.error('[v0] CIP Error en progresión de fase:', error)
    throw error
  }
}

// ============================================
// 6. REGISTRAR TAREA COMPLETADA
// ============================================

export async function logTaskSession(
  userId: string,
  task: {
    title: string
    description?: string
    category: string
    mode: string
    durationMinutes: number
    status: 'completed' | 'partial' | 'abandoned'
    qualityRating?: number
  }
) {
  console.log('[v0] CIP: Registrando tarea:', task.title)

  try {
    const { data: session, error: sessionError } = await supabase
      .from('task_sessions')
      .insert({
        user_id: userId,
        task_title: task.title,
        task_description: task.description || '',
        task_category: task.category,
        mode_applied: task.mode,
        duration_minutes: task.durationMinutes,
        status: task.status,
        quality_rating: task.qualityRating || 5,
        session_date: new Date().toISOString().split('T')[0],
        session_start_time: new Date().toISOString(),
        session_end_time: new Date(Date.now() + task.durationMinutes * 60000).toISOString(),
      })
      .select()
      .single()

    if (sessionError) throw sessionError

    console.log('[v0] CIP: Tarea registrada exitosamente')
    return session
  } catch (error) {
    console.error('[v0] CIP Error al registrar tarea:', error)
    throw error
  }
}

// ============================================
// 7. OBTENER ESTADO ACTUAL DEL USUARIO
// ============================================

export async function getUserCapacityStatus(userId: string) {
  console.log('[v0] CIP: Obteniendo estado de capacidad para:', userId)

  try {
    const { data: profile } = await supabase
      .from('user_capacity_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    const { data: dailyCapacity } = await supabase
      .from('daily_capacity')
      .select('*')
      .eq('user_id', userId)
      .eq('date', new Date().toISOString().split('T')[0])
      .single()

    const { data: alerts } = await supabase
      .from('capacity_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
      .limit(5)

    return {
      profile,
      today: dailyCapacity,
      activeAlerts: alerts || [],
    }
  } catch (error) {
    console.error('[v0] CIP Error al obtener estado:', error)
    throw error
  }
}
