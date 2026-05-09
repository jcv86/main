'use client'

import { Badge as BadgeData } from '@/app/despega/a3/data/mock-dashboard'
import { Trophy, Lock } from 'lucide-react'

interface BadgesGridProps {
  badges: BadgeData[]
}

export function BadgesGrid({ badges }: BadgesGridProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Badges Desbloqueables</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-lg border transition ${
                badge.unlocked
                  ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 hover:border-yellow-500/80'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                      : 'bg-white/10'
                  }`}
                >
                  {badge.unlocked ? (
                    <Trophy className="w-5 h-5 text-white" />
                  ) : (
                    <Lock className="w-5 h-5 text-white/40" />
                  )}
                </div>
                <h4 className={`text-sm font-semibold ${badge.unlocked ? 'text-white' : 'text-white/60'}`}>
                  {badge.title}
                </h4>
                <p className={`text-xs ${badge.unlocked ? 'text-white/70' : 'text-white/40'}`}>
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
