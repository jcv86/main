'use client'

import useSWR from 'swr'
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface MonthProgress {
  month: number
  percentage: number
  completed: boolean
}

interface Milestone {
  month: number
  title: string
  status: 'completed' | 'pending' | 'in_progress'
}

interface A2ProgressData {
  current_month: number
  progress_percentage: number
  completed_tasks: number
  total_tasks: number
  status: string
  month_progress?: MonthProgress[]
  milestones?: Milestone[]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function A2ProgressSidebar() {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null)
  
  const { data: progress, isLoading } = useSWR<A2ProgressData>(
    '/api/a2/progress',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000, // Refresca cada 5 segundos
      dedupingInterval: 2000,
    }
  )

  // Set default expanded month when progress loads
  const currentMonth = progress?.current_month
  if (currentMonth && expandedMonth === null) {
    setExpandedMonth(currentMonth)
  }

  if (isLoading || !progress) {
    return (
      <div className="w-72 bg-muted/30 border-r border-muted/40 p-6 hidden lg:block">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 bg-muted/40 rounded w-3/4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/40 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Compute month progress from actual data
  const monthProgress = progress.month_progress || [
    {
      month: 1,
      percentage: Math.min(Math.max(progress.progress_percentage, 0), 33),
      completed: progress.current_month > 1 || progress.progress_percentage >= 33
    },
    {
      month: 2,
      percentage: progress.current_month === 2 ? Math.max(0, Math.min(progress.progress_percentage - 33, 34)) : progress.current_month > 2 ? 100 : 0,
      completed: progress.current_month > 2 || (progress.current_month === 2 && progress.progress_percentage >= 66)
    },
    {
      month: 3,
      percentage: progress.current_month === 3 ? Math.max(0, progress.progress_percentage - 67) : progress.current_month > 3 ? 100 : 0,
      completed: progress.current_month > 3 || progress.progress_percentage === 100
    }
  ]

  return (
    <aside className="hidden lg:block w-72 bg-muted/5 border-r border-muted/40 sticky top-0 h-screen overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-sm uppercase tracking-wider font-semibold text-white/70 mb-2">
          Tu Jornada de 90 Días
        </h3>
        <div className="relative h-2 bg-muted/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple via-blue to-cyan transition-all duration-500"
            style={{ width: `${progress.progress_percentage}%` }}
          />
        </div>
        <p className="text-xs text-white/60 mt-2">
          {progress.progress_percentage}% Completado
        </p>
      </div>

      {/* Months Timeline */}
      <div className="space-y-3">
        {monthProgress.map((month) => {
          const isActive = month.month === progress.current_month
          const isCompleted = month.completed
          
          return (
            <div key={month.month}>
              <button
                onClick={() => setExpandedMonth(isActive ? expandedMonth : month.month)}
                className={`w-full flex items-start gap-3 p-4 rounded-lg transition-all ${
                  isActive
                    ? 'bg-purple/20 border border-purple/40'
                    : isCompleted
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-muted/20 border border-muted/30 opacity-60'
                }`}
              >
                {/* Icon */}
                <div className="mt-1 flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isActive ? (
                    <Circle className="w-5 h-5 text-purple fill-purple/30" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted/40" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 text-left">
                  <p className={`text-sm font-semibold ${isActive || isCompleted ? 'text-white' : 'text-white/60'}`}>
                    Mes {month.month}
                  </p>
                  <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full transition-all ${
                        isActive ? 'bg-purple' : isCompleted ? 'bg-emerald-500' : 'bg-muted/40'
                      }`}
                      style={{ width: `${month.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-1">{Math.round(month.percentage)}%</p>
                </div>

                {/* Chevron */}
                <div className="flex-shrink-0 mt-1">
                  {expandedMonth === month.month ? (
                    <ChevronUp className="w-4 h-4 text-white/40" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/40" />
                  )}
                </div>
              </button>

              {/* Milestones */}
              {expandedMonth === month.month && progress.milestones && progress.milestones.length > 0 && (
                <div className="space-y-2 pl-8 mt-2">
                  {progress.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          milestone.status === 'completed'
                            ? 'bg-emerald-500'
                            : milestone.status === 'in_progress'
                            ? 'bg-purple'
                            : 'bg-muted/40'
                        }`}
                      />
                      <p className={milestone.status === 'completed' ? 'text-white/70' : 'text-white/50'}>
                        {milestone.title}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="pt-4 border-t border-muted/30 space-y-3">
        <div className="text-xs space-y-2">
          <div className="flex justify-between text-white/60">
            <span>Estado:</span>
            <span className="text-white font-semibold capitalize">
              {progress.status === 'completed' ? 'Completado' : 
               progress.status === 'near_completion' ? 'Casi Terminado' :
               progress.status === 'in_progress' ? 'En Progreso' : 'No Iniciado'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
