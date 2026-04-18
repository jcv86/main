"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Award, Medal, Zap, Target, Star, Flame, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface BadgeType {
  id: string
  badge_name: string
  description: string
  earned_at: string
  icon?: string
}

// Badge definitions
const BADGE_DEFINITIONS: Record<string, { name: string; icon: string; color: string; requirement: string }> = {
  "first-article": {
    name: "Lector Principiante",
    icon: "📖",
    color: "bg-blue-500/10",
    requirement: "Lee tu primer artículo",
  },
  "5-articles": {
    name: "Lector Ávido",
    icon: "📚",
    color: "bg-green-500/10",
    requirement: "Lee 5 artículos",
  },
  "test-master": {
    name: "Maestro de Tests",
    icon: "🧠",
    color: "bg-purple-500/10",
    requirement: "Completa 5 tests",
  },
  "100-points": {
    name: "Coleccionista de Puntos",
    icon: "💎",
    color: "bg-orange/10",
    requirement: "Acumula 100 puntos",
  },
  "social-butterfly": {
    name: "Mariposa Social",
    icon: "🦋",
    color: "bg-pink-500/10",
    requirement: "Comparte 10 artículos",
  },
  "research-scholar": {
    name: "Investigador Erudito",
    icon: "🔬",
    color: "bg-indigo-500/10",
    requirement: "Accede a todas las categorías",
  },
}

// Sample earned badges
const earnedBadges: BadgeType[] = [
  {
    id: "first-article",
    badge_name: "Lector Principiante",
    description: "Leíste tu primer artículo",
    earned_at: "2024-01-15",
  },
  {
    id: "5-articles",
    badge_name: "Lector Ávido",
    description: "Completaste 5 artículos",
    earned_at: "2024-01-20",
  },
  {
    id: "100-points",
    badge_name: "Coleccionista de Puntos",
    description: "Acumulaste 100 puntos",
    earned_at: "2024-02-01",
  },
]

export function PointsBadgesSystem() {
  const [userPoints, setUserPoints] = useState(2450)
  const [currentRank, setCurrentRank] = useState({
    rank: 42,
    points: 2450,
    totalPlayers: 1250,
  })

  const unlockedBadgeIds = new Set(earnedBadges.map(b => b.id))
  const allBadges = Object.entries(BADGE_DEFINITIONS).map(([id, def]) => ({
    id,
    ...def,
    unlocked: unlockedBadgeIds.has(id),
  }))

  const pointsToNextRank = ((currentRank.rank - 1) * 500) - userPoints
  const progressToNextRank = (userPoints / ((currentRank.rank - 1) * 500)) * 100

  return (
    <div className="space-y-4">
      {/* Ranking Card */}
      <Card className="border-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/5 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Tu Ranking</p>
              <div className="text-3xl font-bold">#42</div>
              <p className="text-xs text-muted-foreground mt-1">de 1,250 usuarios</p>
            </div>
            <div className="text-center border-l border-r">
              <p className="text-xs text-muted-foreground mb-1">Puntos Totales</p>
              <div className="text-3xl font-bold text-purple">{userPoints}</div>
              <p className="text-xs text-muted-foreground mt-1">Activos</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Insignias</p>
              <div className="text-3xl font-bold">{earnedBadges.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Desbloqueadas</p>
            </div>
          </div>

          {/* Progress to Next Rank */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Hacia el próximo rango</span>
              <span className="font-medium">{pointsToNextRank > 0 ? pointsToNextRank : 0} puntos</span>
            </div>
            <Progress value={Math.min(progressToNextRank, 100)} />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="badges">Insignias ({earnedBadges.length})</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          {/* Earned Badges */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Insignias Desbloqueadas</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allBadges
                .filter(b => b.unlocked)
                .map(badge => (
                  <Card key={badge.id} className="border-0 bg-card/70 backdrop-blur-sm">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <p className="text-xs font-medium line-clamp-2">{badge.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.requirement}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Locked Badges */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Insignias Disponibles</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allBadges
                .filter(b => !b.unlocked)
                .map(badge => (
                  <Card key={badge.id} className="border-0 bg-muted/30 backdrop-blur-sm opacity-60">
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2 opacity-30">{badge.icon}</div>
                        <p className="text-xs font-medium line-clamp-2">{badge.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{badge.requirement}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="border-0 bg-card/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Top 10 Jugadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Juan Pérez", points: 5230, badge: "🥇" },
                  { rank: 2, name: "María García", points: 4890, badge: "🥈" },
                  { rank: 3, name: "Carlos López", points: 4650, badge: "🥉" },
                  { rank: 4, name: "Ana Martínez", points: 4120, badge: "4️⃣" },
                  { rank: 5, name: "Diego Rodríguez", points: 3890, badge: "5️⃣" },
                  { rank: 42, name: "Tú", points: userPoints, badge: "👤", isCurrent: true },
                ].map(entry => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isCurrent ? "bg-purple/10 border border-purple/20" : "bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{entry.badge}</span>
                      <span className="font-medium text-sm">{entry.name}</span>
                    </div>
                    <span className="font-bold text-sm">{entry.points} pts</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
