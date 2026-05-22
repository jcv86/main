import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  console.log("[v0] ========== BRAIN UPLOAD START ==========")

  try {
    // 1. Verificar autenticación
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] No user authenticated")
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    console.log("[v0] User:", user.email)

    // 2. Verificar admin
    const { data: adminCheck } = await supabase.from("admin_emails").select("email").eq("email", user.email).single()

    if (!adminCheck) {
      console.log("[v0] User not admin")
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    console.log("[v0] Admin verified")

    // 3. Parsear form data
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const category = (formData.get("category") as string) || "General"
    const tagsString = formData.get("tags") as string
    const tags = tagsString ? tagsString.split(",").map((t) => t.trim()) : []

    console.log("[v0] File:", file?.name, "Title:", title)

    if (!file || !title) {
      return NextResponse.json({ error: "Archivo y título requeridos" }, { status: 400 })
    }

    // 4. Subir a Blob
    console.log("[v0] Uploading to blob...")
    const blob = await put(file.name, file, { access: "public" })
    console.log("[v0] Blob URL:", blob.url)

    // 5. Crear documento en DB
    console.log("[v0] Creating document...")
    const { data: document, error: docError } = await supabase
      .from("documents")
      .insert({
        title,
        file_url: blob.url,
        file_type: file.type.split("/")[1] || "unknown",
        category,
        tags,
        is_active: true,
      })
      .select()
      .single()

    if (docError) {
      console.error("[v0] DB Error:", docError)
      return NextResponse.json(
        {
          error: "Error al crear documento",
          details: docError.message,
        },
        { status: 500 },
      )
    }

    console.log("[v0] Document created:", document.id)
    console.log("[v0] ========== SUCCESS ==========")

    return NextResponse.json({
      success: true,
      document,
      message: "Documento subido exitosamente (procesamiento de embeddings pendiente)",
    })
  } catch (error: any) {
    console.error("[v0] ========== ERROR ==========")
    console.error("[v0] Error:", error.message)
    console.error("[v0] Stack:", error.stack)

    return NextResponse.json(
      {
        error: "Error al procesar documento",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
