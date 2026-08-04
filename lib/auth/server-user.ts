import { createClient } from '@/lib/supabase/server'

export type ServerUserSource = 'supabase'

export interface ResolvedServerUser {
  id: string
  source: ServerUserSource
}

/** Resolve the current server-side user exclusively from a verified Supabase session. */
export async function resolveServerUser(): Promise<ResolvedServerUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.id ? { id: user.id, source: 'supabase' } : null
}
