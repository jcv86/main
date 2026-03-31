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

  // Exchange code for session
  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!exchangeError) {
      // Successful authentication - redirect to intended destination
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        // In development, redirect directly
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        // In production with a reverse proxy, use the forwarded host
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
