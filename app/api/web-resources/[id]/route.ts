import { type NextRequest, NextResponse } from "next/server"
import {
  getWebResourceById,
  updateWebResource,
  deleteWebResource,
  incrementWebResourceAccess,
} from "@/lib/web-resources"

// GET - Obtener recurso específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const resource = await getWebResourceById(id)

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Incrementar contador de acceso
    await incrementWebResourceAccess(id)

    return NextResponse.json({ resource })
  } catch (error) {
    console.error("Error in GET /api/web-resources/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch web resource" }, { status: 500 })
  }
}

// PATCH - Actualizar recurso
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const updates = await request.json()

    const resource = await updateWebResource(id, updates)

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      resource,
    })
  } catch (error) {
    console.error("Error in PATCH /api/web-resources/[id]:", error)
    return NextResponse.json({ error: "Failed to update web resource" }, { status: 500 })
  }
}

// DELETE - Eliminar recurso
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const success = await deleteWebResource(id)

    if (!success) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/web-resources/[id]:", error)
    return NextResponse.json({ error: "Failed to delete web resource" }, { status: 500 })
  }
}
