import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Skip auth middleware during build time
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    // Create a new Supabase client for each request (required for Fluid compute)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dcfrbwxbejtbcouionna.supabase.co'
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZnJid3hiZWp0YmNvdWlvbm5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc4MTc2MDAsImV4cCI6MTk0MzM5MzYwMH0.9H3zWQ0K8YqVbH5Yf3rXpqJhMzK7LmN8OqRsStUvWjI'
    
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            )
          },
        },
      },
    )

    // IMPORTANT: Do not run code between createServerClient and supabase.auth.getUser()
    // This refreshes the session if needed and keeps cookies in sync
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protect /despega/* routes - BUT ALLOW /despega/a3 for DEMO/PREVIEW
    // Allow /despega/a3 routes without authentication (for demo/preview purposes)
    const isA3Route = request.nextUrl.pathname.startsWith('/despega/a3')
    const isDespegaRoute = request.nextUrl.pathname.startsWith('/despega')
    
    if (isDespegaRoute && !isA3Route && !user) {
      // Redirect to signin ONLY for non-A3 despega routes
      const url = request.nextUrl.clone()
      url.pathname = '/auth/signin'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    // A3 routes are accessible without authentication for demo/preview
  } catch (error) {
    // If auth fails (build time or missing env vars), just continue without auth
    console.log('[v0] Auth middleware skipped (likely build time)')
  }

  // IMPORTANT: Return the supabaseResponse object as is to maintain session state
  return supabaseResponse
}
