import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: documents, error } = await supabase
      .from("documents")
      .select(`
        *,
        chunk_count:document_chunks(count)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    // Formatear el conteo de chunks
    const formattedDocuments = documents?.map((doc) => ({
      ...doc,
      chunk_count: doc.chunk_count?.[0]?.count || 0,
    }))

    return NextResponse.json({ documents: formattedDocuments })
  } catch (error: any) {
    console.error("[v0] Error fetching documents:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
