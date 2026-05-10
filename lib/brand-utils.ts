// Brand utility functions for DTC
import { dtcColors, dtcTypography } from './design-tokens'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge classNames with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get phase color by phase name
 */
export function getPhaseColor(phase: 'ritual' | 'exploración' | 'entrenamiento' | 'realidad' | string): string {
  const phaseKey = phase.toLowerCase() as keyof typeof dtcColors.phases
  return dtcColors.phases[phaseKey] || dtcColors.yellow
}

/**
 * Get phase background with gradient
 */
export function getPhaseGradient(phase: string): string {
  const color = getPhaseColor(phase)
  return `linear-gradient(135deg, ${color}15, ${color}08)`
}

/**
 * Get contrasting text color for background
 */
export function getContrastText(backgroundColor: string): string {
  // For all dark backgrounds, use foreground
  if (backgroundColor.includes('#000') || backgroundColor.includes('#050')) {
    return dtcColors.foreground
  }
  // For brand colors, use black
  return '#000000'
}

/**
 * Format typography CSS variables
 */
export function getTypographyClasses(variant: keyof typeof dtcTypography, breakpoint: 'desktop' | 'mobile' = 'desktop'): string {
  const styles = dtcTypography[variant]
  if (typeof styles === 'object' && 'desktop' in styles) {
    const props = styles[breakpoint as keyof typeof styles]
    const cssVars: Record<string, string> = {}
    Object.entries(props).forEach(([key, value]) => {
      if (typeof value === 'number') {
        cssVars[`--${key}`] = value.toString()
      } else {
        cssVars[`--${key}`] = value
      }
    })
    return Object.entries(cssVars).map(([k, v]) => `${k}: ${v}`).join('; ')
  }
  return ''
}

/**
 * Get accessible border color based on background
 */
export function getBorderColor(isDark: boolean = true): string {
  return isDark ? dtcColors.border : 'rgba(0, 0, 0, 0.08)'
}

/**
 * Color ratio validation helper
 * Returns true if ratio respects 70-80% black/neutrals rule
 */
export function validateColorRatio(colors: Array<{ color: string; percentage: number }>): boolean {
  const neutrals = colors.filter(c => 
    c.color === dtcColors.black || 
    c.color === dtcColors.foreground || 
    c.color === dtcColors.muted ||
    c.color === dtcColors.card
  ).reduce((sum, c) => sum + c.percentage, 0)
  
  return neutrals >= 70 && neutrals <= 80
}
