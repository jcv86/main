import type {
  A3ModuleCriterion,
  A3ModuleValidationResult,
} from '@/lib/a3/module-validation'
import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import {
  countCvOfferOverlap,
  splitDecoderKeywords,
  splitDecoderLines,
  type JobDecoderContext,
} from '@/lib/a3/job-decoder'

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function detailed(items: string[], minimum: number): boolean {
  return items.length > 0 && items.every((item) => item.length >= minimum)
}

export function validateJobDecoderSubmission(
  module: A3ModuleDefinition,
  responseValue: unknown,
  deliverableValue: unknown,
  context: JobDecoderContext = {},
): A3ModuleValidationResult {
  const responses = Array.isArray(responseValue)
    ? responseValue.map(textValue)
    : []
  const deliverable = objectValue(deliverableValue)

  const jobTitle = textValue(deliverable.jobTitle)
  const company = textValue(deliverable.company)
  const jobPosting = textValue(deliverable.jobPosting)
  const mustHaves = splitDecoderLines(deliverable.mustHaveRequirements)
  const niceToHaves = splitDecoderLines(deliverable.niceToHaveRequirements)
  const hiddenSignals = splitDecoderLines(deliverable.hiddenSignals)
  const strongMatches = splitDecoderLines(deliverable.strongMatches)
  const partialMatches = splitDecoderLines(deliverable.partialMatches)
  const gapPlan = splitDecoderLines(deliverable.gapPlan)
  const likelyQuestions = splitDecoderLines(deliverable.likelyQuestions)
  const applicationAdjustments = splitDecoderLines(deliverable.applicationAdjustments)
  const priorityKeywords = splitDecoderKeywords(deliverable.priorityKeywords)

  const offerMet =
    jobTitle.length >= 3 && company.length >= 2 && jobPosting.length >= 180
  const classificationMet =
    mustHaves.length >= 3 &&
    niceToHaves.length >= 2 &&
    hiddenSignals.length >= 1 &&
    detailed(mustHaves, 8) &&
    detailed(niceToHaves, 8) &&
    detailed(hiddenSignals, 8)
  const matchMapMet =
    strongMatches.length >= 2 &&
    partialMatches.length >= 1 &&
    gapPlan.length >= 1 &&
    detailed(strongMatches, 30) &&
    detailed(partialMatches, 25) &&
    detailed(gapPlan, 30)
  const questionsMet = likelyQuestions.length >= 3 && detailed(likelyQuestions, 20)
  const actionPlanMet =
    applicationAdjustments.length >= 3 &&
    detailed(applicationAdjustments, 18) &&
    priorityKeywords.length >= 5

  const metricPresent = [...strongMatches, ...partialMatches].some((item) =>
    /\d|%|\$|UF|CLP|USD|\+/.test(item),
  )

  const offerItems = [
    ...mustHaves,
    ...niceToHaves,
    ...priorityKeywords,
    jobTitle,
  ]
  const overlapCount = countCvOfferOverlap(offerItems, context.cvBuilder)
  const cvAlignmentMet = Boolean(context.cvBuilder?.available) && overlapCount >= 2

  const criteria: A3ModuleCriterion[] = [
    {
      key: 'offer_context',
      label: 'Oferta completa y contexto del cargo',
      met: offerMet,
      score: offerMet ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'requirements',
      label: 'Requisitos clasificados por prioridad',
      met: classificationMet,
      score: classificationMet ? 20 : 0,
      maxScore: 20,
    },
    {
      key: 'match_map',
      label: 'Mapa de ajuste respaldado con evidencia',
      met: matchMapMet,
      score: matchMapMet ? 25 : 0,
      maxScore: 25,
    },
    {
      key: 'questions',
      label: 'Preguntas probables derivadas de la oferta',
      met: questionsMet,
      score: questionsMet ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'application_plan',
      label: 'Plan de adaptación para CV y postulación',
      met: actionPlanMet,
      score: actionPlanMet ? 10 : 0,
      maxScore: 10,
    },
    {
      key: 'cv_alignment',
      label: 'Oferta contrastada con el CV aprobado',
      met: cvAlignmentMet,
      score: cvAlignmentMet ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'evidence_specificity',
      label: 'Evidencia cuantitativa o verificable',
      met: metricPresent,
      score: metricPresent ? 10 : 0,
      maxScore: 10,
    },
  ]

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const criticalCriteriaMet = [
    offerMet,
    classificationMet,
    matchMapMet,
    questionsMet,
    actionPlanMet,
  ].every(Boolean)

  const errors = [
    ...(offerMet
      ? []
      : ['Completa cargo, empresa y una oferta de al menos 180 caracteres.']),
    ...(classificationMet
      ? []
      : ['Clasifica al menos tres requisitos obligatorios, dos deseables y una señal implícita.']),
    ...(matchMapMet
      ? []
      : ['Construye un mapa con dos coincidencias fuertes, una parcial y una brecha con plan.']),
    ...(questionsMet
      ? []
      : ['Formula al menos tres preguntas probables de entrevista.']),
    ...(actionPlanMet
      ? []
      : ['Define tres ajustes de postulación y cinco palabras clave prioritarias.']),
  ]

  return {
    passed: score >= module.completionContract.passScore && criticalCriteriaMet,
    score,
    passScore: module.completionContract.passScore,
    errors,
    strengths: [
      ...criteria.filter((criterion) => criterion.met).map((criterion) => criterion.label),
      ...(cvAlignmentMet
        ? [`Se detectaron ${overlapCount} coincidencias con el CV aprobado`]
        : []),
    ],
    criteria,
    responses,
    deliverable,
  }
}
