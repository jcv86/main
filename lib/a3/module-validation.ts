import type { A3ModuleDefinition } from '@/lib/a3/module-catalog'

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

  const answeredResponses = responses.filter((response) => response.length > 0)
  const detailedResponses = responses.filter(
    (response) => response.length >= contract.minimumResponseLength,
  )
  const completedDeliverables = contract.requiredDeliverableKeys.filter(
    (key) => textValue(deliverable[key]).length >= contract.minimumResponseLength,
  )

  const responseCountMet = answeredResponses.length >= contract.minimumResponses
  const responseDetailMet = detailedResponses.length >= contract.minimumResponses
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
      key: 'response_detail',
      label: 'Respuestas con desarrollo suficiente',
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
          `Desarrolla cada respuesta con al menos ${contract.minimumResponseLength} caracteres.`,
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
    deliverable,
  }
}
