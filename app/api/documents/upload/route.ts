import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { uploadToBlob, extractTextFromPDF, chunkText, generateEmbedding } from "@/lib/pdf-processor"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] [Documents Upload API] Starting document upload...")

    const supabase = await createClient()

    // Get user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User authenticated:", user.email)

    // Get form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Processing file:", file.name, "Size:", file.size)

    // Upload to Blob storage
    const { url: fileUrl, size: fileSize } = await uploadToBlob(file)
    console.log("[v0] File uploaded to Blob:", fileUrl)

    // Get user ID from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create document record
    const { data: document, error: docError } = await supabase
      .from("documents")
      .insert({
        user_id: userData.id,
        title: title || file.name,
        file_url: fileUrl,
        file_size: fileSize,
        mime_type: file.type,
        status: "processing",
      })
      .select()
      .single()

    if (docError) {
      console.error("[v0] Error creating document:", docError)
      return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
    }

    console.log("[v0] Document created:", document.id)

    // Process PDF in background (in a real app, use a queue/worker)
    // For now, we'll process it synchronously
    try {
      // Extract text from PDF
      const fileBuffer = await file.arrayBuffer()
      const { text, pageCount } = await extractTextFromPDF(fileBuffer)

      console.log("[v0] Text extracted, page count:", pageCount)

      // Update document with page count
      await supabase.from("documents").update({ page_count: pageCount }).eq("id", document.id)

      // Chunk the text
      const chunks = chunkText(text)
      console.log("[v0] Text chunked into", chunks.length, "chunks")

      // Generate embeddings and store chunks
      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.content)

        await supabase.from("document_chunks").insert({
          document_id: document.id,
          chunk_index: chunk.chunkIndex,
          content: chunk.content,
          embedding: JSON.stringify(embedding), // Store as JSON string
          token_count: chunk.tokenCount,
          page_number: chunk.pageNumber,
        })
      }

      console.log("[v0] All chunks processed and stored")

      // Update document status to ready
      await supabase.from("documents").update({ status: "ready" }).eq("id", document.id)

      return NextResponse.json({
        success: true,
        document: {
          ...document,
          status: "ready",
          page_count: pageCount,
        },
      })
    } catch (processingError) {
      console.error("[v0] Error processing document:", processingError)

      // Update document status to error
      await supabase
        .from("documents")
        .update({
          status: "error",
          error_message: processingError instanceof Error ? processingError.message : "Unknown error",
        })
        .eq("id", document.id)

      return NextResponse.json(
        {
          success: false,
          document: {
            ...document,
            status: "error",
          },
          error: "Failed to process document",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] [Documents Upload API] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
