import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Lightweight mock client to prevent memory issues
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      if (email === "demo@example.com" || email === "travis@example.com") {
        return {
          data: {
            user: { id: "demo-user", email, user_metadata: { name: "Demo User" } },
            session: { access_token: "mock-token" },
          },
          error: null,
        }
      }
      return { data: { user: null, session: null }, error: { message: "Invalid credentials" } }
    },
    signUp: async ({ email, password, options }: any) => ({
      data: {
        user: { id: `user-${Date.now()}`, email, user_metadata: options?.data || {} },
        session: { access_token: "mock-token" },
      },
      error: null,
    }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: null }),
        limit: (count: number) => ({ data: [], error: null }),
      }),
      order: (column: string, options?: any) => ({ data: [], error: null }),
    }),
    insert: async (data: any) => ({ data, error: null }),
    update: async (data: any) => ({ data, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
  rpc: async (functionName: string, params?: any) => ({ data: null, error: null }),
})

// Create client with proper error handling
export function createClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey && supabaseUrl !== "placeholder") {
      return createSupabaseClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    }
  } catch (error) {
    console.warn("Supabase client creation failed, using mock client")
  }

  return createMockClient() as any
}

export const supabase = createClient()

// Lightweight interfaces
export interface UserProfile {
  email: string
  full_name: string
  current_level?: number
  total_xp?: number
  tests_completed?: number
  documents_read?: number
}

export interface TestResult {
  id: string
  test_type: string
  results: any
  score: number
  completed_at: string
}

export interface TestQuestion {
  id: number
  question_text: string
  question_type: string
  options?: string
  category?: string
}

// Simplified mock functions
export async function getTestQuestions(testType: string): Promise<TestQuestion[]> {
  const mockQuestions: Record<string, TestQuestion[]> = {
    "soft-skills": [
      {
        id: 1,
        question_text: "¿Cómo manejas la presión en el trabajo?",
        question_type: "multiple_choice",
        options: JSON.stringify(["Muy mal", "Mal", "Regular", "Bien"]),
        category: "adaptability",
      },
      {
        id: 2,
        question_text: "Describe una situación donde lideraste un equipo",
        question_type: "open_ended",
        category: "leadership",
      },
    ],
  }

  return mockQuestions[testType] || []
}

export async function saveOpenResponse(userEmail: string, testType: string, questionId: number, response: string) {
  return { data: { id: Date.now() }, error: null }
}

export async function saveTestResult(userEmail: string, testType: string, results: any, score: number) {
  return { data: { id: Date.now() }, error: null }
}

export default createClient
