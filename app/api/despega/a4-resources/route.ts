import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const type = searchParams.get("type")

    console.log("[v0] Fetching A4 resources, category:", category, "type:", type)

    // Fetch available resources
    let query = supabase
      .from("a4_resource_library")
      .select("*")
      .eq("is_active", true)

    if (category) query = query.eq("category", category)
    if (type) query = query.eq("resource_type", type)

    const { data: resources, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    // Get user's saved resources
    const { data: saved } = await supabase
      .from("a4_user_saved_resources")
      .select("resource_id")
      .eq("user_id", user.id)

    const savedIds = new Set(saved?.map(s => s.resource_id) || [])

    // Enrich with save status
    const enrichedResources = resources.map(resource => ({
      ...resource,
      isSaved: savedIds.has(resource.id)
    }))

    return NextResponse.json({ resources: enrichedResources })
  } catch (error) {
    console.error("[v0] A4 resources API error:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { resourceId, action } = await req.json()

    console.log("[v0] Resource action:", action, "resource:", resourceId)

    if (action === "save") {
      const { data, error } = await supabase
        .from("a4_user_saved_resources")
        .insert([
          {
            user_id: user.id,
            resource_id: resourceId,
            saved_at: new Date().toISOString()
          }
        ])
        .select()

      if (error && error.code !== "23505") throw error

      // Update points
      const { data: progress } = await supabase
        .from("despega_pilar_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("pilar", "a4")
        .single()

      if (progress) {
        await supabase
          .from("despega_pilar_progress")
          .update({ score: (progress.score || 0) + 5 })
          .eq("id", progress.id)
      }

      return NextResponse.json({ success: true, pointsEarned: 5 })
    } else if (action === "unsave") {
      await supabase
        .from("a4_user_saved_resources")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_id", resourceId)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] A4 resource action error:", error)
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 })
  }
}
