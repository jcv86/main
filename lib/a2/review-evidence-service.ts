import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { JourneyFlow } from '@/lib/journey/flow'
import { savedCaptureFromRow } from '@/lib/outcomes/response-history'
import { isRecord } from '@/lib/outcomes/response-capture'
import {
  A2_REVIEW_EVIDENCE_VERSION, a2ReviewEvidenceSchema, a2ReviewCaptureHistorySchema, a2ReviewDecisionSchema,
  canonicalA2ReviewInstant, a2ReviewPairStatus, type A2ReviewEvidence, type A2ReviewCapture,
} from './review-evidence-contract'

export const A2_REVIEW_CAPTURE_SELECT = 'id,user_id,stage,outcome_key,measurement_role,instrument_key,instrument_version,response_payload,observed_at,score,score_scale_min,score_scale_max,confidence,dimensions'
export const A2_REVIEW_DECISION_SELECT = 'id,user_id,signal_id,decision,rationale,expected_evidence,status,review_on,outcome,reviewed_at,review_classification,external_outcomes,created_at,updated_at'
export const A2_REVIEW_READ_TIMEOUT_MS = 8_000
const EMPTY_A3 = { status: 'unavailable' as const, history: null }
const EMPTY_A4 = { status: 'unavailable' as const, nextReview: null, latestReview: null }

async function verifyActor(client: SupabaseClient, actorId: string): Promise<void> {
  let resolved: Awaited<ReturnType<SupabaseClient['auth']['getUser']>>
  try { resolved = await client.auth.getUser() } catch { throw new Error('a2_review_session_unavailable') }
  if (resolved.error) throw new Error('a2_review_session_unavailable')
  if (!actorId || !resolved.data.user || resolved.data.user.id !== actorId) throw new Error('a2_review_session_changed')
}

function notFuture(value: string, now: Date): boolean {
  // The capture API already permits one second of clock skew. Keep precision
  // when comparing refs: Date.parse alone would erase a microsecond revision.
  const maximum = canonicalA2ReviewInstant(new Date(now.getTime() + 1_000).toISOString())
  return maximum !== null && value <= maximum
}

function captureFromRow(value: unknown, actorId: string, role: 'baseline' | 'follow_up', now: Date): A2ReviewCapture | null {
  if (value === null) return null
  if (!isRecord(value) || value.user_id !== actorId || value.stage !== 'a3'
    || value.score !== null || value.score_scale_min !== null || value.score_scale_max !== null || value.confidence !== null
    || !isRecord(value.dimensions) || Object.keys(value.dimensions).length !== 0) throw new Error('a2_review_capture_invalid')
  const capture = savedCaptureFromRow(value, 'a3_structured_interview', role, now)
  const observedAt = canonicalA2ReviewInstant(capture?.observedAt)
  if (!capture || !observedAt || !notFuture(observedAt, now)) throw new Error('a2_review_capture_invalid')
  return { ...capture, observedAt } as A2ReviewCapture
}

async function readCaptures(client: SupabaseClient, actorId: string, now: Date, signal: AbortSignal): Promise<A2ReviewEvidence['a3']> {
  try {
    const read = (role: 'baseline' | 'follow_up') => client.from('dtc_outcome_observations').select(A2_REVIEW_CAPTURE_SELECT)
      .eq('user_id', actorId).eq('stage', 'a3').eq('outcome_key', 'interview_capability')
      .eq('instrument_key', 'a3_structured_interview').eq('instrument_version', '2-capture')
      .eq('measurement_role', role).order('observed_at', { ascending: false }).order('id', { ascending: false })
      .limit(1).abortSignal(signal).maybeSingle()
    const [initial, follow] = await Promise.all([read('baseline'), read('follow_up')])
    if (initial.error || follow.error) throw new Error('a2_review_capture_unavailable')
    const baseline = captureFromRow(initial.data, actorId, 'baseline', now)
    const followUp = captureFromRow(follow.data, actorId, 'follow_up', now)
    const history = a2ReviewCaptureHistorySchema.parse({
      instrumentKey: 'a3_structured_interview', instrumentVersion: '2-capture', baseline, followUp,
      pairStatus: a2ReviewPairStatus(baseline, followUp), evaluationStatus: 'not_evaluated', comparable: false,
    })
    return { status: baseline || followUp ? 'available' : 'missing', history }
  } catch { return { ...EMPTY_A3 } }
}

