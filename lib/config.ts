// Configuration file for environment variables and API keys
// IMPORTANT: Only use server-side environment variables here (without NEXT_PUBLIC_ prefix)
// to avoid exposing sensitive keys to the client

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""

// Add other configuration exports as needed
export const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
