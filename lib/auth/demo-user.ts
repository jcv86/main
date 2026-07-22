import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import type { NextRequest } from 'next/server'

export const DEMO_COOKIE_NAME = 'demo_user'
export const TRAVIS_EMAIL = 'travis@nuanu.com'
export const TRAVIS_USER_ID = '64738eef-ee31-4da9-8270-9adfa46c74ba'

const DEMO_ISSUER = 'despega-tu-carrera'
const DEMO_AUDIENCE = 'dtc-demo'
const DEMO_SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7

export interface DemoUser {
  id: string
  email: string
  name: string
  is_dev: true
}

interface DemoSessionClaims extends JWTPayload {
  email: string
  name: string
  is_dev: true
}

function getDemoSecret() {
  const value = process.env.DEMO_SESSION_SECRET || process.env.NEXTAUTH_SECRET
  if (!value || value.length < 32) {
    throw new Error('A demo session secret of at least 32 characters is required')
  }
  return new TextEncoder().encode(value)
}

export function getTravisDemoUser(): DemoUser {
  return {
    id: TRAVIS_USER_ID,
    email: TRAVIS_EMAIL,
    name: 'Travis',
    is_dev: true,
  }
}

export async function createDemoSessionToken() {
  const user = getTravisDemoUser()
  return new SignJWT({ email: user.email, name: user.name, is_dev: true })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(user.id)
    .setIssuer(DEMO_ISSUER)
    .setAudience(DEMO_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${DEMO_SESSION_DURATION_SECONDS}s`)
    .sign(getDemoSecret())
}

export async function getDemoUserFromRequest(request: NextRequest): Promise<DemoUser | null> {
  return verifyDemoSessionToken(request.cookies.get(DEMO_COOKIE_NAME)?.value)
}

export async function verifyDemoSessionToken(token?: string | null): Promise<DemoUser | null> {
  if (!token) return null

  try {
    const { payload } = await jwtVerify<DemoSessionClaims>(token, getDemoSecret(), {
      issuer: DEMO_ISSUER,
      audience: DEMO_AUDIENCE,
      algorithms: ['HS256'],
    })

    if (
      payload.sub !== TRAVIS_USER_ID ||
      payload.email !== TRAVIS_EMAIL ||
      payload.name !== 'Travis' ||
      payload.is_dev !== true
    ) return null

    return getTravisDemoUser()
  } catch {
    return null
  }
}

export const demoSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: DEMO_SESSION_DURATION_SECONDS,
}

/** Client-side identity hint only. Never use this value for authorization. */
export function getDemoUser(): DemoUser | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = window.localStorage.getItem(DEMO_COOKIE_NAME)
    if (!stored) return null
    const parsed = JSON.parse(stored) as Partial<DemoUser>
    if (parsed.id !== TRAVIS_USER_ID || parsed.email !== TRAVIS_EMAIL || parsed.is_dev !== true) return null
    return getTravisDemoUser()
  } catch {
    return null
  }
}

export function isDemoUser(userId?: string | null): boolean {
  return userId === TRAVIS_USER_ID
}
