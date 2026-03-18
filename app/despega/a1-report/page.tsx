'use client'
// Cache clear marker: 2024-03-18-final-v1.2.5

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
      // Get latest test results from despega_a1_test_results
      const { data: testData } = await supabase
        .from('despega_a1_test_results')
        .select('test_data, test_type')
        .eq('user_id', user?.id)
        .eq('test_type', 'Despega Cerebral')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (testData) {
        console.log('[v0] Found test data in despega_a1_test_results')
        const testDataObj = testData.test_data as any
        
        // Normalize Despega Cerebral scores from range [-100, 100] to [0, 100]
        const normalize = (value: number) => Math.max(0, Math.min(100, (value + 100) / 2))
        
        const discProfile: DiscProfile = {
          D: normalize(testDataObj.energia || 0),
          I: normalize(testDataObj.relaciones || 0),
          S: normalize(testDataObj.plan_ejecutivo || 0),
          C: normalize(testDataObj.enfoque || 0),
          primary: 'D',
          primaryScore: normalize(testDataObj.energia || 0),
          secondary: 'I',
          secondaryScore: normalize(testDataObj.relaciones || 0)
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

        console.log('[v0] Normalized profile:', { D: discProfile.D, I: discProfile.I, S: discProfile.S, C: discProfile.C })

        const calcInterpretation = interpretDiscProfile(discProfile)
        setProfile(discProfile)
        setInterpretation(calcInterpretation)

        await supabase.from('user_a1_profiles').upsert({
          user_id: user?.id,
          disc_profile: discProfile,
          disc_interpretation: calcInterpretation,
          updated_at: new Date().toISOString()
        })

        setLoading(false)
        return
      }

      // Try a1_disc_assessment table
      const { data: discData } = await supabase
        .from('a1_disc_assessment')
        .select('disc_profile')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (discData?.disc_profile) {
        console.log('[v0] Found DISC profile in a1_disc_assessment')
        const discProfile: DiscProfile = discData.disc_profile as DiscProfile
        
        if (!discProfile.primary) {
          const scores = [
            { letter: 'D' as const, value: discProfile.D || 0 },
            { letter: 'I' as const, value: discProfile.I || 0 },
            { letter: 'S' as const, value: discProfile.S || 0 },
            { letter: 'C' as const, value: discProfile.C || 0 }
          ]
          scores.sort((a, b) => b.value - a.value)
          discProfile.primary = scores[0].letter
          discProfile.primaryScore = scores[0].value
          discProfile.secondary = scores[1].letter
          discProfile.secondaryScore = scores[1].value
        }

        const calcInterpretation = interpretDiscProfile(discProfile)
        setProfile(discProfile)
        setInterpretation(calcInterpretation)

        await supabase.from('user_a1_profiles').upsert({
          user_id: user?.id,
          disc_profile: discProfile,
          disc_interpretation: calcInterpretation,
          updated_at: new Date().toISOString()
        })

        setLoading(false)
        return
      }

      // Fallback: try canon_disc_responses
      const { data: canonData } = await supabase
        .from('canon_disc_responses')
        .select('responses')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (canonData?.responses) {
        console.log('[v0] Found responses in canon_disc_responses')
        const calcProfile = calculateDiscProfile(canonData.responses)
        const calcInterpretation = interpretDiscProfile(calcProfile)
        setProfile(calcProfile)
        setInterpretation(calcInterpretation)

        await supabase.from('user_a1_profiles').upsert({
          user_id: user?.id,
          disc_profile: calcProfile,
          disc_interpretation: calcInterpretation,
          updated_at: new Date().toISOString()
        })

        setLoading(false)
        return
      }

      setError('No se encontraron respuestas de tu evaluación Despega Cerebral. Por favor completa la evaluación.')
    } catch (err) {
      console.error('[v0] Error loading A1 report:', err)
      setError('Error al cargar tu reporte. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p className="text-slate-300">Cargando tu perfil...</p>
        </div>
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
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button 
            onClick={() => router.push('/despega/a1-cerebral')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Realizar Evaluación Despega Cerebral
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </ASectionPart>
      </ASection>
    )
  }

  return (
    <ASection
      title="A1: Origen"
      subtitle="Descubre tu Perfil Cerebral y potencial único"
      icon="🎯"
      colorClass="from-purple-500 to-blue-500"
    >
      {/* EXPLICACIÓN */}
      <ASectionPart title="¿Qué es A1: Origen?" icon={<Zap />}>
        <p className="text-slate-300 mb-4">
          En esta etapa descubrirás tu Perfil Cerebral, el resultado de tu evaluación Despega Cerebral que clasifica tu comportamiento 
          en 4 dimensiones clave: Energía, Influencia, Relaciones y Plan Ejecutivo. Entender tu patrón dominante te permite reconocer 
          tus fortalezas, anticipar desafíos, y comunicarte de forma más efectiva con otros.
        </p>
        <p className="text-slate-400 text-sm">
          ⏱️ Tiempo completado: Ya lo hiciste. Tus resultados están listos.
        </p>
      </ASectionPart>

      {/* FLUJO / PROCESO */}
      <ASectionPart title="Tu Progreso en A1" icon={<CheckCircle2 />}>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-400">Evaluación Completada</p>
              <p className="text-sm text-slate-400">Tu Perfil Cerebral ha sido calculado</p>
            </div>
          </div>
          
          <div className="p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
            <p className="text-slate-300 text-sm mb-3">Próximo: Continúa a <span className="font-semibold">A2: Ruta</span> para tu plan de 90 días</p>
            <Button 
              onClick={() => router.push('/despega/a2-routes')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Ir a A2: Ruta
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </ASectionPart>

      {/* RESULTADOS */}
      <ASectionPart title="Tu Perfil Cerebral" icon={<Target />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Tipo Dominante</p>
            <div className="text-5xl font-black text-purple-400 mb-2">{profile.primary}</div>
            <p className="font-semibold text-white mb-4">{interpretation.profileName}</p>
            <p className="text-slate-300 text-sm">{interpretation.description}</p>
            <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500" 
                style={{ width: `${Math.max(0, profile.primaryScore)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.max(0, Math.round(profile.primaryScore))}%</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Tipo Secundario</p>
            <div className="text-5xl font-black text-blue-400 mb-2">{profile.secondary}</div>
            <p className="font-semibold text-white mb-4">Dimensión {profile.secondary}</p>
            <p className="text-slate-300 text-sm">Tu segunda fortaleza principal</p>
            <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500" 
                style={{ width: `${Math.max(0, profile.secondaryScore)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.max(0, Math.round(profile.secondaryScore))}%</p>
          </div>
        </div>

        {/* Perfil Cerebral - 4 Dimensiones */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-white mb-4">Tus 4 Dimensiones del Perfil Cerebral</h3>
          <div className="space-y-3">
            {[
              { letter: 'E', label: 'Energía', score: Math.max(0, profile.D), color: 'from-red-500 to-orange-500' },
              { letter: 'I', label: 'Influencia', score: Math.max(0, profile.I), color: 'from-yellow-500 to-orange-400' },
              { letter: 'R', label: 'Relaciones', score: Math.max(0, profile.S), color: 'from-blue-500 to-cyan-500' },
              { letter: 'P', label: 'Plan Ejecutivo', score: Math.max(0, profile.C), color: 'from-purple-500 to-pink-500' }
            ].map(dim => (
              <div key={dim.letter} className="flex items-center gap-4">
                <div className="w-24">
                  <p className="font-bold text-white">{dim.label}</p>
                  <p className="text-xs text-slate-400">Dimensión {dim.letter}</p>
                </div>
                <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${dim.color} transition-all`}
                    style={{ width: `${Math.max(0, dim.score)}%` }}
                  />
                </div>
                <p className="w-12 text-right font-semibold text-white">{Math.max(0, Math.round(dim.score))}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interpretation */}
        <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6">
          <h3 className="font-semibold text-cyan-400 mb-3">Interpretación</h3>
          <p className="text-slate-300 leading-relaxed">{interpretation.description}</p>
        </div>
      </ASectionPart>

      {/* DASHBOARD / ACCIONES */}
      <ASectionPart title="Próximos Pasos" icon={<CheckCircle2 />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Entender Tus Patrones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-400">
                Ahora que conoces tu Perfil Cerebral dominante, entender cómo interactuarás en entrevistas, 
                equipos y situaciones de presión es clave.
              </p>
              <Button variant="outline" className="w-full border-slate-600 hover:border-purple-500" size="sm">
                Ver Detalles
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700 hover:border-purple-500/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">Avanzar a A2</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-slate-400">
                En A2: Ruta, crearemos tu plan personalizado de 90 días basado en tu Perfil Cerebral 
                y tus objetivos de carrera.
              </p>
              <Button 
                onClick={() => router.push('/despega/a2-routes')}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                Ir a A2: Ruta
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-6 bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg">
          <p className="text-slate-300 mb-4">
            <strong>¿Tienes dudas sobre tu perfil?</strong> Nuestro coach está disponible para ayudarte 
            a interpretar tus resultados y cómo aplicarlos en tu búsqueda de oportunidades.
          </p>
          <Button variant="outline" className="border-purple-500 hover:border-purple-400 hover:text-purple-400">
            Hablar con el Coach
          </Button>
        </div>
      </ASectionPart>
    </ASection>
  )
}
