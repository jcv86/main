'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, Target, Zap } from 'lucide-react'
import { ASection, ASectionPart } from '@/components/a-section-layout'

interface A3Insights {
  retroalimentacionAudio?: string
  retroalimentacionVideo?: string
  calidadRespuestas?: string
  siguientesAntes?: string
  fortalezasAplicar?: string
  estrategiaIntegracion?: string
}

const insightCards = [
  {
    key: 'retroalimentacionAudio',
    icon: '🎤',
    title: 'Retroalimentación de Audio',
    color: 'from-green/50'
  },
  {
    key: 'retroalimentacionVideo',
    icon: '📹',
    title: 'Lenguaje Corporal',
    color: 'from-blue'
  },
  {
    key: 'calidadRespuestas',
    icon: '💬',
    title: 'Calidad de Respuestas',
    color: 'from-purple/50500'
  },
  {
    key: 'siguientesAntes',
    icon: '🔄',
    title: 'Próximas Prácticas',
    color: 'from-yellow/50/50'
  },
  {
    key: 'fortalezasAplicar',
    icon: '💪',
    title: 'Fortalezas a Aplicar',
    color: 'from-red/50500'
  },
  {
    key: 'estrategiaIntegracion',
    icon: '🎯',
    title: 'Estrategia de Integración',
    color: 'from-blue/50'
  }
]

export default function A3ResultadosPage() {
  const router = useRouter()
  const [insights, setInsights] = useState<A3Insights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading: authLoading } = useAuthRedirect()

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadA3Results()
  }, [authLoading, user?.id])

  const loadA3Results = async () => {
    try {
      // Generate AI insights based on simulated data
      const response = await fetch('/api/a3-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0],
          interviewScores: {
            audioAnalysis: 82,
            videoAnalysis: 78,
            responseQuality: 85,
            overall: 81
          },
          performanceMetrics: {
            passRate: 85,
            improvementArea: 'Gestión de nervios en preguntas complejas',
            strengths: ['Claridad', 'Estructura STAR', 'Entusiasmo']
          }
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
      console.error('[v0] Error loading A3 results:', err)
      setError('Error al cargar resultados')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-purple" />
      </div>
    )
  }

  if (error) {
    return (
      <ASection title="Resultados: Tu Desempeño en Entrevistas" subtitle="Análisis de tu Simulación" icon="🎬" colorClass="from-purple/50">
        <ASectionPart title="Error" icon={<Target />}>
          <div className="space-y-4">
            <div className="p-6 bg-red/5 dark:bg-red/20 border-2 border-red/20 dark:border-red/50 rounded-lg">
              <p className="text-red dark:text-red/30 font-semibold text-lg">{error}</p>
            </div>
            <Button 
              onClick={() => router.push('/despega/a3')} 
              className="w-full bg-background"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Volver a A3
            </Button>
          </div>
        </ASectionPart>
      </ASection>
    )
  }

  return (
    <ASection title="A3: Entrena" subtitle="Resultados de Simulación" icon="🎬" colorClass="from-purple/50500">
      <ASectionPart title="Retroalimentación Detallada" icon={<Zap />}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insightCards.map((card) => (
              <Card key={card.key} className={`bg-background`}>
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
                    {insights?.[card.key as keyof A3Insights] || 'Cargando...'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Button 
              onClick={() => router.push('/despega/a3')}
              className="bg-background"
            >
              <Target className="w-5 h-5 mr-2" />
              Siguiente Simulación
            </Button>
            <Button 
              onClick={() => router.push('/despega/a4/resultados')}
              variant="outline"
              className="font-semibold py-6 px-8"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Avanzar a A4
            </Button>
          </div>
        </div>
      </ASectionPart>
    </ASection>
  )
}
