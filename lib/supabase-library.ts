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
  cover_url: string
  tags: string[]
  difficulty: "Fácil" | "Intermedio" | "Avanzado"
  key_topics: string[]
  is_recommended: boolean
  created_at: string
  updated_at: string
}

export interface BookChapter {
  id: string
  book_id: string
  chapter_number: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface UserBookProgress {
  id: string
  user_id: string
  book_id: string
  current_page: number
  progress: number // percentage 0-100
  total_pages: number
  reading_time_minutes: number
  started_at: string
  last_read_at: string
  created_at: string
  updated_at: string
}

export interface UserBookBookmark {
  id: string
  user_id: string
  book_id: string
  page_number: number
  chapter_title: string
  note: string
  created_at: string
}

export interface UserReadingStats {
  id: string
  user_id: string
  books_read: number
  total_reading_time: number // in minutes
  reading_streak: number
  points: number
  level: number
  created_at: string
  updated_at: string
}

// Mock data for development - matches the 3 books in the database
export const mockBooks: Book[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Hábitos Atómicos",
    author: "James Clear",
    description:
      "Un método fácil y comprobado para crear buenos hábitos y eliminar los malos. James Clear revela estrategias prácticas que te enseñarán exactamente cómo formar buenos hábitos, romper los malos y dominar los pequeños comportamientos que llevan a resultados notables.",
    category: "Productividad",
    rating: 4.8,
    reading_time: "4h 30min",
    pages: 320,
    published_year: 2018,
    cover_url: "/placeholder.svg?height=400&width=300&text=Hábitos%20Atómicos&bg=3b82f6&color=white",
    tags: ["Hábitos", "Productividad", "Autoayuda", "Comportamiento"],
    difficulty: "Intermedio",
    key_topics: ["Formación de hábitos", "Productividad personal", "Cambio de comportamiento", "Sistemas vs objetivos"],
    is_recommended: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    description:
      "Lecciones poderosas de cambio personal que han inspirado a millones de personas. Covey presenta un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.",
    category: "Liderazgo",
    rating: 4.6,
    reading_time: "6h 15min",
    pages: 432,
    published_year: 1989,
    cover_url: "/placeholder.svg?height=400&width=300&text=7%20Hábitos&bg=1f2937&color=white",
    tags: ["Liderazgo", "Efectividad", "Desarrollo Personal", "Principios"],
    difficulty: "Intermedio",
    key_topics: ["Liderazgo personal", "Efectividad", "Principios de vida", "Interdependencia"],
    is_recommended: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Inteligencia Emocional",
    author: "Daniel Goleman",
    description:
      "Por qué puede importar más que el coeficiente intelectual. Goleman argumenta que nuestras emociones juegan un papel mucho mayor en el pensamiento, la toma de decisiones y el éxito individual que tradicionalmente se ha reconocido.",
    category: "Habilidades Blandas",
    rating: 4.7,
    reading_time: "5h 20min",
    pages: 384,
    published_year: 1995,
    cover_url: "/placeholder.svg?height=400&width=300&text=Inteligencia%20Emocional&bg=10b981&color=white",
    tags: ["Inteligencia Emocional", "Psicología", "Relaciones", "Autoconciencia"],
    difficulty: "Intermedio",
    key_topics: ["Autoconciencia emocional", "Autorregulación", "Empatía", "Habilidades sociales"],
    is_recommended: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

// Library service functions
export class LibraryService {
  static async getBooks(): Promise<Book[]> {
    try {
      const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching books:", error)
        return mockBooks // Fallback to mock data
      }

      return data || mockBooks
    } catch (error) {
      console.error("Error in getBooks:", error)
      return mockBooks
    }
  }

  static async getBookById(id: string): Promise<Book | null> {
    try {
      const { data, error } = await supabase.from("books").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching book:", error)
        return mockBooks.find((book) => book.id === id) || null
      }

      return data
    } catch (error) {
      console.error("Error in getBookById:", error)
      return mockBooks.find((book) => book.id === id) || null
    }
  }

