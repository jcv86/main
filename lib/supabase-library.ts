import { createClient } from "@supabase/supabase-js"
import { getBookContentForPage } from "./book-content"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for library functionality
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
  difficulty: string
  key_topics: string[]
  is_recommended: boolean
  created_at: string
  updated_at: string
}

export interface BookWithProgress {
  id: string
  title: string
  author: string
  description: string
  cover_url: string
  pages: number
  category: string
  rating: number
  current_page: number
  progress: number
  reading_status: "not_started" | "reading" | "completed"
  last_read_at: string
  notes_count: number
  bookmarks_count: number
}

export interface ReadingProgress {
  id: string
  user_id: string
  book_id: string
  current_page: number
  progress: number
  total_pages: number
  reading_time_minutes: number
  started_at?: string
  completed_at?: string
  last_read_at: string
  notes?: string
  rating?: number
  created_at: string
  updated_at: string
}

export interface BookNote {
  id: string
  user_id: string
  book_id: string
  page_number: number
  chapter_title?: string
  content: string
  created_at: string
}

export interface ReadingStats {
  books_completed: number
  books_in_progress: number
  total_reading_time: number
  reading_streak: number
  pages_read_today: number
  average_reading_speed: number
}

// Mock data for demo
const mockBooks: BookWithProgress[] = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    description: "Un método sencillo y comprobado para desarrollar buenos hábitos y eliminar los malos.",
    cover_url: "/books/atomic-habits.jpg",
    pages: 320,
    category: "Productividad",
    rating: 4.8,
    current_page: 0,
    progress: 0,
    reading_status: "not_started",
    last_read_at: new Date().toISOString(),
    notes_count: 0,
    bookmarks_count: 0,
  },
  {
    id: "2",
    title: "Deep Work",
    author: "Cal Newport",
    description: "Reglas para el éxito enfocado en un mundo distraído.",
    cover_url: "/books/deep-work.jpg",
    pages: 296,
    category: "Productividad",
    rating: 4.6,
    current_page: 89,
    progress: 30,
    reading_status: "reading",
    last_read_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    notes_count: 5,
    bookmarks_count: 3,
  },
  {
    id: "3",
    title: "Lean In",
    author: "Sheryl Sandberg",
    description: "Las mujeres, el trabajo y la voluntad de liderar.",
    cover_url: "/books/lean-in.jpg",
    pages: 240,
    category: "Liderazgo",
    rating: 4.5,
    current_page: 84,
    progress: 35,
    reading_status: "reading",
    last_read_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    notes_count: 8,
    bookmarks_count: 2,
  },
  {
    id: "4",
    title: "Emotional Intelligence 2.0",
    author: "Travis Bradberry",
    description: "Estrategias para aumentar tu coeficiente emocional.",
    cover_url: "/books/emotional-intelligence.jpg",
    pages: 280,
    category: "Desarrollo Personal",
    rating: 4.4,
    current_page: 168,
    progress: 60,
    reading_status: "reading",
    last_read_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    notes_count: 12,
    bookmarks_count: 7,
  },
  {
    id: "5",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    description: "Lecciones poderosas para el cambio personal.",
    cover_url: "/books/7-habits.jpg",
    pages: 372,
    category: "Desarrollo Personal",
    rating: 4.7,
    current_page: 372,
    progress: 100,
    reading_status: "completed",
    last_read_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    notes_count: 15,
    bookmarks_count: 10,
  },
]

const mockReadingStats: ReadingStats = {
  books_completed: 2,
  books_in_progress: 3,
  total_reading_time: 1250, // minutes
  reading_streak: 12, // days
  pages_read_today: 25,
  average_reading_speed: 2.3, // pages per minute
}

// Demo mode library functions that don't require Supabase
export async function getBooksWithProgress(userId: string): Promise<{ data: BookWithProgress[] | null; error: any }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    data: mockBooks,
    error: null,
  }
}

export async function getReadingStats(userId: string): Promise<{ data: ReadingStats | null; error: any }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return {
    data: mockReadingStats,
    error: null,
  }
}

export async function getBookById(bookId: string): Promise<{ data: BookWithProgress | null; error: any }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const book = mockBooks.find((b) => b.id === bookId)
  return {
    data: book || null,
    error: book ? null : { message: "Book not found" },
  }
}

