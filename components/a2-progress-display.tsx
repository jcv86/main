'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

interface A2ProgressData {
  current_month: number
  progress_percentage: number
  completed_tasks: number
  total_tasks: number
  status: string
  month_progress: Array<{
    month: number
    percentage: number
    completed: boolean
  }>
  milestones: Array<{
    month: number
    title: string
    status: string
  }>
}

export function A2ProgressDisplay() {
  const [progress, setProgress] = useState<A2ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch('/api/a2/progress')
        if (response.ok) {
          const data = await response.json()
          setProgress(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching A2 progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-white/50" />
      </div>
    )
  }

  if (!progress) {
    return null
  }

  const phaseLabels = {
    1: { label: 'Mes 1', milestone: 'Fundamentos' },
    2: { label: 'Mes 2', milestone: 'Aceleración' },
    3: { label: 'Mes 3', milestone: 'Dominio' }
  }

  const phaseColors = {
    0: { bg: 'rgba(90, 90, 150, 0.4)', text: 'rgb(90, 90, 150)' },
    1: { bg: 'rgba(90, 90, 150, 0.3)', text: 'rgb(90, 90, 150)' },
    2: { bg: 'rgba(90, 90, 150, 0.2)', text: 'rgb(90, 90, 150)' }
  }

  return (
    <div className="rounded-sm p-6 border-0" style={{ backgroundColor: 'rgba(90, 90, 150, 0.15)' }}>
      <h3 className="text-lg font-bold text-white mb-6">Cómo va tu Progreso</h3>
      <div className="space-y-4">
        {progress.month_progress.map((month, idx) => {
          const colors = phaseColors[idx as keyof typeof phaseColors]
          const label = phaseLabels[month.month as keyof typeof phaseLabels]
          
          return (
            <div key={month.month} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-0 flex-shrink-0" style={{ backgroundColor: colors.bg }}>
                    <span className="text-sm font-bold" style={{ color: colors.text }}>{month.month}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{label.label}</p>
                    <p className="text-xs text-white/60">{label.milestone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{month.percentage}%</p>
                  <p className="text-xs text-white/60">{Math.round((month.percentage / 100) * 30)}/30 tareas</p>
                </div>
              </div>
              <div className="w-full bg-muted/60 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${month.percentage}%`, background: `linear-gradient(to right, rgb(90, 90, 150), rgba(90, 90, 150, 0.7))` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Overall Progress Summary */}
      <div className="mt-6 pt-6" style={{ borderTop: `1px solid rgba(90, 90, 150, 0.2)` }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80 mb-1">Progreso Total</p>
            <p className="text-2xl font-bold text-white">{progress.progress_percentage}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80 mb-1">{progress.completed_tasks} de {progress.total_tasks}</p>
            <p className="text-xs" style={{ color: 'rgb(90, 90, 150)' }}>Tareas completadas</p>
          </div>
        </div>
      </div>
    </div>
  )
}
