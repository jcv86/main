import type { NextRequest } from "next/server"
import { createAdminClient } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] [Document Chat API] Starting chat request...")

    const supabase = createAdminClient()

    const { message, documentIds = [], bookIds = [] } = await request.json()

    console.log("[v0] Received request:", { message, documentIds, bookIds })

    if (!message || (documentIds.length === 0 && bookIds.length === 0)) {
      return new Response(
        JSON.stringify({ error: "Message and at least one source (document or book) are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    console.log("[v0] Chat request for documents:", documentIds, "and books:", bookIds)

    let context = ""

    if (documentIds.length > 0) {
      console.log("[v0] Fetching document chunks...")
      const { data: chunks, error: chunksError } = await supabase
        .from("document_chunks")
        .select("id, document_id, content, page_number")
        .in("document_id", documentIds)
        .order("chunk_index", { ascending: true })
        .limit(10)

      if (chunksError) {
        console.error("[v0] Error fetching chunks:", chunksError)
      } else {
        console.log("[v0] Found", chunks?.length || 0, "document chunks")
        const docContext =
          chunks?.map((chunk, i) => `[Documento - Página ${chunk.page_number}]\n${chunk.content}`).join("\n\n") || ""
        context += docContext
      }
    }

    if (bookIds.length > 0) {
      console.log("[v0] Fetching books...")
      const { data: books, error: booksError } = await supabase
        .from("knowledge_base")
        .select("id, title, author, content")
        .in("id", bookIds)

      if (booksError) {
        console.error("[v0] Error fetching books:", booksError)
      } else {
        console.log("[v0] Found", books?.length || 0, "books")
        const bookContext =
          books
            ?.map((book, i) => `[Libro: "${book.title}" por ${book.author}]\n${book.content.substring(0, 5000)}`)
            .join("\n\n") || ""
        if (context) context += "\n\n"
        context += bookContext
      }
    }

    if (!context) {
      console.error("[v0] No context found for the selected sources")
      return new Response(JSON.stringify({ error: "No content found for selected sources" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("[v0] Context length:", context.length, "characters")

    const systemPrompt = `Eres un asistente experto en análisis de documentos y libros. Tu trabajo es responder preguntas basándote ÚNICAMENTE en el contexto proporcionado.

Reglas importantes:
1. Solo usa información del contexto proporcionado (documentos PDF y/o libros de la biblioteca)
2. Si la respuesta no está en el contexto, di "No encuentro esa información en las fuentes proporcionadas"
3. Cita las fuentes relevantes cuando sea apropiado (menciona si viene de un documento o de un libro específico)
4. Sé preciso y conciso
5. Responde en español
6. Si hay información de múltiples fuentes, sintetiza y compara cuando sea relevante

Contexto de las fuentes:
${context}`

    console.log("[v0] Generating AI response...")

    const result = await streamText({
      model: "openai/gpt-4-turbo",
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    })

    const stream = result.toAIStream()

    console.log("[v0] Streaming response to client")

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] [Document Chat API] Error:", error)
    return new Response(JSON.stringify({ error: "Internal server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
