// A1 Scoring Normalization (Issue #8: map questions to 0-10 scale)
// This defines how each question response maps to 0-10 score

export interface ScoringNormalization {
  dimension: string
  question: string
  response_type: "text" | "range" | "frequency" | "hours"
  mapping: { [key: string]: number }
  description: string
}

export const A1_SCORING_NORMALIZATION: ScoringNormalization[] = [
  // ENERGÍA DIMENSION
  {
    dimension: "energia",
    question: "¿Cuántas horas duermes en promedio?",
    response_type: "hours",
    mapping: {
      "0-3": 0,
      "3-5": 2,
      "5-6": 4,
      "6-7": 7,
      "7-8": 9,
      "8+": 10,
    },
    description: "Sleep hours map to energy. 7-9h = optimal (9/10)",
  },
  {
    dimension: "energia",
    question: "¿Con qué frecuencia haces ejercicio?",
    response_type: "frequency",
    mapping: {
      "nunca": 0,
      "1 vez mes": 2,
      "2-3 veces mes": 4,
      "1 vez semana": 6,
      "2-3 veces semana": 8,
      "diario": 10,
    },
    description: "Exercise frequency. Daily = 10/10, never = 0/10",
  },
  {
    dimension: "energia",
    question: "¿Cómo es tu hidratación diaria?",
    response_type: "text",
    mapping: {
      "muy mala": 0,
      "mala": 2,
      "inconsistente": 4,
      "buena": 7,
      "excelente": 10,
    },
    description: "Daily hydration consistency",
  },
  {
    dimension: "energia",
    question: "¿Tienes un ritual matutino consistente?",
    response_type: "text",
    mapping: {
      "no": 0,
      "a veces": 3,
      "la mayoría de días": 6,
      "sí, casi siempre": 8,
      "sí, siempre": 10,
    },
    description: "Consistency of morning routine",
  },
  {
    dimension: "energia",
    question: "¿Cómo es tu energía general?",
    response_type: "range",
    mapping: {
      "1": 0,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4,
      "6": 5,
      "7": 6,
      "8": 7,
      "9": 8,
      "10": 10,
    },
    description: "Self-reported energy level (1-10 scale direct map)",
  },

  // ENFOQUE DIMENSION
  {
    dimension: "enfoque",
    question: "¿Cómo es tu capacidad de concentración?",
    response_type: "text",
    mapping: {
      "muy baja": 0,
      "baja": 2,
      "media": 5,
      "buena": 8,
      "excelente": 10,
    },
    description: "General concentration ability",
  },
  {
    dimension: "enfoque",
    question: "¿Cuántas tareas haces simultáneamente?",
    response_type: "range",
    mapping: {
      "1": 10,
      "2": 9,
      "3": 7,
      "4": 5,
      "5": 3,
      "6+": 0,
    },
    description: "Multitasking (fewer tasks = better focus)",
  },
  {
    dimension: "enfoque",
    question: "¿Cuánto tiempo pasas sin revisar teléfono?",
    response_type: "hours",
    mapping: {
      "constantemente": 0,
      "15-30 min": 2,
      "30 min-1 hr": 4,
      "1-2 hrs": 6,
      "2-4 hrs": 8,
      "4+ hrs": 10,
    },
    description: "Phone distraction resistance",
  },
  {
    dimension: "enfoque",
    question: "¿Tienes un plan diario claro?",
    response_type: "text",
    mapping: {
      "no": 0,
      "a veces": 3,
      "la mayoría de días": 6,
      "sí, casi siempre": 8,
      "sí, siempre": 10,
    },
    description: "Daily planning consistency",
  },
  {
    dimension: "enfoque",
    question: "¿Qué porcentaje de tu día es reactivo vs. proactivo?",
    response_type: "text",
    mapping: {
      "90% reactivo": 0,
      "70% reactivo": 2,
      "50/50": 5,
      "70% proactivo": 7,
      "90% proactivo": 10,
    },
    description: "Proactivity ratio (higher = more controlled)",
  },

  // RELACIONES DIMENSION
  {
    dimension: "relaciones",
    question: "¿Con qué frecuencia contactas gente cercana?",
    response_type: "frequency",
    mapping: {
      "nunca": 0,
      "1 vez mes": 2,
      "2-3 veces mes": 4,
      "1 vez semana": 6,
      "2-3 veces semana": 8,
      "diario": 10,
    },
    description: "Social connection frequency",
  },
  {
    dimension: "relaciones",
    question: "¿Cómo pides ayuda?",
    response_type: "text",
    mapping: {
      "nunca": 0,
      "raramente": 2,
      "a veces": 5,
      "frecuentemente": 7,
      "fácilmente": 10,
    },
    description: "Help-seeking behavior",
  },
  {
    dimension: "relaciones",
    question: "¿Recibes feedback regularmente?",
    response_type: "text",
    mapping: {
      "nunca": 0,
      "raramente": 2,
      "a veces": 5,
      "frecuentemente": 7,
      "constantemente": 10,
    },
    description: "Feedback reception regularity",
  },
  {
    dimension: "relaciones",
    question: "¿Tienes gente en tu círculo cercano?",
    response_type: "text",
    mapping: {
      "no": 0,
      "poco": 2,
      "medio": 5,
      "bastante": 8,
      "mucha": 10,
    },
    description: "Social circle size/quality",
  },
  {
    dimension: "relaciones",
    question: "¿Cómo expresas aprecio?",
    response_type: "text",
    mapping: {
      "nunca": 0,
      "raramente": 2,
      "a veces": 5,
      "frecuentemente": 7,
      "constantemente": 10,
    },
    description: "Expression of gratitude",
  },

  // PLAN EJECUTIVO DIMENSION
  {
    dimension: "plan_ejecutivo",
    question: "¿Tienes metas claras para los próximos 3 meses?",
    response_type: "text",
    mapping: {
      "no": 0,
      "vagas": 2,
      "algunas": 5,
      "claras": 8,
      "muy claras": 10,
    },
    description: "Goal clarity",
  },
  {
    dimension: "plan_ejecutivo",
    question: "¿Tienes ritual de revisión?",
    response_type: "frequency",
    mapping: {
      "no": 0,
      "anual": 1,
      "trimestral": 3,
      "mensual": 6,
      "semanal": 8,
      "diario": 10,
    },
    description: "Review ritual frequency",
  },
  {
    dimension: "plan_ejecutivo",
    question: "¿Cómo priorizas tareas?",
    response_type: "text",
    mapping: {
      "no las priorizo": 0,
      "por urgencia": 2,
      "mix urgencia-importancia": 5,
      "por importancia": 8,
      "sistema claro": 10,
    },
    description: "Prioritization method",
  },
  {
    dimension: "plan_ejecutivo",
    question: "¿Tienes un sistema para decisiones?",
    response_type: "text",
    mapping: {
      "no": 0,
      "a veces": 2,
      "gut feeling": 4,
      "framework informal": 6,
      "sistema claro": 10,
    },
    description: "Decision-making system",
  },
  {
    dimension: "plan_ejecutivo",
    question: "¿Cómo mides progreso?",
    response_type: "text",
    mapping: {
      "no lo mido": 0,
      "por sensación": 2,
      "a veces informalmente": 5,
      "métricas informales": 7,
      "métricas claras": 10,
    },
    description: "Progress tracking system",
  },
]

// Calculation function (Issue #8: explicit formula)
export function calculateDimensionScore(
  dimensionResponses: { [questionIdx: string]: string },
  dimension: string
): number {
  const questionCount = A1_SCORING_NORMALIZATION.filter(q => q.dimension === dimension).length
  if (questionCount === 0) return 0

  let totalScore = 0
  let count = 0

  A1_SCORING_NORMALIZATION.filter(q => q.dimension === dimension).forEach((question, idx) => {
    const response = dimensionResponses[`${dimension}_${idx}`]
    if (response && question.mapping[response] !== undefined) {
      totalScore += question.mapping[response]
      count++
    }
  })

  return count > 0 ? Math.round((totalScore / count) * 10) : 0
}

// Overall score calculation
export function calculateOverallScore(scores: { [key: string]: number }): number {
  const allScores = Object.values(scores)
  return allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : 0
}
