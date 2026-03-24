import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all prompt versions with their performance metrics
    const { data: prompts, error } = await supabase
      .from("prompt_version_performance")
      .select("*")
      .order("coach_type")
      .order("conversation_category")
      .order("version")

    if (error) throw error

    return NextResponse.json({ prompts })
  } catch (error: any) {
    console.error("[v0] Error fetching prompts:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("prompt_versions")
      .insert({
        coach_type: body.coach_type,
        conversation_category: body.conversation_category,
        version: body.version,
        system_prompt: body.system_prompt,
        welcome_message: body.welcome_message,
        is_active: false, // New variants start inactive
        is_control: false,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] Error creating prompt variant:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from("prompt_versions")
      .update({ is_active: body.is_active })
      .eq("id", body.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error("[v0] Error updating prompt variant:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
