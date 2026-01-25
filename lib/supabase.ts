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

    if (!supabaseUrl || !supabaseKey || supabaseUrl === "placeholder") {
      console.warn("Supabase credentials not found, using mock client")
      return createMockClient() as any
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
            console.warn("Supabase fetch failed:", error)
            throw error
          }
        },
      },
    })

    return supabaseInstance
  } catch (error) {
    console.warn("Supabase client creation failed, using mock client:", error)
    return createMockClient() as any
  }
}

// Lightweight mock client to prevent memory issues
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const validCredentials: Record<string, string> = {
        "travis@nuanu.com": "travis123",
        "demo@despegaturcarrera.com": "demo123",
        "test@dtc.com": "test123",
        "admin@dtc.com": "admin123",
      }

      const expectedPassword = validCredentials[email]

      if (expectedPassword && expectedPassword === password) {
        return {
          data: {
            user: {
              id:
                email === "travis@nuanu.com"
                  ? "2"
                  : email === "demo@despegaturcarrera.com"
                    ? "1"
                    : email === "test@dtc.com"
                      ? "3"
                      : "4",
              email,
              user_metadata: {
                name:
                  email === "travis@nuanu.com"
                    ? "Travis Herrera"
                    : email === "demo@despegaturcarrera.com"
                      ? "Ana García"
                      : email === "test@dtc.com"
                        ? "Carlos Mendoza"
                        : "María López",
              },
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
        single: async () => {
          // Mock user profile data based on email
          if (table === "user_profiles" && column === "email") {
            return getMockUserProfile(value)
          }
          return { data: null, error: null }
        },
        limit: (count: number) => ({
          order: (orderColumn: string, options?: any) => ({
            data: getMockData(table, value),
            error: null,
          }),
          data: getMockData(table, value),
          error: null,
        }),
        order: (orderColumn: string, options?: any) => ({
          limit: (count: number) => ({
            data: getMockData(table, value),
            error: null,
          }),
          data: getMockData(table, value),
          error: null,
        }),
        data: getMockData(table, value),
        error: null,
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => ({
          data: getMockData(table),
          error: null,
        }),
        data: getMockData(table),
        error: null,
      }),
      limit: (count: number) => ({
        data: getMockData(table),
        error: null,
      }),
      data: getMockData(table),
      error: null,
    }),
    insert: async (data: any) => ({
      select: () => ({
        single: async () => ({
          data: { ...data, id: Date.now().toString(), created_at: new Date().toISOString() },
          error: null,
        }),
      }),
      data: { ...data, id: Date.now().toString() },
      error: null,
    }),
    update: async (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => ({
            data: { ...data, id: Date.now().toString(), updated_at: new Date().toISOString() },
            error: null,
          }),
        }),
        data: { ...data, updated_at: new Date().toISOString() },
        error: null,
      }),
    }),
    delete: async () => ({ data: null, error: null }),
  }),
  rpc: async (functionName: string, params?: any) => ({ data: null, error: null }),
})

