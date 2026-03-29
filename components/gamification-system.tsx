"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Trophy,
  Star,
  Target,
  Flame,
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Zap,
  Crown,
  Medal,
} from "lucide-react"

interface Achievement {
  id: number
  achievement_type: string
  achievement_name: string
  description: string
  earned_at: string
  metadata: any
}

interface UserLevel {
  level: number
  xp: number
  xp_to_next: number
  title: string
}

interface Challenge {
  id: string
  name: string
  description: string
  target: number
  current: number
  reward_xp: number
  deadline: string
  type: "daily" | "weekly" | "monthly"
  completed: boolean
}

export default function GamificationSystem() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userLevel, setUserLevel] = useState<UserLevel>({
    level: 1,
    xp: 0,
    xp_to_next: 100,
    title: "Lector Novato",
  })
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  const { user } = useUser()

  useEffect(() => {
    if (user?.email) {
      loadGamificationData()
    }
  }, [user?.email])

  const loadGamificationData = async () => {
    if (!user?.email) return
    
    try {
      setLoading(true)

      // Fetch gamification data via API
      const response = await fetch(`/api/gamification?userEmail=${encodeURIComponent(user.email)}`)
      if (!response.ok) throw new Error("Failed to load gamification data")

      const { achievements: achievementsData, userLevel: levelData, challenges: challengesData, streak: streakData } = await response.json()

      setAchievements(achievementsData || [])
      setUserLevel(levelData || { level: 1, xp: 0, xp_to_next: 100, title: "Lector Novato" })
      setChallenges(challengesData || [])
      setStreak(streakData || 0)
    } catch (error) {
      console.error("[v0] Error loading gamification data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Cargando datos de gamificación...</div>
  }
      const dailyChallenges: Challenge[] = [
        {
          id: "daily_reading",
          name: "Lectura Diaria",
          description: "Lee durante al menos 30 minutos hoy",
          target: 30,
          current: Math.min(30, totalReadingTime % 30),
          reward_xp: 25,
          deadline: new Date().toISOString(),
          type: "daily",
          completed: totalReadingTime % 30 >= 30,
        },
      ]

      const weeklyChallenges: Challenge[] = [
        {
          id: "weekly_books",
          name: "Meta Semanal",
          description: "Completa 2 libros esta semana",
          target: 2,
          current: Math.min(2, completedBooks % 2),
          reward_xp: 100,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: "weekly",
          completed: completedBooks % 2 >= 2,
        },
      ]

      const monthlyChallenges: Challenge[] = [
        {
          id: "monthly_streak",
          name: "Racha Mensual",
          description: "Mantén una racha de lectura de 15 días",
          target: 15,
          current: Math.min(15, currentStreak),
          reward_xp: 200,
          deadline: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
          type: "monthly",
          completed: currentStreak >= 15,
        },
      ]

      setAchievements(achievementsData || [])
      setUserLevel({ level, xp, xp_to_next: xpToNext, title })
      setChallenges([...dailyChallenges, ...weeklyChallenges, ...monthlyChallenges])
      setStreak(currentStreak)
    } catch (error) {
      console.error("Error loading gamification data:", error)
    } finally {
      setLoading(false)
    }
  }

  const claimChallenge = async (challengeId: string) => {
    // In a real app, this would update the database and award XP
    setChallenges((prev) =>
      prev.map((challenge) => (challenge.id === challengeId ? { ...challenge, completed: true } : challenge)),
    )

    // Update user XP
    const challenge = challenges.find((c) => c.id === challengeId)
    if (challenge) {
      setUserLevel((prev) => ({
        ...prev,
        xp: prev.xp + challenge.reward_xp,
        xp_to_next: Math.max(0, prev.xp_to_next - challenge.reward_xp),
      }))
    }
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "first_book":
        return <BookOpen className="h-6 w-6 text-foreground" />
      case "five_books":
        return <Medal className="h-6 w-6 text-foreground" />
      case "ten_books":
        return <Trophy className="h-6 w-6 text-foreground" />
      case "ten_hours":
        return <Clock className="h-6 w-6 text-foreground" />
      case "streak_week":
        return <Flame className="h-6 w-6 text-foreground" />
      default:
        return <Award className="h-6 w-6 text-foreground" />
    }
  }

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "daily":
        return <Calendar className="h-5 w-5 text-foreground" />
      case "weekly":
        return <Target className="h-5 w-5 text-foreground" />
      case "monthly":
        return <Crown className="h-5 w-5 text-foreground" />
      default:
        return <Zap className="h-5 w-5 text-foreground" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Trophy className="h-12 w-12 animate-pulse mx-auto mb-4 text-yellow-600" />
          <p>Cargando sistema de logros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🏆 Sistema de Logros</h1>
        <p className="text-xl text-gray-600">Desbloquea logros y completa desafíos mientras lees</p>
      </div>

      {/* User Level Card */}
      <Card className="bg-foreground text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{userLevel.title}</CardTitle>
              <p className="text-blue-100">Nivel {userLevel.level}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{userLevel.xp} XP</div>
              <p className="text-blue-100">{userLevel.xp_to_next} XP para siguiente nivel</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progreso al Nivel {userLevel.level + 1}</span>
              <span>
                {Math.round(((userLevel.level * 100 - userLevel.xp_to_next) / (userLevel.level * 100)) * 100)}%
              </span>
            </div>
            <Progress
              value={((userLevel.level * 100 - userLevel.xp_to_next) / (userLevel.level * 100)) * 100}
              className="h-3 bg-neutral-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-foreground" />
              <div className="text-2xl font-bold">{achievements.length}</div>
              <p className="text-sm text-gray-600">Logros Desbloqueados</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 text-foreground" />
              <div className="text-2xl font-bold">{streak}</div>
              <p className="text-sm text-gray-600">Días de Racha</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-foreground" />
              <div className="text-2xl font-bold">{userLevel.level}</div>
              <p className="text-sm text-gray-600">Nivel Actual</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary">
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-foreground" />
              <div className="text-2xl font-bold">{userLevel.xp}</div>
              <p className="text-sm text-gray-600">Puntos de Experiencia</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Desafíos</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
          <TabsTrigger value="leaderboard">Clasificación</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Daily Challenges */}
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-foreground" />
                  Desafíos Diarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges
                  .filter((c) => c.type === "daily")
                  .map((challenge) => (
                    <div key={challenge.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{challenge.name}</h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                        </div>
                        <Badge variant={challenge.completed ? "default" : "outline"}>{challenge.reward_xp} XP</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>
                            {challenge.current}/{challenge.target}
                          </span>
                        </div>
                        <Progress value={(challenge.current / challenge.target) * 100} className="h-2 bg-neutral-200" />
                        {challenge.completed && (
                          <Button size="sm" className="w-full" onClick={() => claimChallenge(challenge.id)}>
                            Reclamar Recompensa
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Weekly Challenges */}
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-foreground" />
                  Desafíos Semanales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges
                  .filter((c) => c.type === "weekly")
                  .map((challenge) => (
                    <div key={challenge.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{challenge.name}</h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                        </div>
                        <Badge variant={challenge.completed ? "default" : "outline"}>{challenge.reward_xp} XP</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>
                            {challenge.current}/{challenge.target}
                          </span>
                        </div>
                        <Progress value={(challenge.current / challenge.target) * 100} className="h-2 bg-neutral-200" />
                        {challenge.completed && (
                          <Button size="sm" className="w-full" onClick={() => claimChallenge(challenge.id)}>
                            Reclamar Recompensa
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Monthly Challenges */}
            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-foreground" />
                  Desafíos Mensuales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenges
                  .filter((c) => c.type === "monthly")
                  .map((challenge) => (
                    <div key={challenge.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{challenge.name}</h4>
                          <p className="text-sm text-gray-600">{challenge.description}</p>
                        </div>
                        <Badge variant={challenge.completed ? "default" : "outline"}>{challenge.reward_xp} XP</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>
                            {challenge.current}/{challenge.target}
                          </span>
                        </div>
                        <Progress value={(challenge.current / challenge.target) * 100} className="h-2 bg-neutral-200" />
                        {challenge.completed && (
                          <Button size="sm" className="w-full" onClick={() => claimChallenge(challenge.id)}>
                            Reclamar Recompensa
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="border-2 border-yellow-200 bg-secondary">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center text-foreground">
                      {getAchievementIcon(achievement.achievement_type)}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{achievement.achievement_name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <Badge variant="default" className="bg-yellow-600 text-white">
                      Desbloqueado
                    </Badge>
                    <p className="text-xs text-gray-500 mt-2">{new Date(achievement.earned_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Locked Achievements */}
            <Card className="border-2 border-gray-200 bg-secondary opacity-60">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <Trophy className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Maestro de Categorías</h3>
                  <p className="text-sm text-gray-600 mb-3">Lee al menos 3 libros de 5 categorías diferentes</p>
                  <Badge variant="outline" className="text-gray-400">
                    Bloqueado
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 bg-secondary opacity-60">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <Flame className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Racha Legendaria</h3>
                  <p className="text-sm text-gray-600 mb-3">Mantén una racha de lectura de 30 días</p>
                  <Badge variant="outline" className="text-gray-400">
                    Bloqueado
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card className="bg-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-foreground" />
                Tabla de Clasificación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Demo User</p>
                      <p className="text-sm text-gray-600">
                        Nivel {userLevel.level} • {userLevel.xp} XP
                      </p>
                    </div>
                  </div>
                  <Crown className="h-6 w-6 text-foreground" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Travis</p>
                      <p className="text-sm text-gray-600">Nivel 3 • 250 XP</p>
                    </div>
                  </div>
                  <Medal className="h-6 w-6 text-foreground" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Demo Despega</p>
                      <p className="text-sm text-gray-600">Nivel 2 • 180 XP</p>
                    </div>
                  </div>
                  <Award className="h-6 w-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
