'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Zap, Flame, Trophy, Star } from 'lucide-react'

export interface XPProgressProps {
  currentLevel: number
  currentXP: number
  xpForNextLevel: number
  currentStreak: number
  totalInterviews: number
}

const LEVEL_TITLES: Record<number, string> = {
  1: 'Principiante',
  2: 'Aprendiz',
  3: 'Practicante',
  4: 'Competente',
  5: 'Avanzado',
  6: 'Experto',
  7: 'Maestro',
  8: 'Leyenda'
}

const LEVEL_COLORS: Record<number, { bg: string; text: string; accent: string }> = {
  1: { bg: 'bg-muted/10 dark:bg-transparent', text: 'text-muted-foreground dark:text-white/85', accent: 'from-slate-400600' },
  2: { bg: 'bg-green/10 dark:bg-green/30', text: 'text-green dark:text-green/30', accent: 'from-green-400600' },
  3: { bg: 'bg-blue/10 dark:bg-blue/30', text: 'text-blue dark:text-blue-200', accent: 'from-blue-400600' },
  4: { bg: 'bg-purple/10 dark:bg-purple/30', text: 'text-purple dark:text-purple/20', accent: 'from-purple-400' },
  5: { bg: 'bg-orange/10 dark:bg-orange/30', text: 'text-orange dark:text-orange/30', accent: 'from-orange-400600' },
  6: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', accent: 'from-amber-400600' },
  7: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-700 dark:text-rose-300', accent: 'from-rose-400600' },
  8: { bg: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', text: 'text-fuchsia-700 dark:text-fuchsia-300', accent: 'from-fuchsia-400600' }
}

export function XPProgressDisplay({
  currentLevel,
  currentXP,
  xpForNextLevel,
  currentStreak,
  totalInterviews
}: XPProgressProps) {
  const [xpPercentage, setXpPercentage] = useState(0)
  const [levelTitle, setLevelTitle] = useState('')

  useEffect(() => {
    setXpPercentage((currentXP / xpForNextLevel) * 100)
    setLevelTitle(LEVEL_TITLES[Math.min(currentLevel, 8)])
  }, [currentLevel, currentXP, xpForNextLevel])

  const colors = LEVEL_COLORS[Math.min(currentLevel, 8)]

  return (
    <div className="space-y-4">
      {/* Level Card */}
      <Card className={`border-2 ${colors.bg}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={colors.text}>
                Nivel {currentLevel}
              </CardTitle>
              <p className={`text-sm ${colors.text} opacity-75`}>{levelTitle}</p>
            </div>
            <div className={`text-3xl font-bold ${colors.text}`}>
              {currentLevel}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">Experiencia</span>
              <span className="text-xs opacity-75">
                {currentXP} / {xpForNextLevel} XP
              </span>
            </div>
            <Progress
              value={xpPercentage}
              className="h-3"
            />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/50 dark:bg-black/20 rounded-[28px] p-3">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange" />
                <span className="text-xs font-semibold">Racha</span>
              </div>
              <p className="text-xl font-bold">{currentStreak}</p>
              <p className="text-xs opacity-75">días seguidos</p>
            </div>

            <div className="bg-white/50 dark:bg-black/20 rounded-[28px] p-3">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold">Entrevistas</span>
              </div>
              <p className="text-xl font-bold">{totalInterviews}</p>
              <p className="text-xs opacity-75">completadas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Progresión de Niveles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {Array.from({ length: 8 }).map((_, i) => {
              const level = i + 1
              const isReached = level <= currentLevel
              const isCurrent = level === currentLevel

              return (
                <div
                  key={level}
                  className={`flex flex-col items-center gap-1 min-w-fit ${
                    isReached ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      isCurrent
                        ? 'bg-background'
                        : isReached
                        ? `${LEVEL_COLORS[level].bg} ${LEVEL_COLORS[level].text}`
                        : 'bg-muted/20 dark:bg-muted/70 text-muted-foreground'
                    }`}
                  >
                    {level}
                  </div>
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {LEVEL_TITLES[level].split(' ')[0]}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
