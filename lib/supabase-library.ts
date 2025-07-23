import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface Book {
  id: string
  title: string
  author: string
  description: string
  category: string
  rating: number
  reading_time: string
  pages: number
  published_year: number
  cover_url: string | null
  tags: string[]
  difficulty: string
  key_topics: string[]
  is_recommended: boolean
  is_free: boolean
  created_at: string
  updated_at: string
}

export interface BookChapter {
  id: string
  book_id: string
  chapter_number: number
  title: string
  content: string
  estimated_reading_minutes: number
  created_at: string
}

export interface UserReadingStats {
  id: string
  user_id: string
  books_read: number
  total_reading_time: number
  reading_streak: number
  points: number
  level: number
  created_at: string
  updated_at: string
}

export interface UserBookProgress {
  id: string
  user_id: string
  book_id: string
  progress_percentage: number
  current_chapter: number
  total_chapters: number
  reading_time_minutes: number
  started_at: string
  last_read_at: string
  created_at: string
  updated_at: string
}

// Mock data for development
export const mockBooks: Book[] = [
  {
    id: "1",
    title: "Hábitos Atómicos",
    author: "James Clear",
    description: "Una guía práctica para formar buenos hábitos y romper los malos.",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    pages: 8,
    published_year: 2018,
    cover_url: "/books/atomic-habits.jpg",
    tags: ["Hábitos", "Productividad", "Autoayuda"],
    difficulty: "Intermedio",
    key_topics: ["Formación de hábitos", "Productividad personal", "Cambio de comportamiento"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Trabajo Profundo",
    author: "Cal Newport",
    description: "Reglas para el éxito enfocado en un mundo distraído.",
    category: "Productividad",
    rating: 4.7,
    reading_time: "3h 5min",
    pages: 6,
    published_year: 2016,
    cover_url: "/books/deep-work.jpg",
    tags: ["Concentración", "Productividad", "Trabajo"],
    difficulty: "Intermedio",
    key_topics: ["Trabajo profundo", "Concentración", "Productividad cognitiva"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    description: "Un enfoque holístico para resolver problemas personales y profesionales.",
    category: "Liderazgo",
    rating: 4.6,
    reading_time: "5h 15min",
    pages: 7,
    published_year: 1989,
    cover_url: "/books/7-habits.jpg",
    tags: ["Liderazgo", "Efectividad", "Desarrollo Personal"],
    difficulty: "Intermedio",
    key_topics: ["Liderazgo personal", "Efectividad", "Principios universales"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Mindset: La Actitud del Éxito",
    author: "Carol S. Dweck",
    description: "Cómo un simple cambio de mentalidad puede transformar tu vida.",
    category: "Desarrollo Personal",
    rating: 4.5,
    reading_time: "3h 45min",
    pages: 5,
    published_year: 2006,
    cover_url: "/books/mindset.jpg",
    tags: ["Mentalidad", "Crecimiento", "Psicología"],
    difficulty: "Fácil",
    key_topics: ["Mentalidad de crecimiento", "Resiliencia", "Aprendizaje"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Inteligencia Emocional",
    author: "Daniel Goleman",
    description: "Por qué puede importar más que el coeficiente intelectual.",
    category: "Habilidades Blandas",
    rating: 4.4,
    reading_time: "4h 20min",
    pages: 6,
    published_year: 1995,
    cover_url: "/books/emotional-intelligence.jpg",
    tags: ["Inteligencia Emocional", "Psicología", "Relaciones"],
    difficulty: "Intermedio",
    key_topics: ["Autoconciencia", "Autorregulación", "Empatía", "Habilidades sociales"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Lean In: Las Mujeres, el Trabajo y la Voluntad de Liderar",
    author: "Sheryl Sandberg",
    description: "Un llamado a la acción para que las mujeres alcancen su potencial completo.",
    category: "Liderazgo",
    rating: 4.3,
    reading_time: "3h 30min",
    pages: 4,
    published_year: 2013,
    cover_url: "/books/lean-in.jpg",
    tags: ["Liderazgo Femenino", "Carrera", "Igualdad"],
    difficulty: "Fácil",
    key_topics: ["Liderazgo femenino", "Desarrollo profesional", "Igualdad de género"],
    is_recommended: false,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    title: "De Buena a Grandiosa",
    author: "Jim Collins",
    description: "Por qué algunas empresas dan el salto... y otras no.",
    category: "Negocios",
    rating: 4.7,
    reading_time: "4h 50min",
    pages: 8,
    published_year: 2001,
    cover_url: "/books/good-to-great.jpg",
    tags: ["Negocios", "Liderazgo", "Estrategia"],
    difficulty: "Avanzado",
    key_topics: ["Liderazgo empresarial", "Transformación organizacional", "Excelencia"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "8",
    title: "La Semana Laboral de 4 Horas",
    author: "Timothy Ferriss",
    description: "Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos.",
    category: "Productividad",
    rating: 4.2,
    reading_time: "3h 15min",
    pages: 5,
    published_year: 2007,
    cover_url: "/books/4-hour-workweek.jpg",
    tags: ["Productividad", "Libertad", "Emprendimiento"],
    difficulty: "Intermedio",
    key_topics: ["Automatización", "Delegación", "Libertad geográfica"],
    is_recommended: false,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "9",
    title: "Conversaciones Cruciales",
    author: "Kerry Patterson, Joseph Grenny, Ron McMillan, Al Switzler",
    description: "Herramientas para hablar cuando hay mucho en juego.",
    category: "Habilidades Blandas",
    rating: 4.6,
    reading_time: "3h 40min",
    pages: 6,
    published_year: 2002,
    cover_url: "/books/crucial-conversations.jpg",
    tags: ["Comunicación", "Conflictos", "Liderazgo"],
    difficulty: "Intermedio",
    key_topics: ["Comunicación efectiva", "Resolución de conflictos", "Diálogo"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "10",
    title: "De Cero a Uno",
    author: "Peter Thiel",
    description: "Notas sobre startups, o cómo construir el futuro.",
    category: "Negocios",
    rating: 4.4,
    reading_time: "2h 45min",
    pages: 4,
    published_year: 2014,
    cover_url: "/books/zero-to-one.jpg",
    tags: ["Startups", "Innovación", "Emprendimiento"],
    difficulty: "Avanzado",
    key_topics: ["Innovación", "Monopolios", "Tecnología"],
    is_recommended: false,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "11",
    title: "El Poder del Ahora",
    author: "Eckhart Tolle",
    description: "Una guía hacia la iluminación espiritual.",
    category: "Desarrollo Personal",
    rating: 4.3,
    reading_time: "3h 20min",
    pages: 5,
    published_year: 1997,
    cover_url: "/books/power-of-now.jpg",
    tags: ["Mindfulness", "Espiritualidad", "Presente"],
    difficulty: "Intermedio",
    key_topics: ["Mindfulness", "Presencia", "Conciencia"],
    is_recommended: false,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "12",
    title: "Lean Startup",
    author: "Eric Ries",
    description: "Cómo los emprendedores de hoy usan la innovación continua para crear negocios radicalmente exitosos.",
    category: "Negocios",
    rating: 4.5,
    reading_time: "4h 10min",
    pages: 7,
    published_year: 2011,
    cover_url: "/books/lean-startup.jpg",
    tags: ["Startups", "Innovación", "Metodología"],
    difficulty: "Intermedio",
    key_topics: ["Metodología lean", "Validación", "Iteración"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const mockUserStats: UserReadingStats = {
  id: "1",
  user_id: "demo-user",
  books_read: 5,
  total_reading_time: 1240, // minutes
  reading_streak: 12,
  points: 2450,
  level: 3,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

// Database functions
export async function getBooks() {
  try {
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getBookById(id: string) {
  try {
    const { data, error } = await supabase.from("books").select("*").eq("id", id).single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getBookChapters(bookId: string) {
  try {
    const { data, error } = await supabase
      .from("book_chapters")
      .select("*")
      .eq("book_id", bookId)
      .order("chapter_number", { ascending: true })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getUserReadingStats(userId: string) {
  try {
    const { data, error } = await supabase.from("user_reading_stats").select("*").eq("user_id", userId).single()

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateUserBookProgress(userId: string, bookId: string, progress: Partial<UserBookProgress>) {
  try {
    const { data, error } = await supabase.from("user_book_progress").upsert({
      user_id: userId,
      book_id: bookId,
      ...progress,
      updated_at: new Date().toISOString(),
    })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function searchBooks(
  query: string,
  filters?: {
    category?: string
    difficulty?: string
    isRecommended?: boolean
  },
) {
  try {
    let queryBuilder = supabase.from("books").select("*")

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
    }

    if (filters?.category) {
      queryBuilder = queryBuilder.eq("category", filters.category)
    }

    if (filters?.difficulty) {
      queryBuilder = queryBuilder.eq("difficulty", filters.difficulty)
    }

    if (filters?.isRecommended) {
      queryBuilder = queryBuilder.eq("is_recommended", filters.isRecommended)
    }

    const { data, error } = await queryBuilder.order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}
