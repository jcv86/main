"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  createdAt: Date
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, "id" | "read" | "createdAt">) => void
  removeNotification: (id: string) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "¡Bienvenido!",
      message: "Bienvenido a la plataforma Despega tu Carrera",
      type: "info",
      read: false,
      createdAt: new Date(),
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const addNotification = (notification: Omit<Notification, "id" | "read" | "createdAt">) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Add some demo notifications
  useEffect(() => {
    const demoNotifications = [
      {
        title: "Bienvenido a Despega Tu Carrera",
        message: "Completa tu perfil para obtener recomendaciones personalizadas",
        type: "info" as const,
      },
      {
        title: "Nueva oportunidad laboral",
        message: "Hay 5 nuevas ofertas que coinciden con tu perfil",
        type: "success" as const,
      },
    ]

    demoNotifications.forEach((notification) => {
      setTimeout(() => addNotification(notification), 1000)
    })
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}
