"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  BellRing,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Users,
  Settings,
  Plus,
  Clock,
  MapPin,
  DollarSign,
} from "lucide-react"

interface Notification {
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

interface NotificationsBellProps {
  onCreateAlert?: () => void
  onManageAlerts?: () => void
}

export function NotificationsBell({ onCreateAlert, onManageAlerts }: NotificationsBellProps = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load notifications from localStorage or generate demo data
    const loadNotifications = () => {
      try {
        const stored = localStorage.getItem("udd_notifications")
        if (stored) {
          const parsedNotifications = JSON.parse(stored)
          setNotifications(parsedNotifications)
          setUnreadCount(parsedNotifications.filter((n: Notification) => !n.read).length)
        } else {
          // Generate demo notifications for UDD students
          const demoNotifications: Notification[] = [
            {
              id: "1",
              title: "🎯 Nueva Oportunidad Perfecta",
              message:
                "Analista de Marketing Digital en Fintual - 95% de compatibilidad con tu perfil de Ingeniería Comercial",
              type: "job_match",
              priority: "high",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              read: false,
              actionUrl: "/job-search",
              metadata: {
                company: "Fintual",
                position: "Analista de Marketing Digital",
                salary: "$1.800.000 - $2.500.000 CLP",
                location: "Santiago, Las Condes",
                matchScore: 95,
              },
            },
            {
              id: "2",
              title: "📚 Consejo de Carrera Personalizado",
              message:
                "Basado en tu perfil UDD, te recomendamos desarrollar habilidades en análisis de datos para destacar en el mercado chileno",
              type: "career_advice",
              priority: "medium",
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              read: false,
              actionUrl: "/career-coach",
            },
            {
              id: "3",
              title: "🚀 Invitación a Entrevista",
              message: "NotCo te ha invitado a una entrevista para el puesto de Trainee de Innovación",
              type: "interview_invite",
              priority: "high",
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              read: false,
              actionUrl: "/interview-simulator",
              metadata: {
                company: "NotCo",
                position: "Trainee de Innovación",
                location: "Santiago, Las Condes",
              },
            },
            {
              id: "4",
              title: "📊 Actualización de Habilidades",
              message: "Has completado tu evaluación de habilidades blandas. ¡Excelente progreso en liderazgo!",
              type: "skill_update",
              priority: "medium",
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
              actionUrl: "/soft-skills-results",
            },
            {
              id: "5",
              title: "🎓 Oportunidad para Estudiantes UDD",
              message: "Banco de Chile busca practicantes de Ingeniería Comercial - Programa exclusivo para UDD",
              type: "job_match",
              priority: "high",
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              read: true,
              actionUrl: "/job-search",
              metadata: {
                company: "Banco de Chile",
                position: "Practicante Ingeniería Comercial",
                salary: "$800.000 - $1.200.000 CLP",
                location: "Santiago, Centro",
                matchScore: 88,
              },
            },
          ]

          setNotifications(demoNotifications)
          setUnreadCount(demoNotifications.filter((n) => !n.read).length)
          localStorage.setItem("udd_notifications", JSON.stringify(demoNotifications))
        }
      } catch (error) {
        console.error("Error loading notifications:", error)
      }
    }

    loadNotifications()

    // Simulate receiving new notifications periodically
    const interval = setInterval(() => {
      const shouldAddNotification = Math.random() < 0.1 // 10% chance every 30 seconds

      if (shouldAddNotification) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: "🔔 Nueva Oportunidad",
          message: `${Math.random() > 0.5 ? "Startup chilena" : "Empresa tradicional"} busca talento UDD`,
          type: "job_match",
          priority: "medium",
          timestamp: new Date().toISOString(),
          read: false,
          actionUrl: "/job-search",
        }

        setNotifications((prev) => {
          const updated = [newNotification, ...prev].slice(0, 20) // Keep only last 20
          localStorage.setItem("udd_notifications", JSON.stringify(updated))
          return updated
        })

        setUnreadCount((prev) => prev + 1)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      localStorage.setItem("udd_notifications", JSON.stringify(updated))
      return updated
    })

    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }))
      localStorage.setItem("udd_notifications", JSON.stringify(updated))
      return updated
    })
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job_match":
        return <Briefcase className="w-4 h-4 text-blue-600" />
      case "career_advice":
        return <GraduationCap className="w-4 h-4 text-green-600" />
      case "skill_update":
        return <TrendingUp className="w-4 h-4 text-purple-600" />
      case "interview_invite":
        return <Users className="w-4 h-4 text-orange-600" />
      default:
        return <Bell className="w-4 h-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace unos minutos"
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5 text-blue-600" />
          ) : (
            <Bell className="h-5 w-5 text-gray-600" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones UDD
          </span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-6 px-2">
              Marcar todas como leídas
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No tienes notificaciones</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-1">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-0 cursor-pointer ${!notification.read ? "bg-blue-50" : ""}`}
                  onClick={() => {
                    markAsRead(notification.id)
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl
                    }
                  }}
                >
                  <div
                    className={`w-full p-3 border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? "font-medium" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">{getNotificationIcon(notification.type)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2" />
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{notification.message}</p>

                        {notification.metadata && (
                          <div className="space-y-1 mb-2">
                            {notification.metadata.company && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Briefcase className="w-3 h-3" />
                                {notification.metadata.company}
                              </div>
                            )}
                            {notification.metadata.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {notification.metadata.location}
                              </div>
                            )}
                            {notification.metadata.salary && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <DollarSign className="w-3 h-3" />
                                {notification.metadata.salary}
                              </div>
                            )}
                            {notification.metadata.matchScore && (
                              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                <TrendingUp className="w-3 h-3" />
                                {notification.metadata.matchScore}% compatibilidad
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(notification.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        )}

        <DropdownMenuSeparator />

        <div className="p-2 space-y-1">
          <DropdownMenuItem onClick={onCreateAlert} className="flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            Crear Alerta de Empleo
          </DropdownMenuItem>

          <DropdownMenuItem onClick={onManageAlerts} className="flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            Gestionar Alertas
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
