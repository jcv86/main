"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Rocket, TrendingUp, CheckCircle, XCircle, Play, RotateCcw } from "lucide-react"

interface Deployment {
  id: string
  name: string
  version: string
  description: string
  status: string
  current_stage: number
  total_stages: number
  traffic_percentage: number
  auto_rollback_enabled: boolean
  created_at: string
  started_at: string
  completed_at: string
  stages: Stage[]
}

interface Stage {
  id: string
  stage_number: number
  traffic_percentage: number
  status: string
  started_at: string
  completed_at: string
  error_rate: number
  success_rate: number
}

export default function CanaryDeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    version: "",
    description: "",
    auto_rollback_enabled: true,
  })

  useEffect(() => {
    loadDeployments()
  }, [])

  const loadDeployments = async () => {
    try {
      const response = await fetch("/api/canary/list")
      const data = await response.json()
      setDeployments(data.deployments || [])
    } catch (error) {
      console.error("Error loading deployments:", error)
    } finally {
      setLoading(false)
    }
  }

  const createDeployment = async () => {
    try {
      const response = await fetch("/api/canary/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setDialogOpen(false)
        setFormData({ name: "", version: "", description: "", auto_rollback_enabled: true })
        loadDeployments()
      }
    } catch (error) {
      console.error("Error creating deployment:", error)
    }
  }

  const advanceDeployment = async (deploymentId: string) => {
    try {
      await fetch("/api/canary/advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deployment_id: deploymentId }),
      })
      loadDeployments()
    } catch (error) {
      console.error("Error advancing deployment:", error)
    }
  }

  const rollbackDeployment = async (deploymentId: string) => {
    try {
      await fetch("/api/canary/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deployment_id: deploymentId, reason: "Manual rollback" }),
      })
      loadDeployments()
    } catch (error) {
      console.error("Error rolling back deployment:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any }> = {
      pending: { variant: "secondary", icon: null },
      in_progress: { variant: "default", icon: <TrendingUp className="w-3 h-3" /> },
      completed: { variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
      rolled_back: { variant: "destructive", icon: <RotateCcw className="w-3 h-3" /> },
      failed: { variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
    }

    const config = variants[status] || variants.pending

    return (
      <Badge variant={config.variant} className="gap-1">
        {config.icon}
        {status.replace("_", " ")}
      </Badge>
    )
  }

  if (loading) {
    return <div className="p-8">Cargando deployments...</div>
  }

  const activeDeployments = deployments.filter((d) => ["pending", "in_progress"].includes(d.status))
  const completedDeployments = deployments.filter((d) => ["completed", "rolled_back", "failed"].includes(d.status))

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Canary Deployments</h1>
          <p className="text-muted-foreground">Sistema de despliegue gradual con rollback automático</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Rocket className="w-4 h-4 mr-2" />
              Nuevo Deployment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Canary Deployment</DialogTitle>
              <DialogDescription>Configura un nuevo deployment gradual con monitoreo automático</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Feature X Release"
                />
              </div>
              <div>
                <Label htmlFor="version">Versión</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="v2.1.0"
                />
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción del deployment..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto_rollback"
                  checked={formData.auto_rollback_enabled}
                  onChange={(e) => setFormData({ ...formData, auto_rollback_enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-muted/30 text-purple focus:ring-purple"
                />
                <Label htmlFor="auto_rollback">Habilitar rollback automático</Label>
              </div>
              <Button onClick={createDeployment} className="w-full">
                Crear Deployment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {activeDeployments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Deployments Activos</h2>
          <div className="grid gap-4">
            {activeDeployments.map((deployment) => (
              <Card key={deployment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{deployment.name}</CardTitle>
                      <CardDescription>Versión {deployment.version}</CardDescription>
                    </div>
                    {getStatusBadge(deployment.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      Progreso: Etapa {deployment.current_stage} de {deployment.total_stages}
                    </span>
                    <span className="font-semibold">{deployment.traffic_percentage}% tráfico</span>
                  </div>

                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-purple h-2 rounded-full transition-all"
                      style={{ width: `${(deployment.current_stage / deployment.total_stages) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {deployment.stages?.map((stage) => (
                      <div
                        key={stage.id}
                        className={`p-2 rounded border text-center text-xs ${`}
                          stage.status === "completed"
                            ? "bg-green/5 border-green/20"
                            : stage.status === "active"
                              ? "bg-blue/5 border-blue/20"
                              : stage.status === "failed"
                                ? "bg-red/5 border-red/20"
                                : "bg-muted/5 border-muted/20"
                        }`}
                      >
                        <div className="font-semibold">{stage.traffic_percentage}%</div>
                        <div className="text-muted-foreground">{stage.status}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {deployment.status === "in_progress" && deployment.current_stage < deployment.total_stages && (
                      <Button onClick={() => advanceDeployment(deployment.id)} size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Avanzar Etapa
                      </Button>
                    )}
                    {["pending", "in_progress"].includes(deployment.status) && (
                      <Button onClick={() => rollbackDeployment(deployment.id)} variant="destructive" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Rollback
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Historial de Deployments</h2>
        <div className="grid gap-4">
          {completedDeployments.map((deployment) => (
            <Card key={deployment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{deployment.name}</CardTitle>
                    <CardDescription>Versión {deployment.version}</CardDescription>
                  </div>
                  {getStatusBadge(deployment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Creado: {new Date(deployment.created_at).toLocaleString("es-CL")}
                  {deployment.completed_at && (
                    <> • Completado: {new Date(deployment.completed_at).toLocaleString("es-CL")}</>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
