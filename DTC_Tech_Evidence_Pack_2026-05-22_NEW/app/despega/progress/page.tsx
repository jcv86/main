'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Trophy, Zap, Award } from 'lucide-react'

interface GlobalGamificationData {
  total_xp: number
  current_level: number
  xp_to_next_level: number
  daily_streak: number
  badges: string[]
  sections: Record<string, any>
  breakdown: {
    a3_xp: number
    a4_xp: number
    interview_bonus: number
  }
}

export default function ProgressPage() {
  const [data, setData] = useState<GlobalGamificationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch('/api/gamification/global')
        if (response.ok) {
          const gamificationData = await response.json()
          setData(gamificationData)
        }
      } catch (error) {
        console.error('[v0] Error loading progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Cargando progreso...</div>
  }

  if (!data) {
    return <div className="h-screen flex items-center justify-center">Sin datos disponibles</div>
  }

  const levelNames = ['Novato', 'Aprendiz', 'Competente', 'Experto', 'Maestro', 'Leyenda']
  const levelName = levelNames[Math.min(data.current_level - 1, levelNames.length - 1)]
  const xpPercentage = (data.total_xp % 1000) / 10

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container max-w-5xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Mi Progreso Global</h1>
          <p className="text-white/70">
            Resumen consolidado de tu desempeño en todas las secciones
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Level and XP Card */}
          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-background">
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Nivel Actual</p>
                    <p className="text-4xl font-bold text-white">{levelName}</p>
                    <p className="text-sm text-amber-400/80 mt-1">Nivel {data.current_level}</p>
                  </div>
                  <Zap className="w-12 h-12 text-amber-400 opacity-60" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">XP Total</span>
                    <span className="font-bold text-white">{data.total_xp.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {data.xp_to_next_level} XP para siguiente nivel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-background">
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Racha Actual</p>
                    <p className="text-4xl font-bold text-emerald-500">{data.daily_streak}</p>
                    <p className="text-sm text-emerald-400/80 mt-1">días consecutivos</p>
                  </div>
                  <Flame className="w-12 h-12 text-emerald-500 opacity-60" />
                </div>

                <div className="pt-2 border-t border-emerald-500/20 text-center">
                  <p className="text-xs text-white/70">
                    {data.daily_streak >= 30
                      ? '¡Increíble! Leyenda confirmado 🏆'
                      : data.daily_streak >= 7
                      ? '¡Muy bien! Mantén la constancia'
                      : 'Inicia tu racha hoy'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Performance */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Desempeño por Sección</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {data.sections?.a3 && (
              <Card className="border-training/30 bg-training/5">
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm text-training uppercase tracking-wider font-semibold mb-3">
                    {data.sections.a3.name}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">XP Ganado</span>
                      <span className="font-bold text-training">{data.sections.a3.xp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Sesiones</span>
                      <span className="font-bold text-white">{data.sections.a3.sessions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Minutos</span>
                      <span className="font-bold text-white">{data.sections.a3.minutes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Progreso</span>
                      <span className="font-bold text-amber-400">{data.sections.a3.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {data.sections?.a4 && (
              <Card className="border-purple/30 bg-purple/5">
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm text-purple uppercase tracking-wider font-semibold mb-3">
                    {data.sections.a4.name}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">XP Ganado</span>
                      <span className="font-bold text-purple">{data.sections.a4.xp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Módulos</span>
                      <span className="font-bold text-white">
                        {data.sections.a4.completed}/{data.sections.a4.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Progreso</span>
                      <span className="font-bold text-amber-400">{data.sections.a4.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* XP Breakdown */}
        <Card className="border-muted/30 bg-muted/5">
          <CardContent className="pt-6 pb-6">
            <h3 className="text-lg font-bold text-white mb-6">Desglose Total de XP</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-white/70 text-sm uppercase tracking-wider mb-2">A3 Entrenamiento</p>
                <p className="text-3xl font-bold text-training">{data.breakdown?.a3_xp || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm uppercase tracking-wider mb-2">A4 Módulos</p>
                <p className="text-3xl font-bold text-purple">{data.breakdown?.a4_xp || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm uppercase tracking-wider mb-2">Bonus Entrevistas</p>
                <p className="text-3xl font-bold text-emerald-500">{data.breakdown?.interview_bonus || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        {data.badges && data.badges.length > 0 && (
          <Card className="border-purple/30 bg-purple/5">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple" />
                Logros Desbloqueados
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {data.badges.map((badge, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/40 text-center">
                    <p className="text-white font-semibold">{badge}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

