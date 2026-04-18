'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, BookOpen, Loader2 } from 'lucide-react'

interface Book {
  id: string | number
  title: string
  author: string
  category?: string
  description?: string
  rating?: number
}

interface Recommendation {
  book: Book
  reason: string
}

interface RecommendationsProps {
  userProfile?: any
}

export function CoachRecommendations({ userProfile }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [keyInsight, setKeyInsight] = useState('')

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userProfile) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/coach/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userProfile }),
        })

        if (!response.ok) throw new Error('Failed to fetch recommendations')

        const data = await response.json()
        setRecommendations(data.recommendations || [])
        setKeyInsight(data.keyInsight || '')
      } catch (error) {
        console.error('[v0] Recommendations error:', error)
        setRecommendations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [userProfile])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sugerencias Personalizadas</CardTitle>
          <CardDescription>Ideas y recomendaciones basadas en tu perfil de El Ritual</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple" />
        </CardContent>
      </Card>
    )
  }

  const colors = [
    'from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple/20 dark:border-purple/50',
    'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue/20 dark:border-blue/50',
    'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange/20 dark:border-orange/50',
    'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green/20 dark:border-green/50',
    'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-900/50',
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sugerencias Personalizadas</CardTitle>
        <CardDescription>Ideas y recomendaciones basadas en tu perfil de El Ritual y progreso</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {keyInsight && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple/20 dark:border-purple/50 rounded-[28px] p-4">
              <p className="text-sm text-purple dark:text-purple/10">
                <strong>Insight Principal:</strong> {keyInsight}
              </p>
            </div>
          )}

          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div
                  key={`${rec.book.id}-${idx}`}
                  className={`bg-gradient-to-r ${colors[idx % colors.length]} border rounded-[28px] p-6`}
                >
                  <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {rec.book.title}
                  </h3>
                  <p className="text-sm font-medium mb-3">por {rec.book.author}</p>
                  <p className="text-foreground/80 mb-3">{rec.reason}</p>
                  
                  <div className="flex gap-2 flex-wrap">
                    {rec.book.category && (
                      <span className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded">
                        {rec.book.category}
                      </span>
                    )}
                    {rec.book.rating && (
                      <span className="text-xs bg-yellow/10 dark:bg-yellow/30 text-yellow dark:text-yellow/30 px-2 py-1 rounded">
                        ★ {rec.book.rating}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted/5 dark:bg-transparent rounded-[28px] p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted/40" />
              <p className="text-muted/50">
                {userProfile
                  ? 'Cargando sugerencias personalizadas...'
                  : 'Completa el test de El Ritual para obtener sugerencias personalizadas'}
              </p>
            </div>
          )}

          <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue">
            Ver Todas Mis Sugerencias Personalizadas
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
