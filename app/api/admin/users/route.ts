import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-server"

// GET - List all users
export async function GET() {
  try {
    console.log("[v0] Admin Users API - GET request received")

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] Missing Supabase environment variables")
      return NextResponse.json(
        { success: false, error: "Server configuration error: Missing Supabase credentials" },
        { status: 500 },
      )
    }

    const adminClient = createAdminClient()
    console.log("[v0] Admin client created successfully")

    const { data: users, error } = await adminClient.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching users:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log(`[v0] Successfully fetched ${users?.length || 0} users`)
    return NextResponse.json({ success: true, users: users || [] })
  } catch (error) {
    console.error("[v0] Unexpected error in GET /api/admin/users:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 },
    )
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, full_name, bio, phone, location, linkedin_url, github_url, whatsapp_phone } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    const { data: existingUser } = await adminClient.from("users").select("id").eq("email", email).maybeSingle()

    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 409 })
    }

    const userId = crypto.randomUUID()

    // Create new user
    const { data: newUser, error } = await adminClient
      .from("users")
      .insert({
        id: userId,
        email,
        full_name: full_name || null,
        bio: bio || null,
        phone: phone || null,
        location: location || null,
        linkedin_url: linkedin_url || null,
        github_url: github_url || null,
        whatsapp_phone: whatsapp_phone || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[Admin Users API] Error creating user:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("[Admin Users API] Unexpected error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, full_name, bio, phone, location, linkedin_url, github_url, whatsapp_phone } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Update user
    const { data: updatedUser, error } = await adminClient
      .from("users")
      .update({
        full_name: full_name || null,
        bio: bio || null,
        phone: phone || null,
        location: location || null,
        linkedin_url: linkedin_url || null,
        github_url: github_url || null,
        whatsapp_phone: whatsapp_phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[Admin Users API] Error updating user:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error("[Admin Users API] Unexpected error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Delete user
    const { error } = await adminClient.from("users").delete().eq("id", id)

    if (error) {
      console.error("[Admin Users API] Error deleting user:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[Admin Users API] Unexpected error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
