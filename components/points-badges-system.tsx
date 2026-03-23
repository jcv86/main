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
    color: "bg-yellow-500/10",
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
              <div className="text-3xl font-bold text-primary">{userPoints}</div>
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
                      entry.isCurrent ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
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
    requirement: "Lee 5 artículos",
  },
  "10-articles": {
    name: "Experto Lector",
    icon: "🎯",
    color: "bg-purple-500/10",
    requirement: "Lee 10 artículos",
  },
  "first-test": {
    name: "Estudiante",
    icon: "✅",
    color: "bg-amber-500/10",
    requirement: "Completa tu primera prueba",
  },
  "5-tests": {
    name: "Académico",
    icon: "🏆",
    color: "bg-orange-500/10",
    requirement: "Completa 5 pruebas",
  },
  "perfect-score": {
    name: "Perfeccionista",
    icon: "⭐",
    color: "bg-yellow-500/10",
    requirement: "Obtén 100% en una prueba",
  },
  "streak-7": {
    name: "Consistencia",
    icon: "🔥",
    color: "bg-red-500/10",
    requirement: "7 días consecutivos activo",
  },
  "streak-30": {
    name: "Maestría",
    icon: "👑",
    color: "bg-indigo-500/10",
    requirement: "30 días consecutivos activo",
  },
  "social-butterfly": {
    name: "Mariposa Social",
    icon: "🦋",
    color: "bg-pink-500/10",
    requirement: "Comparte 5 artículos",
  },
  "knowledge-hub": {
    name: "Centro de Conocimiento",
    icon: "🌟",
    color: "bg-cyan-500/10",
    requirement: "Guarda 10 recursos",
  },
}

export function PointsBadgesSystem() {
  const { data: session } = useSession()
  const [points, setPoints] = useState(0)
  const [badges, setBadges] = useState<Badge[]>([])
  const [pointsHistory, setPointsHistory] = useState<any[]>([])
  const [rank, setRank] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return
    loadData()
  }, [session?.user?.id])

  const loadData = async () => {
    if (!session?.user?.id) return

    try {
      const [pointsData, badgesData, historyData, rankData] = await Promise.all([
        getUserPoints(session.user.id),
        getUserBadges(session.user.id),
        getPointsHistory(session.user.id, 10),
        getUserRank(session.user.id),
      ])

      setPoints(pointsData)
      setBadges(badgesData)
      setPointsHistory(historyData)
      setRank(rankData)
    } catch (error) {
      console.error("[v0] Error loading points/badges:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardContent className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Total Points */}
        <Card className="border-0 bg-gradient-to-br from-yellow-500/5 to-amber-500/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Puntos Totales</p>
                <p className="text-4xl font-bold text-primary">{points}</p>
              </div>
              <div className="p-4 bg-yellow-500/20 rounded-lg">
                <Zap className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badges Earned */}
        <Card className="border-0 bg-gradient-to-br from-purple-500/5 to-pink-500/10 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Insignias Ganadas</p>
                <p className="text-4xl font-bold text-primary">{badges.length}</p>
                <p className="text-xs text-muted-foreground mt-1">de {Object.keys(BADGE_DEFINITIONS).length}</p>
              </div>
              <div className="p-4 bg-purple-500/20 rounded-lg">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rank */}
        {rank && (
          <Card className="border-0 bg-gradient-to-br from-orange-500/5 to-red-500/10 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tu Ranking</p>
                  <p className="text-4xl font-bold text-primary">#{rank.rank}</p>
                  <p className="text-xs text-muted-foreground mt-1">en la plataforma</p>
                </div>
                <div className="p-4 bg-orange-500/20 rounded-lg">
                  <Trophy className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Earned Badges */}
      {badges.length > 0 && (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Tus Insignias</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {badges.map((badge) => {
                const def = BADGE_DEFINITIONS[badge.badge_id as keyof typeof BADGE_DEFINITIONS]
                return (
                  <div
                    key={badge.id}
                    className={`p-3 rounded-lg border border-border/50 ${def?.color || "bg-muted/50"} text-center`}
                  >
                    <div className="text-3xl mb-2">{def?.icon || "🏅"}</div>
                    <h4 className="font-medium text-xs line-clamp-2">{def?.name || badge.badge_name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(badge.earned_at).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Badges (Not Yet Earned) */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-base">Insignias por Desbloquear</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(BADGE_DEFINITIONS).map(([id, def]) => {
              const isEarned = badges.some((b) => b.badge_id === id)
              return (
                <div
                  key={id}
                  className={`p-3 rounded-lg border ${
                    isEarned
                      ? `${def.color} border-border/50`
                      : "bg-muted/30 border-border/30 opacity-50"
                  } text-center`}
                >
                  <div className={`text-3xl mb-2 ${!isEarned ? "grayscale opacity-50" : ""}`}>
                    {def.icon}
                  </div>
                  <h4 className="font-medium text-xs line-clamp-2">{def.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{def.requirement}</p>
                  {!isEarned && (
                    <Badge variant="outline" className="text-xs mt-2">
                      🔒 Bloqueado
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Points History */}
      {pointsHistory.length > 0 && (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Historial de Puntos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {pointsHistory.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.razon}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.created_at).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    +{entry.puntos_ganados}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saldo: {entry.balance_nuevo}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Achievements Info */}
      <Card className="border-0 bg-blue-500/5 border border-blue-500/20 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Medal className="w-4 h-4" />
              ¿Cómo Ganar Puntos?
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex gap-2">
                <span>✓</span>
                <span>Leer un artículo: +1 punto</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Compartir un artículo: +2 puntos</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Completar una prueba: +5 puntos (+ bonificación por score)</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Guardar un recurso: +1 punto</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Completar un caso de estudio: +10 puntos</span>
              </li>
              <li className="flex gap-2">
                <span>✓</span>
                <span>Racha de 7 días: +50 puntos</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
