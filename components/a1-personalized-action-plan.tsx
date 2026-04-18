"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, TrendingUp, Zap, Target } from "lucide-react"

interface A1Results {
  score_energia: number
  score_enfoque: number
  score_relaciones: number
  score_plan_ejecutivo: number
}

interface PersonalizedActionPlanProps {
  results: A1Results
  onStartPillar: (pilar: string) => void
}

export function PersonalizedActionPlan({ results, onStartPillar }: PersonalizedActionPlanProps) {
  const pilares = [
    {
      id: "energia",
      name: "Energía",
      score: results.score_energia,
      icon: "⚡",
      color: "bg-blue/50",
      lightColor: "bg-blue/10",
      textColor: "text-blue",
      description: "Gestión de sueño, vitalidad y consistencia",
      recommendations: results.score_energia < 50
        ? ["Establecer hora de dormir fija", "Ejercicio matutino de 15 min", "Hidratación consciente"]
        : results.score_energia < 70
        ? ["Mejorar consistencia de rutina", "Añadir actividad física regular", "Revisar hábitos nocturnos"]
        : ["Mantener rutinas establecidas", "Explorar optimización avanzada"],
    },
    {
      id: "enfoque",
      name: "Enfoque",
      score: results.score_enfoque,
      icon: "🎯",
      color: "bg-green/50",
      lightColor: "bg-green/10",
      textColor: "text-green",
      description: "Concentración, productividad y priorización",
      recommendations: results.score_enfoque < 50
        ? ["Técnica Pomodoro básica", "Desactivar notificaciones", "Definir 3 tareas diarias"]
        : results.score_enfoque < 70
        ? ["Bloques de tiempo más largos", "Sistema de priorización avanzado", "Eliminar tareas no esenciales"]
        : ["Sistema de deep work", "Optimización de productividad"],
    },
    {
      id: "relaciones",
      name: "Relaciones",
      score: results.score_relaciones,
      icon: "🤝",
      color: "bg-orange/50",
      lightColor: "bg-orange/10",
      textColor: "text-orange",
      description: "Comunicación, vínculos y networking",
      recommendations: results.score_relaciones < 50
        ? ["Contactar a 1 persona importante semanal", "Practicar escucha activa", "Expresar gratitud regularmente"]
        : results.score_relaciones < 70
        ? ["Expandir red de contactos", "Mejorar comunicación efectiva", "Pedir feedback regularmente"]
        : ["Mentoría y liderazgo", "Networking estratégico"],
    },
    {
      id: "plan_ejecutivo",
      name: "Plan Ejecutivo",
      score: results.score_plan_ejecutivo,
      icon: "📋",
      color: "bg-purple/50",
      lightColor: "bg-purple/10",
      textColor: "text-purple",
      description: "Ejecución, prioridades y toma de decisiones",
      recommendations: results.score_plan_ejecutivo < 50
        ? ["Definir metas trimestrales claras", "Crear ritual matutino de 15-30 min", "Revisar y ajustar semanalmente"]
        : results.score_plan_ejecutivo < 70
        ? ["Sistema OKR trimestral", "Ritual matutino optimizado", "Review semanal estructurado"]
        : ["Ejecución a nivel estratégico", "Toma de decisiones ágil"],
    },
  ]

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: "Avanzado", color: "text-green" }
    if (score >= 60) return { label: "Intermedio", color: "text-blue" }
    return { label: "Fundamental", color: "text-orange" }
  }

  const getPriorityOrder = () => {
    return [...pilares].sort((a, b) => a.score - b.score)
  }

  return (
    <div className="w-full space-y-8">
      {/* Overview Card */}
      <Card className="border-2 border-purple">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Mapa Inicial de Tus Patrones
          </CardTitle>
          <CardDescription>
            Basado en tu check-in A1, aquí está una vista de tus 4 áreas de enfoque
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Priority Order */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Orden de Prioridad Recomendado</h3>
        <div className="grid gap-3">
          {getPriorityOrder().map((pilar, index) => (
            <Card key={pilar.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${pilar.lightColor} flex items-center justify-center text-lg font-bold`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{pilar.name}</div>
                      <div className="text-sm text-muted-foreground">{pilar.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{pilar.score}%</div>
                    <Badge className={`${getScoreLevel(pilar.score).color} bg-transparent border`}>
                      {getScoreLevel(pilar.score).label}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Pillars */}
      <div>
        <h3 className="text-sm font-semibold mb-4">Detalle de Cada Pilar</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {pilares.map((pilar) => {
            const scoreLevel = getScoreLevel(pilar.score)
            const priority = getPriorityOrder().findIndex(p => p.id === pilar.id) + 1

            return (
              <Card key={pilar.id}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{pilar.icon}</span>
                      <CardTitle className="text-lg">{pilar.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className={pilar.lightColor}>
                      #{priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Score */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Puntuación</span>
                      <span className={`font-bold ${scoreLevel.color}`}>{pilar.score}%</span>
                    </div>
                    <Progress value={pilar.score} className="h-2" />
                    <Badge className="mt-2 text-xs">{scoreLevel.label}</Badge>
                  </div>

                  {/* Status Alert */}
                  {pilar.score < 50 && (
                    <div className="bg-orange/5 border border-orange/20 rounded-[28px] p-3 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-orange">
                        Esta área tiene la mayor fricción. Podrías empezar aquí si quieres explorar.
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <div className="text-sm font-medium mb-2">Palancas del Sistema (Explora si te interesa)</div>
                    <ul className="space-y-2">
                      {pilar.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-purple">○</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => onStartPillar(pilar.id)}
                    className="w-full mt-4"
                    variant={priority === 1 ? "default" : "outline"}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Explorar {pilar.name}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Next Steps */}
      <Card className="bg-blue/5 border-blue/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Próximos Pasos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>1. Selecciona un área y accede a las 5 misiones del ciclo 30 (sin presión de orden)</p>
          <p>2. Explora, prueba, observa qué se siente diferente</p>
          <p>3. Al finalizar, vuelves a hacer el check-in para notar cambios</p>
          <p>4. Sofia/Dani estarán disponibles para explicar patrones en cada paso</p>
        </CardContent>
      </Card>
    </div>
  )
}
