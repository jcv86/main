import { createAdminClient } from "./supabase"

export interface LibraryInsight {
  id: string
  user_id: string
  book_id: string
  chapter_id?: string
  content: string
  insight_type: "reflection" | "quote" | "note" | "connection"
  importance: "low" | "medium" | "high" | "critical"
  tags: string[]
  page_number?: number
  created_at: string
  updated_at: string
}

export interface ReadingSession {
  id: string
  user_id: string
  book_id: string
  start_time: string
  end_time?: string
  pages_read: number
  insights_captured: number
  comprehension_score?: number
  notes: string
  created_at: string
}

export interface LibraryMemoryStats {
  total_insights: number
  insights_by_type: Record<string, number>
  insights_by_importance: Record<string, number>
  total_reading_time: number
  books_with_insights: number
  favorite_topics: string[]
  reading_streak: number
}

export default class MirixLibraryIntegration {
  private userId: string
  private supabase: ReturnType<typeof createAdminClient>

  constructor(userId: string) {
    this.userId = userId
    this.supabase = createAdminClient()
  }

  async captureInsight(
    bookId: string,
    content: string,
    type: "reflection" | "quote" | "note" | "connection" = "reflection",
    importance: "low" | "medium" | "high" | "critical" = "medium",
    tags: string[] = [],
    chapterId?: string,
    pageNumber?: number,
  ): Promise<{ success: boolean; insight?: LibraryInsight; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("library_insights")
        .insert({
          user_id: this.userId,
          book_id: bookId,
          chapter_id: chapterId,
          content,
          insight_type: type,
          importance,
          tags,
          page_number: pageNumber,
        })
        .select()
        .single()

      if (error) {
        console.error("Error capturing insight:", error)
        return { success: false, error: error.message }
      }

      return { success: true, insight: data }
    } catch (error) {
      console.error("Error in captureInsight:", error)
      return { success: false, error: "Failed to capture insight" }
    }
  }

  async startReadingSession(bookId: string): Promise<{ success: boolean; session?: ReadingSession; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("reading_sessions")
        .insert({
          user_id: this.userId,
          book_id: bookId,
          pages_read: 0,
          insights_captured: 0,
          notes: "",
        })
        .select()
        .single()

      if (error) {
        console.error("Error starting reading session:", error)
        return { success: false, error: error.message }
      }

      return { success: true, session: data }
    } catch (error) {
      console.error("Error in startReadingSession:", error)
      return { success: false, error: "Failed to start reading session" }
    }
  }

  async endReadingSession(
    sessionId: string,
    pagesRead: number,
    comprehensionScore?: number,
    notes?: string,
  ): Promise<{ success: boolean; session?: ReadingSession; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("reading_sessions")
        .update({
          end_time: new Date().toISOString(),
          pages_read: pagesRead,
          comprehension_score: comprehensionScore,
          notes: notes || "",
        })
        .eq("id", sessionId)
        .eq("user_id", this.userId)
        .select()
        .single()

      if (error) {
        console.error("Error ending reading session:", error)
        return { success: false, error: error.message }
      }

      return { success: true, session: data }
    } catch (error) {
      console.error("Error in endReadingSession:", error)
      return { success: false, error: "Failed to end reading session" }
    }
  }

  async getBookInsights(bookId: string): Promise<{ success: boolean; insights?: LibraryInsight[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("library_insights")
        .select("*")
        .eq("user_id", this.userId)
        .eq("book_id", bookId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error getting book insights:", error)
        return { success: false, error: error.message }
      }

      return { success: true, insights: data || [] }
    } catch (error) {
      console.error("Error in getBookInsights:", error)
      return { success: false, error: "Failed to get book insights" }
    }
  }

  async searchInsights(
    query: string,
    tags?: string[],
  ): Promise<{ success: boolean; insights?: LibraryInsight[]; error?: string }> {
    try {
      let queryBuilder = this.supabase.from("library_insights").select("*").eq("user_id", this.userId)

      if (query) {
        queryBuilder = queryBuilder.ilike("content", `%${query}%`)
      }

      if (tags && tags.length > 0) {
        queryBuilder = queryBuilder.overlaps("tags", tags)
      }

      const { data, error } = await queryBuilder.order("created_at", { ascending: false }).limit(50)

      if (error) {
        console.error("Error searching insights:", error)
        return { success: false, error: error.message }
      }

      return { success: true, insights: data || [] }
    } catch (error) {
      console.error("Error in searchInsights:", error)
      return { success: false, error: "Failed to search insights" }
    }
  }

  async getLibraryMemoryStats(): Promise<{ success: boolean; stats?: LibraryMemoryStats; error?: string }> {
    try {
      // Get total insights
      const { data: insights, error: insightsError } = await this.supabase
        .from("library_insights")
        .select("insight_type, importance, tags, book_id")
        .eq("user_id", this.userId)

      if (insightsError) {
        console.error("Error getting insights for stats:", insightsError)
        return { success: false, error: insightsError.message }
      }

      // Get reading sessions
      const { data: sessions, error: sessionsError } = await this.supabase
        .from("reading_sessions")
        .select("pages_read, start_time, end_time")
        .eq("user_id", this.userId)
        .not("end_time", "is", null)

      if (sessionsError) {
        console.error("Error getting sessions for stats:", sessionsError)
        return { success: false, error: sessionsError.message }
      }

      // Calculate stats
      const insightsData = insights || []
      const sessionsData = sessions || []

      const insights_by_type = insightsData.reduce(
        (acc, insight) => {
          acc[insight.insight_type] = (acc[insight.insight_type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const insights_by_importance = insightsData.reduce(
        (acc, insight) => {
          acc[insight.importance] = (acc[insight.importance] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const total_reading_time = sessionsData.reduce((total, session) => {
        if (session.start_time && session.end_time) {
          const start = new Date(session.start_time)
          const end = new Date(session.end_time)
          return total + (end.getTime() - start.getTime()) / (1000 * 60) // minutes
        }
        return total
      }, 0)

      const books_with_insights = new Set(insightsData.map((insight) => insight.book_id)).size

      const allTags = insightsData.flatMap((insight) => insight.tags || [])
      const tagCounts = allTags.reduce(
        (acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const favorite_topics = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag)

      // Calculate reading streak (simplified - consecutive days with sessions)
      const sessionDates = sessionsData
        .map((session) => new Date(session.start_time).toDateString())
        .filter((date, index, arr) => arr.indexOf(date) === index)
        .sort()

      let reading_streak = 0
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

      if (sessionDates.includes(today) || sessionDates.includes(yesterday)) {
        reading_streak = 1
        // This is a simplified calculation - in a real app you'd want more sophisticated streak logic
      }

      const stats: LibraryMemoryStats = {
        total_insights: insightsData.length,
        insights_by_type,
        insights_by_importance,
        total_reading_time: Math.round(total_reading_time),
        books_with_insights,
        favorite_topics,
        reading_streak,
      }

      return { success: true, stats }
    } catch (error) {
      console.error("Error in getLibraryMemoryStats:", error)
      return { success: false, error: "Failed to get library memory stats" }
    }
  }

  async getBookConnections(
    bookId: string,
  ): Promise<{ success: boolean; connections?: LibraryInsight[]; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from("library_insights")
        .select("*")
        .eq("user_id", this.userId)
        .eq("insight_type", "connection")
        .or(`book_id.eq.${bookId},content.ilike.%${bookId}%`)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error getting book connections:", error)
        return { success: false, error: error.message }
      }

      return { success: true, connections: data || [] }
    } catch (error) {
      console.error("Error in getBookConnections:", error)
      return { success: false, error: "Failed to get book connections" }
    }
  }
}
