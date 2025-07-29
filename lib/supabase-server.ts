import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have the required environment variables
const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey

// Mock server client for demo mode
const createMockServerClient = () => ({
  auth: {
    getUser: () =>
      Promise.resolve({
        data: {
          user: {
            id: "demo-user-id",
            email: "demo@example.com",
            user_metadata: {
              first_name: "Demo",
              last_name: "User",
            },
          },
        },
        error: null,
      }),
    getSession: () =>
      Promise.resolve({
        data: {
          session: {
            user: {
              id: "demo-user-id",
              email: "demo@example.com",
              user_metadata: {
                first_name: "Demo",
                last_name: "User",
              },
            },
          },
        },
        error: null,
      }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: [], error: null }),
    delete: () => Promise.resolve({ data: [], error: null }),
    upsert: () => Promise.resolve({ data: [], error: null }),
  }),
})

export const createClient = () => {
  if (!hasSupabaseCredentials) {
    return createMockServerClient() as any
  }

  const cookieStore = cookies()

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // Handle cookie setting errors in server components
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // Handle cookie removal errors in server components
        }
      },
    },
  })
}

export const isDemoMode = !hasSupabaseCredentials