function getMockUserProfile(email: string) {
  const profiles = {
    "demo@despegaturcarrera.com": {
      data: {
        id: "1",
        email: "demo@despegaturcarrera.com",
        name: "Ana García",
        user_category: "premium",
        preferences: {
          communicationStyle: "collaborative",
          learningStyle: "kinesthetic",
          careerGoals: ["gerencia", "innovación", "transformación digital"],
          interests: ["marketing digital", "análisis de datos", "liderazgo"],
          skillLevel: "advanced",
          timeAvailability: "high",
        },
        conversation_history: {
          totalMessages: 25,
          topics: ["marketing", "liderazgo", "innovación", "análisis"],
          lastActive: "2024-01-15T10:30:00Z",
          commonQuestions: ["¿Cómo liderar equipos remotos?", "Estrategias de marketing digital"],
          progressTracking: {
            leadership: { currentLevel: 8, targetLevel: 10 },
            marketing: { currentLevel: 9, targetLevel: 10 },
          },
        },
        personality_insights: {
          strengths: ["Liderazgo estratégico", "Innovación", "Comunicación persuasiva", "Análisis de mercado"],
          growthAreas: ["Gestión financiera", "Negociación avanzada"],
          workStyle: "visionario-colaborativo",
          motivators: ["Impacto transformacional", "Crecimiento de equipo", "Innovación disruptiva"],
          stressors: ["Burocracia excesiva", "Resistencia al cambio"],
          communicationPreferences: ["Visual", "Interactivo", "Estratégico"],
        },
        career_profile: {
          currentRole: "Marketing Manager",
          industry: "Tecnología",
          experience: "senior",
          aspirations: ["Directora de Marketing", "VP de Innovación", "Consultora Senior"],
          skillGaps: ["Finanzas corporativas", "Gestión de P&L"],
          networkingStyle: "estratégico-relacional",
        },
        learning_profile: {
          completedBooks: ["Good to Great", "The Lean Startup", "Crossing the Chasm"],
          currentReading: ["Blue Ocean Strategy", "The Innovators Dilemma"],
          preferredFormats: ["audiobook", "interactive", "video"],
          learningPace: "accelerated",
          retentionStyle: "visual-practical",
        },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T10:30:00Z",
      },
      error: null,
    },
    "travis@nuanu.com": {
      data: {
        id: "2",
        email: "travis@nuanu.com",
        name: "Travis Herrera",
        user_category: "enterprise",
        preferences: {
          communicationStyle: "direct",
          learningStyle: "visual",
          careerGoals: ["CTO", "arquitectura empresarial", "transformación digital"],
          interests: ["tecnología", "arquitectura de software", "liderazgo técnico"],
          skillLevel: "expert",
          timeAvailability: "moderate",
        },
        conversation_history: {
          totalMessages: 45,
          topics: ["arquitectura", "liderazgo técnico", "innovación", "estrategia"],
          lastActive: "2024-01-15T14:20:00Z",
          commonQuestions: ["Arquitecturas escalables", "Liderazgo de equipos técnicos"],
          progressTracking: {
            technical_leadership: { currentLevel: 9, targetLevel: 10 },
            architecture: { currentLevel: 10, targetLevel: 10 },
          },
        },
        personality_insights: {
          strengths: ["Arquitectura de sistemas", "Liderazgo técnico", "Visión estratégica", "Innovación tecnológica"],
          growthAreas: ["Comunicación ejecutiva", "Gestión de presupuestos"],
          workStyle: "técnico-visionario",
          motivators: ["Excelencia técnica", "Impacto escalable", "Mentoring"],
          stressors: ["Decisiones no basadas en datos", "Tecnología legacy"],
          communicationPreferences: ["Técnico", "Directo", "Basado en datos"],
        },
        career_profile: {
          currentRole: "Senior Software Architect",
          industry: "Tecnología",
          experience: "expert",
          aspirations: ["CTO", "Principal Architect", "Tech Consultant"],
          skillGaps: ["Gestión ejecutiva", "Comunicación con stakeholders"],
          networkingStyle: "técnico-profesional",
        },
        learning_profile: {
          completedBooks: ["Clean Architecture", "The Phoenix Project", "Accelerate"],
          currentReading: ["Team Topologies", "The Technology Fallacy"],
          preferredFormats: ["digital", "technical", "interactive"],
          learningPace: "intensive",
          retentionStyle: "hands-on-practical",
        },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T14:20:00Z",
      },
      error: null,
    },
    "test@dtc.com": {
      data: {
        id: "3",
        email: "test@dtc.com",
        name: "Carlos Mendoza",
        user_category: "standard",
        preferences: {
          communicationStyle: "supportive",
          learningStyle: "auditory",
          careerGoals: ["coordinación de proyectos", "gestión de equipos", "certificación PMP"],
          interests: ["gestión de proyectos", "metodologías ágiles", "comunicación"],
          skillLevel: "intermediate",
          timeAvailability: "moderate",
        },
        conversation_history: {
          totalMessages: 12,
          topics: ["proyectos", "metodologías", "comunicación"],
          lastActive: "2024-01-15T09:15:00Z",
          commonQuestions: ["Metodologías ágiles", "Gestión de stakeholders"],
          progressTracking: {
            project_management: { currentLevel: 6, targetLevel: 8 },
            communication: { currentLevel: 7, targetLevel: 9 },
          },
        },
        personality_insights: {
          strengths: ["Organización", "Comunicación empática", "Resolución de conflictos"],
          growthAreas: ["Liderazgo asertivo", "Gestión de riesgos"],
          workStyle: "colaborativo-estructurado",
          motivators: ["Trabajo en equipo", "Logro de objetivos", "Desarrollo personal"],
          stressors: ["Conflictos no resueltos", "Plazos irreales"],
          communicationPreferences: ["Empático", "Estructurado", "Inclusivo"],
        },
        career_profile: {
          currentRole: "Project Coordinator",
          industry: "Consultoría",
          experience: "intermediate",
          aspirations: ["Project Manager", "Scrum Master", "Program Manager"],
          skillGaps: ["Certificación PMP", "Gestión financiera de proyectos"],
          networkingStyle: "colaborativo-profesional",
        },
        learning_profile: {
          completedBooks: ["PMBOK Guide", "Scrum: The Art of Doing Twice"],
          currentReading: ["The Lean Startup", "Crucial Conversations"],
          preferredFormats: ["audiobook", "workshop", "peer-learning"],
          learningPace: "steady",
          retentionStyle: "discussion-based",
        },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T09:15:00Z",
      },
      error: null,
    },
    "admin@dtc.com": {
      data: {
        id: "4",
        email: "admin@dtc.com",
        name: "María López",
        user_category: "admin",
        preferences: {
          communicationStyle: "direct",
          learningStyle: "visual",
          careerGoals: ["gestión de usuarios", "administración de sistemas", "seguridad"],
          interests: ["tecnología", "gestión", "seguridad"],
          skillLevel: "expert",
          timeAvailability: "high",
        },
        conversation_history: {
          totalMessages: 30,
          topics: ["administración", "seguridad", "tecnología"],
          lastActive: "2024-01-15T12:00:00Z",
          commonQuestions: ["Seguridad de sistemas", "Gestión de usuarios"],
          progressTracking: {
            system_administration: { currentLevel: 9, targetLevel: 10 },
            security: { currentLevel: 10, targetLevel: 10 },
          },
        },
        personality_insights: {
          strengths: ["Organización", "Comunicación clara", "Resolución de problemas"],
          growthAreas: ["Liderazgo asertivo", "Gestión de riesgos"],
          workStyle: "estructurado",
          motivators: ["Cumplir objetivos", "Desarrollo personal", "Logro de resultados"],
          stressors: ["Conflictos", "Plazos"],
          communicationPreferences: ["Claro", "Directo", "Estructurado"],
        },
        career_profile: {
          currentRole: "System Administrator",
          industry: "Tecnología",
          experience: "expert",
          aspirations: ["IT Manager", "Security Specialist", "Tech Lead"],
          skillGaps: ["Gestión financiera", "Comunicación con stakeholders"],
          networkingStyle: "técnico-profesional",
        },
        learning_profile: {
          completedBooks: [
            "The Web Application Hacker's Handbook",
            "Securing Web Applications",
            "Cybersecurity Essentials",
          ],
          currentReading: ["The Art of Deception", "Hacking: The Art of Exploitation"],
          preferredFormats: ["digital", "technical", "interactive"],
          learningPace: "intensive",
          retentionStyle: "hands-on-practical",
        },
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-15T12:00:00Z",
      },
      error: null,
    },
  }

  return profiles[email as keyof typeof profiles] || { data: null, error: { code: "PGRST116" } }
}

