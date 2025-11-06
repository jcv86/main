import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user ID
    const { data: userData } = await supabase.from("users").select("id").eq("email", user.email).single()

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch user's documents
    const { data: documents, error: docsError } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false })

    if (docsError) {
      console.error("[v0] Error fetching documents:", docsError)
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("[v0] [Documents API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
