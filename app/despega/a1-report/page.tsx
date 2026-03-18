'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { calculateDiscProfile, interpretDiscProfile, type DiscProfile, type DiscInterpretation } from '@/lib/disc-calculator'
import { ASection, ASectionPart } from '@/components/a-section-layout'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowRight, Zap, CheckCircle2, Target } from 'lucide-react'

export default function A1ReportPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<DiscProfile | null>(null)
  const [interpretation, setInterpretation] = useState<DiscInterpretation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadReport()
  }, [authLoading, user?.id])

  const loadReport = async () => {
    try {
      // Try despega_a1_test_results first
      const { data: testData, error: testError } = await supabase
        .from('despega_a1_test_results')
        .select('test_data, test_type')
        .eq('user_id', user?.id)
        .eq('test_type', 'Despega Cerebral')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (testData && testData.test_data) {
        console.log('[v0] Found test data in despega_a1_test_results')
        const testDataObj = testData.test_data as any
        const normalize = (value: number) => Math.max(0, Math.min(100, (value + 100) / 2))
        
        const discProfile: DiscProfile = {
          D: normalize(testDataObj.energia || 0),
          I: normalize(testDataObj.relaciones || 0),
          S: normalize(testDataObj.plan_ejecutivo || 0),
          C: normalize(testDataObj.enfoque || 0),
          primary: 'D',
          primaryScore: 50,
          secondary: 'I',
          secondaryScore: 40
        }

        const scores = [
          { letter: 'D' as const, value: discProfile.D },
          { letter: 'I' as const, value: discProfile.I },
          { letter: 'S' as const, value: discProfile.S },
          { letter: 'C' as const, value: discProfile.C }
        ]
        scores.sort((a, b) => b.value - a.value)
        
        discProfile.primary = scores[0].letter
        discProfile.primaryScore = scores[0].value
        discProfile.secondary = scores[1].letter
        discProfile.secondaryScore = scores[1].value

        const calcInterpretation = interpretDiscProfile(discProfile)
        console.log('[v0] Profile loaded:', { primary: discProfile.primary, secondary: discProfile.secondary })
        
        setProfile(discProfile)
        setInterpretation(calcInterpretation)
        setLoading(false)
        return
      }

      // Fallback: try a1_disc_assessment
      const { data: discData } = await supabase
        .from('a1_disc_assessment')
        .select('disc_profile')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (discData?.disc_profile) {
        const profile = discData.disc_profile as DiscProfile
        const calcInterpretation = interpretDiscProfile(profile)
        setProfile(profile)
        setInterpretation(calcInterpretation)
        setLoading(false)
        return
      }

      setError('No se encontraron respuestas de tu evaluación Despega Cerebral.')
      setLoading(false)
    } catch (err) {
      console.error('[v0] Error loading A1 report:', err)
      setError('Error al cargar tu perfil. Intenta de nuevo.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  if (error || !profile || !interpretation) {
    return (
      <ASection
        title="A1: Origen"
        subtitle="Descubre tu Perfil Cerebral y potencial único"
        icon="🎯"
        colorClass="from-purple-500 to-blue-500"
      >
        <ASectionPart title="Error" icon={<Zap />}>
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => router.push('/despega/a1-cerebral')} className="bg-purple-600 hover:bg-purple-700">
            Realizar Evaluación
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </ASectionPart>
      </ASection>
    )
  }

  // Mapeo DISC -> Despega Cerebral
  const discToDespega: Record<string, string> = { D: 'E', I: 'I', S: 'R', C: 'P' }
  const despegaLabels: Record<string, string> = { E: 'Energía', I: 'Influencia', R: 'Relaciones', P: 'Plan Ejecutivo' }
  
  const primaryLetter = discToDespega[profile.primary] || 'E'
  const secondaryLetter = discToDespega[profile.secondary] || 'I'
  const primaryLabel = despegaLabels[primaryLetter] || 'Energía'
  const secondaryLabel = despegaLabels[secondaryLetter] || 'Influencia'

  return (
    <ASection
      title="A1: Origen"
      subtitle="Descubre tu Perfil Cerebral y potencial único"
      icon="🎯"
      colorClass="from-purple-500 to-blue-500"
    >
      <ASectionPart title="¿Qué es A1: Origen?" icon={<Zap />}>
        <p className="text-slate-300 mb-4">
          En esta etapa descubrirás tu Perfil Cerebral, el resultado de tu evaluación Despega Cerebral que clasifica tu comportamiento 
          en 4 dimensiones clave: Energía, Influencia, Relaciones y Plan Ejecutivo. Entender tu patrón dominante te permite reconocer 
          tus fortalezas, anticipar desafíos, y comunicarte de forma más efectiva con otros.
        </p>
      </ASectionPart>

      <ASectionPart title="Tu Progreso en A1" icon={<CheckCircle2 />}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-400">Evaluación Completada</p>
              <p className="text-sm text-slate-400">Tu Perfil Cerebral ha sido calculado</p>
            </div>
          </div>
        </div>
      </ASectionPart>

      <ASectionPart title="Tu Perfil Cerebral" icon={<Target />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Tipo Dominante */}
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Tipo Dominante</p>
            <div className="text-5xl font-black text-purple-400 mb-2">{primaryLetter}</div>
            <p className="font-semibold text-white mb-4">{primaryLabel}</p>
            <p className="text-slate-300 text-sm mb-4">{interpretation.description}</p>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${Math.max(0, profile.primaryScore)}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.max(0, Math.round(profile.primaryScore))}%</p>
          </div>

          {/* Tipo Secundario */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Tipo Secundario</p>
            <div className="text-5xl font-black text-blue-400 mb-2">{secondaryLetter}</div>
            <p className="font-semibold text-white mb-4">{secondaryLabel}</p>
            <p className="text-slate-300 text-sm mb-4">Tu segunda fortaleza principal</p>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${Math.max(0, profile.secondaryScore)}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.max(0, Math.round(profile.secondaryScore))}%</p>
          </div>
        </div>

        {/* 4 Dimensiones */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6">
          <h3 className="font-semibold text-white mb-4">Tus 4 Dimensiones del Perfil Cerebral</h3>
          <div className="space-y-3">
            {[
              { letter: 'E', label: 'Energía', score: profile.D },
              { letter: 'I', label: 'Influencia', score: profile.I },
              { letter: 'R', label: 'Relaciones', score: profile.S },
              { letter: 'P', label: 'Plan Ejecutivo', score: profile.C }
            ].map(dim => (
              <div key={dim.letter} className="flex items-center gap-4">
                <div className="w-24">
                  <p className="font-bold text-white">{dim.label}</p>
                  <p className="text-xs text-slate-400">Dimensión {dim.letter}</p>
                </div>
                <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: `${Math.max(0, dim.score)}%` }} />
                </div>
                <p className="w-12 text-right font-semibold text-white">{Math.max(0, Math.round(dim.score))}%</p>
              </div>
            ))}
          </div>
        </div>
      </ASectionPart>

      <ASectionPart title="Próximos Pasos" icon={<CheckCircle2 />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Entender Tus Patrones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">Ahora que conoces tu Perfil Cerebral, entender cómo interactuarás en entrevistas, equipos y situaciones de presión.</p>
              <Button variant="outline" className="border-slate-600" size="sm">Ver Detalles</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Avanzar a A2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">En A2: Ruta, crearemos tu plan de 90 días basado en tu Perfil Cerebral.</p>
              <Button onClick={() => router.push('/despega/a2-routes')} className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                Ir a A2: Ruta
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </ASectionPart>
    </ASection>
  )
}
