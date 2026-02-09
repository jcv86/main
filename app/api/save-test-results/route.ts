import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, testType, testResults } = await request.json()

    if (!userId || !userEmail || !testType || !testResults) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Use service role client to bypass RLS
    const supabase = createClient()

    console.log("[v0] Saving test results:", { userId, userEmail, testType })

    const { data, error } = await supabase
      .from("unified_test_results")
      .insert({
        user_id: userId,
        user_email: userEmail,
        test_type: testType,
        test_results: testResults,
      })
      .select()

    if (error) {
      console.error("[v0] Error saving test results:", error.message, error.code, error.details)
      return NextResponse.json(
        { error: error.message || "Failed to save test results" },
        { status: 500 }
      )
    }

    console.log("[v0] Successfully saved test results")
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] Error in save-test-results:", error)
    return NextResponse.json(
      { error: "Error saving test results" },
      { status: 500 }
    )
  }
}
