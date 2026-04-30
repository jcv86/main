'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface A2ProgressData {
  current_month: number
  progress_percentage: number
  status: string
}

export function A2ProgressNavbarBadge() {
  const [progress, setProgress] = useState<A2ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch('/api/a2/progress')
        if (response.ok) {
          const data = await response.json()
          setProgress(data)
        }
      } catch (error) {
        console.error('[v0] Error loading A2 progress:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  if (loading || !progress) {
    return null
  }

  const getStatusColor = () => {
    if (progress.progress_percentage === 0) return 'bg-muted/30 text-white/60'
    if (progress.progress_percentage < 50) return 'bg-purple/20 text-purple'
    if (progress.progress_percentage < 100) return 'bg-blue/20 text-blue'
    return 'bg-emerald-500/20 text-emerald-400'
  }

  return (
    <Link href="/despega/a2-routes">
      <div className={`text-xs font-semibold px-3 py-1.5 rounded-full border border-current/20 ${getStatusColor()} hover:opacity-80 transition-opacity cursor-pointer`}>
        Mes {progress.current_month} • {progress.progress_percentage}%
      </div>
    </Link>
  )
}
