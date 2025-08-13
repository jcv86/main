import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createServerClient as createSupabaseServerClient, type CookieOptions } from "@supabase/ssr"

// Environment variables with proper fallbacks and validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validate required environment variables
if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Client for browser usage
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Named export for createClient (required by the app)
export const createClient = () =>
  createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

// Server-side client creation function
export function createServerClient(cookieStore: any) {
  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// Admin client for server-side operations (only use on server)
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("Admin client should only be used on the server side")
  }

  if (!supabaseServiceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations")
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Legacy exports for backward compatibility
export const supabaseAdmin = supabaseServiceRoleKey
  ? createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "user" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "admin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "admin"
          created_at?: string
          updated_at?: string
        }
      }
      cv_data: {
        Row: {
          id: string
          user_id: string
          personal_info: any
          experience: any[]
          education: any[]
          skills: any[]
          projects: any[]
          certifications: any[]
          languages: any[]
          references: any[]
          template: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          personal_info?: any
          experience?: any[]
          education?: any[]
          skills?: any[]
          projects?: any[]
          certifications?: any[]
          languages?: any[]
          references?: any[]
          template?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          personal_info?: any
          experience?: any[]
          education?: any[]
          skills?: any[]
          projects?: any[]
          certifications?: any[]
          languages?: any[]
          references?: any[]
          template?: string
          created_at?: string
          updated_at?: string
        }
      }
      test_results: {
        Row: {
          id: string
          user_id: string
          test_type: "disc" | "big_five" | "soft_skills" | "technical_skills"
          results: any
          score: number
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          test_type: "disc" | "big_five" | "soft_skills" | "technical_skills"
          results: any
          score?: number
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          test_type?: "disc" | "big_five" | "soft_skills" | "technical_skills"
          results?: any
          score?: number
          completed_at?: string
          created_at?: string
        }
      }
      coaching_conversations: {
        Row: {
          id: string
          user_id: string
          messages: any[]
          topic: string
          status: "active" | "completed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages?: any[]
          topic?: string
          status?: "active" | "completed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: any[]
          topic?: string
          status?: "active" | "completed"
          created_at?: string
          updated_at?: string
        }
      }
      library_books: {
        Row: {
          id: string
          title: string
          author: string
          description: string
          cover_image: string
          category: string
          difficulty: "Beginner" | "Intermediate" | "Advanced"
          estimated_reading_time: number
          tags: string[]
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          description: string
          cover_image: string
          category: string
          difficulty: "Beginner" | "Intermediate" | "Advanced"
          estimated_reading_time: number
          tags?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          description?: string
          cover_image?: string
          category?: string
          difficulty?: "Beginner" | "Intermediate" | "Advanced"
          estimated_reading_time?: number
          tags?: string[]
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      book_chapters: {
        Row: {
          id: string
          book_id: string
          chapter_number: number
          title: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          chapter_number: number
          title: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          chapter_number?: number
          title?: string
          content?: string
          created_at?: string
        }
      }
      user_book_progress: {
        Row: {
          id: string
          user_id: string
          book_id: string
          current_chapter: number
          progress_percentage: number
          last_read_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          current_chapter?: number
          progress_percentage?: number
          last_read_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          current_chapter?: number
          progress_percentage?: number
          last_read_at?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_book_bookmarks: {
        Row: {
          id: string
          user_id: string
          book_id: string
          chapter_id: string
          position: number
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          chapter_id: string
          position: number
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          chapter_id?: string
          position?: number
          note?: string | null
          created_at?: string
        }
      }
      mirix_memories: {
        Row: {
          id: string
          user_id: string
          content: string
          memory_type: "fact" | "skill" | "experience" | "insight"
          source: string
          tags: string[]
          importance_score: number
          last_accessed: string
          access_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          memory_type: "fact" | "skill" | "experience" | "insight"
          source: string
          tags?: string[]
          importance_score?: number
          last_accessed?: string
          access_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          memory_type?: "fact" | "skill" | "experience" | "insight"
          source?: string
          tags?: string[]
          importance_score?: number
          last_accessed?: string
          access_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: "career" | "skill" | "personal" | "financial"
          priority: "low" | "medium" | "high"
          status: "not_started" | "in_progress" | "completed" | "paused"
          target_date: string | null
          progress_percentage: number
          milestones: any[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: "career" | "skill" | "personal" | "financial"
          priority?: "low" | "medium" | "high"
          status?: "not_started" | "in_progress" | "completed" | "paused"
          target_date?: string | null
          progress_percentage?: number
          milestones?: any[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: "career" | "skill" | "personal" | "financial"
          priority?: "low" | "medium" | "high"
          status?: "not_started" | "in_progress" | "completed" | "paused"
          target_date?: string | null
          progress_percentage?: number
          milestones?: any[]
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          event_type: "meeting" | "interview" | "deadline" | "reminder" | "personal"
          location: string | null
          attendees: string[]
          is_all_day: boolean
          recurrence_rule: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          event_type: "meeting" | "interview" | "deadline" | "reminder" | "personal"
          location?: string | null
          attendees?: string[]
          is_all_day?: boolean
          recurrence_rule?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          event_type?: "meeting" | "interview" | "deadline" | "reminder" | "personal"
          location?: string | null
          attendees?: string[]
          is_all_day?: boolean
          recurrence_rule?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_alerts: {
        Row: {
          id: string
          user_id: string
          title: string
          keywords: string[]
          location: string | null
          salary_min: number | null
          salary_max: number | null
          job_type: string | null
          experience_level: string | null
          is_active: boolean
          frequency: "daily" | "weekly" | "monthly"
          last_sent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          keywords: string[]
          location?: string | null
          salary_min?: number | null
          salary_max?: number | null
          job_type?: string | null
          experience_level?: string | null
          is_active?: boolean
          frequency?: "daily" | "weekly" | "monthly"
          last_sent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          keywords?: string[]
          location?: string | null
          salary_min?: number | null
          salary_max?: number | null
          job_type?: string | null
          experience_level?: string | null
          is_active?: boolean
          frequency?: "daily" | "weekly" | "monthly"
          last_sent?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper functions for common operations
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

export async function saveCVData(userId: string, cvData: any) {
  try {
    const { data, error } = await supabase
      .from("cv_data")
      .upsert({
        user_id: userId,
        ...cvData,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving CV data:", error)
    throw error
  }
}

export async function getCVData(userId: string) {
  try {
    const { data, error } = await supabase.from("cv_data").select("*").eq("user_id", userId).single()
    if (error && error.code !== "PGRST116") throw error
    return data
  } catch (error) {
    console.error("Error getting CV data:", error)
    return null
  }
}

export async function saveTestResults(userId: string, testType: string, results: any, score: number) {
  try {
    const { data, error } = await supabase
      .from("test_results")
      .insert({
        user_id: userId,
        test_type: testType as any,
        results,
        score,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving test results:", error)
    throw error
  }
}

export async function getTestResults(userId: string, testType?: string) {
  try {
    let query = supabase
      .from("test_results")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })

    if (testType) {
      query = query.eq("test_type", testType)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting test results:", error)
    return []
  }
}

export async function getLibraryBooks() {
  try {
    const { data, error } = await supabase.from("library_books").select("*").order("created_at", { ascending: false })
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting library books:", error)
    return []
  }
}

export async function getBookWithChapters(bookId: string) {
  try {
    const { data: book, error: bookError } = await supabase.from("library_books").select("*").eq("id", bookId).single()
    if (bookError) throw bookError

    const { data: chapters, error: chaptersError } = await supabase
      .from("book_chapters")
      .select("*")
      .eq("book_id", bookId)
      .order("chapter_number", { ascending: true })

    if (chaptersError) throw chaptersError

    return { ...book, chapters: chapters || [] }
  } catch (error) {
    console.error("Error getting book with chapters:", error)
    return null
  }
}

export async function getUserBookProgress(userId: string, bookId: string) {
  try {
    const { data, error } = await supabase
      .from("user_book_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  } catch (error) {
    console.error("Error getting user book progress:", error)
    return null
  }
}

export async function updateBookProgress(userId: string, bookId: string, progress: any) {
  try {
    const { data, error } = await supabase
      .from("user_book_progress")
      .upsert({
        user_id: userId,
        book_id: bookId,
        ...progress,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating book progress:", error)
    throw error
  }
}

export async function saveCoachingConversation(userId: string, messages: any[], topic: string) {
  try {
    const { data, error } = await supabase
      .from("coaching_conversations")
      .upsert({
        user_id: userId,
        messages,
        topic,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving coaching conversation:", error)
    throw error
  }
}

export async function getCoachingConversations(userId: string) {
  try {
    const { data, error } = await supabase
      .from("coaching_conversations")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting coaching conversations:", error)
    return []
  }
}

export async function saveMirixMemory(userId: string, memory: any) {
  try {
    const { data, error } = await supabase
      .from("mirix_memories")
      .insert({
        user_id: userId,
        ...memory,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error saving Mirix memory:", error)
    throw error
  }
}

export async function getMirixMemories(userId: string, limit = 50) {
  try {
    const { data, error } = await supabase
      .from("mirix_memories")
      .select("*")
      .eq("user_id", userId)
      .order("importance_score", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting Mirix memories:", error)
    return []
  }
}

export async function createGoal(userId: string, goal: any) {
  try {
    const { data, error } = await supabase
      .from("goals")
      .insert({
        user_id: userId,
        ...goal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating goal:", error)
    throw error
  }
}

export async function getUserGoals(userId: string) {
  try {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting user goals:", error)
    return []
  }
}

export async function updateGoal(goalId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from("goals")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", goalId)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error updating goal:", error)
    throw error
  }
}

export async function createCalendarEvent(userId: string, event: any) {
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        user_id: userId,
        ...event,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating calendar event:", error)
    throw error
  }
}

export async function getUserCalendarEvents(userId: string, startDate?: string, endDate?: string) {
  try {
    let query = supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", userId)
      .order("start_time", { ascending: true })

    if (startDate) {
      query = query.gte("start_time", startDate)
    }

    if (endDate) {
      query = query.lte("end_time", endDate)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting calendar events:", error)
    return []
  }
}

export async function createJobAlert(userId: string, alert: any) {
  try {
    const { data, error } = await supabase
      .from("job_alerts")
      .insert({
        user_id: userId,
        ...alert,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating job alert:", error)
    throw error
  }
}

export async function getUserJobAlerts(userId: string) {
  try {
    const { data, error } = await supabase
      .from("job_alerts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting job alerts:", error)
    return []
  }
}

// Export the typed client
export type SupabaseClient = typeof supabase
export type { Database }

// Default export
export default supabase
