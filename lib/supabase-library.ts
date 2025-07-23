import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for the library system
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
  cover_url: string
  tags: string[]
  difficulty: "Fácil" | "Intermedio" | "Avanzado"
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
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface UserReadingStats {
  id: string
  user_id: string
  books_read: number
  total_reading_time: number
  reading_streak: number
  longest_streak: number
  points: number
  level: number
  created_at: string
  updated_at: string
}

export interface UserBookBookmark {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  position_percentage: number
  note?: string
  created_at: string
}

// Library functions
export async function getBooks(): Promise<{ data: Book[] | null; error: any }> {
  try {
    const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    console.error("Error fetching books:", error)
    return { data: null, error }
  }
}

export async function getBookById(id: string): Promise<{ data: Book | null; error: any }> {
  try {
    const { data, error } = await supabase.from("books").select("*").eq("id", id).single()

    return { data, error }
  } catch (error) {
    console.error("Error fetching book:", error)
    return { data: null, error }
  }
}

export async function getBookChapters(bookId: string): Promise<{ data: BookChapter[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("book_chapters")
      .select("*")
      .eq("book_id", bookId)
      .order("chapter_number", { ascending: true })

    return { data, error }
  } catch (error) {
    console.error("Error fetching book chapters:", error)
    return { data: null, error }
  }
}

export async function getChapterById(id: string): Promise<{ data: BookChapter | null; error: any }> {
  try {
    const { data, error } = await supabase.from("book_chapters").select("*").eq("id", id).single()

    return { data, error }
  } catch (error) {
    console.error("Error fetching chapter:", error)
    return { data: null, error }
  }
}

export async function getUserBookProgress(
  userId: string,
  bookId: string,
): Promise<{ data: UserBookProgress | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("user_book_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .single()

    return { data, error }
  } catch (error) {
    console.error("Error fetching user book progress:", error)
    return { data: null, error }
  }
}

export async function getUserReadingStats(userId: string): Promise<{ data: UserReadingStats | null; error: any }> {
  try {
    const { data, error } = await supabase.from("user_reading_stats").select("*").eq("user_id", userId).single()

    return { data, error }
  } catch (error) {
    console.error("Error fetching user reading stats:", error)
    return { data: null, error }
  }
}

export async function updateUserBookProgress(
  userId: string,
  bookId: string,
  progress: Partial<UserBookProgress>,
): Promise<{ data: UserBookProgress | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("user_book_progress")
      .upsert({
        user_id: userId,
        book_id: bookId,
        ...progress,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error("Error updating user book progress:", error)
    return { data: null, error }
  }
}

export async function getUserBookmarks(
  userId: string,
  bookId: string,
): Promise<{ data: UserBookBookmark[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("user_book_bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .order("created_at", { ascending: false })

    return { data, error }
  } catch (error) {
    console.error("Error fetching user bookmarks:", error)
    return { data: null, error }
  }
}

export async function addBookmark(
  userId: string,
  bookId: string,
  chapterId: string,
  positionPercentage: number,
  note?: string,
): Promise<{ data: UserBookBookmark | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("user_book_bookmarks")
      .insert({
        user_id: userId,
        book_id: bookId,
        chapter_id: chapterId,
        position_percentage: positionPercentage,
        note,
      })
      .select()
      .single()

    return { data, error }
  } catch (error) {
    console.error("Error adding bookmark:", error)
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
): Promise<{ data: Book[] | null; error: any }> {
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

    if (filters?.isRecommended !== undefined) {
      queryBuilder = queryBuilder.eq("is_recommended", filters.isRecommended)
    }

    const { data, error } = await queryBuilder.order("rating", { ascending: false })

    return { data, error }
  } catch (error) {
    console.error("Error searching books:", error)
    return { data: null, error }
  }
}

// Mock data for development (when database is not available)
export const mockBooks: Book[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
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
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Trabajo Profundo",
    author: "Cal Newport",
    description: "Reglas para el éxito enfocado en un mundo distraído.",
    category: "Productividad",
    rating: 4.7,
    reading_time: "4h 45min",
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
]

export const mockUserStats: UserReadingStats = {
  id: "1",
  user_id: "demo-user",
  books_read: 3,
  total_reading_time: 450,
  reading_streak: 7,
  longest_streak: 15,
  points: 1250,
  level: 2,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}
