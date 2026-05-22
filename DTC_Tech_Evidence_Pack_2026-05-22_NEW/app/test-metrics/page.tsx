"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CoachingFeedbackDialog } from "@/components/coaching-feedback-dialog"
import { CoachingMetricsDashboard } from "@/components/coaching-metrics-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, BarChart3, TestTube } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TestMetricsPage() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const [messageCount, setMessageCount] = useState(0)
  const [promptAssignment, setPromptAssignment] = useState<any>(null)
  const [loadingAssignment, setLoadingAssignment] = useState(true)

  useEffect(() => {
    fetchPromptAssignment()
  }, [])

  const fetchPromptAssignment = async () => {
    try {
      setLoadingAssignment(true)
      const response = await fetch("/api/prompt-assignment?coachType=sofia&category=autoconocimiento")
      const data = await response.json()
      setPromptAssignment(data)
    } catch (error) {
      console.error("Error fetching prompt assignment:", error)
    } finally {
      setLoadingAssignment(false)
    }
  }

  const simulateConversation = () => {
    setMessageCount((prev) => prev + 1)
    if (messageCount + 1 >= 2) {
      setTimeout(() => setShowFeedback(true), 1000)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Sistema de Métricas - Prueba</h1>
        <p className="text-muted-foreground">
          Prueba el sistema de métricas de coaching según el documento (páginas 61-63)
        </p>
      </div>

      <Tabs defaultValue="test" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="test" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Probar Sistema
          </TabsTrigger>
          <TabsTrigger value="ab-testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Ver Dashboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Simulador de Conversación</CardTitle>
              <CardDescription>Simula una conversación para probar el sistema de métricas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Estado actual:</p>
                <ul className="text-sm space-y-1">
                  <li>
                    • Session ID: <code className="text-xs bg-background px-1 py-0.5 rounded">{sessionId}</code>
                  </li>
                  <li>
                    • Mensajes del usuario: <strong>{messageCount}</strong>
                  </li>
                  <li>• Engagement: {messageCount >= 2 ? "✅ >2 mensajes" : "⏳ Necesita más mensajes"}</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button onClick={simulateConversation} className="w-full" size="lg">
                  Simular Mensaje del Usuario ({messageCount}/2)
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  El dialog de feedback aparecerá después de 2 mensajes
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Métricas según documento:</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>
                    • <strong>Engagement</strong>: &gt;2 mensajes por sesión
                  </li>
                  <li>
                    • <strong>Satisfaction</strong>: &gt;4★ rating
                  </li>
                  <li>
                    • <strong>Acción completada</strong>: Usuario completó la acción sugerida
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Probar Feedback Manual</CardTitle>
              <CardDescription>Abre el dialog de feedback directamente</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowFeedback(true)} variant="outline" className="w-full">
                Abrir Dialog de Feedback
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ab-testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado del A/B Testing</CardTitle>
              <CardDescription>Verifica qué variante de prompt está asignada a tu usuario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingAssignment ? (
                <div className="text-center py-8 text-muted-foreground">Cargando asignación...</div>
              ) : promptAssignment ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Coach</p>
                      <p className="font-semibold capitalize">{promptAssignment.coachType}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Categoría</p>
                      <p className="font-semibold capitalize">{promptAssignment.category}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Versión Asignada</p>
                      <Badge variant={promptAssignment.isControl ? "secondary" : "default"}>
                        {promptAssignment.isControl ? "Control" : "Variante"}
                      </Badge>
                    </div>
                    <p className="text-lg font-bold">{promptAssignment.version}</p>
                    {promptAssignment.variantName && (
                      <p className="text-sm text-muted-foreground">{promptAssignment.variantName}</p>
                    )}
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">System Prompt (primeros 200 caracteres)</p>
                    <p className="text-sm font-mono bg-background p-2 rounded">
                      {promptAssignment.systemPrompt.substring(0, 200)}...
                    </p>
                  </div>

                  <Button onClick={fetchPromptAssignment} variant="outline" className="w-full bg-transparent">
                    Recargar Asignación
                  </Button>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2 text-sm">Cómo funciona el A/B Testing:</h3>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Cada usuario es asignado consistentemente a una variante</li>
                      <li>• Las métricas se trackean por variante para comparar performance</li>
                      <li>• Los admins pueden activar/desactivar variantes desde Gestión de Prompts</li>
                      <li>• La variante ganadora puede publicarse como nueva versión control</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">No se pudo cargar la asignación de prompt</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard">
          <CoachingMetricsDashboard />
        </TabsContent>
      </Tabs>

      <CoachingFeedbackDialog
        open={showFeedback}
        onOpenChange={setShowFeedback}
        sessionId={sessionId}
        messageCount={messageCount}
        coachType="sofia"
        conversationCategory="autoconocimiento"
        suggestedAction="Completa tu evaluación de personalidad para conocer tu estilo de comunicación"
      />
    </div>
  )
}
