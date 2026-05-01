'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, Target, Zap, Users, TrendingUp } from 'lucide-react'
import { ASection, ASectionPart } from '@/components/a-section-layout'

interface A2Insights {
  alineacionMision?: string
  rutaAprendizaje?: string
  dinamicasEquipo?: string
  areasGrowth?: string
  hitosExito?: string
  riesgosOportunidades?: string
}

const insightCards = [
  {
    key: 'alineacionMision',
    icon: '',
    title: 'Alineación de Misión',
    color: 'from-green/50'
  },
  {
    key: 'rutaAprendizaje',
    icon: '',
    title: 'Ruta de Aprendizaje',
    color: 'from-blue'
  },
  {
    key: 'dinamicasEquipo',
    icon: '👥',
    title: 'Dinámicas de Equipo',
    color: 'from-purple/50500'
  },
  {
    key: 'areasGrowth',
    icon: '📈',
    title: 'Áreas de Crecimiento',
    color: 'from-yellow/50/50'
  },
  {
    key: 'hitosExito',
    icon: '🏆',
    title: 'Hitos de Éxito',
    color: 'from-red/50500'
  },
  {
    key: 'riesgosOportunidades',
    icon: '⚡',
    title: 'Riesgos & Oportunidades',
    color: 'from-blue/50'
  }
]

export default function A2ResultadosPage() {
  const router = useRouter()
  const [insights, setInsights] = useState<A2Insights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadA2Results()
  }, [authLoading, user?.id])

  const loadA2Results = async () => {
    try {
      // Get user profile for cerebral data
      const { data: profileData } = await supabase
        .from('despega_user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (!profileData?.a2_mission_id) {
        setError('No se encontró misión A2. Por favor completa Conozcamonos-2 primero.')
        setLoading(false)
        return
      }

      // Get A1 cerebral data for context
      const { data: a1Data } = await supabase
        .from('a1_cerebral_assessment')
        .select('disc_profile')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      const discProfile = a1Data?.disc_profile || {}
      
      // Map DISC to Despega dimensions
      const cerebralProfile = {
        energia: (Math.abs(discProfile.D || 0) / (Math.abs(discProfile.D || 0) + Math.abs(discProfile.I || 0) + Math.abs(discProfile.S || 0) + Math.abs(discProfile.C || 0) || 1)) * 100,
        plan_ejecutivo: (Math.abs(discProfile.I || 0) / (Math.abs(discProfile.D || 0) + Math.abs(discProfile.I || 0) + Math.abs(discProfile.S || 0) + Math.abs(discProfile.C || 0) || 1)) * 100,
        relaciones: (Math.abs(discProfile.S || 0) / (Math.abs(discProfile.D || 0) + Math.abs(discProfile.I || 0) + Math.abs(discProfile.S || 0) + Math.abs(discProfile.C || 0) || 1)) * 100,
        enfoque: (Math.abs(discProfile.C || 0) / (Math.abs(discProfile.D || 0) + Math.abs(discProfile.I || 0) + Math.abs(discProfile.S || 0) + Math.abs(discProfile.C || 0) || 1)) * 100,
        primary: 'D'
      }

      // Generate AI insights
      const response = await fetch('/api/a2-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cerebralProfile,
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0],
          missionData: {
            titulo: profileData?.a2_mission_id,
            duracion: '90 días'
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
      console.error('[v0] Error loading A2 results:', err)
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
      <ASection title="Resultados: Tu Plan de Ruta" subtitle="Análisis de Tu Estrategia" icon="🗺️" colorClass="from-blue">
        <ASectionPart title="Error" icon={<Target />}>
          <div className="space-y-4">
            <div className="p-6 bg-red/5 dark:bg-red/20 border-2 border-red/20 dark:border-red/50 rounded-lg">
              <p className="text-red dark:text-red/30 font-semibold text-lg">{error}</p>
            </div>
            <Button 
              onClick={() => router.push('/despega/a2/dashboard')} 
              className="w-full bg-blue hover:from-blue hover:to-cyan-700 text-white font-semibold py-6 text-lg"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Volver al Dashboard A2
            </Button>
          </div>
        </ASectionPart>
      </ASection>
    )
  }

  return (
    <ASection title="A2: Camino" subtitle="Resultados de tu Misión" icon="🗺️" colorClass="from-blue">
      <ASectionPart title="Insights Generados" icon={<Zap />}>
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
                    {insights?.[card.key as keyof A2Insights] || 'Cargando...'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex gap-4 justify-center">
            <Button 
              onClick={() => router.push('/despega/a2/dashboard')}
              className="bg-blue hover:from-blue hover:to-cyan-700 text-white font-semibold py-6 px-8"
            >
              <Target className="w-5 h-5 mr-2" />
              Continuar con Misión
            </Button>
            <Button 
              onClick={() => router.push('/despega/a3')}
              variant="outline"
              className="font-semibold py-6 px-8"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Avanzar a A3
            </Button>
          </div>
        </div>
      </ASectionPart>
    </ASection>
  )
}
