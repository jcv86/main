"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  CheckCircle,
  Clock,
  Phone,
  Code,
  Users,
  FileCheck,
  Gift,
  ThumbsUp,
  Star,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react"

interface ApplicationData {
  id: string
  application_id: string
  job_title: string
  department: string
  candidate_name: string
  candidate_email: string
  status: string
  created_at: string
  updated_at: string
  status_history: Array<{
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
    meeting_link: string
    location: string
    status: string
  }>
  progressPercentage: number
  nextSteps: string[]
  statusSteps: string[]
}

const ApplicationStatusTracker: React.FC = () => {
  const [email, setEmail] = useState("")
  const [applicationId, setApplicationId] = useState("")
  const [application, setApplication] = useState<ApplicationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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
          email: email.trim(),
          applicationId: applicationId.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch application")
      }

      setApplication(data.application)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "under_review":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "phone_screening":
        return <Phone className="h-5 w-5 text-purple-500" />
      case "technical_interview":
        return <Code className="h-5 w-5 text-orange-500" />
      case "final_interview":
        return <Users className="h-5 w-5 text-indigo-500" />
      case "reference_check":
        return <FileCheck className="h-5 w-5 text-teal-500" />
      case "offer_extended":
        return <Gift className="h-5 w-5 text-pink-500" />
      case "offer_accepted":
        return <ThumbsUp className="h-5 w-5 text-green-600" />
      case "hired":
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      submitted: "Enviada",
      under_review: "En Revisión",
      phone_screening: "Entrevista Telefónica",
      technical_interview: "Entrevista Técnica",
      final_interview: "Entrevista Final",
      reference_check: "Verificación de Referencias",
      offer_extended: "Oferta Extendida",
      offer_accepted: "Oferta Aceptada",
      hired: "Contratado",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "phone_screening":
        return "bg-purple-100 text-purple-800"
      case "technical_interview":
        return "bg-orange-100 text-orange-800"
      case "final_interview":
        return "bg-indigo-100 text-indigo-800"
      case "reference_check":
        return "bg-teal-100 text-teal-800"
      case "offer_extended":
        return "bg-pink-100 text-pink-800"
      case "offer_accepted":
        return "bg-green-100 text-green-800"
      case "hired":
        return "bg-green-200 text-green-900"
      default:
        return "bg-gray-100 text-gray-800"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Seguimiento de Aplicación</h1>
          <p className="text-xl text-gray-600">
            Ingresa tu email y ID de aplicación para ver el estado de tu postulación
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Buscar Aplicación
            </CardTitle>
            <CardDescription>
              Usa el email con el que aplicaste y el ID de aplicación que recibiste por email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="applicationId">ID de Aplicación</Label>
                  <Input
                    id="applicationId"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    placeholder="APP-123456"
                    required
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Buscando..." : "Buscar Aplicación"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {application && (
          <div className="space-y-6">
            {/* Application Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{application.job_title}</CardTitle>
                    <CardDescription className="text-lg">
                      {application.department} • ID: {application.application_id}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(application.status)}>{getStatusLabel(application.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progreso de la Aplicación</span>
                      <span className="text-sm text-gray-600">{application.progressPercentage}%</span>
                    </div>
                    <Progress value={application.progressPercentage} className="h-3" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Aplicación enviada:</span>
                      <p className="text-gray-600">{formatDate(application.created_at)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Última actualización:</span>
                      <p className="text-gray-600">{formatDate(application.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Proceso de Selección</CardTitle>
                <CardDescription>
                  Sigue el progreso de tu aplicación a través de nuestro proceso de selección
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.statusSteps.map((step, index) => {
                    const isCompleted = application.statusSteps.indexOf(application.status) >= index
                    const isCurrent = application.status === step

                    return (
                      <div key={step} className="flex items-center space-x-3">
                        <div
                          className={`flex-shrink-0 ${
                            isCompleted ? (isCurrent ? "text-blue-600" : "text-green-600") : "text-gray-400"
                          }`}
                        >
                          {getStatusIcon(step)}
                        </div>
                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              isCompleted ? (isCurrent ? "text-blue-900" : "text-green-900") : "text-gray-500"
                            }`}
                          >
                            {getStatusLabel(step)}
                          </p>
                        </div>
                        {isCurrent && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Actual
                          </Badge>
                        )}
                        {isCompleted && !isCurrent && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Pasos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {application.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Interviews */}
            {application.interviews && application.interviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Entrevistas Programadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {application.interviews.map((interview, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{interview.interview_type}</h4>
                          <Badge variant="outline">
                            {interview.status === "scheduled" ? "Programada" : interview.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDate(interview.scheduled_date)}
                          </div>
                          {interview.interviewer_name && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {interview.interviewer_name}
                            </div>
                          )}
                          {interview.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {interview.location}
                            </div>
                          )}
                          {interview.meeting_link && (
                            <div className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              <a
                                href={interview.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Unirse a la reunión
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Status History */}
            <Card>
              <CardHeader>
                <CardTitle>Historial de Estados</CardTitle>
                <CardDescription>Cronología completa de tu aplicación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {application.status_history.map((history, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getStatusIcon(history.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{getStatusLabel(history.status)}</p>
                          <p className="text-sm text-gray-500">{formatDate(history.created_at)}</p>
                        </div>
                        {history.notes && <p className="text-sm text-gray-600 mt-1">{history.notes}</p>}
                        <p className="text-xs text-gray-400 mt-1">Actualizado por: {history.updated_by}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>¿Necesitas Ayuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Si tienes preguntas sobre tu aplicación o el proceso de selección, no dudes en contactarnos:
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> reclutamiento@empresa.com
                  </p>
                  <p>
                    <strong>Teléfono:</strong> +56 2 2345 6789
                  </p>
                  <p>
                    <strong>Horario:</strong> Lunes a Viernes, 9:00 - 18:00 (Chile)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApplicationStatusTracker
