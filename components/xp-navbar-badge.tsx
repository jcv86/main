'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/use-user'
import { Badge } from '@/components/ui/badge'
import { Zap, TrendingUp, Award } from 'lucide-react'
import Link from 'next/link'

interface XPData {
  total_xp: number
  current_level: number
  xp_to_next_level: number
  daily_streak: number
  phase: string
}

export function XPNavbarBadge() {
  const { user } = useUser()
  const [xpData, setXPData] = useState<XPData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      loadXPData()
      const interval = setInterval(loadXPData, 60000) // Refresh every 60s
      return () => clearInterval(interval)
    }
  }, [user?.email])

  const loadXPData = async () => {
    if (!user?.email) return
    try {
      // Try global endpoint first (consolidated data from all sections)
      const response = await fetch(`/api/gamification/global`)
      if (response.ok) {
        const data = await response.json()
        setXPData({
          total_xp: data.total_xp,
          current_level: data.current_level,
          xp_to_next_level: data.xp_to_next_level,
          daily_streak: data.daily_streak,
          phase: 'Global'
        })
      }
    } catch (error) {
      console.error('[v0] Error loading XP data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !xpData) return null

  const xpPercentage = ((xpData.total_xp % 1000) / 1000) * 100

  return (
    <Link href="/despega/progress">
      <div className="flex items-center gap-3 px-3 py-1.5 rounded-[28px] bg-background">
        {/* XP Display */}
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-bold text-foreground">
            {xpData.total_xp.toLocaleString()}
          </span>
          <span className="text-xs text-foreground/60">XP</span>
        </div>

        {/* Level Badge */}
        <Badge className="bg-cyan hover:bg-cyan text-white text-xs">
          Lv. {xpData.current_level}
        </Badge>

        {/* Streak Indicator */}
        {xpData.daily_streak > 0 && (
          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-orange/50/20 border border-orange/30">
            <span className="text-lg">🔥</span>
            <span className="text-xs font-semibold text-orange">{xpData.daily_streak}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