function getMockData(table: string, filterValue?: any) {
  if (table === "ai_insights") {
    return [
      {
        id: "1",
        user_email: "demo@despegaturcarrera.com",
        insight_type: "strength",
        title: "Liderazgo Estratégico Excepcional",
        description:
          "Tu capacidad para liderar con visión estratégica y comunicación persuasiva te posiciona perfectamente para roles de dirección en marketing e innovación.",
        priority: "high",
        progress: 90,
        actionable: true,
        category: "Liderazgo",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "2",
        user_email: "demo@despegaturcarrera.com",
        insight_type: "opportunity",
        title: "Desarrollo en Finanzas Corporativas",
        description:
          "Para alcanzar roles de VP, desarrollar competencias en gestión financiera y P&L será crucial para tu crecimiento.",
        priority: "high",
        progress: 30,
        actionable: true,
        category: "Finanzas",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
      {
        id: "3",
        user_email: "travis@nuanu.com",
        insight_type: "strength",
        title: "Arquitectura y Liderazgo Técnico",
        description:
          "Tu expertise en arquitectura de sistemas combinado con liderazgo técnico te posiciona idealmente para roles de CTO.",
        priority: "high",
        progress: 95,
        actionable: true,
        category: "Técnico",
        created_at: "2024-01-15T14:00:00Z",
        updated_at: "2024-01-15T14:00:00Z",
      },
    ]
  }

  if (table === "ai_conversations") {
    return [
      {
        id: "1",
        user_email: "demo@despegaturcarrera.com",
        message_type: "assistant",
        content: "¡Hola Ana! ¿En qué puedo ayudarte hoy con tu desarrollo profesional?",
        category: "bienvenida",
        suggested_actions: ["Evaluar liderazgo", "Estrategia de marketing", "Plan de carrera"],
        metadata: { confidence: 0.9 },
        created_at: "2024-01-15T10:00:00Z",
      },
    ]
  }

  return []
}

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
