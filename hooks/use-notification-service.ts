"use client"

import { useState } from "react"
import { notificationService, type NotificationData } from "@/lib/notification-service"
import { useAuth } from "@/contexts/auth-context"

export function useNotificationService() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const crearNotificacion = async (data: NotificationData) => {
    if (!user?.id) return null

    setLoading(true)
    setError(null)

    try {
      const result = await notificationService.crearNotificacion(user.id, data)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear notificación")
      return null
    } finally {
      setLoading(false)
    }
  }

  const marcarComoLeida = async (notificationId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await notificationService.marcarComoLeida(notificationId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al marcar como leída")
      return false
    } finally {
      setLoading(false)
    }
  }

  const marcarTodasComoLeidas = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await notificationService.marcarTodasComoLeidas()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al marcar todas como leídas")
      return 0
    } finally {
      setLoading(false)
    }
  }

  const obtenerNotificaciones = async (filtros?: {
    categoria?: string
    prioridad?: string
    soloNoLeidas?: boolean
    limite?: number
  }) => {
    if (!user?.id) return []

    setLoading(true)
    setError(null)

    try {
      const result = await notificationService.obtenerNotificaciones(user.id, filtros)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al obtener notificaciones")
      return []
    } finally {
      setLoading(false)
    }
  }

  const eliminarNotificacion = async (notificationId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await notificationService.eliminarNotificacion(notificationId)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar notificación")
      return false
    } finally {
      setLoading(false)
    }
  }

  const limpiarTodas = async () => {
    if (!user?.id) return false

    setLoading(true)
    setError(null)

    try {
      const result = await notificationService.limpiarTodasLasNotificaciones(user.id)
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al limpiar notificaciones")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Métodos de conveniencia para notificaciones predefinidas
  const notificarEvaluacionCompletada = async (tipoEvaluacion: string) => {
    if (!user?.id) return null
    return notificationService.notificarEvaluacionCompletada(user.id, tipoEvaluacion)
  }

  const notificarNuevaOfertaTrabajo = async (empresa: string, puesto: string, urlTrabajo?: string) => {
    if (!user?.id) return null
    return notificationService.notificarNuevaOfertaTrabajo(user.id, empresa, puesto, urlTrabajo)
  }

  const notificarLibroRecomendado = async (tituloLibro: string, autor?: string) => {
    if (!user?.id) return null
    return notificationService.notificarLibroRecomendado(user.id, tituloLibro, autor)
  }

  const notificarLogroDesbloqueado = async (nombreLogro: string, descripcion: string) => {
    if (!user?.id) return null
    return notificationService.notificarLogroDesbloqueado(user.id, nombreLogro, descripcion)
  }

  const crearRecordatorio = async (titulo: string, mensaje: string, urlAccion?: string) => {
    if (!user?.id) return null
    return notificationService.crearRecordatorio(user.id, titulo, mensaje, urlAccion)
  }

  return {
    // Estados
    loading,
    error,

    // Métodos principales
    crearNotificacion,
    marcarComoLeida,
    marcarTodasComoLeidas,
    obtenerNotificaciones,
    eliminarNotificacion,
    limpiarTodas,

    // Métodos de conveniencia
    notificarEvaluacionCompletada,
    notificarNuevaOfertaTrabajo,
    notificarLibroRecomendado,
    notificarLogroDesbloqueado,
    crearRecordatorio,
  }
}
