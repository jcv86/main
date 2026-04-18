"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Video,
  MessageSquare,
  ExternalLink,
  RefreshCw,
  Search,
  Info,
} from "lucide-react"

interface ApplicationData {
  id: string
  application_id: string
  job_id: string
  job_title: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  created_at: string
  updated_at: string
  application_status_history: Array<{
    status: string
    notes: string
    changed_by: string
    created_at: string
  }>
  application_interviews: Array<{
    interview_type: string
    scheduled_date: string
    duration_minutes: number
    interviewer_name: string
    interviewer_email: string
    meeting_link: string
    notes: string
    status: string
    created_at: string
  }>
}

const statusSteps = [
  { key: "submitted", label: "Aplicación Enviada", description: "Tu aplicación ha sido recibida" },
  { key: "under_review", label: "En Revisión", description: "Nuestro equipo está revisando tu perfil" },
  { key: "phone_screening", label: "Entrevista Telefónica", description: "Primera entrevista con RRHH" },
  { key: "interview_scheduled", label: "Entrevista Programada", description: "Entrevista técnica programada" },
  { key: "technical_interview", label: "Entrevista Técnica", description: "Evaluación de habilidades técnicas" },
  { key: "final_interview", label: "Entrevista Final", description: "Entrevista con el equipo y manager" },
  { key: "reference_check", label: "Verificación de Referencias", description: "Contactando referencias laborales" },
  { key: "offer_pending", label: "Oferta Pendiente", description: "Preparando oferta de trabajo" },
  { key: "offer_extended", label: "Oferta Extendida", description: "Oferta de trabajo enviada" },
  { key: "hired", label: "Contratado", description: "¡Bienvenido al equipo!" },
  { key: "rejected", label: "No Seleccionado", description: "Gracias por tu interés" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted":
      return "bg-blue/10 text-blue"
    case "under_review":
      return "bg-yellow/10 text-yellow"
    case "phone_screening":
    case "interview_scheduled":
    case "technical_interview":
    case "final_interview":
      return "bg-purple-100 text-purple-800"
    case "reference_check":
    case "offer_pending":
      return "bg-orange/10 text-orange"
    case "offer_extended":
      return "bg-green/10 text-green"
    case "hired":
      return "bg-green-200 text-green-900"
    case "rejected":
      return "bg-red/10 text-red-800"
    default:
      return "bg-muted/10 text-gray-800"
  }
}

const getStatusIcon = (status: string, isActive: boolean, isCompleted: boolean) => {
  if (status === "rejected") {
    return <AlertCircle className="h-5 w-5 text-red" />
  }
  if (isCompleted) {
    return <CheckCircle className="h-5 w-5 text-green" />
  }
  if (isActive) {
    return <Clock className="h-5 w-5 text-blue" />
  }
  return <div className="h-5 w-5 rounded-full border-2 border-muted/30" />
}

const calculateProgress = (currentStatus: string) => {
  const currentIndex = statusSteps.findIndex((step) => step.key === currentStatus)
  if (currentIndex === -1) return 0
  if (currentStatus === "rejected") return 100
  return ((currentIndex + 1) / (statusSteps.length - 1)) * 100
}

const getNextSteps = (status: string) => {
  switch (status) {
    case "submitted":
      return [
        "Nuestro equipo de RRHH revisará tu aplicación en 2-3 días hábiles",
        "Recibirás un email si tu perfil es seleccionado para continuar",
        "Mientras tanto, puedes revisar más información sobre nuestra empresa",
      ]
    case "under_review":
      return [
        "Tu aplicación está siendo evaluada por nuestro equipo",
        "Te contactaremos pronto para programar una entrevista telefónica",
        "Asegúrate de que tu teléfono esté disponible",
      ]
    case "phone_screening":
      return [
        "Prepárate para una conversación de 30 minutos sobre tu experiencia",
        "Ten tu CV a mano para referenciar tu experiencia",
        "Prepara preguntas sobre la empresa y el rol",
      ]
    case "interview_scheduled":
      return [
        "Revisa los detalles de tu entrevista programada",
        "Prepara ejemplos específicos de tu experiencia técnica",
        "Confirma tu asistencia respondiendo al email de invitación",
      ]
    case "technical_interview":
      return [
        "Demuestra tus habilidades técnicas con ejemplos prácticos",
        "Prepárate para resolver problemas en tiempo real",
        "Haz preguntas técnicas sobre el stack y arquitectura",
      ]
    case "final_interview":
      return [
        "Conoce al equipo con el que trabajarías directamente",
        "Discute expectativas y objetivos del rol",
        "Pregunta sobre cultura de equipo y oportunidades de crecimiento",
      ]
    case "reference_check":
      return [
        "Asegúrate de que tus referencias estén disponibles",
        "Informa a tus referencias que pueden ser contactadas",
        "Este proceso usualmente toma 2-3 días hábiles",
      ]
    case "offer_pending":
      return [
        "Estamos preparando tu oferta de trabajo",
        "Recibirás los detalles por email en los próximos días",
        "Prepárate para revisar términos y condiciones",
      ]
    case "offer_extended":
      return [
        "Revisa cuidadosamente todos los términos de la oferta",
        "No dudes en hacer preguntas sobre beneficios o condiciones",
        "Responde dentro del plazo indicado en la oferta",
      ]
    case "hired":
      return [
        "¡Felicitaciones! Bienvenido al equipo",
        "Recibirás información sobre tu primer día de trabajo",
        "Nuestro equipo de onboarding te contactará pronto",
      ]
    case "rejected":
      return [
        "Gracias por tu interés en nuestra empresa",
        "Aunque no fuiste seleccionado esta vez, valoramos tu tiempo",
        "Te animamos a aplicar a futuras posiciones que se ajusten a tu perfil",
      ]
    default:
      return ["Mantente atento a tu email para próximas actualizaciones"]
  }
}

