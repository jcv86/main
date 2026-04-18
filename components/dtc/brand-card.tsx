'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BrandCardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: 'yellow' | 'orange' | 'red' | 'blue' | 'purple' | 'green'
  variant?: 'default' | 'elevated' | 'ghost'
  interactive?: boolean
}

export const BrandCard = React.forwardRef<HTMLDivElement, BrandCardProps>(
  ({ className, accent = 'purple', variant = 'default', interactive = false, ...props }, ref) => {
    const accentColors = {
      yellow: 'border-yellow hover:shadow-yellow/20',
      orange: 'border-orange hover:shadow-orange/20',
      red: 'border-red hover:shadow-red/20',
      blue: 'border-blue hover:shadow-blue/20',
      purple: 'border-purple hover:shadow-purple/20',
      green: 'border-green hover:shadow-green/20',
    }

    const variants = {
      default: 'bg-surface-900 border border-surface-700',
      elevated: 'bg-surface-800 border border-surface-600 shadow-lg',
      ghost: 'bg-transparent border border-surface-700',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-surface-lg p-6 transition-all duration-300',
          variants[variant],
          interactive && `cursor-pointer ${accentColors[accent]}`,
          className
        )}
        {...props}
      />
    )
  }
)

BrandCard.displayName = 'BrandCard'
