'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Trophy, Flame, BookMarked } from 'lucide-react'

interface LeaderboardUser {
  rank: number
  name: string
  points: number
  booksCompleted: number
  streak: number
  avatar?: string
}

const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, name: 'María García', points: 5240, booksCompleted: 12, streak: 45, avatar: '🏆' },
  { rank: 2, name: 'Carlos López', points: 4890, booksCompleted: 11, streak: 32, avatar: '⭐' },
  { rank: 3, name: 'Ana Martínez', points: 4650, booksCompleted: 10, streak: 28, avatar: '🌟' },
  { rank: 4, name: 'Roberto Silva', points: 4120, booksCompleted: 9, streak: 21, avatar: '📚' },
  { rank: 5, name: 'Sandra Ruiz', points: 3890, booksCompleted: 8, streak: 18, avatar: '💡' },
]

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState('points')

  const getSortedData = (sortBy: string) => {
    const sorted = [...MOCK_LEADERBOARD]
    if (sortBy === 'books') sorted.sort((a, b) => b.booksCompleted - a.booksCompleted)
    if (sortBy === 'streak') sorted.sort((a, b) => b.streak - a.streak)
    return sorted.map((user, idx) => ({ ...user, rank: idx + 1 }))
  }

  const getMedalColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500'
    if (rank === 2) return 'bg-gray-400'
    if (rank === 3) return 'bg-orange-600'
    return 'bg-slate-300 dark:bg-slate-600'
  }

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  const renderLeaderboard = (sortBy: string) => (
    <div className="space-y-2">
      {getSortedData(sortBy).map((user) => (
        <div key={user.rank} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted transition">
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-10 h-10 ${getMedalColor(user.rank)} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
              {getMedalEmoji(user.rank)}
            </div>
            <div>
              <p className="font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.avatar} Nivel {Math.floor(Math.random() * 10) + 1}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            {sortBy === 'points' && <p className="text-lg font-bold">{user.points} pts</p>}
            {sortBy === 'books' && <p className="text-lg font-bold">{user.booksCompleted} libros</p>}
            {sortBy === 'streak' && <p className="text-lg font-bold">{user.streak} días</p>}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-sm text-muted-foreground">Tu Posición</p>
            <p className="text-3xl font-bold">#47</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-sm text-muted-foreground">Tu Racha</p>
            <p className="text-3xl font-bold">12 días</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BookMarked className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-muted-foreground">Libros Completados</p>
            <p className="text-3xl font-bold">5</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Lectores</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="points">Puntos</TabsTrigger>
              <TabsTrigger value="books">Libros</TabsTrigger>
              <TabsTrigger value="streak">Racha</TabsTrigger>
            </TabsList>
            <TabsContent value="points" className="mt-6">{renderLeaderboard('points')}</TabsContent>
            <TabsContent value="books" className="mt-6">{renderLeaderboard('books')}</TabsContent>
            <TabsContent value="streak" className="mt-6">{renderLeaderboard('streak')}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
