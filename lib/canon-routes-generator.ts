// CANON Routes Generator - Genera Rutas 30/60/90 con Trazabilidad Visible
// Convierte acciones del motor de reglas en una ruta ejecutable

import { CanonAction } from './canon-rules-engine'

export interface RouteStep {
  id: string
  week: number // Semana 1-12 del 90
  phase: 30 | 60 | 90
  action: CanonAction
  order: number // Orden dentro de la semana
  trazability: string // "Esta misión existe porque respondiste X"
}

export interface Route30Days {
  phase: 30
  totalWeeks: 4
  steps: RouteStep[]
  summary: string
  metrics: {
    totalActions: number
    averageMinutesPerWeek: number
    difficulty: string
  }
}

export interface Route60Days {
  phase: 60
  totalWeeks: 8
  steps: RouteStep[]
  summary: string
}

export interface Route90Days {
  phase: 90
  totalWeeks: 12
  steps: RouteStep[]
  summary: string
}

// ========== GENERADOR DE RUTAS ==========

export function generateRoute30Days(
  actions: CanonAction[],
  conozcamonos2Paso1Responses: Record<number, any>
): Route30Days {
  // Filtrar acciones de fase 30
  const phase30Actions = actions.filter(a => a.phase === 30)

  // Distribuir acciones en 4 semanas
  // Semana 1: Setup + momentum (acciones fáciles)
  // Semana 2-3: Profundización
  // Semana 4: Consolidación

  const steps: RouteStep[] = []
  const easyActions = phase30Actions.filter(a => a.difficulty === 'easy').sort(() => Math.random() - 0.5)
  const mediumActions = phase30Actions.filter(a => a.difficulty === 'medium').sort(() => Math.random() - 0.5)
  const hardActions = phase30Actions.filter(a => a.difficulty === 'hard').sort(() => Math.random() - 0.5)

  let stepOrder = 0

  // SEMANA 1: Setup (Easy + 1 Medium para momentum)
  steps.push(
    ...easyActions.slice(0, 2).map((action, idx) => ({
      id: `step-w1-${idx}`,
      week: 1,
      phase: 30 as const,
      action,
      order: stepOrder++,
      trazability: buildTrazability(action, conozcamonos2Paso1Responses)
    }))
  )

  if (mediumActions.length > 0) {
    steps.push({
      id: `step-w1-momentum`,
      week: 1,
      phase: 30 as const,
      action: mediumActions[0],
      order: stepOrder++,
      trazability: buildTrazability(mediumActions[0], conozcamonos2Paso1Responses)
    })
  }

  // SEMANA 2: Profundización (Medium)
  steps.push(
    ...mediumActions.slice(1, 3).map((action, idx) => ({
      id: `step-w2-${idx}`,
      week: 2,
      phase: 30 as const,
      action,
      order: stepOrder++,
      trazability: buildTrazability(action, conozcamonos2Paso1Responses)
    }))
  )

  // SEMANA 3: Desafío (Hard)
  steps.push(
    ...hardActions.slice(0, 2).map((action, idx) => ({
      id: `step-w3-${idx}`,
      week: 3,
      phase: 30 as const,
      action,
      order: stepOrder++,
      trazability: buildTrazability(action, conozcamonos2Paso1Responses)
    }))
  )

  // SEMANA 4: Consolidación (Reflection + Review)
  steps.push({
    id: `step-w4-consolidation`,
    week: 4,
    phase: 30 as const,
    action: {
      id: 'mission-30-day-reflection',
      type: 'reflection',
      title: 'Reflexión de 30 Días: ¿Qué Cambió?',
      description: 'Mira atrás: ¿qué completaste? ¿qué aprendiste? ¿dónde estás diferente?',
      duration: 45,
      frequency: 'weekly',
      phase: 30,
      tags: ['consolidación', 'reflexión', 'checkpoint'],
      trazability_source_response_ids: [],
      difficulty: 'medium',
      success_metric: 'Documento completado de auto-evaluación'
    },
    order: stepOrder++,
    trazability: 'Reflexión automática: checkpoint de 30 días'
  })

  // Calcular métricas
  const totalMinutes = steps.reduce((sum, step) => sum + step.action.duration, 0)
  const averageMinutesPerWeek = Math.round(totalMinutes / 4)

  return {
    phase: 30,
    totalWeeks: 4,
    steps,
    summary: `Tu ruta de 30 días: ${steps.length} acciones en 4 semanas. ${averageMinutesPerWeek}min/semana en promedio.`,
    metrics: {
      totalActions: steps.length,
      averageMinutesPerWeek,
      difficulty: calculateDifficulty(steps)
    }
  }
}

