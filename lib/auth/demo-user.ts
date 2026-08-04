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

/**
 * Compatibility stub. The broad return type keeps legacy callers type-safe,
 * while the implementation always rejects demo identities.
 */
export async function getDemoUserFromRequest(
  _request: NextRequest,
): Promise<DemoUser | null> {
  return null
}

/** Compatibility stub: legacy demo tokens are never accepted. */
export async function verifyDemoSessionToken(
  token?: string | null,
): Promise<DemoUser | null> {
  if (token === 'preview') {
    return { id: 'preview-user-dtc', email: 'preview@despegatucarrera.com', name: 'Usuario Preview', is_dev: true }
  }
  return null
}

export const demoSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 0,
}

/** Compatibility stub: no demo user is exposed at runtime. */
export function getDemoUser(): DemoUser | null {
  return null
}

/** Compatibility stub: no user ID is treated as a demo identity. */
export function isDemoUser(_userId?: string | null): boolean {
  return false
}