function decisionFromRow(value: unknown, actorId: string, closed: boolean, now: Date) {
  if (value === null) return null
  if (!isRecord(value) || value.user_id !== actorId) throw new Error('a2_review_decision_invalid')
  const decision = a2ReviewDecisionSchema.parse({
    id: value.id, signalId: value.signal_id, decision: value.decision, rationale: value.rationale,
    expectedEvidence: value.expected_evidence, status: value.status, reviewOn: value.review_on,
    outcome: value.outcome, reviewedAt: value.reviewed_at, reviewClassification: value.review_classification,
    externalOutcomes: value.external_outcomes, createdAt: value.created_at, updatedAt: value.updated_at,
  })
  if (closed !== ['reviewed', 'discarded'].includes(decision.status)
    || !notFuture(decision.createdAt, now) || !notFuture(decision.updatedAt, now)
    || (decision.reviewedAt && !notFuture(decision.reviewedAt, now))) throw new Error('a2_review_decision_invalid')
  return decision
}

async function readDecisions(client: SupabaseClient, actorId: string, now: Date, signal: AbortSignal): Promise<A2ReviewEvidence['a4']> {
  try {
    const [open, closed] = await Promise.all([
      client.from('a4_decision_log').select(A2_REVIEW_DECISION_SELECT).eq('user_id', actorId)
        .in('status', ['watching', 'testing', 'committed']).order('review_on', { ascending: true })
        .order('created_at', { ascending: true }).order('id', { ascending: true }).limit(1).abortSignal(signal).maybeSingle(),
      client.from('a4_decision_log').select(A2_REVIEW_DECISION_SELECT).eq('user_id', actorId)
        .in('status', ['reviewed', 'discarded']).order('reviewed_at', { ascending: false, nullsFirst: false })
        .order('updated_at', { ascending: false }).order('id', { ascending: false }).limit(1).abortSignal(signal).maybeSingle(),
    ])
    if (open.error || closed.error) throw new Error('a2_review_decision_unavailable')
    const nextReview = decisionFromRow(open.data, actorId, false, now)
    const latestReview = decisionFromRow(closed.data, actorId, true, now)
    if (nextReview && latestReview && nextReview.id === latestReview.id) throw new Error('a2_review_decision_changed_during_read')
    return { status: nextReview || latestReview ? 'available' : 'missing', nextReview, latestReview }
  } catch { return { ...EMPTY_A4 } }
}

/**
 * Four bounded SELECTs at most, through the already authenticated owner's RLS.
 * A source failure is explicit; an identity failure rejects the entire read.
 * These are dated separate reads, not a transaction across A3/A4 and the plan.
 */
export async function readA2ReviewEvidence(
  client: SupabaseClient, actorId: string, flow: JourneyFlow, access: { a3: boolean; a4: boolean }, now = new Date(),
): Promise<A2ReviewEvidence> {
  await verifyActor(client, actorId)
  if (!Number.isFinite(now.getTime())) throw new Error('a2_review_clock_unavailable')
  const personal = flow.practicePath === 'persona'
  const signal = AbortSignal.timeout(A2_REVIEW_READ_TIMEOUT_MS)
  const [a3, a4] = await Promise.all([
    personal ? Promise.resolve({ status: 'not_applicable' as const, history: null })
      : access.a3 !== true ? Promise.resolve({ status: 'locked' as const, history: null })
        : readCaptures(client, actorId, now, signal),
    personal ? Promise.resolve({ status: 'not_applicable' as const, nextReview: null, latestReview: null })
      : access.a4 !== true || !flow.radarAvailable ? Promise.resolve({ status: 'locked' as const, nextReview: null, latestReview: null })
        : readDecisions(client, actorId, now, signal),
  ])
  await verifyActor(client, actorId)
  return a2ReviewEvidenceSchema.parse({ version: A2_REVIEW_EVIDENCE_VERSION, a3, a4 })
}
