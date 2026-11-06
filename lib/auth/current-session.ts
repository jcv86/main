import type { SupabaseClient } from '@supabase/supabase-js'

type SessionAuth = Pick<SupabaseClient['auth'], 'signOut' | 'getSession'>

/**
 * Clear this session without signing the person out of their other devices.
 * With the installed SDK, local storage is cleared before refresh-token
 * revocation. A network error therefore does not, by itself, mean that the
 * local session survived. Verify storage separately from remote revocation.
 * getSession is used only to check removal, never to authorize a user.
 */
export async function clearCurrentSession(auth: SessionAuth): Promise<{
  cleared: boolean
  revocationConfirmed: boolean
}> {
  let revocationConfirmed = false
  try {
    const { error } = await auth.signOut({ scope: 'local' })
    revocationConfirmed = !error
  } catch {
    // A subscriber or transport can throw after the local session was removed.
    // The verification below determines whether local sign-out completed.
  }

  try {
    const { data, error } = await auth.getSession()
    return { cleared: !error && data.session === null, revocationConfirmed }
  } catch {
    return { cleared: false, revocationConfirmed }
  }
}
