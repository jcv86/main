import { createBrowserClient, createServerClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables")
  console.log("SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing")
  console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓ Set" : "✗ Missing")
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
})

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  })

// Export createServerClient for server-side usage
export { createServerClient }

// Mock data for Chilean market (fallback when Supabase is not available)
const mockChileanData = {
  conversations: [
    {
      id: "1",
      session_id: "session-1",
      user_id: "user-1",
      role: "assistant",
      content:
        "¡Hola! Soy tu coach de carrera especializado en el mercado laboral chileno. Estoy aquí para ayudarte a navegar tu desarrollo profesional en Chile.\n\n¿En qué puedo ayudarte hoy? Puedo asesorarte sobre:\n🎯 Planificación de carrera en el mercado chileno\n💼 Búsqueda de empleo en Santiago y regiones\n💰 Negociación salarial según estándares locales\n📈 Desarrollo de habilidades demandadas en Chile\n🎤 Preparación para entrevistas\n🚀 Transición a roles de liderazgo",
      message_type: "text",
      created_at: new Date().toISOString(),
    },
  ],
  sessions: [
    {
      id: "session-1",
      user_id: "user-1",
      session_title: "Coaching de Carrera - Mercado Chileno",
      session_summary: "Sesión enfocada en oportunidades profesionales en Chile",
      total_messages: 1,
      last_activity: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
  ],
  jobs: [
    {
      id: "1",
      title: "Desarrollador Full Stack Senior",
      company: "NotCo",
      location: "Santiago, Chile",
      salary_min: 2500000,
      salary_max: 4000000,
      currency: "CLP",
      type: "full-time",
      remote: true,
      description: "Únete al unicornio chileno que está revolucionando la industria alimentaria",
      requirements: ["React", "Node.js", "TypeScript", "AWS", "Inglés intermedio"],
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Tech Lead Frontend",
      company: "Fintual",
      location: "Santiago, Chile",
      salary_min: 3500000,
      salary_max: 5500000,
      currency: "CLP",
      type: "full-time",
      remote: false,
      description: "Lidera el equipo frontend de la fintech más innovadora de Chile",
      requirements: ["React", "TypeScript", "Leadership", "Fintech experience", "Inglés avanzado"],
      created_at: new Date().toISOString(),
    },
  ],
}

export { mockChileanData }

// Demo mode helper - more robust detection
export const isDemoMode = (): boolean => {
  // Check if we're in a browser environment first
  if (typeof window === "undefined") {
    return !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("localhost")
  }

  // In browser, also check if Supabase URL looks like a placeholder
  return (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes("localhost") ||
    supabaseUrl.includes("your-project") ||
    supabaseUrl === "https://your-project.supabase.co"
  )
}

// Helper function to check if Supabase is available - with better error handling
export const isSupabaseAvailable = async (): Promise<boolean> => {
  if (isDemoMode()) {
    return false
  }

  try {
    // Simple connectivity test
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "HEAD",
      headers: {
        apikey: supabaseAnonKey,
      },
    })
    return response.ok
  } catch (error) {
    console.warn("Supabase connectivity test failed:", error)
    return false
  }
}
