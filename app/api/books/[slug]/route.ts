import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    console.log("[v0] Searching for book with slug:", slug)

    let book = null
    let error = null

    if (!isNaN(Number(slug))) {
      const id = Number(slug)
      const result = await supabase.from("knowledge_base").select("*").eq("id", id).limit(1)

      console.log("[v0] Search by ID result:", result)
      book = result.data?.[0] || null
      error = result.error
    }

    // If still no book found, try title match
    if (!book) {
      const titleResult = await supabase
        .from("knowledge_base")
        .select("*")
        .ilike("title", `%${slug.replace(/-/g, " ")}%`)
        .limit(1)

      console.log("[v0] Title search result:", titleResult)
      book = titleResult.data?.[0] || null
    }

    if (!book) {
      console.log("[v0] No book found for slug:", slug)
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Increment read count
    try {
      await supabase
        .from("knowledge_base")
        .update({ read_count: (book.read_count || 0) + 1 })
        .eq("id", book.id)
    } catch (updateError) {
      console.error("[v0] Error updating read count:", updateError)
      // Don't fail the request if we can't update the count
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("[v0] Error in book API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
