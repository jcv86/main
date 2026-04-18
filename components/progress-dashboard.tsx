'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Flame, Zap, BookMarked, Trophy, Target } from 'lucide-react'

export function ProgressDashboard() {
  const stats = {
    streak: 12,
    points: 2840,
    booksCompleted: 5,
    inProgress: 2,
    ranking: 47,
    level: 'Intermedio',
  }

  const inProgressBooks = [
    { title: 'Deep Work', progress: 65 },
    { title: 'Thinking Fast and Slow', progress: 32 },
  ]

  const achievements = [
    { name: 'First Step', description: 'Completa tu primer libro' },
    { name: 'Book Lover', description: 'Completa 5 libros' },
    { name: 'Racha de 7 días', description: 'Lee 7 días consecutivos' },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-sm text-muted-foreground">Racha Actual</p>
            <p className="text-3xl font-bold">{stats.streak}</p>
            <p className="text-xs text-muted-foreground mt-1">días seguidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2 text-orange" />
            <p className="text-sm text-muted-foreground">Puntos Totales</p>
            <p className="text-3xl font-bold">{stats.points}</p>
            <p className="text-xs text-muted-foreground mt-1">experiencia</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <BookMarked className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-muted-foreground">Libros Completados</p>
            <p className="text-3xl font-bold">{stats.booksCompleted}</p>
            <p className="text-xs text-muted-foreground mt-1">de 64</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm text-muted-foreground">Tu Posición</p>
            <p className="text-3xl font-bold">#{stats.ranking}</p>
            <p className="text-xs text-muted-foreground mt-1">en leaderboard</p>
          </CardContent>
        </Card>
      </div>

      {/* In Progress Books */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Leyendo Ahora
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {inProgressBooks.map((book, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{book.title}</span>
                <span className="text-sm text-muted-foreground">{book.progress}%</span>
              </div>
              <Progress value={book.progress} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Tus Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="p-4 border rounded-lg text-center space-y-2">
                <p className="font-semibold">{achievement.name}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <Badge className="mx-auto block w-fit">✓ Desbloqueado</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso de Nivel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-2xl font-bold capitalize mb-2">{stats.level}</p>
            <p className="text-sm text-muted-foreground mb-4">Falta 1,160 puntos para Avanzado</p>
            <Progress value={71} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
