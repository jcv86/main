"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Settings, TrendingUp } from "lucide-react"

interface Threshold {
  id: string
  metric_name: string
  metric_category: string
  warning_threshold: number
  critical_threshold: number
  comparison_operator: string
  unit: string
  description: string
  is_active: boolean
}

interface Alert {
  id: string
  metric_name: string
  current_value: number
  threshold_value: number
  severity: string
  message: string
  acknowledged: boolean
  created_at: string
}

export default function SeverityThresholdsPage() {
  const [thresholds, setThresholds] = useState<Threshold[]>([])
  const [grouped, setGrouped] = useState<Record<string, Threshold[]>>({})
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<any>({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [thresholdsRes, alertsRes] = await Promise.all([
        fetch("/api/severity-thresholds/list"),
        fetch("/api/severity-thresholds/alerts"),
      ])

      const thresholdsData = await thresholdsRes.json()
      const alertsData = await alertsRes.json()

      setThresholds(thresholdsData.thresholds || [])
      setGrouped(thresholdsData.grouped || {})
      setAlerts(alertsData.activeAlerts || [])
      setSummary(alertsData.summary || {})
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (threshold: Threshold) => {
    setEditingId(threshold.id)
    setEditValues({
      warning_threshold: threshold.warning_threshold,
      critical_threshold: threshold.critical_threshold,
      is_active: threshold.is_active,
    })
  }

  const handleSave = async (id: string) => {
    try {
      await fetch("/api/severity-thresholds/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editValues }),
      })
      setEditingId(null)
      fetchData()
    } catch (error) {
      console.error("Error updating threshold:", error)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "performance":
        return <TrendingUp className="h-4 w-4" />
      case "system":
        return <Settings className="h-4 w-4" />
      case "engagement":
        return <TrendingUp className="h-4 w-4" />
      case "quality":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue/50/10 text-blue/50"
      case "system":
        return "bg-purple/50/10 text-purple/50"
      case "engagement":
        return "bg-green/50/10 text-green"
      case "quality":
        return "bg-orange/50/10 text-orange"
      default:
        return "bg-muted/50/10 text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando umbrales...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Umbrales de Severidad</h1>
        <p className="text-muted-foreground">
          Configura umbrales de advertencia y críticos para métricas clave del sistema
        </p>
      </div>

      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.active}</div>
              <p className="text-xs text-muted-foreground">Sin reconocer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Críticas</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[rgb(80,160,170)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[rgb(80,160,170)]">{summary.critical}</div>
              <p className="text-xs text-muted-foreground">Requieren atención inmediata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Advertencias</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange">{summary.warning}</div>
              <p className="text-xs text-muted-foreground">Monitorear de cerca</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total (7 días)</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">{summary.acknowledged} reconocidas</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="thresholds" className="space-y-4">
        <TabsList>
          <TabsTrigger value="thresholds">Configuración de Umbrales</TabsTrigger>
          <TabsTrigger value="alerts">Alertas Activas ({alerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="thresholds" className="space-y-4">
          {Object.entries(grouped).map(([category, categoryThresholds]) => (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${getCategoryColor(category)}`}>{getCategoryIcon(category)}</div>
                  <div>
                    <CardTitle className="capitalize">{category}</CardTitle>
                    <CardDescription>{categoryThresholds.length} métricas configuradas</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryThresholds.map((threshold) => (
                    <div
                      key={threshold.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{threshold.metric_name.replace(/_/g, " ")}</h4>
                          <Badge variant={threshold.is_active ? "default" : "secondary"}>
                            {threshold.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{threshold.description}</p>
                      </div>

                      {editingId === threshold.id ? (
                        <div className="flex items-center gap-4">
                          <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Advertencia</label>
                            <Input
                              type="number"
                              value={editValues.warning_threshold}
                              onChange={(e) =>
                                setEditValues({ ...editValues, warning_threshold: Number.parseFloat(e.target.value) })
                              }
                              className="w-24"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Crítico</label>
                            <Input
                              type="number"
                              value={editValues.critical_threshold}
                              onChange={(e) =>
                                setEditValues({ ...editValues, critical_threshold: Number.parseFloat(e.target.value) })
                              }
                              className="w-24"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Activo</label>
                            <input
                              type="checkbox"
                              checked={editValues.is_active}
                              onChange={(e) => setEditValues({ ...editValues, is_active: e.target.checked })}
                              className="h-4 w-4 rounded border-muted/30 text-purple focus:ring-purple"
                            />
                          </div>
                          <Button onClick={() => handleSave(threshold.id)} size="sm">
                            Guardar
                          </Button>
                          <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm">
                              <span className="text-orange font-medium">
                                {threshold.warning_threshold}
                                {threshold.unit}
                              </span>
                              {" / "}
                              <span className="text-[rgb(80,160,170)] font-medium">
                                {threshold.critical_threshold}
                                {threshold.unit}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {threshold.comparison_operator === "greater_than" ? ">" : "<"} umbral
                            </div>
                          </div>
                          <Button onClick={() => handleEdit(threshold)} variant="outline" size="sm">
                            Editar
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay alertas activas</h3>
                <p className="text-sm text-muted-foreground">Todas las métricas están dentro de los umbrales</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className={alert.severity === "critical" ? "border-[rgb(80,160,170)]/50" : "border-orange"}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <AlertTriangle
                        className={`h-5 w-5 ${alert.severity === "critical" ? "text-[rgb(80,160,170)]" : "text-orange"}`}
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{alert.metric_name.replace(/_/g, " ")}</h4>
                          <Badge variant={alert.severity === "critical" ? "destructive" : "default"}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.created_at).toLocaleString("es-ES")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
