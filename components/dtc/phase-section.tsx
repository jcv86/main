'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type Phase = 'ritual' | 'exploration' | 'training' | 'reality'

interface PhaseSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  phase?: Phase
  title?: React.ReactNode
  description?: React.ReactNode
}

const phaseConfig = {
  ritual: {
    accent: 'yellow',
    label: 'Ritual',
    bgGradient: 'from-yellow/5 to-transparent',
    borderColor: 'border-yellow/30',
  },
  exploration: {
    accent: 'orange',
    label: 'Exploración',
    bgGradient: 'from-orange/5 to-transparent',
    borderColor: 'border-orange/30',
  },
  training: {
    accent: 'red',
    label: 'Entrenamiento',
    bgGradient: 'from-red/5 to-transparent',
    borderColor: 'border-red/30',
  },
  reality: {
    accent: 'blue',
    label: 'Realidad',
    bgGradient: 'from-blue/5 to-transparent',
    borderColor: 'border-blue/30',
  },
}

export const PhaseSection = React.forwardRef<HTMLDivElement, PhaseSectionProps>(
  ({ className, phase = 'training', title, description, children, ...props }, ref) => {
    const config = phaseConfig[phase]

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-surface-lg border p-6 md:p-8',
          `bg-gradient-to-br ${config.bgGradient}`,
          `${config.borderColor}`,
          'backdrop-blur-sm',
          'transition-all duration-300',
          'hover:border-opacity-100',
          className
        )}
        {...props}
      >
        {/* Accent line at top */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-${config.accent} rounded-t-surface-lg`} />

        {title && (
          <div className="mb-4">
            <h2 className={`text-2xl font-playfair-display font-bold text-white`}>{title}</h2>
            {description && <p className="text-surface-300 text-sm mt-2">{description}</p>}
          </div>
        )}

        <div className="space-y-4">{children}</div>
      </div>
    )
  }
)

PhaseSection.displayName = 'PhaseSection'
