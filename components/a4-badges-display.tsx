'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Zap, Flame, Target, BookOpen, Brain } from 'lucide-react'

export interface A4Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: string
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary'
}

export interface A4PointsData {
  currentPoints: number
  pointsThisWeek: number
  pointsThisMonth: number
  level: number
  nextLevelPoints: number
  badges: A4Badge[]
  streakDays: number
}

interface A4BadgesDisplayProps {
  data: A4PointsData
}

const RARITY_COLORS = {
  common: 'bg-muted/10 text-gray-800 dark:bg-transparent/30 dark:text-muted/30 border-muted/30',
  uncommon: 'bg-green/10 text-green dark:bg-green/30 dark:text-green/30 border-green/30',
  rare: 'bg-blue/10 text-blue dark:bg-blue/30 dark:text-blue/30 border-blue/30',
  legendary: 'bg-purple/10 text-purple dark:bg-purple/30 dark:text-purple/30 border-purple/30',
}

const BADGE_ICONS: Record<string, string> = {
  'Explorador': '🔍',
  'Lector Voraz': '📚',
  'Participante': '🎯',
  'Experto': '🏆',
  'Estratega': '♟️',
  'Conexiones': '🤝',
  'Consistente': '🔥',
  'Innovador': '💡',
  'Maestría': '👑',
}

export function A4BadgesDisplay({ data }: A4BadgesDisplayProps) {
  const progressPercent = (data.currentPoints % data.nextLevelPoints) / data.nextLevelPoints * 100

  return (
    <div className="space-y-6">
      {/* Points and Level Section */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple" />
            Puntos y Nivel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple">{data.currentPoints}</div>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue">{data.pointsThisWeek}</div>
              <p className="text-xs text-muted-foreground mt-1">Esta semana</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{data.pointsThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Este mes</p>
            </div>
          </div>

          <div className="bg-white/50 dark:bg-black/20 p-4 rounded-[28px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Nivel {data.level}</span>
              <span className="text-xs text-muted-foreground">
                {data.currentPoints % data.nextLevelPoints} / {data.nextLevelPoints} puntos
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {data.streakDays > 0 && (
            <div className="flex items-center gap-2 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-[28px] border border-amber-200 dark:border-amber-800">
              <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Racha de {data.streakDays} días
                </p>
                <p className="text-xs text-amber-800/70 dark:text-amber-300/70">
                  Mantén tu actividad para no perder la racha
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Badges Section */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            Logros ({data.badges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.badges.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data.badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-[28px] border-2 text-center transition-all hover:shadow-lg ${
                    RARITY_COLORS[badge.rarity]
                  }`}
                >
                  <div className="text-3xl mb-2">{BADGE_ICONS[badge.name] || '⭐'}</div>
                  <p className="font-semibold text-sm mb-1">{badge.name}</p>
                  <p className="text-xs opacity-75">{badge.description}</p>
                  <p className="text-xs opacity-50 mt-2">
                    {new Date(badge.earnedAt).toLocaleDateString('es-CL')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">Aún no has ganado badges</p>
              <p className="text-xs text-muted-foreground mt-1">Completa actividades para ganar logros</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Stats */}
      <Card className="border-0 bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Próximos Logros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-3">
            {[
              { icon: BookOpen, title: 'Lector Voraz', progress: 7, total: 10, description: 'Lee 10 artículos' },
              { icon: Brain, title: 'Estratega', progress: 3, total: 5, description: 'Completa 5 tests' },
              { icon: Target, title: 'Consistente', progress: 12, total: 30, description: '30 días activo' },
            ].map((achievement, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-1">
                  {achievement.icon && <achievement.icon className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm font-medium">{achievement.title}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {achievement.progress}/{achievement.total}
                  </span>
                </div>
                <Progress value={(achievement.progress / achievement.total) * 100} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
