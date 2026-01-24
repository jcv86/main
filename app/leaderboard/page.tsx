'use client'

import { Leaderboard } from '@/components/leaderboard'

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Ranking de Lectores</h1>
          <p className="text-muted-foreground">Compite con otros usuarios y sube en el ranking</p>
        </div>
        <Leaderboard />
      </div>
    </div>
  )
}
