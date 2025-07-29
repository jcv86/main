import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables. Some features may not work.")
}

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client that will always fail gracefully
    return {
      from: () => ({
        select: () => ({ error: { message: "Supabase not configured" } }),
        insert: () => ({ error: { message: "Supabase not configured" } }),
        update: () => ({ error: { message: "Supabase not configured" } }),
        delete: () => ({ error: { message: "Supabase not configured" } }),
        eq: function () {
          return this
        },
        single: function () {
          return this
        },
        limit: function () {
          return this
        },
        order: function () {
          return this
        },
        or: function () {
          return this
        },
      }),
      rpc: () => ({ error: { message: "Supabase not configured" } }),
      auth: {
        getUser: () => ({ data: { user: null }, error: null }),
        signInWithPassword: () => ({ error: { message: "Supabase not configured" } }),
        signUp: () => ({ error: { message: "Supabase not configured" } }),
        signOut: () => ({ error: null }),
      },
    } as any
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance for direct usage
export const supabase = createClient()
