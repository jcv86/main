'use client'

import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Award, Flame, Star, Trophy } from 'lucide-react'

interface GamificationProfileProps {
  userId: string
  level: string
  currentXp: number
  totalXp: number
  streak: number
  bestStreak: number
  interviewsCompleted: number
  badges: string[]
  totalTipsEarned: number
}

const XP_PER_LEVEL = 1000

const LEVEL_ICONS: Record<string, string> = {
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Diamond: '🏆',
  Elite: '👑',
}

const BADGE_ICONS: Record<string, string> = {
  'First Interview': '🎬',
  'Interview Starter': '🎯',
  'Interview Master': '🏆',
  'Interview Legend': '👑',
  'Week Warrior': '🔥',
  'Monthly Master': '⚡',
  'Perfect Score': '💯',
  'Bronze Graduate': '🥉',
  'Silver Climber': '🥈',
  'Gold Achiever': '🥇',
}

export function GamificationProfile({
  level,
  currentXp,
  totalXp,
  streak,
  bestStreak,
  interviewsCompleted,
  badges,
  totalTipsEarned,
}: GamificationProfileProps) {
  const safeCurrentXp = Math.max(0, Math.min(XP_PER_LEVEL, currentXp))
  const xpPercentage = (safeCurrentXp / XP_PER_LEVEL) * 100
  const uniqueBadges = [...new Set(badges)]

  return (
    <div className="w-full space-y-6">
      <Card className="p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">
              Nivel actual
            </p>
            <div className="flex items-center gap-3">
              <span className="text-5xl">{LEVEL_ICONS[level] || '🎯'}</span>
              <div>
                <h2 className="text-3xl font-bold text-foreground">{level}</h2>
                <p className="text-muted-foreground">
                  XP total: {totalXp.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-4xl font-bold text-training mb-1">
              {interviewsCompleted}
            </div>
            <p className="text-sm text-muted-foreground">Entrevistas completadas</p>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-semibold text-muted-foreground">
              Progreso del nivel
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              {safeCurrentXp}/{XP_PER_LEVEL} XP
            </p>
          </div>
          <Progress value={xpPercentage} className="h-3" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 md:grid-cols-4">
          <div className="rounded-[20px] bg-muted/10 p-4 text-center">
            <Flame className="w-6 h-6 text-red mx-auto mb-2" />
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-xs text-muted-foreground">Racha actual</p>
          </div>
          <div className="rounded-[20px] bg-muted/10 p-4 text-center">
            <Trophy className="w-6 h-6 text-orange mx-auto mb-2" />
            <p className="text-2xl font-bold">{bestStreak}</p>
            <p className="text-xs text-muted-foreground">Mejor racha</p>
          </div>
          <div className="rounded-[20px] bg-muted/10 p-4 text-center">
            <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{totalTipsEarned}</p>
            <p className="text-xs text-muted-foreground">Consejos obtenidos</p>
          </div>
          <div className="rounded-[20px] bg-muted/10 p-4 text-center">
            <Award className="w-6 h-6 text-training mx-auto mb-2" />
            <p className="text-2xl font-bold">{uniqueBadges.length}</p>
            <p className="text-xs text-muted-foreground">Logros</p>
          </div>
        </div>
      </Card>

      {uniqueBadges.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-training" />
            Logros
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uniqueBadges.map((badge) => (
              <div key={badge} className="flex flex-col items-center gap-2 p-4">
                <span className="text-4xl">{BADGE_ICONS[badge] || '🎖️'}</span>
                <p className="text-xs font-semibold text-center text-foreground">
                  {badge}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
