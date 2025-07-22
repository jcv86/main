import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not found, running in demo mode")
    return null
  }

  try {
    return createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.warn("Cookie setting failed in server component:", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Failed to create Supabase server client:", error)
    return null
  }
}

// Alternative export for compatibility
export const createClient = async () => {
  return await createServerSupabaseClient()
}
