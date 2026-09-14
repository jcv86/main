import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { classifyAuthState } from '@/lib/auth/pilot-access'

const SIGN_IN_PATH = '/auth/signin'
const PROTECTED_PATH_PREFIXES = ['/despega', '/dashboard', '/a4-dashboard', '/admin'] as const

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

function redirectToSignIn(request: NextRequest, reason?: string, error?: string) {
  const url = request.nextUrl.clone()
  url.pathname = SIGN_IN_PATH
  url.search = ''
  url.searchParams.set('next', request.nextUrl.pathname)
  if (reason) url.searchParams.set('reason', reason)
  if (error) url.searchParams.set('error', error)
  return NextResponse.redirect(url)
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const protectedPath = isProtectedPath(pathname)
  const adminPath = pathname === '/admin' || pathname.startsWith('/admin/')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  let supabaseResponse = NextResponse.next({ request })

  if (!supabaseUrl || !supabaseAnonKey) {
    if (protectedPath) {
      return redirectToSignIn(request, 'authentication_unavailable')
    }
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    })

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    const authErrorCode = authError?.name === 'AuthSessionMissingError'
      ? undefined
      : authError?.code ?? authError?.name
    const state = classifyAuthState({ hasUser: Boolean(user), authErrorCode })

    if (protectedPath && state === 'signed_out') {
      return redirectToSignIn(request)
    }

    if (protectedPath && state === 'invalid_session') {
      return redirectToSignIn(request, 'authentication_verification_failed')
    }

    // Admin pages have their own server-side role guard. They must require a
    // valid session here, but not a pilot entitlement intended for learners.
    if (protectedPath && user && !adminPath) {
      if (!supabaseServiceKey) return redirectToSignIn(request, 'authentication_unavailable')
      const admin = createAdminClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
      const { data: accessData, error: accessError } = await admin.rpc('resolve_pilot_access', {
        p_user_id: user.id,
        p_claim_id: null,
      })
      const access = Array.isArray(accessData) ? accessData[0] : accessData
      if (accessError || !access?.allowed) {
        return redirectToSignIn(request, undefined, 'access_required')
      }
    }

    return supabaseResponse
  } catch (error) {
    console.error('[v0] Authentication middleware failed:', error)
    if (protectedPath) {
      return redirectToSignIn(request, 'authentication_verification_failed')
    }
    return supabaseResponse
  }
}
