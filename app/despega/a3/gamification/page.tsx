'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { GamificationProfile } from '@/components/gamification-profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface GamificationSummary {
  totalXp: number
  currentLevel: number
  levelLabel: string
  xpToNextLevel: number
  dailyStreak: number
  bestStreak: number
  totalPoints: number
  totalTipsEarned: number
  badges: string[]
  training: {
    completed: number
    total: number
    progress: number
    interviewsCompleted: number
  }
  radar: {
    completed: number
    total: number
    progress: number
  }
}

export default function GamificationPage() {
  const { user, loading: authLoading } = useAuthRedirect()
  const [summary, setSummary] = useState<GamificationSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/gamification/profile')
        const data = await response.json()

        if (response.ok && data.summary) {
          setSummary(data.summary)
        }
      } catch (error) {
        console.error('[v0] Error fetching gamification profile:', error)
      } finally {
        setLoading(false)
      }
    }

    void fetchProfile()
  }, [user?.id])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-training/50" />
      </div>
    )
  }

  if (!summary) {
    return (
      <main className="min-h-screen bg-muted/5 py-12">
        <Card className="max-w-xl mx-auto p-8 text-center">
          <p className="text-muted-foreground">
            No fue posible cargar tu progreso en este momento.
          </p>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/5 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-training">Mi progreso</h1>
            <p className="text-muted-foreground mt-2">
              Métricas calculadas desde evidencia persistida por el servidor.
            </p>
          </div>
          <Link href="/despega/a3/dtc-shop">
            <Button variant="outline">Ver puntos DTC: {summary.totalPoints}</Button>
          </Link>
        </div>

        <GamificationProfile
          userId={user?.id || ''}
          level={summary.levelLabel}
          currentXp={summary.totalXp % 1000}
          totalXp={summary.totalXp}
          streak={summary.dailyStreak}
          bestStreak={summary.bestStreak}
          interviewsCompleted={summary.training.interviewsCompleted}
          badges={summary.badges}
          totalTipsEarned={summary.totalTipsEarned}
        />

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Entrenamiento A3</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                Módulos completados: <strong>{summary.training.completed}/{summary.training.total}</strong>
              </p>
              <p>Avance persistido: <strong>{summary.training.progress}%</strong></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Radar A4</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                Registros completados: <strong>{summary.radar.completed}/{summary.radar.total}</strong>
              </p>
              <p>Avance persistido: <strong>{summary.radar.progress}%</strong></p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Integridad del progreso</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              El navegador no puede asignar XP, alterar saldos ni declarar compras. Los
              cambios se originan únicamente en acciones validadas por el servidor.
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
