import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Create client with proper error handling
export function createClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey || supabaseUrl === "placeholder") {
      console.warn("Supabase credentials not found, using mock client")
      return createMockClient() as any
    }

    return createSupabaseClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } catch (error) {
    console.warn("Supabase client creation failed, using mock client")
    return createMockClient() as any
  }
}

// Lightweight mock client to prevent memory issues
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock successful login for demo purposes
      if (email.includes("demo") || email.includes("test")) {
        return {
          data: {
            user: {
              id: "demo-user",
              email,
              user_metadata: { name: "Demo User" },
            },
            session: { access_token: "mock-token" },
          },
          error: null,
        }
      }
      return { data: { user: null, session: null }, error: { message: "Invalid credentials" } }
    },
    signUp: async ({ email, password, options }: any) => ({
      data: {
        user: {
          id: `user-${Date.now()}`,
          email,
          user_metadata: options?.data || {},
        },
        session: { access_token: "mock-token" },
      },
      error: null,
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: (callback: any) => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: null }),
        limit: (count: number) => ({ data: [], error: null }),
        order: (column: string, options?: any) => ({ data: [], error: null }),
      }),
      order: (column: string, options?: any) => ({ data: [], error: null }),
    }),
    insert: async (data: any) => ({ data, error: null }),
    update: async (data: any) => ({ data, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
  rpc: async (functionName: string, params?: any) => ({ data: null, error: null }),
})

// Create and export the default client instance
export const supabase = createClient()

// Export as default as well for compatibility
export default createClient

// Lightweight interfaces
export interface UserProfile {
  email: string
  full_name: string
  current_level?: number
  total_xp?: number
  tests_completed?: number
  documents_read?: number
}

export interface TestResult {
  id: string
  test_type: string
  results: any
  score: number
  completed_at: string
}

export interface TestQuestion {
  id: number
  test_type: string
  question_number: number
  question_text: string
  options: string | string[]
  correct_answer?: number
  category: string
  question_type: string
  created_at: string
  updated_at: string
}

// Simplified mock functions
export async function getTestQuestions(testType: string): Promise<TestQuestion[]> {
  try {
    const { data, error } = await supabase
      .from("test_questions")
      .select("*")
      .eq("test_type", testType)
      .order("question_number")

    if (error) {
      console.error("Database error:", error)
      return getMockQuestions(testType)
    }

    return (data || []).map((question) => ({
      ...question,
      options: typeof question.options === "string" ? JSON.parse(question.options) : question.options,
    }))
  } catch (error) {
    console.error("Error fetching questions:", error)
    return getMockQuestions(testType)
  }
}

