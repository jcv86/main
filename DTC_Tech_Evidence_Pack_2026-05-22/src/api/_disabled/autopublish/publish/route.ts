import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt_version_id } = await request.json()
    const supabase = await createClient()

    // Mark the prompt version as published
    const { error: updateError } = await supabase
      .from("prompt_versions")
      .update({ is_published: true })
      .eq("id", prompt_version_id)

    if (updateError) throw updateError

    // Log the publication in history
    const { error: historyError } = await supabase.from("autopublish_history").insert({
      new_prompt_version_id: prompt_version_id,
      status: "published",
      triggered_by: "manual",
      published_at: new Date().toISOString(),
    })

    if (historyError) throw historyError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error publishing prompt:", error)
    return NextResponse.json({ error: "Failed to publish" }, { status: 500 })
  }
}
