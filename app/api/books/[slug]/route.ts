import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    console.log("[v0] Searching for book with slug:", slug)

    let book = null
    let source = null

    // First try to find in new books table by ID (numeric)
    if (!isNaN(Number(slug))) {
      const id = Number(slug)
      const result = await supabase.from("books").select("*").eq("id", id).limit(1)
      book = result.data?.[0] || null
      if (book) source = "books"
      
      // If not found in books, try knowledge_base
      if (!book) {
        const kbResult = await supabase.from("knowledge_base").select("*").eq("id", id).limit(1)
        book = kbResult.data?.[0] || null
        if (book) source = "knowledge_base"
      }
    }

    // Try title match in new books table
    if (!book) {
      const titleResult = await supabase
        .from("books")
        .select("*")
        .ilike("title", `%${slug.replace(/-/g, " ")}%`)
        .limit(1)
      book = titleResult.data?.[0] || null
      if (book) source = "books"
    }

    // Try title match in knowledge_base
    if (!book) {
      const titleResult = await supabase
        .from("knowledge_base")
        .select("*")
        .ilike("title", `%${slug.replace(/-/g, " ")}%`)
        .limit(1)
      book = titleResult.data?.[0] || null
      if (book) source = "knowledge_base"
    }

    if (!book) {
      console.log("[v0] No book found for slug:", slug)
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Increment read count for knowledge_base
    if (source === "knowledge_base") {
      try {
        await supabase
          .from("knowledge_base")
          .update({ read_count: (book.read_count || 0) + 1 })
          .eq("id", book.id)
      } catch (updateError) {
        console.error("[v0] Error updating read count:", updateError)
      }
    }

    return NextResponse.json({ ...book, source })
  } catch (error) {
    console.error("[v0] Error in book API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
