import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Mock client for development
export const supabase = createClient()
