import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Check if we have valid Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have the required environment variables
const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey

// Demo mode flag
export const isDemoMode = !hasSupabaseCredentials

// Create a mock client for demo mode
const createMockClient = () => ({
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () =>
      Promise.resolve({
        data: { user: null, session: null },
        error: { message: "Demo mode - authentication disabled" },
      }),
    signUp: () =>
      Promise.resolve({
        data: { user: null, session: null },
        error: { message: "Demo mode - authentication disabled" },
      }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: any) => {
      // In demo mode, immediately call with demo user
      setTimeout(() => {
        callback("SIGNED_IN", {
          user: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            email: "demo@example.com",
            user_metadata: {
              first_name: "Demo",
              last_name: "User",
            },
          },
        })
      }, 100)
      return { data: { subscription: { unsubscribe: () => {} } } }
    },
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        limit: (count: number) => Promise.resolve({ data: [], error: null }),
        order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
      }),
      limit: (count: number) => Promise.resolve({ data: [], error: null }),
      order: (column: string, options?: any) => Promise.resolve({ data: [], error: null }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
    }),
    upsert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
    }),
  }),
})

// Export the appropriate client
export const supabase = hasSupabaseCredentials
  ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!)
  : (createMockClient() as any)

// Export createClient function - this was missing!
export function createClient() {
  return hasSupabaseCredentials ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!) : (createMockClient() as any)
}

// Server-side client for API routes
export function createServerClient() {
  return hasSupabaseCredentials
    ? createSupabaseClient(supabaseUrl!, supabaseAnonKey!, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : (createMockClient() as any)
}

// Server-side client for admin operations
export const createAdminClient = () => {
  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          location: string | null
          bio: string | null
          skills: string[] | null
          experience_level: string | null
          industry: string | null
          job_title: string | null
          linkedin_url: string | null
          github_url: string | null
          portfolio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
          skills?: string[] | null
          experience_level?: string | null
          industry?: string | null
          job_title?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          location?: string | null
          bio?: string | null
          skills?: string[] | null
          experience_level?: string | null
          industry?: string | null
          job_title?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cv_data: {
        Row: {
          id: string
          user_id: string
          data: any
          template_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          data: any
          template_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          data?: any
          template_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      soft_skills_assessments: {
        Row: {
          id: string
          user_id: string
          test_type: string
          questions_answered: number
          total_questions: number
          results: any
          ai_feedback: string
          recommendations: any
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_type: string
          questions_answered: number
          total_questions: number
          results: any
          ai_feedback: string
          recommendations: any
          completed_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_type?: string
          questions_answered?: number
          total_questions?: number
          results?: any
          ai_feedback?: string
          recommendations?: any
          completed_at?: string
          created_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Inserts<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type Updates<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
