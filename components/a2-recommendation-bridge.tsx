"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Zap, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

interface A1Result {
  score_energia: number
  score_enfoque: number
  score_relaciones: number
  score_plan_ejecutivo: number
}

interface A2Path {
  id: string
  pilar: string
  titulo: string
  descripcion: string
  duracion_dias: number
  temas: string[]
  nivel_requerido: string
}

interface A2RecommendationProps {
  a1Results: A1Result
  recommendations: Array<{
    path: A2Path
    reason: string
    priority: number
  }>
  onPathSelect?: (pathId: string) => void
}

const getPilarIcon = (pilar: string) => {
  const icons: Record<string, string> = {
    "energia": "⚡",
    "enfoque": "🎯",
    "relaciones": "🤝",
    "plan_ejecutivo": "📋",
  }
  return icons[pilar] || "🎯"
}

const getPilarColor = (pilar: string) => {
  const colors: Record<string, string> = {
    "energia": "bg-yellow/10 text-yellow",
    "enfoque": "bg-green/10 text-green",
    "relaciones": "bg-red/10 text-pink-900",
    "plan_ejecutivo": "bg-purple/10 text-purple",
  }
  return colors[pilar] || "bg-muted/10"
}

const getPriorityLabel = (score: number) => {
  if (score < 25) return "Crítico"
  if (score < 50) return "Importante"
  if (score < 75) return "Refuerzo"
  return "Avanzado"
}

export function A2RecommendationBridge({
  a1Results,
  recommendations,
  onPathSelect,
}: A2RecommendationProps) {
  const pillars = [
    { key: "energia", label: "Energía", score: a1Results.score_energia },
    { key: "enfoque", label: "Enfoque", score: a1Results.score_enfoque },
    { key: "relaciones", label: "Relaciones", score: a1Results.score_relaciones },
    { key: "plan_ejecutivo", label: "Plan Ejecutivo", score: a1Results.score_plan_ejecutivo },
  ]

  // Sort by priority: lowest scores first (needs most help)
  const sortedPillars = [...pillars].sort((a, b) => a.score - b.score)
  const weakestPillar = sortedPillars[0]
  const strongestPillar = sortedPillars[sortedPillars.length - 1]

  return (
    <div className="w-full space-y-6">
      {/* Header with A1 Summary */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Tu Ruta A2 Personalizada</h2>
          <p className="text-muted-foreground">
            Basado en tus resultados A1, hemos diseñado un camino de aprendizaje intermedio optimizado para ti.
          </p>
        </div>

        {/* A1 Results Summary */}
        <Card className="bg-background">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">Tu Diagnóstico A1</div>
              
              <div className="space-y-3">
                {sortedPillars.map((pillar) => (
                  <div key={pillar.key}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPilarIcon(pillar.key)}</span>
                        <span className="font-medium text-sm">{pillar.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{Math.round(pillar.score)}%</span>
                        <Badge className="text-xs" variant={
                          pillar.score < 25 ? "destructive" :
                          pillar.score < 50 ? "secondary" :
                          pillar.score < 75 ? "outline" :
                          "default"
                        }>
                          {getPriorityLabel(pillar.score)}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={pillar.score} className="h-2" />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Zap className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange" />
                  <div>
                    <strong>{weakestPillar.label}</strong> necesita atención inmediata. Te recomendamos comenzar por ahí.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Paths */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Rutas Recomendadas para Ti</h3>
        </div>

        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((rec, idx) => {
              const pillarData = sortedPillars.find(p => p.key === rec.path.pilar)
              const isPrimary = idx === 0

              return (
                <Card
                  key={rec.path.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isPrimary ? "border-2 border-purple bg-purple/5" : ""`}
                  }`}
                  onClick={() => onPathSelect?.(rec.path.id)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg ${getPilarColor(rec.path.pilar)} flex items-center justify-center text-xl`}>
                            {getPilarIcon(rec.path.pilar)}
                          </div>
                          <div>
                            <div className="font-bold">{rec.path.titulo}</div>
                            <div className="text-sm text-muted-foreground">
                              {rec.path.descripcion}
                            </div>
                          </div>
                          {isPrimary && (
                            <Badge className="ml-auto flex-shrink-0">Recomendado</Badge>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-1">
                            {rec.reason}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {rec.path.duracion_dias} días
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.path.temas.length} temas
                          </Badge>
                          {pillarData && (
                            <Badge variant="outline" className="text-xs">
                              Tu score: {Math.round(pillarData.score)}%
                            </Badge>
                          )}
                        </div>

                        {/* Key Topics */}
                        {rec.path.temas.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {rec.path.temas.slice(0, 3).map((tema, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tema}
                              </Badge>
                            ))}
                            {rec.path.temas.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{rec.path.temas.length - 3} más
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        variant={isPrimary ? "default" : "outline"}
                        className="flex-shrink-0"
                        asChild
                      >
                        <Link href={`/despega/a2-rutas/${rec.path.id}`}>
                          <ArrowRight className="w-4 h-4 ml-1" />
                          {isPrimary ? "Comenzar" : "Ver"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Cargando recomendaciones personalizadas...
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tips */}
      <Card className="bg-green/5 border-green/20">
        <CardContent className="pt-6 flex gap-3">
          <TrendingUp className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-green mb-1">Consejos para Máximo Aprendizaje</div>
            <div className="text-sm text-green space-y-1">
              <div>• Comienza con tu área más débil para máximo impacto</div>
              <div>• Completa todas las lecciones de cada ruta</div>
              <div>• Las A2 rutas preparan para los escenarios A3</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