export default function ApplicationStatusTracker() {
  const [email, setEmail] = useState("")
  const [applicationId, setApplicationId] = useState("")
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrackApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !applicationId) {
      setError("Por favor ingresa tu email y ID de aplicación")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/applications/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, applicationId }),
      })

      const data = await response.json()

      if (response.ok) {
        setApplicationData(data.application)
      } else {
        setError(data.error || "Error al buscar la aplicación")
      }
    } catch (error) {
      setError("Error de conexión. Por favor intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (applicationData) {
      handleTrackApplication(new Event("submit") as any)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const currentStatusIndex = statusSteps.findIndex((step) => step.key === applicationData?.status)
  const progress = applicationData ? calculateProgress(applicationData.status) : 0

  if (!applicationData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Seguir mi Aplicación
            </CardTitle>
            <p className="text-muted/60">
              Ingresa tu email y el ID de aplicación que recibiste para ver el estado de tu postulación.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackApplication} className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu.email@ejemplo.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="applicationId">ID de Aplicación *</Label>
                <Input
                  id="applicationId"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  placeholder="APP-2024-123456"
                  required
                />
                <p className="text-sm text-muted/50 mt-1">
                  Encontrarás este ID en el email de confirmación que recibiste
                </p>
              </div>

              {error && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar Aplicación
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Application Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Estado de tu Aplicación</CardTitle>
              <p className="text-muted/60">
                {applicationData.first_name} {applicationData.last_name} • {applicationData.job_title}
              </p>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(applicationData.status)}>
                {statusSteps.find((step) => step.key === applicationData.status)?.label || applicationData.status}
              </Badge>
              <p className="text-sm text-muted/50 mt-1">ID: {applicationData.application_id}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-muted/60 mb-2">
                <span>Progreso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted/50" />
                <span>Aplicado: {formatDate(applicationData.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted/50" />
                <span>Actualizado: {formatDate(applicationData.updated_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted/50" />
                <span>{applicationData.job_title}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Status Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Proceso de Selección</CardTitle>
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statusSteps
                  .filter((step) => step.key !== "rejected" || applicationData.status === "rejected")
                  .map((step, index) => {
                    const isCompleted = currentStatusIndex > index || applicationData.status === "hired"
                    const isActive = currentStatusIndex === index
                    const isRejected = applicationData.status === "rejected" && step.key === "rejected"

                    return (
                      <div
                        key={step.key}
                        className={`flex items-start gap-4 pb-4 ${
                          index < statusSteps.length - 1 ? "border-b border-muted/10" : ""
                        }`}
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(step.key, isActive, isCompleted || isRejected)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-medium ${
                                isActive
                                  ? "text-blue"
                                  : isCompleted || isRejected
                                    ? "text-green"
                                    : "text-muted/60"
                              }`}
                            >
                              {step.label}
                            </h3>
                            {isActive && (
                              <Badge variant="outline" className="text-xs">
                                Actual
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted/60">{step.description}</p>

                          {/* Show timestamp for completed steps */}
                          {applicationData.application_status_history
                            .filter((history) => history.status === step.key)
                            .map((history, historyIndex) => (
                              <p key={historyIndex} className="text-xs text-muted/50 mt-1">
                                {formatDate(history.created_at)}
                                {history.notes && history.notes !== `Status changed automatically` && (
                                  <span className="ml-2">• {history.notes}</span>
                                )}
                              </p>
                            ))}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5" />
                Próximos Pasos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {getNextSteps(applicationData.status).map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Scheduled Interviews */}
          {applicationData.application_interviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Entrevistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationData.application_interviews.map((interview, index) => (
                    <div key={index} className="p-3 bg-muted/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm capitalize">{interview.interview_type.replace("_", " ")}</h4>
                        <Badge variant="outline" className="text-xs">
                          {interview.status}
                        </Badge>
                      </div>

                      {interview.scheduled_date && (
                        <div className="space-y-1 text-sm text-muted/60">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(interview.scheduled_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{interview.duration_minutes} minutos</span>
                          </div>
                          {interview.interviewer_name && (
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span>{interview.interviewer_name}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {interview.meeting_link && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 bg-transparent"
                          onClick={() => window.open(interview.meeting_link, "_blank")}
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Unirse a la Reunión
                        </Button>
                      )}

                      {interview.notes && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <MessageSquare className="h-3 w-3 inline mr-1" />
                          {interview.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted/50" />
                <span>rrhh@empresa.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted/50" />
                <span>+56 2 2345 6789</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted/50" />
                <span>Santiago, Chile</span>
              </div>
              <Separator className="my-3" />
              <p className="text-xs text-muted/60">
                Si tienes preguntas sobre tu aplicación, no dudes en contactarnos. Nuestro horario de atención es de
                lunes a viernes de 9:00 a 18:00.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
