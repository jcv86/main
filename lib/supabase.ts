import { createClient as createSupabaseClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not found, using mock client")
    // Return a mock client for development
    return {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { code: "PGRST116" } }),
            limit: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
        upsert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      }),
      auth: {
        getUser: () =>
          Promise.resolve({
            data: {
              user: {
                id: "11111111-1111-1111-1111-111111111111",
                email: "demo@dtcfinal.com",
              },
            },
            error: null,
          }),
      },
    } as any
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Create the supabase instance
export const supabase = createClient()

// For backward compatibility
export default supabase
