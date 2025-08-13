import { supabase } from "./supabase"

export interface Book {
  id: string
  title: string
  author: string
  description: string
  cover_image: string
  category: string
  difficulty: "Principiante" | "Intermedio" | "Avanzado"
  rating: number
  estimated_reading_time: number
  pages: number
  tags: string[]
  key_topics: string[]
  is_recommended: boolean
  created_at: string
  updated_at: string
}

export interface BookChapter {
  id: string
  book_id: string
  title: string
  content: string
  order: number
  created_at: string
  updated_at: string
}

export interface UserBookProgress {
  id: string
  user_id: string
  book_id: string
  current_chapter: number
  progress_percentage: number
  reading_time_minutes: number
  last_read_at: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface UserBookBookmark {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  chapter_title: string
  note?: string
  created_at: string
}

export class LibraryService {
  // Get all books
  static async getBooks(): Promise<Book[]> {
    try {
      const { data, error } = await supabase.from("library_books").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching books:", error)
        return this.getMockBooks()
      }

      return data || []
    } catch (error) {
      console.error("Error in getBooks:", error)
      return this.getMockBooks()
    }
  }

  // Get book by ID with UUID validation
  static async getBookById(id: string): Promise<Book | null> {
    try {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(id)) {
        console.log("Invalid UUID format, using mock data for ID:", id)
        return this.getMockBookById(id)
      }

      const { data, error } = await supabase.from("library_books").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching book:", error)
        return this.getMockBookById(id)
      }

      return data
    } catch (error) {
      console.error("Error in getBookById:", error)
      return this.getMockBookById(id)
    }
  }

  // Get book chapters with UUID validation
  static async getBookChapters(bookId: string): Promise<BookChapter[]> {
    try {
      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(bookId)) {
        console.log("Invalid UUID format, using mock chapters for book ID:", bookId)
        return this.getMockChapters(bookId)
      }

      const { data, error } = await supabase
        .from("library_book_chapters")
        .select("*")
        .eq("book_id", bookId)
        .order("order", { ascending: true })

      if (error) {
        console.error("Error fetching chapters:", error)
        return this.getMockChapters(bookId)
      }

      return data || []
    } catch (error) {
      console.error("Error in getBookChapters:", error)
      return this.getMockChapters(bookId)
    }
  }

  // Get user's reading progress
  static async getUserBookProgress(bookId: string): Promise<UserBookProgress | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null

      const { data, error } = await supabase
        .from("user_book_progress")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching progress:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in getUserBookProgress:", error)
      return null
    }
  }

  // Update reading progress with proper upsert logic
  static async updateBookProgress(bookId: string, progress: Partial<UserBookProgress>): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // First, try to get existing progress
      const { data: existingProgress } = await supabase
        .from("user_book_progress")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .single()

      if (existingProgress) {
        // Update existing record
        const { error } = await supabase
          .from("user_book_progress")
          .update({
            ...progress,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("book_id", bookId)

        if (error) {
          throw error
        }
      } else {
        // Insert new record
        const { error } = await supabase.from("user_book_progress").insert({
          user_id: user.id,
          book_id: bookId,
          current_chapter: 1,
          progress_percentage: 0,
          reading_time_minutes: 0,
          ...progress,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.error("Database error updating progress:", error)
      throw error
    }
  }

  // Add bookmark with proper duplicate handling
  static async addBookmark(bookId: string, chapterId: string, chapterTitle: string, note?: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Check if bookmark already exists
      const { data: existingBookmark } = await supabase
        .from("user_book_bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .eq("chapter_id", chapterId)
        .single()

      if (existingBookmark) {
        // Update existing bookmark
        const { error } = await supabase
          .from("user_book_bookmarks")
          .update({
            chapter_title: chapterTitle,
            note: note,
          })
          .eq("user_id", user.id)
          .eq("book_id", bookId)
          .eq("chapter_id", chapterId)

        if (error) {
          throw error
        }
      } else {
        // Insert new bookmark
        const { error } = await supabase.from("user_book_bookmarks").insert({
          user_id: user.id,
          book_id: bookId,
          chapter_id: chapterId,
          chapter_title: chapterTitle,
          note: note,
          created_at: new Date().toISOString(),
        })

        if (error) {
          throw error
        }
      }
    } catch (error) {
      console.error("Error adding bookmark:", error)
      throw error
    }
  }

  // Get user bookmarks
  static async getUserBookmarks(bookId: string): Promise<UserBookBookmark[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from("user_book_bookmarks")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

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

  // Mock data fallbacks
  private static getMockBooks(): Book[] {
    return [
      {
        id: "1",
        title: "Hábitos Atómicos",
        author: "James Clear",
        description: "Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos.",
        cover_image: "/books/atomic-habits.jpg",
        category: "Desarrollo Personal",
        difficulty: "Intermedio",
        rating: 4.8,
        estimated_reading_time: 240,
        pages: 320,
        tags: ["hábitos", "productividad", "autoayuda"],
        key_topics: ["Formación de hábitos", "Cambio de comportamiento", "Productividad"],
        is_recommended: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Los 7 Hábitos de la Gente Altamente Efectiva",
        author: "Stephen R. Covey",
        description:
          "Un enfoque holístico, integrado y centrado en principios para resolver problemas personales y profesionales.",
        cover_image: "/books/7-habits.jpg",
        category: "Liderazgo",
        difficulty: "Intermedio",
        rating: 4.7,
        estimated_reading_time: 300,
        pages: 380,
        tags: ["liderazgo", "efectividad", "principios"],
        key_topics: ["Liderazgo personal", "Efectividad", "Principios universales"],
        is_recommended: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }

  private static getMockBookById(id: string): Book | null {
    const books = this.getMockBooks()
    return books.find((book) => book.id === id) || null
  }

  private static getMockChapters(bookId: string): BookChapter[] {
    if (bookId === "1") {
      return [
        {
          id: "ch1",
          book_id: bookId,
          title: "Introducción: Mi historia",
          content: "El contenido del primer capítulo sobre la historia del autor...",
          order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "ch2",
          book_id: bookId,
          title: "Los fundamentos: Por qué los pequeños cambios generan una gran diferencia",
          content: "El contenido sobre los fundamentos de los hábitos atómicos...",
          order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]
    }
    return []
  }
}
