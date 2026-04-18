"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Trophy, TrendingUp, Zap, Target, Award } from "lucide-react"

export function EngagementDashboard() {
  // Placeholder metrics data
  const points = 2450
  const metrics = {
    articles_read: 24,
    articles_shared: 8,
    tests_completed: 5,
    average_test_score: 78,
    resources_saved: 12,
    reading_streak: 7,
    social_reach: 40,
    libraries_accessed: 3,
  }

  return (
    <div className="space-y-4">
      {/* Points Card */}
      <Card className="border-0 bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Puntos Totales</p>
              <div className="text-4xl font-bold">{points}</div>
            </div>
            <Zap className="w-12 h-12 text-primary opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Artículos Leídos</p>
                <p className="text-2xl font-bold mt-1">{metrics.articles_read}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pruebas</p>
                <p className="text-2xl font-bold mt-1">{metrics.tests_completed}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Guardados</p>
                <p className="text-2xl font-bold mt-1">{metrics.resources_saved}</p>
              </div>
              <Award className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Racha</p>
                <p className="text-2xl font-bold mt-1">{metrics.reading_streak}d</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Tu Desempeño</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Nota Promedio en Tests</span>
              <Badge variant="outline">{metrics.average_test_score}%</Badge>
            </div>
            <Progress value={metrics.average_test_score} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Participación</span>
              <Badge variant="outline">{Math.round((metrics.articles_read + metrics.tests_completed) / 2)} actividades</Badge>
            </div>
            <Progress value={Math.min((metrics.articles_read + metrics.tests_completed) * 2, 100)} />
          </div>

          <div className="p-3 bg-primary/5 rounded-[28px] border border-primary/20 mt-4">
            <p className="text-sm text-muted-foreground">
              Vas muy bien. Mantén tu racha de {metrics.reading_streak} días para desbloquear el badge "Aprendiz Comprometido".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
