"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react"

interface MetricHealth {
  metric_name: string
  metric_category: string
  description: string
  current_value: number
  warning_threshold: number
  critical_threshold: number
  threshold_type: string
  current_status: string
  last_measured_at: string
  last_alert_at: string | null
  active_warnings: number
  active_criticals: number
  is_active: boolean
}

interface MetricAlert {
  id: string
  metric_name: string
  severity: string
  alert_message: string
  current_value: number
  threshold_value: number
  status: string
  triggered_at: string
  acknowledged_at: string | null
  acknowledged_by: string | null
  resolved_at: string | null
  resolved_by: string | null
  resolution_notes: string | null
}

export default function MetricsMonitoringPage() {
  const [metrics, setMetrics] = useState<MetricHealth[]>([])
  const [alerts, setAlerts] = useState<MetricAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [metricsRes, alertsRes] = await Promise.all([fetch("/api/metrics/health"), fetch("/api/metrics/alerts")])

      if (!metricsRes.ok || !alertsRes.ok) {
        throw new Error("Failed to fetch metrics data")
      }

      const metricsData = await metricsRes.json()
      const alertsData = await alertsRes.json()

      setMetrics(metricsData)
      setAlerts(alertsData)
    } catch (err) {
      console.error("[v0] Error fetching metrics data:", err)
      setError(err instanceof Error ? err.message : "Failed to load metrics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "critical":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: "bg-red-100 text-red-800",
      warning: "bg-yellow-100 text-yellow-800",
      info: "bg-blue-100 text-blue-800",
    }
    return colors[severity as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/metrics/alerts/${alertId}/acknowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acknowledgedBy: "admin" }),
      })

      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      console.error("[v0] Error acknowledging alert:", err)
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      const res = await fetch(`/api/metrics/alerts/${alertId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resolvedBy: "admin",
          resolutionNotes: "Resolved from dashboard",
        }),
      })

      if (res.ok) {
        fetchData()
      }
    } catch (err) {
      console.error("[v0] Error resolving alert:", err)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando métricas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchData} className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  const activeAlerts = alerts.filter((a) => a.status === "active")
  const criticalMetrics = metrics.filter((m) => m.current_status === "critical")
  const warningMetrics = metrics.filter((m) => m.current_status === "warning")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoreo de Métricas</h1>
          <p className="text-muted-foreground">Sistema de umbrales de severidad y alertas automáticas</p>
        </div>
        <Button onClick={fetchData} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Métricas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.length}</div>
            <p className="text-xs text-muted-foreground">{metrics.filter((m) => m.is_active).length} activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado Crítico</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalMetrics.length}</div>
            <p className="text-xs text-muted-foreground">Métricas críticas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertencias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warningMetrics.length}</div>
            <p className="text-xs text-muted-foreground">Requieren revisión</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alertas Activas</CardTitle>
            <CardDescription>Alertas que requieren atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getSeverityBadge(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                      <span className="font-medium">{alert.metric_name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.alert_message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Valor: {alert.current_value}</span>
                      <span>Umbral: {alert.threshold_value}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.triggered_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!alert.acknowledged_at && (
                      <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                        Reconocer
                      </Button>
                    )}
                    <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                      Resolver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Health Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Salud de Métricas</CardTitle>
          <CardDescription>Monitoreo en tiempo real de todas las métricas del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.metric_name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  {getStatusIcon(metric.current_status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{metric.metric_name}</span>
                      <Badge variant="outline">{metric.metric_category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getStatusColor(metric.current_status)}`}>
                    {metric.current_value?.toFixed(2) || "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Umbral: {metric.warning_threshold} / {metric.critical_threshold}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
