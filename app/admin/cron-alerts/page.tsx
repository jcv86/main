"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface CronAlert {
  id: string
  job_name: string
  alert_type: string
  severity: string
  alert_message: string
  triggered_at: string
  hours_since_triggered: number
  consecutive_failures?: number
}

interface HealthSummary {
  job_name: string
  is_active: boolean
  health_status: string
  active_alerts: number
  critical_alerts: number
  last_success_at?: string
  last_failure_at?: string
}

export default function CronAlertsPage() {
  const [activeAlerts, setActiveAlerts] = useState<CronAlert[]>([])
  const [healthSummary, setHealthSummary] = useState<HealthSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<CronAlert | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [acknowledging, setAcknowledging] = useState(false)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [alertsRes, summaryRes] = await Promise.all([
        fetch("/api/cron-alerts/active"),
        fetch("/api/cron-alerts/summary"),
      ])

      const alertsData = await alertsRes.json()
      const summaryData = await summaryRes.json()

      setActiveAlerts(alertsData.alerts || [])
      setHealthSummary(summaryData.summary || [])
    } catch (error) {
      console.error("Error fetching cron alerts data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcknowledge = async () => {
    if (!selectedAlert) return

    setAcknowledging(true)
    try {
      const response = await fetch("/api/cron-alerts/acknowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: selectedAlert.id,
          acknowledgedBy: "admin",
          resolutionNotes,
        }),
      })

      if (response.ok) {
        setSelectedAlert(null)
        setResolutionNotes("")
        fetchData()
      }
    } catch (error) {
      console.error("Error acknowledging alert:", error)
    } finally {
      setAcknowledging(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-orange" />
      case "critical":
        return <AlertCircle className="h-5 w-5 text-[rgb(80,160,170)]" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Cargando alertas de cron jobs...</div>
        </div>
      </div>
    )
  }

  const criticalAlerts = activeAlerts.filter((a) => a.severity === "critical")
  const highAlerts = activeAlerts.filter((a) => a.severity === "high")

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alertas de Cron Jobs</h1>
        <p className="text-muted-foreground">Monitoreo y gestión de alertas de trabajos programados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <AlertCircle className="h-4 w-4 text-[rgb(80,160,170)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[rgb(80,160,170)]">{criticalAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange">{highAlerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Saludables</CardTitle>
            <CheckCircle className="h-4 w-4 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green">
              {healthSummary.filter((h) => h.health_status === "healthy").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas Activas</CardTitle>
          <CardDescription>Alertas que requieren atención</CardDescription>
        </CardHeader>
        <CardContent>
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green" />
              <p>No hay alertas activas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                      <span className="font-medium">{alert.job_name}</span>
                      <Badge variant="outline">{alert.alert_type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{alert.alert_message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Hace {Math.round(alert.hours_since_triggered)} horas</span>
                      {alert.consecutive_failures && <span>{alert.consecutive_failures} fallos consecutivos</span>}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedAlert(alert)}>
                    Reconocer
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Salud de Cron Jobs</CardTitle>
          <CardDescription>Resumen del estado de todos los trabajos programados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthSummary.map((job) => (
              <div key={job.job_name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getHealthStatusIcon(job.health_status)}
                  <div>
                    <div className="font-medium">{job.job_name}</div>
                    <div className="text-sm text-muted-foreground">{job.is_active ? "Activo" : "Inactivo"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {job.active_alerts > 0 && <Badge variant="destructive">{job.active_alerts} alertas</Badge>}
                  {job.critical_alerts > 0 && <Badge variant="destructive">{job.critical_alerts} críticas</Badge>}
                  <Badge variant={job.health_status === "healthy" ? "default" : "secondary"}>{job.health_status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acknowledge Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reconocer Alerta</DialogTitle>
            <DialogDescription>Confirma que has revisado y estás trabajando en resolver esta alerta</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-1">{selectedAlert.job_name}</div>
                <p className="text-sm text-muted-foreground">{selectedAlert.alert_message}</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Notas de Resolución (opcional)</label>
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe las acciones tomadas o el plan de resolución..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAlert(null)} disabled={acknowledging}>
              Cancelar
            </Button>
            <Button onClick={handleAcknowledge} disabled={acknowledging}>
              {acknowledging ? "Reconociendo..." : "Reconocer Alerta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
