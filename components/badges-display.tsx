'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Lock } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export interface BadgeData {
  id: string
  name: string
  description: string
  icon_url: string
  earned_at?: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface BadgesDisplayProps {
  earnedBadges: BadgeData[]
  totalBadgesAvailable?: number
}

const RARITY_COLORS: Record<string, string> = {
  common: 'bg-muted/10 dark:bg-muted/80 border-muted/30',
  rare: 'bg-blue/10 dark:bg-blue/30 border-blue/30',
  epic: 'bg-purple/10 dark:bg-purple/30 border-purple/30',
  legendary: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300'
}

const RARITY_RING: Record<string, string> = {
  common: 'ring-slate-300',
  rare: 'ring-blue-400',
  epic: 'ring-purple-400',
  legendary: 'ring-amber-400'
}

export function BadgesDisplay({ earnedBadges, totalBadgesAvailable = 24 }: BadgesDisplayProps) {
  const unlockedCount = earnedBadges.length
  const completionPercentage = (unlockedCount / totalBadgesAvailable) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Insignias
          </CardTitle>
          <Badge variant="outline">
            {unlockedCount}/{totalBadgesAvailable}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Completion Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Progreso de Insignias</span>
            <span className="text-xs opacity-75">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="h-3 bg-muted/20 dark:bg-muted/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          <TooltipProvider>
            {Array.from({ length: totalBadgesAvailable }).map((_, i) => {
              const badge = earnedBadges.find(b => b.id === `badge-${i}`)
              const isEarned = !!badge

              return (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div
                      className={`relative aspect-square rounded-lg flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                        isEarned
                          ? `${RARITY_COLORS[badge?.rarity || 'common']} ring-2 ${RARITY_RING[badge?.rarity || 'common']}`
                          : 'bg-muted/20 dark:bg-muted/80 opacity-40'
                      }`}
                    >
                      {isEarned ? (
                        <div className="text-2xl">{badge?.icon_url}</div>
                      ) : (
                        <Lock className="w-4 h-4 text-muted/40" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isEarned ? (
                      <div className="text-center">
                        <p className="font-bold">{badge?.name}</p>
                        <p className="text-xs opacity-75">{badge?.description}</p>
                        <p className="text-xs mt-1">
                          {badge?.rarity.charAt(0).toUpperCase() + badge?.rarity.slice(1)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs">Bloqueada</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </TooltipProvider>
        </div>

        {/* Recent Badges */}
        {earnedBadges.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Insignias Recientes</h4>
            <div className="space-y-2">
              {earnedBadges.slice(0, 5).map((badge) => (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${RARITY_COLORS[badge.rarity]}`}
                >
                  <div className="text-2xl">{badge.icon_url}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{badge.name}</p>
                    <p className="text-xs opacity-75">{badge.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {badge.rarity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
