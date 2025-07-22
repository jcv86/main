import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow all requests (demo mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log("Running in demo mode - Supabase not configured")
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    // Try to get user, but don't fail if Supabase is unavailable
    let user = null
    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.warn("Auth error in middleware:", error.message)
      } else {
        user = authUser
      }
    } catch (error) {
      console.warn("Supabase auth check failed in middleware:", error)
    }

    const { pathname } = request.nextUrl

    // Protected routes that require authentication
    const protectedRoutes = [
      "/dashboard",
      "/profile",
      "/cv-builder",
      "/career-coach",
      "/skills-assessment",
      "/personality-test",
      "/disc-test",
      "/soft-skills-test",
      "/technical-skills-test",
      "/interview-simulator",
      "/job-search",
      "/library",
      "/settings",
    ]

    // Auth routes that should redirect if user is already logged in
    const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"]

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    // In demo mode or if user is not authenticated, redirect to login for protected routes
    if (!user && isProtectedRoute) {
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.set("redirectTo", pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and trying to access auth routes, redirect to dashboard
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.warn("Middleware error, allowing request to proceed:", error)
    return supabaseResponse
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
