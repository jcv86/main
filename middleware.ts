import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Fix double slashes in pathname (e.g., //api/auth/callback/google → /api/auth/callback/google)
  let pathname = request.nextUrl.pathname
  if (pathname.includes('//')) {
    pathname = pathname.replace(/\/+/g, '/')
    const normalizedUrl = new URL(request.nextUrl)
    normalizedUrl.pathname = pathname
    console.log("[v0] Middleware normalized URL from:", request.nextUrl.pathname, "to:", pathname)
    return NextResponse.redirect(normalizedUrl)
  }

  // Check if it's an API route
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Add CORS headers
    const response = NextResponse.next()

    response.headers.set("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Allow-Credentials", "true")

    // Handle preflight requests
    if (request.method === "OPTIONS") {
      return response
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/:path*"],
}
