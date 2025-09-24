import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    // Intentar buscar por slug primero
    let { data: book, error } = await supabase.from("knowledge_base").select("*").eq("slug", slug).single()

    // Si no se encuentra por slug, intentar por ID
    if (error && error.code === "PGRST116") {
      const id = Number.parseInt(slug)
      if (!isNaN(id)) {
        const result = await supabase.from("knowledge_base").select("*").eq("id", id).single()

        book = result.data
        error = result.error
      }
    }

    if (error) {
      console.error("Error fetching book:", error)
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    // Incrementar contador de lectura
    await supabase
      .from("knowledge_base")
      .update({ read_count: (book.read_count || 0) + 1 })
      .eq("id", book.id)

    return NextResponse.json(book)
  } catch (error) {
    console.error("Error in book API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
