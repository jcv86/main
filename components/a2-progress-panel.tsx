'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { Calendar, TrendingUp } from 'lucide-react'

interface A2ProgressData {
  current_month: number
  progress_percentage: number
  completed_tasks: number
  total_tasks: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function A2ProgressPanel() {
  const { data: progress } = useSWR<A2ProgressData>(
    '/api/a2/progress',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000,
      dedupingInterval: 2000,
      fallbackData: { 
        current_month: 1, 
        progress_percentage: 0, 
        completed_tasks: 0,
        total_tasks: 90
      }
    }
  )

  const percentage = progress?.progress_percentage ?? 0
  const month = progress?.current_month ?? 1
  const completed = progress?.completed_tasks ?? 0
  const displayPercentage = Math.max(percentage, 2)

  const months = [
    { num: 1, label: 'Fundamentos', color: 'from-purple to-blue' },
    { num: 2, label: 'Aceleración', color: 'from-blue to-cyan' },
    { num: 3, label: 'Dominio', color: 'from-cyan to-emerald' }
  ]

  return (
    <Link href="/despega/a2-routes">
      <aside className="sticky top-16 z-30 hidden lg:block w-64 h-screen border-l border-white/10 bg-black/40 backdrop-blur-sm overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple/60" />
              <span className="text-xs font-semibold text-white/60 uppercase">Progreso 90 Días</span>
            </div>
            <p className="text-2xl font-black bg-gradient-to-r from-purple to-cyan bg-clip-text text-transparent">
              {percentage}%
            </p>
            <p className="text-sm text-white/60">{completed} de 90 tareas</p>
          </div>

          {/* Main Progress Bar */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white uppercase">Mes {month}</p>
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple via-blue to-cyan transition-all duration-500 ease-out rounded-full shadow-lg"
                style={{ width: `${displayPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-full" />
              </div>
            </div>
          </div>

          {/* Month Breakdown */}
          <div className="space-y-3 pt-2">
            {months.map((m) => {
              const isActive = month === m.num
              const monthProgress = isActive ? percentage : (month > m.num ? 100 : 0)
              
              return (
                <div key={m.num} className={`p-3 rounded-lg border transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple/20 to-blue/20 border-purple/50'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-white/70">{m.label}</p>
                    <p className="text-xs font-bold text-white/90">{Math.round(monthProgress)}%</p>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all bg-gradient-to-r ${m.color}`}
                      style={{ width: `${monthProgress}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-cyan hover:text-cyan/80 transition-colors font-semibold">
              <TrendingUp className="w-4 h-4" />
              Ver detalles
            </div>
          </div>
        </div>
      </aside>
    </Link>
  )
}
