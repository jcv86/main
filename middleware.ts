import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/documentos',
  '/documentos-publicos',
  '/api/documentos',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route))
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

  // PUBLIC ROUTES - Allow without any auth check
  if (isPublicRoute(pathname)) {
    const response = NextResponse.next()
    // Add CORS headers for API routes
    if (pathname.startsWith('/api/')) {
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    }
    return response
  }

  // Handle other API routes with CORS
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')

    if (request.method === 'OPTIONS') {
      return response
    }
    return response
  }

  // Check for demo user in cookie (set by demo login)
  const demoUserCookie = request.cookies.get('demo_user')?.value
  if (demoUserCookie) {
    const response = NextResponse.next()
    // Extend cookie expiry on every request
    response.cookies.set('demo_user', demoUserCookie, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7 // 7 days
    })
    return response
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
