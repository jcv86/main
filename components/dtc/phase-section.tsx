'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type Phase = 'ritual' | 'exploration' | 'training' | 'reality'

interface PhaseSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  phase?: Phase
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
}

const phaseConfig: Record<Phase, { accent: string; label: string; bgGradient: string; borderColor: string; accentBg: string }> = {
  ritual: {
    accent: 'yellow',
    label: 'Ritual',
    bgGradient: 'from-yellow/5 to-transparent',
    borderColor: 'border-yellow/30',
    accentBg: 'bg-yellow',
  },
  exploration: {
    accent: 'orange',
    label: 'Exploración',
    bgGradient: 'from-orange/5 to-transparent',
    borderColor: 'border-orange/30',
    accentBg: 'bg-orange',
  },
  training: {
    accent: 'red',
    label: 'Entrenamiento',
    bgGradient: 'from-red/5 to-transparent',
    borderColor: 'border-red/30',
    accentBg: 'bg-red',
  },
  reality: {
    accent: 'blue',
    label: 'Realidad',
    bgGradient: 'from-blue/5 to-transparent',
    borderColor: 'border-blue/30',
    accentBg: 'bg-blue',
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
          config.borderColor,
          'backdrop-blur-sm',
          'transition-all duration-300',
          'hover:border-opacity-100',
          className
        )}
        {...props}
      >
        {/* Accent line at top */}
        <div className={cn('absolute top-0 left-0 right-0 h-1 rounded-t-surface-lg', config.accentBg)} />

        {title && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair-display)' }}>
              {title}
            </h2>
            {description && <p className="text-slate-400 text-sm mt-2">{description}</p>}
          </div>
        )}

        <div className="space-y-4">{children}</div>
      </div>
    )
  }
)

PhaseSection.displayName = 'PhaseSection'
