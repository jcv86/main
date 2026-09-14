import { createHash } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import {
  createInvitationCookieValue,
  PILOT_CLAIM_COOKIE,
  PILOT_CLAIM_MAX_AGE,
  resolveInvitationCookieSecret,
} from './invitation-cookie'

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43,128}$/

interface InvitationClaimDependencies {
  createClaimId: () => string
  claim: (
    tokenHash: string,
    claimId: string,
  ) => PromiseLike<{ data: unknown; error: unknown }>
}

function signInErrorUrl(request: NextRequest) {
  return new URL('/auth/signin?error=invalid_invitation', request.url)
}

export async function processInvitationClaim(
  request: NextRequest,
  dependencies: InvitationClaimDependencies,
) {
  let token = ''
  try {
    const formData = await request.formData()
    const value = formData.get('token')
    token = typeof value === 'string' ? value : ''
  } catch {
    return NextResponse.redirect(signInErrorUrl(request), 303)
  }

  const secret = resolveInvitationCookieSecret()
  const errorUrl = signInErrorUrl(request)

  if (!TOKEN_PATTERN.test(token) || secret.length < 32) {
    return NextResponse.redirect(errorUrl, 303)
  }

  const tokenHash = createHash('sha256').update(token).digest('hex')
  const claimId = dependencies.createClaimId()
  const { data, error } = await dependencies.claim(tokenHash, claimId)
  const result = Array.isArray(data) ? data[0] : data

  if (error || !result || typeof result !== 'object' || !('allowed' in result) || !result.allowed) {
    return NextResponse.redirect(errorUrl, 303)
  }

  const response = NextResponse.redirect(new URL('/auth/signin?invited=1', request.url), 303)
  response.cookies.set(PILOT_CLAIM_COOKIE, createInvitationCookieValue(claimId, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: PILOT_CLAIM_MAX_AGE,
  })
  return response
}
