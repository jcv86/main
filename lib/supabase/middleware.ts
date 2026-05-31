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

    // Protect /despega/* routes - BUT ALLOW /despega/a3 and /despega/interview-0 for DEMO/PREVIEW
    // Allow /despega/a3 and /despega/interview-0 routes without authentication (for demo/preview purposes)
    const isA3Route = request.nextUrl.pathname.startsWith('/despega/a3')
    const isInterview0Route = request.nextUrl.pathname.startsWith('/despega/interview-0')
    const isDespegaRoute = request.nextUrl.pathname.startsWith('/despega')
    
    if (isDespegaRoute && !isA3Route && !isInterview0Route && !user) {
      // Redirect to signin ONLY for non-A3 and non-interview-0 despega routes
      const url = request.nextUrl.clone()
      url.pathname = '/auth/signin'
      url.searchParams.set('next', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    // A3 and interview-0 routes are accessible without authentication for demo/preview

    // Smart redirect middleware for A2/A3 progression (Migration 002: cycle management)
    if (user && isDespegaRoute && !isA3Route && !isInterview0Route) {
      try {
        // Check if user is accessing an A2 day page
        const pathMatch = request.nextUrl.pathname.match(/\/despega\/a2\/dia-(\d+)/)
        if (pathMatch) {
          const requestedDay = parseInt(pathMatch[1])

          // Get user's current A2 progress
          const { data: progress } = await supabase
            .from('despega_pilar_progress')
            .select('ciclo_dia, is_a2_pilar_complete, is_a3_unlocked')
            .eq('user_id', user.id)
            .eq('pilar', 'a2_rutas')
            .single()

          // Smart redirect logic
          if (progress) {
            // If A2 is complete, redirect to A3 dashboard
            if (progress.is_a2_pilar_complete && !progress.is_a3_unlocked) {
              const url = request.nextUrl.clone()
              url.pathname = '/despega/a3'
              return NextResponse.redirect(url)
            }

            // If trying to access a future day, redirect to current day
            if (requestedDay > progress.ciclo_dia && !progress.is_a2_pilar_complete) {
              const url = request.nextUrl.clone()
              url.pathname = `/despega/a2/dia-${progress.ciclo_dia}`
              return NextResponse.redirect(url)
            }

            // If accessing past day but still in A2, allow
            if (requestedDay <= progress.ciclo_dia) {
              return supabaseResponse
            }
          }
        }

        // Redirect to A2 dashboard if accessing /despega without a specific day
        if (request.nextUrl.pathname === '/despega' || request.nextUrl.pathname === '/despega/') {
          const { data: progress } = await supabase
            .from('despega_pilar_progress')
            .select('ciclo_dia, is_a2_pilar_complete')
            .eq('user_id', user.id)
            .eq('pilar', 'a2_rutas')
            .single()

          if (progress && progress.is_a2_pilar_complete) {
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
      } catch (err) {
        // If redirect logic fails, continue without redirect
        console.log('[v0] Smart redirect middleware failed (continuing normally)', err)
      }
    }
  } catch (error) {
    // If auth fails (build time or missing env vars), just continue without auth
    console.log('[v0] Auth middleware skipped (likely build time)')
  }

  // IMPORTANT: Return the supabaseResponse object as is to maintain session state
  return supabaseResponse
}
