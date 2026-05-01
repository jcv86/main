'use client'

import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Flame, Trophy, Zap, Award, User, LogOut, Settings, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function ProfileDashboard() {
  const { user } = useAuthRedirect()
  const router = useRouter()
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

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/auth/signin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
          <p className="text-muted-foreground">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  const levelNames = ['Novato', 'Aprendiz', 'Competente', 'Experto', 'Maestro', 'Leyenda']
  const levelName = levelNames[Math.min(data?.current_level ? data.current_level - 1 : 0, levelNames.length - 1)]
  const xpPercentage = data ? (data.total_xp % 1000) / 10 : 0

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="container max-w-5xl mx-auto px-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue/40 to-purple/40 border border-white/20 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              Mi Perfil
            </h1>
            <p className="text-white/70">Tu resumen de progreso y logros</p>
          </div>
          <Link href="/despega/settings">
            <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
              <Settings className="w-4 h-4" />
              Preferencias
            </Button>
          </Link>
        </div>

        {/* User Info Card */}
        <Card className="border-white/10 bg-white/5">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Nombre</p>
                  <p className="text-2xl font-bold text-white">
                    {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-1">Email</p>
                  <p className="text-white/80">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Level and XP Card */}
          <Card className="border-purple/30 bg-gradient-to-br from-purple/10 to-background">
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Nivel Actual</p>
                    <p className="text-4xl font-bold text-white">{levelName}</p>
                    <p className="text-sm text-purple/80 mt-1">Nivel {data?.current_level || 0}</p>
                  </div>
                  <Zap className="w-12 h-12 text-purple/60" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">XP Total</span>
                    <span className="font-bold text-white">{data?.total_xp.toLocaleString() || 0}</span>
                  </div>
                  <div className="w-full bg-muted/40 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple to-purple/60 h-3 rounded-full transition-all"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {data?.xp_to_next_level || 0} XP para siguiente nivel
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Card */}
          <Card className="border-orange/30 bg-gradient-to-br from-orange/10 to-background">
            <CardContent className="pt-6 pb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Racha Actual</p>
                    <p className="text-4xl font-bold text-orange/80">{data?.daily_streak || 0}</p>
                    <p className="text-sm text-orange/60 mt-1">días consecutivos</p>
                  </div>
                  <Flame className="w-12 h-12 text-orange/60" />
                </div>

                <div className="pt-2 border-t border-orange/20 text-center">
                  <p className="text-xs text-white/70">
                    {data && data.daily_streak >= 30
                      ? 'Increíble! Leyenda confirmado'
                      : data && data.daily_streak >= 7
                      ? 'Muy bien! Mantén la constancia'
                      : 'Inicia tu racha hoy'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section Performance */}
        {data?.sections && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Desempeño por Sección</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.sections?.a3 && (
                <Card className="border-orange/30 bg-orange/5 hover:border-orange/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <p className="text-sm text-orange uppercase tracking-wider font-semibold mb-3">
                      {data.sections.a3.name}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">XP Ganado</span>
                        <span className="font-bold text-orange">{data.sections.a3.xp}</span>
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
                        <span className="font-bold text-orange/80">{data.sections.a3.progress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {data.sections?.a4 && (
                <Card className="border-red/30 bg-red/5 hover:border-red/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <p className="text-sm text-red uppercase tracking-wider font-semibold mb-3">
                      {data.sections.a4.name}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">XP Ganado</span>
                        <span className="font-bold text-red">{data.sections.a4.xp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Módulos</span>
                        <span className="font-bold text-white">
                          {data.sections.a4.completed}/{data.sections.a4.total}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Progreso</span>
                        <span className="font-bold text-red/80">{data.sections.a4.progress}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* XP Breakdown */}
        {data?.breakdown && (
          <Card className="border-muted/30 bg-muted/5">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-bold text-white mb-6">Desglose Total de XP</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-white/70 text-sm uppercase tracking-wider mb-2">A3 Entrenamiento</p>
                  <p className="text-3xl font-bold text-orange">{data.breakdown?.a3_xp || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-sm uppercase tracking-wider mb-2">A4 Realidad</p>
                  <p className="text-3xl font-bold text-red">{data.breakdown?.a4_xp || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/70 text-sm uppercase tracking-wider mb-2">Bonus</p>
                  <p className="text-3xl font-bold text-emerald-500">{data.breakdown?.interview_bonus || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Badges */}
        {data?.badges && data.badges.length > 0 && (
          <Card className="border-purple/30 bg-purple/5">
            <CardContent className="pt-6 pb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple" />
                Logros Desbloqueados
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {data.badges.map((badge, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/40 text-center border border-white/10">
                    <p className="text-white font-semibold text-sm">{badge}</p>
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
