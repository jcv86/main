'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Clock, Zap, Target, Award } from 'lucide-react'

interface ProgressData {
  totalMinutes: number
  totalSessions: number
  completionPercentage: number
  sectionProgress: {
    name: string
    minutes: number
    sessions: number
    percentage: number
    color: string
  }[]
  currentLevel: number
  xpPoints: number
  xpToNextLevel: number
  badges: string[]
  streak: number
}

export default function A3ProgressDashboard() {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/a3/progress')
        if (!response.ok) throw new Error('Failed to fetch progress')
        const data = await response.json()
        setProgress(data)
      } catch (error) {
        console.error('[v0] Error fetching progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-24" />
          </Card>
        ))}
      </div>
    )
  }

  if (!progress) {
    return null
  }

  return (
    <div className="space-y-8 mb-12">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-training/30 bg-gradient-to-br from-training/10 to-training/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-white/70">Tiempo Total</p>
                <p className="text-3xl font-bold text-training">{progress.totalMinutes}</p>
                <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                  {Math.floor(progress.totalMinutes / 60)}h {progress.totalMinutes % 60}m
                </p>
              </div>
              <Clock className="w-10 h-10 text-training/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple/30 bg-gradient-to-br from-purple/10 to-purple/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-white/70">Sesiones</p>
                <p className="text-3xl font-bold text-purple">{progress.totalSessions}</p>
                <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                  entrenamientos completados
                </p>
              </div>
              <Target className="w-10 h-10 text-purple/40" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-white/70">Progreso</p>
                <p className="text-3xl font-bold text-emerald-500">{progress.completionPercentage}%</p>
                <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                  del programa completado
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                {progress.streak} racha 🔥
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-white/70">Nivel</p>
                <p className="text-3xl font-bold text-amber-500">{progress.currentLevel}</p>
                <p className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                  {progress.xpToNextLevel} XP para siguiente
                </p>
              </div>
              <Zap className="w-10 h-10 text-amber-500/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Progress */}
      <Card className="border-muted/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-training" />
            Progreso por Sección
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {progress.sectionProgress.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{section.name}</p>
                  <p className="text-xs text-muted-foreground dark:text-white/60">
                    {section.sessions} sesiones • {section.minutes}m
                  </p>
                </div>
                <Badge variant="outline">{section.percentage}%</Badge>
              </div>
              <Progress value={section.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Badges Section */}
      {progress.badges.length > 0 && (
        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-amber-500/2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Badges Desbloqueados ({progress.badges.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {progress.badges.map((badge, idx) => (
                <Badge key={idx} className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-sm py-2 px-3">
                  {badge}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
