import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { normalizeNextPath } from '@/lib/auth/pilot-access'
import { PILOT_CLAIM_COOKIE, verifyInvitationCookieValue } from '@/lib/auth/invitation-cookie'

function signInRedirect(request: NextRequest, error: string) {
  const url = new URL('/auth/signin', request.url)
  url.searchParams.set('error', error)
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const next = normalizeNextPath(request.nextUrl.searchParams.get('next'))
  if (!code || request.nextUrl.searchParams.get('error')) return signInRedirect(request, 'oauth_failed')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.user) return signInRedirect(request, 'exchange_failed')

  const secret = process.env.PILOT_INVITATION_COOKIE_SECRET ?? ''
  const claimId = verifyInvitationCookieValue(request.cookies.get(PILOT_CLAIM_COOKIE)?.value, secret)
  const admin = createAdminClient()
  const { data: accessData, error: accessError } = await admin.rpc('resolve_pilot_access', {
    p_user_id: data.user.id,
    p_claim_id: claimId,
  })
  const access = Array.isArray(accessData) ? accessData[0] : accessData

  if (accessError || !access?.allowed) {
    await supabase.auth.signOut()
    const denied = signInRedirect(request, 'access_required')
    denied.cookies.delete(PILOT_CLAIM_COOKIE)
    return denied
  }

  const response = NextResponse.redirect(new URL(next, request.url))
  response.cookies.delete(PILOT_CLAIM_COOKIE)
  return response
}
