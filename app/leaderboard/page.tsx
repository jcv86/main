'use client'

import { useEffect, useState } from 'react'
import { Leaderboard } from '@/components/leaderboard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flame, Loader2 } from 'lucide-react'

interface LeaderboardStats {
  topUsers: Array<{
    rank: number
    name: string
    points: number
    streak: number
    booksCompleted: number
  }>
  topStreaks: Array<{
    rank: number
    name: string
    streak: number
  }>
  totalParticipants: number
}

export default function LeaderboardPage() {
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/betterme/leaderboard')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('[v0] Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block px-4 py-2 bg-background">
            <p className="text-sm font-semibold text-purple dark:text-purple-200">Compite y Crece</p>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-orange" />
            <h1 className="text-5xl font-bold bg-background">Ranking de Lectores</h1>
          </div>
          <p className="text-lg text-muted-foreground dark:text-white/85 font-medium">
            Compite con otros usuarios y sube en el ranking
          </p>
          {stats && (
            <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2 font-medium">
              {stats.totalParticipants} usuarios participando en la comunidad
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="points" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="points">Puntos Totales</TabsTrigger>
              <TabsTrigger value="streak">Racha Más Larga</TabsTrigger>
            </TabsList>

            {/* Por Puntos */}
            <TabsContent value="points" className="space-y-3 mt-6">
              {stats?.topUsers && stats.topUsers.length > 0 ? (
                <div className="space-y-2">
                  {stats.topUsers.slice(0, 20).map((user, index) => (
                    <Card key={index} className={index < 3 ? 'border-yellow/20 bg-yellow/5/30 dark:bg-yellow/20' : ''}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                            index === 0 ? 'bg-orange text-white' : index === 1 ? 'bg-muted/40 text-white' : index === 2 ? 'bg-orange/40 text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.booksCompleted} libros completados
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-2xl font-bold">{user.points}</div>
                          <p className="text-xs text-muted-foreground">puntos</p>
                          {user.streak > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <Flame className="h-3 w-3 mr-1" />
                              {user.streak} días
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No hay datos de leaderboard aún</p>
              )}
            </TabsContent>

            {/* Por Streak */}
            <TabsContent value="streak" className="space-y-3 mt-6">
              {stats?.topStreaks && stats.topStreaks.length > 0 ? (
                <div className="space-y-2">
                  {stats.topStreaks.slice(0, 20).map((user, index) => (
                    <Card key={index} className={index < 3 ? 'border-red/20 bg-red/5/30 dark:bg-red/20' : ''}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                            index === 0 ? 'bg-red/50 text-white' : index === 1 ? 'bg-muted/40 text-white' : index === 2 ? 'bg-orange/40 text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {index === 0 && user.streak > 0 ? <Flame className="h-6 w-6" /> : index + 1}
                          </div>
                          <div>
                            <p className="font-semibold flex items-center gap-2">
                              {user.name}
                              {user.streak >= 7 && <Badge className="bg-red/50 text-xs">En Racha</Badge>}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold flex items-center gap-1">
                            {user.streak}
                            {user.streak > 0 && <Flame className="h-5 w-5 text-red" />}
                          </div>
                          <p className="text-xs text-muted-foreground">días seguidos</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No hay datos de leaderboard aún</p>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Componente Leaderboard existente como backup */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Vista Completa</h2>
          <Leaderboard />
        </div>
      </div>
    </div>
  )
}