export async function updateReadingProgress(
  userId: string,
  bookId: string,
  currentPage: number,
): Promise<{ data: any; error: any }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  // In a real app, this would update the database
  const bookIndex = mockBooks.findIndex((b) => b.id === bookId)
  if (bookIndex !== -1) {
    const book = mockBooks[bookIndex]
    book.current_page = currentPage
    book.progress = Math.round((currentPage / book.pages) * 100)
    book.last_read_at = new Date().toISOString()

    if (book.progress >= 100) {
      book.reading_status = "completed"
    } else if (book.progress > 0) {
      book.reading_status = "reading"
    }
  }

  return {
    data: { success: true },
    error: null,
  }
}

export async function getAllBooks(): Promise<{ data: BookWithProgress[] | null; error: any }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  return {
    data: mockBooks,
    error: null,
  }
}

// Library functions with robust fallback system
// export async function getBooksWithProgress(userId: string): Promise<{ data: BookWithProgress[] | null; error: any }> {
//   try {
//     console.log("Attempting to fetch books from database...")

//     // Try to get books from database first
//     const { data: booksData, error: booksError } = await supabase
//       .from("books")
//       .select("*")
//       .order("created_at", { ascending: false })

//     if (booksError) {
//       console.warn("Database books query failed, using complete fallback data:", booksError)
//       return { data: completeLibraryBooks, error: null }
//     }

//     if (!booksData || booksData.length === 0) {
//       console.warn("No books found in database, using complete fallback data")
//       return { data: completeLibraryBooks, error: null }
//     }

//     console.log(`Found ${booksData.length} books in database`)

//     // Try to get user progress for each book
//     const { data: progressData, error: progressError } = await supabase
//       .from("user_book_progress")
//       .select("*")
//       .eq("user_id", userId)

//     if (progressError) {
//       console.warn("Database progress query failed:", progressError)
//     }

//     // Try to get bookmarks count for each book
//     const { data: bookmarksData, error: bookmarksError } = await supabase
//       .from("user_book_bookmarks")
//       .select("book_id")
//       .eq("user_id", userId)

//     if (bookmarksError) {
//       console.warn("Database bookmarks query failed:", bookmarksError)
//     }

//     // Combine books with progress data
//     const booksWithProgress: BookWithProgress[] = booksData.map((book) => {
//       const userProgress = progressData?.find((p) => p.book_id === book.id)
//       const bookmarkCount = bookmarksData?.filter((b) => b.book_id === book.id).length || 0

//       let readingStatus: "not_started" | "reading" | "completed" | "paused" = "not_started"
//       if (userProgress) {
//         if (userProgress.progress >= 100) {
//           readingStatus = "completed"
//         } else if (userProgress.progress > 0) {
//           readingStatus = "reading"
//         }
//       }

//       return {
//         ...book,
//         progress: userProgress?.progress || 0,
//         user_rating: userProgress?.rating,
//         reading_status: readingStatus,
//         started_at: userProgress?.started_at,
//         completed_at: userProgress?.completed_at,
//         current_page: userProgress?.current_page || 1,
//         notes_count: 0, // Would need separate query for actual count
//         bookmarks_count: bookmarkCount,
//       }
//     })

//     console.log(`Successfully processed ${booksWithProgress.length} books with progress`)
//     return { data: booksWithProgress, error: null }
//   } catch (error) {
//     console.error("Error fetching books with progress:", error)
//     console.log("Using complete fallback data due to error")
//     // Always fallback to complete demo data
//     return { data: completeLibraryBooks, error: null }
//   }
// }

export async function getRecommendedBooks(userId: string): Promise<{ data: BookWithProgress[] | null; error: any }> {
  try {
    // Get all books with progress first
    const { data: allBooks, error } = await getBooksWithProgress(userId)

    if (error || !allBooks) {
      // Fallback to demo recommended books
      const recommendedBooks = mockBooks.filter((book) => book.rating >= 4.5)
      console.log(`Using fallback recommended books: ${recommendedBooks.length} books`)
      return { data: recommendedBooks, error: null }
    }

    // Filter for recommended books
    const recommendedBooks = allBooks.filter((book) => book.rating >= 4.5)
    console.log(`Found ${recommendedBooks.length} recommended books`)
    return { data: recommendedBooks, error: null }
  } catch (error) {
    console.error("Error fetching recommended books:", error)
    // Fallback to demo recommended books
    const recommendedBooks = mockBooks.filter((book) => book.rating >= 4.5)
    return { data: recommendedBooks, error: null }
  }
}

// export async function getBookById(bookId: string): Promise<{ data: Book | null; error: any }> {
//   try {
//     const { data, error } = await supabase.from("books").select("*").eq("id", bookId).single()

