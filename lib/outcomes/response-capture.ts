import { A1_CLARITY_PROMPTS } from './a1-professional-clarity'
import { A2_EXECUTION_PROMPTS } from './a2-execution-capability'
import { A3_INTERVIEW_PROMPTS } from './a3-interview-capability'

/** Capture is not an evaluated outcome. Never compare this version with v1 scores. */
export const OUTCOME_CAPTURE_VERSION = '2-capture' as const
export const MAX_RESPONSE_CHARACTERS = 900
export const MAX_CAPTURE_BODY_BYTES = 32768
export type MeasurementRole = 'baseline' | 'follow_up'

export const CAPTURE_INSTRUMENTS = {
  a1_professional_clarity: {
    outcomeKey: 'professional_clarity', stage: 'a1', label: 'Claridad profesional',
    minimumWords: 5, prompts: A1_CLARITY_PROMPTS,
    baselineAction: 'Revisa tu informe de A1 y contrasta sus interpretaciones con ejemplos reales. Después registra tus respuestas de seguimiento.',
    followUpAction: 'Contrasta tu dirección profesional y los ejemplos que la respaldan. Identifica qué cambió y qué todavía necesitas comprobar.',
  },
  a2_execution_checkpoint: {
    outcomeKey: 'execution_capability', stage: 'a2', label: 'Plan de ejecución',
    minimumWords: 6, prompts: A2_EXECUTION_PROMPTS,
    baselineAction: 'Realiza las acciones de tu plan y conserva una evidencia del resultado. No confundas una actividad terminada con un objetivo logrado.',
    followUpAction: 'Revisa qué acciones realizaste y qué evidencia produjo tu plan. Decide qué mantener o ajustar, incluyendo lo que no resultó.',
  },
  a3_structured_interview: {
    outcomeKey: 'interview_capability', stage: 'a3', label: 'Preparación de entrevista',
    minimumWords: 8, prompts: A3_INTERVIEW_PROMPTS,
    baselineAction: 'Practica una respuesta con un ejemplo de tu experiencia: situación, acción propia y resultado. Después registra un seguimiento.',
    followUpAction: 'Contrasta la claridad, pertinencia y respaldo de tus respuestas. Practica un aspecto concreto que todavía necesite trabajo.',
  },
} as const

export type CaptureInstrumentKey = keyof typeof CAPTURE_INSTRUMENTS
export type CaptureInstrument = typeof CAPTURE_INSTRUMENTS[CaptureInstrumentKey]
export interface OutcomeCapture {
  observationId: string
  instrumentKey: CaptureInstrumentKey
  instrumentVersion: typeof OUTCOME_CAPTURE_VERSION
  outcomeKey: CaptureInstrument['outcomeKey']
  measurementRole: MeasurementRole
  responsePayload: Record<string, string>
}

export class CaptureValidationError extends Error {
  constructor(message: string, readonly status = 400) { super(message) }
}
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
export function responseWordCount(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length
}
export function captureNextAction(instrument: CaptureInstrument, role: MeasurementRole): string {
  return role === 'baseline' ? instrument.baselineAction : instrument.followUpAction
}

/** Length is an input bound only, not a capability rubric or confidence estimate. */
export function parseOutcomeCapture(value: unknown): OutcomeCapture {
  if (!isRecord(value)) throw new CaptureValidationError('Revisa las respuestas del ejercicio.')
  if (value.instrumentVersion === '1') {
    throw new CaptureValidationError('Actualiza la página para usar el registro de evidencia sin puntajes automáticos.', 409)
  }
  const allowed = ['observationId', 'instrumentKey', 'instrumentVersion', 'outcomeKey', 'measurementRole', 'responsePayload']
  if (Object.keys(value).some(key => !allowed.includes(key))
      || typeof value.instrumentKey !== 'string'
      || !Object.hasOwn(CAPTURE_INSTRUMENTS, value.instrumentKey)
      || value.instrumentVersion !== OUTCOME_CAPTURE_VERSION
      || !['baseline', 'follow_up'].includes(String(value.measurementRole))
      || typeof value.observationId !== 'string'
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.observationId)) {
    throw new CaptureValidationError('Revisa los datos del registro de evidencia.')
  }
  const instrumentKey = value.instrumentKey as CaptureInstrumentKey
  const instrument = CAPTURE_INSTRUMENTS[instrumentKey]
  if (value.outcomeKey !== instrument.outcomeKey || !isRecord(value.responsePayload)) {
    throw new CaptureValidationError('Las respuestas no corresponden a este ejercicio.')
  }
  const input = value.responsePayload
  const keys = instrument.prompts.map(prompt => prompt.key)
  if (Object.keys(input).length !== keys.length || Object.keys(input).some(key => !keys.includes(key as never))) {
    throw new CaptureValidationError('Completa las preguntas de este ejercicio, sin campos adicionales.')
  }
  const responsePayload: Record<string, string> = {}
  for (const { key, label } of instrument.prompts) {
    const text = input[key]
    if (typeof text !== 'string' || text.length > MAX_RESPONSE_CHARACTERS
        || responseWordCount(text) < instrument.minimumWords) {
      throw new CaptureValidationError(`${label}: escribe al menos ${instrument.minimumWords} palabras y hasta ${MAX_RESPONSE_CHARACTERS} caracteres.`)
    }
    responsePayload[key] = text.trim()
  }
  return {
    observationId: value.observationId.toLowerCase(), instrumentKey,
    instrumentVersion: OUTCOME_CAPTURE_VERSION, outcomeKey: instrument.outcomeKey,
    measurementRole: value.measurementRole as MeasurementRole, responsePayload,
  }
}

/** No score, inferred competence, client-supplied identity, or fabricated confidence. */
export function captureObservation(capture: OutcomeCapture, userId: string, observedAt: string) {
  const instrument = CAPTURE_INSTRUMENTS[capture.instrumentKey]
  return {
    id: capture.observationId, user_id: userId, outcome_key: instrument.outcomeKey,
    stage: instrument.stage, measurement_role: capture.measurementRole,
    instrument_key: capture.instrumentKey, instrument_version: OUTCOME_CAPTURE_VERSION,
    score: null, score_scale_min: null, score_scale_max: null, dimensions: {}, confidence: null,
    evidence_refs: instrument.prompts.map(({ key }) => ({ source: 'captured_response', ref: `${capture.observationId}#${key}` })),
    response_payload: capture.responsePayload, observed_at: observedAt,
  }
}