function getMockQuestions(testType: string): TestQuestion[] {
  const mockQuestions: Record<string, TestQuestion[]> = {
    "emotional-intelligence": [
      {
        id: 1,
        test_type: "emotional-intelligence",
        question_number: 1,
        question_text: "¿Cómo reaccionas cuando alguien te critica constructivamente?",
        options: [
          "Me molesto y me pongo a la defensiva",
          "Escucho pero no cambio mi comportamiento",
          "Considero la crítica y reflexiono sobre ella",
          "Agradezco la retroalimentación y busco mejorar",
        ],
        category: "self-awareness",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        test_type: "emotional-intelligence",
        question_number: 2,
        question_text: "Cuando estás muy estresado en el trabajo, ¿qué haces?",
        options: [
          "Exploto y descargo mi frustración con otros",
          "Me quedo callado pero sigo sintiéndome mal",
          "Tomo un descanso para calmarme",
          "Uso técnicas de respiración y manejo del estrés",
        ],
        category: "self-regulation",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        test_type: "emotional-intelligence",
        question_number: 3,
        question_text: "¿Qué te motiva más en tu trabajo?",
        options: [
          "Solo el salario y los beneficios",
          "El reconocimiento de otros",
          "Los desafíos y el crecimiento personal",
          "Hacer una diferencia significativa",
        ],
        category: "motivation",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        test_type: "emotional-intelligence",
        question_number: 4,
        question_text: "Cuando un compañero está visiblemente molesto, ¿cómo respondes?",
        options: [
          "Lo ignoro, no es mi problema",
          "Le pregunto qué pasa pero no profundizo",
          "Trato de entender cómo se siente",
          "Ofrezco apoyo y ayuda específica",
        ],
        category: "empathy",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        test_type: "emotional-intelligence",
        question_number: 5,
        question_text: "En una reunión de equipo con conflicto, ¿cómo actúas?",
        options: [
          "Evito participar en la discusión",
          "Tomo partido por una de las partes",
          "Trato de mediar y encontrar puntos en común",
          "Facilito una solución colaborativa",
        ],
        category: "social-skills",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    "soft-skills": [
      {
        id: 1,
        test_type: "soft-skills",
        question_number: 1,
        question_text: "¿Cómo prefieres comunicar ideas complejas a tu equipo?",
        options: [
          "Uso presentaciones visuales detalladas",
          "Explico verbalmente paso a paso",
          "Combino explicación verbal con ejemplos prácticos",
          "Facilito una discusión interactiva",
        ],
        category: "communication",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        test_type: "soft-skills",
        question_number: 2,
        question_text: "Cuando hay un malentendido en la comunicación, ¿qué haces?",
        options: [
          "Espero que se resuelva solo",
          "Culpo a la otra persona por no entender",
          "Busco aclarar inmediatamente",
          "Analizo qué causó el malentendido y mejoro mi comunicación",
        ],
        category: "communication",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        test_type: "soft-skills",
        question_number: 3,
        question_text: "Describe una situación donde tuviste que comunicar malas noticias. ¿Cómo lo manejaste?",
        options: [],
        category: "communication",
        question_type: "open_ended",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        test_type: "soft-skills",
        question_number: 4,
        question_text: "¿Cómo motivas a un equipo que está desmotivado?",
        options: [
          "Les digo que trabajen más duro",
          "Ofrezco incentivos económicos",
          "Escucho sus preocupaciones y busco soluciones",
          "Inspiro con una visión clara y apoyo individual",
        ],
        category: "leadership",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        test_type: "soft-skills",
        question_number: 5,
        question_text: "En un proyecto de equipo, ¿cuál es tu rol natural?",
        options: [
          "El que toma todas las decisiones",
          "El que ejecuta las tareas asignadas",
          "El que facilita la colaboración",
          "El que aporta ideas creativas y apoya a otros",
        ],
        category: "teamwork",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        test_type: "soft-skills",
        question_number: 6,
        question_text: "Ante un problema complejo sin solución obvia, ¿cuál es tu enfoque?",
        options: [
          "Busco una solución rápida aunque no sea perfecta",
          "Pido ayuda inmediatamente",
          "Analizo el problema desde múltiples ángulos",
          "Uso metodologías estructuradas y busco soluciones innovadoras",
        ],
        category: "problem_solving",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 7,
        test_type: "soft-skills",
        question_number: 7,
        question_text: "¿Cómo reaccionas cuando los planes cambian repentinamente?",
        options: [
          "Me molesto y me resisto al cambio",
          "Me adapto pero con dificultad",
          "Me adapto rápidamente",
          "Veo el cambio como una oportunidad y ayudo a otros a adaptarse",
        ],
        category: "adaptability",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 8,
        test_type: "soft-skills",
        question_number: 8,
        question_text: "¿Cómo manejas el estrés en situaciones de alta presión?",
        options: [
          "Me paralizo y no puedo funcionar",
          "Trabajo más horas para compensar",
          "Uso técnicas de manejo del estrés",
          "Mantengo la calma y ayudo a otros a manejar su estrés también",
        ],
        category: "emotional_intelligence",
        question_type: "multiple_choice",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  }

  return mockQuestions[testType] || []
}

export async function saveOpenResponse(userEmail: string, testType: string, questionId: number, response: string) {
  try {
    const { data, error } = await supabase
      .from("open_responses")
      .insert({
        user_email: userEmail,
        test_type: testType,
        question_id: questionId,
        response: response,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return { data: { id: Date.now() }, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error saving response:", error)
    return { data: { id: Date.now() }, error: null }
  }
}

export async function saveTestResult(userEmail: string, testType: string, results: any, score: number) {
  try {
    const { data, error } = await supabase
      .from("test_results")
      .insert({
        user_email: userEmail,
        test_type: testType,
        test_name: getTestName(testType),
        results,
        score,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return { data: { id: Date.now() }, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error saving result:", error)
    return { data: { id: Date.now() }, error: null }
  }
}

export async function getLatestTestResult(userEmail: string, testType: string): Promise<TestResult | null> {
  try {
    const { data, error } = await supabase
      .from("test_results")
      .select("*")
      .eq("user_email", userEmail)
      .eq("test_type", testType)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        // No results found
        return null
      }
      console.error("Database error:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching result:", error)
    return null
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
