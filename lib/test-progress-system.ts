import { createBrowserClient } from "@supabase/ssr"

export interface ProgressSnapshot {
  id: string
  userEmail: string
  testType: string
  sessionId: string
  currentQuestion: number
  totalQuestions: number
  answersComplete: Record<number, any>
  durationMinutes: number
  createdAt: string
  lastUpdatedAt: string
  expiresAt: string
}

/**
 * Save progress snapshot when user pauses or closes test
 */
export async function saveProgressSnapshot(
  userEmail: string,
  testType: string,
  sessionId: string,
  currentQuestion: number,
  totalQuestions: number,
  answersComplete: Record<number, any>,
  durationMinutes: number,
): Promise<{ success: boolean; snapshotId?: string; error?: string }> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    console.log(
      `[v0] Saving progress snapshot at question ${currentQuestion}/${totalQuestions}`,
    )

    const { data, error } = await supabase
      .from("test_progress_snapshots")
      .upsert(
        {
          user_email: userEmail,
          test_type: testType,
          session_id: sessionId,
          current_question: currentQuestion,
          total_questions: totalQuestions,
          answers_so_far: answersComplete,
          duration_so_far_minutes: durationMinutes,
          last_updated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        },
        {
          onConflict: "session_id",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving snapshot:", error)
      return { success: false, error: error.message }
    }

    console.log(`[v0] Progress snapshot saved: ${data.id}`)
    return { success: true, snapshotId: data.id }
  } catch (e: any) {
    console.error("[v0] Exception saving progress snapshot:", e)
    return { success: false, error: e.message }
  }
}

/**
 * Load progress snapshot to resume interrupted test
 */
export async function loadProgressSnapshot(
  userEmail: string,
  testType: string,
  sessionId?: string,
): Promise<ProgressSnapshot | null> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    let query = supabase
      .from("test_progress_snapshots")
      .select("*")
      .eq("user_email", userEmail)
      .eq("test_type", testType)

    // If session ID provided, get that specific snapshot
    if (sessionId) {
      query = query.eq("session_id", sessionId)
    }

    // Otherwise get most recent snapshot
    const { data, error } = await query
      .order("last_updated_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.log(`[v0] No progress snapshot found for ${testType}`)
      return null
    }

    // Check if expired
    if (new Date(data.expires_at) < new Date()) {
      console.log("[v0] Progress snapshot expired, cleaning up")
      await supabase
        .from("test_progress_snapshots")
        .delete()
        .eq("id", data.id)
      return null
    }

    console.log(
      `[v0] Loaded progress snapshot at question ${data.current_question}/${data.total_questions}`,
    )

    return {
      id: data.id,
      userEmail: data.user_email,
      testType: data.test_type,
      sessionId: data.session_id,
      currentQuestion: data.current_question,
      totalQuestions: data.total_questions,
      answersComplete: data.answers_so_far,
      durationMinutes: data.duration_so_far_minutes,
      createdAt: data.created_at,
      lastUpdatedAt: data.last_updated_at,
      expiresAt: data.expires_at,
    }
  } catch (e: any) {
    console.error("[v0] Exception loading progress snapshot:", e)
    return null
  }
}

/**
 * Clear progress snapshot when test is completed
 */
export async function clearProgressSnapshot(sessionId: string): Promise<void> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    await supabase
      .from("test_progress_snapshots")
      .delete()
      .eq("session_id", sessionId)

    console.log("[v0] Progress snapshot cleared")
  } catch (e) {
    console.warn("[v0] Failed to clear progress snapshot:", e)
  }
}

/**
 * Get all active snapshots for a user
 */
export async function getActiveSnapshots(userEmail: string): Promise<ProgressSnapshot[]> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data, error } = await supabase
      .from("test_progress_snapshots")
      .select("*")
      .eq("user_email", userEmail)
      .gt("expires_at", new Date().toISOString())
      .order("last_updated_at", { ascending: false })

    if (error) {
      console.warn("[v0] Error fetching active snapshots:", error)
      return []
    }

    return (data || []).map((d) => ({
      id: d.id,
      userEmail: d.user_email,
      testType: d.test_type,
      sessionId: d.session_id,
      currentQuestion: d.current_question,
      totalQuestions: d.total_questions,
      answersComplete: d.answers_so_far,
      durationMinutes: d.duration_so_far_minutes,
      createdAt: d.created_at,
      lastUpdatedAt: d.last_updated_at,
      expiresAt: d.expires_at,
    }))
  } catch (e) {
    console.warn("[v0] Exception getting active snapshots:", e)
    return []
  }
}

/**
 * Cleanup expired snapshots
 */
export async function cleanupExpiredSnapshots(): Promise<number> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data: expiredSnapshots, error: fetchError } = await supabase
      .from("test_progress_snapshots")
      .select("id")
      .lt("expires_at", new Date().toISOString())

    if (fetchError || !expiredSnapshots) return 0

    if (expiredSnapshots.length === 0) return 0

    const { error: deleteError } = await supabase
      .from("test_progress_snapshots")
      .delete()
      .lt("expires_at", new Date().toISOString())

    if (deleteError) {
      console.warn("[v0] Error deleting expired snapshots:", deleteError)
      return 0
    }

    console.log(`[v0] Cleaned up ${expiredSnapshots.length} expired snapshots`)
    return expiredSnapshots.length
  } catch (e) {
    console.warn("[v0] Exception cleaning up expired snapshots:", e)
    return 0
  }
}

export const TestProgressSystem = {
  saveProgressSnapshot,
  loadProgressSnapshot,
  clearProgressSnapshot,
  getActiveSnapshots,
  cleanupExpiredSnapshots,
}
