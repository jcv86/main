import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export createClient as named export for other uses
export { createClient }

// Database types for better TypeScript support
export interface TestQuestion {
  id: number
  test_type: string
  question_number: number
  question_text: string
  options: string
  correct_answer?: number
  category?: string
  question_type: "multiple_choice" | "open_ended"
  created_at?: string
  updated_at?: string
}

export interface OpenResponse {
  id: number
  user_email: string
  test_type: string
  question_id: number
  response_text: string
  ai_analysis?: any
  created_at: string
  updated_at: string
}

export interface TestResult {
  id: number
  user_email: string
  test_type: string
  results: any
  score: number
  completed_at: string
  created_at?: string
  updated_at?: string
}

export interface UserProfile {
  id: number
  email: string
  user_email: string
  full_name: string
  position: string
  department: string
  experience_years: number
  skills: string[]
  career_goals: string
  current_level: number
  total_xp: number
  documents_read: number
  tests_completed: number
  skills_learned: number
  created_at?: string
  updated_at?: string
}

// Helper functions for database operations
export async function getTestQuestions(testType: string): Promise<TestQuestion[]> {
  const { data, error } = await supabase
    .from("test_questions")
    .select("*")
    .eq("test_type", testType)
    .order("question_number")

  if (error) {
    console.error("Error fetching test questions:", error)
    throw error
  }

  return data || []
}

export async function saveOpenResponse(
  userEmail: string,
  testType: string,
  questionId: number,
  responseText: string,
): Promise<OpenResponse> {
  const { data, error } = await supabase
    .from("open_responses")
    .upsert(
      {
        user_email: userEmail,
        test_type: testType,
        question_id: questionId,
        response_text: responseText,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_email,test_type,question_id",
      },
    )
    .select()
    .single()

  if (error) {
    console.error("Error saving open response:", error)
    throw error
  }

  return data
}

export async function getOpenResponses(userEmail: string, testType: string): Promise<OpenResponse[]> {
  const { data, error } = await supabase
    .from("open_responses")
    .select("*")
    .eq("user_email", userEmail)
    .eq("test_type", testType)

  if (error) {
    console.error("Error fetching open responses:", error)
    throw error
  }

  return data || []
}

export async function saveTestResult(
  userEmail: string,
  testType: string,
  results: any,
  score: number,
): Promise<TestResult> {
  const { data, error } = await supabase
    .from("test_results")
    .insert({
      user_email: userEmail,
      test_type: testType,
      results,
      score,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error saving test result:", error)
    throw error
  }

  return data
}

export async function getUserProfile(email: string): Promise<UserProfile | null> {
  const { data, error } = await supabase.from("user_profiles").select("*").eq("email", email).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    console.error("Error fetching user profile:", error)
    throw error
  }

  return data
}

export async function getTestResult(userEmail: string, testType: string): Promise<TestResult | null> {
  const { data, error } = await supabase
    .from("test_results")
    .select("*")
    .eq("user_email", userEmail)
    .eq("test_type", testType)
    .order("completed_at", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null
    }
    console.error("Error fetching test result:", error)
    throw error
  }

  return data
}

// AI Analysis for open-ended responses
export async function analyzeOpenResponse(responseText: string, category: string): Promise<any> {
  try {
    const response = await fetch("/api/analyze-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: responseText,
        category: category,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.analysis
  } catch (error) {
    console.error("Error analyzing response:", error)
    return null
  }
}
