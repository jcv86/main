import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import {
  type AnswerArchitectureContext,
} from '@/lib/a3/answer-architecture'

export interface AnswerArchitectureCriterion {
  key: string
  label: string
  met: boolean
  score: number
  maxScore: number
}

export interface AnswerArchitectureValidationResult {
  passed: boolean
  score: number
  passScore: number
  errors: string[]
  strengths: string[]
  criteria: AnswerArchitectureCriterion[]
  responses: string[]
  deliverable: Record<string, unknown>
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function validateAnswerArchitectureSubmission(
  module: A3ModuleDefinition,
  responseValue: unknown,
  deliverableValue: unknown,
  context: AnswerArchitectureContext,
): AnswerArchitectureValidationResult {
  const deliverable = objectValue(deliverableValue)
  const selfIntroduction = textValue(deliverable.selfIntroduction)
  const motivation = textValue(deliverable.motivation)
  const strengthEvidence = textValue(deliverable.strengthEvidence)
  const challengeStar = textValue(deliverable.challengeStar)
  const whyHire = textValue(deliverable.whyHire)
  const timing30 = textValue(deliverable.timing30)
  const timing45 = textValue(deliverable.timing45)
  const timing60 = textValue(deliverable.timing60)
  const responses = [
    selfIntroduction,
    motivation,
    strengthEvidence,
    challengeStar,
    whyHire,
    timing30,
    timing45,
    timing60,
  ]

  const completeMet = [selfIntroduction, motivation, strengthEvidence, challengeStar, whyHire].every(Boolean)
  const timingMet = [timing30, timing45, timing60].every(Boolean)
  const structureMet = deliverable.structureReviewed === 'true'
  const factsMet = deliverable.factsConfirmed === 'true'
  const contextMet = deliverable.contextReviewed === 'true'
  // These checks record submission and self-review. They are not a rubric score
  // for interview ability, nor a verification of candidate facts.
  const definitions = [
    ['core_answers', 'Cinco respuestas registradas', completeMet, 'Registra un intento propio para las cinco preguntas.'],
    ['timing_versions', 'Versiones de práctica registradas', timingMet, 'Registra las tres versiones y pruébalas con el temporizador; la longitud no demuestra duración real.'],
    ['structure_review', 'Orden revisado por ti', structureMet, 'Revisa contexto, acción propia y resultado conocido en tu relato.'],
    ['facts_confirmation', 'Hechos confirmados por ti', factsMet, 'Confirma que tu respuesta conserva tus hechos; deja lo desconocido pendiente.'],
    ['context_review', 'Relación con la pregunta revisada', contextMet, 'Revisa que cada ejemplo responda la pregunta y no atribuya requisitos o experiencias nuevos.'],
  ] as const
  const criteria: AnswerArchitectureCriterion[] = definitions.map(([key, label, met]) => ({ key, label, met, score: met ? 20 : 0, maxScore: 20 }))
  return {
    passed: criteria.every((criterion) => criterion.met),
    score: criteria.reduce((sum, criterion) => sum + criterion.score, 0),
    passScore: module.completionContract.passScore,
    errors: definitions.filter(([, , met]) => !met).map(([, , , error]) => error),
    strengths: criteria.filter((criterion) => criterion.met).map((criterion) => criterion.label),
    criteria,
    responses,
    deliverable: { ...deliverable, assessmentKind: 'self_reported_completion_check', factsConfirmation: 'user_attestation_not_independent_verification' },
  }
}
