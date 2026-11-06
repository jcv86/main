import { z } from 'zod'
import { A2_SWARM_MAX_CALLS } from './contracts'

export const A2_SWARM_CANARY_EVIDENCE_VERSION = 'dtc-a2-swarm-canary-evidence.v1'
export const A2_SWARM_CANARY_POLICY_VERSION = 'dtc-a2-swarm-canary-policy.v1'

/** Initial product gates, not externally established efficacy thresholds. */
export const A2_SWARM_CANARY_POLICY = {
  minimumRequestsPerVariant: 20,
  minimumActorsPerVariant: 2,
  minimumWindowMs: 30 * 60_000,
  maximumEvidenceAgeMs: 24 * 60 * 60_000,
  maximumFailureRate: 0.05,
  maximumFailureRateIncrease: 0.02,
  maximumFallbackRate: 0.10,
  maximumP95LatencyMs: 20_000,
  maximumP95LatencyRatio: 1.5,
  maximumBaselineCallsPerRequest: 1,
  maximumSwarmAgentCallsPerRequest: A2_SWARM_MAX_CALLS,
  maximumSwarmCallsPerRequest: A2_SWARM_MAX_CALLS + 1,
} as const

const safeId = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/)
const count = z.number().int().min(0).max(10_000_000)

export const a2SwarmCanaryIdentitySchema = z.object({
  candidateSha: z.string().regex(/^[a-f0-9]{40}$/),
  deploymentId: z.string().regex(/^dpl_[A-Za-z0-9]{8,64}$/),
  rolloutId: safeId,
  configRevision: safeId,
}).strict()

export type A2SwarmCanaryIdentity = z.infer<typeof a2SwarmCanaryIdentitySchema>

const metrics = z.object({
  requests: count,
  distinctActors: count,
  failures: count,
  fallbacks: count,
  p95LatencyMs: z.number().finite().min(0).max(86_400_000),
  modelCalls: count,
  maximumCallsPerRequest: count,
}).strict().superRefine((value, ctx) => {
  if (value.distinctActors > value.requests || value.failures > value.requests || value.fallbacks > value.requests) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Counters cannot exceed assigned requests.' })
  }
  if (value.requests > 0 && (value.distinctActors === 0 || value.p95LatencyMs === 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Observed requests require actor and latency measurements.' })
  }
  if (value.requests === 0 && (value.modelCalls !== 0 || value.p95LatencyMs !== 0)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Empty cohorts cannot report provider usage or latency.' })
  }
  if (value.maximumCallsPerRequest > value.modelCalls
    || value.modelCalls > value.requests * value.maximumCallsPerRequest) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'The observed maximum must agree with the total calls.' })
  }
  // Every successful response requires a provider call. Failed requests can
  // legitimately stop before making any call, including a rejected input.
  if (value.modelCalls < value.requests - value.failures) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Successful responses cannot omit provider usage.' })
  }
})

export const a2SwarmCanaryEvidenceSchema = z.object({
  version: z.literal(A2_SWARM_CANARY_EVIDENCE_VERSION),
  source: z.enum(['live', 'synthetic']),
  identity: a2SwarmCanaryIdentitySchema,
  window: z.object({
    startedAt: z.string().datetime({ offset: true }),
    endedAt: z.string().datetime({ offset: true }),
  }).strict(),
  baseline: metrics,
  swarm: metrics,
  critical: z.object({
    authBoundary: count,
    crossUserContext: count,
    unconfirmedWrite: count,
    canonicalAction: count,
    dataLoss: count,
    callBudget: count,
  }).strict(),
}).strict().superRefine((value, ctx) => {
  if (value.baseline.fallbacks !== 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'The baseline variant does not initiate fallbacks.' })
  }
  const directSwarmSuccesses = Math.max(0, value.swarm.requests - value.swarm.failures - value.swarm.fallbacks)
  // A successful swarm needs all three agents. A fallback means the baseline
  // call actually started, even when that attempt also failed. A reason alone
  // (for example cancellation before fallback) is not a started fallback.
  const minimumSwarmCalls = directSwarmSuccesses * A2_SWARM_MAX_CALLS + value.swarm.fallbacks
  if (value.swarm.modelCalls < minimumSwarmCalls
    || (directSwarmSuccesses > 0 && value.swarm.maximumCallsPerRequest < A2_SWARM_MAX_CALLS)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Swarm successes and started fallbacks require their observed calls.' })
  }
})

export type A2SwarmCanaryEvidence = z.infer<typeof a2SwarmCanaryEvidenceSchema>

export type A2SwarmCanaryEvidenceVerdict = {
  decision: 'hold' | 'rollback' | 'eligible_for_review'
  reasons: string[]
  identity: A2SwarmCanaryIdentity | null
  policyVersion: typeof A2_SWARM_CANARY_POLICY_VERSION
}

