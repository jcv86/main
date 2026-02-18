import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  // Si ya existe una instancia, retornarla
  if (supabaseInstance) {
    return supabaseInstance
  }

  try {
    // NEXT_PUBLIC_* variables are available directly in Next.js
    // They're bundled at build time into the browser bundle
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // En desarrollo sin variables, retornar null sin lanzar error
    // El CoachProvider y otros componentes manejarán esto gracefully
    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        `[v0] Supabase credentials not found. App will work in limited mode.\n` +
        `- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓' : '✗'}\n` +
        `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✓' : '✗'}`
      )
      return null as any
    }

    // Crear instancia única del cliente
    supabaseInstance = createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
      },
      global: {
        fetch: async (url, options = {}) => {
          try {
            const response = await fetch(url, options)
            return response
          } catch (error) {
            // Handle AbortError gracefully - just re-throw it without logging
            if (error instanceof Error && error.name === "AbortError") {
              throw error
            }
            console.error("Supabase fetch failed:", error)
            throw error
          }
        },
      },
    })

    return supabaseInstance
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error("[v0] Supabase client creation failed:", errorMsg)
    // Return null instead of throwing to allow app to continue
    return null as any
  }
}

function getTestName(testType: string): string {
  const testNames: { [key: string]: string } = {
    disc: "Test DISC",
    "big-five": "Big Five",
    mbti: "MBTI",
    riasec: "RIASEC",
    "soft-skills": "Habilidades Blandas",
    "emotional-intelligence": "Inteligencia Emocional",
  }
  return testNames[testType] || testType
}
