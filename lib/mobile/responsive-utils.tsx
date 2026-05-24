/**
 * Mobile-First Layout Utilities
 * Reusable responsive components and utilities for all pages
 */

import { ReactNode } from 'react'

// Mobile breakpoints (Tailwind convention)
export const BREAKPOINTS = {
  xs: '320px',    // Extra small
  sm: '640px',    // Small
  md: '768px',    // Medium (tablet)
  lg: '1024px',   // Large
  xl: '1280px',   // Extra large
}

// Container sizing
export const CONTAINER_CLASSES = {
  mobile: 'px-4 py-6',      // Mobile: 1rem padding, 1.5rem vertical
  tablet: 'md:px-6 md:py-8', // Tablet: 1.5rem, 2rem vertical
  desktop: 'lg:px-8 lg:py-12' // Desktop: 2rem, 3rem vertical
}

export const FULL_WIDTH_CONTAINER = `w-full ${CONTAINER_CLASSES.mobile} ${CONTAINER_CLASSES.tablet} ${CONTAINER_CLASSES.desktop}`

// Responsive grid layouts
export const RESPONSIVE_GRID = {
  single: 'grid grid-cols-1',
  twoCol: 'grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6',
  threeCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
  fourCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'
}

// Typography scales
export const TEXT_SIZES = {
  xs: 'text-xs md:text-sm',
  sm: 'text-sm md:text-base',
  base: 'text-base md:text-lg',
  lg: 'text-lg md:text-xl',
  xl: 'text-xl md:text-2xl',
  '2xl': 'text-2xl md:text-3xl',
  '3xl': 'text-3xl md:text-4xl',
  '4xl': 'text-4xl md:text-5xl',
}

// Spacing scales
export const SPACING = {
  xs: 'space-y-2 md:space-y-3',
  sm: 'space-y-3 md:space-y-4',
  base: 'space-y-4 md:space-y-6',
  lg: 'space-y-6 md:space-y-8',
  xl: 'space-y-8 md:space-y-12'
}

// Mobile navigation helper
export const MOBILE_NAV_CLASSES = 'fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto border-t md:border-t-0 bg-background'

// Touch-friendly sizes
export const TOUCH_SIZES = {
  sm: 'h-9 px-3',      // 36px minimum
  base: 'h-10 px-4',   // 40px minimum (recommended)
  lg: 'h-12 px-5',     // 48px minimum
}

// Responsive page container wrapper
export function ResponsiveContainer({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`max-w-7xl mx-auto ${FULL_WIDTH_CONTAINER} ${className}`}>
      {children}
    </div>
  )
}

// Mobile-optimized card
export function ResponsiveCard({ children, className = '' }: { children: ReactNode, className?: string }) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-6 ${className}`}>
      {children}
    </div>
  )
}

// Hamburger menu button for mobile
export function MobileMenuButton({ onClick, isOpen = false }: { onClick: () => void, isOpen?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden inline-flex items-center justify-center p-2 rounded-md"
      aria-label="Toggle menu"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  )
}
