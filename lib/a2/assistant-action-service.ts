import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { a2ActionStoredContent, a2ActionAdjustmentSchema,
  type A2ActionCommand, type A2ActionReceipt, type A2ActionResult } from './assistant-action-contract'
import { a2PlanInstantSchema } from './plan-contract'
import { canonicalPlanJson } from './plan-context'

export const A2_ACTION_DOCUMENT_SELECT = 'id,user_id,title,type,source_module,related_day,source,status,content,created_at'

/** Normalize the timezone without truncating PostgreSQL's fractional seconds. */
function preciseInstantKey(value: unknown): string | null {
  const parsed = a2PlanInstantSchema.safeParse(value)
  if (!parsed.success) return null
  const parts = /^(.+?)(?:\.(\d+))?(Z|[+-]\d{2}:\d{2})$/.exec(parsed.data)
  if (!parts) return null
  // Date only sees the whole second; the fraction stays decimal text. Removing
  // trailing zeroes accepts equivalent precision without losing microseconds.
  const wholeSecond = Date.parse(`${parts[1]}${parts[3]}`)
  if (!Number.isFinite(wholeSecond)) return null
  return `${wholeSecond}:${(parts[2] ?? '').replace(/0+$/, '')}`
}

/** A receipt proves a past commit. This SELECT separately observes its current owner-bound effect. */
export async function readA2ActionEffect(
  client: SupabaseClient, userId: string, command: A2ActionCommand, receipt: A2ActionReceipt,
): Promise<Pick<A2ActionResult, 'effect' | 'adjustment'>> {
  // Do not filter by type/day: an existing document with changed metadata must be
  // reported as changed, not incorrectly classified as removed.
  const { data, error } = await client.from('dtc_documents').select(A2_ACTION_DOCUMENT_SELECT)
    .eq('user_id', userId).eq('id', receipt.documentId).maybeSingle()
  if (error) throw new Error('a2_action_effect_unavailable')
  if (data === null) return { effect: 'removed', adjustment: null }
  if (!data || typeof data !== 'object' || data.user_id !== userId || data.id !== receipt.documentId) {
    throw new Error('a2_action_effect_unavailable')
  }
  let content: unknown
  try { content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content }
  catch { return { effect: 'changed', adjustment: null } }
  const instant = preciseInstantKey(data.created_at)
  const present = data.title === `Ajuste de práctica · Día ${command.dayNumber}`
    && data.type === 'a2_practice_adjustment' && data.source_module === 'a2'
    && data.related_day === command.dayNumber && data.source === 'user' && data.status === 'draft'
    && instant !== null && instant === preciseInstantKey(receipt.committedAt)
    && canonicalPlanJson(content) === canonicalPlanJson(a2ActionStoredContent(command))
  return present
    ? { effect: 'present', adjustment: a2ActionAdjustmentSchema.parse(command.adjustment) }
    : { effect: 'changed', adjustment: null }
}
