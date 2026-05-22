"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Star } from "lucide-react"
import Link from "next/link"

interface Recommendation {
  id: number
  title: string
  author: string
  category: string
  difficulty_level: string
  estimated_read_time: number
  match_score: number
  reason: string
}

export function RecommendationsWidget() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("/api/betterme/recommendations")
        const data = await response.json()
        if (data.recommendations) {
          setRecommendations(data.recommendations.slice(0, 5))
        }
      } catch (error) {
        console.error("[v0] Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-500" />
          Recomendaciones Personalizadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay recomendaciones disponibles</p>
        ) : (
          recommendations.map((rec, index) => (
            <Link
              key={rec.id}
              href={`/biblioteca/${rec.id}`}
              className="block p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                    <Badge variant="secondary" className="text-xs">
                      {rec.match_score}% match
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.author}</p>
                  <p className="text-xs text-foreground mt-1">{rec.reason}</p>
                </div>
              </div>
            </Link>
          ))
        )}
        <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
          <Link href="/library-recommendations">Ver todas las recomendaciones</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
