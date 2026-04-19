"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, TrendingUp, Zap, CheckCircle2 } from "lucide-react"

interface DifficulttyProgressionProps {
  currentLevel: number
  scenarioType: "entrevista_guiada" | "estructurada" | "desafiante" | "presion"
  pSuccess: number
  onLevelChange?: (newLevel: number) => void
  onDifficultyWarning?: (warning: boolean) => void
}

export function A3DifficultyProgression({
  currentLevel,
  scenarioType,
  pSuccess,
  onLevelChange,
  onDifficultyWarning
}: DifficulttyProgressionProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Map scenario type to human readable name
  const scenarioNames: Record<string, string> = {
    entrevista_guiada: "Entrevista Guiada (Nivel Básico)",
    estructurada: "Entrevista Estructurada (Intermedio)",
    desafiante: "Entrevista Desafiante (Avanzado)",
    presion: "Entrevista Bajo Presión (Bonus)"
  }

  // Difficulty progression rules
  const difficultyConfig = [
    {
      level: 1,
      name: "Básico",
      description: "Baja presión, guía visible, feedback frecuente",
      requirements: "Inicio",
      solidExecutions: 0,
      pressure: "Baja",
      guidance: "Alta",
      feedbackFrequency: "Frecuente"
    },
    {
      level: 2,
      name: "Intermedio",
      description: "Presión moderada, menor guía, preguntas abiertas",
      requirements: "Completar Básico",
      solidExecutions: 0,
      pressure: "Moderada",
      guidance: "Media",
      feedbackFrequency: "Normal"
    },
    {
      level: 3,
      name: "Avanzado",
      description: "Alta presión, ambigüedad, ritmo exigente",
      requirements: "3+ ejecuciones sólidas en Intermedio",
      solidExecutions: 3,
      pressure: "Alta",
      guidance: "Baja",
      feedbackFrequency: "Al final"
    },
    {
      level: 4,
      name: "Bonus 1",
      description: "Dominio real con complejidad adicional",
      requirements: "5+ ejecuciones sólidas en Avanzado",
      solidExecutions: 5,
      pressure: "Muy Alta",
      guidance: "Mínima",
      feedbackFrequency: "Al final"
    }
  ]

  const currentConfig = difficultyConfig[currentLevel - 1] || difficultyConfig[2]
  const nextConfig = difficultyConfig[currentLevel] || null

  // 15% Rule Check
  const highDifficultyWarning = pSuccess <= 0.15
  const pSuccessPercentage = Math.round(pSuccess * 100)

  if (highDifficultyWarning && onDifficultyWarning) {
    onDifficultyWarning(true)
  }

  return (
    <div className="space-y-6">
      {/* P_Success Probability */}
      <Card className="border-2 border-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Probabilidad de Éxito (P_Success)
          </CardTitle>
          <CardDescription>
            Basada en tu historial, nivel actual, capacidad efectiva y contexto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">
              <span className={
                pSuccessPercentage >= 70 ? "text-green" :
                pSuccessPercentage >= 50 ? "text-blue" :
                pSuccessPercentage >= 30 ? "text-amber-600" :
                "text-red"
              }>
                {pSuccessPercentage}%
              </span>
            </div>
            <div className="bg-muted/20 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full transition-all ${
                  pSuccessPercentage >= 70 ? "bg-green" :
                  pSuccessPercentage >= 50 ? "bg-blue" :
                  pSuccessPercentage >= 30 ? "bg-amber-600" :
                  "bg-red"
                }`}
                style={{ width: `${pSuccessPercentage}%` }}
              />
            </div>
          </div>

          {highDifficultyWarning && (
            <Alert className="border-orange/30 bg-orange/5">
              <AlertTriangle className="h-4 w-4 text-orange" />
              <AlertDescription className="text-orange">
                <div className="font-medium mb-1">⚠️ Desafío Difícil</div>
                <p className="text-sm">
                  Este desafío es difícil para tu nivel actual (P_success ≤ 15%). Si decides intentarlo, el riesgo vale más la recompensa. 
                  Bonus por dificultad asumida: +50% de puntos.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue/5 p-4 rounded-[28px] border border-blue/20">
            <div className="text-sm text-muted/60 mb-2">Factores considerados:</div>
            <ul className="text-sm text-muted space-y-1">
              <li>• Historial de completación: 85%</li>
              <li>• Nivel actual: {currentConfig.name}</li>
              <li>• Capacidad efectiva: 72/100</li>
              <li>• Modo actual: Normal</li>
              <li>• Señales conductuales: Positivas</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Current Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green" />
            Nivel Actual: {currentConfig.name}
          </CardTitle>
          <CardDescription>{currentConfig.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-muted/5 rounded">
              <div className="text-xs text-muted/60">Presión</div>
              <div className="text-sm font-medium">{currentConfig.pressure}</div>
            </div>
            <div className="p-3 bg-muted/5 rounded">
              <div className="text-xs text-muted/60">Guía</div>
              <div className="text-sm font-medium">{currentConfig.guidance}</div>
            </div>
            <div className="p-3 bg-muted/5 rounded">
              <div className="text-xs text-muted/60">Feedback</div>
              <div className="text-sm font-medium">{currentConfig.feedbackFrequency}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Level */}
      {nextConfig && (
        <Card className="border-2 border-green/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green" />
              Próximo Nivel: {nextConfig.name}
            </CardTitle>
            <CardDescription>{nextConfig.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green/5 p-4 rounded-[28px] border border-green/20">
              <div className="font-medium text-sm mb-2">Requisitos para avanzar:</div>
              <p className="text-sm text-muted">
                {nextConfig.solidExecutions} ejecuciones sólidas sin abandono temprano ni señales fuertes de frustración
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-muted/5 rounded">
                <div className="text-xs text-muted/60">Presión</div>
                <div className="text-sm font-medium">{nextConfig.pressure}</div>
              </div>
              <div className="p-3 bg-muted/5 rounded">
                <div className="text-xs text-muted/60">Guía</div>
                <div className="text-sm font-medium">{nextConfig.guidance}</div>
              </div>
              <div className="p-3 bg-muted/5 rounded">
                <div className="text-xs text-muted/60">Feedback</div>
                <div className="text-sm font-medium">{nextConfig.feedbackFrequency}</div>
              </div>
            </div>

            {pSuccessPercentage >= 70 && (
              <Button className="w-full" size="lg" onClick={() => onLevelChange?.(currentLevel + 1)}>
                Avanzar al Nivel {nextConfig.level}
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Progression Philosophy */}
      <Card className="border-l-4 border-purple/50">
        <CardHeader>
          <CardTitle className="text-sm">Regla de Progresión A3</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted italic">
            "En A3 no se avanza por insistir. Se avanza por sostener."
          </p>
          <p className="text-xs text-muted/60 mt-2">
            Cantidad + Calidad + Estabilidad. No es solo completar, es completar consistentemente con desempeño.
          </p>
        </CardContent>
      </Card>

      {/* Frustration Protection */}
      <Alert className="border-red/30 bg-red/5">
        <AlertTriangle className="h-4 w-4 text-red" />
        <AlertDescription className="text-red">
          <div className="font-medium mb-1">Protección Contra Frustración</div>
          <p className="text-sm">
            Si detectamos desgaste emocional, el sistema sugerirá bajar dificultad o tomar un descanso. 
            Priorizamos tu sostenibilidad por encima de la intensidad.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
