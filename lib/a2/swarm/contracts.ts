import { z } from 'zod'
import type { A2A1Evidence, A2AssistantRequest } from '../assistant-contract'
import type { JourneyFlow } from '../../journey/flow'
import type { GuidedNextAction } from '../../journey/next-action'
import type { A2PlanAssistantEvidence } from '../plan-contract'
import { a2ActionDraftSchema, type A2ActionDraft } from '../assistant-action-contract'

export const A2_SWARM_VERSION = 'dtc-a2-swarm.v1' as const
export const A2_SWARM_MAX_CALLS = 3
export const A2_SWARM_BUDGET_MS = 12_000
export const A2_SWARM_MAX_INPUT_CHARACTERS = 24_000
export const A2_SWARM_MAX_MODEL_JSON_CHARACTERS = 8_000
export const A2_SWARM_OUTPUT_LIMITS = { sofia: 350, dani: 350, reviewer: 600 } as const

export const SWARM_AGENTS = ['sofia', 'dani', 'reviewer'] as const
export type SwarmAgent = (typeof SWARM_AGENTS)[number]
export const SWARM_SOURCE_IDS = ['journey', 'objective', 'adjustment', 'a1', 'current_message', 'conversation', 'reviewed_plan'] as const
export type SwarmSourceId = (typeof SWARM_SOURCE_IDS)[number]

const evidenceRefs = z.array(z.enum(SWARM_SOURCE_IDS)).min(1).max(SWARM_SOURCE_IDS.length)
  .refine((refs) => new Set(refs).size === refs.length, 'Duplicate source reference')

export const sofiaOutputSchema = z.object({
  agent: z.literal('sofia'),
  understanding: z.string().trim().min(1).max(700),
  need: z.enum(['act', 'clarify']),
  clarification: z.string().trim().min(1).max(300).nullable(),
  evidenceRefs,
  limitations: z.array(z.string().trim().min(1).max(180)).max(3),
}).strict().superRefine((value, ctx) => {
  if ((value.need === 'clarify') !== (value.clarification !== null)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['clarification'], message: 'Clarification must match need' })
  }
})

export const daniOutputSchema = z.object({
  agent: z.literal('dani'),
  kind: z.literal('proposal'),
  action: z.string().trim().min(1).max(700),
  reason: z.string().trim().min(1).max(400),
  canonicalNextHref: z.string().min(1).max(200),
  evidenceRefs,
  requiresUserReview: z.literal(true),
  adjustment: a2ActionDraftSchema.nullable().optional().default(null),
}).strict()

export const reviewerOutputSchema = z.object({
  agent: z.literal('reviewer'),
  decision: z.enum(['accept', 'clarify', 'reject']),
  response: z.string().trim().max(1_800),
  canonicalNextHref: z.string().min(1).max(200),
  evidenceRefs,
  reason: z.enum(['grounded', 'needs_clarification', 'inconsistent', 'unsupported']),
  proposalOnly: z.literal(true),
  adjustment: a2ActionDraftSchema.nullable().optional().default(null),
}).strict().superRefine((value, ctx) => {
  const valid = value.decision === 'accept'
    ? value.reason === 'grounded' && value.response.length > 0
    : value.decision === 'clarify'
      ? value.reason === 'needs_clarification' && value.response.length > 0
      : value.reason === 'inconsistent' || value.reason === 'unsupported'
  if (!valid) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Decision and reason do not match' })
})

export type SofiaOutput = z.infer<typeof sofiaOutputSchema>
export type DaniOutput = z.infer<typeof daniOutputSchema>
export type ReviewerOutput = z.infer<typeof reviewerOutputSchema>

