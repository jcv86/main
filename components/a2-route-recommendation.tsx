import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react'

interface RouteRecommendationData {
  recommendedRoute: 'persona' | 'profesional' | 'hibrido'
  confidence: number
  reasoning: string
  altRoutes: Array<{
    route: 'persona' | 'profesional' | 'hibrido'
    score: number
    reason: string
  }>
  focusAreas: string[]
  needsA1?: boolean
  isDemo?: boolean
}

interface RouteRecommendationProps {
  onSelectRoute: (route: 'persona' | 'profesional' | 'hibrido') => void
  loading?: boolean
}

const ROUTE_COLORS = {
  persona: {
    bg: 'bg-pink-500/20',
    border: 'border-pink-500/30',
    text: 'text-pink-600 dark:text-pink-400',
    badge: 'bg-pink-500/30 text-pink-700'
  },
  profesional: {
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    text: 'text-blue-600 dark:text-blue-400',
    badge: 'bg-blue-500/30 text-blue-700'
  },
  hibrido: {
    bg: 'bg-purple-500/20',
    border: 'border-purple-500/30',
    text: 'text-purple-600 dark:text-purple-400',
    badge: 'bg-purple-500/30 text-purple-700'
  }
}

const ROUTE_LABELS = {
  persona: 'Camino Persona',
  profesional: 'Camino Profesional',
  hibrido: 'Camino Híbrido'
}

export function RouteRecommendation({ onSelectRoute, loading }: RouteRecommendationProps) {
  const [data, setData] = useState<RouteRecommendationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        const response = await fetch('/api/a2/route-recommendation')
        if (!response.ok) throw new Error('Failed to fetch recommendation')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendation()
  }, [])

  if (isLoading || loading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <div className="h-6 bg-muted/50 rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted/50 rounded w-96"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-20 bg-muted/50 rounded"></div>
          <div className="h-20 bg-muted/50 rounded"></div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="border-red-500/30 bg-red-500/10">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Error al cargar la recomendación</p>
              <p className="text-sm text-red-800 mt-1">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (data.needsA1) {
    return (
      <Card className="border-amber-500/30 bg-amber-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900">
            <Lightbulb className="w-5 h-5" />
            Recomendación Personalizada
          </CardTitle>
          <CardDescription>{data.reasoning}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-800">
            Completa primero tu análisis DISC en A1 para obtener una recomendación adaptada a tu perfil.
          </p>
        </CardContent>
      </Card>
    )
  }

  const colors = ROUTE_COLORS[data.recommendedRoute]

  return (
    <div className="space-y-6">
      {/* Main Recommendation */}
      <Card className={`border-2 ${colors.border} ${colors.bg}`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className={colors.text}>
                  {ROUTE_LABELS[data.recommendedRoute]}
                </CardTitle>
                <Badge className={colors.badge}>
                  {data.confidence}% match
                </Badge>
              </div>
              <CardDescription className="text-base">
                {data.reasoning}
              </CardDescription>
            </div>
            <CheckCircle2 className={`w-6 h-6 ${colors.text} flex-shrink-0`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Focus Areas */}
            <div>
              <p className="text-sm font-medium mb-2">Áreas de enfoque recomendadas:</p>
              <div className="flex flex-wrap gap-2">
                {data.focusAreas.map(area => (
                  <Badge key={area} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Select Button */}
            <Button
              onClick={() => onSelectRoute(data.recommendedRoute)}
              className={`w-full ${colors.text}`}
              size="lg"
            >
              Seleccionar esta ruta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Routes */}
      {data.altRoutes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-3">Otras opciones disponibles:</p>
          <div className="space-y-3">
            {data.altRoutes.map(alt => {
              const altColors = ROUTE_COLORS[alt.route]
              return (
                <Card key={alt.route} className={`cursor-pointer hover:shadow-md transition-shadow border ${altColors.border} ${altColors.bg}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{ROUTE_LABELS[alt.route]}</p>
                        <p className="text-sm text-muted-foreground">{alt.reason}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{alt.score}%</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectRoute(alt.route)}
                          className="mt-2"
                        >
                          Elegir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {data.isDemo && (
        <div className="text-xs text-muted-foreground text-center p-2 bg-muted/50 rounded">
          Demo mode - Esta es una recomendación de ejemplo. Completa A1 para ver tu recomendación personalizada.
        </div>
      )}
    </div>
  )
}
