import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/despega/conozcamonos-1'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Handle OAuth errors from provider
  if (error) {
    const errorUrl = new URL('/auth/signin', origin)
    errorUrl.searchParams.set('error', error)
    if (errorDescription) {
      errorUrl.searchParams.set('error_description', errorDescription)
    }
    return NextResponse.redirect(errorUrl)
  }

  // Extract invitation code from URL (passed from signin page)
  const invitationCode = searchParams.get('code')

  // Exchange code for session
  if (code) {
    const supabase = await createClient()
    const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError && data.session?.user) {
      // Successful authentication - now redeem invitation if provided
      if (invitationCode) {
        try {
          const redeemRes = await fetch(`${origin}/api/auth/redeem-invitation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.session.access_token}`
            },
            body: JSON.stringify({ code: invitationCode })
          })

          if (!redeemRes.ok) {
            console.warn('[Auth Callback] Invitation redemption failed:', await redeemRes.text())
            // Redemption failure is not fatal - user is authenticated but invitation wasn't recorded
          }
        } catch (err) {
          console.error('[Auth Callback] Redemption error:', err)
          // Continue regardless
        }
      }

      // Redirect to intended destination
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    // Log the exchange error for debugging
    console.error('[Auth Callback] Code exchange failed:', exchangeError.message)
    
    // Redirect to signin with error
    const errorUrl = new URL('/auth/signin', origin)
    errorUrl.searchParams.set('error', 'exchange_failed')
    errorUrl.searchParams.set('error_description', exchangeError.message)
    return NextResponse.redirect(errorUrl)
  }

  // No code provided - redirect to signin with error
  const errorUrl = new URL('/auth/signin', origin)
  errorUrl.searchParams.set('error', 'no_code')
  errorUrl.searchParams.set('error_description', 'No se recibio codigo de autorizacion')
  return NextResponse.redirect(errorUrl)
}
