import { supabase } from "@/lib/supabase"

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

export interface BookWithRelevance extends Book {
  relevance_score?: number
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

export async function searchBooks(query: string, category?: string): Promise<BookWithRelevance[]> {
  try {
    const { data, error } = await supabase.rpc("search_knowledge_base", {
      search_query: query,
      category_filter: category || null,
      limit_results: 50,
    })

    if (error) {
      console.error("Error searching books:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to search books:", error)
    return []
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

export async function incrementBookReadCount(bookId: number): Promise<void> {
  try {
    await supabase.rpc("increment_read_count", { book_id: bookId })
  } catch (error) {
    console.error("Failed to increment read count:", error)
  }
}

export async function getBookById(id: number): Promise<Book | null> {
  try {
    const { data, error } = await supabase.from("knowledge_base").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching book by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch book by ID:", error)
    return null
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const { data, error } = await supabase.from("knowledge_base").select("category").order("category")

    if (error) {
      console.error("Error fetching categories:", error)
      return []
    }

    const uniqueCategories = [...new Set(data?.map((item) => item.category) || [])]
    return uniqueCategories
  } catch (error) {
    console.error("Failed to fetch categories:", error)
    return []
  }
}
