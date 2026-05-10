'use client'

import { useEffect, useState } from 'react'
import { Badge as BadgeType, BADGES } from '@/lib/badge-system'
import { Card } from '@/components/ui/card'

interface AchievementBadgeProps {
  badge: BadgeType
  unlocked: boolean
  isNewlyUnlocked?: boolean
}

export function AchievementBadge({ badge, unlocked, isNewlyUnlocked }: AchievementBadgeProps) {
  const [showAnimation, setShowAnimation] = useState(isNewlyUnlocked)

  useEffect(() => {
    if (isNewlyUnlocked) {
      const timer = setTimeout(() => setShowAnimation(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isNewlyUnlocked])

  return (
    <div className="relative">
      {/* Glow animation for newly unlocked badges */}
      {showAnimation && (
        <div className="absolute inset-0 animate-pulse rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      )}

      <Card
        className={`
          p-6 text-center transition-all duration-300
          ${
            unlocked
              ? `bg-gradient-to-br ${badge.color} border-0 shadow-lg hover:shadow-xl hover:scale-105`
              : 'bg-muted/40 border border-muted/60 opacity-50 grayscale'
          }
        `}
      >
        <div className="space-y-2">
          <div className="text-4xl">{badge.icon}</div>
          <h3 className={`font-bold text-sm ${unlocked ? 'text-white' : 'text-muted-foreground'}`}>
            {badge.title}
          </h3>
          <p className={`text-xs ${unlocked ? 'text-white/90' : 'text-muted-foreground/70'}`}>
            {badge.description}
          </p>
          {!unlocked && (
            <p className="text-xs text-muted-foreground/60 mt-2">
              {badge.requiredPercentage}% de tareas
            </p>
          )}
        </div>

        {showAnimation && (
          <div className="mt-3 text-xs font-semibold text-white animate-bounce">
            ¡Desbloqueado!
          </div>
        )}
      </Card>
    </div>
  )
}

interface AchievementsDisplayProps {
  completedTasks: number
  totalTasks: number
  newlyUnlockedBadges?: string[]
}

export function AchievementsDisplay({
  completedTasks,
  totalTasks,
  newlyUnlockedBadges = []
}: AchievementsDisplayProps) {
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const unlockedBadgeIds = new Set<string>()

  Object.entries(BADGES).forEach(([id, badge]) => {
    if (completionPercentage >= badge.requiredPercentage) {
      unlockedBadgeIds.add(id)
    }
  })

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-muted/40 border border-muted/60 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-white">Progreso General</span>
          <span className="text-2xl font-bold text-white">{Math.round(completionPercentage)}%</span>
        </div>
        <div className="w-full bg-muted/60 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-white/60 mt-2">
          {completedTasks} de {totalTasks} tareas completadas
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(BADGES).map(([id, badge]) => (
          <AchievementBadge
            key={id}
            badge={badge}
            unlocked={unlockedBadgeIds.has(id)}
            isNewlyUnlocked={newlyUnlockedBadges?.includes(id)}
          />
        ))}
      </div>
    </div>
  )
}

