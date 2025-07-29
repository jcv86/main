import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) {
      console.error("Error al obtener notificaciones:", error)
      return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 })
    }

    // Transformar notificaciones al formato español
    const notificacionesEspanol =
      notifications?.map((notif) => ({
        id: notif.id,
        titulo: notif.title || "Notificación",
        mensaje: notif.message || "",
        tipo: notif.type || "info",
        leida: notif.read || false,
        fechaCreacion: notif.created_at,
        categoria: notif.category || "sistema",
        prioridad: notif.priority || "media",
        icono: notif.icon || "📢",
        urlAccion: notif.action_url,
        // Mantener compatibilidad
        title: notif.title,
        message: notif.message,
        read: notif.read,
        created_at: notif.created_at,
      })) || []

    return NextResponse.json({
      notifications: notificacionesEspanol,
      total: notificacionesEspanol.length,
      noLeidas: notificacionesEspanol.filter((n) => !n.leida).length,
    })
  } catch (error) {
    console.error("Error en API de notificaciones:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
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
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { titulo, mensaje, tipo, categoria, prioridad, icono, urlAccion } = body

    if (!titulo || !mensaje) {
      return NextResponse.json({ error: "Título y mensaje son requeridos" }, { status: 400 })
    }

    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        user_id: user.id,
        title: titulo,
        message: mensaje,
        type: tipo || "info",
        category: categoria || "sistema",
        priority: prioridad || "media",
        icon: icono || "📢",
        action_url: urlAccion,
        read: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error al crear notificación:", error)
      return NextResponse.json({ error: "Error al crear notificación" }, { status: 500 })
    }

    // Transformar respuesta al formato español
    const notificacionEspanol = {
      id: notification.id,
      titulo: notification.title,
      mensaje: notification.message,
      tipo: notification.type,
      leida: notification.read,
      fechaCreacion: notification.created_at,
      categoria: notification.category,
      prioridad: notification.priority,
      icono: notification.icon,
      urlAccion: notification.action_url,
      // Mantener compatibilidad
      title: notification.title,
      message: notification.message,
      read: notification.read,
      created_at: notification.created_at,
    }

    return NextResponse.json({
      notification: notificacionEspanol,
      mensaje: "Notificación creada exitosamente",
    })
  } catch (error) {
    console.error("Error al crear notificación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const body = await request.json()
    const { id, accion } = body

    if (!id) {
      return NextResponse.json({ error: "ID de notificación requerido" }, { status: 400 })
    }

    let updateData: any = {}

    switch (accion) {
      case "marcar-leida":
        updateData = { read: true }
        break
      case "marcar-no-leida":
        updateData = { read: false }
        break
      default:
        return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
    }

    const { data: notification, error } = await supabase
      .from("notifications")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar notificación:", error)
      return NextResponse.json({ error: "Error al actualizar notificación" }, { status: 500 })
    }

    return NextResponse.json({
      notification,
      mensaje: "Notificación actualizada exitosamente",
    })
  } catch (error) {
    console.error("Error al actualizar notificación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const accion = searchParams.get("accion")

    if (accion === "limpiar-todas") {
      const { error } = await supabase.from("notifications").delete().eq("user_id", user.id)

      if (error) {
        console.error("Error al limpiar notificaciones:", error)
        return NextResponse.json({ error: "Error al limpiar notificaciones" }, { status: 500 })
      }

      return NextResponse.json({ mensaje: "Todas las notificaciones han sido eliminadas" })
    }

    if (!id) {
      return NextResponse.json({ error: "ID de notificación requerido" }, { status: 400 })
    }

    const { error } = await supabase.from("notifications").delete().eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error al eliminar notificación:", error)
      return NextResponse.json({ error: "Error al eliminar notificación" }, { status: 500 })
    }

    return NextResponse.json({ mensaje: "Notificación eliminada exitosamente" })
  } catch (error) {
    console.error("Error al eliminar notificación:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
