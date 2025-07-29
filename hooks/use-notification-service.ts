"use client"

import { useState, useEffect, useCallback } from "react"
import { notificationService, type NotificacionEspanol, type NotificationStats } from "@/lib/notification-service"

export function useNotificationService() {
  const [notifications, setNotifications] = useState<NotificacionEspanol[]>([])
  const [stats, setStats] = useState<NotificationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar notificaciones
  const cargarNotificaciones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const notificaciones = await notificationService.obtenerNotificaciones()
      setNotifications(notificaciones)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar estadísticas
  const cargarEstadisticas = useCallback(async () => {
    try {
      const estadisticas = await notificationService.obtenerEstadisticas()
      setStats(estadisticas)
    } catch (err) {
      console.error("Error al cargar estadísticas:", err)
    }
  }, [])

  // Crear notificación
  const crearNotificacion = useCallback(
    async (
      titulo: string,
      mensaje: string,
      tipo?: NotificacionEspanol["tipo"],
      categoria?: NotificacionEspanol["categoria"],
      prioridad?: NotificacionEspanol["prioridad"],
      icono?: string,
      urlAccion?: string,
    ) => {
      try {
        const nuevaNotificacion = await notificationService.crearNotificacion(
          titulo,
          mensaje,
          tipo,
          categoria,
          prioridad,
          icono,
          urlAccion,
        )
        setNotifications((prev) => [nuevaNotificacion, ...prev])
        await cargarEstadisticas()
        return nuevaNotificacion
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al crear notificación")
        throw err
      }
    },
    [cargarEstadisticas],
  )

  // Marcar como leída
  const marcarComoLeida = useCallback(
    async (id: string) => {
      try {
        await notificationService.marcarComoLeida(id)
        setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, leida: true } : notif)))
        await cargarEstadisticas()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al marcar como leída")
        throw err
      }
    },
    [cargarEstadisticas],
  )

  // Marcar todas como leídas
  const marcarTodasComoLeidas = useCallback(async () => {
    try {
      await notificationService.marcarTodasComoLeidas()
      setNotifications((prev) => prev.map((notif) => ({ ...notif, leida: true })))
      await cargarEstadisticas()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al marcar todas como leídas")
      throw err
    }
  }, [cargarEstadisticas])

  // Eliminar notificación
  const eliminarNotificacion = useCallback(
    async (id: string) => {
      try {
        await notificationService.eliminarNotificacion(id)
        setNotifications((prev) => prev.filter((notif) => notif.id !== id))
        await cargarEstadisticas()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al eliminar notificación")
        throw err
      }
    },
    [cargarEstadisticas],
  )

  // Limpiar todas las notificaciones
  const limpiarTodas = useCallback(async () => {
    try {
      await notificationService.limpiarTodasLasNotificaciones()
      setNotifications([])
      await cargarEstadisticas()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al limpiar notificaciones")
      throw err
    }
  }, [cargarEstadisticas])

  // Métodos de conveniencia
  const notificarEvaluacionCompletada = useCallback(
    async (tipoEvaluacion: string) => {
      return notificationService.notificarEvaluacionCompletada(tipoEvaluacion).then((notif) => {
        setNotifications((prev) => [notif, ...prev])
        cargarEstadisticas()
        return notif
      })
    },
    [cargarEstadisticas],
  )

  const notificarNuevaOportunidadLaboral = useCallback(
    async (empresa: string, puesto: string) => {
      return notificationService.notificarNuevaOportunidadLaboral(empresa, puesto).then((notif) => {
        setNotifications((prev) => [notif, ...prev])
        cargarEstadisticas()
        return notif
      })
    },
    [cargarEstadisticas],
  )

  const notificarLibroRecomendado = useCallback(
    async (titulo: string) => {
      return notificationService.notificarLibroRecomendado(titulo).then((notif) => {
        setNotifications((prev) => [notif, ...prev])
        cargarEstadisticas()
        return notif
      })
    },
    [cargarEstadisticas],
  )

  const notificarLogroDesbloqueado = useCallback(
    async (logro: string) => {
      return notificationService.notificarLogroDesbloqueado(logro).then((notif) => {
        setNotifications((prev) => [notif, ...prev])
        cargarEstadisticas()
        return notif
      })
    },
    [cargarEstadisticas],
  )

  const notificarRecordatorioCV = useCallback(async () => {
    return notificationService.notificarRecordatorioCV().then((notif) => {
      setNotifications((prev) => [notif, ...prev])
      cargarEstadisticas()
      return notif
    })
  }, [cargarEstadisticas])

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarNotificaciones()
    cargarEstadisticas()
  }, [cargarNotificaciones, cargarEstadisticas])

  return {
    // Estado
    notifications,
    stats,
    loading,
    error,

    // Acciones básicas
    cargarNotificaciones,
    cargarEstadisticas,
    crearNotificacion,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    limpiarTodas,

    // Métodos de conveniencia
    notificarEvaluacionCompletada,
    notificarNuevaOportunidadLaboral,
    notificarLibroRecomendado,
    notificarLogroDesbloqueado,
    notificarRecordatorioCV,

    // Utilidades
    notificacionesNoLeidas: notifications.filter((n) => !n.leida),
    totalNoLeidas: notifications.filter((n) => !n.leida).length,
  }
}
