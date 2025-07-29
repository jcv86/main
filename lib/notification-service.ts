import { createClient } from "@/lib/supabase-server"

export interface NotificationData {
  titulo: string
  mensaje: string
  tipo: "info" | "success" | "warning" | "error"
  categoria: "evaluacion" | "trabajo" | "biblioteca" | "coach" | "logro" | "sistema"
  prioridad: "baja" | "media" | "alta" | "urgente"
  icono?: string
  urlAccion?: string
}

export class NotificationService {
  private supabase = createClient()

  /**
   * Crear una nueva notificación para un usuario
   */
  async crearNotificacion(userId: string, data: NotificationData): Promise<string | null> {
    try {
      const { data: result, error } = await this.supabase.rpc("create_notification", {
        p_user_id: userId,
        p_title: data.titulo,
        p_message: data.mensaje,
        p_type: data.tipo,
        p_category: data.categoria,
        p_priority: data.prioridad,
        p_icon: data.icono || this.getDefaultIcon(data.tipo),
        p_action_url: data.urlAccion,
      })

      if (error) {
        console.error("Error al crear notificación:", error)
        return null
      }

      return result
    } catch (error) {
      console.error("Error en servicio de notificaciones:", error)
      return null
    }
  }

  /**
   * Marcar una notificación como leída
   */
  async marcarComoLeida(notificationId: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.rpc("mark_notification_as_read", {
        notification_id: notificationId,
      })

      if (error) {
        console.error("Error al marcar notificación como leída:", error)
        return false
      }

      return data
    } catch (error) {
      console.error("Error en servicio de notificaciones:", error)
      return false
    }
  }

  /**
   * Marcar todas las notificaciones como leídas
   */
  async marcarTodasComoLeidas(): Promise<number> {
    try {
      const { data, error } = await this.supabase.rpc("mark_all_notifications_as_read")

      if (error) {
        console.error("Error al marcar todas las notificaciones como leídas:", error)
        return 0
      }

      return data || 0
    } catch (error) {
      console.error("Error en servicio de notificaciones:", error)
      return 0
    }
  }

  /**
   * Obtener estadísticas de notificaciones
   */
  async obtenerEstadisticas(userId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase.rpc("get_notification_stats", {
        p_user_id: userId,
      })

      if (error) {
        console.error("Error al obtener estadísticas:", error)
        return {}
      }

      return data || {}
    } catch (error) {
      console.error("Error en servicio de notificaciones:", error)
      return {}
    }
  }

  /**
   * Obtener notificaciones de un usuario
   */
  async obtenerNotificaciones(
    userId: string,
    filtros?: {
      categoria?: string
      prioridad?: string
      soloNoLeidas?: boolean
      limite?: number
    },
  ): Promise<any[]> {
    try {
      let query = this.supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (filtros?.categoria && filtros.categoria !== "todas") {
        query = query.eq("category", filtros.categoria)
      }

      if (filtros?.prioridad && filtros.prioridad !== "todas") {
        query = query.eq("priority", filtros.prioridad)
      }

      if (filtros?.soloNoLeidas) {
        query = query.eq("read", false)
      }

      if (filtros?.limite) {
        query = query.limit(filtros.limite)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error al obtener notificaciones:", error)
        return []
      }

      // Transformar al formato español
      return (
        data?.map((notif) => ({
          id: notif.id,
          titulo: notif.title,
          mensaje: notif.message,
          tipo: notif.type,
          categoria: notif.category,
          prioridad: notif.priority,
          icono: notif.icon,
          urlAccion: notif.action_url,
          leida: notif.read,
          fechaCreacion: notif.created_at,
          fechaActualizacion: notif.updated_at,
          // Mantener compatibilidad
          title: notif.title,
          message: notif.message,
          read: notif.read,
          created_at: notif.created_at,
        })) || []
      )
    } catch (error) {
      console.error("Error en servicio de notificaciones:", error)
      return []
    }
  }

  /**
   * Eliminar una notificación
   */
  async eliminarNotificacion(notificationId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("notifications").delete().eq("id", notificationId)

      if (error) {
        console.error("Error al eliminar notificación:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error en servicio de notificaciones:", error)
      return false
    }
  }

  /**
   * Limpiar todas las notificaciones de un usuario
   */
  async limpiarTodasLasNotificaciones(userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.from("notifications").delete().eq("user_id", userId)

      if (error) {
        console.error("Error al limpiar notificaciones:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Error en servicio de notificaciones:", error)
      return false
    }
  }

  /**
   * Notificaciones predefinidas
   */
  async notificarEvaluacionCompletada(userId: string, tipoEvaluacion: string): Promise<string | null> {
    return this.crearNotificacion(userId, {
      titulo: "¡Evaluación completada exitosamente!",
      mensaje: `Has completado la evaluación de ${tipoEvaluacion}. Revisa tus resultados y recomendaciones personalizadas.`,
      tipo: "success",
      categoria: "evaluacion",
      prioridad: "media",
      icono: "✅",
      urlAccion: "/profile",
    })
  }

  async notificarNuevaOfertaTrabajo(
    userId: string,
    empresa: string,
    puesto: string,
    urlTrabajo?: string,
  ): Promise<string | null> {
    return this.crearNotificacion(userId, {
      titulo: "Nueva oportunidad laboral disponible",
      mensaje: `${empresa} está buscando un ${puesto}. Esta oferta coincide con tu perfil profesional.`,
      tipo: "info",
      categoria: "trabajo",
      prioridad: "alta",
      icono: "💼",
      urlAccion: urlTrabajo || "/job-search",
    })
  }

  async notificarLibroRecomendado(userId: string, tituloLibro: string, autor?: string): Promise<string | null> {
    const mensaje = autor
      ? `Te recomendamos leer "${tituloLibro}" de ${autor} para tu desarrollo profesional.`
      : `Te recomendamos leer "${tituloLibro}" para tu desarrollo profesional.`

    return this.crearNotificacion(userId, {
      titulo: "Nuevo libro recomendado",
      mensaje,
      tipo: "info",
      categoria: "biblioteca",
      prioridad: "baja",
      icono: "📚",
      urlAccion: "/library",
    })
  }

  async notificarLogroDesbloqueado(userId: string, nombreLogro: string, descripcion: string): Promise<string | null> {
    return this.crearNotificacion(userId, {
      titulo: `¡Logro desbloqueado: ${nombreLogro}!`,
      mensaje: descripcion,
      tipo: "success",
      categoria: "logro",
      prioridad: "media",
      icono: "🏆",
      urlAccion: "/profile",
    })
  }

  async crearRecordatorio(userId: string, titulo: string, mensaje: string, urlAccion?: string): Promise<string | null> {
    return this.crearNotificacion(userId, {
      titulo,
      mensaje,
      tipo: "warning",
      categoria: "sistema",
      prioridad: "media",
      icono: "⏰",
      urlAccion,
    })
  }

  /**
   * Obtener icono por defecto según el tipo
   */
  private getDefaultIcon(tipo: string): string {
    const iconos = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    }
    return iconos[tipo as keyof typeof iconos] || "📢"
  }

  /**
   * Limpiar notificaciones antiguas
   */
  async limpiarNotificacionesAntiguas(): Promise<number> {
    try {
      const { data, error } = await this.supabase.rpc("cleanup_old_notifications")

      if (error) {
        console.error("Error al limpiar notificaciones antiguas:", error)
        return 0
      }

      return data || 0
    } catch (error) {
      console.error("Error en servicio de notificaciones:", error)
      return 0
    }
  }
}

// Instancia singleton del servicio
export const notificationService = new NotificationService()

// Hook para usar el servicio en componentes
export function useNotificationService() {
  return notificationService
}
