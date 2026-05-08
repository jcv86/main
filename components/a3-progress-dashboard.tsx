'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Target, Zap, CheckCircle2 } from 'lucide-react'

interface ProgressData {
  totalXP: number
  totalXPTarget: number
  completedTrainings: number
  totalTrainings: number
  percentage: number
  completedModules: string[]
}

const PURPLE = 'rgb(170, 70, 170)'

export default function A3ProgressDashboard() {
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [animatedPercentage, setAnimatedPercentage] = useState(0)
  const [starterXpAwarded, setStarterXpAwarded] = useState(false)

  // Award starter XP on first visit
  const awardStarterXp = async () => {
    try {
      const res = await fetch('/api/a3/starter-xp', {
        method: 'POST',
        credentials: 'include',
      })
      const result = await res.json()
      if (result.success && !result.alreadyAwarded) {
        console.log('[v0] Starter XP awarded! Refreshing progress...')
        setStarterXpAwarded(true)
        // Refetch progress after awarding
        await new Promise(r => setTimeout(r, 500))
        fetchProgress()
      }
    } catch (err) {
      console.error('[v0] Error awarding starter XP:', err)
    }
  }

  // Fetch progress data
  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/a3/progress', {
        credentials: 'include',
        cache: 'no-store',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      console.log('[v0] Progress fetched:', json)
      setData(json)
    } catch (err) {
      console.error('[v0] Progress fetch error:', err)
      // Show zeros on error so the bar still renders
      setData({
        totalXP: 0,
        totalXPTarget: 1000,
        completedTrainings: 0,
        totalTrainings: 7,
        percentage: 0,
        completedModules: [],
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial load: award starter XP then fetch progress
  useEffect(() => {
    awardStarterXp()
  }, [])

  // Auto-refresh every 5s
  useEffect(() => {
    if (!starterXpAwarded && loading) return
    
    const interval = setInterval(fetchProgress, 5000)
    return () => clearInterval(interval)
  }, [starterXpAwarded, loading])

  // Animate the progress bar smoothly when data changes
  useEffect(() => {
    if (!data) return
    const target = data.percentage
    const duration = 800
    const start = animatedPercentage
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (target - start) * eased
      setAnimatedPercentage(current)
      if (progress < 1) requestAnimationFrame(animate)
    }
    animate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.percentage])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted/20 rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-20 bg-muted/20 rounded-lg animate-pulse" />
          <div className="h-20 bg-muted/20 rounded-lg animate-pulse" />
          <div className="h-20 bg-muted/20 rounded-lg animate-pulse" />
        </div>
      </div>
    )
  }

  if (!data) return null

  const displayPct = Math.round(animatedPercentage)

  return (
    <div className="space-y-4">
      {/* MAIN PROGRESS CARD */}
      <Card
        className="border-2 overflow-hidden"
        style={{
          borderColor: 'rgba(170, 70, 170, 0.4)',
          backgroundColor: 'rgb(8, 8, 10)',
        }}
      >
        <CardContent className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-5 h-5" style={{ color: PURPLE }} />
                <h3 className="text-lg font-bold" style={{ color: PURPLE }}>
                  Progreso Entrenamiento
                </h3>
              </div>
              <p className="text-xs text-white/60">
                Pilar 3 · Domina entrevistas profesionales
              </p>
            </div>
            <div className="text-right">
              <div
                className="text-4xl font-bold tabular-nums leading-none"
                style={{ color: PURPLE, fontFamily: 'monospace' }}
              >
                {displayPct}%
              </div>
              <p className="text-xs text-white/50 mt-1">completado</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${animatedPercentage}%`,
                  background: `linear-gradient(90deg, ${PURPLE} 0%, rgba(200, 100, 200, 1) 100%)`,
                  boxShadow: `0 0 12px rgba(170, 70, 170, 0.5)`,
                }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">
                {data.totalXP} XP de {data.totalXPTarget}
              </span>
              <span className="text-white/50">
                {data.completedTrainings}/{data.totalTrainings} entrenamientos
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STAT CARDS */}
      <div className="grid grid-cols-3 gap-3">
        {/* XP */}
        <Card
          className="border"
          style={{
            backgroundColor: 'rgb(8, 8, 10)',
            borderColor: 'rgba(170, 70, 170, 0.3)',
            borderLeft: `3px solid ${PURPLE}`,
          }}
        >
          <CardContent className="p-4 text-center space-y-1">
            <Zap className="w-5 h-5 mx-auto" style={{ color: PURPLE }} />
            <p className="text-2xl font-bold text-white tabular-nums">
              {data.totalXP}
            </p>
            <p className="text-[10px] text-white/50 uppercase tracking-wide">
              XP Ganados
            </p>
          </CardContent>
        </Card>

        {/* Completed Trainings */}
        <Card
          className="border"
          style={{
            backgroundColor: 'rgb(8, 8, 10)',
            borderColor: 'rgba(170, 70, 170, 0.3)',
            borderLeft: `3px solid ${PURPLE}`,
          }}
        >
          <CardContent className="p-4 text-center space-y-1">
            <CheckCircle2 className="w-5 h-5 mx-auto" style={{ color: PURPLE }} />
            <p className="text-2xl font-bold text-white tabular-nums">
              {data.completedTrainings}
            </p>
            <p className="text-[10px] text-white/50 uppercase tracking-wide">
              Completados
            </p>
          </CardContent>
        </Card>

        {/* Remaining */}
        <Card
          className="border"
          style={{
            backgroundColor: 'rgb(8, 8, 10)',
            borderColor: 'rgba(170, 70, 170, 0.3)',
            borderLeft: `3px solid ${PURPLE}`,
          }}
        >
          <CardContent className="p-4 text-center space-y-1">
            <Target className="w-5 h-5 mx-auto" style={{ color: PURPLE }} />
            <p className="text-2xl font-bold text-white tabular-nums">
              {Math.max(data.totalTrainings - data.completedTrainings, 0)}
            </p>
            <p className="text-[10px] text-white/50 uppercase tracking-wide">
              Restantes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
