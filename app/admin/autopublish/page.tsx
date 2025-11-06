"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, TrendingUp, Settings, History, Zap, AlertTriangle, Play, Pause } from "lucide-react"

export default function AutopublishPage() {
  const [config, setConfig] = useState<any>(null)
  const [candidates, setCandidates] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [configRes, candidatesRes, historyRes] = await Promise.all([
        fetch("/api/autopublish/config"),
        fetch("/api/autopublish/candidates"),
        fetch("/api/autopublish/history"),
      ])

      const [configData, candidatesData, historyData] = await Promise.all([
        configRes.json(),
        candidatesRes.json(),
        historyRes.json(),
      ])

      setConfig(configData)
      setCandidates(candidatesData)
      setHistory(historyData)
    } catch (error) {
      console.error("Error fetching autopublish data:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAutopublish = async (enabled: boolean) => {
    try {
      await fetch("/api/autopublish/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isEnabled: enabled }),
      })
      await fetchData()
    } catch (error) {
      console.error("Error toggling autopublish:", error)
    }
  }

  const publishPrompt = async (promptVersionId: string) => {
    try {
      await fetch("/api/autopublish/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptVersionId, approvedBy: "admin@dtc.com" }),
      })
      await fetchData()
    } catch (error) {
      console.error("Error publishing prompt:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando sistema de autopublicación...</p>
          </div>
        </div>
      </div>
    )
  }

  const readyCandidates = candidates.filter((c) => c.meetsAutopublishCriteria)
  const pendingCandidates = candidates.filter((c) => !c.meetsAutopublishCriteria)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Autopublicación</h1>
          <p className="text-gray-600 mt-1">
            Automatiza la publicación de prompts ganadores basándose en métricas de performance
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="autopublish-toggle">Autopublicación</Label>
            <Switch id="autopublish-toggle" checked={config?.isEnabled || false} onCheckedChange={toggleAutopublish} />
          </div>
          {config?.isEnabled ? (
            <Badge className="bg-green-500">
              <Play className="w-3 h-3 mr-1" />
              Activo
            </Badge>
          ) : (
            <Badge variant="secondary">
              <Pause className="w-3 h-3 mr-1" />
              Pausado
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="candidates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="candidates">
            <Zap className="w-4 h-4 mr-2" />
            Candidatos ({readyCandidates.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="w-4 h-4 mr-2" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-4">
          {readyCandidates.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Listos para Publicar ({readyCandidates.length})
                </CardTitle>
                <CardDescription>Estos prompts cumplen todos los criterios de autopublicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {readyCandidates.map((candidate) => (
                  <Card key={candidate.promptVersionId}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{candidate.versionName}</h3>
                            <Badge variant="outline">{candidate.coachType}</Badge>
                            {candidate.conversationCategory && (
                              <Badge variant="secondary">{candidate.conversationCategory}</Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Sesiones</p>
                              <p className="font-semibold">{candidate.totalSessions}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Satisfacción</p>
                              <p className="font-semibold">{candidate.avgSatisfaction?.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Engagement</p>
                              <p className="font-semibold">{(candidate.avgEngagement * 100)?.toFixed(1)}%</p>
                            </div>
                          </div>

                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="w-4 h-4" />
                              <span>+{candidate.satisfactionImprovementPct?.toFixed(1)}% satisfacción</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                              <TrendingUp className="w-4 h-4" />
                              <span>+{candidate.engagementImprovementPct?.toFixed(1)}% engagement</span>
                            </div>
                          </div>

                          <p className="text-sm text-gray-600">vs. {candidate.currentVersionName}</p>
                        </div>

                        <Button onClick={() => publishPrompt(candidate.promptVersionId)} className="ml-4">
                          <Zap className="w-4 h-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {pendingCandidates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  En Evaluación ({pendingCandidates.length})
                </CardTitle>
                <CardDescription>Estos prompts aún no cumplen todos los criterios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingCandidates.map((candidate) => (
                  <Card key={candidate.promptVersionId} className="border-gray-200">
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{candidate.versionName}</h3>
                          <Badge variant="outline">{candidate.coachType}</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Sesiones</p>
                            <p
                              className={
                                candidate.totalSessions < config.minSessionsRequired
                                  ? "text-red-600 font-semibold"
                                  : "font-semibold"
                              }
                            >
                              {candidate.totalSessions} / {config.minSessionsRequired}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Satisfacción</p>
                            <p
                              className={
                                candidate.avgSatisfaction < config.minSatisfactionScore
                                  ? "text-red-600 font-semibold"
                                  : "font-semibold"
                              }
                            >
                              {candidate.avgSatisfaction?.toFixed(2)} / {config.minSatisfactionScore}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Mejora</p>
                            <p
                              className={
                                candidate.satisfactionImprovementPct < config.improvementThresholdPercentage
                                  ? "text-red-600 font-semibold"
                                  : "font-semibold"
                              }
                            >
                              {candidate.satisfactionImprovementPct?.toFixed(1)}% /{" "}
                              {config.improvementThresholdPercentage}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {candidates.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No hay candidatos a autopublicación en este momento</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Publicaciones</CardTitle>
              <CardDescription>Registro de todas las autopublicaciones realizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.coach_type}</p>
                        {item.conversation_category && <Badge variant="secondary">{item.conversation_category}</Badge>}
                        <Badge
                          className={
                            item.status === "published"
                              ? "bg-green-500"
                              : item.status === "rolled_back"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{item.decision_reason}</p>
                      {item.improvement_percentage && (
                        <p className="text-sm text-green-600">+{item.improvement_percentage.toFixed(1)}% mejora</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{new Date(item.created_at).toLocaleDateString()}</p>
                      <p>{item.triggered_by}</p>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <p className="text-center text-gray-600 py-8">No hay historial de publicaciones</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Autopublicación</CardTitle>
              <CardDescription>Define los criterios y umbrales para la autopublicación automática</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minSessions">Sesiones Mínimas Requeridas</Label>
                  <Input
                    id="minSessions"
                    type="number"
                    value={config?.minSessionsRequired || 100}
                    onChange={(e) => setConfig({ ...config, minSessionsRequired: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600">Número mínimo de sesiones antes de considerar autopublicación</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minSatisfaction">Satisfacción Mínima</Label>
                  <Input
                    id="minSatisfaction"
                    type="number"
                    step="0.1"
                    value={config?.minSatisfactionScore || 4.0}
                    onChange={(e) => setConfig({ ...config, minSatisfactionScore: Number.parseFloat(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600">Puntuación mínima de satisfacción (1-5)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minEngagement">Engagement Mínimo</Label>
                  <Input
                    id="minEngagement"
                    type="number"
                    step="0.01"
                    value={config?.minEngagementScore || 0.7}
                    onChange={(e) => setConfig({ ...config, minEngagementScore: Number.parseFloat(e.target.value) })}
                  />
                  <p className="text-sm text-gray-600">Nivel mínimo de engagement (0-1)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="improvementThreshold">Umbral de Mejora (%)</Label>
                  <Input
                    id="improvementThreshold"
                    type="number"
                    step="1"
                    value={config?.improvementThresholdPercentage || 10}
                    onChange={(e) =>
                      setConfig({ ...config, improvementThresholdPercentage: Number.parseFloat(e.target.value) })
                    }
                  />
                  <p className="text-sm text-gray-600">Porcentaje mínimo de mejora vs. prompt actual</p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireReview">Requiere Revisión Manual</Label>
                    <p className="text-sm text-gray-600">Los prompts necesitan aprobación manual antes de publicarse</p>
                  </div>
                  <Switch
                    id="requireReview"
                    checked={config?.requireManualReview || false}
                    onCheckedChange={(checked) => setConfig({ ...config, requireManualReview: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoRollback">Rollback Automático</Label>
                    <p className="text-sm text-gray-600">Revertir automáticamente si las métricas empeoran</p>
                  </div>
                  <Switch
                    id="autoRollback"
                    checked={config?.autoRollbackOnDegradation || false}
                    onCheckedChange={(checked) => setConfig({ ...config, autoRollbackOnDegradation: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifyOnPublish">Notificar en Publicación</Label>
                    <p className="text-sm text-gray-600">Enviar notificaciones cuando se autopublica un prompt</p>
                  </div>
                  <Switch
                    id="notifyOnPublish"
                    checked={config?.notifyOnAutopublish || false}
                    onCheckedChange={(checked) => setConfig({ ...config, notifyOnAutopublish: checked })}
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  fetch("/api/autopublish/config", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(config),
                  }).then(() => fetchData())
                }}
              >
                Guardar Configuración
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
