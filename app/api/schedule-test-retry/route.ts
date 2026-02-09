import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { userEmail, testType, testData, scheduledFor } = await request.json()

    // Validate inputs
    if (!userEmail || !testType || !testData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Schedule retry in test_save_retries table
    const { error } = await supabase.from("test_save_retries").insert({
      user_email: userEmail,
      test_type: testType,
      attempt_number: 1,
      status: "pending",
      test_data: testData,
      next_retry_at: scheduledFor || new Date(Date.now() + 60000).toISOString(),
      retry_delay_ms: 1000,
    })

    if (error) {
      console.error("[v0] Error scheduling retry:", error)
      return NextResponse.json(
        { error: "Failed to schedule retry" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Retry scheduled successfully",
      scheduledFor,
    })
  } catch (e: any) {
    console.error("[v0] Exception in schedule-test-retry:", e)
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 },
    )
  }
}
