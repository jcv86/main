import { normalizeCoachText } from '@/lib/a3/coach-practice'

export const COMMUNICATION_GYM_DRAFT_KEY = 'dtc:a3:communication-gym:draft:v1'

export interface CommunicationGymDraft {
  introScript: string
  introDurationSeconds: number
  motivationScript: string
  motivationDurationSeconds: number
  pauseDurations: number[]
  paceAssessment: string
  clarityAssessment: string
  fillerAssessment: string
  confidenceAssessment: string
  endingAssessment: string
  improvementFocus: string
  improvedScript: string
  improvedDurationSeconds: number
  reflection: string
}

export interface CommunicationGymContext {
  jobTitle: string
  company: string
  prioritySignals: string[]
  introApproved: string
  motivationApproved: string
  challengeApproved: string
  available: boolean
}

export const EMPTY_COMMUNICATION_GYM_DRAFT: CommunicationGymDraft = {
  introScript: '',
  introDurationSeconds: 0,
  motivationScript: '',
  motivationDurationSeconds: 0,
  pauseDurations: [],
  paceAssessment: '',
  clarityAssessment: '',
  fillerAssessment: '',
  confidenceAssessment: '',
  endingAssessment: '',
  improvementFocus: '',
  improvedScript: '',
  improvedDurationSeconds: 0,
  reflection: '',
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function numberValue(value: unknown): number {
  const numeric = Number(value)
  return Number.isFinite(numeric) && numeric >= 0 ? Math.round(numeric) : 0
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
  }
  if (typeof value !== 'string') return []
  return value
    .split(/\r?\n|,|;/)
    .map((item) => item.trim().replace(/^[-•*]\s*/, ''))
    .filter(Boolean)
}

export function toCommunicationGymDraft(value: unknown): CommunicationGymDraft {
  const deliverable = objectValue(value)
  return {
    introScript: textValue(deliverable.introScript),
    introDurationSeconds: numberValue(deliverable.introDurationSeconds),
    motivationScript: textValue(deliverable.motivationScript),
    motivationDurationSeconds: numberValue(deliverable.motivationDurationSeconds),
    pauseDurations: Array.isArray(deliverable.pauseDurations)
      ? deliverable.pauseDurations.map(numberValue).filter((duration) => duration > 0)
      : [],
    paceAssessment: textValue(deliverable.paceAssessment),
    clarityAssessment: textValue(deliverable.clarityAssessment),
    fillerAssessment: textValue(deliverable.fillerAssessment),
    confidenceAssessment: textValue(deliverable.confidenceAssessment),
    endingAssessment: textValue(deliverable.endingAssessment),
    improvementFocus: textValue(deliverable.improvementFocus),
    improvedScript: textValue(deliverable.improvedScript),
    improvedDurationSeconds: numberValue(deliverable.improvedDurationSeconds),
    reflection: textValue(deliverable.reflection),
  }
}

export function extractCommunicationGymContext(
  coachDeliverable: unknown,
  jobDecoderDeliverable: unknown,
): CommunicationGymContext {
  const coach = objectValue(coachDeliverable)
  const job = objectValue(jobDecoderDeliverable)
  const jobTitle = textValue(job.jobTitle)
  const company = textValue(job.company)
  const prioritySignals = [
    ...stringList(job.priorityKeywords),
    ...stringList(job.mustHaveRequirements),
  ]

  const introApproved = textValue(coach.introImproved)
  const motivationApproved = textValue(coach.motivationImproved)
  const challengeApproved = textValue(coach.challengeImproved)

  return {
    jobTitle,
    company,
    prioritySignals,
    introApproved,
    motivationApproved,
    challengeApproved,
    available:
      introApproved.length > 0 ||
      motivationApproved.length > 0 ||
      challengeApproved.length > 0 ||
      jobTitle.length > 0 ||
      prioritySignals.length > 0,
  }
}

export function countCommunicationWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export function isDurationWithin(
  seconds: number,
  minimum: number,
  maximum: number,
): boolean {
  return seconds >= minimum && seconds <= maximum
}

export function countCommunicationContextOverlap(
  draft: CommunicationGymDraft,
  context?: CommunicationGymContext | null,
): number {
  if (!context?.available) return 0
  const spoken = normalizeCoachText(
    [draft.introScript, draft.motivationScript, draft.improvedScript].join(' '),
  )
  const signals = [context.jobTitle, context.company, ...context.prioritySignals]
    .map(normalizeCoachText)
    .filter((item) => item.length >= 3)

  return new Set(
    signals.filter((signal) =>
      signal
        .split(' ')
        .filter((token) => token.length >= 4)
        .some((token) => spoken.includes(token)),
    ),
  ).size
}

export const SAMPLE_COMMUNICATION_GYM: CommunicationGymDraft = {
  introScript:
    'Soy líder de proyectos con experiencia coordinando equipos comerciales y técnicos. Mi fortaleza es convertir procesos complejos en planes claros, con responsables, riesgos y métricas visibles. Busco aportar esa capacidad en una operación que necesita mayor predictibilidad.',
  introDurationSeconds: 34,
  motivationScript:
    'Me interesa esta oportunidad porque combina coordinación transversal, indicadores y mejora continua. La empresa necesita una operación más predecible y esa necesidad se conecta con mi experiencia construyendo sistemas de seguimiento. Puedo aportar estructura desde el inicio y seguir desarrollándome en un entorno exigente.',
  motivationDurationSeconds: 47,
  pauseDurations: [3, 3, 2],
  paceAssessment: 'estable',
  clarityAssessment: 'clara',
  fillerAssessment: 'algunos',
  confidenceAssessment: 'media',
  endingAssessment: 'adecuado',
  improvementFocus:
    'Reducir palabras de relleno y cerrar cada respuesta con una contribución específica para el rol.',
  improvedScript:
    'Soy líder de proyectos con experiencia coordinando equipos comerciales y técnicos en operaciones exigentes. Convierto información dispersa en planes claros y, mediante un sistema de seguimiento, ayudé a reducir 22% los atrasos. Quiero aportar esa capacidad para fortalecer la predictibilidad y la coordinación transversal del equipo.',
  improvedDurationSeconds: 41,
  reflection:
    'La segunda entrega fue más breve, mantuvo una pausa antes de la evidencia y terminó con una contribución concreta. El siguiente foco será eliminar expresiones de relleno sin acelerar el ritmo.',
}
