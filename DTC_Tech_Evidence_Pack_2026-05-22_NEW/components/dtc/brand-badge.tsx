'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BrandBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  accent?: 'yellow' | 'orange' | 'red' | 'blue' | 'purple' | 'green'
  variant?: 'solid' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const BrandBadge = React.forwardRef<HTMLSpanElement, BrandBadgeProps>(
  ({ className, accent = 'purple', variant = 'solid', size = 'md', ...props }, ref) => {
    const accentColors = {
      yellow: 'yellow',
      orange: 'orange',
      red: 'red',
      blue: 'blue',
      purple: 'purple',
      green: 'green',
    }

    const variants = {
      solid: `bg-${accentColors[accent]} text-surface-950 font-semibold`,
      outline: `border border-${accentColors[accent]} text-${accentColors[accent]} bg-transparent`,
      ghost: `text-${accentColors[accent]} bg-${accentColors[accent]}/10`,
    }

    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-block rounded-surface-pill font-medium transition-all duration-200',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)

BrandBadge.displayName = 'BrandBadge'
