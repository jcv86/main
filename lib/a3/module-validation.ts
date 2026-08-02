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

function normalizeComparable(value: string): string {
  return value
    .toLocaleLowerCase('es')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function validateCvBuilderSubmission(
  module: A3ModuleDefinition,
  responses: string[],
  deliverable: Record<string, unknown>,
): A3ModuleValidationResult {
  const fullName = textValue(deliverable.fullName)
  const email = textValue(deliverable.email)
  const phone = textValue(deliverable.phone)
  const location = textValue(deliverable.location)
  const targetRole = textValue(deliverable.targetRole)
  const targetKeywords = splitCvList(deliverable.targetKeywords)
  const summary = textValue(deliverable.professionalSummary)
  const experienceTitle = textValue(deliverable.experienceTitle)
  const experienceCompany = textValue(deliverable.experienceCompany)
  const experienceDates = textValue(deliverable.experienceDates)
  const achievements = [
    textValue(deliverable.achievement1),
    textValue(deliverable.achievement2),
    textValue(deliverable.achievement3),
  ]
  const skills = splitCvList(deliverable.skills)
  const atsChecklist = splitCvList(deliverable.atsChecklist)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const phoneDigits = phone.replace(/\D/g, '')
  const contactMet =
    fullName.length >= 3 && emailValid && phoneDigits.length >= 7 && location.length >= 3

  const targetMet = targetRole.length >= 3 && targetKeywords.length >= 3
  const normalizedSummary = normalizeComparable(summary)
  const roleTokens = splitCvList(targetRole.replace(/\s+/g, ','))
    .map(normalizeComparable)
    .filter((token) => token.length >= 3)
  const normalizedKeywords = targetKeywords.map(normalizeComparable)
  const summaryAligned = [...roleTokens, ...normalizedKeywords].some((token) =>
    normalizedSummary.includes(token),
  )

  const summaryLengthMet = summary.length >= 80 && summary.length <= 600
  const summaryClean = !/[\[\]{}]/.test(summary)
  const summaryMet = summaryLengthMet && summaryClean

  const positionMet =
    experienceTitle.length >= 3 &&
    experienceCompany.length >= 2 &&
    experienceDates.length >= 4
  const detailedAchievements = achievements.filter((achievement) => achievement.length >= 35)
  const achievementsMet = detailedAchievements.length === 3
  const metricPresent = achievements.some((achievement) =>
    /\d|%|\$|UF|CLP|USD|\+/.test(achievement),
  )
  const experienceMet = positionMet && achievementsMet

  const skillsMet = skills.length >= 6
  const normalizedSkills = skills.map(normalizeComparable)
  const keywordOverlap = normalizedKeywords.filter((keyword) =>
    normalizedSkills.some(
      (skill) => skill.includes(keyword) || keyword.includes(skill),
    ),
  ).length
  const skillsAligned = keywordOverlap >= 2

  const atsMet = CV_BUILDER_CRITICAL_ATS_IDS.every((id) =>
    atsChecklist.includes(id),
  )

  const criteria: A3ModuleCriterion[] = [
    {
      key: 'contact',
      label: 'Identidad y contacto verificables',
      met: contactMet,
      score: contactMet ? 15 : 0,
      maxScore: 15,
    },
    {
      key: 'target_alignment',
      label: 'Rol objetivo y palabras clave definidos',
      met: targetMet,
      score: (targetMet ? 10 : 0) + (summaryAligned ? 5 : 0),
      maxScore: 15,
    },
    {
      key: 'professional_summary',
      label: 'Resumen profesional listo para lectura rápida',
      met: summaryMet,
      score: (summaryLengthMet ? 15 : 0) + (summaryAligned && summaryClean ? 5 : 0),
      maxScore: 20,
    },
    {
      key: 'experience_evidence',
      label: 'Experiencia expresada como logros',
      met: experienceMet,
      score: (positionMet ? 5 : 0) + (achievementsMet ? 15 : 0) + (metricPresent ? 10 : 0),
      maxScore: 30,
    },
    {
      key: 'skills',
      label: 'Competencias priorizadas para el rol',
      met: skillsMet,
      score: (skillsMet ? 5 : 0) + (skillsAligned ? 5 : 0),
      maxScore: 10,
    },
    {
      key: 'ats',
      label: 'Controles ATS críticos confirmados',
      met: atsMet,
      score: atsMet ? 10 : 0,
      maxScore: 10,
    },
  ]

  const score = criteria.reduce((sum, criterion) => sum + criterion.score, 0)
  const errors = [
    ...(contactMet
      ? []
      : ['Completa nombre, correo válido, teléfono y ubicación.']),
    ...(targetMet
      ? []
      : ['Define un rol objetivo y al menos tres palabras clave.']),
    ...(summaryMet
      ? []
      : ['Redacta un resumen de 80 a 600 caracteres sin marcadores pendientes.']),
    ...(experienceMet
      ? []
      : ['Registra un cargo, empresa, fechas y tres logros de al menos 35 caracteres.']),
    ...(skillsMet ? [] : ['Incluye al menos seis competencias relevantes.']),
    ...(atsMet ? [] : ['Confirma todos los controles ATS críticos.']),
  ]
  const allCriticalCriteriaMet = criteria.every((criterion) => criterion.met)

  return {
    passed: score >= module.completionContract.passScore && allCriticalCriteriaMet,
    score,
    passScore: module.completionContract.passScore,
    errors,
    strengths: [
      ...criteria.filter((criterion) => criterion.met).map((criterion) => criterion.label),
      ...(summaryAligned ? ['Resumen alineado con el rol objetivo'] : []),
      ...(metricPresent ? ['Logros con evidencia cuantitativa'] : []),
      ...(skillsAligned ? ['Competencias conectadas con palabras clave'] : []),
    ],
    criteria,
    responses,
    deliverable,
  }
}

function validateCoachSubmission(
  module: A3ModuleDefinition,
  responses: string[],
  deliverable: Record<string, unknown>,
): A3ModuleValidationResult {
  const contract = module.completionContract
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
