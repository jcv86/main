import { createClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { id } = await request.json()

    // Get the variant to publish
    const { data: variant, error: fetchError } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) throw fetchError

    // Deactivate all other variants for this coach/category
    await supabase
      .from("prompt_versions")
      .update({ is_active: false, is_control: false })
      .eq("coach_type", variant.coach_type)
      .eq("conversation_category", variant.conversation_category)

    // Activate and set as control
    const { error: updateError } = await supabase
      .from("prompt_versions")
      .update({ is_active: true, is_control: true })
      .eq("id", id)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[v0] Error publishing variant:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
