"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, Clock, Search, Plus, Download, Filter, Shield, AlertCircle } from "lucide-react"

interface LicenseSummary {
  content_type: string
  total_items: number
  verified_count: number
  pending_count: number
  needs_docs_count: number
  at_risk_count: number
  non_compliant_count: number
  compliance_percentage: number
  overdue_reviews: number
  unknown_licenses: number
}

interface UnlicensedContent {
  content_type: string
  content_id: string
  content_title: string
  author: string
  published_year: number
}

interface ComplianceAlert {
  id: string
  license_id: string
  alert_type: string
  severity: string
  alert_message: string
  status: string
  created_at: string
}

interface ContentLicense {
  id: string
  content_type: string
  content_title: string
  license_type: string
  compliance_status: string
  copyright_holder: string
  verified_at: string
  next_review_date: string
}

export default function ContentLicensesPage() {
  const [summary, setSummary] = useState<LicenseSummary[]>([])
  const [unlicensed, setUnlicensed] = useState<UnlicensedContent[]>([])
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([])
  const [licenses, setLicenses] = useState<ContentLicense[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [summaryRes, unlicensedRes, alertsRes, licensesRes] = await Promise.all([
        fetch("/api/licenses/summary"),
        fetch("/api/licenses/unlicensed"),
        fetch("/api/licenses/alerts"),
        fetch("/api/licenses/list"),
      ])

      if (summaryRes.ok) setSummary(await summaryRes.json())
      if (unlicensedRes.ok) setUnlicensed(await unlicensedRes.json())
      if (alertsRes.ok) setAlerts(await alertsRes.json())
      if (licensesRes.ok) setLicenses(await licensesRes.json())
    } catch (error) {
      console.error("Error fetching license data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500"
      case "pending_review":
        return "bg-yellow-500"
      case "needs_documentation":
        return "bg-orange-500"
      case "at_risk":
        return "bg-red-500"
      case "non_compliant":
        return "bg-red-700"
      default:
        return "bg-gray-500"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  const totalCompliance =
    summary.length > 0 ? Math.round(summary.reduce((acc, s) => acc + s.compliance_percentage, 0) / summary.length) : 0

  const totalUnlicensed = unlicensed.length
  const criticalAlerts = alerts.filter((a) => a.severity === "critical" && a.status === "active").length

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando información de licencias...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Licencias de Contenido</h1>
          <p className="text-muted-foreground mt-2">Sistema de documentación y compliance legal para libros y tests</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => (window.location.href = "/admin/content-licenses/add")}>
            <Plus className="h-4 w-4 mr-2" />
            Agregar Licencia
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Resumen General */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance General</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompliance}%</div>
            <p className="text-xs text-muted-foreground">
              {summary.reduce((acc, s) => acc + s.verified_count, 0)} de{" "}
              {summary.reduce((acc, s) => acc + s.total_items, 0)} verificados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sin Licencia</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalUnlicensed}</div>
            <p className="text-xs text-muted-foreground">Contenido sin documentar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
            <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revisiones Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {summary.reduce((acc, s) => acc + s.overdue_reviews, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Revisiones vencidas</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Contenido */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="unlicensed">Sin Licencia ({totalUnlicensed})</TabsTrigger>
          <TabsTrigger value="alerts">Alertas ({alerts.filter((a) => a.status === "active").length})</TabsTrigger>
          <TabsTrigger value="all">Todas las Licencias</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estado de Compliance por Tipo de Contenido</CardTitle>
              <CardDescription>Resumen del estado de licencias y documentación</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.map((item) => (
                  <div key={item.content_type} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold capitalize">{item.content_type}s</h3>
                        <p className="text-sm text-muted-foreground">{item.total_items} items totales</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{item.compliance_percentage}%</div>
                        <p className="text-xs text-muted-foreground">Compliance</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-center text-sm">
                      <div>
                        <div className="font-semibold text-green-600">{item.verified_count}</div>
                        <div className="text-xs text-muted-foreground">Verificados</div>
                      </div>
                      <div>
                        <div className="font-semibold text-yellow-600">{item.pending_count}</div>
                        <div className="text-xs text-muted-foreground">Pendientes</div>
                      </div>
                      <div>
                        <div className="font-semibold text-orange-600">{item.needs_docs_count}</div>
                        <div className="text-xs text-muted-foreground">Sin Docs</div>
                      </div>
                      <div>
                        <div className="font-semibold text-red-600">{item.at_risk_count}</div>
                        <div className="text-xs text-muted-foreground">En Riesgo</div>
                      </div>
                      <div>
                        <div className="font-semibold text-red-700">{item.non_compliant_count}</div>
                        <div className="text-xs text-muted-foreground">No Compliant</div>
                      </div>
                    </div>

                    {(item.overdue_reviews > 0 || item.unknown_licenses > 0) && (
                      <div className="mt-3 pt-3 border-t flex gap-4 text-sm">
                        {item.overdue_reviews > 0 && (
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Clock className="h-4 w-4" />
                            {item.overdue_reviews} revisiones vencidas
                          </div>
                        )}
                        {item.unknown_licenses > 0 && (
                          <div className="flex items-center gap-1 text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            {item.unknown_licenses} licencias desconocidas
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unlicensed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contenido Sin Licencia Documentada</CardTitle>
              <CardDescription>Estos items requieren documentación de licencia urgente</CardDescription>
            </CardHeader>
            <CardContent>
              {unlicensed.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>Todo el contenido tiene licencia documentada</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {unlicensed.map((item) => (
                    <div
                      key={item.content_id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.content_title}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.author} • {item.published_year} • {item.content_type}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/admin/content-licenses/add?id=${item.content_id}&type=${item.content_type}`)
                        }
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Agregar Licencia
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Compliance</CardTitle>
              <CardDescription>Problemas y acciones requeridas</CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.filter((a) => a.status === "active").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No hay alertas activas</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {alerts
                    .filter((a) => a.status === "active")
                    .sort((a, b) => {
                      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
                      return (
                        severityOrder[a.severity as keyof typeof severityOrder] -
                        severityOrder[b.severity as keyof typeof severityOrder]
                      )
                    })
                    .map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <AlertCircle className={`h-5 w-5 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                              {alert.severity}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{alert.alert_type}</span>
                          </div>
                          <p className="text-sm">{alert.alert_message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(alert.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            Reconocer
                          </Button>
                          <Button size="sm">Resolver</Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Todas las Licencias</CardTitle>
                  <CardDescription>Gestión completa de licencias de contenido</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {licenses
                  .filter(
                    (l) =>
                      searchTerm === "" ||
                      l.content_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      l.copyright_holder?.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((license) => (
                    <div
                      key={license.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(license.compliance_status)}`} />
                          <span className="font-medium">{license.content_title}</span>
                          <Badge variant="outline" className="text-xs">
                            {license.license_type}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {license.copyright_holder} • {license.content_type}
                          {license.next_review_date && (
                            <> • Próxima revisión: {new Date(license.next_review_date).toLocaleDateString()}</>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => (window.location.href = `/admin/content-licenses/${license.id}`)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
