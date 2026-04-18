"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Plus, MessageCircle, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WhatsAppService } from "@/lib/whatsapp-service"

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
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [tempPhoneNumber, setTempPhoneNumber] = useState("")
  const [savingPhone, setSavingPhone] = useState(false)

  useEffect(() => {
    if (userEmail) {
      console.log("[v0] ActivityCalendar: Fetching activities for email:", userEmail)
      fetchActivities()
      fetchPhoneNumber()
    } else {
      console.log("[v0] ActivityCalendar: No userEmail provided")
      setLoading(false)
    }
  }, [selectedDate, userEmail])

  const fetchActivities = async () => {
    try {
      setError(null)
      console.log("[v0] Fetching activities for:", userEmail, "date:", selectedDate.toISOString())
      const response = await fetch(`/api/activities?email=${userEmail}&date=${selectedDate.toISOString()}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Activities fetched:", data)
      setActivities(data.activities || [])
    } catch (error) {
      console.error("[v0] Error fetching activities:", error)
      setError(error instanceof Error ? error.message : "Error al cargar actividades")
    } finally {
      setLoading(false)
    }
  }

  const fetchPhoneNumber = async () => {
    try {
      const response = await fetch(`/api/user/phone?email=${userEmail}`)
      if (response.ok) {
        const data = await response.json()
        setPhoneNumber(data.phone_number || "")
        console.log("[v0] Phone number fetched:", data.phone_number)
      }
    } catch (error) {
      console.error("[v0] Error fetching phone number:", error)
    }
  }

  const scheduleReminder = (activity: Activity) => {
    if (!phoneNumber) {
      alert("⚠️ Configura tu número de teléfono primero en Ajustes")
      return
    }

    const whatsappService = WhatsAppService.getInstance()
    whatsappService.sendReminder(activity, phoneNumber)
  }

  const sendDailySummary = () => {
    if (!phoneNumber) {
      alert("⚠️ Configura tu número de teléfono primero en Ajustes")
      return
    }

    const whatsappService = WhatsAppService.getInstance()
    whatsappService.sendDailySummary(phoneNumber, activities)
  }

  const sendMotivation = () => {
    if (!phoneNumber) {
      alert("⚠️ Configura tu número de teléfono primero en Ajustes")
      return
    }

    const whatsappService = WhatsAppService.getInstance()
    whatsappService.sendMotivationalInsight(phoneNumber)
  }

  const savePhoneNumber = async () => {
    if (!tempPhoneNumber.trim()) {
      alert("Por favor ingresa un número de teléfono válido")
      return
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(tempPhoneNumber.replace(/\s/g, ""))) {
      alert("Por favor ingresa un número de teléfono válido con código de país (ej: +56912345678)")
      return
    }

    setSavingPhone(true)
    try {
      const response = await fetch("/api/user/phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          phone_number: tempPhoneNumber.replace(/\s/g, ""),
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar el número de teléfono")
      }

      setPhoneNumber(tempPhoneNumber.replace(/\s/g, ""))
      setShowWhatsAppDialog(false)
      setTempPhoneNumber("")
      alert("✅ Número de WhatsApp configurado correctamente")
    } catch (error) {
      console.error("[v0] Error saving phone number:", error)
      alert("❌ Error al guardar el número de teléfono. Por favor intenta de nuevo.")
    } finally {
      setSavingPhone(false)
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

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-destructive opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Error al cargar calendario</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchActivities()
            }}
          >
            Reintentar
          </Button>
        </div>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Cargando calendario...</p>
        </div>
      </div>
    )
  }

  if (!userEmail) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">Inicia sesión para ver tu calendario</h3>
          <p className="text-sm text-muted-foreground">
            Necesitas estar autenticado para acceder a tu calendario de actividades
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mi Calendario</h2>
          <p className="text-muted-foreground">Organiza tus actividades y recibe recordatorios por WhatsApp</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={sendMotivation} disabled={!phoneNumber}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Motivación
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Actividad
          </Button>
        </div>
      </div>

      {/* WhatsApp Status */}
      <Card className={`p-4 ${phoneNumber ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
        <div className="flex items-center gap-3">
          <MessageCircle className={`w-5 h-5 ${phoneNumber ? "text-green-600" : "text-yellow-600"}`} />
          <div className="flex-1">
            {phoneNumber ? (
              <>
                <p className="font-medium text-green-900">WhatsApp Web Configurado</p>
                <p className="text-sm text-green-700">
                  Número: {phoneNumber} • Haz clic en "Recordar" para enviar mensajes por WhatsApp Web
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-yellow-900">Configura tu Número de WhatsApp</p>
                <p className="text-sm text-yellow-700">
                  Agrega tu número para recibir recordatorios automáticos por WhatsApp Web
                </p>
              </>
            )}
          </div>
          {phoneNumber ? (
            <Button variant="outline" size="sm" onClick={sendDailySummary}>
              <Bell className="w-4 h-4 mr-2" />
              Resumen del Día
            </Button>
          ) : (
            <Button size="sm" onClick={() => setShowWhatsAppDialog(true)} className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          )}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Activities */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-purple" />
            <h3 className="font-semibold">Hoy - {formatDate(selectedDate.toISOString())}</h3>
          </div>

          {todayActivities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No tienes actividades programadas para hoy</p>
              <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={() => setShowAddModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Actividad
              </Button>
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => scheduleReminder(activity)}
                      disabled={!phoneNumber}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Recordar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Activities */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-purple" />
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

      {/* WhatsApp Configuration Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurar Número de WhatsApp</DialogTitle>
            <DialogDescription>
              Ingresa tu número de WhatsApp con código de país para recibir recordatorios automáticos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Número de WhatsApp</Label>
              <Input
                id="phone"
                placeholder="+56912345678"
                value={tempPhoneNumber}
                onChange={(e) => setTempPhoneNumber(e.target.value)}
                type="tel"
              />
              <p className="text-xs text-muted-foreground">
                Incluye el código de país (ej: +56 para Chile, +1 para USA)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWhatsAppDialog(false)} disabled={savingPhone}>
              Cancelar
            </Button>
            <Button onClick={savePhoneNumber} disabled={savingPhone}>
              {savingPhone ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
