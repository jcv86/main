"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Notification {
  id: string
  titulo: string
  mensaje: string
  tipo: "info" | "exito" | "advertencia" | "error"
  leida: boolean
  fechaCreacion: string
  urlAccion?: string
  categoria?: "evaluacion" | "trabajo" | "biblioteca" | "coach" | "sistema" | "logro"
  prioridad?: "baja" | "media" | "alta" | "urgente"
  icono?: string
  created_at: string
  read: boolean
  title: string
  message: string
}

interface NotificationsContextType {
  notifications: Notification[]
  notificacionesNoLeidas: number
  unreadCount: number
  agregarNotificacion: (
    notification: Omit<Notification, "id" | "fechaCreacion" | "leida" | "created_at" | "read" | "title" | "message">,
  ) => void
  addNotification: (
    notification: Omit<Notification, "id" | "fechaCreacion" | "leida" | "created_at" | "read" | "title" | "message">,
  ) => void
  marcarComoLeida: (id: string) => void
  markAsRead: (id: string) => void
  marcarTodasComoLeidas: () => void
  markAllAsRead: () => void
  eliminarNotificacion: (id: string) => void
  removeNotification: (id: string) => void
  limpiarTodas: () => void
  clearAll: () => void
  obtenerNotificacionesPorCategoria: (categoria: string) => Notification[]
  obtenerNotificacionesPorPrioridad: (prioridad: string) => Notification[]
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Plantillas de notificaciones en español
const plantillasNotificaciones = {
  bienvenida: {
    titulo: "¡Bienvenido a tu plataforma de desarrollo profesional!",
    mensaje:
      "Comienza explorando las evaluaciones de personalidad y habilidades para conocer mejor tu perfil profesional.",
    tipo: "info" as const,
    categoria: "sistema" as const,
    prioridad: "media" as const,
    icono: "👋",
  },
  evaluacionCompletada: {
    titulo: "Evaluación completada exitosamente",
    mensaje: "Has completado una nueva evaluación. Revisa tus resultados en tu perfil.",
    tipo: "exito" as const,
    categoria: "evaluacion" as const,
    prioridad: "media" as const,
    icono: "✅",
  },
  nuevaOfertaTrabajo: {
    titulo: "Nueva oferta de trabajo disponible",
    mensaje: "Encontramos una nueva oportunidad laboral que coincide con tu perfil.",
    tipo: "info" as const,
    categoria: "trabajo" as const,
    prioridad: "alta" as const,
    icono: "💼",
  },
  libroRecomendado: {
    titulo: "Nuevo libro recomendado",
    mensaje: "Basado en tu perfil, te recomendamos un nuevo libro para tu desarrollo profesional.",
    tipo: "info" as const,
    categoria: "biblioteca" as const,
    prioridad: "baja" as const,
    icono: "📚",
  },
  sesionCoachProgramada: {
    titulo: "Sesión de coaching programada",
    mensaje: "Tu próxima sesión de coaching está programada para mañana a las 15:00.",
    tipo: "advertencia" as const,
    categoria: "coach" as const,
    prioridad: "alta" as const,
    icono: "🎯",
  },
  logroDesbloqueado: {
    titulo: "¡Nuevo logro desbloqueado!",
    mensaje: "Has completado 5 evaluaciones. ¡Sigue así!",
    tipo: "exito" as const,
    categoria: "logro" as const,
    prioridad: "media" as const,
    icono: "🏆",
  },
  recordatorioCV: {
    titulo: "Actualiza tu CV",
    mensaje: "No has actualizado tu CV en los últimos 30 días. Te recomendamos mantenerlo actualizado.",
    tipo: "advertencia" as const,
    categoria: "sistema" as const,
    prioridad: "media" as const,
    icono: "📄",
  },
  errorSistema: {
    titulo: "Error en el sistema",
    mensaje: "Hemos detectado un problema técnico. Nuestro equipo está trabajando para solucionarlo.",
    tipo: "error" as const,
    categoria: "sistema" as const,
    prioridad: "urgente" as const,
    icono: "⚠️",
  },
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Cargar notificaciones desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem("notificaciones-carrera")
    if (stored) {
      try {
        const parsedNotifications = JSON.parse(stored)
        // Migrar notificaciones antiguas al nuevo formato
        const migratedNotifications = parsedNotifications.map((notif: any) => ({
          ...notif,
          titulo: notif.titulo || notif.title || "Notificación",
          mensaje: notif.mensaje || notif.message || "",
          tipo: notif.tipo || notif.type || "info",
          leida: notif.leida !== undefined ? notif.leida : notif.read || false,
          fechaCreacion: notif.fechaCreacion || notif.createdAt || notif.created_at || new Date().toISOString(),
          categoria: notif.categoria || "sistema",
          prioridad: notif.prioridad || "media",
          icono: notif.icono || "📢",
          // Mantener compatibilidad con versión anterior
          title: notif.titulo || notif.title || "Notificación",
          message: notif.mensaje || notif.message || "",
          read: notif.leida !== undefined ? notif.leida : notif.read || false,
          created_at: notif.fechaCreacion || notif.createdAt || notif.created_at || new Date().toISOString(),
        }))
        setNotifications(migratedNotifications)
      } catch (error) {
        console.error("Error al cargar notificaciones:", error)
        // Crear notificación de bienvenida si hay error
        const bienvenida = crearNotificacionDesdePlantilla("bienvenida")
        setNotifications([bienvenida])
      }
    } else {
      // Crear notificaciones iniciales para nuevos usuarios
      const notificacionesIniciales = [
        crearNotificacionDesdePlantilla("bienvenida"),
        {
          ...crearNotificacionDesdePlantilla("libroRecomendado"),
          mensaje: "Te recomendamos comenzar con 'Hábitos Atómicos' para mejorar tu productividad personal.",
        },
      ]
      setNotifications(notificacionesIniciales)
    }
  }, [])

  // Guardar notificaciones en localStorage cuando cambien
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("notificaciones-carrera", JSON.stringify(notifications))
    }
  }, [notifications])

  // Función para crear notificación desde plantilla
  function crearNotificacionDesdePlantilla(plantilla: keyof typeof plantillasNotificaciones): Notification {
    const template = plantillasNotificaciones[plantilla]
    return {
      id: `${plantilla}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...template,
      fechaCreacion: new Date().toISOString(),
      leida: false,
      // Compatibilidad con versión anterior
      title: template.titulo,
      message: template.mensaje,
      read: false,
      created_at: new Date().toISOString(),
    }
  }

  const agregarNotificacion = (
    notification: Omit<Notification, "id" | "fechaCreacion" | "leida" | "created_at" | "read" | "title" | "message">,
  ) => {
    const nuevaNotificacion: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fechaCreacion: new Date().toISOString(),
      leida: false,
      categoria: notification.categoria || "sistema",
      prioridad: notification.prioridad || "media",
      icono: notification.icono || "📢",
      // Compatibilidad con versión anterior
      title: notification.titulo,
      message: notification.mensaje,
      read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications((prev) => [nuevaNotificacion, ...prev.slice(0, 49)]) // Mantener máximo 50 notificaciones
  }

  const marcarComoLeida = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, leida: true, read: true } : notification,
      ),
    )
  }

  const marcarTodasComoLeidas = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        leida: true,
        read: true,
      })),
    )
  }

  const eliminarNotificacion = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const limpiarTodas = () => {
    setNotifications([])
    localStorage.removeItem("notificaciones-carrera")
  }

  const obtenerNotificacionesPorCategoria = (categoria: string) => {
    return notifications.filter((notif) => notif.categoria === categoria)
  }

  const obtenerNotificacionesPorPrioridad = (prioridad: string) => {
    return notifications.filter((notif) => notif.prioridad === prioridad)
  }

  const notificacionesNoLeidas = notifications.filter((n) => !n.leida).length
  const unreadCount = notificacionesNoLeidas // Compatibilidad

  // Funciones de compatibilidad con versión anterior
  const addNotification = agregarNotificacion
  const markAsRead = marcarComoLeida
  const markAllAsRead = marcarTodasComoLeidas
  const removeNotification = eliminarNotificacion
  const clearAll = limpiarTodas

  const value: NotificationsContextType = {
    notifications,
    notificacionesNoLeidas,
    unreadCount,
    agregarNotificacion,
    addNotification,
    marcarComoLeida,
    markAsRead,
    marcarTodasComoLeidas,
    markAllAsRead,
    eliminarNotificacion,
    removeNotification,
    limpiarTodas,
    clearAll,
    obtenerNotificacionesPorCategoria,
    obtenerNotificacionesPorPrioridad,
  }

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications debe ser usado dentro de un NotificationsProvider")
  }
  return context
}

// Hook para agregar notificaciones predefinidas
export function useNotificationTemplates() {
  const { agregarNotificacion } = useNotifications()

  const notificarEvaluacionCompletada = (tipoEvaluacion: string) => {
    agregarNotificacion({
      titulo: "¡Evaluación completada!",
      mensaje: `Has completado exitosamente la evaluación de ${tipoEvaluacion}. Revisa tus resultados en tu perfil.`,
      tipo: "exito",
      categoria: "evaluacion",
      prioridad: "media",
      icono: "✅",
    })
  }

  const notificarNuevaOfertaTrabajo = (empresa: string, puesto: string) => {
    agregarNotificacion({
      titulo: "Nueva oportunidad laboral",
      mensaje: `${empresa} está buscando un ${puesto}. Esta oferta coincide con tu perfil profesional.`,
      tipo: "info",
      categoria: "trabajo",
      prioridad: "alta",
      icono: "💼",
    })
  }

  const notificarLibroRecomendado = (tituloLibro: string) => {
    agregarNotificacion({
      titulo: "Nuevo libro recomendado",
      mensaje: `Basado en tu perfil, te recomendamos leer "${tituloLibro}" para tu desarrollo profesional.`,
      tipo: "info",
      categoria: "biblioteca",
      prioridad: "baja",
      icono: "📚",
    })
  }

  const notificarLogroDesbloqueado = (nombreLogro: string, descripcion: string) => {
    agregarNotificacion({
      titulo: `¡Logro desbloqueado: ${nombreLogro}!`,
      mensaje: descripcion,
      tipo: "exito",
      categoria: "logro",
      prioridad: "media",
      icono: "🏆",
    })
  }

  const notificarRecordatorio = (titulo: string, mensaje: string) => {
    agregarNotificacion({
      titulo,
      mensaje,
      tipo: "advertencia",
      categoria: "sistema",
      prioridad: "media",
      icono: "⏰",
    })
  }

  return {
    notificarEvaluacionCompletada,
    notificarNuevaOfertaTrabajo,
    notificarLibroRecomendado,
    notificarLogroDesbloqueado,
    notificarRecordatorio,
  }
}
