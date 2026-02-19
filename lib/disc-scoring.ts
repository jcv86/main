// DISC Scoring Calculation Utility
// Implements bidirectional scoring methodology: MÁS (+2) and MENOS (-1)

export interface DiscScores {
  D: number
  I: number
  S: number
  C: number
}

export interface DiscNormalizedScores extends DiscScores {
  dominantProfile: "D" | "I" | "S" | "C"
  secondaryProfile: "D" | "I" | "S" | "C"
  tertiarProfile: "D" | "I" | "S" | "C"
  total: number
}

/**
 * Calculate raw DISC scores from bidirectional responses
 * MÁS como yo: +2 points
 * MENOS como yo: -1 points
 */
export function calculateRawDiscScores(
  responses: Record<number, { mas?: "D" | "I" | "S" | "C"; menos?: "D" | "I" | "S" | "C" }>
): DiscScores {
  const scores: DiscScores = { D: 0, I: 0, S: 0, C: 0 }

  Object.values(responses).forEach((response) => {
    if (response?.mas) {
      scores[response.mas] += 2
    }
    if (response?.menos) {
      scores[response.menos] -= 1
    }
  })

  return scores
}

/**
 * Normalize raw scores to 0-100 scale with smooth distribution
 * Prevents extreme values and ensures balanced profiles
 */
export function normalizeDiscScores(rawScores: DiscScores): DiscNormalizedScores {
  // Normalize to 0-100 scale
  // Formula: ((rawScore + offset) / divisor) * 100
  // The offset centers the distribution, divisor controls spread
  
  const normalized = {
    D: Math.max(0, Math.min(100, ((rawScores.D + 56) / 1.12))),
    I: Math.max(0, Math.min(100, ((rawScores.I + 56) / 1.12))),
    S: Math.max(0, Math.min(100, ((rawScores.S + 56) / 1.12))),
    C: Math.max(0, Math.min(100, ((rawScores.C + 56) / 1.12))),
  }

  // Find dominant, secondary, and tertiary profiles
  const sorted = Object.entries(normalized)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key as "D" | "I" | "S" | "C")

  const total = (normalized.D + normalized.I + normalized.S + normalized.C) / 4

  return {
    ...normalized,
    dominantProfile: sorted[0],
    secondaryProfile: sorted[1],
    tertiarProfile: sorted[2],
    total,
  }
}

/**
 * All-in-one function: calculate raw scores, normalize, and return results
 */
export function calculateDiscProfile(
  responses: Record<number, { mas?: "D" | "I" | "S" | "C"; menos?: "D" | "I" | "S" | "C" }>
): DiscNormalizedScores {
  const rawScores = calculateRawDiscScores(responses)
  return normalizeDiscScores(rawScores)
}

/**
 * Get interpretation text based on score ranges
 */
export function getDiscInterpretation(score: number): {
  level: "low" | "moderate" | "high" | "very_high"
  description: string
} {
  if (score >= 80) {
    return { level: "very_high", description: "Muy fuerte en esta dimensión" }
  } else if (score >= 60) {
    return { level: "high", description: "Fuerte en esta dimensión" }
  } else if (score >= 40) {
    return { level: "moderate", description: "Moderado en esta dimensión" }
  } else {
    return { level: "low", description: "Necesita desarrollo en esta dimensión" }
  }
}

/**
 * Determine if profile is hybrid (two equally strong dimensions)
 */
export function isHybridProfile(scores: DiscNormalizedScores, threshold: number = 5): boolean {
  const primary = scores[scores.dominantProfile]
  const secondary = scores[scores.secondaryProfile]
  return Math.abs(primary - secondary) <= threshold
}

/**
 * Get profile summary text
 */
export function getProfileSummary(profile: "D" | "I" | "S" | "C"): string {
  const summaries: Record<"D" | "I" | "S" | "C", string> = {
    D: "Tu perfil es de liderazgo decisivo. Impulsa cambios y busca resultados rápidos.",
    I: "Tu perfil es de influencia inspiradora. Conecta personas y genera movimiento.",
    S: "Tu perfil es de estabilidad confiable. Construye bases sólidas y armonía.",
    C: "Tu perfil es de arquitectura estratégica. Diseña sistemas que funcionan.",
  }
  return summaries[profile]
}