  static async getBookChapters(bookId: string): Promise<BookChapter[]> {
    try {
      const { data, error } = await supabase
        .from("book_chapters")
        .select("*")
        .eq("book_id", bookId)
        .order("chapter_number", { ascending: true })

      if (error) {
        console.error("Error fetching chapters:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getBookChapters:", error)
      return []
    }
  }

  static async getChapter(bookId: string, chapterNumber: number): Promise<BookChapter | null> {
    try {
      const { data, error } = await supabase
        .from("book_chapters")
        .select("*")
        .eq("book_id", bookId)
        .eq("chapter_number", chapterNumber)
        .single()

      if (error) {
        console.error("Error fetching chapter:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getChapter:", error)
      return null
    }
  }

  static async getUserBookProgress(userId: string, bookId: string): Promise<UserBookProgress | null> {
    try {
      const { data, error } = await supabase
        .from("user_book_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "not found"
        console.error("Error fetching user progress:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getUserBookProgress:", error)
      return null
    }
  }

  static async updateUserBookProgress(
    userId: string,
    bookId: string,
    progress: Partial<UserBookProgress>,
  ): Promise<UserBookProgress | null> {
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

      if (error) {
        console.error("Error updating user progress:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in updateUserBookProgress:", error)
      return null
    }
  }

  static async getUserBookmarks(userId: string, bookId?: string): Promise<UserBookBookmark[]> {
    try {
      let query = supabase.from("user_book_bookmarks").select("*").eq("user_id", userId)

      if (bookId) {
        query = query.eq("book_id", bookId)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching bookmarks:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getUserBookmarks:", error)
      return []
    }
  }

  static async addBookmark(
    userId: string,
    bookId: string,
    pageNumber: number,
    chapterTitle: string,
    note: string,
  ): Promise<UserBookBookmark | null> {
    try {
      const { data, error } = await supabase
        .from("user_book_bookmarks")
        .insert({
          user_id: userId,
          book_id: bookId,
          page_number: pageNumber,
          chapter_title: chapterTitle,
          note: note,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding bookmark:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in addBookmark:", error)
      return null
    }
  }

  static async getUserReadingStats(userId: string): Promise<UserReadingStats | null> {
    try {
      const { data, error } = await supabase.from("user_reading_stats").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching reading stats:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getUserReadingStats:", error)
      return null
    }
  }

  static async updateUserReadingStats(
    userId: string,
    stats: Partial<UserReadingStats>,
  ): Promise<UserReadingStats | null> {
    try {
      const { data, error } = await supabase
        .from("user_reading_stats")
        .upsert({
          user_id: userId,
          ...stats,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error("Error updating reading stats:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in updateUserReadingStats:", error)
      return null
    }
  }

  static async getRecommendedBooks(): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("is_recommended", true)
        .order("rating", { ascending: false })

      if (error) {
        console.error("Error fetching recommended books:", error)
        return mockBooks.filter((book) => book.is_recommended)
      }

      return data || mockBooks.filter((book) => book.is_recommended)
    } catch (error) {
      console.error("Error in getRecommendedBooks:", error)
      return mockBooks.filter((book) => book.is_recommended)
    }
  }

  static async searchBooks(query: string): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .or(`title.ilike.%${query}%,author.ilike.%${query}%,description.ilike.%${query}%`)
        .order("rating", { ascending: false })

      if (error) {
        console.error("Error searching books:", error)
        return mockBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.description.toLowerCase().includes(query.toLowerCase()),
        )
      }

      return data || []
    } catch (error) {
      console.error("Error in searchBooks:", error)
      return mockBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase()) ||
          book.description.toLowerCase().includes(query.toLowerCase()),
      )
    }
  }

  static async getBooksByCategory(category: string): Promise<Book[]> {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("category", category)
        .order("rating", { ascending: false })

      if (error) {
        console.error("Error fetching books by category:", error)
        return mockBooks.filter((book) => book.category === category)
      }

      return data || []
    } catch (error) {
      console.error("Error in getBooksByCategory:", error)
      return mockBooks.filter((book) => book.category === category)
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const { data, error } = await supabase.from("books").select("category").order("category")

      if (error) {
        console.error("Error fetching categories:", error)
        return [...new Set(mockBooks.map((book) => book.category))]
      }

      const categories = [...new Set(data?.map((item) => item.category) || [])]
      return categories
    } catch (error) {
      console.error("Error in getCategories:", error)
      return [...new Set(mockBooks.map((book) => book.category))]
    }
  }
}
