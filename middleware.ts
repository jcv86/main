import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
      },
    )

    // Try to get user, but don't fail if Supabase is unavailable
    let user = null
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()
      user = authUser
    } catch (error) {
      console.warn("Supabase auth check failed in middleware:", error)
      // In demo mode, we'll allow access to protected routes
      // In a real app, you might want to handle this differently
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
      "/settings",
    ]

    // Auth routes that should redirect if user is already logged in
    const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"]

    // Check if the current path is protected
    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    // If user is not logged in and trying to access protected route
    // Only redirect if we're sure Supabase is working and user is definitely not authenticated
    if (!user && isProtectedRoute) {
      // Check if we have a demo session in localStorage (client-side check)
      // For now, we'll allow access in demo mode by not redirecting
      // In a real app, you might want to be more strict
      const redirectUrl = new URL("/auth/login", request.url)
      redirectUrl.searchParams.set("redirectTo", pathname)
      // Uncomment the next line if you want to enforce authentication even in demo mode
      // return NextResponse.redirect(redirectUrl)
    }

    // If user is logged in and trying to access auth routes, redirect to dashboard
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return supabaseResponse
  } catch (error) {
    console.warn("Middleware error, allowing request to proceed:", error)
    // If there's any error in middleware, just let the request proceed
    return NextResponse.next({
      request,
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
