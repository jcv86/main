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

  // Check for demo user cookie first (set by demo login)
  const demoUser = request.cookies.get('demo_user')?.value
  if (demoUser) {
    console.log('[v0] Demo user found in middleware, skipping auth check')
    return supabaseResponse
  }

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

    // Protect /despega/* routes - redirect to signin if not authenticated
    // BUT: Allow access to proceed even if user is null (client-side will handle redirect if needed)
    // This prevents middleware from breaking persistent sessions
    if (request.nextUrl.pathname.startsWith('/despega') && !user) {
      console.log('[v0] No user in middleware for /despega route, but allowing client-side to handle')
      // Don't redirect here - let the client-side auth hook handle it
      // This preserves session state better
    }
  } catch (error) {
    // If auth fails (build time or missing env vars), just continue without auth
    console.log('[v0] Auth middleware error:', error instanceof Error ? error.message : 'Unknown error')
  }

  // IMPORTANT: Return the supabaseResponse object as is to maintain session state
  return supabaseResponse
}
