import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Return available CV templates
    const templates = [
      {
        id: "modern",
        name: "Moderno",
        description: "Diseño limpio y profesional con acentos azules",
        category: "professional",
        preview_url: "/templates/modern-preview.png",
        is_premium: false,
        features: ["Diseño responsivo", "Colores personalizables", "Secciones flexibles"],
      },
      {
        id: "classic",
        name: "Clásico",
        description: "Estilo tradicional corporativo",
        category: "traditional",
        preview_url: "/templates/classic-preview.png",
        is_premium: false,
        features: ["Formato tradicional", "Fácil de leer", "ATS-friendly"],
      },
      {
        id: "creative",
        name: "Creativo",
        description: "Diseño con gradiente púrpura para roles creativos",
        category: "creative",
        preview_url: "/templates/creative-preview.png",
        is_premium: true,
        features: ["Diseño único", "Colores vibrantes", "Ideal para creativos"],
      },
      {
        id: "minimal",
        name: "Minimalista",
        description: "Diseño limpio enfocado en tipografía",
        category: "minimal",
        preview_url: "/templates/minimal-preview.png",
        is_premium: false,
        features: ["Diseño limpio", "Enfoque en contenido", "Muy legible"],
      },
    ]

    return NextResponse.json({
      success: true,
      data: templates,
    })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { templateId, customizations } = body

    // Save template customizations
    const { data: savedCustomization, error: saveError } = await supabase
      .from("cv_template_customizations")
      .upsert({
        user_id: user.id,
        template_id: templateId,
        customizations: customizations,
      })
      .select()
      .single()

    if (saveError) {
      console.error("Error saving customizations:", saveError)
      return NextResponse.json({ error: "Failed to save customizations" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: savedCustomization,
    })
  } catch (error) {
    console.error("Error saving template customizations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
