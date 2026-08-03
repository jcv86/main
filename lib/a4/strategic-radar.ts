export const A4_SIGNAL_CATEGORIES = [
  { id: 'labor_market', label: 'Mercado laboral' },
  { id: 'industry', label: 'Industria' },
  { id: 'company', label: 'Empresa' },
  { id: 'role', label: 'Rol objetivo' },
  { id: 'network', label: 'Red de contactos' },
  { id: 'personal_execution', label: 'Ejecución personal' },
  { id: 'macro', label: 'Contexto macro' },
] as const

export const A4_SIGNAL_CLASSIFICATIONS = [
  { id: 'fact', label: 'Hecho verificable' },
  { id: 'hypothesis', label: 'Hipótesis por contrastar' },
] as const

export const A4_SOURCE_TYPES = [
  { id: 'external_url', label: 'Fuente externa con URL' },
  { id: 'internal_document', label: 'Documento interno' },
  { id: 'direct_observation', label: 'Observación directa' },
] as const

export const A4_DECISION_STATUSES = [
  { id: 'watching', label: 'En observación' },
  { id: 'testing', label: 'En prueba' },
  { id: 'committed', label: 'Decisión tomada' },
  { id: 'discarded', label: 'Descartada' },
  { id: 'reviewed', label: 'Revisada' },
] as const

export type A4SignalCategory = (typeof A4_SIGNAL_CATEGORIES)[number]['id']
export type A4SignalClassification =
  (typeof A4_SIGNAL_CLASSIFICATIONS)[number]['id']
export type A4SourceType = (typeof A4_SOURCE_TYPES)[number]['id']
export type A4DecisionStatus = (typeof A4_DECISION_STATUSES)[number]['id']

export interface A4VerifiedSignal {
  id: string
  title: string
  category: A4SignalCategory
  classification: A4SignalClassification
  summary: string
  relevance: string
  confidence: number
  source_type: A4SourceType
  source_name: string
  source_url: string | null
  source_reference: string | null
  source_date: string
  status: 'active' | 'archived'
  created_at: string
  updated_at: string
}

export interface A4Decision {
  id: string
  signal_id: string
  decision: string
  rationale: string
  expected_evidence: string
  status: A4DecisionStatus
  review_on: string
  outcome: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface ValidatedSignalInput {
  title: string
  category: A4SignalCategory
  classification: A4SignalClassification
  summary: string
  relevance: string
  confidence: number
  sourceType: A4SourceType
  sourceName: string
  sourceUrl: string | null
  sourceReference: string | null
  sourceDate: string
}

export interface ValidatedDecisionInput {
  signalId: string
  decision: string
  rationale: string
  expectedEvidence: string
  status: A4DecisionStatus
  reviewOn: string
}

export interface ValidatedDecisionUpdate {
  status: A4DecisionStatus
  outcome: string | null
}

export interface ValidationResult<T> {
  valid: boolean
  errors: string[]
  value: T | null
}

const SIGNAL_CATEGORY_IDS = new Set<string>(
  A4_SIGNAL_CATEGORIES.map((item) => item.id),
)
const SIGNAL_CLASSIFICATION_IDS = new Set<string>(
  A4_SIGNAL_CLASSIFICATIONS.map((item) => item.id),
)
const SOURCE_TYPE_IDS = new Set<string>(A4_SOURCE_TYPES.map((item) => item.id))
const DECISION_STATUS_IDS = new Set<string>(
  A4_DECISION_STATUSES.map((item) => item.id),
)

function objectValue(input: unknown): Record<string, unknown> {
  return input && typeof input === 'object' && !Array.isArray(input)
    ? (input as Record<string, unknown>)
    : {}
}

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

function cleanLongText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T12:00:00.000Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

function todayIso(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

function validHttpUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  )
}

