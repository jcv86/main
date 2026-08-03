import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import type {
  A3ModuleCriterion,
  A3ModuleValidationResult,
} from '@/lib/a3/module-validation'
import {
  countCommunicationContextOverlap,
  countCommunicationWords,
  isDurationWithin,
  toCommunicationGymDraft,
  type CommunicationGymContext,
} from '@/lib/a3/communication-gym'

export function validateCommunicationGymSubmission(
  module: A3ModuleDefinition,
  responseValue: unknown,
  deliverableValue: unknown,
  context?: CommunicationGymContext | null,
): A3ModuleValidationResult {
  const responses = Array.isArray(responseValue)
    ? responseValue.map((value) => (typeof value === 'string' ? value.trim() : ''))
    : []
  const draft = toCommunicationGymDraft(deliverableValue)

  const initialScriptsComplete =
    countCommunicationWords(draft.introScript) >= 30 &&
    countCommunicationWords(draft.motivationScript) >= 35
  const initialTimingComplete =
    isDurationWithin(draft.introDurationSeconds, 20, 45) &&
    isDurationWithin(draft.motivationDurationSeconds, 30, 65)
  const pauseDrillComplete =
    draft.pauseDurations.length >= 3 &&
    draft.pauseDurations.slice(0, 3).every((duration) => isDurationWithin(duration, 2, 5))
  const assessments = [
    draft.paceAssessment,
    draft.clarityAssessment,
    draft.fillerAssessment,
    draft.confidenceAssessment,
    draft.endingAssessment,
  ]
  const assessmentComplete = assessments.every((value) => value.length >= 3)
  const improvementComplete =
    draft.improvementFocus.length >= 35 &&
    countCommunicationWords(draft.improvedScript) >= 35 &&
    isDurationWithin(draft.improvedDurationSeconds, 25, 60)
  const reflectionComplete = draft.reflection.length >= 60

  const overlap = countCommunicationContextOverlap(draft, context)
  const contextAligned = overlap >= 3
  const metricPresent = [
    draft.introScript,
    draft.motivationScript,
    draft.improvedScript,
  ].some((value) => /\d|%|\$|UF|CLP|USD|\+/.test(value))

  const criteria: A3ModuleCriterion[] = [
    {
      key: 'initial_scripts',
      label: 'Guiones iniciales listos para práctica oral',
      met: initialScriptsComplete,
      score: initialScriptsComplete ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'initial_timing',
      label: 'Dos prácticas cronometradas dentro de rango',
      met: initialTimingComplete,
      score: initialTimingComplete ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'pause_drill',
      label: 'Tres pausas deliberadas de dos a cinco segundos',
      met: pauseDrillComplete,
      score: pauseDrillComplete ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'self_assessment',
      label: 'Autoevaluación completa de la entrega',
      met: assessmentComplete,
      score: assessmentComplete ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'improvement_round',
      label: 'Segunda entrega con foco de mejora y tiempo registrado',
      met: improvementComplete,
      score: improvementComplete ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'reflection',
      label: 'Reflexión sobre cambios observables en la comunicación',
      met: reflectionComplete,
      score: reflectionComplete ? 5 : 0,
      maxScore: 5,
    },
    {
      key: 'verified_context',
      label: 'Comunicación conectada con el rol y la oferta verificados',
      met: contextAligned,
      score: contextAligned ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'evidence',
      label: 'Evidencia cuantitativa incorporada al discurso',
      met: metricPresent,
      score: metricPresent ? 10 : 0,
      maxScore: 10,
    },
  ]

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const criticalCriteria = criteria.slice(0, 6)
  const errors = [
    ...(initialScriptsComplete
      ? []
      : ['Completa los guiones de autopresentación y motivación con suficiente desarrollo.']),
    ...(initialTimingComplete
      ? []
      : ['Registra la autopresentación entre 20 y 45 segundos y la motivación entre 30 y 65 segundos.']),
    ...(pauseDrillComplete
      ? []
      : ['Completa tres pausas deliberadas de entre dos y cinco segundos.']),
    ...(assessmentComplete
      ? []
      : ['Evalúa ritmo, claridad, muletillas, confianza y cierre.']),
    ...(improvementComplete
      ? []
      : ['Define un foco de mejora y registra una segunda entrega de 25 a 60 segundos.']),
    ...(reflectionComplete
      ? []
      : ['Describe en al menos 60 caracteres qué cambió entre ambas entregas.']),
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
    deliverable: Object.fromEntries(Object.entries(draft)),
  }
}
