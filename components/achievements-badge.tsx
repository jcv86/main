'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Zap, Target, Award } from 'lucide-react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: any
  color: string
  unlocked: boolean
  points: number
}

const achievements: Achievement[] = [
  {
    id: 'first-step',
    name: 'Primer Paso',
    description: 'Completa tu primer test DISC',
    icon: Target,
    color: 'from-blue-500600',
    unlocked: true,
    points: 10,
  },
  {
    id: 'week-one',
    name: 'Primera Semana',
    description: 'Mantén una racha de 7 días',
    icon: Zap,
    color: 'from-amber-500600',
    unlocked: false,
    points: 25,
  },
  {
    id: 'training-master',
    name: 'Maestro de Entrenamientos',
    description: 'Completa 10 entrenamientos',
    icon: Trophy,
    color: 'from-purple-500',
    unlocked: false,
    points: 50,
  },
  {
    id: 'knowledge-seeker',
    name: 'Buscador de Conocimiento',
    description: 'Lee 50 artículos de noticias',
    icon: Star,
    color: 'from-emerald-500600',
    unlocked: false,
    points: 40,
  },
  {
    id: 'transformation-complete',
    name: 'Transformación Completada',
    description: 'Finaliza tu viaje de 90 días',
    icon: Award,
    color: 'from-rose-500600',
    unlocked: false,
    points: 100,
  },
]

export function AchievementsBadge() {
  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalPoints = achievements.reduce((sum, a) => sum + (a.unlocked ? a.points : 0), 0)

  return (
    <Card className="border-0 bg-card/70 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Summary */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Logros Desbloqueados</p>
              <p className="text-3xl font-bold">{unlockedCount}/5</p>
              <p className="text-xs text-muted-foreground mt-1">{totalPoints} puntos ganados</p>
            </div>
            <Trophy className="w-12 h-12 text-amber-500" />
          </div>

          {/* Achievement Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-[28px] text-center transition-all ${`}
                    achievement.unlocked
                      ? `bg-background
                      : 'bg-muted text-muted-foreground opacity-50'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-xs font-semibold">{achievement.name}</p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    +{achievement.points}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
