'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BrandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  accent?: 'yellow' | 'orange' | 'red' | 'blue' | 'purple' | 'green'
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const BrandButton = React.forwardRef<HTMLButtonElement, BrandButtonProps>(
  ({ className, accent = 'purple', variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    const accentBgColors = {
      yellow: 'bg-yellow hover:bg-yellow/90',
      orange: 'bg-orange hover:bg-orange/90',
      red: 'bg-red hover:bg-red/90',
      blue: 'bg-blue hover:bg-blue/90',
      purple: 'bg-purple hover:bg-purple/90',
      green: 'bg-green hover:bg-green/90',
    }

    const accentBorderColors = {
      yellow: 'border-yellow text-yellow hover:bg-yellow/10',
      orange: 'border-orange text-orange hover:bg-orange/10',
      red: 'border-red text-red hover:bg-red/10',
      blue: 'border-blue text-blue hover:bg-blue/10',
      purple: 'border-purple text-purple hover:bg-purple/10',
      green: 'border-green text-green hover:bg-green/10',
    }

    const variants = {
      primary: `${accentBgColors[accent]} text-surface-950 font-semibold`,
      secondary: `border ${accentBorderColors[accent]} bg-transparent`,
      ghost: `text-${accent} hover:bg-${accent}/5 transparent`,
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-[20px] transition-all duration-200 font-medium',
          variants[variant],
          sizes[size],
          loading && 'opacity-60 cursor-not-allowed',
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

BrandButton.displayName = 'BrandButton'
