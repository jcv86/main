import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, rateLimiters } from '@/lib/middleware/rate-limit'
import { logger } from '@/lib/logger'
import { getPillarFromPath, shouldEnforcePillarAccess, getAccessDeniedRedirect } from '@/lib/pillar-access-validation'
import { DEMO_COOKIE_NAME, demoSessionCookieOptions } from '@/lib/auth/demo-user'
import { isStaleOAuthStateReturn, OAUTH_STATE_EXPIRED_REASON } from '@/lib/auth/oauth-recovery'
import {
  DTC_REQUEST_ID_HEADER,
  resolveRequestId,
} from '@/lib/observability/request-id'
import {
  currentUatEnvironment,
  isAllowedUatRequestOrigin,
  isDisabledUatExternalAction,
  UAT_BACKEND_HEADER,
  UAT_ENVIRONMENT_HEADER,
} from '@/lib/uat/environment'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/documentos',
  '/documentos-publicos',
  '/api/documentos',
]

// Invitation claims are protected by a high-entropy, single-use token and an
// atomic database transition. A shared IP limiter can lock legitimate invitees
// out when browsers, mail scanners, or office networks reuse the same egress IP.
const RATE_LIMIT_EXEMPT_ROUTES = ['/api/auth/invitation/claim']

// Auth routes
const AUTH_ROUTES = ['/auth', '/auth/signin', '/auth/callback']

// Onboarding routes (protected but requires auth)
const ONBOARDING_ROUTES = ['/despega/conozcamonos-1']

// Protected routes that require auth (not onboarding)
const PROTECTED_ROUTES = ['/dashboard', '/a4-dashboard']

// Routes that bypass pillar access validation (can be accessed anytime after auth)
const PILLAR_EXEMPT_ROUTES = [
  '/dashboard',
  '/biblioteca',
  '/documentos',
  '/documentos-publicos',
  '/api/auth',
  '/api/documentos',
]

const PRODUCTION_LAB_ROUTE_PREFIXES = ['/test', '/demo', '/design-system'] as const
const PRODUCTION_LAB_ROUTES = ['/auth/debug', '/auth/test'] as const

export function isProductionLaboratoryRoute(pathname: string): boolean {
  return PRODUCTION_LAB_ROUTES.includes(pathname as (typeof PRODUCTION_LAB_ROUTES)[number])
    || PRODUCTION_LAB_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix
        || pathname.startsWith(`${prefix}/`)
        || pathname.startsWith(`${prefix}-`),
    )
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
}

function isRateLimitExemptRoute(request: NextRequest): boolean {
  // A person must always be able to end their current session, including
  // after exhausting login attempts or the ordinary API allowance.
  return (request.nextUrl.pathname === '/api/auth/signout' && request.method === 'POST')
    || RATE_LIMIT_EXEMPT_ROUTES.some(route => request.nextUrl.pathname === route)
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route))
}

function isOnboardingRoute(pathname: string): boolean {
  return ONBOARDING_ROUTES.some(route => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route))
}

function isPillarExemptRoute(pathname: string): boolean {
  return PILLAR_EXEMPT_ROUTES.some(route => pathname.startsWith(route))
}

