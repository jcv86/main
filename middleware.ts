import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, rateLimiters } from '@/lib/middleware/rate-limit'
import { logger } from '@/lib/logger'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/documentos',
  '/documentos-publicos',
  '/api/documentos',
]

// Auth routes
const AUTH_ROUTES = ['/auth', '/auth/signin', '/auth/callback']

// Onboarding routes (protected but requires auth)
const ONBOARDING_ROUTES = ['/despega/conozcamonos-1']

// Protected routes that require auth (not onboarding)
const PROTECTED_ROUTES = ['/dashboard', '/a4-dashboard']

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
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

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Fix double slashes in pathname
  if (pathname.includes('//')) {
    const normalizedPath = pathname.replace(/\/+/g, '/')
    const normalizedUrl = new URL(request.nextUrl)
    normalizedUrl.pathname = normalizedPath
    return NextResponse.redirect(normalizedUrl)
  }

  // Handle API routes with CORS and rate limiting
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Apply rate limiting based on endpoint
    let limiter = rateLimiters.api

    if (request.nextUrl.pathname.includes('/auth/')) {
      limiter = rateLimiters.auth
    } else if (request.nextUrl.pathname.includes('/openai/') || request.nextUrl.pathname.includes('/coaching/')) {
      limiter = rateLimiters.ai
    }

    // Check rate limit for non-public routes
    if (!isPublicRoute(pathname)) {
      const rateLimitResponse = await checkRateLimit(request, limiter)
      if (rateLimitResponse) {
        logger.warn('Rate limit exceeded', {
          path: request.nextUrl.pathname,
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        })
        return rateLimitResponse
      }
    }

    const response = NextResponse.next()

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
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Max-Age', '86400')

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    if (request.method === 'OPTIONS') {
      return response
    }
    return response
  }

  // Check for demo user in cookie (set by demo login)
  const demoUserCookie = request.cookies.get('demo_user')?.value
  
  if (demoUserCookie) {
    try {
      const demoUser = JSON.parse(decodeURIComponent(demoUserCookie))
      const isTravisDev = demoUser.is_dev === true || demoUser.email === 'travis@nuanu.com'
      
      const response = NextResponse.next()
      // Extend cookie expiry on every request
      response.cookies.set('demo_user', demoUserCookie, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 7 // 7 days
      })
      
      // Travis dev account has FULL ACCESS - no restrictions
      if (isTravisDev) {
        return response
      }
      
      // Regular demo users: redirect to onboarding if trying to access protected routes
      if (isProtectedRoute(pathname) && !isOnboardingRoute(pathname)) {
        const redirectUrl = new URL('/despega/conozcamonos-1', request.nextUrl)
        return NextResponse.redirect(redirectUrl)
      }
      
      return response
    } catch {
      // Invalid cookie, continue to Supabase auth
    }
  }

  // Use Supabase session management for all other routes
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
