"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Plus, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: string
  title: string
  description: string
  event_type: "meeting" | "sport" | "study" | "personal" | "work" // renamed from activity_type to event_type
  start_time: string
  end_time: string
}

const activityTypeColors = {
  meeting: "bg-blue-500",
  sport: "bg-green-500",
  study: "bg-purple-500",
  personal: "bg-pink-500",
  work: "bg-orange-500",
}

const activityTypeLabels = {
  meeting: "Reunión",
  sport: "Deporte",
  study: "Estudio",
  personal: "Personal",
  work: "Trabajo",
}

export function ActivityCalendar({ userEmail }: { userEmail: string }) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchActivities()
  }, [selectedDate])

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activities?email=${userEmail}&date=${selectedDate.toISOString()}`)
      const data = await response.json()
      setActivities(data.activities || [])
    } catch (error) {
      console.error("[v0] Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const todayActivities = activities.filter((activity) => {
    const activityDate = new Date(activity.start_time)
    return activityDate.toDateString() === selectedDate.toDateString()
  })

  const upcomingActivities = activities
    .filter((activity) => {
      const activityDate = new Date(activity.start_time)
      return activityDate > selectedDate && activityDate.toDateString() !== selectedDate.toDateString()
    })
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mi Calendario</h2>
          <p className="text-muted-foreground">Organiza tus actividades y recibe recordatorios inteligentes</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Actividad
        </Button>
      </div>

      {/* WhatsApp Status */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-green-600" />
          <div className="flex-1">
            <p className="font-medium text-green-900">Recordatorios por WhatsApp Activos</p>
            <p className="text-sm text-green-700">Recibirás mensajes motivacionales e insights personalizados</p>
          </div>
          <Button variant="outline" size="sm">
            Configurar
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Activities */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Hoy - {formatDate(selectedDate.toISOString())}</h3>
          </div>

          {todayActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No tienes actividades programadas para hoy</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayActivities.map((activity) => (
                <div key={activity.id} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${activityTypeColors[activity.event_type]}`} />
                        <h4 className="font-medium">{activity.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <Badge variant="outline">{activityTypeLabels[activity.event_type]}</Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Activities */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Próximas Actividades</h3>
          </div>

          {upcomingActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No tienes actividades próximas programadas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingActivities.map((activity) => (
                <div key={activity.id} className="p-3 border rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${activityTypeColors[activity.event_type]}`} />
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(activity.start_time)} - {formatTime(activity.start_time)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(activityTypeLabels).map(([type, label]) => {
          const count = activities.filter((a) => a.event_type === type).length
          return (
            <Card key={type} className="p-4">
              <div
                className={`w-8 h-8 rounded-lg ${activityTypeColors[type as keyof typeof activityTypeColors]} mb-2`}
              />
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
