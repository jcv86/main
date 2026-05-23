"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, TrendingDown, Target, Award, BarChart3, AlertCircle, Zap } from "lucide-react"
import { calculateSkillGaps, getUserPercentile } from "@/lib/learning-path-engine"

interface SkillGap {
  skill_name: string
  current_level: number
  target_level: number
  gap_size: number
  priority_score: number
}

interface SkillGapAnalysisProps {
  userEmail: string
}

export function SkillGapAnalysis({ userEmail }: SkillGapAnalysisProps) {
  const [gaps, setGaps] = useState<SkillGap[]>([])
  const [loading, setLoading] = useState(true)
  const [percentiles, setPercentiles] = useState<Record<string, number>>({})

  useEffect(() => {
    loadSkillGaps()
  }, [userEmail])

  async function loadSkillGaps() {
    setLoading(true)
    try {
      const data = await calculateSkillGaps(userEmail)
      setGaps(data)

      // Load percentiles for each skill
      const percentileData: Record<string, number> = {}
      for (const gap of data) {
        const percentile = await getUserPercentile(
          gap.skill_name,
          gap.current_level,
          "Tecnología", // Could be dynamic based on user profile
          "Mid-Level",
        )
        if (percentile) {
          percentileData[gap.skill_name] = percentile
        }
      }
      setPercentiles(percentileData)
    } catch (error) {
      console.error("Error loading skill gaps:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (score: number) => {
    if (score >= 8) return "text-red bg-red/10"
    if (score >= 5) return "text-orange bg-orange/10"
    if (score >= 3) return "text-yellow bg-yellow/10"
    return "text-green bg-green/10"
  }

  const getPriorityLabel = (score: number) => {
    if (score >= 8) return "Crítica"
    if (score >= 5) return "Alta"
    if (score >= 3) return "Media"
    return "Baja"
  }

  const getPercentileMessage = (percentile: number) => {
    if (percentile >= 75) return { message: "¡Excelente! Estás en el top 25%", color: "text-green", icon: Award }
    if (percentile >= 50) return { message: "Por encima del promedio", color: "text-blue", icon: TrendingUp }
    return { message: "Oportunidad de mejora", color: "text-orange", icon: TrendingDown }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análisis de Brechas de Habilidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted/10 animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (gaps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Análisis de Brechas de Habilidades
          </CardTitle>
          <CardDescription>Identifica y prioriza las habilidades que necesitas desarrollar</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No tienes evaluaciones de habilidades registradas. Completa tus tests para obtener un análisis
              personalizado.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Análisis de Brechas de Habilidades
        </CardTitle>
        <CardDescription>Basado en el método de BetterUp para desarrollo profesional</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-background">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple">{gaps.length}</p>
            <p className="text-xs text-muted-foreground">Brechas Identificadas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange">{gaps.filter((g) => g.priority_score >= 5).length}</p>
            <p className="text-xs text-muted-foreground">Prioridad Alta</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green">{Object.keys(percentiles).length}</p>
            <p className="text-xs text-muted-foreground">Con Benchmark</p>
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="space-y-4">
          {gaps.map((gap, index) => {
            const percentile = percentiles[gap.skill_name]
            const percentileInfo = percentile ? getPercentileMessage(percentile) : null
            const PercentileIcon = percentileInfo?.icon

            return (
              <div key={index} className="p-4 border rounded-lg space-y-3 hover:border-purple/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{gap.skill_name}</h4>
                      <Badge className={getPriorityColor(gap.priority_score)}>
                        {getPriorityLabel(gap.priority_score)}
                      </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Nivel actual: {gap.current_level}/10</span>
                        <span className="text-muted-foreground">Objetivo: {gap.target_level}/10</span>
                      </div>
                      <div className="relative">
                        <Progress value={(gap.current_level / 10) * 100} className="h-3" />
                        <div
                          className="absolute top-0 h-3 border-r-2 border-dashed border-blue/50"
                          style={{ left: `${(gap.target_level / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Percentile Info */}
                    {percentileInfo && PercentileIcon && (
                      <div className={`flex items-center gap-2 mt-2 text-sm ${percentileInfo.color}`}>
                        <PercentileIcon className="h-4 w-4" />
                        <span>
                          {percentileInfo.message} (percentil {percentile})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Gap Size Badge */}
                  <div className="text-center ml-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-[20px] bg-purple/10">
                      <span className="text-xl font-bold text-purple">{gap.gap_size}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">brecha</p>
                  </div>
                </div>

                {/* Action Button */}
                <Button size="sm" variant="outline" className="w-full bg-transparent">
                  <Target className="h-3 w-3 mr-2" />
                  Ver Plan de Desarrollo
                </Button>
              </div>
            )
          })}
        </div>

        {/* Action CTA */}
        <Alert className="bg-background">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2"> Recomendación del Sistema</p>
            <p className="text-sm">
              Enfócate primero en las brechas de prioridad alta. El sistema te recomienda rutas de aprendizaje
              personalizadas para cada habilidad.
            </p>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
