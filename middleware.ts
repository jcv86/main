import { updateSession } from '@/lib/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Fix double slashes in pathname (e.g., //api/auth/callback/google → /api/auth/callback/google)
  let pathname = request.nextUrl.pathname
  if (pathname.includes('//')) {
    pathname = pathname.replace(/\/+/g, '/')
    const normalizedUrl = new URL(request.nextUrl)
    normalizedUrl.pathname = pathname
    return NextResponse.redirect(normalizedUrl)
  }

  // Handle API routes with CORS
  if (request.nextUrl.pathname.startsWith('/api/')) {
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
     * - /documentos (public downloads page)
     * - /documentos-publicos (public docs viewer)
     * - /api/documentos/* (public docs APIs)
     */
    '/((?!_next/static|_next/image|favicon.ico|^/documentos|^/api/documentos|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
