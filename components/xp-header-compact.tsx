'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/hooks/use-user'
import { Badge } from '@/components/ui/badge'
import { Zap, TrendingUp, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface XPData {
  total_xp: number
  current_level: number
  xp_to_next_level: number
  xp_progress_percent: number
}

interface XPHeaderProps {
  onInfoClick?: () => void
}

export function XPHeaderCompact({ onInfoClick }: XPHeaderProps) {
  const { user } = useUser()
  const [xpData, setXpData] = useState<XPData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      loadXPData()
      const interval = setInterval(loadXPData, 15000) // Refresh every 15s
      return () => clearInterval(interval)
    }
  }, [user?.email])

  const loadXPData = async () => {
    if (!user?.email) return
    try {
      const response = await fetch(
        `/api/gamification/premium?userEmail=${encodeURIComponent(user.email)}`
      )
      if (response.ok) {
        const data = await response.json()
        setXpData({
          total_xp: data.total_xp,
          current_level: data.current_level,
          xp_to_next_level: data.xp_to_next_level,
          xp_progress_percent: (data.phase_xp['current'] / 1000) * 100
        })
      }
    } catch (error) {
      console.error('[v0] Error loading XP data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !xpData) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-[28px] bg-muted/20 dark:bg-muted/70 animate-pulse w-48 h-10" />
    )
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-[28px] bg-background">
      {/* XP DISPLAY */}
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-amber-500" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted/60 dark:text-muted/40">XP</span>
          <span className="text-sm font-bold text-cyan dark:text-cyan/30">
            {xpData.total_xp.toLocaleString()}
          </span>
        </div>
      </div>

      {/* LEVEL BADGE */}
      <Badge className="bg-background">
        Nivel {xpData.current_level}
      </Badge>

      {/* PROGRESS BAR */}
      <div className="flex-1 h-1.5 bg-muted/30 dark:bg-muted/70 rounded-full overflow-hidden">
        <div
          className="h-full bg-background"
          style={{ width: `${Math.min(xpData.xp_progress_percent, 100)}%` }}
        />
      </div>

      {/* INFO BUTTON */}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={onInfoClick}
        title="Ver cómo ganar XP"
      >
        <Info className="w-4 h-4 text-cyan dark:text-cyan/40" />
      </Button>
    </div>
  )
}
