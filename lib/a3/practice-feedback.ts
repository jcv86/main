import { z } from 'zod'

export const PRACTICE_CRITERIA = {
  clarity: { label: 'Claridad', action: 'Revisa la idea principal de este fragmento. Expresa una idea por frase y elimina lo que no ayude a responder.', retry: 'Responde de nuevo con una idea principal clara y los mismos hechos.' },
  evidence: { label: 'Evidencia propia', action: 'Comprueba qué hiciste tú, en qué contexto y qué resultado observaste. Si un dato falta, déjalo pendiente; no inventes cifras ni experiencias.', retry: 'Responde otra vez con un ejemplo real. Distingue tu acción del resultado que puedas confirmar.' },
  relevance: { label: 'Relación con la pregunta', action: 'Vincula el ejemplo con lo que pregunta la otra persona. No añadas habilidades ni requisitos que no puedas respaldar.', retry: 'Responde directamente la pregunta y explica por qué tu ejemplo es pertinente.' },
  structure: { label: 'Orden de la respuesta', action: 'Revisa si se entiende el contexto, tu acción y lo que ocurrió. Ordena los mismos hechos sin rellenar los huecos con una historia inventada.', retry: 'Haz un segundo intento con contexto, acción propia y resultado conocido; señala lo que aún no sabes.' },
} as const

const candidateSchema = z.object({
  criterion: z.enum(['clarity', 'evidence', 'relevance', 'structure']),
  quote: z.string().trim().min(1).max(600),
}).strict()

export interface EvidenceFeedback {
  criterion: keyof typeof PRACTICE_CRITERIA
  label: string
  quote: string
  action: string
  secondAttemptPrompt: string
  source: 'user_answer'
  assessmentKind: 'practice_guidance'
}

export const PRACTICE_FEEDBACK_SCHEMA = {
  name: 'practice_feedback',
  strict: true,
  schema: {
    type: 'object',
    properties: { criterion: { type: 'string', enum: Object.keys(PRACTICE_CRITERIA) }, quote: { type: 'string' } },
    required: ['criterion', 'quote'],
    additionalProperties: false,
  },
}

/** The model may select a review criterion, but cannot supply candidate facts or a rewrite. */
export function groundPracticeFeedback(candidate: unknown, answer: string): EvidenceFeedback | null {
  const parsed = candidateSchema.safeParse(candidate)
  if (!parsed.success || !answer.includes(parsed.data.quote)) return null
  const criterion = PRACTICE_CRITERIA[parsed.data.criterion]
  return {
    criterion: parsed.data.criterion,
    label: criterion.label,
    quote: parsed.data.quote,
    action: criterion.action,
    secondAttemptPrompt: criterion.retry,
    source: 'user_answer',
    assessmentKind: 'practice_guidance',
  }
}

export interface PracticeReview {
  question: string
  firstAttempt: string
  secondAttempt: string
  feedback: EvidenceFeedback
  recordedAt: string
}
