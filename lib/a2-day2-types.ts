/**
 * Día 2: Your Hidden Operating System (Tu Sistema Operativo Profesional)
 * Types and data structures for work-style assessment
 */

import type { A1ProfileResult } from './disc-calculator'

export interface WorkStyleTrait {
  id: string
  label: string
  description: string
}

export interface InterviewRisk {
  id: string
  label: string
  description: string
}

export interface Day2Submission {
  dayNumber: number
  a1Profile: A1ProfileResult
  selectedTraits: string[] // 3 traits
  selectedRisk: string // 1 risk
  reflection: string // 50+ chars
  personalRule: string // 20+ chars
  completedAt: string
  xpEarned: number
}

export const WORK_STYLE_TRAITS: WorkStyleTrait[] = [
  { id: 'directo', label: 'Directo', description: 'Comunica de forma clara y al punto' },
  { id: 'analitico', label: 'Analítico', description: 'Piensa lógico y basado en datos' },
  { id: 'cuidadoso', label: 'Cuidadoso', description: 'Presta atención a los detalles' },
  { id: 'sociable', label: 'Sociable', description: 'Se conecta fácilmente con otros' },
  { id: 'constante', label: 'Constante', description: 'Mantiene consistencia en el tiempo' },
  { id: 'rapido', label: 'Rápido', description: 'Toma decisiones con velocidad' },
  { id: 'detallista', label: 'Detallista', description: 'Enfoque en precisión y exactitud' },
  { id: 'reservado', label: 'Reservado', description: 'Reflexivo antes de actuar' },
  { id: 'competitivo', label: 'Competitivo', description: 'Orientado a ganar y destacar' },
  { id: 'colaborativo', label: 'Colaborativo', description: 'Trabaja bien en equipo' },
]

export const INTERVIEW_RISKS: InterviewRisk[] = [
  { id: 'habla-rapido', label: 'Hablo demasiado rápido', description: 'Mi ritmo puede parecer ansioso' },
  { id: 'respuestas-cortas', label: 'Doy respuestas muy cortas', description: 'No muestro profundidad' },
  { id: 'vender-logros', label: 'Me cuesta vender mis logros', description: 'Sueno modesto pero inseguro' },
  { id: 'defensivo', label: 'Me pongo defensivo', description: 'Reacciono mal a críticas' },
  { id: 'improvisar', label: 'Me cuesta improvisar', description: 'Necesito preparación' },
  { id: 'seguridad', label: 'Necesito demasiada seguridad antes de responder', description: 'Paralización por perfeccionismo' },
  { id: 'sonar-natural', label: 'Me cuesta sonar natural', description: 'Parezco muy formal o robótico' },
  { id: 'silencio-incomodo', label: 'Lleno silencios con palabras innecesarias', description: 'Hablo por nervios' },
]

// DTC Validation
export function validateDay2Submission(submission: Partial<Day2Submission>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!submission.selectedTraits || submission.selectedTraits.length !== 3) {
    errors.push('Debes seleccionar exactamente 3 características de trabajo')
  }

  if (!submission.selectedRisk) {
    errors.push('Debes seleccionar 1 riesgo de entrevista')
  }

  if (!submission.reflection || submission.reflection.trim().length < 50) {
    errors.push('Tu reflexión debe tener al menos 50 caracteres y ser específica')
  }

  if (!submission.personalRule || submission.personalRule.trim().length < 20) {
    errors.push('Tu regla personal debe tener al menos 20 caracteres')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
