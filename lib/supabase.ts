import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// Database types for better TypeScript support
export interface TestQuestion {
  id: number
  test_type: string
  question_number: number
  question_text: string
  options: string
  correct_answer?: number
  category?: string
  created_at?: string
  updated_at?: string
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