export function validateSignalInput(
  input: unknown,
  now = new Date(),
): ValidationResult<ValidatedSignalInput> {
  const body = objectValue(input)
  const title = cleanText(body.title)
  const category = cleanText(body.category)
  const classification = cleanText(body.classification)
  const summary = cleanLongText(body.summary)
  const relevance = cleanLongText(body.relevance)
  const confidence = Number(body.confidence)
  const sourceType = cleanText(body.sourceType)
  const sourceName = cleanText(body.sourceName)
  const sourceUrl = cleanText(body.sourceUrl)
  const sourceReference = cleanLongText(body.sourceReference)
  const sourceDate = cleanText(body.sourceDate)
  const errors: string[] = []

  if (title.length < 8 || title.length > 160) {
    errors.push('El título debe tener entre 8 y 160 caracteres.')
  }
  if (!SIGNAL_CATEGORY_IDS.has(category)) {
    errors.push('Selecciona una categoría válida.')
  }
  if (!SIGNAL_CLASSIFICATION_IDS.has(classification)) {
    errors.push('Distingue si la señal es un hecho o una hipótesis.')
  }
  if (summary.length < 30 || summary.length > 1200) {
    errors.push('Resume la señal en 30 a 1.200 caracteres.')
  }
  if (relevance.length < 20 || relevance.length > 800) {
    errors.push('Explica por qué importa en 20 a 800 caracteres.')
  }
  if (!Number.isInteger(confidence) || confidence < 1 || confidence > 5) {
    errors.push('La confianza debe estar entre 1 y 5.')
  }
  if (!SOURCE_TYPE_IDS.has(sourceType)) {
    errors.push('Selecciona un tipo de fuente válido.')
  }
  if (sourceName.length < 3 || sourceName.length > 180) {
    errors.push('Identifica la fuente con un nombre claro.')
  }
  if (!validDate(sourceDate) || sourceDate > todayIso(now)) {
    errors.push('La fecha de la fuente debe ser válida y no puede estar en el futuro.')
  }
  if (!sourceUrl && !sourceReference) {
    errors.push('Incluye una URL o una referencia verificable de la fuente.')
  }
  if (sourceType === 'external_url' && !validHttpUrl(sourceUrl)) {
    errors.push('La fuente externa debe incluir una URL http o https válida.')
  }

  if (errors.length > 0) return { valid: false, errors, value: null }

  return {
    valid: true,
    errors: [],
    value: {
      title,
      category: category as A4SignalCategory,
      classification: classification as A4SignalClassification,
      summary,
      relevance,
      confidence,
      sourceType: sourceType as A4SourceType,
      sourceName,
      sourceUrl: sourceUrl || null,
      sourceReference: sourceReference || null,
      sourceDate,
    },
  }
}

export function validateDecisionInput(
  input: unknown,
  now = new Date(),
): ValidationResult<ValidatedDecisionInput> {
  const body = objectValue(input)
  const signalId = cleanText(body.signalId)
  const decision = cleanLongText(body.decision)
  const rationale = cleanLongText(body.rationale)
  const expectedEvidence = cleanLongText(body.expectedEvidence)
  const status = cleanText(body.status) || 'watching'
  const reviewOn = cleanText(body.reviewOn)
  const errors: string[] = []

  if (!isUuid(signalId)) errors.push('Selecciona una señal válida.')
  if (decision.length < 12 || decision.length > 500) {
    errors.push('La decisión debe tener entre 12 y 500 caracteres.')
  }
  if (rationale.length < 20 || rationale.length > 1000) {
    errors.push('El fundamento debe tener entre 20 y 1.000 caracteres.')
  }
  if (expectedEvidence.length < 20 || expectedEvidence.length > 800) {
    errors.push('Define qué evidencia observarás en 20 a 800 caracteres.')
  }
  if (!DECISION_STATUS_IDS.has(status)) {
    errors.push('Selecciona un estado de decisión válido.')
  }
  if (!validDate(reviewOn) || reviewOn < todayIso(now)) {
    errors.push('La fecha de revisión debe ser válida y no anterior a hoy.')
  }

  if (errors.length > 0) return { valid: false, errors, value: null }

  return {
    valid: true,
    errors: [],
    value: {
      signalId,
      decision,
      rationale,
      expectedEvidence,
      status: status as A4DecisionStatus,
      reviewOn,
    },
  }
}

export function validateDecisionUpdate(
  input: unknown,
): ValidationResult<ValidatedDecisionUpdate> {
  const body = objectValue(input)
  const status = cleanText(body.status)
  const outcome = cleanLongText(body.outcome)
  const errors: string[] = []

  if (!DECISION_STATUS_IDS.has(status)) {
    errors.push('Selecciona un estado de decisión válido.')
  }
  if (outcome && (outcome.length < 10 || outcome.length > 1200)) {
    errors.push('El resultado debe tener entre 10 y 1.200 caracteres.')
  }
  if (status === 'reviewed' && !outcome) {
    errors.push('Una decisión revisada debe registrar el resultado observado.')
  }

  if (errors.length > 0) return { valid: false, errors, value: null }

  return {
    valid: true,
    errors: [],
    value: {
      status: status as A4DecisionStatus,
      outcome: outcome || null,
    },
  }
}
