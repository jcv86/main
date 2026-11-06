import 'server-only'
import { createHash } from 'node:crypto'
import type { JourneyFlow } from '@/lib/journey/flow'
import type { GuidedNextAction } from '@/lib/journey/next-action'
import type { A2ReviewEvidence } from './review-evidence-contract'
import {
  a2PlanContextSnapshotSchema, buildA2PlanContextProjection, a2PlanProjectionAvailable,
  type A2PlanContextSnapshot,
} from './plan-contract'

/** A stable content fingerprint, not a lock or transaction over journey sources. */
export function canonicalPlanJson(value: unknown): string {
  if (value === undefined) return 'null'
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(canonicalPlanJson).join(',')}]`
  const record = value as Record<string, unknown>
  return `{${Object.keys(record).filter(key => record[key] !== undefined).sort().map(key => `${JSON.stringify(key)}:${canonicalPlanJson(record[key])}`).join(',')}}`
}

export function hashA2PlanProjection(projection: unknown): string {
  return createHash('sha256').update(canonicalPlanJson(projection), 'utf8').digest('hex')
}

export function makeA2PlanContextSnapshot(flow: JourneyFlow, guidance: GuidedNextAction, now = new Date(), reviewEvidence?: A2ReviewEvidence): A2PlanContextSnapshot {
  const { projection, available } = buildA2PlanContextProjection(flow, guidance, reviewEvidence)
  return a2PlanContextSnapshotSchema.parse({
    version: 'dtc-a2-plan-context.v1', capturedAt: now.toISOString(),
    hash: hashA2PlanProjection(projection), available, projection,
  })
}

export function readA2PlanContextSnapshot(value: unknown): A2PlanContextSnapshot {
  const snapshot = a2PlanContextSnapshotSchema.parse(value)
  if (snapshot.hash !== hashA2PlanProjection(snapshot.projection)) throw new Error('a2_plan_context_corrupt')
  const available = a2PlanProjectionAvailable(snapshot.projection)
  if (available !== snapshot.available) throw new Error('a2_plan_context_corrupt')
  return snapshot
}
