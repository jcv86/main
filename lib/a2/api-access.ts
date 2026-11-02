import { createAdminClient } from '@/lib/supabase/server'

/** The RPC is service-role only; the caller must supply an identity verified on the server. */
export async function checkA2PilotAccess(userId: string): Promise<'allowed' | 'denied' | 'unavailable'> {
  try {
    const { data, error } = await createAdminClient().rpc('resolve_pilot_access', {
      p_user_id: userId,
      p_claim_id: null,
    })
    if (error || (Array.isArray(data) && data.length !== 1)) return 'unavailable'
    const access = Array.isArray(data) ? data[0] : data
    if (typeof access?.allowed !== 'boolean') return 'unavailable'
    return access.allowed ? 'allowed' : 'denied'
  } catch {
    return 'unavailable'
  }
}
