import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data: unlicensed, error } = await supabase.from("unlicensed_content").select("*")

    if (error) throw error

    return NextResponse.json({ unlicensed })
  } catch (error) {
    console.error("Error fetching unlicensed content:", error)
    return NextResponse.json({ error: "Failed to fetch unlicensed content" }, { status: 500 })
  }
}