function withRequestId<T extends Response>(response: T, requestId: string): T {
  response.headers.set(DTC_REQUEST_ID_HEADER, requestId)
  const uat = currentUatEnvironment()
  if (uat.enabled && uat.valid) {
    response.headers.set(UAT_ENVIRONMENT_HEADER, 'uat')
    response.headers.set(UAT_BACKEND_HEADER, uat.projectRef!)
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
    response.headers.set('Cache-Control', 'private, no-store, max-age=0')
  }
  return response
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const requestId = resolveRequestId(request.headers)
  const forwardedHeaders = new Headers(request.headers)
  forwardedHeaders.set(DTC_REQUEST_ID_HEADER, requestId)

  // A UAT request must fail before session refresh, database access or an
  // external action if the isolated deployment's configuration is incomplete.
  // This is an environment boundary, never an authentication bypass.
  const uat = currentUatEnvironment()
  if (uat.enabled) {
    if (!uat.valid) {
      return withRequestId(new NextResponse('UAT no disponible: configuración pendiente.', {
        status: 503,
        headers: { 'Cache-Control': 'private, no-store, max-age=0' },
      }), requestId)
    }
    if (!isAllowedUatRequestOrigin(request.nextUrl.origin, uat, process.env.VERCEL_URL)) {
      return withRequestId(new NextResponse('Origen no habilitado para UAT.', { status: 403 }), requestId)
    }
    if (isDisabledUatExternalAction(pathname)) {
      return withRequestId(NextResponse.json({
        error: 'uat_external_action_disabled',
        message: 'Los envíos de correo y tareas programadas están deshabilitados en UAT.',
      }, { status: 403 }), requestId)
    }
  }

  // Internal laboratories are available only on a developer's localhost.
  // Both Preview and Production are externally reachable Vercel environments.
  if (process.env.VERCEL_ENV && isProductionLaboratoryRoute(pathname)) {
    return withRequestId(new NextResponse(null, {
      status: 404,
      headers: { 'Cache-Control': 'private, no-store, max-age=0' },
    }), requestId)
  }

  // Fix double slashes in pathname
  if (pathname.includes('//')) {
    const normalizedPath = pathname.replace(/\/+/g, '/')
    const normalizedUrl = new URL(request.nextUrl)
    normalizedUrl.pathname = normalizedPath
    return withRequestId(NextResponse.redirect(normalizedUrl), requestId)
  }


  // A browser Back navigation can revisit a consumed Google/Supabase OAuth
  // transaction. Supabase correctly rejects the stale state, but sends the
  // technical error to SITE_URL. Convert only that known condition into a
  // clean, recoverable sign-in state instead of exposing provider internals on
  // the public landing URL.
  if (isStaleOAuthStateReturn(pathname, request.nextUrl.searchParams)) {
    const recoveryUrl = new URL('/auth/signin', request.url)
    recoveryUrl.searchParams.set('reason', OAUTH_STATE_EXPIRED_REASON)
    return withRequestId(NextResponse.redirect(recoveryUrl, 303), requestId)
  }

  // Handle API routes with CORS and rate limiting
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Apply rate limiting based on endpoint
    let limiter = rateLimiters.api

    // Reading an existing pilot entitlement is not a new login attempt.
    // Keep the ordinary API limit for this read and the strict, unchanged
    // auth limit for login and every other non-exempt auth endpoint.
    const isPilotStatusRead = pathname === '/api/auth/pilot-status' && request.method === 'GET'
    if (pathname.includes('/auth/') && !isPilotStatusRead) {
      limiter = rateLimiters.auth
    } else if (pathname === '/api/despega/a2-coach' || request.nextUrl.pathname.includes('/openai/') || request.nextUrl.pathname.includes('/coaching/')) {
      limiter = rateLimiters.ai
    }

    // Check rate limit for non-public routes
    if (!isPublicRoute(pathname) && !isRateLimitExemptRoute(request)) {
      const rateLimitResponse = await checkRateLimit(request, limiter)
      if (rateLimitResponse) {
        logger.warn('Rate limit exceeded', {
          path: request.nextUrl.pathname,
          requestId,
        })
        return withRequestId(rateLimitResponse, requestId)
      }
    }

    const response = NextResponse.next({
      request: { headers: forwardedHeaders },
    })

    // Set CORS headers with restricted origin
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      'http://localhost:3000',
      'http://localhost:3001',
    ].filter(Boolean)

    const origin = request.headers.get('origin')
    const isAllowedOrigin = allowedOrigins.includes(origin || '')

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin || '')
    } else if (process.env.NODE_ENV === 'development') {
      // Allow all in development
      response.headers.set('Access-Control-Allow-Origin', '*')
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', `Content-Type, Authorization, ${DTC_REQUEST_ID_HEADER}`)
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400')

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    if (request.method === 'OPTIONS') {
      return withRequestId(response, requestId)
    }
    return withRequestId(response, requestId)
  }

  const response = await updateSession(request)
  if (request.cookies.get(DEMO_COOKIE_NAME)?.value) {
    response.cookies.set(DEMO_COOKIE_NAME, '', {
      ...demoSessionCookieOptions,
      maxAge: 0,
    })
  }
  return withRequestId(response, requestId)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
