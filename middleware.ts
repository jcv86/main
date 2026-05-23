import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, rateLimiters } from '@/lib/middleware/rate-limit'
import { logger } from '@/lib/logger'

export async function middleware(request: NextRequest) {
  // Fix double slashes in pathname (e.g., //api/auth/callback/google → /api/auth/callback/google)
  let pathname = request.nextUrl.pathname
  if (pathname.includes('//')) {
    pathname = pathname.replace(/\/+/g, '/')
    const normalizedUrl = new URL(request.nextUrl)
    normalizedUrl.pathname = pathname
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

    // Check rate limit
    const rateLimitResponse = await checkRateLimit(request, limiter)
    if (rateLimitResponse) {
      logger.warn('Rate limit exceeded', {
        path: request.nextUrl.pathname,
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      })
      return rateLimitResponse
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
  const demoUser = request.cookies.get('demo_user')?.value
  if (demoUser) {
    // Allow demo users to bypass auth validation
    return NextResponse.next()
  }

  // Use Supabase session management for all other routes
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
