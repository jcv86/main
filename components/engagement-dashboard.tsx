"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Trophy, TrendingUp, Zap, Target, Award } from "lucide-react"
import { getUserPoints, getUserEngagementMetrics } from "@/lib/supabase/a4-queries"
import { useSession } from "next-auth/react"

export function EngagementDashboard() {
  const { data: session } = useSession()
  const [points, setPoints] = useState(0)
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return
    loadData()
  }, [session?.user?.id])

  const loadData = async () => {
    if (!session?.user?.id) return

    try {
      const [pointsData, metricsData] = await Promise.all([
        getUserPoints(session.user.id),
        getUserEngagementMetrics(session.user.id),
      ])

      setPoints(pointsData)
      setMetrics(metricsData)
    } catch (error) {
      console.error("[v0] Error loading engagement data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardContent className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Points Summary */}
      <Card className="border-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/10 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Puntos Totales</p>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-primary">{points}</div>
                <span className="text-xs text-muted-foreground">puntos</span>
              </div>
            </div>
            <div className="p-4 bg-yellow-500/20 rounded-lg">
              <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Articles Read */}
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Artículos Leídos</p>
                      <p className="text-2xl font-bold">{metrics.articles_read || 0}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+{(metrics.articles_read || 0) * 1} pts</Badge>
                </div>

                {/* Reading Streak */}
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">Racha: {metrics.reading_streak || 0} días</p>
                  <Progress value={Math.min((metrics.reading_streak || 0) * 10, 100)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles Shared */}
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Activity className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Compartidos</p>
                      <p className="text-2xl font-bold">{metrics.articles_shared || 0}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+{(metrics.articles_shared || 0) * 2} pts</Badge>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Impacto Social: {metrics.social_reach || 0} personas
                  </p>
                  <Progress value={Math.min((metrics.social_reach || 0) / 10, 100)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tests Completed */}
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pruebas Completadas</p>
                      <p className="text-2xl font-bold">{metrics.tests_completed || 0}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+{(metrics.tests_completed || 0) * 5} pts</Badge>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Promedio: {(metrics.average_test_score || 0).toFixed(0)}%
                  </p>
                  <Progress value={metrics.average_test_score || 0} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Saved */}
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Recursos Guardados</p>
                      <p className="text-2xl font-bold">{metrics.resources_saved || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Librerías: {metrics.libraries_accessed || 0}
                  </p>
                  <Progress value={Math.min((metrics.libraries_accessed || 0) * 20, 100)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weekly Summary */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">Esta Semana</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Lunes</p>
              <p className="text-lg font-bold">+5</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Martes</p>
              <p className="text-lg font-bold">+8</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/50">
              <p className="text-xs text-muted-foreground mb-1">Hoy</p>
              <p className="text-lg font-bold">+12</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Promedio diario: {metrics ? ((points / 7).toFixed(0) + " pts") : "—"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
