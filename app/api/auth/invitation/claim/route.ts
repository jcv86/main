import { createHash, randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import {
  createInvitationCookieValue,
  PILOT_CLAIM_COOKIE,
  PILOT_CLAIM_MAX_AGE,
} from '@/lib/auth/invitation-cookie'

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,128}$/

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token') ?? ''
  const secret = process.env.PILOT_INVITATION_COOKIE_SECRET ?? ''
  const errorUrl = new URL('/auth/signin?error=invalid_invitation', request.url)

  if (!TOKEN_PATTERN.test(token) || secret.length < 32) {
    return NextResponse.redirect(errorUrl, 303)
  }

  const tokenHash = createHash('sha256').update(token).digest('hex')
  const claimId = randomUUID()
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('claim_pilot_invitation', {
    p_token_hash: tokenHash,
    p_claim_id: claimId,
  })
  const result = Array.isArray(data) ? data[0] : data

  if (error || !result?.allowed) {
    return NextResponse.redirect(errorUrl, 303)
  }

  const response = NextResponse.redirect(new URL('/auth/signin?invited=1', request.url), 303)
  response.cookies.set(PILOT_CLAIM_COOKIE, createInvitationCookieValue(claimId, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 900,
  })
  return response
}
