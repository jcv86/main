"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CoachingFeedbackDialog } from "@/components/coaching-feedback-dialog"
import { CoachingMetricsDashboard } from "@/components/coaching-metrics-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, BarChart3 } from "lucide-react"

export default function TestMetricsPage() {
  const [showFeedback, setShowFeedback] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const [messageCount, setMessageCount] = useState(0)

  const simulateConversation = () => {
    setMessageCount((prev) => prev + 1)
    if (messageCount + 1 >= 2) {
      // Mostrar feedback después de 2 mensajes del usuario
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
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="test" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Probar Sistema
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
        suggestedAction="Completa el test DISC para conocer tu estilo de comunicación"
      />
    </div>
  )
}
