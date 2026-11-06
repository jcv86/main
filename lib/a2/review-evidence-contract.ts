import { z } from 'zod'
import { A4_EXTERNAL_OUTCOMES, A4_REVIEW_CLASSIFICATIONS } from '../a4/strategic-radar'
import { parseOutcomeCapture, responseWordCount } from '../outcomes/response-capture'

/** Dated declarations used for a person's review, never a capability assessment. */
export const A2_REVIEW_EVIDENCE_VERSION = 'dtc-a2-review-evidence.v1' as const
export const A2_REVIEW_SOURCE_IDS = ['a3_baseline', 'a3_follow_up', 'a4_next_review', 'a4_latest_review'] as const
export const A2_REVIEW_STATUSES = ['available', 'missing', 'unavailable', 'locked', 'not_applicable'] as const
export type A2ReviewEvidenceStatus = typeof A2_REVIEW_STATUSES[number]
export type A2ReviewSourceId = typeof A2_REVIEW_SOURCE_IDS[number]

function storable(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const unit = value.charCodeAt(index)
    if (unit === 0) return false
    if (unit >= 0xD800 && unit <= 0xDBFF) {
      const next = value.charCodeAt(index + 1)
      if (!(next >= 0xDC00 && next <= 0xDFFF)) return false
      index++
    } else if (unit >= 0xDC00 && unit <= 0xDFFF) return false
  }
  return true
}
const text = (maximum: number, minimum = 1) => z.string().trim().min(minimum).max(maximum).refine(storable)
const uuid = z.uuid().transform(value => value.toLowerCase())

export function isA2ReviewDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^(?!0000)\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const milliseconds = Date.parse(`${value}T00:00:00Z`)
  return Number.isFinite(milliseconds) && new Date(milliseconds).toISOString().slice(0, 10) === value
}

/** PostgreSQL timestamp precision matters: a one-microsecond revision is a change. */
export function canonicalA2ReviewInstant(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 40) return null
  const parts = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?(Z|[+-]\d{2}:\d{2})$/.exec(value)
  if (!parts || !isA2ReviewDate(parts[1]) || Number(parts[2]) > 23 || Number(parts[3]) > 59 || Number(parts[4]) > 59) return null
  if (parts[6] !== 'Z' && (Number(parts[6].slice(1, 3)) > 23 || Number(parts[6].slice(4)) > 59)) return null
  const milliseconds = Date.parse(`${parts[1]}T${parts[2]}:${parts[3]}:${parts[4]}${parts[6]}`)
  if (!Number.isFinite(milliseconds)) return null
  const utc = new Date(milliseconds).toISOString()
  if (!/^\d{4}-/.test(utc) || utc.startsWith('0000-')) return null
  return `${utc.slice(0, 19)}.${(parts[5] ?? '').padEnd(6, '0')}Z`
}

const instant = z.string().refine(value => canonicalA2ReviewInstant(value) !== null)
  .transform(value => canonicalA2ReviewInstant(value)!)
