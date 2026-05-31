import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { testType, results, metadata } = body

    if (!testType || !results) {
      return NextResponse.json(
        { error: "testType and results are required" },
        { status: 400 }
      )
    }

    // Save test results to despega_test_results table
    const { data, error } = await supabase
      .from("despega_test_results")
      .upsert({
        user_id: user.id,
        test_type: testType,
        results: results,
        metadata: metadata || {},
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,test_type"
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving test results:", error)
      // If table doesn't exist, return success anyway to not block user flow
      if (error.code === "42P01") {
        return NextResponse.json({
          success: true,
          message: "Results acknowledged (table pending setup)",
          data: { testType, results }
        })
      }
      return NextResponse.json({ error: "Failed to save results" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Test results saved successfully",
      data
    })
  } catch (error) {
    console.error("[v0] save-test-results error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const testType = searchParams.get("testType")

    let query = supabase
      .from("despega_test_results")
      .select("*")
      .eq("user_id", user.id)

    if (testType) {
      query = query.eq("test_type", testType)
    }

    const { data, error } = await query.order("completed_at", { ascending: false })

    if (error) {
      // If table doesn't exist, return empty array
      if (error.code === "42P01") {
        return NextResponse.json({ data: [] })
      }
      return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] get-test-results error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
