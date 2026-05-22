'use client'

import useSWR from 'swr'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { ProgressThermometerBadge } from './progress-thermometer-badge'

interface XPData {
  total_xp: number
  current_level: number
  xp_to_next_level: number
  daily_streak: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function XPNavbarBadge() {
  const { data: xpData, isLoading } = useSWR<XPData>(
    '/api/gamification/global',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000, // Actualiza cada 5 segundos
      dedupingInterval: 2000,
    }
  )

  if (isLoading || !xpData) return null

  // Calcula XP al siguiente nivel como porcentaje
  const xpPercentage = ((xpData.total_xp % 1000) / 1000) * 100
  const levelLabel = `L${xpData.current_level}`

  return (
    <Link href="/despega/progress">
      <div className="flex items-center gap-3">
        {/* Thermometer Badge for XP Progress */}
        <ProgressThermometerBadge
          percentage={Math.round(xpPercentage)}
          label={levelLabel}
          color="cyan"
        />

        {/* XP Total Display */}
        <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-purple-500/5 border border-white/10 hover:bg-white/10 transition-all">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-white/90">
            {(xpData.total_xp / 1000).toFixed(1)}k
          </span>
        </div>

        {/* Streak Indicator */}
        {xpData.daily_streak > 0 && (
          <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-all">
            <span className="text-sm">🔥</span>
            <span className="text-xs font-semibold text-orange-400">{xpData.daily_streak}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
