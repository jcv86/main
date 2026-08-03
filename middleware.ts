import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, rateLimiters } from '@/lib/middleware/rate-limit'
import { logger } from '@/lib/logger'
import { DEMO_COOKIE_NAME, demoSessionCookieOptions } from '@/lib/auth/demo-user'

const PUBLIC_ROUTES = [
  '/documentos',
  '/documentos-publicos',
  '/api/documentos',
]

const AUTH_ROUTES = ['/auth', '/auth/signin', '/auth/callback']
const ONBOARDING_ROUTES = ['/despega/conozcamonos-1']
const PROTECTED_ROUTES = ['/dashboard', '/a4-dashboard']
const PILLAR_EXEMPT_ROUTES = [
  '/dashboard',
  '/biblioteca',
  '/documentos',
  '/documentos-publicos',
  '/api/auth',
  '/api/documentos',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

function isOnboardingRoute(pathname: string): boolean {
  return ONBOARDING_ROUTES.some((route) => pathname.startsWith(route))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
}

function isPillarExemptRoute(pathname: string): boolean {
  return PILLAR_EXEMPT_ROUTES.some((route) => pathname.startsWith(route))
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.includes('//')) {
    const normalizedPath = pathname.replace(/\/+/g, '/')
    const normalizedUrl = new URL(request.nextUrl)
    normalizedUrl.pathname = normalizedPath
    return NextResponse.redirect(normalizedUrl)
  }

  if (request.nextUrl.pathname.startsWith('/api/')) {
    let limiter = rateLimiters.api

    if (request.nextUrl.pathname.includes('/auth/')) {
      limiter = rateLimiters.auth
    } else if (
      request.nextUrl.pathname.includes('/openai/') ||
      request.nextUrl.pathname.includes('/coaching/')
    ) {
      limiter = rateLimiters.ai
    }

    if (!isPublicRoute(pathname)) {
      const rateLimitResponse = await checkRateLimit(request, limiter)
      if (rateLimitResponse) {
        logger.warn('Rate limit exceeded', {
          path: request.nextUrl.pathname,
          ip:
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip'),
        })
        return rateLimitResponse
      }
    }

    const response = NextResponse.next()
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
      response.headers.set('Access-Control-Allow-Origin', '*')
    }

    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    )
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    if (request.method === 'OPTIONS') return response
    return response
  }

  const response = await updateSession(request)

  if (request.cookies.get(DEMO_COOKIE_NAME)?.value) {
    response.cookies.set(DEMO_COOKIE_NAME, '', {
      ...demoSessionCookieOptions,
      maxAge: 0,
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
