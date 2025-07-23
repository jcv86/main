"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProgressBar } from "./progress-bar"
import { type UserStats, ACHIEVEMENTS } from "@/lib/gamification"
import { BookOpen, Clock, Flame, Trophy, Star } from "lucide-react"

interface StatsDashboardProps {
  userStats: UserStats
}

export function StatsDashboard({ userStats }: StatsDashboardProps) {
  const recentAchievements = userStats.achievements
    .filter((a) => a.unlocked)
    .sort((a, b) => new Date(b.unlockedAt!).getTime() - new Date(a.unlockedAt!).getTime())
    .slice(0, 3)

  const totalAchievements = ACHIEVEMENTS.length
  const unlockedAchievements = userStats.achievements.filter((a) => a.unlocked).length

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Progreso de Nivel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressBar points={userStats.totalPoints} />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{userStats.booksCompleted}</div>
            <div className="text-sm text-muted-foreground">Libros Completados</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{userStats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Racha Actual</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{Math.round(userStats.timeSpent / 60)}h</div>
            <div className="text-sm text-muted-foreground">Tiempo Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{unlockedAchievements}</div>
            <div className="text-sm text-muted-foreground">Logros</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Logros Recientes</CardTitle>
            <CardDescription>Tus últimos logros desbloqueados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{achievement.title}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                  <Badge variant="secondary">+{achievement.points}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievement Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Logros</CardTitle>
          <CardDescription>
            {unlockedAchievements} de {totalAchievements} logros desbloqueados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={(unlockedAchievements / totalAchievements) * 100} className="h-3" />
          <div className="mt-2 text-sm text-muted-foreground text-center">
            {Math.round((unlockedAchievements / totalAchievements) * 100)}% completado
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
