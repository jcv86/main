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
  updated_at?: string
}

export interface BookChapter {
  id: string
  book_id: string
  title: string
  content: string
  order: number
  created_at: string
  updated_at?: string
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

export interface UserBookHighlight {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  selected_text: string
  start_position: number
  end_position: number
  color: string
  note?: string
  created_at: string
  updated_at?: string
}

export interface UserBookNote {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  content: string
  position: number
  is_private: boolean
  created_at: string
  updated_at?: string
}

export interface UserBookQuote {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  quote_text: string
  context?: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at?: string
}

export interface ReadingSession {
  id: string
  user_id: string
  book_id: string
  chapter_id: string
  start_time: string
  end_time?: string
  pages_read: number
  words_read: number
  focus_score?: number
  notes?: string
  created_at: string
}

export interface BookSearchResult {
  book_id: string
  chapter_id: string
  chapter_title: string
  matched_text: string
  context: string
  position: number
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

  // BOOKMARK FUNCTIONS
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

  static async removeBookmark(bookId: string, chapterId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("user_book_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("book_id", bookId)
        .eq("chapter_id", chapterId)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error removing bookmark:", error)
      throw error
    }
  }

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

  // HIGHLIGHT FUNCTIONS
  static async addHighlight(
    bookId: string,
    chapterId: string,
    selectedText: string,
    startPosition: number,
    endPosition: number,
    color = "yellow",
    note?: string,
  ): Promise<UserBookHighlight> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const highlightData = {
        user_id: user.id,
        book_id: bookId,
        chapter_id: chapterId,
        selected_text: selectedText,
        start_position: startPosition,
        end_position: endPosition,
        color: color,
        note: note,
        created_at: new Date().toISOString(),
      }

      // For mock data, return a mock highlight
      if (!this.isValidUUID(bookId)) {
        return {
          id: `highlight-${Date.now()}`,
          ...highlightData,
        }
      }

