import { type NextRequest, NextResponse } from "next/server"
import {
  addWebResource,
  addWebResourcesBatch,
  getAllWebResources,
  getWebResourcesByCategory,
  searchUnifiedBrain,
} from "@/lib/web-resources"

// GET - Obtener recursos web
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    if (search) {
      // Búsqueda unificada en cerebro
      const results = await searchUnifiedBrain(search, category || undefined)
      return NextResponse.json({ results })
    }

    if (category) {
      // Filtrar por categoría
      const resources = await getWebResourcesByCategory(category)
      return NextResponse.json({ resources })
    }

    // Obtener todos los recursos
    const resources = await getAllWebResources()
    return NextResponse.json({ resources })
  } catch (error) {
    console.error("Error in GET /api/web-resources:", error)
    return NextResponse.json({ error: "Failed to fetch web resources" }, { status: 500 })
  }
}

// POST - Agregar nuevo recurso o batch de recursos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (Array.isArray(body)) {
      // Batch insert
      const resources = await addWebResourcesBatch(body)
      return NextResponse.json({
        success: true,
        count: resources.length,
        resources,
      })
    } else {
      // Single insert
      const resource = await addWebResource(body)
      return NextResponse.json({
        success: true,
        resource,
      })
    }
  } catch (error) {
    console.error("Error in POST /api/web-resources:", error)
    return NextResponse.json({ error: "Failed to add web resource(s)" }, { status: 500 })
  }
}
