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

export interface BookmarkData {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  chapter_number: number
  title: string
  content: string
  position: number
  created_at: string
}

export interface NoteData {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  chapter_number: number
  title: string
  content: string
  selected_text?: string
  position: number
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
    cover_url: "/placeholder.svg?height=400&width=300&text=Hábitos%20Atómicos&bg=3b82f6&color=white",
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
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    description: "Un enfoque holístico para resolver problemas personales y profesionales.",
    category: "Liderazgo",
    rating: 4.6,
    reading_time: "5h 15min",
    pages: 7,
    published_year: 1989,
    cover_url: "/placeholder.svg?height=400&width=300&text=7%20Hábitos&bg=1f2937&color=white",
    tags: ["Liderazgo", "Efectividad", "Desarrollo Personal"],
    difficulty: "Intermedio",
    key_topics: ["Liderazgo personal", "Efectividad", "Principios universales"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Trabajo Profundo",
    author: "Cal Newport",
    description: "Reglas para el éxito enfocado en un mundo distraído.",
    category: "Productividad",
    rating: 4.7,
    reading_time: "3h 5min",
    pages: 6,
    published_year: 2016,
    cover_url: "/placeholder.svg?height=400&width=300&text=Trabajo%20Profundo&bg=1f2937&color=white",
    tags: ["Concentración", "Productividad", "Trabajo"],
    difficulty: "Intermedio",
    key_topics: ["Trabajo profundo", "Concentración", "Productividad cognitiva"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Inteligencia Emocional",
    author: "Daniel Goleman",
    description: "Por qué puede importar más que el coeficiente intelectual.",
    category: "Habilidades Blandas",
    rating: 4.4,
    reading_time: "4h 20min",
    pages: 6,
    published_year: 1995,
    cover_url: "/placeholder.svg?height=400&width=300&text=Inteligencia%20Emocional&bg=10b981&color=white",
    tags: ["Inteligencia Emocional", "Psicología", "Relaciones"],
    difficulty: "Intermedio",
    key_topics: ["Autoconciencia", "Autorregulación", "Empatía", "Habilidades sociales"],
    is_recommended: true,
    is_free: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Lean In",
    author: "Sheryl Sandberg",
    description: "Un llamado a la acción para que las mujeres alcancen su potencial completo.",
    category: "Liderazgo",
    rating: 4.3,
    reading_time: "3h 30min",
    pages: 4,
    published_year: 2013,
    cover_url: "/placeholder.svg?height=400&width=300&text=Lean%20In&bg=ec4899&color=white",
    tags: ["Liderazgo Femenino", "Carrera", "Igualdad"],
    difficulty: "Fácil",
    key_topics: ["Liderazgo femenino", "Desarrollo profesional", "Igualdad de género"],
    is_recommended: false,
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

export async function getUserBookmarks(userId: string, bookId?: string) {
  try {
    let query = supabase.from("user_bookmarks").select("*").eq("user_id", userId)

    if (bookId) {
      query = query.eq("book_id", bookId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function createBookmark(
  userId: string,
  bookId: string,
  chapterId: string,
  bookmark: Partial<BookmarkData>,
) {
  try {
    const { data, error } = await supabase.from("user_bookmarks").insert({
      user_id: userId,
      book_id: bookId,
      chapter_id: chapterId,
      ...bookmark,
      created_at: new Date().toISOString(),
    })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function deleteBookmark(bookmarkId: string) {
  try {
    const { data, error } = await supabase.from("user_bookmarks").delete().eq("id", bookmarkId)

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getUserNotes(userId: string, bookId?: string) {
  try {
    let query = supabase.from("user_notes").select("*").eq("user_id", userId)

    if (bookId) {
      query = query.eq("book_id", bookId)
    }

    const { data, error } = await query.order("updated_at", { ascending: false })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function createNote(userId: string, bookId: string, chapterId: string, note: Partial<NoteData>) {
  try {
    const { data, error } = await supabase.from("user_notes").insert({
      user_id: userId,
      book_id: bookId,
      chapter_id: chapterId,
      ...note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateNote(noteId: string, note: Partial<NoteData>) {
  try {
    const { data, error } = await supabase
      .from("user_notes")
      .update({
        ...note,
        updated_at: new Date().toISOString(),
      })
      .eq("id", noteId)

    return { data, error }
  } catch (error) {
    return { data: null, error }
  }
}

export async function deleteNote(noteId: string) {
  try {
    const { data, error } = await supabase.from("user_notes").delete().eq("id", noteId)

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
