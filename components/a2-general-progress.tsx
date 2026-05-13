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
    if (completedDays <= 30) return 'linear-gradient(to right, rgb(90, 90, 150), rgb(80, 160, 170))'
    if (completedDays <= 60) return 'linear-gradient(to right, rgb(80, 160, 170), rgb(100, 180, 190))'
    return 'linear-gradient(to right, rgb(100, 180, 190), rgb(120, 200, 210))'
  }
  
  if (variant === 'compact') {
    return (
      <div className="bg-background/50 backdrop-blur-sm border-b border-a2-border px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-a2-text-secondary">Progreso A2</span>
              <span className="text-xs text-white/40">|</span>
              <span className="text-xs text-a2-primary font-medium">{getMonthLabel()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-a2-text-secondary">
                {isFullyComplete 
                  ? 'A2 Completado!' 
                  : `${completedDays}/${totalDays} días`
                }
              </span>
              <span className="text-sm font-semibold text-white">{Math.round(percent)}%</span>
            </div>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)' }}>
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percent}%`, background: getPhaseColor() }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background/50 backdrop-blur-sm border-b border-a2-border px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-a2-text-secondary">Progreso A2 - 90 Días</span>
            <span className="text-xs text-white/40">|</span>
            <span className="text-xs text-a2-primary font-medium">{getMonthLabel()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-a2-text-secondary">
              {isFullyComplete 
                ? 'A2 Completado! 🎉' 
                : `${completedDays}/${totalDays} días`
              }
            </span>
            <span className="text-sm font-semibold text-white">{Math.round(percent)}%</span>
          </div>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)' }}>
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%`, background: getPhaseColor() }}
          />
        </div>
      </div>
    </div>
  )
}
