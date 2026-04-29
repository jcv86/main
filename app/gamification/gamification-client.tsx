"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Target, Zap, Star, Lock, Check } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: string
  earned_at: string | null
}

interface Mission {
  id: string
  title: string
  description: string
  type: "daily" | "weekly" | "monthly"
  xp_reward: number
  progress: number
  target: number
  completed: boolean
  expires_at: string
}

interface UserStats {
  total_xp: number
  level: number
  xp_to_next_level: number
  current_level_xp: number
  tests_completed: number
  books_read: number
  simulaciones_completed: number
  goals_achieved: number
}

export default function GamificationClient() {
  const [stats, setStats] = useState<UserStats>({
    total_xp: 2500,
    level: 5,
    xp_to_next_level: 1000,
    current_level_xp: 500,
    tests_completed: 4,
    books_read: 2,
    simulaciones_completed: 7,
    goals_achieved: 3,
  })

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Primer Paso",
      description: "Completa tu primer test de personalidad",
      icon: "🎯",
      category: "tests",
      earned_at: "2024-01-15",
    },
    {
      id: "2",
      title: "Autodescubrimiento",
      description: "Completa los 6 tests DTC",
      icon: "🧭",
      category: "tests",
      earned_at: null,
    },
    {
      id: "3",
      title: "Lector Dedicado",
      description: "Lee 5 libros completos",
      icon: "📚",
      category: "lectura",
      earned_at: null,
    },
    {
      id: "4",
      title: "Simulador Experto",
      description: "Completa 10 simulaciones",
      icon: "🎭",
      category: "simulaciones",
      earned_at: "2024-02-20",
    },
    {
      id: "5",
      title: "Meta Cumplida",
      description: "Alcanza tu primera meta SMART",
      icon: "🎖️",
      category: "metas",
      earned_at: "2024-03-01",
    },
    {
      id: "6",
      title: "Racha de Fuego",
      description: "7 días consecutivos de actividad",
      icon: "🔥",
      category: "engagement",
      earned_at: null,
    },
  ])

  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "d1",
      title: "Lectura Diaria",
      description: "Lee 15 minutos hoy",
      type: "daily",
      xp_reward: 50,
      progress: 10,
      target: 15,
      completed: false,
      expires_at: "2024-03-15T23:59:59Z",
    },
    {
      id: "d2",
      title: "Reflexión Personal",
      description: "Completa una pregunta de reflexión",
      type: "daily",
      xp_reward: 30,
      progress: 0,
      target: 1,
      completed: false,
      expires_at: "2024-03-15T23:59:59Z",
    },
    {
      id: "w1",
      title: "Meta Semanal",
      description: "Avanza en 3 de tus metas activas",
      type: "weekly",
      xp_reward: 200,
      progress: 1,
      target: 3,
      completed: false,
      expires_at: "2024-03-17T23:59:59Z",
    },
    {
      id: "w2",
      title: "Simulador Semanal",
      description: "Completa 2 simulaciones esta semana",
      type: "weekly",
      xp_reward: 150,
      progress: 1,
      target: 2,
      completed: false,
      expires_at: "2024-03-17T23:59:59Z",
    },
    {
      id: "m1",
      title: "Maestría Mensual",
      description: "Completa un test completo este mes",
      type: "monthly",
      xp_reward: 500,
      progress: 0,
      target: 1,
      completed: false,
      expires_at: "2024-03-31T23:59:59Z",
    },
  ])

  const calculateLevelProgress = () => {
    return (stats.current_level_xp / stats.xp_to_next_level) * 100
  }

  const getMissionTypeColor = (type: Mission["type"]) => {
    const colors = {
      daily: "bg-blue/50",
      weekly: "bg-purple/50",
      monthly: "bg-orange/50",
    }
    return colors[type]
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      tests: "bg-blue/10 text-blue",
      lectura: "bg-green/10 text-green",
      simulaciones: "bg-purple/10 text-purple",
      metas: "bg-orange/10 text-orange",
      engagement: "bg-red/10 text-red",
    }
    return colors[category] || "bg-muted/10 text-gray-800"
  }

  const handleCompleteMission = (missionId: string) => {
    setMissions(missions.map((m) => (m.id === missionId ? { ...m, completed: true, progress: m.target } : m)))
    const mission = missions.find((m) => m.id === missionId)
    if (mission) {
      setStats({
        ...stats,
        total_xp: stats.total_xp + mission.xp_reward,
        current_level_xp: stats.current_level_xp + mission.xp_reward,
      })
    }
  }

  const earnedCount = achievements.filter((a) => a.earned_at).length
  const totalCount = achievements.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-background">
            <p className="text-sm font-semibold text-purple dark:text-purple/20">Tu Progreso y Logros</p>
          </div>
          <h1 className="text-5xl font-bold text-purple400400 mb-2">Gamificación DTC</h1>
          <p className="text-lg text-muted-foreground dark:text-white/85 font-medium">
            Completa misiones, gana logros y sube de nivel mientras creces personalmente
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-purple/20 dark:border-purple/50 bg-white dark:bg-background">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple/10 dark:bg-purple/30 rounded-lg">
                  <Zap className="w-5 h-5 text-purple dark:text-purple/40" />
                </div>
              <CardTitle className="text-lg">Nivel {stats.level}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">XP Total</span>
                <span className="font-medium">{stats.total_xp.toLocaleString()}</span>
              </div>
              <Progress value={calculateLevelProgress()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {stats.current_level_xp} / {stats.xp_to_next_level} XP para nivel {stats.level + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green/10 rounded-lg">
                <Trophy className="w-5 h-5 text-green" />
              </div>
              <CardTitle className="text-lg">Logros</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {earnedCount}/{totalCount}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {Math.round((earnedCount / totalCount) * 100)}% completado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple/10 rounded-lg">
                <Target className="w-5 h-5 text-purple" />
              </div>
              <CardTitle className="text-lg">Misiones</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {missions.filter((m) => m.completed).length}/{missions.length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Completadas hoy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange/10 rounded-lg">
                <Star className="w-5 h-5 text-orange" />
              </div>
              <CardTitle className="text-lg">Racha</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5 días</div>
            <p className="text-sm text-muted-foreground mt-1">¡Sigue así!</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="missions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="missions">Misiones</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-6">
          {/* Daily Missions */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="p-1.5 bg-blue/10 rounded">☀️</span>
              Misiones Diarias
            </h3>
            <div className="grid gap-4">
              {missions
                .filter((m) => m.type === "daily")
                .map((mission) => (
                  <Card key={mission.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{mission.title}</h4>
                            {mission.completed && (
                              <Badge variant="default" className="bg-green/50">
                                <Check className="w-3 h-3 mr-1" /> Completada
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {mission.progress} / {mission.target}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-blue">
                              <Zap className="w-4 h-4" />+{mission.xp_reward} XP
                            </div>
                          </div>
                        </div>
                        {!mission.completed && mission.progress >= mission.target && (
                          <Button onClick={() => handleCompleteMission(mission.id)} className="ml-4">
                            Reclamar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Weekly Missions */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="p-1.5 bg-purple/10 rounded">📅</span>
              Misiones Semanales
            </h3>
            <div className="grid gap-4">
              {missions
                .filter((m) => m.type === "weekly")
                .map((mission) => (
                  <Card key={mission.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{mission.title}</h4>
                            {mission.completed && (
                              <Badge variant="default" className="bg-green/50">
                                <Check className="w-3 h-3 mr-1" /> Completada
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {mission.progress} / {mission.target}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-purple">
                              <Zap className="w-4 h-4" />+{mission.xp_reward} XP
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>

          {/* Monthly Missions */}
          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="p-1.5 bg-orange/10 rounded">🗓️</span>
              Misiones Mensuales
            </h3>
            <div className="grid gap-4">
              {missions
                .filter((m) => m.type === "monthly")
                .map((mission) => (
                  <Card key={mission.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{mission.title}</h4>
                            {mission.completed && (
                              <Badge variant="default" className="bg-green/50">
                                <Check className="w-3 h-3 mr-1" /> Completada
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{mission.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Progress value={(mission.progress / mission.target) * 100} className="h-2" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {mission.progress} / {mission.target}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-medium text-orange">
                              <Zap className="w-4 h-4" />+{mission.xp_reward} XP
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={achievement.earned_at ? "" : "opacity-60"}>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`text-5xl mb-3 ${achievement.earned_at ? "" : "grayscale"}`}>
                      {achievement.earned_at ? achievement.icon : "🔒"}
                    </div>
                    <h4 className="font-semibold mb-1">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                    <Badge className={getCategoryColor(achievement.category)}>{achievement.category}</Badge>
                    {achievement.earned_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Desbloqueado el {new Date(achievement.earned_at).toLocaleDateString("es-ES")}
                      </p>
                    )}
                    {!achievement.earned_at && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        Bloqueado
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Recompensas por Nivel</CardTitle>
              <CardDescription>Desbloquea beneficios especiales al subir de nivel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { level: 5, reward: "Avatar personalizado", unlocked: true },
                  { level: 10, reward: "Badge exclusivo", unlocked: false },
                  { level: 15, reward: "Acceso a contenido premium", unlocked: false },
                  { level: 20, reward: "Certificado de progreso", unlocked: false },
                  { level: 25, reward: "Sesión 1:1 con coach", unlocked: false },
                ].map((item) => (
                  <div key={item.level} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                        item.unlocked ? "bg-blue/50 text-white" : "bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {item.level}
                    </div>
                      <div>
                        <p className="font-medium">{item.reward}</p>
                        <p className="text-sm text-muted-foreground">Nivel {item.level}</p>
                      </div>
                    </div>
                    {item.unlocked ? (
                      <Badge variant="default" className="bg-green/50">
                        <Check className="w-4 h-4 mr-1" />
                        Desbloqueado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Lock className="w-4 h-4 mr-1" />
                        Bloqueado
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
