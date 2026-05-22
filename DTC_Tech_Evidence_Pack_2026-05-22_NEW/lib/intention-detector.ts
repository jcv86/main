import promptsBank from "./prompts-bank.json"

export type UserIntention =
  | "career_exploration"
  | "skill_development"
  | "job_search"
  | "self_assessment"
  | "motivation_support"
  | "networking"
  | "general_question"

export interface IntentionResult {
  intention: UserIntention
  confidence: number
  matchedKeywords: string[]
  suggestedPromptId?: string
}

export interface EngagementMetric {
  userId: string
  sessionId: string
  timestamp: Date
  eventType: string
  intention?: UserIntention
  coachPersonality: "sofia" | "dani"
  metadata?: Record<string, any>
}

/**
 * Detecta la intención del usuario basándose en su mensaje
 */
export function detectIntention(message: string): IntentionResult {
  const messageLower = message.toLowerCase()
  const results: Array<{
    intention: UserIntention
    confidence: number
    keywords: string[]
  }> = []

  // Analizar cada regla de detección de intención
  for (const rule of promptsBank.intention_detection.rules) {
    const matchedKeywords: string[] = []
    let matchCount = 0

    // Buscar patrones en el mensaje
    for (const pattern of rule.patterns) {
      if (messageLower.includes(pattern.toLowerCase())) {
        matchedKeywords.push(pattern)
        matchCount++
      }
    }

    // Calcular confianza basada en coincidencias
    if (matchCount > 0) {
      const confidence = Math.min((matchCount / rule.patterns.length) * 1.5, 1.0)

      if (confidence >= rule.confidence_threshold) {
        results.push({
          intention: rule.intention as UserIntention,
          confidence,
          keywords: matchedKeywords,
        })
      }
    }
  }

  // Si no hay coincidencias, retornar intención general
  if (results.length === 0) {
    return {
      intention: "general_question",
      confidence: 0.5,
      matchedKeywords: [],
    }
  }

  // Ordenar por confianza y retornar la más alta
  results.sort((a, b) => b.confidence - a.confidence)
  const topResult = results[0]

  // Buscar prompt sugerido basado en la intención
  const category = promptsBank.categories[topResult.intention]
  const suggestedPrompt = category?.prompts?.[0]?.id

  return {
    intention: topResult.intention,
    confidence: topResult.confidence,
    matchedKeywords: topResult.keywords,
    suggestedPromptId: suggestedPrompt,
  }
}

/**
 * Obtiene el prompt estructurado para una intención específica
 */
export function getPromptForIntention(intention: UserIntention, promptId?: string) {
  const category = promptsBank.categories[intention]
  if (!category) return null

  if (promptId) {
    return category.prompts.find((p) => p.id === promptId)
  }

  // Retornar el primer prompt de la categoría
  return category.prompts[0]
}

/**
 * Obtiene información de la categoría de intención
 */
export function getCategoryInfo(intention: UserIntention) {
  return promptsBank.categories[intention]
}

/**
 * Registra una métrica de engagement
 */
export async function trackEngagement(metric: EngagementMetric) {
  // TODO: Implementar almacenamiento en base de datos
  console.log("[v0] Engagement metric:", {
    event: metric.eventType,
    intention: metric.intention,
    coach: metric.coachPersonality,
    timestamp: metric.timestamp,
  })

  // Por ahora solo logueamos, después implementaremos guardado en Supabase
  return metric
}

/**
 * Calcula score de satisfacción basado en indicadores
 */
export function calculateSatisfactionScore(
  indicators: Array<keyof typeof promptsBank.engagement_metrics.satisfaction_indicators>,
): number {
  const weights = {
    positive_feedback: 0.3,
    follow_up_question: 0.2,
    action_taken: 0.25,
    resource_used: 0.15,
    session_length_appropriate: 0.1,
  }

  let score = 0
  for (const indicator of indicators) {
    score += weights[indicator] || 0
  }

  return Math.min(score, 1.0)
}
