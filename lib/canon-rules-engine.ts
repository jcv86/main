// CANON Rules Engine - Nivel 3
// Motor que mapea Respuesta → Regla → Salida con Trazabilidad
// Este es el corazón inteligente que genera acciones personalizadas

export interface CanonRule {
  id: string
  priority: number // 1-10, mayor = más importante
  condition: (responses: Record<number, any>) => boolean
  output: (responses: Record<number, any>) => CanonAction
  trazability: string // Descripción de por qué se aplicó esta regla
}

export interface CanonAction {
  id: string
  type: 'mission' | 'habit' | 'learning' | 'reflection'
  title: string
  description: string
  duration: number // minutos
  frequency: 'daily' | 'weekly' | 'twice-weekly'
  phase: 30 | 60 | 90 // En qué fase del 90 (30, 60 o 90 días)
  tags: string[]
  trazability_source_response_ids: number[] // Qué preguntas generaron esto
  difficulty: 'easy' | 'medium' | 'hard'
  success_metric: string
}

// ========== REGLAS DEL MOTOR ==========

export const CANON_RULES: CanonRule[] = [
  // REGLA 1: Detectar productividad como foco
  {
    id: 'focus-productivity',
    priority: 9,
    condition: (responses) => {
      const focusArea = responses[1] // Pregunta 1 de C2-Paso1
      return focusArea?.includes('Productividad') || focusArea?.includes('efectividad')
    },
    output: (responses) => ({
      id: 'mission-productivity-audit',
      type: 'mission',
      title: 'Auditoría de Productividad Personal',
      description: 'Mapea tu semana actual: dónde gastan tu tiempo, qué te distrae, dónde pierdes horas. Esto es tu baseline.',
      duration: 60,
      frequency: 'weekly',
      phase: 30,
      tags: ['productividad', 'baseline', 'semana-1'],
      trazability_source_response_ids: [1], // Vino de pregunta 1
      difficulty: 'easy',
      success_metric: 'Documento completado con 7+ patrones identificados'
    }),
    trazability: 'Usuario seleccionó "Productividad y efectividad" como foco principal'
  },

  // REGLA 2: Detectar obstáculos emocionales (miedo, confianza)
  {
    id: 'detect-fear-obstacle',
    priority: 8,
    condition: (responses) => {
      const obstacles = responses[2]?.toLowerCase() || ''
      const fear = responses[7]?.toLowerCase() || ''
      return obstacles.includes('miedo') || obstacles.includes('miedo') || fear.includes('fracaso') || fear.includes('rechazo')
    },
    output: (responses) => ({
      id: 'mission-fear-mapping',
      type: 'reflection',
      title: 'Mapeando tu Relación con el Miedo',
      description: 'Reflexión guiada: ¿De dónde vienen tus miedos? ¿Son reales o imaginarios? ¿Qué pasaría si intentas?',
      duration: 30,
      frequency: 'weekly',
      phase: 30,
      tags: ['mentalidad', 'miedo', 'confianza'],
      trazability_source_response_ids: [2, 7],
      difficulty: 'hard',
      success_metric: 'Reflexión escrita (min 200 palabras) identificando raíz del miedo'
    }),
    trazability: 'Obstáculos incluyen "miedo" y/o mayor miedo identificado en pregunta 7'
  },

  // REGLA 3: Tiempo limitado = acciones micro
  {
    id: 'limited-time-micro-actions',
    priority: 7,
    condition: (responses) => {
      const daysPerWeek = responses[3] // Pregunta 3
      const timePerSession = responses[4] // Pregunta 4
      return daysPerWeek === '1 día' || timePerSession === '15-30 minutos'
    },
    output: (responses) => ({
      id: 'mission-micro-actions-30',
      type: 'habit',
      title: '5 Mini-Acciones Diarias (15 min máximo)',
      description: 'Si tu tiempo es limitado, no luchas contra ello: abraza microacciones. 5 cosas pequeñas, máximo 3 minutos cada una.',
      duration: 15,
      frequency: 'daily',
      phase: 30,
      tags: ['tiempo-limitado', 'eficiencia', 'hábitos'],
      trazability_source_response_ids: [3, 4],
      difficulty: 'easy',
      success_metric: 'Completar 5 microacciones (verificar en app)'
    }),
    trazability: 'Usuario disponible solo 1 día/semana O sesiones de 15-30 minutos'
  },

  // REGLA 4: Falta de apoyo = mentor virtual
  {
    id: 'no-support-mentor-virtual',
    priority: 8,
    condition: (responses) => {
      const support = responses[8] // Pregunta 8
      return support === 'No tengo apoyo actualmente'
    },
    output: (responses) => ({
      id: 'mission-mentor-virtual-setup',
      type: 'learning',
      title: 'Construye tu Mentor Virtual',
      description: 'Sin apoyo humano? Crea tu "junta asesora": selecciona 3-5 personas (vivas, muertas, libros) cuya sabiduría seguirás.',
      duration: 45,
      frequency: 'weekly',
      phase: 30,
      tags: ['apoyo', 'mentoría', 'comunidad'],
      trazability_source_response_ids: [8],
      difficulty: 'medium',
      success_metric: 'Lista de 3-5 mentores con 1 lección concreta de cada uno'
    }),
    trazability: 'Usuario indicó no tener apoyo actual (respuesta 8)'
  },

  // REGLA 5: Ambición alta (visión clara en 90) = plan agresivo
  {
    id: 'high-ambition-aggressive-plan',
    priority: 9,
    condition: (responses) => {
      const objective = responses[4]?.toLowerCase() || ''
      const vision90 = responses[11]?.toLowerCase() || ''
      const ambitious = objective.includes('cambio') || objective.includes('promoci') || vision90.includes('líder') || vision90.includes('nuevo')
      return ambitious
    },
    output: (responses) => ({
      id: 'mission-90-day-milestone-sprint',
      type: 'mission',
      title: 'Hito 90: Tu Transformación en Acelerador',
      description: 'Tu visión es ambiciosa. Desglosaremos en sprints de 30 días: cada 30 días, visible checkpoint.',
      duration: 120,
      frequency: 'twice-weekly',
      phase: 30,
      tags: ['ambición', 'sprints', 'hitos'],
      trazability_source_response_ids: [4, 11],
      difficulty: 'hard',
      success_metric: '3 hitos mensales definidos y 1 completado en mes 1'
    }),
    trazability: 'Objetivo incluye "cambio" o visión a 90 días es ambiciosa'
  },

  // REGLA 6: Primera acción hoy = momentum real
  {
    id: 'first-action-today-momentum',
    priority: 10, // MÁXIMA PRIORIDAD: "acción ahora"
    condition: (responses) => {
      return Object.keys(responses).length > 0 // Siempre se aplica
    },
    output: (responses) => ({
      id: 'mission-action-today',
      type: 'mission',
      title: 'Tu Primera Acción: HOY',
      description: responses[9] || 'Identifica 1 cosa que harás HOY. No mañana. No la próxima semana. Hoy en las próximas 2 horas.',
      duration: 5, // Micro-acción
      frequency: 'daily',
      phase: 30,
      tags: ['momentum', 'acción-inmediata', 'primer-paso'],
      trazability_source_response_ids: [9],
      difficulty: 'easy',
      success_metric: 'Acción completada y reportada'
    }),
    trazability: 'Generada automáticamente: "acción hoy si tuvieras energía ilimitada"'
  }
]

