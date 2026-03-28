"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useCalibration } from "@/components/calibration-provider"
import { useCoachStrategicContext } from "@/components/coach-strategic-provider"
import { Brain, TrendingUp, Zap, Target, Activity, Volume2 } from "lucide-react"

export function A4CalibrationDashboard() {
  const calibration = useCalibration()
  const strategic = useCoachStrategicContext()

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-blue-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-purple-500"
      case "expert":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Strategic Score */}
      <Card className="border-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Sistema Calibrado</CardTitle>
              <p className="text-sm text-slate-400 mt-2">Tu experiencia se adapta dinámicamente a tu nivel estratégico</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{strategic.a4_current_score}</div>
              <div className="text-sm text-slate-400">/100</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Progreso Estratégico</span>
                <span className="text-xs text-slate-400">{strategic.a4_score_level}</span>
              </div>
              <Progress value={strategic.a4_current_score} className="h-2" />
            </div>
            <div className="flex gap-3 pt-2">
              <Badge variant="secondary">{strategic.a4_score_trend}</Badge>
              <Badge variant="secondary">{strategic.a4_score_level}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calibration Impact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* A1 Calibration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">A1: Ritual de Entrada</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nivel de Lenguaje</p>
              <Badge>{calibration.a1_language_level}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Profundidad de Explicaciones</p>
              <Progress value={(calibration.a1_explanation_depth / 10) * 100} />
              <p className="text-xs text-muted-foreground mt-1">{calibration.a1_explanation_depth}/10</p>
            </div>
          </CardContent>
        </Card>

        {/* A2 Calibration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-lg">A2: Misiones</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Dificultad</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-6 rounded ${
                      i < calibration.a2_mission_difficulty ? "bg-yellow-500" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{calibration.a2_mission_difficulty}/5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Complejidad</p>
              <span className="text-sm font-medium">{calibration.a2_mission_complexity}/5</span>
            </div>
          </CardContent>
        </Card>

        {/* A3 Calibration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-lg">A3: Entrenamientos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Nivel de Ambigüedad</p>
              <Progress value={calibration.a3_ambiguity_level} />
              <p className="text-xs text-muted-foreground mt-1">{calibration.a3_ambiguity_level}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Intensidad de Desafío</p>
              <span className="text-sm font-medium">{calibration.a3_challenge_intensity}/5</span>
            </div>
          </CardContent>
        </Card>

        {/* Coach Calibration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-500" />
              <CardTitle className="text-lg">Coach Estratégico</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Nivel de Exigencia</p>
              <Progress value={calibration.coach_demand_level} />
              <p className="text-xs text-muted-foreground mt-1">{calibration.coach_demand_level}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estilo</p>
              <Badge variant="outline">{calibration.coach_directiveness}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Integration Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            <CardTitle>Integración Sistémica</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Tu puntaje estratégico (A4) calibra automáticamente toda tu experiencia:
            </p>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-blue-500">•</span>
                <span>
                  <strong>A1</strong> explica conceptos con nivel {calibration.a1_language_level} (profundidad {calibration.a1_explanation_depth}/10)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-500">•</span>
                <span>
                  <strong>A2</strong> genera misiones de dificultad {calibration.a2_mission_difficulty}/5
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-500">•</span>
                <span>
                  <strong>A3</strong> simula con {calibration.a3_ambiguity_level}% de ambigüedad
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">•</span>
                <span>
                  <strong>Coach</strong> exige {calibration.coach_demand_level}% ({calibration.coach_directiveness})
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
