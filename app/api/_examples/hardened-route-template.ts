import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { RateLimiter } from "@/lib/api-utils"

// Initialize rate limiter (can be upgraded to Redis)
const rateLimiter = new RateLimiter()

/**
 * Example hardened API route template
 * Use this as a pattern for all production APIs
 */

export async function GET(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!rateLimiter.check(ip, 30, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    // 2. Authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 3. Validation
    const { searchParams } = new URL(request.url)
    const resourceId = searchParams.get("id")

    if (!resourceId) {
      return NextResponse.json({ error: "Missing required parameter: id" }, { status: 400 })
    }

    // 4. Query with error handling
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("id", resourceId)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Database error:", error.message)
      return NextResponse.json({ error: "Failed to fetch resource" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("GET error:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    if (!rateLimiter.check(ip, 10, 60000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 })
    }

    // 2. Authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 3. Parse and validate body
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const { title, description } = body

    if (!title) {
      return NextResponse.json({ error: "Missing required field: title" }, { status: 400 })
    }

    // 4. Insert with error handling
    const { data, error } = await supabase
      .from("resources")
      .insert({
        title,
        description,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Insert error:", error.message)
      return NextResponse.json({ error: "Failed to create resource" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("POST error:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
