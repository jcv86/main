import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import type {
  A3ModuleCriterion,
  A3ModuleValidationResult,
} from '@/lib/a3/module-validation'
import {
  DIFFICULT_RISK_IDS,
  PRESSURE_QUESTION_IDS,
  REQUIRED_RED_FLAG_CHECKS,
  countDifficultContextOverlap,
  countDifficultWords,
  hasDifficultRedFlag,
  toDifficultQuestionsDraft,
  type DifficultQuestionsContext,
} from '@/lib/a3/difficult-questions'

const PRESSURE_MINIMUM_WORDS: Record<string, number> = {
  differentiate: 25,
  failure: 35,
  departure: 25,
}

const PRESSURE_TIME_RANGES: Record<string, [number, number]> = {
  differentiate: [30, 70],
  failure: [45, 100],
  departure: [30, 70],
}

export function validateDifficultQuestionsSubmission(
  module: A3ModuleDefinition,
  responseValue: unknown,
  deliverableValue: unknown,
  context?: DifficultQuestionsContext | null,
): A3ModuleValidationResult {
  const responses = Array.isArray(responseValue)
    ? responseValue.map((value) => (typeof value === 'string' ? value.trim() : ''))
    : []
  const draft = toDifficultQuestionsDraft(deliverableValue)

  const selectedRiskIds = draft.riskPlans
    .map((plan) => plan.riskId)
    .filter((riskId) => DIFFICULT_RISK_IDS.includes(riskId as (typeof DIFFICULT_RISK_IDS)[number]))
  const uniqueRiskIds = new Set(selectedRiskIds)
  const risksSelected = selectedRiskIds.length === 3 && uniqueRiskIds.size === 3

  const structuredPlans = draft.riskPlans.every(
    (plan) =>
      plan.facts.length >= 35 &&
      plan.accountability.length >= 35 &&
      plan.learning.length >= 35 &&
      plan.readyNow.length >= 35,
  )

  const safeAnswers = draft.riskPlans.every(
    (plan) => countDifficultWords(plan.fullAnswer) >= 45 && !hasDifficultRedFlag(plan.fullAnswer),
  )

  const redFlagAudit = REQUIRED_RED_FLAG_CHECKS.every((check) =>
    draft.redFlagChecks.includes(check),
  )

  const pressureAnswersComplete = PRESSURE_QUESTION_IDS.every(
    (id) => countDifficultWords(draft.pressureAnswers[id].text) >= PRESSURE_MINIMUM_WORDS[id],
  )
  const failureAnswer = draft.pressureAnswers.failure.text
  const failureShowsLearning =
    /(error|fall[eé]|equivoqu[eé]|subestim[eé]|no logr[eé])/i.test(failureAnswer) &&
    /(aprend|correg|cambi|implement|reorganic|mejor)/i.test(failureAnswer) &&
    /(resultado|logr|reduj|aument|mejor|evit)/i.test(failureAnswer)
  const pressureDrillComplete = pressureAnswersComplete && failureShowsLearning

  const timingsAndRatingsComplete = PRESSURE_QUESTION_IDS.every((id) => {
    const answer = draft.pressureAnswers[id]
    const [minimum, maximum] = PRESSURE_TIME_RANGES[id]
    return (
      answer.durationSeconds >= minimum &&
      answer.durationSeconds <= maximum &&
      answer.selfRating >= 1 &&
      answer.selfRating <= 5
    )
  })

  const debriefComplete =
    draft.strongestResponse.length >= 45 &&
    draft.remainingRisk.length >= 45 &&
    draft.improvementAction.length >= 55 &&
    draft.reflection.length >= 100

  const contextOverlap = countDifficultContextOverlap(draft, context)
  const contextAligned = contextOverlap >= 3
  const metricPresent = [
    ...draft.riskPlans.map((plan) => plan.fullAnswer),
    ...PRESSURE_QUESTION_IDS.map((id) => draft.pressureAnswers[id].text),
  ].some((value) => /\d|%|\$|UF|CLP|USD|\+/.test(value))

  const criteria: A3ModuleCriterion[] = [
    {
      key: 'risk_selection',
      label: 'Tres riesgos distintos priorizados',
      met: risksSelected,
      score: risksSelected ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'structured_plans',
      label: 'Hechos, responsabilidad, aprendizaje y preparación definidos',
      met: structuredPlans,
      score: structuredPlans ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'safe_answers',
      label: 'Tres respuestas completas sin lenguaje defensivo',
      met: safeAnswers,
      score: safeAnswers ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'red_flag_audit',
      label: 'Auditoría de señales de riesgo completada',
      met: redFlagAudit,
      score: redFlagAudit ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'pressure_drill',
      label: 'Tres preguntas bajo presión con aprendizaje verificable',
      met: pressureDrillComplete,
      score: pressureDrillComplete ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'timing_and_rating',
      label: 'Tiempos y autoevaluaciones registrados',
      met: timingsAndRatingsComplete,
      score: timingsAndRatingsComplete ? 5 : 0,
      maxScore: 5,
    },
    {
      key: 'debrief',
      label: 'Debrief con riesgo pendiente y acción concreta',
      met: debriefComplete,
      score: debriefComplete ? 5 : 0,
      maxScore: 5,
    },
    {
      key: 'verified_context',
      label: 'Respuestas conectadas con rol y simulación anteriores',
      met: contextAligned,
      score: contextAligned ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'evidence',
      label: 'Evidencia cuantitativa incorporada',
      met: metricPresent,
      score: metricPresent ? 10 : 0,
      maxScore: 10,
    },
  ]

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const criticalCriteria = criteria.slice(0, 7)
  const errors = [
    ...(risksSelected ? [] : ['Selecciona tres riesgos distintos que puedan aparecer en una entrevista.']),
    ...(structuredPlans
      ? []
      : ['Desarrolla hechos, responsabilidad, aprendizaje y preparación actual para cada riesgo.']),
    ...(safeAnswers
      ? []
      : ['Redacta tres respuestas de al menos 45 palabras y elimina frases defensivas o de culpabilización.']),
    ...(redFlagAudit
      ? []
      : ['Confirma los cuatro controles de honestidad, responsabilidad y cierre positivo.']),
    ...(pressureDrillComplete
      ? []
      : ['Completa las tres preguntas bajo presión; la respuesta sobre un fracaso debe mostrar error, corrección y resultado.']),
    ...(timingsAndRatingsComplete
      ? []
      : ['Registra cada ejercicio dentro del rango de tiempo y autoevalúalo de 1 a 5.']),
    ...(debriefComplete
      ? []
      : ['Completa la respuesta más sólida, el riesgo pendiente, la acción de mejora y la reflexión final.']),
  ]

  return {
    passed:
      score >= module.completionContract.passScore &&
      criticalCriteria.every((criterion) => criterion.met),
    score,
    passScore: module.completionContract.passScore,
    errors,
    strengths: [
      ...criteria.filter((criterion) => criterion.met).map((criterion) => criterion.label),
      ...(contextAligned ? [`${contextOverlap} señales del contexto verificado incorporadas`] : []),
    ],
    criteria,
    responses,
    deliverable: Object.fromEntries(Object.entries(draft)),
  }
}