// ========== MOTOR EJECUTOR ==========

export function executeCanonRules(
  conozcamonos1Responses: Record<number, any>,
  conozcamonos2Paso1Responses: Record<number, any>,
  conozcamonos2Paso2Responses: Record<number, any>,
  a1ProfileType: string // D, I, S, C
): CanonAction[] {
  // Merge all responses
  const allResponses = {
    ...conozcamonos1Responses,
    ...conozcamonos2Paso1Responses,
    ...conozcamonos2Paso2Responses,
    profile_type: a1ProfileType
  }

  // Execute rules in priority order
  const appliedRules = CANON_RULES.sort((a, b) => b.priority - a.priority)
    .filter(rule => rule.condition(allResponses))
    .map(rule => ({
      action: rule.output(allResponses),
      trazability: rule.trazability
    }))

  console.log('[v0] Applied rules:', appliedRules.length, 'actions generated')

  return appliedRules.map(r => r.action)
}

// ========== STRESS TEST (Nivel 4) ==========

export function validateCanonActions(actions: CanonAction[]): {
  valid: boolean
  issues: string[]
  suggestions: string[]
} {
  const issues: string[] = []
  const suggestions: string[] = []

  // Validación 1: No más de 7 acciones en fase 30
  const phase30Actions = actions.filter(a => a.phase === 30)
  if (phase30Actions.length > 7) {
    issues.push(`Demasiadas acciones en fase 30: ${phase30Actions.length} (máx 7)`)
    suggestions.push('Combinando acciones similares para evitar saturación')
  }

  // Validación 2: Balance entre tipos
  const typeCount = {
    mission: actions.filter(a => a.type === 'mission').length,
    habit: actions.filter(a => a.type === 'habit').length,
    learning: actions.filter(a => a.type === 'learning').length,
    reflection: actions.filter(a => a.type === 'reflection').length
  }

  if (typeCount.mission === 0) {
    suggestions.push('Agregando una misión transformadora para momentum')
  }

  // Validación 3: Tiempo total no debe exceder disponibilidad
  const totalWeeklyMinutes = actions.reduce((sum, action) => {
    const frequency = action.frequency === 'daily' ? 7 : action.frequency === 'twice-weekly' ? 2 : 1
    return sum + (action.duration * frequency)
  }, 0)

  if (totalWeeklyMinutes > 420) { // 7 horas/semana
    issues.push(`Carga excesiva: ${Math.round(totalWeeklyMinutes / 60)}h/semana (máx 7h)`)
    suggestions.push('Reduciendo frecuencia de algunas acciones')
  }

  return {
    valid: issues.length === 0,
    issues,
    suggestions
  }
}
