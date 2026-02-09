import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest, { params }: { params: { testType: string } }) {
  try {
    const { testType } = params
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")

    if (!testType || !userEmail) {
      return NextResponse.json(
        { error: "Test type and user email required" },
        { status: 400 },
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Fetch most recent progress snapshot
    const { data, error } = await supabase
      .from("test_progress_snapshots")
      .select("*")
      .eq("user_email", userEmail)
      .eq("test_type", testType)
      .gt("expires_at", new Date().toISOString())
      .order("last_updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return NextResponse.json({ snapshot: null })
    }

    return NextResponse.json({
      snapshot: {
        id: data.id,
        testType: data.test_type,
        currentQuestion: data.current_question,
        totalQuestions: data.total_questions,
        durationMinutes: data.duration_so_far_minutes,
        lastUpdatedAt: data.last_updated_at,
      },
    })
  } catch (e: any) {
    console.error("[v0] Exception in test-progress:", e)
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { testType: string } }) {
  try {
    const { testType } = params
    const {
      userEmail,
      sessionId,
      currentQuestion,
      totalQuestions,
      answersComplete,
      durationMinutes,
    } = await request.json()

    if (!testType || !userEmail || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Save progress snapshot
    const { data, error } = await supabase
      .from("test_progress_snapshots")
      .upsert({
        user_email: userEmail,
        test_type: testType,
        session_id: sessionId,
        current_question: currentQuestion,
        total_questions: totalQuestions,
        answers_so_far: answersComplete,
        duration_so_far_minutes: durationMinutes,
        last_updated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving progress:", error)
      return NextResponse.json(
        { error: "Failed to save progress" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      snapshotId: data.id,
    })
  } catch (e: any) {
    console.error("[v0] Exception in test-progress POST:", e)
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { testType: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 },
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Delete progress snapshot
    const { error } = await supabase
      .from("test_progress_snapshots")
      .delete()
      .eq("session_id", sessionId)

    if (error) {
      console.error("[v0] Error deleting progress:", error)
      return NextResponse.json(
        { error: "Failed to delete progress" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error("[v0] Exception in test-progress DELETE:", e)
    return NextResponse.json(
      { error: e.message || "Internal server error" },
      { status: 500 },
    )
  }
}
