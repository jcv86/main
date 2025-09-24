"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  AlertCircle,
  ExternalLink,
  MapPin,
  Video,
} from "lucide-react"

interface Application {
  id: string
  applicationId: string
  jobTitle: string
  department: string
  candidateName: string
  candidateEmail: string
  candidatePhone: string
  status: string
  createdAt: string
  updatedAt: string
  statusHistory: Array<{
    status: string
    notes: string
    updated_by: string
    created_at: string
  }>
  interviews: Array<{
    interview_type: string
    scheduled_date: string
    duration_minutes: number
    interviewer_name: string
    interviewer_email: string
    meeting_link: string
    location: string
    status: string
    notes: string
  }>
}

const ApplicationStatusTracker = () => {
  const [applicationId, setApplicationId] = useState("")
  const [email, setEmail] = useState("")
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const statusSteps = [
    { key: "submitted", label: "Enviada", description: "Aplicación recibida" },
    { key: "screening", label: "Revisión Inicial", description: "Revisando tu perfil" },
    { key: "phone_screen", label: "Llamada Inicial", description: "Conversación telefónica" },
    { key: "technical_interview", label: "Entrevista Técnica", description: "Evaluación técnica" },
    { key: "team_interview", label: "Entrevista con Equipo", description: "Conoce al equipo" },
    { key: "final_interview", label: "Entrevista Final", description: "Conversación con liderazgo" },
    { key: "reference_check", label: "Referencias", description: "Verificación de referencias" },
    { key: "offer", label: "Oferta", description: "Oferta de trabajo" },
    { key: "hired", label: "Contratado", description: "¡Bienvenido al equipo!" },
  ]

  const getCurrentStepIndex = (status: string) => {
    const index = statusSteps.findIndex((step) => step.key === status)
    return index >= 0 ? index : 0
  }

  const getProgressPercentage = (status: string) => {
    const currentIndex = getCurrentStepIndex(status)
    return ((currentIndex + 1) / statusSteps.length) * 100
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500"
      case "screening":
      case "phone_screen":
        return "bg-yellow-500"
      case "technical_interview":
      case "team_interview":
      case "final_interview":
        return "bg-orange-500"
      case "reference_check":
        return "bg-purple-500"
      case "offer":
        return "bg-green-500"
      case "hired":
        return "bg-emerald-500"
      case "rejected":
        return "bg-red-500"
      case "withdrawn":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "hired":
      case "offer":
        return "default"
      case "rejected":
      case "withdrawn":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getNextSteps = (status: string) => {
    switch (status) {
      case "submitted":
        return [
          "Nuestro equipo revisará tu aplicación en 2-3 días hábiles",
          "Recibirás un email de confirmación si pasas a la siguiente etapa",
          "Mientras tanto, puedes revisar nuestra página de cultura empresarial",
        ]
      case "screening":
        return [
          "Un miembro de nuestro equipo de Talent te contactará pronto",
          "Prepara una breve presentación sobre tu experiencia",
          "Ten a mano tu CV actualizado",
        ]
      case "phone_screen":
        return [
          "Recibirás una invitación de calendario para la llamada",
          "La conversación durará aproximadamente 30 minutos",
          "Prepara preguntas sobre el rol y la empresa",
        ]
      case "technical_interview":
        return [
          "Recibirás detalles sobre el formato de la entrevista técnica",
          "Repasa los conceptos técnicos relevantes para el rol",
          "Prepara ejemplos de proyectos anteriores",
        ]
      case "team_interview":
        return [
          "Conocerás a miembros del equipo con el que trabajarías",
          "Prepara preguntas sobre la dinámica del equipo",
          "Piensa en ejemplos de colaboración exitosa",
        ]
      case "final_interview":
        return [
          "Conversarás con liderazgo sobre fit cultural",
          "Prepara preguntas sobre la visión de la empresa",
          "Reflexiona sobre tus objetivos profesionales",
        ]
      case "reference_check":
        return [
          "Proporcionaremos contactos de referencias si es necesario",
          "Asegúrate de que tus referencias estén disponibles",
          "Este proceso suele tomar 2-3 días hábiles",
        ]
      case "offer":
        return [
          "¡Felicitaciones! Recibirás una oferta formal pronto",
          "Revisa cuidadosamente todos los términos",
          "No dudes en hacer preguntas sobre la oferta",
        ]
      case "hired":
        return [
          "¡Bienvenido al equipo!",
          "Recibirás información sobre el proceso de onboarding",
          "Nos pondremos en contacto contigo antes de tu primer día",
        ]
      default:
        return ["Mantente atento a tu email para actualizaciones"]
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setApplication(null)

    try {
      const response = await fetch("/api/applications/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationId: applicationId.trim(),
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al buscar la aplicación")
      }

      setApplication(data.application)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Seguimiento de Aplicación</h1>
            <p className="text-xl text-gray-600">
              Ingresa tu ID de aplicación y email para ver el estado de tu postulación
            </p>
          </div>

          {/* Search Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Buscar Mi Aplicación
              </CardTitle>
              <CardDescription>
                Necesitas el ID de aplicación que recibiste al enviar tu postulación y el email que usaste
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="applicationId">ID de Aplicación</Label>
                    <Input
                      id="applicationId"
                      placeholder="APP-123456"
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Buscando..." : "Buscar Aplicación"}
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Application Details */}
          {application && (
            <div className="space-y-8">
              {/* Application Overview */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{application.jobTitle}</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {application.department} • Aplicación {application.applicationId}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(application.status)} className="text-sm px-3 py-1">
                      {statusSteps.find((step) => step.key === application.status)?.label || application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Candidate Info */}
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{application.candidateName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{application.candidateEmail}</span>
                    </div>
                    {application.candidatePhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{application.candidatePhone}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Application Dates */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Fecha de aplicación:</span>
                      <p className="font-medium">{formatDate(application.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Última actualización:</span>
                      <p className="font-medium">{formatDate(application.updatedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Progreso de la Aplicación
                  </CardTitle>
                  <CardDescription>
                    Tu aplicación está en la etapa:{" "}
                    <strong>{statusSteps.find((step) => step.key === application.status)?.label}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progreso</span>
                      <span>{Math.round(getProgressPercentage(application.status))}%</span>
                    </div>
                    <Progress value={getProgressPercentage(application.status)} className="h-2" />
                  </div>

                  {/* Status Steps */}
                  <div className="space-y-4">
                    {statusSteps.map((step, index) => {
                      const currentIndex = getCurrentStepIndex(application.status)
                      const isCompleted = index <= currentIndex
                      const isCurrent = index === currentIndex

                      return (
                        <div key={step.key} className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {isCompleted ? (
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isCurrent ? getStatusColor(application.status) : "bg-green-500"
                                }`}
                              >
                                <CheckCircle className="h-4 w-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />
                            )}
                          </div>
                          <div className={`flex-1 ${isCompleted ? "text-gray-900" : "text-gray-500"}`}>
                            <h4 className={`font-medium ${isCurrent ? "text-blue-600" : ""}`}>{step.label}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Interviews */}
              {application.interviews && application.interviews.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Entrevistas Programadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {application.interviews.map((interview, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-lg">{interview.interview_type}</h4>
                              <p className="text-gray-600">
                                {formatDate(interview.scheduled_date)} • {interview.duration_minutes} minutos
                              </p>
                            </div>
                            <Badge variant={interview.status === "completed" ? "default" : "secondary"}>
                              {interview.status}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            {interview.interviewer_name && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500" />
                                <span>{interview.interviewer_name}</span>
                              </div>
                            )}
                            {interview.interviewer_email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <span>{interview.interviewer_email}</span>
                              </div>
                            )}
                            {interview.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{interview.location}</span>
                              </div>
                            )}
                            {interview.meeting_link && (
                              <div className="flex items-center gap-2">
                                <Video className="h-4 w-4 text-gray-500" />
                                <a
                                  href={interview.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                  Unirse a la reunión
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>

                          {interview.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-700">{interview.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Historial de Estados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(history.status)}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium">
                              {statusSteps.find((step) => step.key === history.status)?.label || history.status}
                            </h4>
                            <span className="text-sm text-gray-500">{formatDate(history.created_at)}</span>
                          </div>
                          {history.notes && <p className="text-sm text-gray-600">{history.notes}</p>}
                          <p className="text-xs text-gray-500 mt-1">Actualizado por: {history.updated_by}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Próximos Pasos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {getNextSteps(application.status).map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    ¿Necesitas Ayuda?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Si tienes preguntas sobre tu aplicación o el proceso, no dudes en contactarnos:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>careers@tuempresa.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>+56 2 1234 5678</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationStatusTracker
