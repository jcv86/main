import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import {
  countAnswerWords,
  normalizeAnswerText,
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

function containsAny(text: string, values: string[]): boolean {
  return values
    .map(normalizeAnswerText)
    .filter((value) => value.length >= 3)
    .some((value) => text.includes(value))
}

function contextTokens(context: AnswerArchitectureContext): string[] {
  const stopWords = new Set([
    'para', 'como', 'con', 'una', 'uno', 'unos', 'unas', 'del', 'las', 'los',
    'que', 'por', 'sus', 'este', 'esta', 'desde', 'entre', 'sobre', 'cada', 'equipo',
  ])
  return [
    ...context.priorityKeywords,
    ...context.cvKeywords,
    ...context.cvSkills,
    ...context.mustHaveRequirements,
    ...context.cvAchievements,
  ]
    .flatMap((item) => normalizeAnswerText(item).split(/[^a-z0-9%$+]+/))
    .filter((token) => token.length >= 4 && !stopWords.has(token))
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

  const primaryAnswers = [
    selfIntroduction,
    motivation,
    strengthEvidence,
    challengeStar,
    whyHire,
  ]
  const answerMinimums = [140, 140, 160, 280, 140]
  const completeMet = primaryAnswers.every(
    (answer, index) => answer.length >= answerMinimums[index],
  )

  const wordCounts = primaryAnswers.map(countAnswerWords)
  const structureMet =
    wordCounts[0] >= 30 && wordCounts[0] <= 120 &&
    wordCounts[1] >= 30 && wordCounts[1] <= 140 &&
    wordCounts[2] >= 35 && wordCounts[2] <= 150 &&
    wordCounts[3] >= 65 && wordCounts[3] <= 240 &&
    wordCounts[4] >= 30 && wordCounts[4] <= 130

  const normalizedChallenge = normalizeAnswerText(challengeStar)
  const starMet = ['situacion', 'tarea', 'accion', 'resultado'].every((label) =>
    normalizedChallenge.includes(label),
  )

  const timingCounts = [timing30, timing45, timing60].map(countAnswerWords)
  const timingMet =
    timingCounts[0] >= 20 && timingCounts[0] <= 90 &&
    timingCounts[1] >= 35 && timingCounts[1] <= 135 &&
    timingCounts[2] >= 50 && timingCounts[2] <= 180 &&
    timingCounts[0] < timingCounts[1] &&
    timingCounts[1] < timingCounts[2]

  const combined = normalizeAnswerText(primaryAnswers.join(' '))
  const roleSignals = [
    context.jobTitle,
    context.company,
    context.cvRole,
  ].filter(Boolean)
  const requirementSignals = [
    ...context.mustHaveRequirements,
    ...context.priorityKeywords,
  ]
  const alignedSignals = requirementSignals.filter((signal) => {
    const normalized = normalizeAnswerText(signal)
    return normalized.length >= 3 && combined.includes(normalized)
  }).length
  const alignmentMet =
    context.available &&
    containsAny(combined, roleSignals) &&
    (alignedSignals >= 2 || containsAny(combined, requirementSignals))

  const tokens = Array.from(new Set(contextTokens(context)))
  const overlapCount = tokens.filter((token) => combined.includes(token)).length
  const metricPresent = /\d|%|\$|UF|CLP|USD|\+/.test(primaryAnswers.join(' '))
  const evidenceMet = context.available && metricPresent && overlapCount >= 2

  const criteria: AnswerArchitectureCriterion[] = [
    {
      key: 'complete_answers',
      label: 'Cinco respuestas esenciales desarrolladas',
      met: completeMet,
      score: completeMet ? 30 : 0,
      maxScore: 30,
    },
    {
      key: 'response_structure',
      label: 'Extensión adecuada para una entrevista',
      met: structureMet,
      score: structureMet ? 20 : 0,
      maxScore: 20,
    },
    {
      key: 'star_structure',
      label: 'Historia de desafío con estructura STAR completa',
      met: starMet,
      score: starMet ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'timing_versions',
      label: 'Mensaje adaptado a 30, 45 y 60 segundos',
      met: timingMet,
      score: timingMet ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'verified_alignment',
      label: 'Respuestas conectadas con la oferta verificada',
      met: alignmentMet,
      score: alignmentMet ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'verified_evidence',
      label: 'Evidencia del CV incorporada con métricas',
      met: evidenceMet,
      score: evidenceMet ? 10 : 0,
      maxScore: 10,
    },
  ]

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const criticalCriteria = criteria.slice(0, 4)
  const errors = [
    ...(completeMet
      ? []
      : ['Desarrolla las cinco respuestas esenciales con suficiente detalle.']),
    ...(structureMet
      ? []
      : ['Ajusta la extensión de las respuestas para que puedan decirse con claridad.']),
    ...(starMet
      ? []
      : ['Incluye explícitamente Situación, Tarea, Acción y Resultado en la historia STAR.']),
    ...(timingMet
      ? []
      : ['Crea versiones progresivas y distintas para 30, 45 y 60 segundos.']),
  ]

  return {
    passed:
      score >= module.completionContract.passScore &&
      criticalCriteria.every((criterion) => criterion.met),
    score,
    passScore: module.completionContract.passScore,
    errors,
    strengths: criteria.filter((criterion) => criterion.met).map((criterion) => criterion.label),
    criteria,
    responses,
    deliverable,
  }
}
