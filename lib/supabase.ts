import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// Mock Supabase client for development
const mockSupabaseClient = {
  auth: {
    getSession: async () => ({
      data: { session: null },
      error: null,
    }),
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // Mock authentication logic
      if (email === "demo@example.com") {
        return {
          data: {
            user: {
              id: "demo-user",
              email: "demo@example.com",
              user_metadata: { name: "Usuario Demo" },
            },
          },
          error: null,
        }
      }
      return { data: { user: null }, error: { message: "Invalid credentials" } }
    },
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
      return {
        data: {
          user: {
            id: `user-${Date.now()}`,
            email,
            user_metadata: options?.data || {},
          },
        },
        error: null,
      }
    },
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: null }),
        limit: (count: number) => ({ data: [], error: null }),
      }),
      order: (column: string, options?: any) => ({
        limit: (count: number) => ({ data: [], error: null }),
      }),
    }),
    insert: async (data: any) => ({ data, error: null }),
    update: async (data: any) => ({ data, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
  rpc: async (functionName: string, params?: any) => ({ data: null, error: null }),
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

// Server-side client for API routes
export function createServerClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Export the client instance
export const supabase = createClient()

// Mock data for development
const mockUsers = [
  {
    id: "1",
    email: "demo@example.com",
    name: "Demo User",
    password: "demo123",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "travis@example.com",
    name: "Travis Johnson",
    password: "demo123",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    email: "admin@example.com",
    name: "Admin User",
    password: "demo123",
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    email: "guest@example.com",
    name: "Guest User",
    password: "demo123",
    created_at: new Date().toISOString(),
  },
]

const mockTestQuestions = {
  disc: [
    {
      id: 1,
      question: "¿Cómo prefieres abordar los desafíos en el trabajo?",
      options: [
        "Tomo el control y actúo rápidamente",
        "Analizo todas las opciones antes de decidir",
        "Busco el consenso del equipo",
        "Sigo los procedimientos establecidos",
      ],
    },
    {
      id: 2,
      question: "En una reunión de equipo, tiendes a:",
      options: [
        "Liderar la discusión",
        "Hacer preguntas para entender mejor",
        "Escuchar y apoyar a otros",
        "Tomar notas detalladas",
      ],
    },
  ],
  "big-five": [
    {
      id: 1,
      question: "Me considero una persona extrovertida y entusiasta",
      type: "likert",
      scale: 5,
    },
    {
      id: 2,
      question: "Tiendo a ser crítico con otros",
      type: "likert",
      scale: 5,
    },
  ],
  mbti: [
    {
      id: 1,
      question: "¿Qué te energiza más?",
      options: ["Interactuar con muchas personas", "Tiempo a solas para reflexionar"],
    },
    {
      id: 2,
      question: "¿Cómo prefieres procesar información?",
      options: [
        "A través de los cinco sentidos y experiencias concretas",
        "A través de patrones, posibilidades e intuición",
      ],
    },
  ],
  riasec: [
    {
      id: 1,
      question: "¿Qué actividades te interesan más?",
      options: [
        "Trabajar con herramientas y maquinaria",
        "Investigar y analizar datos",
        "Crear arte o diseños",
        "Ayudar y enseñar a otros",
        "Liderar y persuadir",
        "Organizar y mantener registros",
      ],
    },
  ],
  "soft-skills": [
    {
      id: 1,
      question: "Describe una situación donde tuviste que liderar un equipo bajo presión",
      type: "open-ended",
    },
    {
      id: 2,
      question: "¿Cómo manejas los conflictos en el trabajo?",
      type: "open-ended",
    },
  ],
}

// Mock authentication functions
export async function signInWithEmail(email: string, password: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (user) {
    return {
      data: {
        user: {
          id: user.id,
          email: user.email,
          user_metadata: { name: user.name },
        },
        session: {
          access_token: "mock-token",
          user: {
            id: user.id,
            email: user.email,
            user_metadata: { name: user.name },
          },
        },
      },
      error: null,
    }
  }

  return {
    data: { user: null, session: null },
    error: { message: "Invalid credentials" },
  }
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const existingUser = mockUsers.find((u) => u.email === email)

  if (existingUser) {
    return {
      data: { user: null, session: null },
      error: { message: "User already exists" },
    }
  }

  const newUser = {
    id: String(mockUsers.length + 1),
    email,
    name,
    password,
    created_at: new Date().toISOString(),
  }

  mockUsers.push(newUser)

  return {
    data: {
      user: {
        id: newUser.id,
        email: newUser.email,
        user_metadata: { name: newUser.name },
      },
      session: {
        access_token: "mock-token",
        user: {
          id: newUser.id,
          email: newUser.email,
          user_metadata: { name: newUser.name },
        },
      },
    },
    error: null,
  }
}

export async function signOut() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    error: null,
  }
}

export async function getSession() {
  // Check localStorage for session
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("career-dev-session")
    if (session) {
      const parsed = JSON.parse(session)
      return {
        data: { session: parsed },
        error: null,
      }
    }
  }

  return {
    data: { session: null },
    error: null,
  }
}

export async function getTestQuestions(testType: string) {
  return {
    data: mockTestQuestions[testType] || [],
    error: null,
  }
}

export async function saveOpenResponse(testType: string, responses: any) {
  return {
    data: { id: Date.now(), test_type: testType, responses },
    error: null,
  }
}

export async function saveTestResult(testType: string, result: any) {
  return {
    data: { id: Date.now(), test_type: testType, result },
    error: null,
  }
}

export async function getUserProfile(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const user = mockUsers.find((u) => u.id === userId)

  if (user) {
    return {
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at,
        test_results: [],
        coaching_sessions: [],
      },
      error: null,
    }
  }

  return {
    data: null,
    error: { message: "User not found" },
  }
}

export async function getTestResults(userId: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock test results
  return {
    data: [
      {
        id: "1",
        test_type: "disc",
        results: { D: 85, I: 60, S: 40, C: 70 },
        completed_at: new Date().toISOString(),
      },
      {
        id: "2",
        test_type: "big-five",
        results: {
          openness: 75,
          conscientiousness: 80,
          extraversion: 65,
          agreeableness: 70,
          neuroticism: 30,
        },
        completed_at: new Date().toISOString(),
      },
    ],
    error: null,
  }
}

// Export default client for compatibility
export default createClient