const date = z.string().refine(isA2ReviewDate)
const status = z.enum(A2_REVIEW_STATUSES)
const response = text(900).refine(value => responseWordCount(value) >= 8)
const responses = z.object({ behavioral: response, value_fit: response, challenge: response }).strict()
const captureSchema = z.object({
  observationId: uuid, observedAt: instant, measurementRole: z.enum(['baseline', 'follow_up']), responsePayload: responses,
}).strict().superRefine((value, ctx) => {
  try {
    parseOutcomeCapture({
      observationId: value.observationId, instrumentKey: 'a3_structured_interview', instrumentVersion: '2-capture',
      outcomeKey: 'interview_capability', measurementRole: value.measurementRole, responsePayload: value.responsePayload,
    })
  } catch { ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Invalid captured response' }) }
})
export type A2ReviewCapture = z.infer<typeof captureSchema>

export function a2ReviewPairStatus(baseline: A2ReviewCapture | null, followUp: A2ReviewCapture | null) {
  return !baseline && !followUp ? 'empty' as const
    : !baseline ? 'follow_up_only' as const : !followUp ? 'baseline_only' as const
    : canonicalA2ReviewInstant(followUp.observedAt)! > canonicalA2ReviewInstant(baseline.observedAt)!
      ? 'available' as const : 'out_of_order' as const
}

export const a2ReviewCaptureHistorySchema = z.object({
  instrumentKey: z.literal('a3_structured_interview'), instrumentVersion: z.literal('2-capture'),
  baseline: captureSchema.nullable(), followUp: captureSchema.nullable(),
  pairStatus: z.enum(['empty', 'baseline_only', 'follow_up_only', 'available', 'out_of_order']),
  evaluationStatus: z.literal('not_evaluated'), comparable: z.literal(false),
}).strict().superRefine((value, ctx) => {
  if (value.baseline?.measurementRole === 'follow_up' || value.followUp?.measurementRole === 'baseline'
    || (value.baseline && value.followUp && value.baseline.observationId === value.followUp.observationId)
    || value.pairStatus !== a2ReviewPairStatus(value.baseline, value.followUp)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Captured response roles and temporal pairing must agree' })
  }
})
export type A2ReviewCaptureHistory = z.infer<typeof a2ReviewCaptureHistorySchema>

export const a2ReviewDecisionSchema = z.object({
  id: uuid, signalId: uuid, decision: text(500, 12), rationale: text(1_000, 20), expectedEvidence: text(800, 20),
  status: z.enum(['watching', 'testing', 'committed', 'reviewed', 'discarded']), reviewOn: date,
  outcome: text(1_200, 10).nullable(), reviewedAt: instant.nullable(),
  reviewClassification: z.enum(A4_REVIEW_CLASSIFICATIONS).nullable(),
  externalOutcomes: z.array(z.enum(A4_EXTERNAL_OUTCOMES)).max(A4_EXTERNAL_OUTCOMES.length),
  createdAt: instant, updatedAt: instant,
}).strict().superRefine((value, ctx) => {
  const closed = value.status === 'reviewed' || value.status === 'discarded'
  if (closed !== Boolean(value.reviewedAt) || (value.status === 'reviewed' && !value.outcome)
    || (!closed && (value.reviewClassification !== null || value.externalOutcomes.length > 0))
    || new Set(value.externalOutcomes).size !== value.externalOutcomes.length
    || value.createdAt > value.updatedAt
    || (value.reviewedAt && (value.reviewedAt < value.createdAt || value.reviewedAt > value.updatedAt))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Decision status, declared review and revision dates must agree' })
  }
})
export type A2ReviewDecision = z.infer<typeof a2ReviewDecisionSchema>

export const a2ReviewEvidenceSchema = z.object({
  version: z.literal(A2_REVIEW_EVIDENCE_VERSION),
  a3: z.object({ status, history: a2ReviewCaptureHistorySchema.nullable() }).strict(),
  a4: z.object({ status, nextReview: a2ReviewDecisionSchema.nullable(), latestReview: a2ReviewDecisionSchema.nullable() }).strict(),
}).strict().superRefine((value, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message })
  if ((value.a3.status === 'available' || value.a3.status === 'missing') !== Boolean(value.a3.history)
    || (value.a3.status === 'available' && value.a3.history?.pairStatus === 'empty')
    || (value.a3.status === 'missing' && value.a3.history?.pairStatus !== 'empty')) issue('A3 availability and captured history must agree')
  if ((value.a4.status === 'available') !== Boolean(value.a4.nextReview || value.a4.latestReview)) issue('A4 availability and declared decisions must agree')
  if (value.a4.nextReview && ['reviewed', 'discarded'].includes(value.a4.nextReview.status)) issue('The next review must be an open decision')
  if (value.a4.latestReview && !['reviewed', 'discarded'].includes(value.a4.latestReview.status)) issue('The latest review must be a closed decision')
  if (value.a4.nextReview && value.a4.latestReview && value.a4.nextReview.id === value.a4.latestReview.id) issue('Open and closed selections must be different records')
  if ((value.a3.status === 'not_applicable') !== (value.a4.status === 'not_applicable')) issue('Personal practice skips both professional sources')
})
export type A2ReviewEvidence = z.infer<typeof a2ReviewEvidenceSchema>

/** Verified missing/locked/not-applicable sources do not become read failures. */
export function a2ReviewEvidenceAvailable(evidence: A2ReviewEvidence): boolean {
  const checked = a2ReviewEvidenceSchema.parse(evidence)
  return checked.a3.status !== 'unavailable' && checked.a4.status !== 'unavailable'
}

export interface A2ReviewSourceRef {
  id: A2ReviewSourceId
  recordId: string
  recordedAt: string
  href: '/despega/a3-outcome-baseline' | '/despega/a3-outcome-follow-up' | '/despega/a4'
  label: string
}
export interface A2ReviewSuggestion {
  kind: 'unavailable' | 'review_a4_due' | 'review_a4_result' | 'compare_a3_responses' | 'capture_a3_baseline'
    | 'capture_a3_follow_up' | 'review_a3_order' | 'review_a4_scheduled' | 'none'
  title: string
  reason: string
  suggestedAction: string | null
  sourceRefs: A2ReviewSourceRef[]
}

export function a2ReviewSourceRefs(evidence: A2ReviewEvidence): A2ReviewSourceRef[] {
  const checked = a2ReviewEvidenceSchema.parse(evidence)
  const refs: A2ReviewSourceRef[] = []
  if (checked.a3.status === 'available') {
    if (checked.a3.history?.baseline) refs.push({ id: 'a3_baseline', recordId: checked.a3.history.baseline.observationId,
      recordedAt: checked.a3.history.baseline.observedAt, href: '/despega/a3-outcome-baseline', label: 'Registro inicial de entrevista' })
    if (checked.a3.history?.followUp) refs.push({ id: 'a3_follow_up', recordId: checked.a3.history.followUp.observationId,
      recordedAt: checked.a3.history.followUp.observedAt, href: '/despega/a3-outcome-follow-up', label: 'Seguimiento de entrevista' })
  }
  if (checked.a4.status === 'available') {
    if (checked.a4.nextReview) refs.push({ id: 'a4_next_review', recordId: checked.a4.nextReview.id,
      recordedAt: checked.a4.nextReview.updatedAt, href: '/despega/a4', label: 'Próxima revisión de decisión' })
    if (checked.a4.latestReview) refs.push({ id: 'a4_latest_review', recordId: checked.a4.latestReview.id,
      recordedAt: checked.a4.latestReview.updatedAt, href: '/despega/a4', label: 'Última revisión declarada' })
  }
  return refs
}

/** The date affects this display hint only; it is never inserted into the context hash. */
export function buildA2ReviewSuggestion(evidence: A2ReviewEvidence, today: string): A2ReviewSuggestion {
  const value = a2ReviewEvidenceSchema.parse(evidence)
  if (!isA2ReviewDate(today)) throw new TypeError('Invalid review date')
  const refs = a2ReviewSourceRefs(value)
  const suggestion = (kind: A2ReviewSuggestion['kind'], title: string, reason: string, suggestedAction: string | null,
    ids: A2ReviewSourceId[] = []): A2ReviewSuggestion => ({ kind, title, reason, suggestedAction,
      sourceRefs: refs.filter(ref => ids.includes(ref.id)) })
  if (!a2ReviewEvidenceAvailable(value)) return suggestion('unavailable', 'Vuelve a comprobar las fuentes',
    'No pudimos verificar una fuente aplicable. Esto no significa que tus registros estén vacíos.', null)
  if (value.a4.nextReview && value.a4.nextReview.reviewOn <= today) return suggestion('review_a4_due',
    value.a4.nextReview.reviewOn < today ? 'Tienes una revisión pendiente' : 'Hoy corresponde revisar una decisión',
    'La fecha de la decisión invita a contrastar lo esperado con lo que registraste; no demuestra un resultado.',
    'Revisa la evidencia esperada y decide qué mantener o ajustar en un paso de tu plan.', ['a4_next_review'])
  if (value.a4.latestReview) return suggestion('review_a4_result', 'Revisa lo que declaraste en Radar',
    'Tu última revisión conserva un resultado declarado. No prueba una mejora de capacidad ni que DTC haya causado el resultado.',
    'Contrasta el resultado con la evidencia esperada y elige un ajuste concreto para revisar en tu plan.', ['a4_latest_review'])
  const pair = value.a3.history?.pairStatus
  if (pair === 'available') return suggestion('compare_a3_responses', 'Contrasta tus dos registros de entrevista',
    'El seguimiento es posterior al registro inicial. Las respuestas todavía no están evaluadas y no generan una mejora numérica.',
    'Lee ambos intentos y elige un aspecto concreto que quieras practicar en tu plan.', ['a3_baseline', 'a3_follow_up'])
  if (pair === 'out_of_order' || pair === 'follow_up_only') return suggestion('review_a3_order', 'Revisa la secuencia de tus registros',
    'No hay una pareja temporal inicial y de seguimiento que podamos presentar en orden. No se infiere una comparación.',
    'Abre los registros y comprueba qué intento quieres conservar como punto de partida antes de ajustar el plan.', ['a3_baseline', 'a3_follow_up'])
  if (pair === 'baseline_only') return suggestion('capture_a3_follow_up', 'Conserva un nuevo intento cuando lo hayas practicado',
    'El registro inicial está guardado y todavía no encontramos un seguimiento de esta versión.',
    'Elige una respuesta para practicar y conserva después un seguimiento con lo que observaste.', ['a3_baseline'])
  if (value.a4.nextReview) return suggestion('review_a4_scheduled', 'Conserva tu próxima revisión',
    'La decisión tiene una revisión futura programada; todavía no es un resultado observado.',
    'Si te sirve para tu objetivo, prepara en el plan la evidencia que revisarás en esa fecha.', ['a4_next_review'])
  if (value.a3.status === 'missing') return suggestion('capture_a3_baseline', 'Puedes conservar un punto de partida',
    'La consulta se completó y todavía no hay respuestas de entrevista de la versión sin puntajes.',
    'Si quieres trabajar entrevistas, registra un intento inicial para poder revisarlo más adelante.')
  return suggestion('none', value.a3.status === 'not_applicable' ? 'Tu práctica personal mantiene su propio foco' : 'Continúa con tu próximo paso',
    value.a3.status === 'not_applicable' ? 'Las fuentes profesionales de A3 y A4 no se consultan para este camino personal.'
      : 'No hay una fuente habilitada con una revisión que añadir al plan en este momento.', null)
}

const UUID_IN_TEXT = /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi
const URL_IN_TEXT = /(?:\b[a-z][a-z0-9+.-]*:\/\/|www\.|\/\/)[^\s<>()]+|\b(?:mailto|javascript|data):[^\s<>()]+|\/despega(?:\/[^\s<>()]+)?/gi
function modelText(value: string, maximum: number): string {
  return value.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1 [enlace omitido]').replace(URL_IN_TEXT, '[enlace omitido]')
    .replace(UUID_IN_TEXT, '[identificador omitido]').slice(0, maximum).replace(/[\uD800-\uDBFF]$/, '').trim()
}
const cleanText = (maximum: number) => text(maximum).refine(value => modelText(value, maximum) === value)
const modelCaptureSchema = z.object({ observedAt: instant,
  responsePayload: z.object({ behavioral: cleanText(900), value_fit: cleanText(900), challenge: cleanText(900) }).strict(),
}).strict()
const modelDecisionSchema = z.object({
  decision: cleanText(500), rationale: cleanText(1_000), expectedEvidence: cleanText(800),
  status: z.enum(['watching', 'testing', 'committed', 'reviewed', 'discarded']), reviewOn: date,
  outcome: cleanText(1_200).nullable(), reviewedAt: instant.nullable(),
  reviewClassification: z.enum(A4_REVIEW_CLASSIFICATIONS).nullable(), externalOutcomes: z.array(z.enum(A4_EXTERNAL_OUTCOMES)).max(8),
  createdAt: instant, updatedAt: instant,
}).strict()
export const a2ReviewModelContextSchema = z.object({
  version: z.literal(A2_REVIEW_EVIDENCE_VERSION), kind: z.literal('recorded_user_declarations'),
  a3: z.object({ status, instrumentKey: z.literal('a3_structured_interview'), instrumentVersion: z.literal('2-capture'),
    pairStatus: z.enum(['empty', 'baseline_only', 'follow_up_only', 'available', 'out_of_order']).nullable(),
    baseline: modelCaptureSchema.nullable(), followUp: modelCaptureSchema.nullable(),
    evaluationStatus: z.literal('not_evaluated'), comparable: z.literal(false),
  }).strict(),
  a4: z.object({ status, nextReview: modelDecisionSchema.nullable(), latestReview: modelDecisionSchema.nullable(),
    evidenceMeaning: z.literal('user_declaration_only'), causation: z.literal('not_established'),
  }).strict(),
}).strict()
export type A2ReviewModelContext = z.infer<typeof a2ReviewModelContextSchema>

/** A detached allowlisted model projection. Raw record IDs and links never cross this boundary. */
export function buildA2ReviewModelContext(evidence: A2ReviewEvidence): A2ReviewModelContext {
  const checked = a2ReviewEvidenceSchema.parse(evidence)
  const capture = (value: A2ReviewCapture | null) => value ? { observedAt: value.observedAt, responsePayload: {
    behavioral: modelText(value.responsePayload.behavioral, 900), value_fit: modelText(value.responsePayload.value_fit, 900),
    challenge: modelText(value.responsePayload.challenge, 900),
  } } : null
  const decision = (value: A2ReviewDecision | null) => value ? {
    decision: modelText(value.decision, 500), rationale: modelText(value.rationale, 1_000), expectedEvidence: modelText(value.expectedEvidence, 800),
    status: value.status, reviewOn: value.reviewOn, outcome: value.outcome === null ? null : modelText(value.outcome, 1_200),
    reviewedAt: value.reviewedAt, reviewClassification: value.reviewClassification, externalOutcomes: [...value.externalOutcomes],
    createdAt: value.createdAt, updatedAt: value.updatedAt,
  } : null
  return a2ReviewModelContextSchema.parse({
    version: A2_REVIEW_EVIDENCE_VERSION, kind: 'recorded_user_declarations',
    a3: { status: checked.a3.status, instrumentKey: 'a3_structured_interview', instrumentVersion: '2-capture',
      pairStatus: checked.a3.history?.pairStatus ?? null, baseline: capture(checked.a3.history?.baseline ?? null),
      followUp: capture(checked.a3.history?.followUp ?? null), evaluationStatus: 'not_evaluated', comparable: false },
    a4: { status: checked.a4.status, nextReview: decision(checked.a4.nextReview), latestReview: decision(checked.a4.latestReview),
      evidenceMeaning: 'user_declaration_only', causation: 'not_established' },
  })
}
