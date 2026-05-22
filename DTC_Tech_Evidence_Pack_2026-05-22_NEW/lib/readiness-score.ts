// A4 Progress Calculator - Calcula score de candidato y progreso

export interface ReadinessScore {
  overall_score: number // 0-100
  a1_completeness: number
  a2_completeness: number
  a3_completeness: number
  a4_completeness: number
  strengths: string[]
  gaps: string[]
  recommendations: string[]
}

export function calculateReadinessScore(
  a1_completed: boolean,
  a1_profile: any,
  a2_completed: boolean,
  a2_routes: any,
  a3_progress: any,
  a4_active: boolean
): ReadinessScore {
  let score = 0

  // A1: Foundation (25 points max)
  let a1_score = 0
  if (a1_completed) {
    a1_score += 15 // Conozcamonos 1 + DISC
    if (a1_profile?.disc_profile?.primaryScore > 70) a1_score += 10
  }

  // A2: Route (25 points max)
  let a2_score = 0
  if (a2_completed) {
    a2_score += 15 // Routes generated
    if (a2_routes?.weeks_in_progress > 0) a2_score += 10
  }

  // A3: Impulse (30 points max)
  let a3_score = 0
  if (a3_progress?.interview_0) a3_score += 8
  if (a3_progress?.cv_prepared) a3_score += 8
  if (a3_progress?.market_insights) a3_score += 8
  if ((a3_progress?.simulations_done || 0) >= 2) a3_score += 6

  // A4: Radar (20 points max)
  let a4_score = 0
  if (a4_active) a4_score += 20

  const overall = Math.min(100, a1_score + a2_score + a3_score + a4_score)

  const strengths = []
  const gaps = []
  const recommendations = []

  if (a1_score > 20) strengths.push('Perfil DISC claro')
  else gaps.push('Completa tu análisis DISC')

  if (a2_score > 20) strengths.push('Ruta personalizada definida')
  else gaps.push('Define tus 30/60/90 días')

  if (a3_progress?.interview_0) strengths.push('Interview 0 preparado')
  else gaps.push('Practica Interview 0')

  if (a3_progress?.cv_prepared) strengths.push('CV optimizado')
  else gaps.push('Optimiza tu CV para ATS')

  if (a4_active) strengths.push('Sistema Radar activo')

  if (overall >= 80) recommendations.push('¡Listo para aplicar activamente!')
  if (overall >= 60 && overall < 80) recommendations.push('Casi listo - completa los gaps')
  if (overall < 60) recommendations.push('Continúa el programa - falta preparación')

  return {
    overall_score: overall,
    a1_completeness: Math.min(100, (a1_score / 25) * 100),
    a2_completeness: Math.min(100, (a2_score / 25) * 100),
    a3_completeness: Math.min(100, (a3_score / 30) * 100),
    a4_completeness: Math.min(100, (a4_score / 20) * 100),
    strengths,
    gaps,
    recommendations
  }
}
