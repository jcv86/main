import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface Book {
  id: number
  title: string
  category: string
  content: string
  author: string
  tags: string[]
  slug: string
  read_count: number
  created_at: string
  updated_at: string
}

export interface UserReadingProgress {
  id: number
  user_email: string
  book_id: number
  reading_progress: number
  target_percentage: number
  status: "not_started" | "reading" | "completed" | "paused"
  notes?: string
  reading_time_minutes: number
  started_at?: string
  completed_at?: string
  last_read_at?: string
  created_at: string
  updated_at: string
}

export interface UserBookmark {
  id: number
  user_email: string
  book_id: number
  bookmark_note?: string
  created_at: string
}

export interface BookWithProgress extends Book {
  reading_progress: number
  target_percentage: number
  status: string
  reading_time_minutes: number
  last_read_at?: string
  is_bookmarked: boolean
}

export interface ReadingStats {
  total_books: number
  completed_books: number
  reading_books: number
  not_started_books: number
  paused_books: number
  total_reading_time: number
  average_progress: number
  bookmarks_count: number
  reviews_count: number
  favorite_category: string
}

export interface SearchResult {
  id: number
  title: string
  category: string
  author: string
  tags: string[]
  slug: string
  read_count: number
  relevance_score: number
}

export async function getBooks(): Promise<Book[]> {
  try {
    const { data, error } = await supabase.from("knowledge_base").select("*").order("read_count", { ascending: false })

    if (error) {
      console.error("Error fetching books:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch books:", error)
    return []
  }
}

export async function getBooksByCategory(category: string): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .eq("category", category)
      .order("read_count", { ascending: false })

    if (error) {
      console.error("Error fetching books by category:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch books by category:", error)
    return []
  }
}

export async function searchBooks(searchTerm?: string, category?: string, limit = 10): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabase.rpc("search_knowledge_base", {
      search_term: searchTerm || null,
      category_filter: category || null,
      limit_results: limit,
    })

    if (error) {
      console.error("Error searching books:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in searchBooks:", error)
    throw error
  }
}

export async function getPopularBooks(limit = 10): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("read_count", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching popular books:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch popular books:", error)
    return []
  }
}

export async function getRecentBooks(limit = 10): Promise<Book[]> {
  try {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching recent books:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch recent books:", error)
    return []
  }
}

