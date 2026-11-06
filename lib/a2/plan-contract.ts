import { z } from 'zod'
import type { JourneyFlow } from '../journey/flow'
import type { GuidedNextAction } from '../journey/next-action'
import { a2ReviewEvidenceSchema, a2ReviewEvidenceAvailable, type A2ReviewEvidence } from './review-evidence-contract'

/** Shared with the browser; keep server clients, crypto and side effects out. */
export const A2_PLAN_VERSION = 'dtc-a2-plan.v1' as const
export const A2_PLAN_CONTEXT_VERSION = 'dtc-a2-plan-context.v1' as const
export const A2_PLAN_COMMAND_VERSION = 'dtc-a2-plan-command.v1' as const
export const A2_PLAN_VIEW_VERSION = 'dtc-a2-plan-view.v1' as const
export const A2_PLAN_MEMORY_VERSION = 'dtc-a2-plan-memory.v1' as const
export const A2_PLAN_ACTOR_HEADER = 'X-DTC-Plan-Actor'
export const A2_PLAN_EXPECTED_ACTOR_HEADER = 'X-DTC-Expected-Plan-Actor'
export const A2_PLAN_MAX_CONTENT_BYTES = 12_000
export const A2_PLAN_MAX_REVIEW_DAYS = 30
export const A2_PLAN_STATES = ['active', 'paused', 'completed', 'cancelled'] as const
export const A2_PLAN_STEP_STATES = ['pending', 'reported_done', 'skipped'] as const

// PostgreSQL JSONB cannot store NUL or a lone UTF-16 surrogate. Reject those
// before a submitted plan can become an unrecoverable transport retry.
function isStorableText(value: string): boolean {
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
const boundedText = (maximum: number, minimum = 1) => z.string().trim().min(minimum).max(maximum)
  .refine(isStorableText, 'Text must contain storable Unicode characters')
const uuid = z.uuid().transform(value => value.toLowerCase())
const revision = z.number().int().min(1).max(2_147_483_647)
const hash = z.string().regex(/^[a-f0-9]{64}$/)
const sourceId = z.enum(['journey', 'objective', 'adjustment'])
const sourceStatus = z.enum(['available', 'missing', 'unavailable'])
const canonicalHref = z.string().max(200).regex(/^\/despega(?:\/[a-z0-9-]+)*$/)

export function isA2PlanCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^(?!0000)\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const instant = Date.parse(`${value}T00:00:00.000Z`)
  return Number.isFinite(instant) && new Date(instant).toISOString().slice(0, 10) === value
}

export const a2PlanDateSchema = z.string().refine(isA2PlanCalendarDate, 'Use a real YYYY-MM-DD calendar date')
export const a2PlanInstantSchema = z.iso.datetime({ offset: true }).max(64)
  .refine(value => Number.isFinite(Date.parse(value)))

/** The server remains authoritative; this same helper keeps date labels in Chile. */
export function a2PlanToday(instant: number | Date = Date.now()): string {
  const date = instant instanceof Date ? instant : new Date(instant)
  if (!Number.isFinite(date.getTime())) throw new TypeError('Invalid plan clock')
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const value = (type: string) => parts.find(part => part.type === type)?.value
  const result = `${value('year')}-${value('month')}-${value('day')}`
  if (!isA2PlanCalendarDate(result)) throw new TypeError('Invalid plan clock')
  return result
}

