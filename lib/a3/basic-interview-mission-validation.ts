import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import type {
  A3ModuleCriterion,
  A3ModuleValidationResult,
} from '@/lib/a3/module-validation'
import {
  BASIC_INTERVIEW_EVALUATION_IDS,
  BASIC_INTERVIEW_QUESTION_IDS,
  countBasicInterviewContextOverlap,
  countBasicInterviewWords,
  hasBasicInterviewRedFlag,
  toBasicInterviewDraft,
  type BasicInterviewContext,
} from '@/lib/a3/basic-interview-mission'

const TIME_RANGES: Record<string, [number, number]> = {
  warmup: [5, 20],
  introduction: [25, 60],
  careerWalk: [45, 110],
  currentRole: [30, 75],
  motivation: [25, 60],
  departure: [25, 60],
  achievement: [50, 100],
  challenge: [50, 100],
  teamwork: [40, 90],
  weakness: [30, 70],
  candidateQuestions: [20, 60],
  closing: [15, 40],
}

const MINIMUM_WORDS: Record<string, number> = {
  warmup: 5,
  introduction: 25,
  careerWalk: 40,
  currentRole: 25,
  motivation: 25,
  departure: 25,
  achievement: 40,
  challenge: 40,
  teamwork: 35,
  weakness: 30,
  candidateQuestions: 18,
  closing: 15,
}

function hasStarStructure(value: string): boolean {
  return (
    countBasicInterviewWords(value) >= 40 &&
    /(situaci[oó]n|contexto|proyecto|momento)/i.test(value) &&
    /(acci[oó]n|implement[eé]|organic[eé]|defin[ií]|coordin[eé]|levant[eé]|facilit[eé])/i.test(value) &&
    /(resultado|logr[eé]|reduj|aument|mejor|recuper)/i.test(value)
  )
}

function hasWeaknessProgress(value: string): boolean {
  return (
    /(debilidad|me costaba|tend[ií]a|antes)/i.test(value) &&
    /(implement[eé]|ahora|cambi[eé]|practico|uso|defin[ií])/i.test(value) &&
    /(mejor|reduj|avance|progreso|resultado|logr[eé])/i.test(value)
  )
}

