'use client'

interface A2GeneralProgressProps {
  completedDays?: number
  totalDays?: number
  currentMonth?: number
  variant?: 'default' | 'compact'
}

export function A2GeneralProgress({ 
  completedDays = 0,
  totalDays = 90,
  currentMonth = 1,
  variant = 'default'
}: A2GeneralProgressProps) {
  // Progress is based on COMPLETED DAYS
  // Month 1: Days 1-30, Month 2: Days 31-60, Month 3: Days 61-90
  const percent = (completedDays / totalDays) * 100
  const isFullyComplete = completedDays === totalDays
  
  const getMonthLabel = () => {
    if (completedDays === 0) return 'Sin Iniciar'
    if (completedDays <= 30) return `Mes 1 (Días 1-30)`
    if (completedDays <= 60) return `Mes 2 (Días 31-60)`
    return `Mes 3 (Días 61-90)`
  }

  const getPhaseColor = () => {
    if (completedDays <= 30) return 'from-purple via-blue to-cyan'
    if (completedDays <= 60) return 'from-blue via-cyan to-teal'
    return 'from-cyan via-teal to-emerald'
  }
  
  if (variant === 'compact') {
    return (
      <div className="bg-background/50 backdrop-blur-sm border-b border-muted/30 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/60">Progreso A2</span>
              <span className="text-xs text-white/40">|</span>
              <span className="text-xs text-cyan font-medium">{getMonthLabel()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">
                {isFullyComplete 
                  ? 'A2 Completado!' 
                  : `${completedDays}/${totalDays} días`
                }
              </span>
              <span className="text-sm font-semibold text-white">{Math.round(percent)}%</span>
            </div>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${getPhaseColor()}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background/50 backdrop-blur-sm border-b border-muted/30 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-white/60">Progreso A2 - 90 Días</span>
            <span className="text-xs text-white/40">|</span>
            <span className="text-xs text-cyan font-medium">{getMonthLabel()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">
              {isFullyComplete 
                ? 'A2 Completado! 🎉' 
                : `${completedDays}/${totalDays} días`
              }
            </span>
            <span className="text-sm font-semibold text-white">{Math.round(percent)}%</span>
          </div>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r ${getPhaseColor()}`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
