"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface ProgressStats {
  current_streak: number
  total_points: number
  total_books_completed: number
  books_in_progress: string[]
}

interface Achievement {
  id: string
  achievement_type: string
  earned_at: string
}

export function ProgressWidget() {
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch("/api/betterme/progress")
        const data = await response.json()
        if (data.stats) {
          setStats(data.stats)
          setAchievements(data.achievements)
        }
      } catch (error) {
        console.error("[v0] Error fetching progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const streakBadgeColor = stats.current_streak >= 30 ? "bg-yellow-500" : stats.current_streak >= 7 ? "bg-orange-500" : "bg-blue-500"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.current_streak}</div>
          <p className="text-xs text-muted-foreground mt-1">días consecutivos</p>
          {stats.current_streak > 0 && (
            <Badge className={`mt-3 ${streakBadgeColor}`}>🔥 Activo</Badge>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Puntos Totales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total_points}</div>
          <p className="text-xs text-muted-foreground mt-1">puntos acumulados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Libros Completados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total_books_completed}</div>
          <p className="text-xs text-muted-foreground mt-1">de 64 libros</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Logros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{achievements.length}</div>
          <p className="text-xs text-muted-foreground mt-1">badges desbloqueados</p>
        </CardContent>
      </Card>
    </div>
  )
}
