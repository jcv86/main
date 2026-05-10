'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Flame, Trophy, Star, Zap, Award } from 'lucide-react'

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

const LEVEL_COLORS = {
  Bronze: 'from-amber-600700',
  Silver: 'from-gray-400500',
  Gold: 'from-yellow-400600',
  Platinum: 'from-cyan-400500',
  Diamond: 'from-indigo-500'
}

const LEVEL_ICONS = {
  Bronze: '🥉',
  Silver: '🥈',
  Gold: '🥇',
  Platinum: '💎',
  Diamond: ''
}

const BADGE_ICONS: Record<string, string> = {
  'First Interview': '🎬',
  'Interview Starter': '',
  'Interview Master': '',
  'Interview Legend': '👑',
  'Week Warrior': '🔥',
  'Monthly Master': '⚡',
  'Perfect Score': '💯',
  'Bronze Graduate': '🥉',
  'Silver Climber': '🥈',
  'Gold Achiever': '🥇'
}

export function GamificationProfile({
  userId,
  level,
  currentXp,
  totalXp,
  streak,
  bestStreak,
  interviewsCompleted,
  badges,
  totalTipsEarned
}: GamificationProfileProps) {
  const nextLevelXp = totalXp + 500
  const xpPercentage = (currentXp / 500) * 100

  return (
    <div className="w-full space-y-6">
      {/* Main Level Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-background"></div>
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground uppercase mb-2">Current Level</p>
              <div className="flex items-center gap-3">
                <span className="text-6xl">{LEVEL_ICONS[level as keyof typeof LEVEL_ICONS]}</span>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{level}</h2>
                  <p className="text-muted-foreground">Total XP: {totalXp.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue mb-2">{interviewsCompleted}</div>
              <p className="text-sm text-muted-foreground">Interviews Completed</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold text-muted">XP to Next Level</p>
              <p className="text-sm font-semibold text-muted">{currentXp}/500</p>
            </div>
            <Progress value={xpPercentage} className="h-3" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/50 rounded-[28px] p-4 text-center">
              <Flame className="w-6 h-6 text-red mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Current Streak</p>
            </div>
            <div className="bg-white/50 rounded-[28px] p-4 text-center">
              <Trophy className="w-6 h-6 text-orange mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{bestStreak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
            <div className="bg-white/50 rounded-[28px] p-4 text-center">
              <Star className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{totalTipsEarned}</p>
              <p className="text-xs text-muted-foreground">Tips Earned</p>
            </div>
            <div className="bg-white/50 rounded-[28px] p-4 text-center">
              <Award className="w-6 h-6 text-purple/50 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{badges.length}</p>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Badges Section */}
      {badges.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple/50" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge}
                className="flex flex-col items-center gap-2 p-4 bg-background"
              >
                <span className="text-4xl">
                  {BADGE_ICONS[badge] || '🎖️'}
                </span>
                <p className="text-xs font-semibold text-center text-foreground">
                  {badge}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Progress Path */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Level Progression Path</h3>
        <div className="flex items-center justify-between mb-6">
          {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].map((lvl, idx) => (
            <div key={lvl} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${
                  ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].indexOf(level) >= idx
                    ? 'bg-background'
                    : 'bg-muted/20 text-muted-foreground'
                }`}
              >
                {LEVEL_ICONS[lvl as keyof typeof LEVEL_ICONS]}
              </div>
              <p className="text-xs font-semibold text-muted-foreground mt-2">{lvl}</p>
              <p className="text-xs text-muted-foreground">
                {idx * 1000}-{(idx + 1) * 1000} XP
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Streak Information */}
      <Card className="p-6 bg-background">
        <div className="flex items-start gap-4">
          <Flame className="w-8 h-8 text-red flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-foreground">Maintain Your Streak!</h3>
            <p className="text-sm text-muted mt-2">
              {streak === 0
                ? 'Complete an interview today to start your streak!'
                : `You're on a ${streak}-day streak! Complete another interview tomorrow to keep it going.`}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
               Tip: Streaks are the best way to develop interview skills consistently
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
