// Utility functions to prevent hydration mismatches
// Use these helper functions when dealing with dates, random values, or client-only features

'use client'

import { useEffect, useState } from 'react'

/**
 * Format date safely without hydration mismatch
 * Use in client components that render dates
 */
export function useDateFormatter() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatDate = (dateString: string, locale: string = 'es-CL'): string => {
    if (!mounted) return ''
    try {
      return new Date(dateString).toLocaleDateString(locale)
    } catch {
      return 'Fecha desconocida'
    }
  }

  const formatDateTime = (dateString: string, locale: string = 'es-CL'): string => {
    if (!mounted) return ''
    try {
      return new Date(dateString).toLocaleString(locale)
    } catch {
      return 'Fecha y hora desconocidas'
    }
  }

  return { formatDate, formatDateTime, mounted }
}

/**
 * Wrapper component that renders children only after hydration
 * Prevents "show on client only" mismatches
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <>{children}</>
}

/**
 * Hook to ensure component is mounted before rendering
 * Useful for components with video, canvas, or other browser APIs
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

/**
 * Safe random value generator (use in client components only)
 */
export function useRandomValue(min: number = 0, max: number = 100) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    setValue(Math.floor(Math.random() * (max - min + 1)) + min)
  }, [min, max])

  return value
}
