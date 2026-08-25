import { createServerClient } from '@supabase/ssr'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'
import { classifyAuthState } from '@/lib/auth/pilot-access'

const SIGN_IN_PATH = '/auth/signin'
const PROTECTED_PATH_PREFIXES = ['/despega', '/dashboard', '/a4-dashboard'] as const

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

    if (protectedPath && user) {
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

    const isDespegaRoute = pathname === '/despega' || pathname.startsWith('/despega/')
    if (!user || !isDespegaRoute) {
      return supabaseResponse
    }

    try {
      const pathMatch = pathname.match(/\/despega\/a2\/dia-(\d+)/)
      if (pathMatch) {
        const requestedDay = Number.parseInt(pathMatch[1], 10)
        const { data: progress } = await supabase
          .from('despega_pilar_progress')
          .select('ciclo_dia, is_a2_pilar_complete, is_a3_unlocked')
          .eq('user_id', user.id)
          .eq('pilar', 'a2_rutas')
          .maybeSingle()

        if (progress) {
          if (progress.is_a2_pilar_complete && !progress.is_a3_unlocked) {
            const url = request.nextUrl.clone()
            url.pathname = '/despega/a3'
            return NextResponse.redirect(url)
          }

          if (requestedDay > progress.ciclo_dia && !progress.is_a2_pilar_complete) {
            const url = request.nextUrl.clone()
            url.pathname = `/despega/a2/dia-${progress.ciclo_dia}`
            return NextResponse.redirect(url)
          }
        }
      }

      if (pathname === '/despega' || pathname === '/despega/') {
        const { data: progress } = await supabase
          .from('despega_pilar_progress')
          .select('ciclo_dia, is_a2_pilar_complete')
          .eq('user_id', user.id)
          .eq('pilar', 'a2_rutas')
          .maybeSingle()

        if (progress?.is_a2_pilar_complete) {
          const url = request.nextUrl.clone()
          url.pathname = '/despega/a3'
          return NextResponse.redirect(url)
        }

        if (progress) {
          const url = request.nextUrl.clone()
          url.pathname = `/despega/a2/dia-${progress.ciclo_dia}`
          return NextResponse.redirect(url)
        }
      }
    } catch (progressError) {
      console.error('[v0] Protected journey redirect lookup failed:', progressError)
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
