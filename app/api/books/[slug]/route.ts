import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    console.log("Searching for book with slug:", slug)

    // First try to search by slug
    let { data: books, error } = await supabase.from("knowledge_base").select("*").eq("slug", slug).limit(1)

    console.log("Search by slug result:", { books, error })

    let book = books?.[0] || null

    // If no book found by slug, try by ID if slug is numeric
    if (!book && !isNaN(Number(slug))) {
      const id = Number(slug)
      const result = await supabase.from("knowledge_base").select("*").eq("id", id).limit(1)

      console.log("Search by ID result:", result)
      book = result.data?.[0] || null
      error = result.error
    }

    // If still no book found, try partial slug match
    if (!book) {
      const partialResult = await supabase.from("knowledge_base").select("*").ilike("slug", `%${slug}%`).limit(1)

      console.log("Partial slug search result:", partialResult)
      book = partialResult.data?.[0] || null
    }

    // If still no book found, try title match
    if (!book) {
      const titleResult = await supabase
        .from("knowledge_base")
        .select("*")
        .ilike("title", `%${slug.replace(/-/g, " ")}%`)
        .limit(1)

      console.log("Title search result:", titleResult)
      book = titleResult.data?.[0] || null
    }

    if (!book) {
      console.log("No book found for slug:", slug)
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Increment read count
    try {
      await supabase
        .from("knowledge_base")
        .update({ read_count: (book.read_count || 0) + 1 })
        .eq("id", book.id)
    } catch (updateError) {
      console.error("Error updating read count:", updateError)
      // Don't fail the request if we can't update the count
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error in book API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
