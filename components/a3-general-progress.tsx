'use client'

interface GeneralProgressProps {
  currentStep: number
  totalSteps: number
  currentLabel: string
  variant?: 'default' | 'compact'
}

export function A3GeneralProgress({ 
  currentStep, 
  totalSteps, 
  currentLabel,
  variant = 'default'
}: GeneralProgressProps) {
  const percent = Math.round(((currentStep - 1) / totalSteps) * 100)
  
  if (variant === 'compact') {
    return (
      <div className="bg-background/50 backdrop-blur-sm border-b border-muted/30 px-4 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/60">Progreso General</span>
              <span className="text-xs text-white/40">|</span>
              <span className="text-xs text-training font-medium">{currentLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">Paso {currentStep} de {totalSteps}</span>
              <span className="text-sm font-semibold text-white">{percent}%</span>
            </div>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${percent}%`,
                background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)'
              }}
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
            <span className="text-xs font-medium text-white/60">Progreso General</span>
            <span className="text-xs text-white/40">|</span>
            <span className="text-xs text-training font-medium">{currentLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Paso {currentStep} de {totalSteps}</span>
            <span className="text-sm font-semibold text-white">{percent}%</span>
          </div>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${percent}%`,
              background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.8) 100%)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
