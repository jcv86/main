'use client'

interface GeneralProgressProps {
  currentStep: number
  totalSteps: number
  currentLabel: string
  completedSections?: number  // Number of completed sections (out of 4)
  totalSections?: number      // Total sections (4 for Pillar 3)
  variant?: 'default' | 'compact'
}

export function A3GeneralProgress({ 
  currentStep, 
  totalSteps, 
  currentLabel,
  completedSections = 0,      // Default to 0 completed sections
  totalSections = 4,          // Pillar 3 has 4 sections
  variant = 'default'
}: GeneralProgressProps) {
  // Progress is based on COMPLETED SECTIONS only
  // Each section = 25% (4 sections total)
  const percent = (completedSections / totalSections) * 100
  const isFullyComplete = completedSections === totalSections
  
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
              <span className="text-xs text-white/50">
                {isFullyComplete 
                  ? 'Pillar 3 Completado!' 
                  : `${completedSections}/${totalSections} secciones`
                }
              </span>
              <span className="text-sm font-semibold text-white">{Math.round(percent)}%</span>
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
            <span className="text-xs text-white/50">
              {isFullyComplete 
                ? 'Pillar 3 Completado!' 
                : `${completedSections}/${totalSections} secciones`
              }
            </span>
            <span className="text-sm font-semibold text-white">{Math.round(percent)}%</span>
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
