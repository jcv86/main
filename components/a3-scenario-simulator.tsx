"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Zap, Users, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Decision {
  id: string
  text: string
  description: string
  outcome: string
  score_impact: number // -30 to +30
  reasoning: string
}

interface Scenario {
  id: string
  titulo: string
  contexto: string
  tipo: "decision" | "comunicacion" | "negociacion" | "liderazgo" | "crisis" | "planificacion"
  nivel: "intermedio" | "avanzado"
  puntos: number
  decisiones: Decision[]
  metricas_exito: {
    label: string
    description: string
    weight: number
  }[]
}

interface A3ScenarioSimulatorProps {
  scenario: Scenario
  onComplete: (result: any) => void
}

export function A3ScenarioSimulator({ scenario, onComplete }: A3ScenarioSimulatorProps) {
  const [stage, setStage] = useState<"setup" | "context" | "decision" | "results">("setup")
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null)
  const [userScore, setUserScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    if (stage === "context") {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [stage])

  const handleDecisionSelect = (decision: Decision) => {
    setSelectedDecision(decision)
    const newScore = Math.max(0, Math.min(100, 50 + decision.score_impact))
    setUserScore(newScore)
    setStage("results")
  }

  const getTypeConfig = (tipo: string) => {
    const configs: Record<string, { icon: string; color: string; label: string }> = {
      decision: { icon: "🤔", color: "bg-blue-100", label: "Toma de Decisión" },
      comunicacion: { icon: "💬", color: "bg-green-100", label: "Comunicación" },
      negociacion: { icon: "🤝", color: "bg-orange-100", label: "Negociación" },
      liderazgo: { icon: "👥", color: "bg-purple-100", label: "Liderazgo" },
      crisis: { icon: "🚨", color: "bg-red-100", label: "Gestión de Crisis" },
      planificacion: { icon: "📋", color: "bg-indigo-100", label: "Planificación" },
    }
    return configs[tipo] || configs.decision
  }

  const typeConfig = getTypeConfig(scenario.tipo)

  if (stage === "setup") {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span>{typeConfig.icon}</span>
                {scenario.titulo}
              </CardTitle>
              <CardDescription className="mt-2">{scenario.contexto}</CardDescription>
            </div>
            <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Difficulty & Points */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-muted">
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Dificultad</div>
                <div className="text-lg font-bold capitalize">{scenario.nivel}</div>
              </CardContent>
            </Card>
            <Card className="bg-muted">
              <CardContent className="pt-4">
                <div className="text-sm text-muted-foreground">Puntos disponibles</div>
                <div className="text-lg font-bold text-primary">+{scenario.puntos}</div>
              </CardContent>
            </Card>
          </div>

          {/* Success Metrics */}
          <div>
            <div className="text-sm font-medium mb-3">Criterios de Éxito</div>
            <div className="space-y-2">
              {scenario.metricas_exito.map((metrica, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-[20px] bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm">{metrica.label}</div>
                    <div className="text-xs text-muted-foreground">{metrica.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <Button
            onClick={() => setStage("context")}
            className="w-full py-6"
            size="lg"
          >
            Comienza la Simulación
            <Zap className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (stage === "context") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Contexto de la Situación</span>
            <div className="text-sm text-muted-foreground">
              Tiempo: {Math.floor(timeElapsed / 60)}:{String(timeElapsed % 60).padStart(2, "0")}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-[28px] p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">{scenario.contexto}</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-3">Analiza la situación y selecciona tu acción</div>
            <Button
              onClick={() => setStage("decision")}
              className="w-full"
            >
              Ver Opciones de Acción
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (stage === "decision") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>¿Cuál es tu decisión?</CardTitle>
          <CardDescription>Elige la acción que consideres más apropiada</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {scenario.decisiones.map((decision) => (
            <Card
              key={decision.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleDecisionSelect(decision)}
            >
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="font-medium">{decision.text}</div>
                  <div className="text-sm text-muted-foreground">{decision.description}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    )
  }

  if (stage === "results" && selectedDecision) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resultado de tu decisión</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Tu Desempeño</span>
              <span className="text-2xl font-bold text-primary">{userScore}%</span>
            </div>
            <Progress value={userScore} className="h-3" />
          </div>

          {/* Your Decision */}
          <div className="bg-blue-50 border border-blue-200 rounded-[28px] p-4">
            <div className="text-sm font-medium mb-2">Tu decisión</div>
            <div className="font-medium">{selectedDecision.text}</div>
          </div>

          {/* Outcome */}
          <div className="bg-green-50 border border-green-200 rounded-[28px] p-4">
            <div className="text-sm font-medium mb-2">Lo que sucedió</div>
            <div className="text-sm text-green-900">{selectedDecision.outcome}</div>
          </div>

          {/* Coaching Insights */}
          <div className="bg-purple-50 border border-purple-200 rounded-[28px] p-4">
            <div className="flex gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium mb-1">Insights del Coach</div>
                <div className="text-sm text-purple-900">{selectedDecision.reasoning}</div>
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <Button
            onClick={() => onComplete({
              scenario_id: scenario.id,
              decision_id: selectedDecision.id,
              performance_score: userScore,
              time_elapsed: timeElapsed,
              puntos: Math.round((userScore / 100) * scenario.puntos),
            })}
            className="w-full py-4"
            size="lg"
          >
            Guardar Resultado y Continuar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return null
}
