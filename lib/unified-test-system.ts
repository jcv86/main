import { createBrowserClient } from "@supabase/ssr"

// Unified Supabase client for all tests
export function getSupabaseClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Test types supported
export type TestType = "DISC Assessment" | "MBTI" | "Big Five" | "RIASEC" | "Soft Skills" | "Emotional Intelligence" | "Despega Cerebral"

// Unified result structure
export interface TestResult {
  test_type: TestType
  user_email: string
  results: any
  completed_at: string
  duration_minutes?: number
  user_context?: {
    current_situation: string
    personal_goals: string
    career_stage: string
    priority_focus: string
  }
}

// Unified save function - ALWAYS saves to database
export async function saveTestResult(
  userEmail: string,
  testType: TestType,
  results: any,
  durationMinutes?: number,
): Promise<{ success: boolean; error?: string; savedToDatabase: boolean; data?: any }> {
  console.log(`[v0] Saving ${testType} test to database for ${userEmail}...`)

  const supabase = getSupabaseClient()

  const testResult: TestResult = {
    test_type: testType,
    user_email: userEmail,
    results,
    completed_at: new Date().toISOString(),
    duration_minutes: durationMinutes,
  }

  // Save to localStorage as cache ONLY
  try {
    localStorage.setItem(`${testType}_results`, JSON.stringify(testResult))
    console.log(`[v0] Cached ${testType} results in localStorage`)
  } catch (e) {
    console.warn("[v0] Failed to cache in localStorage:", e)
  }

  // Save to database - THIS IS REQUIRED
  try {
    // IMPORTANT: Use correct table name a1_tests_results not test_results
    console.log("[v0] Attempting to save to a1_tests_results table...")
    
    const { data, error } = await supabase
      .from("a1_tests_results")
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        user_email: userEmail,
        test_type: testType,
        test_name: testType,
        responses: results.answers || results,
        score: results.score || 0,
        completed_at: testResult.completed_at,
        created_at: testResult.completed_at,
      })
      .select()
      .single()

    if (error) {
      console.error(`[v0] Database error saving ${testType} to a1_tests_results:`, error)
      return {
        success: false,
        error: `Error al guardar en base de datos: ${error.message}. Contacta a soporte.`,
        savedToDatabase: false,
      }
    }

    console.log(`[v0] Successfully saved ${testType} to a1_tests_results table:`, data)

    // Update progress table
    await updateTestProgress(userEmail, testType)

    return { success: true, savedToDatabase: true, data }
  } catch (e: any) {
    console.error(`[v0] Exception saving ${testType}:`, e)
    return {
      success: false,
      error: `Error crítico: ${e.message}. Contacta a soporte.`,
      savedToDatabase: false,
    }
  }
}

// Load test result - database first, localStorage fallback
export async function loadTestResult(
  userEmail: string,
  testType: TestType,
): Promise<{ success: boolean; data?: TestResult; error?: string }> {
  console.log(`[v0] Loading ${testType} test result for ${userEmail}...`)

  const supabase = getSupabaseClient()

  // Try database first - use correct table name
  try {
    const { data, error } = await supabase
      .from("a1_tests_results")
      .select("*")
      .eq("user_email", userEmail)
      .eq("test_type", testType)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single()

    if (!error && data) {
      console.log(`[v0] Loaded ${testType} from a1_tests_results table`, data)
      return {
        success: true,
        data: {
          test_type: testType,
          user_email: data.user_email,
          results: data.responses || data.results,
          completed_at: data.completed_at,
          duration_minutes: data.duration_minutes,
          user_context: data.user_context,
        },
      }
    }

    console.log(`[v0] No ${testType} results in database, checking localStorage`)
  } catch (e: any) {
    console.warn(`[v0] Error loading from a1_tests_results:`, e)
  }

  // Fallback to localStorage
  const localResult = loadFromLocalStorage(testType)
  if (localResult) {
    return { success: true, data: localResult }
  }

  return { success: false, error: "No se encontraron resultados" }
}

// Helper: Load from localStorage
function loadFromLocalStorage(testType: TestType): TestResult | null {
  try {
    const cached = localStorage.getItem(`${testType}_results`)
    if (cached) {
      console.log(`[v0] Loaded ${testType} from localStorage cache`)
      return JSON.parse(cached)
    }
  } catch (e) {
    console.warn("[v0] Failed to load from localStorage:", e)
  }
  return null
}

// Helper: Update test progress after successful save
async function updateTestProgress(userEmail: string, testType: TestType) {
  const supabase = getSupabaseClient()

  try {
    const user = await supabase.auth.getUser()
    if (!user.data.user?.id) {
      console.warn("[v0] No authenticated user for progress update")
      return
    }

    // Update a1_progress table to mark test as completed
    const progressUpdates: any = {}
    const normalizedType = testType.toLowerCase().replace(/\s+/g, "_")
    progressUpdates[`${normalizedType}_completed`] = true

    const { error } = await supabase
      .from("a1_progress")
      .upsert(
        {
          user_id: user.data.user.id,
          ...progressUpdates,
          last_updated: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )

    if (error) {
      console.warn("[v0] Failed to update progress:", error)
    } else {
      console.log(`[v0] Updated a1_progress for ${testType}`)
    }
  } catch (e) {
    console.warn("[v0] Exception updating progress:", e)
  }
}

// Get all completed tests for a user
export async function getCompletedTests(userEmail: string): Promise<TestType[]> {
  const supabase = getSupabaseClient()

  try {
    // Query the correct table
    const { data } = await supabase
      .from("a1_tests_results")
      .select("test_type")
      .eq("user_email", userEmail)

    const completed = data?.map((d) => d.test_type) || []
    console.log(`[v0] Completed tests for ${userEmail}:`, completed)
    
    return completed
  } catch (e) {
    console.warn("[v0] Failed to load completed tests:", e)
    return []
  }
}

export async function updateTestContext(
  userEmail: string,
  testType: TestType,
  context: {
    current_situation: string
    personal_goals: string
    career_stage: string
    priority_focus: string
  },
): Promise<{ success: boolean; error?: string }> {
  console.log(`[v0] Updating ${testType} context for ${userEmail}...`)

  const supabase = getSupabaseClient()

  try {
    const { error } = await supabase
      .from("test_results")
      .update({
        user_context: context,
        personal_goals: context.personal_goals,
        current_situation: context.current_situation,
        career_stage: context.career_stage,
        priority_focus: context.priority_focus,
      })
      .eq("user_email", userEmail)
      .eq("test_type", testType)

    if (error) {
      console.error(`[v0] Error updating context:`, error)
      return { success: false, error: error.message }
    }

    console.log(`[v0] Successfully updated context`)
    return { success: true }
  } catch (e: any) {
    console.error(`[v0] Exception updating context:`, e)
    return { success: false, error: e.message }
  }
}

export async function getTestAttemptNumber(userEmail: string, testType: TestType): Promise<number> {
  const supabase = getSupabaseClient()

  try {
    const { count } = await supabase
      .from("test_results")
      .select("*", { count: "exact", head: true })
      .eq("user_email", userEmail)
      .eq("test_type", testType)

    return (count || 0) + 1
  } catch (e) {
    console.warn("[v0] Failed to get attempt number:", e)
    return 1
  }
}

export const UnifiedTestSystem = {
  saveTestResult,
  loadTestResult,
  getCompletedTests,
  getSupabaseClient,
  updateTestContext,
  getTestAttemptNumber,
}
