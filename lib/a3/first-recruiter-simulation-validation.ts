import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import type { A3ModuleCriterion, A3ModuleValidationResult } from '@/lib/a3/module-validation'
import {
  FIRST_RECRUITER_QUESTION_IDS,
  countFirstRecruiterContextOverlap,
  countFirstRecruiterWords,
  toFirstRecruiterDraft,
  type FirstRecruiterContext,
} from '@/lib/a3/first-recruiter-simulation'

const TIME_RANGES: Record<string, [number, number]> = {
  greeting: [5, 20],
  introduction: [25, 60],
  experience: [30, 75],
  motivation: [25, 60],
  strength: [25, 60],
  behavioral: [45, 100],
  candidateQuestion: [8, 35],
  closing: [8, 30],
}

const MINIMUM_WORDS: Record<string, number> = {
  greeting: 5,
  introduction: 25,
  experience: 25,
  motivation: 25,
  strength: 25,
  behavioral: 40,
  candidateQuestion: 8,
  closing: 10,
}

export function validateFirstRecruiterSimulationSubmission(
  module: A3ModuleDefinition,
  responseValue: unknown,
  deliverableValue: unknown,
  context?: FirstRecruiterContext | null,
): A3ModuleValidationResult {
  const responses = Array.isArray(responseValue)
    ? responseValue.map((value) => (typeof value === 'string' ? value.trim() : ''))
    : []
  const draft = toFirstRecruiterDraft(deliverableValue)

  const completeAnswers = FIRST_RECRUITER_QUESTION_IDS.filter(
    (id) => countFirstRecruiterWords(draft.answers[id].text) >= MINIMUM_WORDS[id],
  )
  const validTimings = FIRST_RECRUITER_QUESTION_IDS.filter((id) => {
    const [minimum, maximum] = TIME_RANGES[id]
    const duration = draft.answers[id].durationSeconds
    return duration >= minimum && duration <= maximum
  })
  const completeRatings = FIRST_RECRUITER_QUESTION_IDS.filter(
    (id) => draft.answers[id].selfRating >= 1 && draft.answers[id].selfRating <= 5,
  )
  const behavioral = draft.answers.behavioral.text
  const starComplete =
    countFirstRecruiterWords(behavioral) >= 40 &&
    /(situaci[oó]n|contexto)/i.test(behavioral) &&
    /(acci[oó]n|hice|implement[eé]|organic[eé]|defin[ií])/i.test(behavioral) &&
    /(resultado|logr[eé]|reduj|aument|mejor)/i.test(behavioral)
  const debriefComplete =
    draft.strongestAnswer.length >= 35 &&
    draft.weakestAnswer.length >= 35 &&
    draft.improvementAction.length >= 45 &&
    draft.interviewReflection.length >= 80
  const contextOverlap = countFirstRecruiterContextOverlap(draft, context)
  const contextAligned = contextOverlap >= 3
  const metricPresent = FIRST_RECRUITER_QUESTION_IDS.some((id) =>
    /\d|%|\$|UF|CLP|USD|\+/.test(draft.answers[id].text),
  )

  const criteria: A3ModuleCriterion[] = [
    {
      key: 'complete_interview',
      label: 'Ocho respuestas desarrolladas',
      met: completeAnswers.length === FIRST_RECRUITER_QUESTION_IDS.length,
      score: completeAnswers.length === FIRST_RECRUITER_QUESTION_IDS.length ? 25 : 0,
      maxScore: 25,
    },
    {
      key: 'timing',
      label: 'Tiempos reales dentro de rango',
      met: validTimings.length === FIRST_RECRUITER_QUESTION_IDS.length,
      score: validTimings.length === FIRST_RECRUITER_QUESTION_IDS.length ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'self_ratings',
      label: 'Autoevaluación de cada respuesta',
      met: completeRatings.length === FIRST_RECRUITER_QUESTION_IDS.length,
      score: completeRatings.length === FIRST_RECRUITER_QUESTION_IDS.length ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'star',
      label: 'Respuesta conductual con estructura STAR',
      met: starComplete,
      score: starComplete ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'debrief',
      label: 'Debrief completo con acción de mejora',
      met: debriefComplete,
      score: debriefComplete ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'verified_context',
      label: 'Entrevista conectada con rol y oferta verificados',
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
  const criticalCriteria = criteria.slice(0, 5)
  const errors = [
    ...(completeAnswers.length === FIRST_RECRUITER_QUESTION_IDS.length
      ? []
      : ['Desarrolla las ocho respuestas con el nivel mínimo de detalle.']),
    ...(validTimings.length === FIRST_RECRUITER_QUESTION_IDS.length
      ? []
      : ['Registra cada respuesta dentro del rango de tiempo indicado.']),
    ...(completeRatings.length === FIRST_RECRUITER_QUESTION_IDS.length
      ? []
      : ['Autoevalúa las ocho respuestas en una escala de 1 a 5.']),
    ...(starComplete
      ? []
      : ['La respuesta conductual debe mostrar situación, acción personal y resultado.']),
    ...(debriefComplete
      ? []
      : ['Completa la respuesta más fuerte, la más débil, la acción de mejora y la reflexión final.']),
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
