// A2 Route Recommendation Engine
// Recommends learning path based on A1 DISC profile

import { DISCProfile } from '@/lib/a1/types'

export interface RouteRecommendation {
  recommendedRoute: 'persona' | 'profesional' | 'hibrido'
  confidence: number // 0-100
  reasoning: string
  altRoutes: Array<{
    route: 'persona' | 'profesional' | 'hibrido'
    score: number
    reason: string
  }>
  focusAreas: string[]
}

/**
 * Recommend learning path based on DISC profile
 * D (Dominance) -> Professional
 * I (Influence) -> Hybrid
 * S (Steadiness) -> Personal
 * C (Conscientiousness) -> Professional
 */
export function recommendRouteByDISC(discProfile: DISCProfile): RouteRecommendation {
  const { D: dominance, I: influence, S: steadiness, C: conscientiousness } = discProfile

  // Normalize scores to 0-1
  const totalScore = dominance + influence + steadiness + conscientiousness
  const d = dominance / totalScore
  const i = influence / totalScore
  const s = steadiness / totalScore
  const c = conscientiousness / totalScore

  // Calculate route scores
  const professionalScore = d * 40 + c * 40 + i * 10 + s * 10
  const personaScore = s * 40 + i * 30 + c * 20 + d * 10
  const hibridoScore = 50 // Balanced approach

  // Find primary recommendation
  let recommendedRoute: 'persona' | 'profesional' | 'hibrido'
  let confidence: number
  let reasoning: string

  if (professionalScore > personaScore + 10 && d + c > 0.6) {
    recommendedRoute = 'profesional'
    confidence = Math.min(90, professionalScore)
    reasoning = `Tu perfil ${getDISCLabel(d, i, s, c)} muestra fuerte orientación hacia liderazgo y ejecución. El camino profesional maximiza tu potencial de carrera.`
  } else if (personaScore > professionalScore + 10 && s + i > 0.6) {
    recommendedRoute = 'persona'
    confidence = Math.min(90, personaScore)
    reasoning = `Tu perfil ${getDISCLabel(d, i, s, c)} se enfoca en relaciones y estabilidad. El camino personal te ayudará a construir una base sólida.`
  } else {
    recommendedRoute = 'hibrido'
    confidence = 75
    reasoning = `Tu perfil ${getDISCLabel(d, i, s, c)} es equilibrado. El camino híbrido integra crecimiento personal y profesional.`
  }

  // Alternative routes
  const altRoutes = [
    { route: 'profesional' as const, score: professionalScore, reason: 'Enfoque en carrera y liderazgo' },
    { route: 'persona' as const, score: personaScore, reason: 'Enfoque en relaciones y bienestar' },
    { route: 'hibrido' as const, score: hibridoScore, reason: 'Enfoque integrado' }
  ]
    .filter(r => r.route !== recommendedRoute)
    .sort((a, b) => b.score - a.score)

  // Focus areas based on DISC
  const focusAreas = generateFocusAreas(d, i, s, c)

  return {
    recommendedRoute,
    confidence: Math.round(confidence),
    reasoning,
    altRoutes: altRoutes.map(r => ({
      ...r,
      score: Math.round(r.score)
    })),
    focusAreas
  }
}

/**
 * Get human-readable DISC label
 */
function getDISCLabel(d: number, i: number, s: number, c: number): string {
  const labels: string[] = []
  if (d > 0.25) labels.push('Dominante')
  if (i > 0.25) labels.push('Influyente')
  if (s > 0.25) labels.push('Estable')
  if (c > 0.25) labels.push('Concienzudo')
  return labels.length > 0 ? labels.join('-') : 'Balanceado'
}

/**
 * Generate personalized focus areas
 */
function generateFocusAreas(d: number, i: number, s: number, c: number): string[] {
  const areas: string[] = []

  if (d > 0.3) {
    areas.push('Liderazgo y toma de decisiones')
    areas.push('Delegación efectiva')
  }
  if (i > 0.3) {
    areas.push('Comunicación persuasiva')
    areas.push('Networking y relaciones')
  }
  if (s > 0.3) {
    areas.push('Estabilidad emocional')
    areas.push('Trabajo en equipo')
  }
  if (c > 0.3) {
    areas.push('Análisis y detalle')
    areas.push('Gestión de procesos')
  }

  if (areas.length === 0) {
    areas.push('Desarrollo general de competencias')
  }

  return areas.slice(0, 3)
}

/**
 * Score a route for a given DISC profile (0-100)
 */
export function scoreRouteForDISC(
  route: 'persona' | 'profesional' | 'hibrido',
  discProfile: DISCProfile
): number {
  const { D: dominance, I: influence, S: steadiness, C: conscientiousness } = discProfile
  const totalScore = dominance + influence + steadiness + conscientiousness
  const d = dominance / totalScore
  const i = influence / totalScore
  const s = steadiness / totalScore
  const c = conscientiousness / totalScore

  switch (route) {
    case 'profesional':
      return Math.round(d * 40 + c * 40 + i * 10 + s * 10)
    case 'persona':
      return Math.round(s * 40 + i * 30 + c * 20 + d * 10)
    case 'hibrido':
      return 50
    default:
      return 0
  }
}
