import { type NextRequest, NextResponse } from "next/server"
import {
  getWebResourceById,
  updateWebResource,
  deleteWebResource,
  incrementWebResourceAccess,
} from "@/lib/web-resources"

// GET - Obtener recurso específico
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resourceId = Number.parseInt(id)
    const resource = await getWebResourceById(resourceId)

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    // Incrementar contador de acceso
    await incrementWebResourceAccess(resourceId)

    return NextResponse.json({ resource })
  } catch (error) {
    console.error("Error in GET /api/web-resources/[id]:", error)
    return NextResponse.json({ error: "Failed to fetch web resource" }, { status: 500 })
  }
}

// PATCH - Actualizar recurso
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resourceId = Number.parseInt(id)
    const updates = await request.json()

    const resource = await updateWebResource(resourceId, updates)

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
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const resourceId = Number.parseInt(id)
    const success = await deleteWebResource(resourceId)

    if (!success) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in DELETE /api/web-resources/[id]:", error)
    return NextResponse.json({ error: "Failed to delete web resource" }, { status: 500 })
  }
}
