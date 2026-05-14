'use client'

import useSWR from 'swr'

interface A2ProgressData {
  current_month: number
  progress_percentage: number
  status: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function A2ProgressBar() {
  const { data: progress } = useSWR<A2ProgressData>(
    '/api/a2/progress',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000,
      dedupingInterval: 2000,
      fallbackData: { current_month: 1, progress_percentage: 0, status: 'loading' }
    }
  )

  const percentage = progress?.progress_percentage ?? 0
  const month = progress?.current_month ?? 1
  const displayPercentage = Math.max(percentage, 2)

  return (
    <div className="w-full space-y-3">
      {/* Header with Month and Percentage */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-a2-text-secondary">Progreso Total</p>
          <p className="text-lg font-bold text-white">Mes {month}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black" style={{ color: 'rgb(90, 90, 150)' }}>
            {percentage}%
          </p>
          <p className="text-xs text-a2-text-secondary">completado</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)' }}>
        <div
          className="h-full transition-all duration-500 ease-out rounded-full shadow-lg"
          style={{
            width: `${displayPercentage}%`,
            background: 'linear-gradient(to right, rgb(90, 90, 150), rgb(80, 160, 170))',
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-full" />
        </div>
      </div>

      {/* Month breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        {[
          { month: 1, label: 'Fundamentos', max: 33 },
          { month: 2, label: 'Aceleración', max: 66 },
          { month: 3, label: 'Dominio', max: 100 }
        ].map((m) => {
          const isActive = month === m.month
          const monthProgress = isActive ? percentage : (month > m.month ? 100 : 0)
          
          return (
            <div
              key={m.month}
              className={`p-3 rounded-lg border transition-all ${
                isActive
                  ? 'bg-purple/20 border-purple/50'
                  : 'transition-all'
              }`}
              style={!isActive ? { backgroundColor: 'rgba(90, 90, 150, 0.05)', borderColor: 'rgba(90, 90, 150, 0.6)', border: '1px solid' } : {}}
            >
              <p className="text-xs font-bold text-white/70">{m.label}</p>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isActive ? 'bg-gradient-to-r from-purple to-blue' : 'bg-white/30'
                  }`}
                  style={{ width: `${monthProgress}%` }}
                />
              </div>
              <p className="text-xs text-white/60 mt-1">{Math.round(monthProgress)}%</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
