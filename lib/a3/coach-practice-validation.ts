import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import type {
  A3ModuleCriterion,
  A3ModuleValidationResult,
} from '@/lib/a3/module-validation'
import {
  COACH_PRACTICE_SESSIONS,
  changedCoachTokens,
  countCoachWords,
  normalizeCoachText,
  type CoachPracticeContext,
  type CoachPracticeDraft,
} from '@/lib/a3/coach-practice'

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function toDraft(value: unknown): CoachPracticeDraft {
  const deliverable = objectValue(value)
  return {
    introOriginal: textValue(deliverable.introOriginal),
    introImproved: textValue(deliverable.introImproved),
    introLearning: textValue(deliverable.introLearning),
    motivationOriginal: textValue(deliverable.motivationOriginal),
    motivationImproved: textValue(deliverable.motivationImproved),
    motivationLearning: textValue(deliverable.motivationLearning),
    challengeOriginal: textValue(deliverable.challengeOriginal),
    challengeImproved: textValue(deliverable.challengeImproved),
    challengeLearning: textValue(deliverable.challengeLearning),
  }
}

function contextOverlap(draft: CoachPracticeDraft, context?: CoachPracticeContext | null): number {
  if (!context?.available) return 0
  const answerText = normalizeCoachText(
    [draft.introImproved, draft.motivationImproved, draft.challengeImproved].join(' '),
  )
  const contextItems = [
    context.jobTitle,
    context.company,
    context.cvRole,
    ...context.priorityKeywords,
    ...context.mustHaveRequirements,
    ...context.cvKeywords,
    ...context.cvSkills,
  ]
    .map(normalizeCoachText)
    .filter((item) => item.length >= 3)

  return new Set(
    contextItems.filter((item) =>
      item
        .split(' ')
        .filter((token) => token.length >= 4)
        .some((token) => answerText.includes(token)),
    ),
  ).size
}

export function validateCoachPracticeSubmission(
  module: A3ModuleDefinition,
  responseValue: unknown,
  deliverableValue: unknown,
  context?: CoachPracticeContext | null,
): A3ModuleValidationResult {
  const responses = Array.isArray(responseValue)
    ? responseValue.map((value) => textValue(value))
    : []
  const draft = toDraft(deliverableValue)

  const originalComplete = COACH_PRACTICE_SESSIONS.every(
    (session) => countCoachWords(draft[session.originalKey]) >= session.minimumWords,
  )
  const improvedComplete = COACH_PRACTICE_SESSIONS.every(
    (session) => countCoachWords(draft[session.improvedKey]) >= session.minimumWords,
  )
  const revisionsMeaningful = COACH_PRACTICE_SESSIONS.every((session) => {
    const original = draft[session.originalKey]
    const improved = draft[session.improvedKey]
    return (
      normalizeCoachText(original) !== normalizeCoachText(improved) &&
      changedCoachTokens(original, improved) >= 6
    )
  })
  const learningComplete = COACH_PRACTICE_SESSIONS.every(
    (session) => draft[session.learningKey].length >= 35,
  )

  const normalizedChallenge = normalizeCoachText(draft.challengeImproved)
  const starMarkers = ['situacion', 'tarea', 'accion', 'resultado', 'aprendizaje']
  const starComplete = starMarkers.every((marker) => normalizedChallenge.includes(marker))

  const overlap = contextOverlap(draft, context)
  const contextAligned = overlap >= 3
  const metricPresent = [
    draft.introImproved,
    draft.motivationImproved,
    draft.challengeImproved,
  ].some((answer) => /\d|%|\$|UF|CLP|USD|\+/.test(answer))

  const criteria: A3ModuleCriterion[] = [
    {
      key: 'original_answers',
      label: 'Tres respuestas iniciales completas',
      met: originalComplete,
      score: originalComplete ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'improved_answers',
      label: 'Tres versiones mejoradas completas',
      met: improvedComplete,
      score: improvedComplete ? 25 : 0,
      maxScore: 25,
    },
    {
      key: 'meaningful_revision',
      label: 'Revisión sustantiva después de la retroalimentación',
      met: revisionsMeaningful,
      score: revisionsMeaningful ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'learning',
      label: 'Aprendizaje registrado en cada práctica',
      met: learningComplete,
      score: learningComplete ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'star_structure',
      label: 'Desafío mejorado con estructura STAR y aprendizaje',
      met: starComplete,
      score: starComplete ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'verified_context',
      label: 'Respuestas conectadas con el rol y la oferta verificados',
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
    ...(originalComplete
      ? []
      : ['Desarrolla las tres respuestas iniciales con la extensión mínima indicada.']),
    ...(improvedComplete
      ? []
      : ['Completa las tres versiones mejoradas antes de cerrar la práctica.']),
    ...(revisionsMeaningful
      ? []
      : ['Cada versión mejorada debe cambiar de forma sustantiva respecto de la inicial.']),
    ...(learningComplete
      ? []
      : ['Registra qué cambiaste y qué aprendiste en las tres prácticas.']),
    ...(starComplete
      ? []
      : ['La respuesta de desafío debe identificar situación, tarea, acción, resultado y aprendizaje.']),
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
      ...(contextAligned ? [`${overlap} señales del contexto verificado incorporadas`] : []),
    ],
    criteria,
    responses,
    deliverable: draft,
  }
}
