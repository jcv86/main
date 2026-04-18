"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle2, Clock, PlayCircle, XCircle, User, Bell, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ReviewTask {
  id: string
  coach_type: string
  conversation_category: string
  avg_satisfaction: number
  avg_engagement: number
  action_completion_rate: number
  total_sessions: number
  issue_type: string
  severity: string
  status: string
  assigned_to: string | null
  created_at: string
  unread_notifications: number
}

interface Notification {
  id: string
  notification_type: string
  title: string
  message: string
  read: boolean
  created_at: string
  related_task_id: string | null
}

export default function ReviewWorkflowDashboard() {
  const [tasks, setTasks] = useState<ReviewTask[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    fetchTasks()
    fetchNotifications()
  }, [activeTab])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/review-tasks?status=${activeTab}`)
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/admin-notifications?unread=true")
      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const createTasksFromCritical = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/review-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_tasks" }),
      })
      const data = await response.json()
      alert(`Se crearon ${data.tasksCreated} nuevas tareas de revisión`)
      fetchTasks()
    } catch (error) {
      console.error("Error creating tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await fetch("/api/review-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_status",
          taskId,
          data: { status },
        }),
      })
      fetchTasks()
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getIssueIcon = (issueType: string) => {
    switch (issueType) {
      case "low_satisfaction":
        return "😞"
      case "low_engagement":
        return "💤"
      case "low_action":
        return "❌"
      case "multiple_issues":
        return "🚨"
      default:
        return "⚠️"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "in_review":
        return <PlayCircle className="h-4 w-4" />
      case "variant_created":
        return <CheckCircle2 className="h-4 w-4" />
      case "testing":
        return <RefreshCw className="h-4 w-4" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />
      case "dismissed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workflow de Revisión</h1>
          <p className="text-muted-foreground">Gestiona tareas de revisión de prompts críticos</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={createTasksFromCritical} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Escanear Prompts Críticos
          </Button>
        </div>
      </div>

      {/* Notificaciones */}
      {notifications.length > 0 && (
        <Card className="border-orange/20 bg-orange/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones ({notifications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notif) => (
                <div key={notif.id} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 mt-0.5 text-orange" />
                  <div>
                    <p className="font-medium">{notif.title}</p>
                    <p className="text-muted-foreground">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs de estado */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="in_review">En Revisión</TabsTrigger>
          <TabsTrigger value="testing">En Testing</TabsTrigger>
          <TabsTrigger value="resolved">Resueltas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <p>Cargando tareas...</p>
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">No hay tareas en este estado</CardContent>
            </Card>
          ) : (
            tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {getIssueIcon(task.issue_type)}
                        {task.coach_type === "sofia" ? "Sofía" : "Dani"} - {task.conversation_category}
                        <Badge variant={getSeverityColor(task.severity)}>{task.severity}</Badge>
                      </CardTitle>
                      <CardDescription>{task.total_sessions} sesiones analizadas</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <span className="text-sm text-muted-foreground capitalize">{task.status.replace("_", " ")}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Métricas */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Satisfacción</p>
                      <p className="text-2xl font-bold">{task.avg_satisfaction.toFixed(1)}★</p>
                      {task.avg_satisfaction < 4.3 && <p className="text-xs text-red">Bajo umbral (4.3★)</p>}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                      <p className="text-2xl font-bold">{task.avg_engagement.toFixed(1)} msgs</p>
                      {task.avg_engagement < 2.5 && <p className="text-xs text-red">Bajo umbral (2.5)</p>}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Acción</p>
                      <p className="text-2xl font-bold">{task.action_completion_rate.toFixed(0)}%</p>
                      {task.action_completion_rate < 60 && <p className="text-xs text-red">Bajo umbral (60%)</p>}
                    </div>
                  </div>

                  {/* Asignación */}
                  {task.assigned_to && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>Asignado a: {task.assigned_to}</span>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Link href={`/admin/critical-logs?coach=${task.coach_type}&category=${task.conversation_category}`}>
                      <Button variant="outline" size="sm">
                        Ver Logs
                      </Button>
                    </Link>
                    <Link
                      href={`/admin/prompt-management?coach=${task.coach_type}&category=${task.conversation_category}`}
                    >
                      <Button variant="outline" size="sm">
                        Gestionar Prompts
                      </Button>
                    </Link>
                    {task.status === "pending" && (
                      <Button size="sm" onClick={() => updateTaskStatus(task.id, "in_review")}>
                        Comenzar Revisión
                      </Button>
                    )}
                    {task.status === "in_review" && (
                      <Button size="sm" onClick={() => updateTaskStatus(task.id, "variant_created")}>
                        Variante Creada
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { ReviewWorkflowDashboard }
