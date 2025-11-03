import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { put } from "@vercel/blob"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function extractText(file: File): Promise<string> {
  const fileType = file.type
  const text = await file.text()

  if (fileType === "text/csv" || fileType === "text/plain") {
    return text
  }

  if (fileType === "application/pdf") {
    // Para PDFs, usamos una aproximación simple
    // En producción, usar una librería como pdf-parse
    return text
  }

  return text
}

function chunkText(text: string, chunkSize = 1000): string[] {
  const chunks: string[] = []
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]

  let currentChunk = ""

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verificar que el usuario es admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("email").eq("id", user.id).single()

    const adminEmails = ["travis@nuanu.com", "rjvial@gn.cl"]
    if (!profile || !adminEmails.includes(profile.email)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const category = (formData.get("category") as string) || "General"
    const tagsString = formData.get("tags") as string
    const tags = tagsString ? tagsString.split(",").map((t) => t.trim()) : []

    if (!file || !title) {
      return NextResponse.json({ error: "Archivo y título son requeridos" }, { status: 400 })
    }

    console.log("[v0] Uploading file to blob storage:", file.name)

    // Subir archivo a Blob storage
    const blob = await put(file.name, file, {
      access: "public",
    })

    console.log("[v0] File uploaded to blob:", blob.url)

    // Extraer texto del archivo
    const text = await extractText(file)
    console.log("[v0] Extracted text length:", text.length)

    // Crear documento en la base de datos
    const { data: document, error: docError } = await supabase
      .from("documents")
      .insert({
        title,
        file_url: blob.url,
        file_type: file.type.split("/")[1] || "unknown",
        category,
        tags,
        uploaded_by: user.id,
        is_active: true,
      })
      .select()
      .single()

    if (docError) {
      console.error("[v0] Error creating document:", docError)
      throw docError
    }

    console.log("[v0] Document created:", document.id)

    // Dividir texto en chunks y generar embeddings
    const chunks = chunkText(text)
    console.log("[v0] Created", chunks.length, "chunks")

    const chunkInserts = []
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]

      // Generar embedding
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: chunk,
      })

      const embedding = embeddingResponse.data[0].embedding

      chunkInserts.push({
        document_id: document.id,
        content: chunk,
        chunk_index: i,
        embedding,
      })

      console.log(`[v0] Processed chunk ${i + 1}/${chunks.length}`)
    }

    // Insertar todos los chunks
    const { error: chunksError } = await supabase.from("document_chunks").insert(chunkInserts)

    if (chunksError) {
      console.error("[v0] Error inserting chunks:", chunksError)
      throw chunksError
    }

    console.log("[v0] All chunks inserted successfully")

    return NextResponse.json({
      success: true,
      document: {
        ...document,
        chunk_count: chunks.length,
      },
    })
  } catch (error: any) {
    console.error("[v0] Error in brain upload:", error)
    return NextResponse.json({ error: error.message || "Error al procesar documento" }, { status: 500 })
  }
}
