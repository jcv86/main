import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { DEMO_COOKIE_NAME, verifyDemoSessionToken } from '@/lib/auth/demo-user'

export type ServerUserSource = 'supabase' | 'demo'

export interface ResolvedServerUser {
  id: string
  source: ServerUserSource
}

/**
 * Resolve the current server-side user without trusting client-provided IDs.
 *
 * Priority:
 * 1. A verified Supabase session from the request cookies.
 * 2. The signed DTC demo-session cookie.
 */
export async function resolveServerUser(): Promise<ResolvedServerUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.id) {
    return { id: user.id, source: 'supabase' }
  }

  const cookieStore = await cookies()
  const demoToken = cookieStore.get(DEMO_COOKIE_NAME)?.value
  const demoUser = await verifyDemoSessionToken(demoToken)

  return demoUser ? { id: demoUser.id, source: 'demo' } : null
}