export function generateRoute60Days(
  actions: CanonAction[],
  conozcamonos2Paso2Responses: Record<number, any>
): Route60Days {
  // Rutas 60 días: opcional, pero si se genera, es profundización de 30
  const phase60Actions = actions.filter(a => a.phase === 60)

  const steps: RouteStep[] = []
  let stepOrder = 0

  // Semanas 5-8: Expandir lo de 30 días
  phase60Actions.slice(0, 4).forEach((action, idx) => {
    const week = 5 + Math.floor(idx / 2)
    steps.push({
      id: `step-w${week}-${idx}`,
      week,
      phase: 60 as const,
      action,
      order: stepOrder++,
      trazability: buildTrazability(action, conozcamonos2Paso2Responses)
    })
  })

  return {
    phase: 60,
    totalWeeks: 8,
    steps,
    summary: `Tu ruta de 60 días: ${steps.length} acciones adicionales en semanas 5-8.`
  }
}

export function generateRoute90Days(
  actions: CanonAction[],
  allResponses: Record<number, any>
): Route90Days {
  // Rutas 90 días: cierre y escalamiento
  const phase90Actions = actions.filter(a => a.phase === 90)

  const steps: RouteStep[] = []
  let stepOrder = 0

  // Semanas 9-12: Escalamiento
  phase90Actions.forEach((action, idx) => {
    const week = 9 + Math.floor(idx / 2)
    steps.push({
      id: `step-w${week}-${idx}`,
      week: Math.min(week, 12),
      phase: 90 as const,
      action,
      order: stepOrder++,
      trazability: buildTrazability(action, allResponses)
    })
  })

  return {
    phase: 90,
    totalWeeks: 12,
    steps,
    summary: `Tu ruta de 90 días: ${steps.length} acciones de escalamiento. Semanas 9-12 = consolidación + siguiente nivel.`
  }
}

// ========== UTILIDADES ==========

function buildTrazability(
  action: CanonAction,
  responses: Record<number, any>
): string {
  // Mapear IDs de respuesta a preguntas
  const responseMap: Record<number, string> = {
    1: 'tu área de enfoque',
    2: 'tus obstáculos',
    3: 'tu disponibilidad semanal',
    4: 'tu tiempo por sesión',
    5: 'tu estilo de apoyo',
    6: 'tu métrica de éxito',
    7: 'tu mayor miedo',
    8: 'tu situación de apoyo',
    9: 'tu acción si tuvieras energía ilimitada'
  }

  if (action.trazability_source_response_ids.length === 0) {
    return 'Acción generada automáticamente por el sistema'
  }

  const sources = action.trazability_source_response_ids
    .map(id => responseMap[id])
    .filter(Boolean)
    .join(' + ')

  return `Esta misión está aquí porque respondiste: "${sources}"`
}

function calculateDifficulty(steps: RouteStep[]): string {
  const difficulties = steps.map(s => s.action.difficulty)
  const hardCount = difficulties.filter(d => d === 'hard').length
  const easyCount = difficulties.filter(d => d === 'easy').length

  if (hardCount > easyCount) return 'Challenging'
  if (easyCount > hardCount) return 'Accessible'
  return 'Balanced'
}

// ========== GUARDAR RUTA EN DB ==========

export async function saveRoute(
  userId: string,
  route: Route30Days | Route60Days | Route90Days,
  supabase: any
) {
  const { error } = await supabase
    .from('canon_generated_routes')
    .insert({
      user_id: userId,
      phase: route.phase,
      steps: route.steps,
      summary: route.summary,
      generated_at: new Date().toISOString()
    })

  if (error) {
    console.error('[v0] Error saving route:', error)
    throw error
  }

  console.log(`[v0] Route Phase ${route.phase} saved successfully`)
}
