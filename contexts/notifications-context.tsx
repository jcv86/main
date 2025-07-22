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

export interface Notification {
  id: string
  title: string
  message: string
  type: "job_match" | "career_advice" | "skill_update" | "interview_invite" | "system"
  priority: "high" | "medium" | "low"
  timestamp: string
  read: boolean
  actionUrl?: string
  metadata?: {
    company?: string
    position?: string
    salary?: string
    location?: string
    matchScore?: number
  }
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
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

// Sample UDD career-specific notifications
const SAMPLE_NOTIFICATIONS: Omit<Notification, "id" | "timestamp">[] = [
  {
    type: "job_match",
    title: "Nueva oportunidad: Product Manager en Fintual",
    message: "Encontramos una posición que coincide 92% con tu perfil de Ingeniería Comercial UDD",
    read: false,
    priority: "high",
    metadata: {
      company: "Fintual",
      location: "Santiago, Las Condes",
      salary: "$3.500.000 - $5.000.000 CLP",
      matchScore: 92,
    },
  },
  {
    type: "career_advice",
    title: "Consejo para estudiantes de Diseño UDD",
    message: "Considera especializarte en UX/UI Design - hay alta demanda en el mercado chileno",
    read: false,
    priority: "medium",
    metadata: {
      position: "UX/UI Designer",
    },
  },
  {
    type: "job_match",
    title: "Práctica profesional: Banco de Chile",
    message: "Oportunidad de práctica en transformación digital para estudiantes de Ing. Comercial",
    read: true,
    priority: "medium",
    metadata: {
      company: "Banco de Chile",
      location: "Santiago, Centro",
      salary: "$800.000 - $1.200.000 CLP",
      matchScore: 85,
    },
  },
  {
    type: "skill_update",
    title: "Evaluación de habilidades blandas disponible",
    message: "Completa tu evaluación de liderazgo para mejorar tu perfil profesional",
    read: true,
    priority: "low",
    metadata: {
      position: "Liderazgo y trabajo en equipo",
    },
  },
  {
    type: "job_match",
    title: "Comunicador Digital - NotCo",
    message: "El unicornio chileno busca comunicadores para su equipo de marketing",
    read: false,
    priority: "high",
    metadata: {
      company: "NotCo",
      location: "Santiago, Las Condes",
      salary: "$2.000.000 - $3.000.000 CLP",
      matchScore: 88,
    },
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
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
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
      type: "system",
      priority: "medium",
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
      type: "system",
      priority: "low",
      read: false,
    })
  }

  const clearNotifications = () => {
    setNotifications([])
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
