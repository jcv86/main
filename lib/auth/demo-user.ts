import type { NextRequest } from 'next/server'

/**
 * Legacy cookie name retained only so middleware and sign-out can remove old
 * demo cookies. Demo identities are no longer issued or accepted.
 */
export const DEMO_COOKIE_NAME = 'demo_user'

export interface DemoUser {
  id: string
  email: string
  name: string
  is_dev: true
}

export async function createDemoSessionToken(): Promise<never> {
  throw new Error('Demo authentication has been retired')
}

export function getTravisDemoUser(): never {
  throw new Error('Demo authentication has been retired')
}

export async function getDemoUserFromRequest(
  _request: NextRequest,
): Promise<null> {
  return null
}

export async function verifyDemoSessionToken(
  _token?: string | null,
): Promise<null> {
  return null
}

export const demoSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 0,
}

export function getDemoUser(): null {
  return null
}

export function isDemoUser(_userId?: string | null): false {
  return false
}
