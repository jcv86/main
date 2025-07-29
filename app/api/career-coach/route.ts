import { type NextRequest, NextResponse } from "next/server"
import { generateCareerAdvice, getConversationHistory } from "@/lib/ai-coach"

export async function POST(request: NextRequest) {
  try {
    const { message, userId } = await request.json()

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 })
    }

    const response = await generateCareerAdvice(message, userId)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in career coach API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const conversations = await getConversationHistory(userId)

    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Error getting conversation history:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
