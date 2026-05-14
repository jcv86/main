import { A1ProfileResult } from './disc-calculator'

/**
 * Día 2: Your Hidden Operating System
 * Work-Style Insight types and validation
 */

export interface WorkStyleTrait {
  id: string
  label: string
  category: 'strength' | 'neutral' | 'challenge'
}

export const AVAILABLE_TRAITS: WorkStyleTrait[] = [
  { id: 'directo', label: 'Directo', category: 'neutral' },
  { id: 'analitico', label: 'Analítico', category: 'neutral' },
  { id: 'cuidadoso', label: 'Cuidadoso', category: 'neutral' },
  { id: 'sociable', label: 'Sociable', category: 'neutral' },
  { id: 'constante', label: 'Constante', category: 'neutral' },
  { id: 'rapido', label: 'Rápido', category: 'neutral' },
  { id: 'detallista', label: 'Detallista', category: 'neutral' },
  { id: 'reservado', label: 'Reservado', category: 'neutral' },
  { id: 'competitivo', label: 'Competitivo', category: 'neutral' },
  { id: 'colaborativo', label: 'Colaborativo', category: 'neutral' },
  { id: 'reflexivo', label: 'Reflexivo', category: 'neutral' },
  { id: 'impulsivo', label: 'Impulsivo', category: 'neutral' },
]

export interface InterviewRisk {
  id: string
  label: string
  description: string
}

export const AVAILABLE_RISKS: InterviewRisk[] = [
  { id: 'hablo-rapido', label: 'Hablo demasiado rápido', description: 'Puedo sonar acelerado o poco reflexivo' },
  { id: 'respuestas-cortas', label: 'Doy respuestas muy cortas', description: 'No demuestro suficiencia de pensamiento' },
  { id: 'cuesta-vender', label: 'Me cuesta vender mis logros', description: 'Puedo parecer inseguro o modesto' },
  { id: 'defensivo', label: 'Me pongo defensivo', description: 'Puedo sonar reactivo o cerrado a feedback' },
  { id: 'cuesta-improvisar', label: 'Me cuesta improvisar', description: 'Puedo sonar poco flexible' },
  { id: 'necesito-seguridad', label: 'Necesito demasiada seguridad antes de responder', description: 'Puedo parecer indeciso' },
  { id: 'poco-natural', label: 'Me cuesta sonar natural', description: 'Puedo sonar ensayado o artificial' },
  { id: 'hablo-poco', label: 'Hablo demasiado poco', description: 'Puedo parecer desinteresado' },
]

export interface Day2Submission {
  selectedTraits: string[] // 3 trait IDs
  selectedRisk: string // 1 risk ID
  reflection: string // Personal insight
  personalRule: string // Mi regla: ...
}

export interface WorkStyleInsightCard {
  userId: string
  a1Profile: A1ProfileResult
  traits: string[]
  risk: string
  reflection: string
  personalRule: string
  completedAt: Date
}

/**
 * Day 2 DTC Validation Rules
 */
export interface Day2ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateDay2Submission(submission: Day2Submission): Day2ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Validate 3 traits selected
  if (!submission.selectedTraits || submission.selectedTraits.length !== 3) {
    errors.push('Debes seleccionar exactamente 3 rasgos')
  }

  // Validate 1 risk selected
  if (!submission.selectedRisk) {
    errors.push('Debes seleccionar 1 riesgo de entrevista')
  }

  // Validate reflection is specific (>50 chars)
  if (!submission.reflection || submission.reflection.trim().length < 50) {
    errors.push('Tu reflexión debe tener al menos 50 caracteres para ser específica')
  }

  // Check for generic phrases
  const genericPhrases = [
    'no se',
    'no estoy seguro',
    'algo así',
    'más o menos',
    'tipo',
    'talvez',
  ]
  const reflectionLower = submission.reflection.toLowerCase()
  if (genericPhrases.some((phrase) => reflectionLower.includes(phrase))) {
    warnings.push('Tu reflexión podría ser más específica. Evita frases genéricas.')
  }

  // Validate personal rule format
  if (!submission.personalRule || submission.personalRule.length < 20) {
    errors.push('Tu regla personal debe ser clara y accionable (mínimo 20 caracteres)')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Work-Style profile mapping from A1
 */
export function mapA1ToWorkStyleProfile(a1Profile: A1ProfileResult) {
  const profileMap: Record<string, { description: string; strengths: string[] }> = {
    dominancia: {
      description: 'Eres directo, orientado a resultados, tomas decisiones rápidas',
      strengths: ['directo', 'rápido', 'competitivo', 'decisivo'],
    },
    influencia: {
      description: 'Eres carismático, comunicador, te energizas con interacción social',
      strengths: ['sociable', 'comunicativo', 'entusiasta', 'colaborativo'],
    },
    estabilidad: {
      description: 'Eres empático, colaborativo, valoras las relaciones y estabilidad',
      strengths: ['colaborativo', 'constante', 'confiable', 'empático'],
    },
    conciencia: {
      description: 'Eres analítico, detallista, buscas exactitud y excelencia',
      strengths: ['analítico', 'cuidadoso', 'detallista', 'reflexivo'],
    },
  }

  return profileMap[a1Profile.perfil_dominante] || profileMap.influencia
}
