"use client"

import { useState, useRef, useEffect } from "react"
import { useContextValidation } from "@/lib/hooks/use-context-validation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Pause, RefreshCw, ChevronRight } from "lucide-react"

interface A3ChatCoachProps {
  scenarioId: string
  onComplete?: (result: any) => void
}

type SimulationStage = "initial" | "exploring" | "pause" | "micro_experiment" | "closing"

export function A3ChatCoach({ scenarioId, onComplete }: A3ChatCoachProps) {
  const { validateContextRelevance, validationError, clearError } = useContextValidation()
  const [simulationStage, setSimulationStage] = useState<SimulationStage>("initial")
  const [responseHistory, setResponseHistory] = useState<string[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [pauseExplanation, setPauseExplanation] = useState<string | null>(null)
  const [microExperimentActive, setMicroExperimentActive] = useState(false)
  const [microExperimentPrompt, setMicroExperimentPrompt] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleScenarioStart = () => {
    setSimulationStage("exploring")
    const initialMessage = {
      role: "assistant",
      content: `Hola, bienvenido a esta simulación. Vamos a explorar un escenario juntos sin presión. Tu rol es experimentar y observar cómo respondes en distintas situaciones.

¿Estás listo para comenzar? Cuéntame qué es lo primero que haría en esta situación.`
    }
    setMessages([initialMessage])
  }

  const handleUserResponse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userInput.trim()) return

    try {
      setIsLoading(true)
      clearError()

      // Validate that response is contextually relevant to the simulation scenario
      const scenarioContext = `Simulación: ${scenarioId}. Stage: ${simulationStage}. El usuario debe proporcionar respuestas relevantes al escenario de simulación.`
      const validation = await validateContextRelevance(
        scenarioContext,
        userInput,
        'a3-chat-coach'
      )

      if (!validation.isRelevant) {
        setError(validation.reason || 'Tu respuesta no está relacionada con la simulación. Por favor, responde sobre el escenario propuesto.')
        setIsLoading(false)
        return
      }

      const newResponses = [...responseHistory, userInput]
      setResponseHistory(newResponses)

      // Add user message to chat
      setMessages(prev => [...prev, { role: "user", content: userInput }])
      setUserInput("")

      // Call OpenAI directly
      const response = await fetch("/api/a3-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: userInput }
          ],
          context: { scenarioId, stage: simulationStage },
          simulationStage,
          previousResponses: newResponses
        })
      })

      if (!response.ok) throw new Error("API error")

      // Parse streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ""

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.choices?.[0]?.delta?.content) {
                  fullResponse += data.choices[0].delta.content
                  setMessages(prev => {
                    const updated = [...prev]
                    if (updated[updated.length - 1]?.role === "assistant") {
                      updated[updated.length - 1].content = fullResponse
                    } else {
                      updated.push({ role: "assistant", content: fullResponse })
                    }
                    return updated
                  })
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Update simulation stage based on response
      if (fullResponse.includes("pausa explicativa")) {
        setSimulationStage("pause")
        setIsPaused(true)
      } else if (fullResponse.includes("micro-experimento")) {
        setSimulationStage("micro_experiment")
        setMicroExperimentActive(true)
      } else if (fullResponse.includes("resumen") || fullResponse.includes("cierre")) {
        setSimulationStage("closing")
      }
    } catch (error) {
      console.error("[v0] Chat coach error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryWithVariation = async () => {
    setSimulationStage("micro_experiment")
    setMicroExperimentActive(true)
    setPauseExplanation(null)
    setIsPaused(false)

    // Clear previous assistant message and prompt for retry
    const newMessages = messages.slice(0, -1)
    setMessages([
      ...newMessages,
      {
        role: "assistant",
        content: `Excelente. Ahora vamos a probar una variación pequeña. 

¿Qué pasaría si intentaras una respuesta diferente? Por ejemplo, que enfatizaras más en X, o que priorizaras Y.

¿Quieres intentarlo?`,
      },
    ])
  }

  const handleEndSimulation = () => {
    setSimulationStage("closing")

    setMessages([
      ...messages,
      {
        role: "assistant",
        content: `Excelente trabajo. Veamos qué aprendimos:

En esta simulación exploraste diferentes formas de responder bajo presión. Observaste que cuando [PATRÓN], la reacción fue [RESULTADO].

Un patrón interesante fue cómo [OBSERVACIÓN]. Esto está conectado con lo que vimos en A1 sobre [CONEXIÓN A1].

¿Cómo crees que podrías llevar esto a situaciones reales sin la presión de la simulación?`,
      },
    ])

    if (onComplete) {
      onComplete({
        scenario_id: scenarioId,
        responses: responseHistory,
        patterns_observed: extractPatterns(messages),
        learning_moments: extractLearningMoments(messages),
      })
    }
  }

  const extractPatterns = (msgs: typeof messages): string[] => {
    // Extract patterns from assistant messages
    return msgs
      .filter(m => m.role === "assistant")
      .map(m => m.content)
      .filter(c => c.includes("patrón") || c.includes("observo"))
  }

  const extractLearningMoments = (msgs: typeof messages): string[] => {
    // Extract learning moments from the conversation
    return msgs
      .filter(m => m.role === "assistant")
      .map(m => m.content)
      .filter(c => c.includes("aprendim") || c.includes("conecta"))
  }

  if (simulationStage === "initial") {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>A3 – Simulación y Entrenamiento</CardTitle>
          <CardDescription>
            Espacio seguro para experimentar, observar cómo respondes y entrenar nuevas formas de pensar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              En esta simulación no hay "respuestas correctas o incorrectas". El foco es observar cómo respondes y
              aprender de ello.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Cómo funciona:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-purple"></span>
                <span>Propongo un escenario realista</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple"></span>
                <span>Explores diferentes respuestas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple"></span>
                <span>Pausamos para explicar patrones interesantes</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple"></span>
                <span>Probamos variaciones (micro-experimentos)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple"></span>
                <span>Resumimos lo aprendido sin evaluación</span>
              </li>
            </ul>
          </div>

          <Button onClick={handleScenarioStart} size="lg" className="w-full">
            Comenzar Simulación
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Simulación en Curso</CardTitle>
            <CardDescription>
              {simulationStage === "exploring" && "Explorando el escenario..."}
              {simulationStage === "pause" && "Pausa explicativa"}
              {simulationStage === "micro_experiment" && "Micro-experimento"}
              {simulationStage === "closing" && "Resumen de aprendizaje"}
            </CardDescription>
          </div>
          <Badge variant={isPaused ? "default" : "secondary"}>
            {isPaused ? (
              <>
                <Pause className="mr-1 h-3 w-3" />
                Pausa
              </>
            ) : (
              <>
                <RefreshCw className="mr-1 h-3 w-3" />
                En curso
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Messages */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-purple text-purple-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        {/* User Input */}
        <form onSubmit={handleUserResponse} className="space-y-3">
          {error && (
            <Alert variant="destructive" className="border-[rgb(80,160,170)]/30 bg-[rgba(80,160,170,0.5)]/5 dark:bg-[rgba(80,160,170,0.5)]/20">
              <AlertTriangle className="h-4 w-4 text-[rgb(80,160,170)]" />
              <AlertDescription className="text-[rgb(80,160,170)] dark:text-[rgb(80,160,170)]/20 ml-2">{error}</AlertDescription>
            </Alert>
          )}

          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe tu respuesta..."
            disabled={isLoading}
            className="w-full"
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="flex-1"
            >
              {isLoading ? "Pensando..." : "Enviar"}
            </Button>

            {microExperimentActive && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRetryWithVariation}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Probar Variación
              </Button>
            )}

            {simulationStage === "closing" && (
              <Button
                type="button"
                variant="default"
                onClick={handleEndSimulation}
              >
                Terminar
              </Button>
            )}
          </div>
        </form>

        {isPaused && (
          <Alert className="bg-blue/5 border-blue/20">
            <AlertTriangle className="h-4 w-4 text-blue" />
            <AlertDescription className="text-blue">
              Estamos en pausa para observar el patrón. Cuando estés listo, continúa escribiendo tu respuesta.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
