import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] [Document Chat API] Starting chat request...")

    const supabase = await createClient()

    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { message, documentIds = [], bookIds = [], conversationId } = await request.json()

    if (!message || (documentIds.length === 0 && bookIds.length === 0)) {
      return NextResponse.json(
        { error: "Message and at least one source (document or book) are required" },
        { status: 400 },
      )
    }

    console.log("[v0] Chat request for documents:", documentIds, "and books:", bookIds)

    // Get user ID
    const { data: userData } = await supabase.from("users").select("id").eq("email", user.email).single()

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let context = ""

    if (documentIds.length > 0) {
      const { data: chunks, error: chunksError } = await supabase
        .from("document_chunks")
        .select("id, document_id, content, page_number")
        .in("document_id", documentIds)
        .limit(5)

      if (chunksError) {
        console.error("[v0] Error fetching chunks:", chunksError)
      } else {
        const docContext =
          chunks?.map((chunk, i) => `[Documento - Página ${chunk.page_number}]\n${chunk.content}`).join("\n\n") || ""
        context += docContext
      }

      console.log("[v0] Found", chunks?.length || 0, "document chunks")
    }

    if (bookIds.length > 0) {
      const { data: books, error: booksError } = await supabase
        .from("knowledge_base")
        .select("id, title, author, content")
        .in("id", bookIds)

      if (booksError) {
        console.error("[v0] Error fetching books:", booksError)
      } else {
        const bookContext =
          books
            ?.map((book, i) => `[Libro: "${book.title}" por ${book.author}]\n${book.content.substring(0, 3000)}`)
            .join("\n\n") || ""
        if (context) context += "\n\n"
        context += bookContext
      }

      console.log("[v0] Found", books?.length || 0, "books")
    }

    // Create or update conversation
    let finalConversationId = conversationId

    if (!conversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from("document_conversations")
        .insert({
          user_id: userData.id,
          document_ids: [...documentIds, ...bookIds.map((id) => `book_${id}`)],
          title: message.slice(0, 100),
        })
        .select()
        .single()

      if (convError) {
        console.error("[v0] Error creating conversation:", convError)
        return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
      }

      finalConversationId = newConversation.id
    }

    // Save user message
    await supabase.from("document_messages").insert({
      conversation_id: finalConversationId,
      role: "user",
      content: message,
    })

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

    const result = await streamText({
      model: openai("gpt-4-turbo"),
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    })

    // Convert stream to text for storage
    let fullResponse = ""
    const stream = result.toAIStream({
      onFinal: async (completion) => {
        fullResponse = completion

        // Save assistant message
        await supabase.from("document_messages").insert({
          conversation_id: finalConversationId,
          role: "assistant",
          content: fullResponse,
          sources: [], // Could add source tracking here
        })

        console.log("[v0] Assistant response saved")
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] [Document Chat API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
