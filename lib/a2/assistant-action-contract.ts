import { z } from 'zod'
import { A2_BARRIERS } from './practice-adjustment'
import { a2PlanContextSnapshotSchema, a2PlanDateSchema, a2PlanGuidanceSchema, a2PlanInstantSchema } from './plan-contract'

export const A2_ACTION_TOOL = 'save_practice_adjustment' as const
export const A2_ACTION_ACTOR_HEADER = 'X-DTC-Action-Actor'
export const A2_ACTION_EXPECTED_ACTOR_HEADER = 'X-DTC-Expected-Action-Actor'
export const A2_ACTION_MAX_BODY_BYTES = 16_000

function storedText(min: number, max: number) {
  return z.string().trim().min(min).max(max).refine(value => {
    if (value.includes('\u0000')) return false
    for (let i = 0; i < value.length; i++) {
      const unit = value.charCodeAt(i)
      if (unit >= 0xd800 && unit <= 0xdbff) {
        const next = value.charCodeAt(++i)
        if (!(next >= 0xdc00 && next <= 0xdfff)) return false
      } else if (unit >= 0xdc00 && unit <= 0xdfff) return false
    }
    return true
  }, 'Use valid storable Unicode text')
}

const day = z.number().int().min(1).max(90)
const hash = z.string().regex(/^[0-9a-f]{64}$/)
const uuid = z.uuid().transform(value => value.toLowerCase())
const outcome = z.enum(['could_not', 'change'])
const barrier = z.enum(['time', 'unclear', 'resources', 'energy', 'goal_changed', 'other'])

/** A model may leave retained work blank; only the person can confirm it. */
export const a2ActionDraftSchema = z.object({
  outcome, barrier, retainedWork: storedText(0, 4_000), nextAction: storedText(1, 2_000),
}).strict()
export type A2ActionDraft = z.infer<typeof a2ActionDraftSchema>

export const a2ActionAdjustmentSchema = z.object({
  outcome, barrier, retainedWork: storedText(1, 4_000), nextAction: storedText(1, 2_000), reviewDate: a2PlanDateSchema,
}).strict()
export type A2ActionAdjustment = z.infer<typeof a2ActionAdjustmentSchema>

export const a2ActionProposalSchema = z.object({
  version: z.literal('dtc-a2-action-proposal.v1'), tool: z.literal(A2_ACTION_TOOL),
  dayNumber: day, expectedContextHash: hash, draft: a2ActionDraftSchema,
}).strict()
export type A2ActionProposal = z.infer<typeof a2ActionProposalSchema>

export const a2ActionCommandSchema = z.object({
  version: z.literal('dtc-a2-action-command.v1'), tool: z.literal(A2_ACTION_TOOL),
  requestId: uuid, dayNumber: day, expectedContextHash: hash, adjustment: a2ActionAdjustmentSchema,
}).strict()
export type A2ActionCommand = z.infer<typeof a2ActionCommandSchema>

export const a2ActionViewSchema = z.object({
  version: z.literal('dtc-a2-action-view.v1'), dayNumber: day.nullable(),
  context: a2PlanContextSnapshotSchema.nullable(), guidance: a2PlanGuidanceSchema.nullable(),
}).strict()
export type A2ActionView = z.infer<typeof a2ActionViewSchema>

export const a2ActionReceiptSchema = z.object({
  version: z.literal('dtc-a2-action-receipt.v1'), requestId: uuid, documentId: uuid,
  dayNumber: day, committedAt: a2PlanInstantSchema, replayed: z.boolean(),
}).strict()
export type A2ActionReceipt = z.infer<typeof a2ActionReceiptSchema>

/** A receipt proves the original commit; a fresh read separately proves its present effect. */
export const a2ActionResultSchema = z.object({
  version: z.literal('dtc-a2-action-result.v1'), receipt: a2ActionReceiptSchema,
  effect: z.enum(['present', 'changed', 'removed']), adjustment: a2ActionAdjustmentSchema.nullable(),
}).strict().superRefine((value, ctx) => {
  if ((value.effect === 'present') !== (value.adjustment !== null)) {
    ctx.addIssue({ code: 'custom', message: 'Only an exact current effect may return saved content' })
  }
})
export type A2ActionResult = z.infer<typeof a2ActionResultSchema>

export function a2ActionStoredContent(command: A2ActionCommand) {
  return { version: 1, dayNumber: command.dayNumber, ...command.adjustment,
    suggestion: A2_BARRIERS[command.adjustment.barrier].suggestion }
}

export function a2ActionResultMatchesCommand(result: A2ActionResult, command: A2ActionCommand): boolean {
  return result.receipt.requestId === command.requestId && result.receipt.dayNumber === command.dayNumber
    && (result.effect !== 'present' || JSON.stringify(result.adjustment) === JSON.stringify(command.adjustment))
}
