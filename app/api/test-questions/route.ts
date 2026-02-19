import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get("type")

    if (!testType) {
      return NextResponse.json({ error: "Test type is required" }, { status: 400 })
    }

    // Try to get questions from database first
    const { data, error } = await supabase
      .from("test_questions")
      .select("*")
      .eq("test_type", testType)
      .order("question_number")

    if (error) {
      console.error("Error fetching questions from database:", error)
      return NextResponse.json({ error: "Failed to fetch questions from database" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No questions found for this test type" }, { status: 404 })
    }

    // Parse JSON options for each question
    const questions = data.map((question) => ({
      ...question,
      options: typeof question.options === "string" ? JSON.parse(question.options) : question.options,
    }))

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching test questions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
