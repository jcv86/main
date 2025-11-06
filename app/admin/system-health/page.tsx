"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, AlertTriangle, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

interface CronJobHealth {
  job_name: string
  health_status: string
  last_execution_at: string | null
  last_success_at: string | null
  last_failure_at: string | null
  consecutive_failures: number
  executions_last_7_days: number
  failures_last_7_days: number
}

interface MetricHealth {
  metric_name: string
  current_status: string
  current_value: number
  active_warnings: number
  active_criticals: number
}

interface SystemHealth {
  overall_status: "healthy" | "warning" | "critical" | "unknown"
  cron_jobs: CronJobHealth[]
  metrics: MetricHealth[]
  active_alerts: number
  critical_issues: number
}

export default function SystemHealthDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHealth = async () => {
    try {
      setLoading(true)
      setError(null)

      const [cronRes, metricsRes, alertsRes] = await Promise.all([
        fetch("/api/cron/health"),
        fetch("/api/metrics/health"),
        fetch("/api/metrics/alerts"),
      ])

      if (!cronRes.ok || !metricsRes.ok || !alertsRes.ok) {
        throw new Error("Failed to fetch system health data")
      }

      const cronData = await cronRes.json()
      const metricsData = await metricsRes.json()
      const alertsData = await alertsRes.json()

      const activeAlerts = alertsData.filter((a: any) => a.status === "active")
      const criticalIssues =
        cronData.filter((j: CronJobHealth) => j.health_status === "critical").length +
        metricsData.filter((m: MetricHealth) => m.current_status === "critical").length

      let overallStatus: "healthy" | "warning" | "critical" | "unknown" = "healthy"
      if (criticalIssues > 0) {
        overallStatus = "critical"
      } else if (activeAlerts.length > 0) {
        overallStatus = "warning"
      }

      setHealth({
        overall_status: overallStatus,
        cron_jobs: cronData,
        metrics: metricsData,
        active_alerts: activeAlerts.length,
        critical_issues: criticalIssues,
      })
    } catch (err) {
      console.error("[v0] Error fetching system health:", err)
      setError(err instanceof Error ? err.message : "Failed to load system health")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 60000) // Refresh every minute
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
        return <CheckCircle2 className="h-8 w-8 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-8 w-8 text-yellow-600" />
      case "critical":
        return <XCircle className="h-8 w-8 text-red-600" />
      default:
        return <Activity className="h-8 w-8 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      healthy: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800",
      unknown: "bg-gray-100 text-gray-800",
    }
    return colors[status as keyof typeof colors] || colors.unknown
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando estado del sistema...</p>
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
        <Button onClick={fetchHealth} className="mt-4">
          Reintentar
        </Button>
      </div>
    )
  }

  if (!health) {
    return null
  }

  const healthyCronJobs = health.cron_jobs.filter((j) => j.health_status === "healthy").length
  const healthyMetrics = health.metrics.filter((m) => m.current_status === "healthy").length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Salud del Sistema</h1>
          <p className="text-muted-foreground">Vista centralizada del estado de la plataforma DTC</p>
        </div>
        <Button onClick={fetchHealth} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Overall Status */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getStatusIcon(health.overall_status)}
              <div>
                <h2 className="text-2xl font-bold">Estado General del Sistema</h2>
                <p className="text-muted-foreground">Última actualización: {new Date().toLocaleString()}</p>
              </div>
            </div>
            <Badge className={`text-lg px-4 py-2 ${getStatusBadge(health.overall_status)}`}>
              {health.overall_status.toUpperCase()}
            </Badge>
          </div>

          {health.critical_issues > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{health.critical_issues}</strong> problema(s) crítico(s) requieren atención inmediata
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cron Jobs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthyCronJobs}/{health.cron_jobs.length}
            </div>
            <p className="text-xs text-muted-foreground">Saludables</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Métricas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {healthyMetrics}/{health.metrics.length}
            </div>
            <p className="text-xs text-muted-foreground">Normales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{health.active_alerts}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problemas Críticos</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{health.critical_issues}</div>
            <p className="text-xs text-muted-foreground">Acción inmediata</p>
          </CardContent>
        </Card>
      </div>

      {/* Cron Jobs Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Estado de Cron Jobs</CardTitle>
              <CardDescription>Tareas programadas y su salud</CardDescription>
            </div>
            <Link href="/admin/cron-monitoring">
              <Button variant="outline" size="sm">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {health.cron_jobs.map((job) => (
              <div key={job.job_name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {job.health_status === "healthy" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : job.health_status === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium">{job.job_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {job.last_execution_at
                        ? `Última ejecución: ${new Date(job.last_execution_at).toLocaleString()}`
                        : "Nunca ejecutado"}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusBadge(job.health_status)}>{job.health_status}</Badge>
                  {job.consecutive_failures > 0 && (
                    <div className="text-xs text-red-600 mt-1">{job.consecutive_failures} fallos consecutivos</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Estado de Métricas</CardTitle>
              <CardDescription>Métricas críticas del sistema</CardDescription>
            </div>
            <Link href="/admin/metrics-monitoring">
              <Button variant="outline" size="sm">
                Ver Detalles
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {health.metrics.slice(0, 5).map((metric) => (
              <div key={metric.metric_name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {metric.current_status === "healthy" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : metric.current_status === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium">{metric.metric_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Valor actual: {metric.current_value?.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusBadge(metric.current_status)}>{metric.current_status}</Badge>
                  {(metric.active_warnings > 0 || metric.active_criticals > 0) && (
                    <div className="text-xs text-yellow-600 mt-1">
                      {metric.active_warnings} advertencias, {metric.active_criticals} críticas
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Acceso directo a herramientas de monitoreo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/admin/cron-monitoring">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Clock className="h-4 w-4 mr-2" />
                Monitoreo de Cron Jobs
              </Button>
            </Link>
            <Link href="/admin/metrics-monitoring">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <TrendingUp className="h-4 w-4 mr-2" />
                Monitoreo de Métricas
              </Button>
            </Link>
            <Link href="/admin/metrics">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Activity className="h-4 w-4 mr-2" />
                Métricas Generales
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
