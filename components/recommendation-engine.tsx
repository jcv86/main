'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, TrendingUp } from 'lucide-react'

interface Book {
  id: number
  title: string
  author: string
  category: string
  difficulty: string
  matchScore: number
  reason: string
}

const BOOKS_DATABASE = [
  { id: 1, title: 'Atomic Habits', author: 'James Clear', category: 'development', difficulty: 'beginner', tags: ['habits', 'productivity'] },
  { id: 2, title: 'Deep Work', author: 'Cal Newport', category: 'development', difficulty: 'intermediate', tags: ['focus', 'productivity'] },
  { id: 3, title: 'Thinking Fast and Slow', author: 'Daniel Kahneman', category: 'psychology', difficulty: 'advanced', tags: ['cognition', 'decision'] },
  { id: 4, title: 'The Goal', author: 'Eliyahu Goldratt', category: 'business', difficulty: 'intermediate', tags: ['operations', 'theory'] },
  { id: 5, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', category: 'finance', difficulty: 'beginner', tags: ['finance', 'investing'] },
]

export function RecommendationEngine() {
  const [userLevel, setUserLevel] = useState<string>('intermediate')
  const [userInterests, setUserInterests] = useState<string[]>(['development', 'psychology'])
  const [recommendations, setRecommendations] = useState<Book[]>([])

  useEffect(() => {
    generateRecommendations()
  }, [userLevel, userInterests])

  const generateRecommendations = () => {
    const scored = BOOKS_DATABASE.map(book => {
      let score = 0

      // Level matching (40%)
      if (userLevel === 'beginner' && book.difficulty === 'beginner') score += 40
      if (userLevel === 'intermediate' && ['beginner', 'intermediate'].includes(book.difficulty)) score += 40
      if (userLevel === 'advanced') score += 40

      // Interest matching (60%)
      if (userInterests.includes(book.category)) score += 60

      return {
        ...book,
        matchScore: score,
        reason: generateReason(book, userLevel, userInterests),
      }
    })

    const recommended = scored
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)

    setRecommendations(recommended)
  }

  const generateReason = (book: any, level: string, interests: string[]) => {
    if (interests.includes(book.category)) {
      return `Coincide con tu interés en ${book.category}`
    }
    if (book.difficulty === level) {
      return `Perfecto para tu nivel ${level}`
    }
    return 'Recomendado para ti'
  }

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'beginner') return 'bg-green-100 text-green-800'
    if (difficulty === 'intermediate') return 'bg-blue-100 text-blue-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recomendaciones Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map(book => (
            <div key={book.id} className="p-4 border rounded-lg hover:bg-muted transition space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    {book.matchScore}% match
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={getDifficultyColor(book.difficulty)}>{book.difficulty}</Badge>
                <Badge variant="outline">{book.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground italic">{book.reason}</p>
              <Button size="sm" className="w-full">Comienza a Leer</Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
