'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, Target, Zap } from 'lucide-react'
import { ASection, ASectionPart } from '@/components/a-section-layout'

interface A4Insights {
  posicionamientoEstrategico?: string
  inteligenciaMercado?: string
  nivelGamificacion?: string
  proximasFocalizaciones?: string
  oportunidadesCaptura?: string
  visionLargo?: string
}

const insightCards = [
  {
    key: 'posicionamientoEstrategico',
    icon: '🎯',
    title: 'Posicionamiento Estratégico',
    color: 'from-green/50'
  },
  {
    key: 'inteligenciaMercado',
    icon: '📊',
    title: 'Inteligencia de Mercado',
    color: 'from-blue'
  },
  {
    key: 'nivelGamificacion',
    icon: '🏆',
    title: 'Nivel de Gamificación',
    color: 'from-purple/50500'
  },
  {
    key: 'proximasFocalizaciones',
    icon: '🔍',
    title: 'Próximas Focalizaciones',
    color: 'from-yellow/50/50'
  },
  {
    key: 'oportunidadesCaptura',
    icon: '💎',
    title: 'Oportunidades de Captura',
    color: 'from-red/50500'
  },
  {
    key: 'visionLargo',
    icon: '🚀',
    title: 'Visión a Largo Plazo',
    color: 'from-blue/50'
  }
]

export default function A4ResultadosPage() {
  const router = useRouter()
  const [insights, setInsights] = useState<A4Insights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading: authLoading } = useAuthRedirect()

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadA4Results()
  }, [authLoading, user?.id])

  const loadA4Results = async () => {
    try {
      // Generate AI insights
      const response = await fetch('/api/a4-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0],
          radarScores: {
            estrategico: 78,
            noticias: 85,
            personalizacion: 72,
            pruebas: 88
          },
          engagementMetrics: {
            puntosAcumulados: 2450,
            insignias: ['Radarcero', 'Investigador', 'Ganador'],
            nivelActual: 'Maestro'
          },
          performanceLevel: 'Excepcional'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data.insights)
      } else {
        throw new Error('Failed to generate insights')
      }

      setLoading(false)
    } catch (err) {
      console.error('[v0] Error loading A4 results:', err)
      setError('Error al cargar resultados')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-blue" />
      </div>
    )
  }

  if (error) {
    return (
      <ASection title="A4: Radar" subtitle="Resultados Estratégicos" icon="📡" colorClass="from-blue/50">
        <ASectionPart title="Error" icon={<Target />}>
          <div className="space-y-4">
            <div className="p-6 bg-red/5 dark:bg-red/20 border-2 border-red/20 dark:border-red/50 rounded-lg">
              <p className="text-red dark:text-red/30 font-semibold text-lg">{error}</p>
            </div>
            <Button 
              onClick={() => router.push('/despega/a4')} 
              className="w-full bg-background"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Volver a A4
            </Button>
          </div>
        </ASectionPart>
      </ASection>
    )
  }

  return (
    <ASection title="A4: Radar" subtitle="Resultados Estratégicos" icon="📡" colorClass="from-blue/50">
      <ASectionPart title="Análisis Estratégico Completo" icon={<Zap />}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insightCards.map((card) => (
              <Card key={card.key} className={`bg-background
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl mb-2">{card.icon}</div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed opacity-90">
                    {insights?.[card.key as keyof A4Insights] || 'Cargando...'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Button 
              onClick={() => router.push('/despega/a4')}
              className="bg-background"
            >
              <Target className="w-5 h-5 mr-2" />
              Continuar en A4
            </Button>
            <Button 
              onClick={() => router.push('/despega/dashboard')}
              variant="outline"
              className="font-semibold py-6 px-8"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </ASectionPart>
    </ASection>
  )
}
