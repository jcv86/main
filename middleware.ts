import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
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
  matcher: ["/api/:path*"],
}
