import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  // Si ya existe una instancia, retornarla
  if (supabaseInstance) {
    return supabaseInstance
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // En producción, estas variables DEBEN estar configuradas
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        `Supabase credentials not found. Required env vars:\n` +
        `- NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '✓' : '✗'}\n` +
        `- NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '✓' : '✗'}`
      )
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
    console.error("Supabase client creation failed:", errorMsg)
    throw new Error(`Fatal: Cannot initialize Supabase client. ${errorMsg}`)
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