export function validateBasicInterviewMissionSubmission(
  module: A3ModuleDefinition,
  responseValue: unknown,
  deliverableValue: unknown,
  context?: BasicInterviewContext | null,
): A3ModuleValidationResult {
  const responses = Array.isArray(responseValue)
    ? responseValue.map((value) => (typeof value === 'string' ? value.trim() : ''))
    : []
  const draft = toBasicInterviewDraft(deliverableValue)

  const completeAnswers = BASIC_INTERVIEW_QUESTION_IDS.filter(
    (id) => countBasicInterviewWords(draft.answers[id].text) >= MINIMUM_WORDS[id],
  )
  const validTimings = BASIC_INTERVIEW_QUESTION_IDS.filter((id) => {
    const [minimum, maximum] = TIME_RANGES[id]
    const duration = draft.answers[id].durationSeconds
    return duration >= minimum && duration <= maximum
  })
  const completeRatings = BASIC_INTERVIEW_QUESTION_IDS.every(
    (id) => draft.answers[id].selfRating >= 1 && draft.answers[id].selfRating <= 5,
  )
  const completeEvaluation = BASIC_INTERVIEW_EVALUATION_IDS.every(
    (id) =>
      draft.evaluation[id].rating >= 1 &&
      draft.evaluation[id].rating <= 5 &&
      draft.evaluation[id].observation.length >= 25,
  )

  const achievementStar = hasStarStructure(draft.answers.achievement.text)
  const challengeStar = hasStarStructure(draft.answers.challenge.text)
  const teamworkEvidence =
    countBasicInterviewWords(draft.answers.teamwork.text) >= 35 &&
    /(equipo|área|areas|personas|coordin)/i.test(draft.answers.teamwork.text) &&
    /(resultado|logr[eé]|reduj|mejor|aument)/i.test(draft.answers.teamwork.text)
  const behavioralComplete = achievementStar && challengeStar && teamworkEvidence

  const departureSafe =
    !hasBasicInterviewRedFlag(draft.answers.departure.text) &&
    /(crecimiento|responsabilidad|desaf[ií]o|etapa|impacto|oportunidad)/i.test(
      draft.answers.departure.text,
    )
  const weaknessSafe =
    !hasBasicInterviewRedFlag(draft.answers.weakness.text) &&
    hasWeaknessProgress(draft.answers.weakness.text)
  const candidateQuestionsComplete =
    (draft.answers.candidateQuestions.text.match(/\?/g) || []).length >= 2
  const closingComplete =
    countBasicInterviewWords(draft.answers.closing.text) >= 15 &&
    /(aportar|contribuir|experiencia|capacidad|impacto)/i.test(draft.answers.closing.text)
  const riskAndClosingComplete =
    departureSafe && weaknessSafe && candidateQuestionsComplete && closingComplete

  const finalReportComplete =
    completeEvaluation &&
    draft.strongestAnswer.length >= 40 &&
    draft.weakestAnswer.length >= 40 &&
    draft.difficultQuestionLearning.length >= 50 &&
    draft.nextPracticeAction.length >= 50 &&
    draft.routeReflection.length >= 120 &&
    draft.readinessState.length > 0

  const contextOverlap = countBasicInterviewContextOverlap(draft, context)
  const contextAligned = contextOverlap >= 4
  const metricAnswers = BASIC_INTERVIEW_QUESTION_IDS.filter((id) =>
    /\d|%|\$|UF|CLP|USD|\+/.test(draft.answers[id].text),
  )
  const quantitativeEvidence = metricAnswers.length >= 2

  const criteria: A3ModuleCriterion[] = [
    {
      key: 'complete_interview',
      label: 'Doce respuestas desarrolladas',
      met: completeAnswers.length === BASIC_INTERVIEW_QUESTION_IDS.length,
      score: completeAnswers.length === BASIC_INTERVIEW_QUESTION_IDS.length ? 20 : 0,
      maxScore: 20,
    },
    {
      key: 'timing',
      label: 'Tiempos reales dentro de rango',
      met: validTimings.length === BASIC_INTERVIEW_QUESTION_IDS.length,
      score: validTimings.length === BASIC_INTERVIEW_QUESTION_IDS.length ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'self_assessment',
      label: 'Autoevaluación completa de respuestas',
      met: completeRatings,
      score: completeRatings ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'behavioral',
      label: 'Logro, desafío y trabajo en equipo con evidencia',
      met: behavioralComplete,
      score: behavioralComplete ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'risk_and_closing',
      label: 'Pregunta difícil, salida, preguntas y cierre preparados',
      met: riskAndClosingComplete,
      score: riskAndClosingComplete ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'final_report',
      label: 'Informe final y decisión de preparación completos',
      met: finalReportComplete,
      score: finalReportComplete ? 5 : 0,
      maxScore: 5,
    },
    {
      key: 'verified_context',
      label: 'Misión conectada con evidencia verificada de la ruta',
      met: contextAligned,
      score: contextAligned ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'quantitative_evidence',
      label: 'Evidencia cuantitativa en al menos dos respuestas',
      met: quantitativeEvidence,
      score: quantitativeEvidence ? 10 : 0,
      maxScore: 10,
    },
  ]

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const criticalCriteria = criteria.slice(0, 6)
  const errors = [
    ...(completeAnswers.length === BASIC_INTERVIEW_QUESTION_IDS.length
      ? []
      : ['Desarrolla las doce respuestas con el nivel mínimo de detalle.']),
    ...(validTimings.length === BASIC_INTERVIEW_QUESTION_IDS.length
      ? []
      : ['Registra cada respuesta dentro del rango de tiempo indicado.']),
    ...(completeRatings
      ? []
      : ['Autoevalúa las doce respuestas en una escala de 1 a 5.']),
    ...(behavioralComplete
      ? []
      : ['Los ejemplos de logro y desafío deben mostrar situación, acción y resultado; trabajo en equipo debe incluir contribución y resultado.']),
    ...(riskAndClosingComplete
      ? []
      : ['Prepara una salida positiva, una debilidad con progreso, dos preguntas y un cierre con contribución.']),
    ...(finalReportComplete
      ? []
      : ['Completa las cinco evaluaciones, el informe final, la acción siguiente y el estado de preparación.']),
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
      ...(contextAligned ? [`${contextOverlap} señales verificadas incorporadas`] : []),
      ...(quantitativeEvidence
        ? [`${metricAnswers.length} respuestas con evidencia cuantitativa`]
        : []),
    ],
    criteria,
    responses,
    deliverable: Object.fromEntries(Object.entries(draft)),
  }
}
