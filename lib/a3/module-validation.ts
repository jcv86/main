import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'
import {
  CV_BUILDER_CRITICAL_ATS_IDS,
  splitCvList,
} from '@/lib/a3/cv-builder'

export interface A3ModuleCriterion {
  key: string
  label: string
  met: boolean
  score: number
  maxScore: number
}

export interface A3ModuleValidationResult {
  passed: boolean
  score: number
  passScore: number
  errors: string[]
  strengths: string[]
  criteria: A3ModuleCriterion[]
  responses: string[]
  deliverable: Record<string, unknown>
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function validateCvBuilderSubmission(
  module: A3ModuleDefinition,
  responses: string[],
  deliverable: Record<string, unknown>,
): A3ModuleValidationResult {
  const present = (key: string) => Boolean(textValue(deliverable[key]))
  const email = textValue(deliverable.email)
  const phone = textValue(deliverable.phone)
  const phoneDigits = phone.replace(/\D/g, '')
  const contactMet = present('fullName') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (!phone || phoneDigits.length >= 7)
  const targetMet = present('targetRole')
  const summaryMet = present('professionalSummary')
  const achievements = ['achievement1', 'achievement2', 'achievement3'].filter(present)
  const positionFields = ['experienceTitle', 'experienceCompany', 'experienceDates']
  const hasPosition = positionFields.some(present) || achievements.length > 0
  const experienceMet = deliverable.evidenceKind === 'education' && !hasPosition
    ? present('education')
    : positionFields.every(present) && achievements.length > 0
  const skillsMet = splitCvList(deliverable.skills).length > 0
  const atsMet = CV_BUILDER_CRITICAL_ATS_IDS.every((id) => splitCvList(deliverable.atsChecklist).includes(id))
  const factsMet = deliverable.factsConfirmed === true || deliverable.factsConfirmed === 'true'
  // Coverage is retained only for the existing completion contract. No word,
  // keyword or digit count estimates the quality or truth of a CV.
  const definitions = [
    ['contact', 'Nombre y contacto revisados', contactMet, 15, 'Completa tu nombre y un correo válido. El teléfono es opcional; si lo incluyes, revísalo.'],
    ['target_alignment', 'Foco declarado', targetMet, 10, 'Indica el rol o área que te interesa explorar; no necesitas una vacante.'],
    ['professional_summary', 'Resumen registrado', summaryMet, 15, 'Escribe un resumen fiel de lo que sabes y has hecho.'],
    ['experience_evidence', 'Ejemplo o formación registrados', experienceMet, 20, 'Incluye un ejemplo real con contexto y fechas, o elige formación inicial si todavía no tienes experiencia. No inventes un empleo ni un logro.'],
    ['skills', 'Competencias declaradas', skillsMet, 10, 'Incluye al menos una competencia que puedas explicar con un ejemplo.'],
    ['ats', 'Revisión de formato realizada', atsMet, 10, 'Revisa los controles de formato. No garantizan la aceptación de un ATS.'],
    ['fidelity', 'Hechos confirmados por ti', factsMet, 20, 'Confirma que los hechos incluidos son tuyos y que no añadiste datos para completar la plantilla.'],
  ] as const
  const criteria: A3ModuleCriterion[] = definitions.map(([key, label, met, maxScore]) => ({ key, label, met, maxScore, score: met ? maxScore : 0 }))
  return {
    passed: criteria.every((criterion) => criterion.met),
    score: criteria.reduce((sum, criterion) => sum + criterion.score, 0),
    passScore: module.completionContract.passScore,
    errors: definitions.filter(([, , met]) => !met).map(([, , , , error]) => error),
    strengths: criteria.filter((criterion) => criterion.met).map((criterion) => criterion.label),
    criteria,
    responses,
    deliverable: { ...deliverable, assessmentKind: 'self_reported_completion_check', factsConfirmation: 'user_attestation_not_independent_verification' },
  }
}

function validateCoachSubmission(
  module: A3ModuleDefinition,
  responses: string[],
  deliverable: Record<string, unknown>,
): A3ModuleValidationResult {
  const contract = module.completionContract
  const answeredResponses = responses.filter((response) => response.length > 0)

  const completedDeliverables = contract.requiredDeliverableKeys.filter(
    (key) => textValue(deliverable[key]).length > 0,
  )

  const responseCountMet = answeredResponses.length >= contract.minimumResponses
  const responseDetailMet = deliverable.factsConfirmed === 'true' || deliverable.factsConfirmed === true
  const deliverableMet =
    completedDeliverables.length === contract.requiredDeliverableKeys.length
  const crossCheckMet = contract.requiredDeliverableKeys.every((key, index) => {
    const response = responses[index] || ''
    const deliverableText = textValue(deliverable[key])
    return response.length > 0 && response === deliverableText
  })

  const criteria: A3ModuleCriterion[] = [
    {
      key: 'response_count',
      label: 'Preguntas respondidas',
      met: responseCountMet,
      score: responseCountMet ? 25 : 0,
      maxScore: 25,
    },
    {
      key: 'facts_review',
      label: 'Hechos y límites revisados por ti',
      met: responseDetailMet,
      score: responseDetailMet ? 35 : 0,
      maxScore: 35,
    },
    {
      key: 'deliverable',
      label: 'Entregable completo',
      met: deliverableMet,
      score: deliverableMet ? 25 : 0,
      maxScore: 25,
    },
    {
      key: 'integrity',
      label: 'Entregable consistente con la sesión',
      met: crossCheckMet,
      score: crossCheckMet ? 15 : 0,
      maxScore: 15,
    },
  ]

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const errors = [
    ...(responseCountMet
      ? []
      : [`Responde las ${contract.minimumResponses} preguntas del módulo.`]),
    ...(responseDetailMet
      ? []
      : [
          'Confirma que las respuestas describen tus hechos y distinguen lo que sigue pendiente.',
        ]),
    ...(deliverableMet
      ? []
      : ['Completa todos los campos del entregable del módulo.']),
    ...(crossCheckMet
      ? []
      : ['El entregable debe reflejar exactamente las respuestas registradas.']),
  ]
  const allCriticalCriteriaMet = criteria.every((criterion) => criterion.met)

  return {
    passed: score >= contract.passScore && allCriticalCriteriaMet,
    score,
    passScore: contract.passScore,
    errors,
    strengths: criteria.filter((criterion) => criterion.met).map((criterion) => criterion.label),
    criteria,
    responses,
    deliverable: { ...deliverable, assessmentKind: 'self_reported_completion_check' },
  }
}

export function validateA3ModuleSubmission(
  module: A3ModuleDefinition,
  responseValue: unknown,
  deliverableValue: unknown,
): A3ModuleValidationResult {
  const responses = Array.isArray(responseValue)
    ? responseValue.map(textValue)
    : []
  const deliverable = objectValue(deliverableValue)
  const contract = module.completionContract

  if (!contract.enabled) {
    return {
      passed: false,
      score: 0,
      passScore: contract.passScore,
      errors: ['Este módulo todavía no tiene un contrato de finalización activo.'],
      strengths: [],
      criteria: [],
      responses,
      deliverable,
    }
  }

  return contract.validationMode === 'cv_builder'
    ? validateCvBuilderSubmission(module, responses, deliverable)
    : validateCoachSubmission(module, responses, deliverable)
}
