'use client'

import { useEffect, useState } from 'react'

interface ProgressBarProps {
  percentage: number
  currentXp: number
  maxXp: number
  label?: string
  animated?: boolean
}

export function ProgressBar({ 
  percentage, 
  currentXp, 
  maxXp,
  label = 'Progreso hacia entrevista real',
  animated = true 
}: ProgressBarProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0)
  
  // Animate the percentage on mount and when it changes
  useEffect(() => {
    if (!animated) {
      setDisplayPercentage(percentage)
      return
    }
    
    const target = percentage
    const duration = 1000
    const start = displayPercentage
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic function for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = start + (target - start) * eased
      setDisplayPercentage(current)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    animate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percentage])
  
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{label}</h3>
        <div className="text-right">
          <div className="text-sm font-mono text-transparent bg-gradient-to-r from-training to-training/60 bg-clip-text">
            {Math.round(displayPercentage)}%
          </div>
          <div className="text-xs text-white/60">{currentXp} / {maxXp} XP</div>
        </div>
      </div>
      
      {/* Main progress bar */}
      <div className="relative h-3 w-full bg-purple-500/5 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-training to-training/60 transition-all duration-500 ease-out rounded-full shadow-lg shadow-training/50"
          style={{ width: `${Math.min(displayPercentage, 100)}%` }}
        />
        
        {/* Animated shimmer effect */}
        <div
          className="absolute inset-0 opacity-50 animate-pulse"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            animation: 'shimmer 2s infinite'
          }}
        />
      </div>
      
      {/* Supporting text */}
      <div className="text-xs text-white/50 mt-2">
        {displayPercentage < 25 && "Aún no has iniciado tu preparación. Comienza con la Auditoría Inicial."}
        {displayPercentage >= 25 && displayPercentage < 50 && "Ya empezaste a preparar tu entorno y primeras herramientas."}
        {displayPercentage >= 50 && displayPercentage < 75 && "Tu preparación va en buen camino. Continúa con los entrenamientos."}
        {displayPercentage >= 75 && "Casi listo. Falta afinar los últimos detalles."}
      </div>
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
