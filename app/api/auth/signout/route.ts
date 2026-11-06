import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { DEMO_COOKIE_NAME } from '@/lib/auth/demo-user'
import { clearCurrentSession } from '@/lib/auth/current-session'

const NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' }

function unavailable() {
  return NextResponse.json({
    success: false,
    message: 'No pudimos confirmar el cierre de sesión. Inténtalo de nuevo.',
  }, { status: 503, headers: NO_STORE })
}

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return unavailable()

    const cookieStore = await cookies()
    const sessionCookies = new Map(cookieStore.getAll().map(({ name, value }) => [name, value]))
    const updates = new Map<string, { name: string; value: string; options: CookieOptions }>()
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return Array.from(sessionCookies, ([name, value]) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          for (const cookie of cookiesToSet) {
            sessionCookies.set(cookie.name, cookie.value)
            updates.set(cookie.name, cookie)
          }
        },
      },
    })

    const result = await clearCurrentSession(supabase.auth)
    if (!result.cleared) return unavailable()

    // Confirmation describes this browser's session. A best-effort revocation
    // failure must not be reported as if the removed local session remained.
    if (!result.revocationConfirmed) {
      console.warn('[auth] Current session cleared; remote revocation could not be confirmed.')
    }

    const response = request.headers.get('accept')?.includes('application/json')
      ? NextResponse.json({ success: true, scope: 'local' }, { headers: NO_STORE })
      : NextResponse.redirect(new URL('/auth/signin', request.url), { status: 303, headers: NO_STORE })
    // Commit cookie changes only on the confirmed response. In particular, a
    // failed handler never sends a success redirect while retaining auth cookies.
    for (const { name, value, options } of updates.values()) {
      response.cookies.set(name, value, options)
    }
    response.cookies.delete(DEMO_COOKIE_NAME)
    return response
  } catch {
    return unavailable()
  }
}
