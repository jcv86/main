"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Trash2, Download, Edit, Shield } from "lucide-react"

interface DSARRequest {
  id: string
  user_id: string
  request_type: string
  status: string
  created_at: string
  verified_at: string
  completed_at: string
  profiles: {
    email: string
    full_name: string
  }
}

export default function DSARManagementPage() {
  const [requests, setRequests] = useState<DSARRequest[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/dsar/admin/list")
      const data = await response.json()
      setRequests(data.requests || [])
      setSummary(data.summary || {})
    } catch (error) {
      console.error("Error fetching DSAR requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "access":
        return <FileText className="h-4 w-4" />
      case "deletion":
        return <Trash2 className="h-4 w-4" />
      case "portability":
        return <Download className="h-4 w-4" />
      case "rectification":
        return <Edit className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      access: "Acceso a Datos",
      deletion: "Eliminación",
      portability: "Portabilidad",
      rectification: "Rectificación",
    }
    return labels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: "secondary",
      verified: "default",
      processing: "default",
      completed: "default",
      rejected: "destructive",
    }
    return <Badge variant={variants[status] || "secondary"}>{status.toUpperCase()}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando solicitudes DSAR...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestión DSAR</h1>
        <p className="text-muted-foreground">Data Subject Access Requests - Cumplimiento GDPR</p>
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">Todas las solicitudes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{summary.pending}</div>
              <p className="text-xs text-muted-foreground">Requieren verificación</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
              <Download className="h-4 w-4 text-blue/50" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue/50">{summary.processing}</div>
              <p className="text-xs text-muted-foreground">Siendo procesadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <Shield className="h-4 w-4 text-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green">{summary.completed}</div>
              <p className="text-xs text-muted-foreground">Finalizadas</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todas ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pendientes ({summary?.pending || 0})</TabsTrigger>
          <TabsTrigger value="processing">En Proceso ({summary?.processing || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {requests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay solicitudes DSAR</h3>
                <p className="text-sm text-muted-foreground">Las solicitudes aparecerán aquí</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">{getTypeIcon(request.request_type)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{getTypeLabel(request.request_type)}</h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.profiles?.email || "Usuario desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Creada: {new Date(request.created_at).toLocaleString("es-ES")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          <div className="space-y-3">
            {requests
              .filter((r) => r.status === "pending")
              .map((request) => (
                <Card key={request.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">{getTypeIcon(request.request_type)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{getTypeLabel(request.request_type)}</h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.profiles?.email || "Usuario desconocido"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="processing">
          <div className="space-y-3">
            {requests
              .filter((r) => r.status === "processing")
              .map((request) => (
                <Card key={request.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">{getTypeIcon(request.request_type)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{getTypeLabel(request.request_type)}</h4>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.profiles?.email || "Usuario desconocido"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