export function validateA2PlanReviewDate(reviewDate: string, today: string):
  { ok: true } | { ok: false; code: 'plan_review_date_invalid' | 'plan_expired' } {
  if (!isA2PlanCalendarDate(reviewDate) || !isA2PlanCalendarDate(today)) {
    return { ok: false, code: 'plan_review_date_invalid' }
  }
  if (reviewDate < today) return { ok: false, code: 'plan_expired' }
  const days = (Date.parse(`${reviewDate}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000
  return days <= A2_PLAN_MAX_REVIEW_DAYS ? { ok: true } : { ok: false, code: 'plan_review_date_invalid' }
}

export const a2PlanStepSchema = z.object({
  id: uuid, title: boundedText(120), action: boundedText(600),
  status: z.enum(A2_PLAN_STEP_STATES), note: boundedText(300, 0).optional(),
}).strict()

export const a2PlanContentSchema = z.object({
  version: z.literal(A2_PLAN_VERSION), purpose: boundedText(500), constraints: boundedText(1_000, 0),
  reviewDate: a2PlanDateSchema, steps: z.array(a2PlanStepSchema).min(1).max(5),
}).strict().superRefine((value, ctx) => {
  if (new Set(value.steps.map(step => step.id)).size !== value.steps.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['steps'], message: 'Step IDs must be unique' })
  }
  if (new TextEncoder().encode(JSON.stringify(value)).byteLength > A2_PLAN_MAX_CONTENT_BYTES) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Plan content exceeds its byte limit' })
  }
})
export type A2PlanStep = z.infer<typeof a2PlanStepSchema>
export type A2PlanContent = z.infer<typeof a2PlanContentSchema>

export const a2PlanCanonicalActionSchema = z.object({
  href: canonicalHref, label: boundedText(400), title: boundedText(600), description: boundedText(2_000),
}).strict()

export const a2PlanContextSourceSchema = z.object({
  id: sourceId, status: sourceStatus, label: boundedText(400), href: canonicalHref.optional(),
  // Canonical guidance accepts PostgreSQL UUIDs, including historical versions.
  recordId: z.string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i).optional(),
  recordedAt: a2PlanInstantSchema.optional(),
}).strict()
export type A2PlanContextSource = z.infer<typeof a2PlanContextSourceSchema>

export const a2PlanContextAdjustmentSchema = z.object({
  dayNumber: z.number().int().min(1).max(90), nextAction: boundedText(2_000),
  retainedWork: boundedText(4_000), barrierLabel: boundedText(400), reviewDate: a2PlanDateSchema,
}).strict()
const objectiveSchema = z.object({ summary: boundedText(8_000) }).strict()
const sourcesSchema = z.array(a2PlanContextSourceSchema).min(1).max(3)
const limitationsSchema = z.array(boundedText(1_000)).max(8)

type SourceBoundContext = {
  sources: A2PlanContextSource[]
  objective?: { summary?: string } | null
  adjustment?: { dayNumber?: number } | null
}
function validateSourceBindings(value: SourceBoundContext, ctx: z.RefinementCtx) {
  const sources = new Map(value.sources.map(source => [source.id, source]))
  const issue = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sources'], message })
  if (sources.size !== value.sources.length || sources.get('journey')?.status !== 'available') {
    issue('Sources must be unique and include the available canonical journey')
  }
  for (const id of ['objective', 'adjustment'] as const) {
    const source = sources.get(id)
    if ((source?.status === 'available') !== Boolean(value[id])) issue('Source availability and content must agree')
    if (source?.status === 'available' && (!source.recordId || !source.recordedAt)) {
      issue('Available stored sources require a record and revision time')
    }
    if (source && source.status !== 'available' && (source.recordId !== undefined || source.recordedAt !== undefined)) {
      issue('An unavailable or missing source cannot carry a verified record reference')
    }
  }
  if (sources.get('journey')?.recordId !== undefined || sources.get('journey')?.recordedAt !== undefined) {
    issue('The derived journey is identified by its projection, not a fabricated row revision')
  }
}

export const a2PlanGuidanceSchema = z.object({
  version: z.literal('dtc-guided-next-action.v1'), action: a2PlanCanonicalActionSchema,
  reason: boundedText(2_000), objective: objectiveSchema.optional(), adjustment: a2PlanContextAdjustmentSchema.optional(),
  sources: sourcesSchema, limitations: limitationsSchema,
}).strict().superRefine(validateSourceBindings)

export const a2PlanContextProjectionSchema = z.object({
  practicePath: z.enum(['persona', 'profesional', 'ambos']),
  activeHorizon: z.union([z.literal(30), z.literal(60), z.literal(90)]),
  next: a2PlanCanonicalActionSchema,
  completedDays: z.array(z.number().int().min(1).max(90)).max(90),
  checkpointPending: z.boolean(), radarAvailable: z.boolean(),
  objective: objectiveSchema.nullable(), adjustment: a2PlanContextAdjustmentSchema.nullable(),
  sources: sourcesSchema, limitations: limitationsSchema,
  // Optional for stored v1 snapshots. Never inject a default or rewrite an old hash.
  reviewEvidence: a2ReviewEvidenceSchema.optional(),
}).strict().superRefine((value, ctx) => {
  validateSourceBindings(value, ctx)
  if (value.completedDays.some((day, index) => index > 0 && day <= value.completedDays[index - 1])) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['completedDays'], message: 'Completed days must be sorted and unique' })
  }
  if (value.practicePath === 'persona' && (value.objective || value.sources.some(source => source.id === 'objective'))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['objective'], message: 'Personal practice does not consume a workplace objective' })
  }
  if (value.reviewEvidence && ((value.practicePath === 'persona') !== (value.reviewEvidence.a3.status === 'not_applicable'))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['reviewEvidence'], message: 'Review evidence must respect the declared practice path' })
  }
  const day = pendingDay(value)
  if (value.adjustment && (day !== value.adjustment.dayNumber || value.completedDays.includes(day))) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['adjustment'], message: 'Adjustment must belong to the exact pending canonical day' })
  }
  if (day === null && value.sources.some(source => source.id === 'adjustment')) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['sources'], message: 'An adjustment is relevant only to a pending practice day' })
  }
})
export type A2PlanContextProjection = z.infer<typeof a2PlanContextProjectionSchema>

function pendingDay(projection: { next: { href?: string }; activeHorizon?: number }): number | null {
  if (typeof projection.activeHorizon !== 'number' || ![30, 60, 90].includes(projection.activeHorizon)) return null
  const match = /^\/despega\/a2\/dia-([1-9]\d?)$/.exec(projection.next.href || '')
  return match && Number(match[1]) <= projection.activeHorizon ? Number(match[1]) : null
}

/** Availability of a validated projection, shared by construction and storage reads. */
export function a2PlanProjectionAvailable(projection: A2PlanContextProjection): boolean {
  if (projection.sources.some(source => source.status === 'unavailable')) return false
  if (projection.reviewEvidence && !a2ReviewEvidenceAvailable(projection.reviewEvidence)) return false
  // Absence of a relevant read is not the same as a verified missing row.
  if (projection.practicePath !== 'persona' && !projection.sources.some(source => source.id === 'objective')) return false
  if (pendingDay(projection) !== null && !projection.sources.some(source => source.id === 'adjustment')) return false
  return true
}

/** A detached minimal projection, never a read, write or permission decision. */
export function buildA2PlanContextProjection(flow: JourneyFlow, guidance: GuidedNextAction, reviewEvidence?: A2ReviewEvidence):
  { projection: A2PlanContextProjection; available: boolean } {
  const checked = a2PlanGuidanceSchema.parse(guidance)
  const action = a2PlanCanonicalActionSchema.parse(flow.next)
  if ((['href', 'label', 'title', 'description'] as const).some(key => action[key] !== checked.action[key])) {
    throw new TypeError('Plan guidance does not match the canonical journey')
  }
  if (!Array.isArray(flow.completedDays)) throw new TypeError('Plan progress is unavailable')
  const completedDays = z.array(z.number().int().min(1).max(90)).max(90).parse(flow.completedDays)
  const sourceOrder = ['journey', 'objective', 'adjustment']
  const projection = a2PlanContextProjectionSchema.parse({
    practicePath: flow.practicePath, activeHorizon: flow.activeHorizon, next: action,
    completedDays: [...new Set(completedDays)].sort((a, b) => a - b),
    checkpointPending: flow.checkpointPending, radarAvailable: flow.radarAvailable,
    objective: checked.objective || null, adjustment: checked.adjustment || null,
    sources: [...checked.sources].sort((a, b) => sourceOrder.indexOf(a.id) - sourceOrder.indexOf(b.id)),
    limitations: checked.limitations,
    ...(reviewEvidence === undefined ? {} : { reviewEvidence }),
  })
  if (projection.adjustment && (flow.onboardingPath !== '/despega/a2' || flow.resumeDay !== projection.adjustment.dayNumber)) {
    throw new TypeError('Plan adjustment does not match the canonical pending day')
  }
  return { projection, available: a2PlanProjectionAvailable(projection) }
}

export const a2PlanContextSnapshotSchema = z.object({
  version: z.literal(A2_PLAN_CONTEXT_VERSION), capturedAt: a2PlanInstantSchema,
  hash, available: z.boolean(), projection: a2PlanContextProjectionSchema,
}).strict().superRefine((value, ctx) => {
  if (value.available && !a2PlanProjectionAvailable(value.projection)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['available'], message: 'An incomplete context cannot be declared available' })
  }
})
export type A2PlanContextSnapshot = z.infer<typeof a2PlanContextSnapshotSchema>

export function a2PlanCanComplete(content: A2PlanContent): boolean {
  return content.steps.length > 0 && content.steps.every(step => step.status !== 'pending')
    && content.steps.some(step => step.status === 'reported_done')
}

export const a2ReviewedPlanSchema = z.object({
  id: uuid, revision, state: z.enum(A2_PLAN_STATES), content: a2PlanContentSchema,
  contextSnapshot: a2PlanContextSnapshotSchema,
  createdAt: a2PlanInstantSchema, updatedAt: a2PlanInstantSchema, confirmedAt: a2PlanInstantSchema,
}).strict().superRefine((value, ctx) => {
  if (Date.parse(value.createdAt) > Date.parse(value.confirmedAt) || Date.parse(value.confirmedAt) > Date.parse(value.updatedAt)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Plan timestamps are out of order' })
  }
  if (value.state === 'completed' && !a2PlanCanComplete(value.content)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['state'], message: 'Completion requires declared finished steps' })
  }
})
export type A2ReviewedPlan = z.infer<typeof a2ReviewedPlanSchema>

export const a2PlanFreshnessSchema = z.object({
  status: z.enum(['none', 'current', 'changed', 'unavailable', 'expired']),
  reasons: z.array(z.string().min(1).max(100)).max(8),
}).strict()
export type A2PlanFreshness = z.infer<typeof a2PlanFreshnessSchema>

/** A dated comparison, not atomicity with independent writes to source tables. */
export function assessA2PlanFreshness(
  plan: A2ReviewedPlan | null, currentContext: A2PlanContextSnapshot | null, today: string,
): A2PlanFreshness {
  if (plan === null) return { status: 'none', reasons: ['no_saved_plan'] }
  const saved = a2ReviewedPlanSchema.safeParse(plan)
  if (!saved.success) return { status: 'unavailable', reasons: ['saved_plan_invalid'] }
  if (!isA2PlanCalendarDate(today)) return { status: 'unavailable', reasons: ['clock_unavailable'] }
  if (saved.data.content.reviewDate < today) return { status: 'expired', reasons: ['review_date_passed'] }
  const current = a2PlanContextSnapshotSchema.safeParse(currentContext)
  if (!current.success || !current.data.available || !saved.data.contextSnapshot.available) {
    return { status: 'unavailable', reasons: ['context_unavailable'] }
  }
  return saved.data.contextSnapshot.hash === current.data.hash
    ? { status: 'current', reasons: [] }
    : { status: 'changed', reasons: ['context_changed'] }
}

const commandBase = {
  version: z.literal(A2_PLAN_COMMAND_VERSION), requestId: uuid,
  expectedRevision: z.number().int().min(0).max(2_147_483_647),
}
export const a2PlanCommandSchema = z.discriminatedUnion('operation', [
  z.object({ ...commandBase, operation: z.literal('save'), content: a2PlanContentSchema, expectedContextHash: hash }).strict(),
  z.object({ ...commandBase, operation: z.literal('resume'), expectedContextHash: hash }).strict(),
  z.object({ ...commandBase, operation: z.literal('pause') }).strict(),
  z.object({ ...commandBase, operation: z.literal('complete') }).strict(),
  z.object({ ...commandBase, operation: z.literal('cancel') }).strict(),
  z.object({ ...commandBase, operation: z.literal('delete') }).strict(),
])
export type A2PlanCommand = z.infer<typeof a2PlanCommandSchema>

export type A2PlanTransitionFailure = 'plan_command_invalid' | 'plan_not_found' | 'plan_transition_invalid'
  | 'plan_incomplete' | 'plan_context_changed' | 'plan_context_unavailable' | 'plan_expired' | 'plan_review_date_invalid'

/** State/date rules only. Owner, receipt replay and atomic CAS belong to the server. */
export function validateA2PlanTransition(
  plan: A2ReviewedPlan | null, command: A2PlanCommand, freshness: A2PlanFreshness, today: string,
): { ok: true } | { ok: false; code: A2PlanTransitionFailure } {
  const checked = a2PlanCommandSchema.safeParse(command)
  if (!checked.success) return { ok: false, code: 'plan_command_invalid' }
  const input = checked.data
  if (input.operation === 'save') return validateA2PlanReviewDate(input.content.reviewDate, today)
  const saved = a2ReviewedPlanSchema.safeParse(plan)
  if (!saved.success) return { ok: false, code: 'plan_not_found' }
  if (input.operation === 'delete') return { ok: true }
  const state = saved.data.state
  if (input.operation === 'pause') return state === 'active' ? { ok: true } : { ok: false, code: 'plan_transition_invalid' }
  if (input.operation === 'cancel') return state === 'active' || state === 'paused'
    ? { ok: true } : { ok: false, code: 'plan_transition_invalid' }
  if (input.operation === 'complete') {
    if (state !== 'active' && state !== 'paused') return { ok: false, code: 'plan_transition_invalid' }
    return a2PlanCanComplete(saved.data.content) ? { ok: true } : { ok: false, code: 'plan_incomplete' }
  }
  if (state !== 'paused') return { ok: false, code: 'plan_transition_invalid' }
  const date = validateA2PlanReviewDate(saved.data.content.reviewDate, today)
  if (!date.ok) return date
  const current = a2PlanFreshnessSchema.safeParse(freshness)
  if (!current.success || current.data.status === 'unavailable' || current.data.status === 'none') {
    return { ok: false, code: 'plan_context_unavailable' }
  }
  if (current.data.status === 'expired') return { ok: false, code: 'plan_expired' }
  if (current.data.status !== 'current') return { ok: false, code: 'plan_context_changed' }
  return { ok: true }
}

export const a2PlanReceiptSchema = z.object({
  requestId: uuid, planId: uuid, revision, state: z.enum([...A2_PLAN_STATES, 'deleted']),
  committedAt: a2PlanInstantSchema, replayed: z.boolean(),
}).strict()
export type A2PlanReceipt = z.infer<typeof a2PlanReceiptSchema>

const planViewBase = z.object({
  version: z.literal(A2_PLAN_VIEW_VERSION), revision: z.number().int().min(0).max(2_147_483_647),
  plan: a2ReviewedPlanSchema.nullable(), context: a2PlanContextSnapshotSchema.nullable(),
  freshness: a2PlanFreshnessSchema, guidance: a2PlanGuidanceSchema.nullable(),
}).strict()
function validateView(value: z.infer<typeof planViewBase>, ctx: z.RefinementCtx) {
  const issue = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message })
  if (value.plan && value.plan.revision !== value.revision) issue('Plan and slot revisions must match')
  if ((value.plan === null) !== (value.freshness.status === 'none')) issue('Freshness must describe the actual saved plan')
  if (value.freshness.status === 'current' && (!value.context?.available || !value.plan?.contextSnapshot.available
    || value.context.hash !== value.plan.contextSnapshot.hash)) issue('Current freshness requires matching available contexts')
  if (value.context && value.guidance && (['href', 'label', 'title', 'description'] as const)
    .some(key => value.context!.projection.next[key] !== value.guidance!.action[key])) issue('Context and current guidance must agree')
}
export const a2PlanViewSchema = planViewBase.superRefine(validateView)
export type A2PlanView = z.infer<typeof a2PlanViewSchema>
export const a2PlanMutationResponseSchema = planViewBase.extend({ receipt: a2PlanReceiptSchema }).strict()
  .superRefine((value, ctx) => {
    validateView(value, ctx)
    if (value.receipt.revision > value.revision || (value.plan && value.plan.id !== value.receipt.planId)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['receipt'], message: 'Receipt must belong to the current owner slot' })
    }
  })
export type A2PlanMutationResponse = z.infer<typeof a2PlanMutationResponseSchema>

const UUID_IN_TEXT = /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi
const URL_IN_TEXT = /(?:\b[a-z][a-z0-9+.-]*:\/\/|www\.|\/\/)[^\s<>()]+|\b(?:mailto|javascript|data):[^\s<>()]+|\/despega(?:\/[^\s<>()]+)?/gi
function memoryText(value: string, maximum: number): string {
  return value.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1 [enlace omitido]')
    .replace(URL_IN_TEXT, '[enlace omitido]').replace(UUID_IN_TEXT, '[identificador omitido]')
    .slice(0, maximum).replace(/[\uD800-\uDBFF]$/, '').trim()
}
const cleanMemoryText = (maximum: number, minimum = 1) => boundedText(maximum, minimum)
  .refine(value => memoryText(value, maximum) === value, 'Model memory cannot contain URLs or identifiers')

export const a2PlanModelMemorySchema = z.object({
  version: z.literal(A2_PLAN_MEMORY_VERSION), kind: z.literal('reviewed_user_intentions'), revision,
  purpose: cleanMemoryText(500), constraints: cleanMemoryText(1_000, 0), reviewDate: a2PlanDateSchema,
  steps: z.array(z.object({
    position: z.number().int().min(1).max(5), title: cleanMemoryText(120), action: cleanMemoryText(600),
    status: z.enum(A2_PLAN_STEP_STATES), note: cleanMemoryText(300, 0).optional(),
  }).strict()).min(1).max(5),
  completionMeaning: z.literal('user_declaration_only'),
}).strict().superRefine((value, ctx) => {
  if (value.steps.some((step, index) => step.position !== index + 1)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['steps'], message: 'Step positions must preserve the reviewed order' })
  }
})
export type A2PlanModelMemory = z.infer<typeof a2PlanModelMemorySchema>
export type A2PlanMemory = A2PlanModelMemory

/** A plan remains a declared intention; this helper never makes evidence of ability. */
export function buildA2PlanModelMemory(plan: A2ReviewedPlan | null, freshness: A2PlanFreshness): A2PlanModelMemory | null {
  const saved = a2ReviewedPlanSchema.safeParse(plan)
  const current = a2PlanFreshnessSchema.safeParse(freshness)
  if (!saved.success || saved.data.state !== 'active' || !current.success || current.data.status !== 'current'
    || !saved.data.contextSnapshot.available) return null
  const value = saved.data
  return a2PlanModelMemorySchema.parse({
    version: A2_PLAN_MEMORY_VERSION, kind: 'reviewed_user_intentions', revision: value.revision,
    purpose: memoryText(value.content.purpose, 500), constraints: memoryText(value.content.constraints, 1_000),
    reviewDate: value.content.reviewDate,
    steps: value.content.steps.map((step, index) => ({
      position: index + 1, title: memoryText(step.title, 120), action: memoryText(step.action, 600), status: step.status,
      ...(step.note === undefined ? {} : { note: memoryText(step.note, 300) }),
    })),
    completionMeaning: 'user_declaration_only',
  })
}
export const a2PlanMemoryForAssistant = buildA2PlanModelMemory

export const a2PlanAssistantEvidenceSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('available'), memory: a2PlanModelMemorySchema }).strict(),
  z.object({ status: z.enum(['missing', 'inactive', 'changed', 'expired', 'unavailable']), memory: z.null() }).strict(),
])
export type A2PlanAssistantEvidence = z.infer<typeof a2PlanAssistantEvidenceSchema>
