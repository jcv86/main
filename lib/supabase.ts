import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Also export the createClient function for use in other files
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Server-side client for API routes
export function createServerClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
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
          title: string
          template: string
          content: any
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          template: string
          content: any
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          template?: string
          content?: any
          is_active?: boolean
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

// Export the createClient function as well for compatibility