//     if (error) {
//       console.warn("Database query failed, using fallback data:", error)
//       // Fallback to demo data
//       const book = completeLibraryBooks.find((b) => b.id === bookId)
//       if (book) {
//         const { progress, user_rating, reading_status, current_page, notes_count, bookmarks_count, ...bookData } = book
//         return { data: bookData, error: null }
//       }
//       return { data: null, error: "Book not found" }
//     }

//     return { data, error: null }
//   } catch (error) {
//     console.error("Error fetching book:", error)
//     // Fallback to demo data
//     const book = completeLibraryBooks.find((b) => b.id === bookId)
//     if (book) {
//       const { progress, user_rating, reading_status, current_page, notes_count, bookmarks_count, ...bookData } = book
//       return { data: bookData, error: null }
//     }
//     return { data: null, error: "Book not found" }
//   }
// }

export async function getReadingProgress(
  userId: string,
  bookId: string,
): Promise<{ data: ReadingProgress | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("user_book_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found"
      console.warn("Database query failed:", error)
      return { data: null, error }
    }

    if (!data) {
      // Return default progress
      const book = mockBooks.find((b) => b.id === bookId)
      const defaultProgress: ReadingProgress = {
        id: `${userId}-${bookId}`,
        user_id: userId,
        book_id: bookId,
        current_page: 1,
        progress: 0,
        total_pages: book?.pages || 300,
        reading_time_minutes: 0,
        last_read_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      return { data: defaultProgress, error: null }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching reading progress:", error)
    return { data: null, error }
  }
}

export async function saveBookNote(
  userId: string,
  bookId: string,
  pageNumber: number,
  content: string,
  chapterTitle?: string,
): Promise<{ data: BookNote | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("user_book_bookmarks")
      .insert({
        user_id: userId,
        book_id: bookId,
        page_number: pageNumber,
        chapter_title: chapterTitle,
        note: content,
      })
      .select()
      .single()

    if (error) {
      console.warn("Database insert failed:", error)
      return { data: null, error }
    }

    // Transform to BookNote interface
    const note: BookNote = {
      id: data.id,
      user_id: data.user_id,
      book_id: data.book_id,
      page_number: data.page_number,
      chapter_title: data.chapter_title,
      content: data.note || "",
      created_at: data.created_at,
    }

    return { data: note, error: null }
  } catch (error) {
    console.error("Error saving book note:", error)
    return { data: null, error }
  }
}

export async function deleteBookNote(noteId: string): Promise<{ error: any }> {
  try {
    const { error } = await supabase.from("user_book_bookmarks").delete().eq("id", noteId)
    return { error }
  } catch (error) {
    console.error("Error deleting book note:", error)
    return { error }
  }
}

export async function getBookContent(bookId: string, page: number): Promise<{ data: string | null; error: any }> {
  // Use the new comprehensive book content system
  const content = getBookContentForPage(bookId, page)
  return { data: content, error: null }
}

// Bookmark functions
export async function saveBookmark(
  userId: string,
  bookId: string,
  pageNumber: number,
  note?: string,
): Promise<{ data: BookNote | null; error: any }> {
  return saveBookNote(userId, bookId, pageNumber, note || `Marcador en página ${pageNumber}`)
}

export async function getBookmarks(userId: string, bookId: string): Promise<{ data: BookNote[] | null; error: any }> {
  return getBookNotes(userId, bookId)
}

export async function getBookNotes(userId: string, bookId: string): Promise<{ data: BookNote[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from("user_book_bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .order("page_number", { ascending: true })

    if (error) {
      console.warn("Database query failed:", error)
      return { data: [], error: null } // Return empty array as fallback
    }

    // Transform the data to match BookNote interface
    const notes: BookNote[] = (data || []).map((bookmark) => ({
      id: bookmark.id,
      user_id: bookmark.user_id,
      book_id: bookmark.book_id,
      page_number: bookmark.page_number,
      chapter_title: bookmark.chapter_title,
      content: bookmark.note || "",
      created_at: bookmark.created_at,
    }))

    return { data: notes, error: null }
  } catch (error) {
    console.error("Error fetching book notes:", error)
    return { data: [], error: null }
  }
}

// Image validation utility
export function validateBookCoverUrl(bookId: string): string {
  const coverMap: { [key: string]: string } = {
    "1": "/books/atomic-habits.jpg",
    "2": "/books/deep-work.jpg",
    "3": "/books/lean-in.jpg",
    "4": "/books/emotional-intelligence.jpg",
    "5": "/books/7-habits.jpg",
  }

  return coverMap[bookId] || `/placeholder.svg?height=400&width=300&text=${encodeURIComponent("Libro")}`
}
