import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/server'
import { clearCurrentSession } from '@/lib/auth/current-session'
import {
  EMAIL_LOGIN_ERRORS, classifyPasswordLoginError, parseEmailLoginCredentials, type EmailLoginError,
} from '@/lib/auth/email-login'
import {
  PILOT_CLAIM_COOKIE, resolveInvitationCookieSecret, verifyInvitationCookieValue,
} from '@/lib/auth/invitation-cookie'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

function failure(error: EmailLoginError) {
  const { status, message } = EMAIL_LOGIN_ERRORS[error]
  return NextResponse.json({ success: false, error, message }, { status, headers: NO_STORE })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return failure('invalid_request')
  }
  const credentials = parseEmailLoginCredentials(body)
  if (!credentials) return failure('invalid_request')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !process.env.SUPABASE_SERVICE_ROLE_KEY) return failure('authentication_unavailable')

  let supabase: ReturnType<typeof createServerClient> | null = null
  let passwordAccepted = false
  const updates = new Map<string, { name: string; value: string; options: CookieOptions }>()
  const withSessionCookies = (response: NextResponse) => {
    for (const { name, value, options } of updates.values()) response.cookies.set(name, value, options)
    return response
  }
  const rejectNewSession = async (error: EmailLoginError, consumeClaim = false) => {
    const result = await clearCurrentSession(supabase!.auth)
    if (!result.cleared) return failure('authentication_unavailable')
    // Neither the attempted session nor its removal has reached the browser.
    // Discard both sets of staged updates so a previous browser session survives
    // a failed account switch; an initially signed-out browser remains signed out.
    const response = failure(error)
    if (consumeClaim) response.cookies.delete(PILOT_CLAIM_COOKIE)
    return response
  }

  try {
    const cookieStore = await cookies()
    const sessionCookies = new Map(cookieStore.getAll().map(({ name, value }) => [name, value]))
    // Do not publish a new authenticated cookie before the pilot policy has
    // decided. This also makes failures independent of mutable RSC cookie APIs.
    supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => Array.from(sessionCookies, ([name, value]) => ({ name, value })),
        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            sessionCookies.set(cookie.name, cookie.value)
            updates.set(cookie.name, cookie)
          }
        },
      },
    })
    // Finish initialization before SIGNED_IN so the SSR cookie listener runs
    // before the response, rather than remaining in the SDK's init event queue.
    await supabase.auth.initialize()
    const { data, error } = await supabase.auth.signInWithPassword(credentials)
    if (error) return failure(classifyPasswordLoginError(error))
    passwordAccepted = true
    if (!data.user?.id || !data.session) return await rejectNewSession('authentication_unavailable')

    const claimValue = cookieStore.get(PILOT_CLAIM_COOKIE)?.value
    const secret = resolveInvitationCookieSecret()
    if (claimValue && !secret) return await rejectNewSession('authentication_unavailable')
    const claimId = verifyInvitationCookieValue(claimValue, secret)
    const admin = createAdminClient()
    const { data: accessData, error: accessError } = await admin.rpc('resolve_pilot_access', {
      p_user_id: data.user.id,
      p_claim_id: claimId,
    })
    const access = Array.isArray(accessData) ? (accessData.length === 1 ? accessData[0] : null) : accessData
    if (accessError || typeof access?.allowed !== 'boolean') {
      return await rejectNewSession('authentication_unavailable')
    }
    if (!access.allowed) return await rejectNewSession('access_required', true)

    const response = withSessionCookies(NextResponse.json({ success: true }, { headers: NO_STORE }))
    response.cookies.delete(PILOT_CLAIM_COOKIE)
    return response
  } catch {
    if (passwordAccepted && supabase) return await rejectNewSession('authentication_unavailable')
    return failure('authentication_unavailable')
  }
}
