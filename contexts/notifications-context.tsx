"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface JobAlert {
  id: string
  alertName: string
  career: string
  keywords: string[]
  locations: string[]
  jobTypes: string[]
  experienceLevel: string
  salaryRange: [number, number]
  remoteWork: boolean
  description: string
  frequency: string
  active: boolean
  createdAt: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: Date
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  jobAlerts: JobAlert[]
  addNotification: (notification: Omit<Notification, "id" | "timestamp">) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  createJobAlert: (alert: Omit<JobAlert, "id" | "createdAt">) => void
  updateJobAlert: (alertId: string, updates: Partial<JobAlert>) => void
  deleteJobAlert: (alertId: string) => void
  clearNotifications: () => void
  removeNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Sample UDD career-specific notifications
const SAMPLE_NOTIFICATIONS: Omit<Notification, "id" | "timestamp">[] = [
  {
    type: "info",
    title: "Nueva oportunidad: Product Manager en Fintual",
    message: "Encontramos una posición que coincide 92% con tu perfil de Ingeniería Comercial UDD",
  },
  {
    type: "success",
    title: "Consejo para estudiantes de Diseño UDD",
    message: "Considera especializarte en UX/UI Design - hay alta demanda en el mercado chileno",
  },
  {
    type: "info",
    title: "Práctica profesional: Banco de Chile",
    message: "Oportunidad de práctica en transformación digital para estudiantes de Ing. Comercial",
  },
  {
    type: "warning",
    title: "Evaluación de habilidades blandas disponible",
    message: "Completa tu evaluación de liderazgo para mejorar tu perfil profesional",
  },
  {
    type: "info",
    title: "Comunicador Digital - NotCo",
    message: "El unicornio chileno busca comunicadores para su equipo de marketing",
  },
]

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [jobAlerts, setJobAlerts] = useState<JobAlert[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedNotifications = localStorage.getItem("udd_notifications")
      const storedAlerts = localStorage.getItem("udd_job_alerts")

      if (storedNotifications) {
        const parsed = JSON.parse(storedNotifications)
        setNotifications(parsed)
        setUnreadCount(parsed.filter((n: Notification) => !n.read).length)
      }

      if (storedAlerts) {
        setJobAlerts(JSON.parse(storedAlerts))
      }
    } catch (error) {
      console.error("Error loading notifications data:", error)
    }
  }, [])

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("udd_notifications", JSON.stringify(notifications))
      setUnreadCount(notifications.filter((n) => !n.read).length)
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }, [notifications])

  // Save job alerts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("udd_job_alerts", JSON.stringify(jobAlerts))
    } catch (error) {
      console.error("Error saving job alerts:", error)
    }
  }, [jobAlerts])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev].slice(0, 50)) // Keep only last 50
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const createJobAlert = (alert: Omit<JobAlert, "id" | "createdAt">) => {
    const newAlert: JobAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    setJobAlerts((prev) => [...prev, newAlert])

    // Add a confirmation notification
    addNotification({
      title: "✅ Alerta de Empleo Creada",
      message: `Tu alerta "${alert.alertName}" está activa y comenzarás a recibir notificaciones según tu configuración.`,
      type: "success",
      read: false,
    })
  }

  const updateJobAlert = (alertId: string, updates: Partial<JobAlert>) => {
    setJobAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, ...updates } : alert)))
  }

  const deleteJobAlert = (alertId: string) => {
    setJobAlerts((prev) => prev.filter((alert) => alert.id !== alertId))

    addNotification({
      title: "🗑️ Alerta Eliminada",
      message: "Tu alerta de empleo ha sido eliminada exitosamente.",
      type: "warning",
      read: false,
    })
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const value = {
    notifications,
    unreadCount,
    jobAlerts,
    addNotification,
    markAsRead,
    markAllAsRead,
    createJobAlert,
    updateJobAlert,
    deleteJobAlert,
    clearNotifications,
    removeNotification,
  }

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}
