import 'server-only'

import type { createAdminClient } from '@/lib/supabase/server'

/** A temporary A4 permission is separate from journey completion and pilot membership. */
export async function hasActiveA4QaEntitlement(
  userId: string,
  supabase: ReturnType<typeof createAdminClient>,
  now = new Date(),
): Promise<boolean> {
  if (typeof userId !== 'string' || !userId.trim() || !Number.isFinite(now.getTime())) return false

  try {
    const { data, error } = await supabase
      .from('a4_qa_entitlements')
      .select('user_id,expires_at')
      .eq('user_id', userId)
      .gt('expires_at', now.toISOString())
      .maybeSingle()

    if (error || data?.user_id !== userId || typeof data.expires_at !== 'string') return false
    const expiresAt = Date.parse(data.expires_at)
    if (!Number.isFinite(expiresAt) || expiresAt <= now.getTime()) return false

    // Read the existing membership only. The pilot resolver may create one.
    const membership = await supabase
      .from('pilot_memberships')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()

    return !membership.error && membership.data?.user_id === userId
  } catch {
    // Unavailable authorization evidence cannot grant access.
    return false
  }
}