/**
 * Read-only recommendation. Even source:live and eligible_for_review are not
 * approval or proof of provenance. Metrics must come from the exact deployment,
 * be independently checked, and receive a human usefulness/release review.
 *
 * Cohorts are grouped by ASSIGNED variant. A swarm request that falls back still
 * belongs to swarm; moving it into baseline would hide canary failures. Distinct
 * actor counts are supplied as aggregates, never logged with identifiers here.
 * modelCalls counts started calls, including failed/cancelled attempts. The
 * maximum is measured per request, not derived by rounding an average. A
 * fallback is counted only when the baseline call actually starts. Requests
 * are all terminal execution events in that assigned cohort; failures are all
 * outcomes other than completed/fallback_completed, including cancellations.
 * Latency is the same execution interval for both variants, including fallback.
 * These aggregates and their completeness require independent source review;
 * this evaluator does not produce telemetry or verify source:live provenance.
 */
export function evaluateA2SwarmCanaryEvidence(
  evidence: unknown,
  expectedIdentity: unknown,
  nowMs = Date.now(),
): A2SwarmCanaryEvidenceVerdict {
  const expected = a2SwarmCanaryIdentitySchema.safeParse(expectedIdentity)
  const verdict = (decision: A2SwarmCanaryEvidenceVerdict['decision'], reasons: string[]): A2SwarmCanaryEvidenceVerdict => ({
    decision,
    reasons,
    identity: expected.success ? expected.data : null,
    policyVersion: A2_SWARM_CANARY_POLICY_VERSION,
  })
  if (!expected.success) return verdict('hold', ['invalid_expected_identity'])
  if (!Number.isFinite(nowMs)) return verdict('hold', ['invalid_clock'])
  const parsed = a2SwarmCanaryEvidenceSchema.safeParse(evidence)
  if (!parsed.success) return verdict('hold', ['invalid_evidence'])
  const data = parsed.data
  const mismatches: string[] = []
  if (data.identity.candidateSha !== expected.data.candidateSha) mismatches.push('candidate_sha_mismatch')
  if (data.identity.deploymentId !== expected.data.deploymentId) mismatches.push('deployment_mismatch')
  if (data.identity.rolloutId !== expected.data.rolloutId) mismatches.push('rollout_mismatch')
  if (data.identity.configRevision !== expected.data.configRevision) mismatches.push('revision_mismatch')
  if (mismatches.length) return verdict('hold', mismatches)
  if (data.source !== 'live') return verdict('hold', ['synthetic_evidence'])

  const startedAt = Date.parse(data.window.startedAt)
  const endedAt = Date.parse(data.window.endedAt)
  if (!Number.isFinite(startedAt) || !Number.isFinite(endedAt) || endedAt < startedAt || endedAt > nowMs + 60_000) {
    return verdict('hold', ['invalid_observation_window'])
  }

  const criticalReasons = Object.entries(data.critical)
    .filter(([, value]) => value > 0)
    .map(([key]) => `critical_${key}`)
  const policy = A2_SWARM_CANARY_POLICY
  if (data.baseline.modelCalls > data.baseline.requests * policy.maximumBaselineCallsPerRequest
    || data.baseline.maximumCallsPerRequest > policy.maximumBaselineCallsPerRequest) {
    criticalReasons.push('baseline_call_budget')
  }
  const swarmMaximumTotal = data.swarm.requests * policy.maximumSwarmAgentCallsPerRequest + data.swarm.fallbacks
  if (data.swarm.modelCalls > swarmMaximumTotal
    || data.swarm.maximumCallsPerRequest > policy.maximumSwarmCallsPerRequest
    || (data.swarm.fallbacks === 0 && data.swarm.maximumCallsPerRequest > policy.maximumSwarmAgentCallsPerRequest)) {
    criticalReasons.push('swarm_call_budget')
  }
  if (criticalReasons.length) return verdict('rollback', criticalReasons)

  const holds: string[] = []
  if (endedAt - startedAt < policy.minimumWindowMs) holds.push('insufficient_observation_time')
  if (nowMs - endedAt > policy.maximumEvidenceAgeMs) holds.push('stale_evidence')
  if (data.baseline.requests < policy.minimumRequestsPerVariant) holds.push('insufficient_baseline_requests')
  if (data.swarm.requests < policy.minimumRequestsPerVariant) holds.push('insufficient_swarm_requests')
  if (data.baseline.distinctActors < policy.minimumActorsPerVariant) holds.push('insufficient_baseline_actors')
  if (data.swarm.distinctActors < policy.minimumActorsPerVariant) holds.push('insufficient_swarm_actors')
  if (holds.length) return verdict('hold', holds)

  const reasons: string[] = []
  const baselineFailureRate = data.baseline.failures / data.baseline.requests
  const swarmFailureRate = data.swarm.failures / data.swarm.requests
  if (swarmFailureRate > policy.maximumFailureRate) reasons.push('swarm_failure_rate')
  if (swarmFailureRate - baselineFailureRate > policy.maximumFailureRateIncrease + Number.EPSILON) {
    reasons.push('failure_rate_regression')
  }
  if (data.swarm.fallbacks / data.swarm.requests > policy.maximumFallbackRate) reasons.push('swarm_fallback_rate')
  if (data.swarm.p95LatencyMs > policy.maximumP95LatencyMs) reasons.push('swarm_latency_limit')
  if (data.swarm.p95LatencyMs > data.baseline.p95LatencyMs * policy.maximumP95LatencyRatio) reasons.push('latency_regression')
  if (reasons.length) return verdict('rollback', reasons)

  return verdict('eligible_for_review', ['technical_gates_met_human_review_required'])
}
