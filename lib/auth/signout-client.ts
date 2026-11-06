import { createClient } from '@/lib/supabase/client'
import { clearCurrentSession } from '@/lib/auth/current-session'

export const SIGN_OUT_ERROR = 'No pudimos confirmar el cierre de sesión. Inténtalo de nuevo.'

export async function signOutCurrentBrowser(): Promise<void> {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    credentials: 'same-origin',
    cache: 'no-store',
  })
  const result = await response.json().catch(() => null)
  if (!response.ok || result?.success !== true || result?.scope !== 'local') {
    throw new Error(SIGN_OUT_ERROR)
  }

  // The endpoint has confirmed cookie removal. Notify other mounted clients
  // and tabs through the SDK as well. A fresh document below also discards the
  // current React tree, Supabase singleton and Next.js Router Cache.
  try {
    const supabase = createClient()
    if (supabase) await clearCurrentSession(supabase.auth)
  } catch {
    // Cookie removal was already confirmed by the server. The new document
    // will also remove any stale client state if notification was unavailable.
  }
  window.location.replace('/auth/signin')
}