export async function incrementReadCount(bookId: number): Promise<number> {
  try {
    const { data, error } = await supabase.rpc("increment_read_count", {
      book_id_param: bookId,
    })

    if (error) {
      console.error("Error incrementing read count:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in incrementReadCount:", error)
    throw error
  }
}

export async function getBookById(bookId: number): Promise<Book | null> {
  try {
    const { data, error } = await supabase.from("knowledge_base").select("*").eq("id", bookId).single()

    if (error) {
      console.error("Error fetching book by ID:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in getBookById:", error)
    throw error
  }
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  try {
    if (!isNaN(Number(slug))) {
      const id = Number(slug)
      const { data, error } = await supabase.from("knowledge_base").select("*").eq("id", id).single()

      if (error) {
        console.error("Error fetching book by ID:", error)
        throw error
      }

      return data
    }

    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .ilike("title", `%${slug.replace(/-/g, " ")}%`)
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching book by title:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in getBookBySlug:", error)
    throw error
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("knowledge_base").select("category").order("category")

    if (error) {
      console.error("Error fetching categories:", error)
      throw error
    }

    const uniqueCategories = [...new Set(data?.map((item) => item.category) || [])]
    return uniqueCategories
  } catch (error) {
    console.error("Error in getCategories:", error)
    throw error
  }
}

export async function getUserReadingProgress(userEmail: string): Promise<UserReadingProgress[]> {
  try {
    const { data, error } = await supabase
      .from("user_reading_progress")
      .select("*")
      .eq("user_email", userEmail)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching reading progress:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch reading progress:", error)
    return []
  }
}

export async function updateReadingProgress(
  userEmail: string,
  bookId: number,
  progress: number,
  status?: "not_started" | "reading" | "completed" | "paused",
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("update_reading_progress", {
      user_email_param: userEmail,
      book_id_param: bookId,
      progress_param: progress,
      status_param: status || null,
    })

    if (error) {
      console.error("Error updating reading progress:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Error in updateReadingProgress:", error)
    throw error
  }
}

export async function getUserBookmarks(userEmail: string): Promise<BookWithProgress[]> {
  try {
    const { data, error } = await supabase
      .from("user_bookmarks")
      .select(`
        book_id,
        knowledge_base!inner (
          id,
          title,
          category,
          author,
          tags,
          slug,
          read_count,
          content,
          created_at,
          updated_at
        )
      `)
      .eq("user_email", userEmail)

    if (error) {
      console.error("Error fetching user bookmarks:", error)
      throw error
    }

    // Obtener progreso para cada libro bookmarked
    const bookIds = data?.map((item) => item.book_id) || []
    if (bookIds.length === 0) return []

    const { data: progressData, error: progressError } = await supabase
      .from("user_reading_progress")
      .select("*")
      .eq("user_email", userEmail)
      .in("book_id", bookIds)

    if (progressError) {
      console.error("Error fetching progress for bookmarks:", progressError)
    }

    // Combinar datos
    const result: BookWithProgress[] =
      data?.map((item) => {
        const book = item.knowledge_base as Book
        const progress = progressData?.find((p) => p.book_id === item.book_id)

        return {
          ...book,
          reading_progress: progress?.reading_progress || 0,
          target_percentage: progress?.target_percentage || 100,
          status: progress?.status || "not_started",
          reading_time_minutes: progress?.reading_time_minutes || 0,
          last_read_at: progress?.last_read_at,
          is_bookmarked: true,
        } as BookWithProgress
      }) || []

    return result
  } catch (error) {
    console.error("Error in getUserBookmarks:", error)
    throw error
  }
}

export async function toggleBookmark(userEmail: string, bookId: number): Promise<boolean> {
  try {
    // Verificar si ya existe el bookmark
    const { data: existing, error: checkError } = await supabase
      .from("user_bookmarks")
      .select("id")
      .eq("user_email", userEmail)
      .eq("book_id", bookId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError
    }

    if (existing) {
      // Remover bookmark
      const { error: deleteError } = await supabase
        .from("user_bookmarks")
        .delete()
        .eq("user_email", userEmail)
        .eq("book_id", bookId)

      if (deleteError) {
        throw deleteError
      }
      return false
    } else {
      // Agregar bookmark
      const { error: insertError } = await supabase.from("user_bookmarks").insert({
        user_email: userEmail,
        book_id: bookId,
        bookmark_note: "Guardado para leer más tarde",
      })

      if (insertError) {
        throw insertError
      }
      return true
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    throw error
  }
}

export async function getUserReadingStats(userEmail: string): Promise<ReadingStats | null> {
  try {
    const { data, error } = await supabase.rpc("get_user_reading_stats", {
      user_email_param: userEmail,
    })

    if (error) {
      console.error("Error fetching user reading stats:", error)
      throw error
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error in getUserReadingStats:", error)
    throw error
  }
}

export async function getBooksByStatus(
  userEmail: string,
  status: "not_started" | "reading" | "completed" | "paused",
): Promise<BookWithProgress[]> {
  try {
    const { data, error } = await supabase.rpc("get_books_by_status", {
      user_email_param: userEmail,
      status_filter: status,
    })

    if (error) {
      console.error("Error fetching books by status:", error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error("Error in getBooksByStatus:", error)
    throw error
  }
}

export async function getBookProgress(userEmail: string, bookId: number): Promise<UserReadingProgress | null> {
  try {
    const { data, error } = await supabase
      .from("user_reading_progress")
      .select("*")
      .eq("user_email", userEmail)
      .eq("book_id", bookId)
      .single()

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching book progress:", error)
      throw error
    }

    return data || null
  } catch (error) {
    console.error("Error in getBookProgress:", error)
    throw error
  }
}

export async function updateReadingTarget(
  userEmail: string,
  bookId: number,
  targetPercentage: number,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("user_reading_progress").upsert(
      {
        user_email: userEmail,
        book_id: bookId,
        target_percentage: targetPercentage,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_email,book_id",
      },
    )

    if (error) {
      console.error("Error updating reading target:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Error in updateReadingTarget:", error)
    throw error
  }
}
