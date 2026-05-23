'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Flame, Star, Trophy, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface QuickStats {
  streak: number
  points: number
  booksCompleted: number
  nextRecommendation: string | null
}

export function BetterMeQuickWidget() {
  const [stats, setStats] = useState<QuickStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/betterme/progress')
        const data = await response.json()
        if (data.stats) {
          setStats({
            streak: data.stats.current_streak,
            points: data.stats.total_points,
            booksCompleted: data.stats.total_books_completed,
            nextRecommendation: data.recentlyCompleted?.[0]?.title || null,
          })
        }
      } catch (error) {
        console.error('[v0] Error fetching BetterMe stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading || !stats) return null

  return (
    <Card className="w-full bg-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-500 text-orange" />
          Tu Progreso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              {stats.streak}
              {stats.streak > 0 && <Flame className="h-5 w-5 text-[rgb(80,160,170)]" />}
            </div>
            <p className="text-xs text-muted-foreground">Racha</p>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="text-2xl font-bold">{stats.points}</div>
            <p className="text-xs text-muted-foreground">Puntos</p>
          </div>
          <div className="text-center p-2 bg-background/50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-2xl font-bold">
              {stats.booksCompleted}
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-xs text-muted-foreground">Libros</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <Link href="/my-learning">Ver Progreso</Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
            <Link href="/leaderboard">Ranking</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
