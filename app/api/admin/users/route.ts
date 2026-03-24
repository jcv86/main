import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET - List all users
export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Server configuration error: Missing API credentials" },
        { status: 500 },
      )
    }

    const adminClient = await createClient()

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
    const { email, password, full_name, bio, phone, location, linkedin_url, github_url, whatsapp_phone } = body

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 })
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password is required and must be at least 6 characters" },
        { status: 400 },
      )
    }

    const adminClient = createAdminClient()

    const { data: existingUser } = await adminClient.from("users").select("id").eq("email", email).maybeSingle()

    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 409 })
    }

    console.log("[v0] Creating Supabase Auth account for:", email)
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email so user can login immediately
      user_metadata: {
        full_name: full_name || null,
      },
    })

    if (authError) {
      console.error("[Admin Users API] Error creating auth user:", authError)
      return NextResponse.json({ success: false, error: `Auth error: ${authError.message}` }, { status: 500 })
    }

    if (!authUser.user) {
      return NextResponse.json({ success: false, error: "Failed to create auth user" }, { status: 500 })
    }

    const userId = authUser.user.id
    console.log("[v0] Auth account created with ID:", userId)

    // Create new user in database
    const { data: newUser, error: userError } = await adminClient
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

    if (userError) {
      console.error("[Admin Users API] Error creating user:", userError)
      await adminClient.auth.admin.deleteUser(userId)
      return NextResponse.json({ success: false, error: userError.message }, { status: 500 })
    }

    const { error: profileError } = await adminClient.from("profiles").upsert(
      {
        id: userId,
        email,
        full_name: full_name || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "id",
      },
    )

    if (profileError) {
      console.error("[Admin Users API] Error upserting profile:", profileError)
      await adminClient.from("users").delete().eq("id", userId)
      await adminClient.auth.admin.deleteUser(userId)
      return NextResponse.json(
        { success: false, error: `Failed to create profile: ${profileError.message}` },
        { status: 500 },
      )
    }

    console.log("[v0] User created successfully with auth account")
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
