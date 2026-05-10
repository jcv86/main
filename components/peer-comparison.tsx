"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, BarChart3 } from "lucide-react"

interface ComparisonData {
  percentile: number
  comparison: string
  totalParticipants: number
  message: string
  benchmarks: {
    p25: number
    p50: number
    p75: number
    p90: number
  }
}

export function PeerComparison({
  testType,
  score,
  industry = "technology",
  experienceLevel = "entry",
}: {
  testType: string
  score: number
  industry?: string
  experienceLevel?: string
}) {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComparison()
  }, [testType, score])

  const fetchComparison = async () => {
    try {
      const response = await fetch(
        `/api/peer-comparison?testType=${testType}&score=${score}&industry=${industry}&experienceLevel=${experienceLevel}`,
      )
      const data = await response.json()
      setComparisonData(data)
    } catch (error) {
      console.error("Error fetching peer comparison:", error)
    } finally {
      setLoading(false)
    }
  }

  const getComparisonColor = (comparison: string) => {
    switch (comparison) {
      case "excellent":
        return "bg-green/10 text-green"
      case "above_average":
        return "bg-blue/10 text-blue"
      case "average":
        return "bg-yellow/10 text-yellow"
      case "below_average":
        return "bg-orange/10 text-orange"
      case "needs_improvement":
        return "bg-red/10 text-red"
      default:
        return "bg-muted/10 text-gray-800"
    }
  }

  if (loading) {
    return <div className="text-center py-4">Cargando comparación...</div>
  }

  if (!comparisonData) {
    return null
  }

  return (
    <Card className="border-purple/20 bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple" />
          Comparación con Pares
        </CardTitle>
        <CardDescription>Cómo te comparas con otros profesionales en tu industria</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-purple mb-2">Top {100 - comparisonData.percentile}%</div>
          <Badge className={getComparisonColor(comparisonData.comparison)}>{comparisonData.message}</Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Basado en {comparisonData.totalParticipants.toLocaleString()} participantes
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tu puntuación</span>
            <span className="font-bold text-purple">{score}</span>
          </div>
          <Progress value={comparisonData.percentile} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-[28px] border">
            <div className="text-2xl font-bold text-foreground">{comparisonData.benchmarks.p50}</div>
            <div className="text-xs text-muted-foreground">Promedio (P50)</div>
          </div>
          <div className="text-center p-3 bg-white rounded-[28px] border">
            <div className="text-2xl font-bold text-foreground">{comparisonData.benchmarks.p75}</div>
            <div className="text-xs text-muted-foreground">Top 25% (P75)</div>
          </div>
          <div className="text-center p-3 bg-white rounded-[28px] border">
            <div className="text-2xl font-bold text-foreground">{comparisonData.benchmarks.p90}</div>
            <div className="text-xs text-muted-foreground">Top 10% (P90)</div>
          </div>
          <div className="text-center p-3 bg-purple/10 rounded-[28px] border border-purple/20">
            <div className="text-2xl font-bold text-purple">{score}</div>
            <div className="text-xs text-purple font-medium">Tu Resultado</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-blue/5 p-3 rounded-lg">
          <BarChart3 className="h-4 w-4 text-blue" />
          <span>Los datos se actualizan mensualmente con nuevos participantes</span>
        </div>
      </CardContent>
    </Card>
  )
}
