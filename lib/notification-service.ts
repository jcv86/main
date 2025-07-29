import { createClient } from "@/lib/supabase"

export interface NotificacionEspanol {
  id: string
  titulo: string
  mensaje: string
  tipo: "success" | "info" | "warning" | "error"
  categoria: "evaluacion" | "trabajo" | "biblioteca" | "coach" | "logros" | "sistema" | "recordatorio"
  prioridad: "baja" | "media" | "alta" | "urgente"
  icono: string
  urlAccion?: string
  leida: boolean
  fechaCreacion: string
  fechaActualizacion: string
}

export interface NotificationStats {
  total: number
  noLeidas: number
  leidas: number
  porCategoria: Record<string, number>
  porPrioridad: Record<string, number>
}

export class NotificationService {
  private supabase = createClient()

  // Obtener todas las notificaciones del usuario
  async obtenerNotificaciones(limite = 50): Promise<NotificacionEspanol[]> {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const { data: notifications, error } = await this.supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limite)

      if (error) {
        throw new Error(`Error al obtener notificaciones: ${error.message}`)
      }

      return this.transformarNotificaciones(notifications || [])
    } catch (error) {
      console.error("Error en obtenerNotificaciones:", error)
      throw error
    }
  }

  // Crear una nueva notificación
  async crearNotificacion(
    titulo: string,
    mensaje: string,
    tipo: NotificacionEspanol["tipo"] = "info",
    categoria: NotificacionEspanol["categoria"] = "sistema",
    prioridad: NotificacionEspanol["prioridad"] = "media",
    icono = "📢",
    urlAccion?: string,
  ): Promise<NotificacionEspanol> {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const { data: notification, error } = await this.supabase
        .from("notifications")
        .insert({
          user_id: user.id,
          title: titulo,
          message: mensaje,
          type: tipo,
          category: categoria,
          priority: prioridad,
          icon: icono,
          action_url: urlAccion,
          read: false,
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Error al crear notificación: ${error.message}`)
      }

      return this.transformarNotificacion(notification)
    } catch (error) {
      console.error("Error en crearNotificacion:", error)
      throw error
    }
  }

  // Marcar notificación como leída
  async marcarComoLeida(id: string): Promise<void> {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const { error } = await this.supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id)
        .eq("user_id", user.id)

      if (error) {
        throw new Error(`Error al marcar como leída: ${error.message}`)
      }
    } catch (error) {
      console.error("Error en marcarComoLeida:", error)
      throw error
    }
  }

  // Marcar todas las notificaciones como leídas
  async marcarTodasComoLeidas(): Promise<void> {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const { error } = await this.supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false)

      if (error) {
        throw new Error(`Error al marcar todas como leídas: ${error.message}`)
      }
    } catch (error) {
      console.error("Error en marcarTodasComoLeidas:", error)
      throw error
    }
  }

  // Eliminar notificación
  async eliminarNotificacion(id: string): Promise<void> {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const { error } = await this.supabase.from("notifications").delete().eq("id", id).eq("user_id", user.id)

      if (error) {
        throw new Error(`Error al eliminar notificación: ${error.message}`)
      }
    } catch (error) {
      console.error("Error en eliminarNotificacion:", error)
      throw error
    }
  }

  // Limpiar todas las notificaciones
  async limpiarTodasLasNotificaciones(): Promise<void> {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const { error } = await this.supabase.from("notifications").delete().eq("user_id", user.id)

      if (error) {
        throw new Error(`Error al limpiar notificaciones: ${error.message}`)
      }
    } catch (error) {
      console.error("Error en limpiarTodasLasNotificaciones:", error)
      throw error
    }
  }

  // Obtener estadísticas de notificaciones
  async obtenerEstadisticas(): Promise<NotificationStats> {
    try {
      const {
        data: { user },
        error: authError,
      } = await this.supabase.auth.getUser()

      if (authError || !user) {
        throw new Error("Usuario no autenticado")
      }

      const { data: notifications, error } = await this.supabase
        .from("notifications")
        .select("read, category, priority")
        .eq("user_id", user.id)

      if (error) {
        throw new Error(`Error al obtener estadísticas: ${error.message}`)
      }

      const stats: NotificationStats = {
        total: notifications?.length || 0,
        noLeidas: notifications?.filter((n) => !n.read).length || 0,
        leidas: notifications?.filter((n) => n.read).length || 0,
        porCategoria: {},
        porPrioridad: {},
      }

      // Contar por categoría
      notifications?.forEach((n) => {
        stats.porCategoria[n.category] = (stats.porCategoria[n.category] || 0) + 1
        stats.porPrioridad[n.priority] = (stats.porPrioridad[n.priority] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error("Error en obtenerEstadisticas:", error)
      throw error
    }
  }

  // Métodos de conveniencia para tipos específicos de notificaciones
  async notificarEvaluacionCompletada(tipoEvaluacion: string): Promise<NotificacionEspanol> {
    return this.crearNotificacion(
      "Evaluación completada",
      `Has completado exitosamente la evaluación de ${tipoEvaluacion}. Revisa tus resultados.`,
      "success",
      "evaluacion",
      "media",
      "✅",
    )
  }

  async notificarNuevaOportunidadLaboral(empresa: string, puesto: string): Promise<NotificacionEspanol> {
    return this.crearNotificacion(
      "Nueva oportunidad laboral",
      `${empresa} está buscando un ${puesto}. ¡Podría ser perfecto para ti!`,
      "info",
      "trabajo",
      "alta",
      "💼",
      "/job-search",
    )
  }

  async notificarLibroRecomendado(titulo: string): Promise<NotificacionEspanol> {
    return this.crearNotificacion(
      "Libro recomendado",
      `Te recomendamos leer "${titulo}" basado en tu perfil profesional.`,
      "info",
      "biblioteca",
      "baja",
      "📚",
      "/library",
    )
  }

  async notificarLogroDesbloqueado(logro: string): Promise<NotificacionEspanol> {
    return this.crearNotificacion(
      "¡Logro desbloqueado!",
      `Has desbloqueado el logro: ${logro}`,
      "success",
      "logros",
      "alta",
      "🏆",
    )
  }

  async notificarRecordatorioCV(): Promise<NotificacionEspanol> {
    return this.crearNotificacion(
      "Actualiza tu CV",
      "Es recomendable actualizar tu CV cada 3 meses. ¡Hazlo ahora!",
      "warning",
      "recordatorio",
      "media",
      "📄",
      "/cv-builder",
    )
  }

  // Transformar datos de la base de datos al formato español
  private transformarNotificaciones(notifications: any[]): NotificacionEspanol[] {
    return notifications.map(this.transformarNotificacion)
  }

  private transformarNotificacion(notification: any): NotificacionEspanol {
    return {
      id: notification.id,
      titulo: notification.title,
      mensaje: notification.message,
      tipo: notification.type,
      categoria: notification.category,
      prioridad: notification.priority,
      icono: notification.icon,
      urlAccion: notification.action_url,
      leida: notification.read,
      fechaCreacion: notification.created_at,
      fechaActualizacion: notification.updated_at,
    }
  }
}

// Instancia singleton del servicio
export const notificationService = new NotificationService()