const referenceJson = { type: 'array', items: { type: 'string', enum: [...SWARM_SOURCE_IDS] } }
function objectSchema(properties: Record<string, unknown>): Record<string, unknown> {
  return { type: 'object', additionalProperties: false, properties, required: Object.keys(properties) }
}
const adjustmentJson = { anyOf: [
  objectSchema({
    outcome: { type: 'string', enum: ['could_not', 'change'] },
    barrier: { type: 'string', enum: ['time', 'unclear', 'resources', 'energy', 'goal_changed', 'other'] },
    retainedWork: { type: 'string' }, nextAction: { type: 'string' },
  }),
  { type: 'null' },
] }

/** Provider schema narrows the shape; local validators remain authoritative. */
export const SWARM_OUTPUT_SCHEMAS: Record<SwarmAgent, { name: string; schema: Record<string, unknown> }> = {
  sofia: {
    name: 'dtc_sofia_understanding_v1',
    schema: objectSchema({
      agent: { type: 'string', enum: ['sofia'] },
      understanding: { type: 'string' },
      need: { type: 'string', enum: ['act', 'clarify'] },
      clarification: { type: ['string', 'null'] },
      evidenceRefs: referenceJson,
      limitations: { type: 'array', items: { type: 'string' } },
    }),
  },
  dani: {
    name: 'dtc_dani_proposal_v2',
    schema: objectSchema({
      agent: { type: 'string', enum: ['dani'] },
      kind: { type: 'string', enum: ['proposal'] },
      action: { type: 'string' },
      reason: { type: 'string' },
      canonicalNextHref: { type: 'string' },
      evidenceRefs: referenceJson,
      requiresUserReview: { type: 'boolean', enum: [true] },
      adjustment: adjustmentJson,
    }),
  },
  reviewer: {
    name: 'dtc_swarm_review_v2',
    schema: objectSchema({
      agent: { type: 'string', enum: ['reviewer'] },
      decision: { type: 'string', enum: ['accept', 'clarify', 'reject'] },
      response: { type: 'string' },
      canonicalNextHref: { type: 'string' },
      evidenceRefs: referenceJson,
      reason: { type: 'string', enum: ['grounded', 'needs_clarification', 'inconsistent', 'unsupported'] },
      proposalOnly: { type: 'boolean', enum: [true] },
      adjustment: adjustmentJson,
    }),
  },
}

export interface SwarmInput {
  request: A2AssistantRequest
  flow: JourneyFlow
  guidance: GuidedNextAction
  a1: A2A1Evidence
  plan?: A2PlanAssistantEvidence
}
export interface SwarmMessage { role: 'system' | 'user' | 'assistant'; content: string }
export interface SwarmCompletionRequest {
  agent: SwarmAgent
  messages: SwarmMessage[]
  outputSchema: { name: string; schema: Record<string, unknown> }
  maxOutputTokens: number
  signal: AbortSignal
}
export type SwarmComplete = (request: SwarmCompletionRequest) => Promise<unknown>
export type SwarmFailure = 'invalid_input' | 'invalid_output' | 'evidence_mismatch'
  | 'navigation_mismatch' | 'policy_violation' | 'provider_unavailable' | 'provider_failed'
  | 'deadline_exceeded' | 'aborted' | 'review_rejected' | 'coordination_failed'

/** Only operational categories/counts leave the runtime; no source or actor IDs. */
export interface SwarmTrace {
  version: typeof A2_SWARM_VERSION
  callsStarted: number
  completedAgents: number
  elapsedMs: number
  failureStage: SwarmAgent | 'input' | 'coordinator' | null
  terminal: 'accepted' | 'clarified' | 'fallback'
}
export type SwarmResult =
  | { ok: true; response: string; trace: SwarmTrace; adjustment?: A2ActionDraft }
  | { ok: false; reason: SwarmFailure; trace: SwarmTrace }

/** Errors contain a closed category only, never provider bodies or user text. */
export class SwarmCompletionError extends Error {
  constructor(public readonly code: 'provider_unavailable' | 'provider_failed' | 'invalid_output' | 'invalid_input') {
    super(code)
    this.name = 'SwarmCompletionError'
  }
}
