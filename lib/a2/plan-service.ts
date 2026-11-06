import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { JourneyFlow } from '@/lib/journey/flow'
import type { GuidedNextAction } from '@/lib/journey/next-action'
import type { A2ReviewEvidence } from './review-evidence-contract'
import {
  a2ReviewedPlanSchema, a2PlanToday, assessA2PlanFreshness, buildA2PlanModelMemory,
  type A2ReviewedPlan, type A2PlanAssistantEvidence,
} from './plan-contract'
import { makeA2PlanContextSnapshot, readA2PlanContextSnapshot } from './plan-context'

export const A2_PLAN_SELECT = 'user_id,plan_id,revision,status,content,context_snapshot,reviewed_at,review_date,created_at,updated_at,deleted_at'
export interface A2PlanSlot { revision: number; plan: A2ReviewedPlan | null }

/** Explicit owner filter plus session RLS. A failed or corrupt read is never empty. */
export async function readA2PlanSlot(client: SupabaseClient, userId: string): Promise<A2PlanSlot> {
  const { data, error } = await client.from('a2_reviewed_plans').select(A2_PLAN_SELECT)
    .eq('user_id', userId).maybeSingle()
  if (error) throw new Error('a2_plan_store_unavailable')
  if (data === null) return { revision: 0, plan: null }
  if (!data || typeof data !== 'object' || data.user_id !== userId
    || !Number.isSafeInteger(data.revision) || data.revision < 1) throw new Error('a2_plan_store_unavailable')
  if (data.status === 'deleted') {
    if (data.content !== null || data.context_snapshot !== null || data.review_date !== null
      || !data.deleted_at) throw new Error('a2_plan_store_unavailable')
    return { revision: data.revision, plan: null }
  }
  const contextSnapshot = readA2PlanContextSnapshot(data.context_snapshot)
  const plan = a2ReviewedPlanSchema.parse({
    id: data.plan_id, revision: data.revision, state: data.status,
    content: data.content, contextSnapshot,
    createdAt: data.created_at, updatedAt: data.updated_at, confirmedAt: data.reviewed_at,
  })
  if (data.review_date !== plan.content.reviewDate || data.deleted_at !== null) throw new Error('a2_plan_store_unavailable')
  return { revision: plan.revision, plan }
}

/** Plan memory is a reviewed intention. It cannot grant access or prove execution. */
export async function readA2PlanAssistantEvidence(
  client: SupabaseClient, actorId: string, flow: JourneyFlow, guidance: GuidedNextAction,
  now = new Date(), reviewEvidence?: A2ReviewEvidence,
): Promise<A2PlanAssistantEvidence> {
  try {
    const slot = await readA2PlanSlot(client, actorId)
    if (!slot.plan) return { status: 'missing', memory: null }
    if (slot.plan.state !== 'active') return { status: 'inactive', memory: null }
    const snapshot = makeA2PlanContextSnapshot(flow, guidance, now, reviewEvidence)
    const freshness = assessA2PlanFreshness(slot.plan, snapshot, a2PlanToday(now))
    const memory = buildA2PlanModelMemory(slot.plan, freshness)
    if (memory) return { status: 'available', memory }
    return { status: freshness.status === 'changed' || freshness.status === 'expired' ? freshness.status : 'unavailable', memory: null }
  } catch {
    return { status: 'unavailable', memory: null }
  }
}
