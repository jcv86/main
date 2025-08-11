import { type NextRequest, NextResponse } from "next/server"
import MirixLibraryIntegration from "@/lib/mirix-library-integration"

export async function POST(request: NextRequest) {
  try {
    const { action, userId, ...data } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const mirixLibrary = new MirixLibraryIntegration(userId)

    switch (action) {
      case "capture_insight":
        const { bookId, content, type, importance, tags, chapterId, pageNumber } = data
        const result = await mirixLibrary.captureInsight(bookId, content, type, importance, tags, chapterId, pageNumber)
        return NextResponse.json(result)

      case "start_session":
        const sessionResult = await mirixLibrary.startReadingSession(data.bookId)
        return NextResponse.json(sessionResult)

      case "end_session":
        const endResult = await mirixLibrary.endReadingSession(
          data.sessionId,
          data.pagesRead,
          data.comprehensionScore,
          data.notes,
        )
        return NextResponse.json(endResult)

      case "get_insights":
        const insights = await mirixLibrary.getBookInsights(data.bookId)
        return NextResponse.json(insights)

      case "get_stats":
        const stats = await mirixLibrary.getLibraryMemoryStats()
        return NextResponse.json(stats)

      case "search_insights":
        const searchResults = await mirixLibrary.searchInsights(data.query, data.tags)
        return NextResponse.json(searchResults)

      case "get_connections":
        const connections = await mirixLibrary.getBookConnections(data.bookId)
        return NextResponse.json(connections)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Mirix Library Integration API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const action = searchParams.get("action")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const mirixLibrary = new MirixLibraryIntegration(userId)

    switch (action) {
      case "stats":
        const stats = await mirixLibrary.getLibraryMemoryStats()
        return NextResponse.json(stats)

      case "insights":
        const bookId = searchParams.get("bookId")
        if (!bookId) {
          return NextResponse.json({ error: "Book ID is required" }, { status: 400 })
        }
        const insights = await mirixLibrary.getBookInsights(bookId)
        return NextResponse.json(insights)

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Mirix Library Integration GET API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
