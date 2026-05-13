'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, Users, Award, Loader2 } from 'lucide-react'
import { getA2RouteProgressMetrics, A2_PHASE_DESCRIPTIONS } from '@/lib/a2-route-progress'

interface A2RouteProgressProps {
  dayNumber?: number
  userMetrics?: {
    applicationsSubmitted: number
    connectionsInitiated: number
    interviewsCompleted: number
    offersReceived: number
  }
}

interface UserRouteProgress {
  dia_actual: number
  porcentaje_completado: number
  estado: string
  capacidad_promedio: number
}

export function A2RouteProgress({ dayNumber, userMetrics }: A2RouteProgressProps) {
  const [userProgress, setUserProgress] = useState<UserRouteProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: progressData } = await supabase
          .from('a2_user_route_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (progressData) {
          setUserProgress(progressData)
        }
      } catch (error) {
        console.error('[v0] Error fetching route progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProgress()
  }, [supabase])

  // Use real user progress if available, otherwise use defaults
  const currentDay = userProgress?.dia_actual || dayNumber || 1
  const progressPercentage = userProgress?.porcentaje_completado || 0
  const metrics = getA2RouteProgressMetrics(currentDay)
  const phaseInfo = A2_PHASE_DESCRIPTIONS[metrics.phase]

  if (loading) {
    return (
      <Card className="border-[rgb(80,160,170)]/30 bg-black">
        <CardContent className="pt-4 flex items-center justify-center h-24 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[rgb(80,160,170)]" />
          <span className="text-sm text-white/60">Cargando tu progreso...</span>
        </CardContent>
      </Card>
    )
  }

  // Use provided metrics or expected metrics
  const applications = userMetrics?.applicationsSubmitted ?? metrics.applicationsSubmitted
  const connections = userMetrics?.connectionsInitiated ?? metrics.connectionsInitiated
  const interviews = userMetrics?.interviewsCompleted ?? metrics.interviewsCompleted
  const offers = userMetrics?.offersReceived ?? metrics.offersReceived

  const applicationPercent = (applications / metrics.applicationsSubmitted) * 100
  const connectionPercent = (connections / metrics.connectionsInitiated) * 100
  const interviewPercent = (interviews / metrics.interviewsCompleted) * 100
  const xpPercent = (metrics.xpEarned / 1340) * 100

  return (
    <div className="space-y-4">
      {/* Phase Header */}
      <Card className="border-[rgb(80,160,170)]/30 bg-gradient-to-r from-black to-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{phaseInfo.emoji}</span>
                <CardTitle className="text-white">{phaseInfo.title}</CardTitle>
              </div>
              <p className="text-sm text-white/60">{phaseInfo.description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[rgb(170,70,170)]">Día {currentDay}</p>
              <p className="text-xs text-white/60 font-semibold text-green-400">✓ Día Actual</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Route Progress Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Applications */}
        <Card className="border-[rgb(80,160,170)]/30 bg-black">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-white/70">Applications</span>
              </div>
              <Badge className="text-xs bg-blue-500/20 text-blue-300">{applicationPercent.toFixed(0)}%</Badge>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {applications}
              <span className="text-xs text-white/50 ml-1">/ {metrics.applicationsSubmitted}</span>
            </p>
            <Progress value={Math.min(applicationPercent, 100)} className="h-1" />
          </CardContent>
        </Card>

        {/* Connections */}
        <Card className="border-[rgb(80,160,170)]/30 bg-black">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white/70">Connections</span>
              </div>
              <Badge className="text-xs bg-cyan-500/20 text-cyan-300">{connectionPercent.toFixed(0)}%</Badge>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {connections}
              <span className="text-xs text-white/50 ml-1">/ {metrics.connectionsInitiated}</span>
            </p>
            <Progress value={Math.min(connectionPercent, 100)} className="h-1" />
          </CardContent>
        </Card>

        {/* Interviews */}
        <Card className="border-[rgb(80,160,170)]/30 bg-black">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-white/70">Interviews</span>
              </div>
              <Badge className="text-xs bg-purple-500/20 text-purple-300">{interviewPercent.toFixed(0)}%</Badge>
            </div>
            <p className="text-2xl font-bold text-white mb-2">
              {interviews}
              <span className="text-xs text-white/50 ml-1">/ {metrics.interviewsCompleted}</span>
            </p>
            <Progress value={Math.min(interviewPercent, 100)} className="h-1" />
          </CardContent>
        </Card>

        {/* Offers */}
        <Card className="border-[rgb(80,160,170)]/30 bg-black">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs font-semibold text-white/70">Offers</span>
              </div>
              <Badge className="text-xs bg-green-500/20 text-green-300">{offers > 0 ? '✓' : '0'}</Badge>
            </div>
            <p className="text-2xl font-bold text-white mb-2">{offers}</p>
            <p className="text-xs text-white/50">
              {dayNumber >= 60 ? 'Negotiating' : dayNumber >= 30 ? 'Building pipeline' : 'Coming soon'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Route Progress */}
      <Card className="border-[rgb(170,70,170)]/30 bg-black">
        <CardHeader>
          <CardTitle className="text-white text-sm">Progreso Total de tu Ruta (Real)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-white/70">Porcentaje Completado</span>
              <span className="text-sm font-bold text-[rgb(170,70,170)]">
                {progressPercentage}% completado
              </span>
            </div>
            <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <div>
              <p className="text-xs text-white/60">Día Actual</p>
              <p className="text-lg font-bold text-cyan-400">{currentDay}</p>
            </div>
            <div>
              <p className="text-xs text-white/60">Días Restantes</p>
              <p className="text-lg font-bold text-purple-400">{90 - currentDay}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Focus Areas */}
      <Card className="border-[rgb(80,160,170)]/30 bg-black">
        <CardHeader>
          <CardTitle className="text-white text-sm">Focus Areas for {phaseInfo.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {phaseInfo.focus.map((focus, idx) => (
              <Badge
                key={idx}
                className="bg-[rgb(80,160,170)]/20 text-[rgb(80,160,170)] text-xs"
              >
                {focus}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