      const { data, error } = await supabase.from("user_book_highlights").insert(highlightData).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error adding highlight:", error)
      throw error
    }
  }

  static async updateHighlight(highlightId: string, updates: Partial<UserBookHighlight>): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("user_book_highlights")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", highlightId)
        .eq("user_id", user.id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error updating highlight:", error)
      throw error
    }
  }

  static async removeHighlight(highlightId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("user_book_highlights")
        .delete()
        .eq("id", highlightId)
        .eq("user_id", user.id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error removing highlight:", error)
      throw error
    }
  }

  static async getChapterHighlights(bookId: string, chapterId: string): Promise<UserBookHighlight[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return []

      // For mock data, return empty array
      if (!this.isValidUUID(bookId)) {
        return []
      }

      const { data, error } = await supabase
        .from("user_book_highlights")
        .select("*")
        .eq("book_id", bookId)
        .eq("chapter_id", chapterId)
        .eq("user_id", user.id)
        .order("start_position", { ascending: true })

      if (error) {
        console.error("Error fetching highlights:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getChapterHighlights:", error)
      return []
    }
  }

  static async getAllUserHighlights(bookId: string): Promise<UserBookHighlight[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return []

      // For mock data, return empty array
      if (!this.isValidUUID(bookId)) {
        return []
      }

      const { data, error } = await supabase
        .from("user_book_highlights")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching all highlights:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getAllUserHighlights:", error)
      return []
    }
  }

  // NOTE FUNCTIONS
  static async addNote(
    bookId: string,
    chapterId: string,
    content: string,
    position: number,
    isPrivate = true,
  ): Promise<UserBookNote> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const noteData = {
        user_id: user.id,
        book_id: bookId,
        chapter_id: chapterId,
        content: content,
        position: position,
        is_private: isPrivate,
        created_at: new Date().toISOString(),
      }

      // For mock data, return a mock note
      if (!this.isValidUUID(bookId)) {
        return {
          id: `note-${Date.now()}`,
          ...noteData,
        }
      }

      const { data, error } = await supabase.from("user_book_notes").insert(noteData).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error adding note:", error)
      throw error
    }
  }

  static async updateNote(noteId: string, content: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("user_book_notes")
        .update({
          content: content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", noteId)
        .eq("user_id", user.id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error updating note:", error)
      throw error
    }
  }

  static async removeNote(noteId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase.from("user_book_notes").delete().eq("id", noteId).eq("user_id", user.id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error removing note:", error)
      throw error
    }
  }

  static async getChapterNotes(bookId: string, chapterId: string): Promise<UserBookNote[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return []

      // For mock data, return empty array
      if (!this.isValidUUID(bookId)) {
        return []
      }

      const { data, error } = await supabase
        .from("user_book_notes")
        .select("*")
        .eq("book_id", bookId)
        .eq("chapter_id", chapterId)
        .eq("user_id", user.id)
        .order("position", { ascending: true })

      if (error) {
        console.error("Error fetching notes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getChapterNotes:", error)
      return []
    }
  }

  // QUOTE FUNCTIONS
  static async addQuote(
    bookId: string,
    chapterId: string,
    quoteText: string,
    context?: string,
    tags: string[] = [],
  ): Promise<UserBookQuote> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const quoteData = {
        user_id: user.id,
        book_id: bookId,
        chapter_id: chapterId,
        quote_text: quoteText,
        context: context,
        tags: tags,
        is_favorite: false,
        created_at: new Date().toISOString(),
      }

      // For mock data, return a mock quote
      if (!this.isValidUUID(bookId)) {
        return {
          id: `quote-${Date.now()}`,
          ...quoteData,
        }
      }

      const { data, error } = await supabase.from("user_book_quotes").insert(quoteData).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error adding quote:", error)
      throw error
    }
  }

  static async toggleFavoriteQuote(quoteId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // First get current state
      const { data: quote, error: fetchError } = await supabase
        .from("user_book_quotes")
        .select("is_favorite")
        .eq("id", quoteId)
        .eq("user_id", user.id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      // Toggle favorite status
      const { error } = await supabase
        .from("user_book_quotes")
        .update({
          is_favorite: !quote.is_favorite,
          updated_at: new Date().toISOString(),
        })
        .eq("id", quoteId)
        .eq("user_id", user.id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error toggling favorite quote:", error)
      throw error
    }
  }

  static async getUserQuotes(bookId: string): Promise<UserBookQuote[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return []

      // For mock data, return empty array
      if (!this.isValidUUID(bookId)) {
        return []
      }

      const { data, error } = await supabase
        .from("user_book_quotes")
        .select("*")
        .eq("book_id", bookId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching quotes:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("Error in getUserQuotes:", error)
      return []
    }
  }

  // READING SESSION FUNCTIONS
  static async startReadingSession(bookId: string, chapterId: string): Promise<ReadingSession> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const sessionData = {
        user_id: user.id,
        book_id: bookId,
        chapter_id: chapterId,
        start_time: new Date().toISOString(),
        pages_read: 0,
        words_read: 0,
        created_at: new Date().toISOString(),
      }

      // For mock data, return a mock session
      if (!this.isValidUUID(bookId)) {
        return {
          id: `session-${Date.now()}`,
          ...sessionData,
        }
      }

      const { data, error } = await supabase.from("reading_sessions").insert(sessionData).select().single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error starting reading session:", error)
      throw error
    }
  }

  static async endReadingSession(
    sessionId: string,
    pagesRead: number,
    wordsRead: number,
    focusScore?: number,
    notes?: string,
  ): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("reading_sessions")
        .update({
          end_time: new Date().toISOString(),
          pages_read: pagesRead,
          words_read: wordsRead,
          focus_score: focusScore,
          notes: notes,
        })
        .eq("id", sessionId)
        .eq("user_id", user.id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error ending reading session:", error)
      throw error
    }
  }

  // SEARCH FUNCTIONS
  static async searchInBook(bookId: string, query: string): Promise<BookSearchResult[]> {
    try {
      const chapters = await this.getBookChapters(bookId)
      const results: BookSearchResult[] = []

      const normalizedQuery = query.toLowerCase().trim()
      if (!normalizedQuery) return results

      chapters.forEach((chapter) => {
        const content = chapter.content.toLowerCase()
        const originalContent = chapter.content

        let searchIndex = 0
        while (searchIndex < content.length) {
          const foundIndex = content.indexOf(normalizedQuery, searchIndex)
          if (foundIndex === -1) break

          // Get context around the match (50 characters before and after)
          const contextStart = Math.max(0, foundIndex - 50)
          const contextEnd = Math.min(originalContent.length, foundIndex + normalizedQuery.length + 50)
          const context = originalContent.substring(contextStart, contextEnd)

          // Get the exact matched text with original casing
          const matchedText = originalContent.substring(foundIndex, foundIndex + normalizedQuery.length)

          results.push({
            book_id: bookId,
            chapter_id: chapter.id,
            chapter_title: chapter.title,
            matched_text: matchedText,
            context: context,
            position: foundIndex,
          })

          searchIndex = foundIndex + 1
        }
      })

      return results.slice(0, 20) // Limit to 20 results
    } catch (error) {
      console.error("Error searching in book:", error)
      return []
    }
  }

  // UTILITY FUNCTIONS
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    return uuidRegex.test(uuid)
  }

  static calculateReadingSpeed(wordsRead: number, timeInMinutes: number): number {
    if (timeInMinutes === 0) return 0
    return Math.round(wordsRead / timeInMinutes)
  }

  static estimateReadingTime(text: string, wordsPerMinute = 200): number {
    const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  static getReadingLevel(text: string): "Fácil" | "Intermedio" | "Avanzado" {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const words = text.split(/\s+/).filter((w) => w.length > 0)
    const avgWordsPerSentence = words.length / sentences.length
    const complexWords = words.filter((word) => word.length > 7).length
    const complexWordPercentage = (complexWords / words.length) * 100

    if (avgWordsPerSentence > 20 || complexWordPercentage > 30) {
      return "Avanzado"
    } else if (avgWordsPerSentence > 15 || complexWordPercentage > 20) {
      return "Intermedio"
    } else {
      return "Fácil"
    }
  }

  static formatReadingTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (remainingMinutes === 0) {
        return `${hours}h`
      }
      return `${hours}h ${remainingMinutes}min`
    }
  }

  // Mock data fallbacks - Updated to include all operational books including Lean In
  private static getMockBooks(): Book[] {
    return [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
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
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
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
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        title: "Trabajo Profundo",
        author: "Cal Newport",
        description: "Reglas para el éxito enfocado en un mundo distraído.",
        cover_image: "/books/deep-work.jpg",
        category: "Productividad",
        difficulty: "Avanzado",
        rating: 4.6,
        estimated_reading_time: 280,
        pages: 296,
        tags: ["concentración", "productividad", "enfoque"],
        key_topics: ["Concentración profunda", "Gestión de distracciones", "Productividad cognitiva"],
        is_recommended: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        title: "Inteligencia Emocional",
        author: "Daniel Goleman",
        description: "Por qué es más importante que el cociente intelectual.",
        cover_image: "/books/emotional-intelligence.jpg",
        category: "Psicología",
        difficulty: "Intermedio",
        rating: 4.5,
        estimated_reading_time: 320,
        pages: 384,
        tags: ["inteligencia emocional", "psicología", "autoconocimiento"],
        key_topics: ["Autoconciencia emocional", "Regulación emocional", "Habilidades sociales"],
        is_recommended: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        title: "Lean In: Mujeres, Trabajo y la Voluntad de Liderar",
        author: "Sheryl Sandberg",
        description:
          "Una exploración sobre los desafíos que enfrentan las mujeres en el lugar de trabajo y cómo pueden superarlos para alcanzar posiciones de liderazgo.",
        cover_image: "/books/lean-in.jpg",
        category: "Liderazgo",
        difficulty: "Intermedio",
        rating: 4.5,
        estimated_reading_time: 280,
        pages: 320,
        tags: ["liderazgo femenino", "igualdad de género", "desarrollo profesional", "empoderamiento"],
        key_topics: [
          "Liderazgo femenino",
          "Igualdad en el trabajo",
          "Desarrollo de carrera",
          "Empoderamiento personal",
        ],
        is_recommended: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440006",
        title: "Mindset",
        author: "Carol S. Dweck",
        description: "La nueva psicología del éxito.",
        cover_image: "/books/mindset.jpg",
        category: "Psicología",
        difficulty: "Principiante",
        rating: 4.6,
        estimated_reading_time: 220,
        pages: 276,
        tags: ["mentalidad", "crecimiento", "psicología"],
        key_topics: ["Mentalidad de crecimiento", "Aprendizaje", "Resiliencia"],
        is_recommended: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440007",
        title: "El Poder del Ahora",
        author: "Eckhart Tolle",
        description: "Una guía hacia la iluminación espiritual.",
        cover_image: "/books/power-of-now.jpg",
        category: "Espiritualidad",
        difficulty: "Intermedio",
        rating: 4.3,
        estimated_reading_time: 200,
        pages: 236,
        tags: ["mindfulness", "espiritualidad", "presente"],
        key_topics: ["Mindfulness", "Conciencia presente", "Transformación personal"],
        is_recommended: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440008",
        title: "Good to Great",
        author: "Jim Collins",
        description: "Por qué algunas empresas dan el salto... y otras no.",
        cover_image: "/books/good-to-great.jpg",
        category: "Negocios",
        difficulty: "Avanzado",
        rating: 4.5,
        estimated_reading_time: 350,
        pages: 300,
        tags: ["liderazgo empresarial", "estrategia", "excelencia"],
        key_topics: ["Liderazgo empresarial", "Transformación organizacional", "Excelencia operativa"],
        is_recommended: true,
        created_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440009",
        title: "La Semana Laboral de 4 Horas",
        author: "Timothy Ferriss",
        description: "Escapa de la rutina de 9-5, vive en cualquier lugar y únete a los nuevos ricos.",
        cover_image: "/books/4-hour-workweek.jpg",
        category: "Emprendimiento",
        difficulty: "Intermedio",
        rating: 4.2,
        estimated_reading_time: 280,
        pages: 308,
        tags: ["emprendimiento", "libertad financiera", "productividad"],
        key_topics: ["Automatización", "Libertad geográfica", "Emprendimiento digital"],
        is_recommended: false,
        created_at: new Date().toISOString(),
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440010",
        title: "Conversaciones Cruciales",
        author: "Kerry Patterson",
        description: "Herramientas para hablar cuando hay mucho en juego.",
        cover_image: "/books/crucial-conversations.jpg",
        category: "Comunicación",
        difficulty: "Intermedio",
        rating: 4.4,
        estimated_reading_time: 240,
        pages: 288,
        tags: ["comunicación", "negociación", "conflictos"],
        key_topics: ["Comunicación efectiva", "Resolución de conflictos", "Negociación"],
        is_recommended: true,
        created_at: new Date().toISOString(),
      },
    ]
  }

  private static getMockBookById(id: string): Book | null {
    const books = this.getMockBooks()
    return books.find((book) => book.id === id) || null
  }

  private static getMockChapters(bookId: string): BookChapter[] {
    // Atomic Habits chapters
    if (bookId === "550e8400-e29b-41d4-a716-446655440001") {
      return [
        {
          id: "chapter-1-atomic-habits",
          book_id: bookId,
          title: "Introducción: Mi historia",
          content:
            "En el segundo año de la escuela secundaria, me golpearon en la cara con un bate de béisbol. Mi historia comienza aquí, en un momento que cambió mi vida para siempre. Los cambios que parecen pequeños e insignificantes al principio se componen en resultados notables si estás dispuesto a mantenerte en ellos durante años. Todos enfrentamos momentos de elección que definen el tipo de persona en la que nos convertiremos. Sin darnos cuenta, repetimos alrededor del 40% de nuestros comportamientos casi a diario. Esto significa que mejorar los hábitos es una de las formas más eficientes de mejorar tu vida.",
          order: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: "chapter-2-atomic-habits",
          book_id: bookId,
          title: "Los fundamentos: Por qué los pequeños cambios generan una gran diferencia",
          content:
            "Es muy fácil sobrestimar la importancia de un momento definitorio y subestimar el valor de hacer pequeñas mejoras diariamente. Con demasiada frecuencia, nos convencemos de que el cambio masivo requiere una acción masiva. Ya sea perdiendo peso, construyendo un negocio, escribiendo un libro, ganando un campeonato, o logrando cualquier otro objetivo, nos presionamos para hacer alguna mejora que capture la atención de todos. Mientras tanto, mejorar en un 1% no es particularmente notable, a veces ni siquiera es perceptible, pero puede ser mucho más significativo, especialmente a largo plazo.",
          order: 2,
          created_at: new Date().toISOString(),
        },
      ]
    }

    // 7 Habits chapters
    if (bookId === "550e8400-e29b-41d4-a716-446655440002") {
      return [
        {
          id: "chapter-1-7-habits",
          book_id: bookId,
          title: "Paradigmas y Principios",
          content:
            "La forma en que vemos el problema es el problema. Este libro presenta un enfoque centrado en principios, de adentro hacia afuera, para la efectividad personal e interpersonal. De adentro hacia afuera significa comenzar con uno mismo; más fundamentalmente, comenzar con las partes más internas de uno mismo: con sus paradigmas, su carácter y sus motivos. Si quieres tener un matrimonio feliz, sé el tipo de persona que genera energía positiva y evita la energía negativa en lugar de empeorar las debilidades de tu cónyuge. Si quieres tener un hijo más cooperativo y responsable, sé un padre más comprensivo, más consistente, más cariñoso.",
          order: 1,
          created_at: new Date().toISOString(),
        },
      ]
    }

    // Lean In chapters (mock fallback with complete content)
    if (bookId === "550e8400-e29b-41d4-a716-446655440005") {
      return [
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          book_id: bookId,
          title: "Introducción: La Conversación Interna",
          content:
            'En el mundo profesional actual, las mujeres enfrentan desafíos únicos que van más allá de las barreras externas. Existe una conversación interna que muchas mujeres mantienen consigo mismas, llena de dudas, cuestionamientos y limitaciones autoimpuestas.\n\nEsta conversación interna a menudo incluye preguntas como: "¿Soy lo suficientemente buena para este puesto?" o "¿Qué pensarán si hablo en esta reunión?" Estas dudas no surgen de la nada; son el resultado de años de condicionamiento social y expectativas culturales.\n\nEl primer paso para el cambio es reconocer que esta conversación existe. Muchas mujeres talentosas se limitan a sí mismas antes de que cualquier barrera externa tenga la oportunidad de hacerlo. Cambian su comportamiento, reducen sus ambiciones y se conforman con menos de lo que merecen.\n\nPero también existe otra realidad: las mujeres que han logrado romper estas barreras internas han descubierto un poder transformador. Han aprendido a confiar en sus habilidades, a hablar con autoridad y a perseguir oportunidades con determinación.\n\nEl cambio comienza con la conciencia. Cuando las mujeres reconocen los patrones de pensamiento que las limitan, pueden comenzar a desafiarlos. Pueden empezar a reescribir esa conversación interna, transformándola de una fuente de dudas en una fuente de fortaleza.\n\nEste libro explora cómo las mujeres pueden desarrollar la confianza necesaria para liderar, cómo pueden navegar los desafíos únicos del lugar de trabajo moderno, y cómo pueden crear un cambio positivo tanto para ellas mismas como para las generaciones futuras.\n\nLa igualdad de género en el lugar de trabajo no es solo un tema de justicia social; es una necesidad económica. Las organizaciones que aprovechan plenamente el talento femenino superan consistentemente a aquellas que no lo hacen. Sin embargo, para que esto suceda, las mujeres deben estar dispuestas a dar un paso adelante y reclamar su lugar en la mesa de decisiones.',
          order: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174001",
          book_id: bookId,
          title: "Capítulo 1: Siéntate a la Mesa",
          content:
            'En una reunión ejecutiva de una empresa Fortune 500, había una mesa grande rodeada de sillas. Los ejecutivos masculinos se sentaron naturalmente alrededor de la mesa, mientras que las pocas mujeres presentes tomaron asiento en las sillas contra la pared. Esta escena se repite en salas de juntas de todo el mundo, y es una metáfora poderosa de un problema más amplio.\n\nLas mujeres a menudo se excluyen a sí mismas de las conversaciones importantes, literal y figurativamente. No se sientan a la mesa principal, no hablan en las reuniones, y no se postulan para los puestos de liderazgo que merecen. Esta autoexclusión tiene raíces profundas en la socialización y las expectativas culturales.\n\nDesde una edad temprana, a las niñas se les enseña a ser modestas, a no presumir, y a poner las necesidades de otros antes que las propias. Estos valores, aunque admirables en muchos contextos, pueden convertirse en obstáculos en el mundo profesional. Mientras que los hombres son alentados a ser asertivos y ambiciosos, las mujeres que muestran estas mismas cualidades a menudo son etiquetadas negativamente.\n\nEl síndrome del impostor afecta desproporcionadamente a las mujeres. Muchas mujeres exitosas sienten que no merecen sus logros, que han tenido suerte, o que pronto serán "descubiertas" como fraudes. Esta sensación las lleva a trabajar más duro para demostrar su valía, pero también las hace menos propensas a buscar nuevas oportunidades o a hablar con confianza sobre sus logros.\n\nLa investigación muestra que los hombres se postulan para trabajos cuando cumplen con el 60% de los requisitos, mientras que las mujeres esperan hasta cumplir con el 100%. Esta diferencia en la percepción de la preparación tiene consecuencias reales en las trayectorias profesionales.\n\nPara sentarse a la mesa, las mujeres deben: Primero, reconocer su propio valor. Segundo, desarrollar la confianza para hablar. Tercero, buscar activamente oportunidades de liderazgo. Cuarto, construir una red de apoyo.\n\nSentarse a la mesa no es solo sobre ocupar un asiento físico; es sobre reclamar el espacio que las mujeres merecen en las conversaciones que dan forma al futuro de las organizaciones y la sociedad.',
          order: 2,
          created_at: new Date().toISOString(),
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174002",
          book_id: bookId,
          title: "Capítulo 2: El Éxito y la Simpatía",
          content:
            'Existe un dilema fundamental que enfrentan las mujeres en el lugar de trabajo: el conflicto entre el éxito y la simpatía. La investigación ha demostrado consistentemente que cuando las mujeres tienen éxito, especialmente en roles tradicionalmente masculinos, a menudo son percibidas como menos simpáticas. Este fenómeno no afecta a los hombres de la misma manera.\n\nEste dilema se manifiesta de múltiples formas en el entorno laboral. Una mujer que negocia agresivamente por un salario más alto puede ser vista como "difícil" o "demandante", mientras que un hombre que hace lo mismo es considerado "un buen negociador". Una líder femenina que toma decisiones difíciles puede ser etiquetada como "fría" o "calculadora", mientras que un líder masculino que hace lo mismo es visto como "decisivo" y "fuerte".\n\nEsta doble moral tiene consecuencias reales. Las mujeres que son percibidas como menos simpáticas pueden enfrentar resistencia de colegas, dificultades para construir coaliciones, y obstáculos en su avance profesional. Como resultado, muchas mujeres modifican su comportamiento, suavizando su enfoque o disculpándose por sus éxitos, en un intento de mantener la simpatía.\n\nEl origen de este dilema se encuentra en las expectativas sociales profundamente arraigadas sobre cómo deben comportarse las mujeres. Se espera que las mujeres sean cálidas, serviciales y modestas. Cuando violan estas expectativas al ser asertivas o ambiciosas, enfrentan una reacción negativa.',
          order: 3,
          created_at: new Date().toISOString(),
        },
        {
          id: "123e4567-e89b-12d3-a456-426614174003",
          book_id: bookId,
          title: "Capítulo 3: Mentores y Patrocinadores",
          content:
            "En el camino hacia el liderazgo, pocas cosas son tan valiosas como tener mentores y patrocinadores. Sin embargo, existe una diferencia crucial entre estos dos roles, y entender esta diferencia puede ser determinante para el éxito profesional de una mujer.\n\nUn mentor es alguien que ofrece consejos, comparte experiencias y ayuda a desarrollar habilidades. La relación de mentoría se basa en el intercambio de conocimientos y la orientación. Un patrocinador, por otro lado, es alguien que aboga activamente por tu avance profesional, que usa su influencia para crear oportunidades y que está dispuesto a apostar su reputación por tu éxito.\n\nLas mujeres a menudo tienen más mentores que patrocinadores, y esta diferencia es significativa. Mientras que los mentores pueden ofrecer valiosos consejos, son los patrocinadores quienes realmente abren puertas. Son ellos quienes mencionan tu nombre cuando se discuten promociones, quienes te recomiendan para proyectos de alto perfil, y quienes te defienden cuando no estás en la habitación.\n\nLa investigación muestra que los hombres son más propensos a tener patrocinadores, mientras que las mujeres tienden a ser 'sobre-mentoreadas y sub-patrocinadas'. Esta disparidad contribuye a la brecha de género en posiciones de liderazgo.",
          order: 4,
          created_at: new Date().toISOString(),
        },
      ]
    }

    return []
  }
}
