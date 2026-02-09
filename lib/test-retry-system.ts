import { createBrowserClient } from "@supabase/ssr"

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  retryableErrors: ["NETWORK_ERROR", "TIMEOUT", "RATE_LIMIT", "SERVICE_UNAVAILABLE"],
}

export interface RetryAttempt {
  attemptNumber: number
  status: "pending" | "success" | "failed"
  errorMessage?: string
  timestamp: string
  delayMs: number
}

export interface TestSaveWithRetry {
  id: string
  userEmail: string
  testType: string
  testData: any
  attempts: RetryAttempt[]
  currentStatus: "pending" | "success" | "failed"
  nextRetryAt?: string
}

/**
 * Enhanced save function with exponential backoff retry logic
 */
export async function saveTestResultWithRetry(
  userEmail: string,
  testType: string,
  results: any,
  durationMinutes?: number,
): Promise<{ success: boolean; error?: string; attemptCount: number }> {
  console.log(`[v0] Attempting to save ${testType} with retry logic for ${userEmail}...`)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  let lastError: any = null
  let attemptCount = 0

  for (let attempt = 1; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    attemptCount = attempt

    try {
      console.log(`[v0] Save attempt ${attempt}/${RETRY_CONFIG.maxRetries}...`)

      // Save to database
      const { data, error } = await supabase
        .from("test_results")
        .upsert(
          {
            user_email: userEmail,
            test_type: testType,
            results,
            completed_at: new Date().toISOString(),
            duration_minutes: durationMinutes,
          },
          {
            onConflict: "user_email,test_type",
          },
        )
        .select()
        .single()

      if (!error) {
        console.log(`[v0] Successfully saved ${testType} on attempt ${attempt}`)

        // Log successful retry to database
        await logRetryAttempt(userEmail, testType, {
          attemptNumber: attempt,
          status: "success",
          timestamp: new Date().toISOString(),
          delayMs: 0,
        })

        // Save to localStorage as backup
        saveToLocalStorage(userEmail, testType, results)

        return { success: true, attemptCount }
      }

      lastError = error
      console.warn(`[v0] Attempt ${attempt} failed:`, error)

      // Log failed attempt
      await logRetryAttempt(userEmail, testType, {
        attemptNumber: attempt,
        status: attempt === RETRY_CONFIG.maxRetries ? "failed" : "pending",
        errorMessage: error?.message || "Unknown error",
        timestamp: new Date().toISOString(),
        delayMs: calculateBackoffDelay(attempt),
      })

      // Don't retry on last attempt
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoffDelay(attempt)
        console.log(`[v0] Retrying in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    } catch (e: any) {
      lastError = e
      console.error(`[v0] Exception on attempt ${attempt}:`, e)

      // Log exception attempt
      await logRetryAttempt(userEmail, testType, {
        attemptNumber: attempt,
        status: attempt === RETRY_CONFIG.maxRetries ? "failed" : "pending",
        errorMessage: e.message || "Unknown exception",
        timestamp: new Date().toISOString(),
        delayMs: calculateBackoffDelay(attempt),
      })

      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoffDelay(attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  // All retries exhausted - save to local storage and mark for retry
  console.error(
    `[v0] All ${RETRY_CONFIG.maxRetries} attempts failed. Saving locally and scheduling retry.`,
  )

  saveToLocalStorage(userEmail, testType, results)

  // Schedule retry in backend
  try {
    await scheduleBackgroundRetry(userEmail, testType, results)
  } catch (e) {
    console.warn("[v0] Failed to schedule background retry:", e)
  }

  return {
    success: false,
    error: `Failed to save after ${RETRY_CONFIG.maxRetries} attempts. Will retry automatically.`,
    attemptCount,
  }
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(attempt: number): number {
  const delay = Math.min(
    RETRY_CONFIG.initialDelayMs * Math.pow(RETRY_CONFIG.backoffMultiplier, attempt - 1),
    RETRY_CONFIG.maxDelayMs,
  )
  return delay + Math.random() * 1000 // Add jitter
}

/**
 * Log retry attempt to database
 */
async function logRetryAttempt(
  userEmail: string,
  testType: string,
  attempt: RetryAttempt,
): Promise<void> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    // Get or create retry record
    const { data: existing } = await supabase
      .from("test_save_retries")
      .select("*")
      .eq("user_email", userEmail)
      .eq("test_type", testType)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    const attempts = existing?.attempts || []
    attempts.push(attempt)

    const nextRetryDelay = attempt.status === "failed" ? calculateBackoffDelay(attempts.length) : null
    const nextRetryAt =
      attempt.status === "failed"
        ? new Date(Date.now() + (nextRetryDelay || 0)).toISOString()
        : null

    await supabase.from("test_save_retries").upsert({
      user_email: userEmail,
      test_type: testType,
      attempt_number: attempts.length,
      status: attempt.status,
      error_message: attempt.errorMessage,
      test_data: existing?.test_data || {},
      created_at: existing?.created_at || new Date().toISOString(),
      last_retry_at: new Date().toISOString(),
      next_retry_at: nextRetryAt,
      retry_delay_ms: attempt.delayMs,
    })
  } catch (e) {
    console.warn("[v0] Failed to log retry attempt:", e)
  }
}

/**
 * Save test data to localStorage with expiration
 */
function saveToLocalStorage(userEmail: string, testType: string, results: any): void {
  try {
    const data = {
      userEmail,
      testType,
      results,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    localStorage.setItem(`test_retry_${testType}_${userEmail}`, JSON.stringify(data))
    console.log(`[v0] Saved ${testType} to localStorage for retry`)
  } catch (e) {
    console.warn("[v0] Failed to save to localStorage:", e)
  }
}

/**
 * Schedule background retry via API
 */
async function scheduleBackgroundRetry(
  userEmail: string,
  testType: string,
  testData: any,
): Promise<void> {
  try {
    const response = await fetch("/api/schedule-test-retry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userEmail,
        testType,
        testData,
        scheduledFor: new Date(Date.now() + 60000).toISOString(), // Retry in 1 minute
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    console.log("[v0] Background retry scheduled successfully")
  } catch (e) {
    console.error("[v0] Failed to schedule background retry:", e)
  }
}

/**
 * Recover test data from localStorage
 */
export function recoverTestDataFromLocalStorage(
  testType: string,
  userEmail: string,
): any | null {
  try {
    const key = `test_retry_${testType}_${userEmail}`
    const stored = localStorage.getItem(key)

    if (!stored) return null

    const data = JSON.parse(stored)

    // Check if expired
    if (new Date(data.expiresAt) < new Date()) {
      localStorage.removeItem(key)
      console.log(`[v0] Recovered test data expired, removed from localStorage`)
      return null
    }

    console.log(`[v0] Recovered ${testType} data from localStorage`)
    return data.results
  } catch (e) {
    console.warn("[v0] Failed to recover from localStorage:", e)
    return null
  }
}

/**
 * Get retry status for a test
 */
export async function getRetryStatus(
  userEmail: string,
  testType: string,
): Promise<TestSaveWithRetry | null> {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data } = await supabase
      .from("test_save_retries")
      .select("*")
      .eq("user_email", userEmail)
      .eq("test_type", testType)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!data) return null

    return {
      id: data.id,
      userEmail: data.user_email,
      testType: data.test_type,
      testData: data.test_data,
      attempts: data.attempts || [],
      currentStatus: data.status,
      nextRetryAt: data.next_retry_at,
    }
  } catch (e) {
    console.warn("[v0] Failed to get retry status:", e)
    return null
  }
}

export const TestRetrySystem = {
  saveTestResultWithRetry,
  recoverTestDataFromLocalStorage,
  getRetryStatus,
}
