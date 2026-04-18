"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, TrendingUp, Settings } from "lucide-react"

interface AutopublishCandidate {
  prompt_version_id: string
  version_name: string
  coach_type: string
  conversation_category: string
  total_sessions: number
  avg_engagement: number
  avg_satisfaction: number
  action_completion_rate: number
  engagement_improvement_pct: number
  satisfaction_improvement_pct: number
  completion_improvement_pct: number
  meets_autopublish_criteria: boolean
  is_published: boolean
}

interface AutopublishConfig {
  id: string
  config_name: string
  is_enabled: boolean
  min_sessions_required: number
  min_engagement_score: number
  min_satisfaction_score: number
  min_action_completion_rate: number
  improvement_threshold_percentage: number
  require_manual_review: boolean
  auto_rollback_on_degradation: boolean
}

interface AutopublishHistory {
  id: string
  coach_type: string
  conversation_category: string
  status: string
  improvement_percentage: number
  published_at: string
  triggered_by: string
}

export default function AutopublishPage() {
  const [candidates, setCandidates] = useState<AutopublishCandidate[]>([])
  const [config, setConfig] = useState<AutopublishConfig | null>(null)
  const [history, setHistory] = useState<AutopublishHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [candidatesRes, configRes, historyRes] = await Promise.all([
        fetch("/api/autopublish/candidates"),
        fetch("/api/autopublish/config"),
        fetch("/api/autopublish/history"),
      ])

      if (candidatesRes.ok) setCandidates(await candidatesRes.json())
      if (configRes.ok) setConfig(await configRes.json())
      if (historyRes.ok) setHistory(await historyRes.json())
    } catch (error) {
      console.error("Error loading autopublish data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (promptVersionId: string) => {
    try {
      const res = await fetch("/api/autopublish/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt_version_id: promptVersionId }),
      })

      if (res.ok) {
        await loadData()
      }
    } catch (error) {
      console.error("Error publishing:", error)
    }
  }

  if (loading) {
    return <div className="p-8">Cargando sistema de autopublicación...</div>
  }

  const readyCandidates = candidates.filter((c) => c.meets_autopublish_criteria && !c.is_published)
  const publishedCandidates = candidates.filter((c) => c.is_published)

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sistema de Autopublicación</h1>
        <p className="text-muted-foreground">Gestión automática de prompts basada en métricas de rendimiento</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listos para Publicar</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readyCandidates.length}</div>
            <p className="text-xs text-muted-foreground">Cumplen criterios de autopublicación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedCandidates.length}</div>
            <p className="text-xs text-muted-foreground">Versiones activas en producción</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
            <Settings className="h-4 w-4 text-purple/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{config?.is_enabled ? "Activo" : "Inactivo"}</div>
            <p className="text-xs text-muted-foreground">
              {config?.require_manual_review ? "Requiere revisión manual" : "Automático"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Historial</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{history.length}</div>
            <p className="text-xs text-muted-foreground">Publicaciones totales</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="candidates">Candidatos</TabsTrigger>
          <TabsTrigger value="published">Publicados</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidatos para Autopublicación</CardTitle>
              <CardDescription>Versiones de prompts que cumplen los criterios de mejora</CardDescription>
            </CardHeader>
            <CardContent>
              {readyCandidates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay candidatos listos para publicar en este momento</p>
              ) : (
                <div className="space-y-4">
                  {readyCandidates.map((candidate) => (
                    <div
                      key={candidate.prompt_version_id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{candidate.version_name}</h3>
                          <Badge variant="outline">{candidate.coach_type}</Badge>
                          <Badge variant="secondary">{candidate.conversation_category}</Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{candidate.total_sessions} sesiones</span>
                          <span>Engagement: {(candidate.avg_engagement * 100).toFixed(1)}%</span>
                          <span>Satisfacción: {candidate.avg_satisfaction.toFixed(1)}/5</span>
                          <span>Completitud: {(candidate.action_completion_rate * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex gap-2 text-xs">
                          <Badge variant="default" className="bg-green/50">
                            +{candidate.engagement_improvement_pct.toFixed(1)}% engagement
                          </Badge>
                          <Badge variant="default" className="bg-blue/50">
                            +{candidate.satisfaction_improvement_pct.toFixed(1)}% satisfacción
                          </Badge>
                          <Badge variant="default" className="bg-purple/50">
                            +{candidate.completion_improvement_pct.toFixed(1)}% completitud
                          </Badge>
                        </div>
                      </div>
                      <Button onClick={() => handlePublish(candidate.prompt_version_id)} size="sm">
                        Publicar
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Versiones Publicadas</CardTitle>
              <CardDescription>Prompts actualmente en producción</CardDescription>
            </CardHeader>
            <CardContent>
              {publishedCandidates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay versiones publicadas</p>
              ) : (
                <div className="space-y-4">
                  {publishedCandidates.map((candidate) => (
                    <div
                      key={candidate.prompt_version_id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green/5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green" />
                          <h3 className="font-semibold">{candidate.version_name}</h3>
                          <Badge variant="outline">{candidate.coach_type}</Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{candidate.total_sessions} sesiones</span>
                          <span>Engagement: {(candidate.avg_engagement * 100).toFixed(1)}%</span>
                          <span>Satisfacción: {candidate.avg_satisfaction.toFixed(1)}/5</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Publicaciones</CardTitle>
              <CardDescription>Registro de todas las autopublicaciones realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay historial de publicaciones</p>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.coach_type}</span>
                          <Badge variant="outline">{item.conversation_category}</Badge>
                          <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Mejora: +{item.improvement_percentage.toFixed(1)}% •
                          {new Date(item.published_at).toLocaleDateString()} • Por: {item.triggered_by}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración del Sistema</CardTitle>
              <CardDescription>Parámetros de autopublicación y umbrales de calidad</CardDescription>
            </CardHeader>
            <CardContent>
              {config && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Estado del Sistema</label>
                      <div className="flex items-center gap-2">
                        {config.is_enabled ? (
                          <Badge variant="default" className="bg-green/50">
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactivo</Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sesiones Mínimas</label>
                      <p className="text-2xl font-bold">{config.min_sessions_required}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Engagement Mínimo</label>
                      <p className="text-2xl font-bold">{(config.min_engagement_score * 100).toFixed(0)}%</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Satisfacción Mínima</label>
                      <p className="text-2xl font-bold">{config.min_satisfaction_score.toFixed(1)}/5</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Completitud Mínima</label>
                      <p className="text-2xl font-bold">{(config.min_action_completion_rate * 100).toFixed(0)}%</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Umbral de Mejora</label>
                      <p className="text-2xl font-bold">+{config.improvement_threshold_percentage.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Requiere Revisión Manual</span>
                      <Badge variant={config.require_manual_review ? "default" : "secondary"}>
                        {config.require_manual_review ? "Sí" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Auto-Rollback en Degradación</span>
                      <Badge variant={config.auto_rollback_on_degradation ? "default" : "secondary"}>
                        {config.auto_rollback_on_degradation ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
