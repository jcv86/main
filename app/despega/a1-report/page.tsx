'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, CheckCircle2, Zap, Target, Phone } from 'lucide-react'
import { ASection, ASectionPart } from '@/components/a-section-layout'
import { DESPEGA_PROFILES } from '@/lib/despega-profiles'

interface CerebroProfile {
  D: number
  I: number
  S: number
  C: number
  primary: string
  primaryScore: number
  secondary: string
  secondaryScore: number
}

interface TestDataRecord {
  test_data?: {
    energia?: number
    relaciones?: number
    plan_ejecutivo?: number
    enfoque?: number
  }
}

export default function A1ReportPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<CerebroProfile | null>(null)
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
      const { data: testDataArray, error: queryError } = await supabase
        .from('a1_cerebral_assessment')
        .select('disc_profile')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(1)

      if (queryError) throw queryError

      if (!testDataArray || testDataArray.length === 0) {
        setError('No se encontraron respuestas. Por favor completa la evaluación.')
        setLoading(false)
        return
      }

      const testData = testDataArray[0]
      const disc_profile = testData.disc_profile as Record<string, number> || {}

      const profile: CerebroProfile = {
        D: disc_profile.D || 0,
        I: disc_profile.I || 0,
        S: disc_profile.S || 0,
        C: disc_profile.C || 0,
        primary: 'D',
        primaryScore: disc_profile.D || 0,
        secondary: 'I',
        secondaryScore: disc_profile.I || 0
      }

      const scores = [
        { letter: 'D', value: profile.D },
        { letter: 'I', value: profile.I },
        { letter: 'S', value: profile.S },
        { letter: 'C', value: profile.C }
      ]
      scores.sort((a, b) => b.value - a.value)

      profile.primary = scores[0].letter
      profile.primaryScore = scores[0].value
      profile.secondary = scores[1].letter
      profile.secondaryScore = scores[1].value

      console.log('[v0] Loaded profile from a1_cerebral_assessment:', profile)
      setProfile(profile)
      setLoading(false)
    } catch (err) {
      console.error('[v0] Error loading cerebral report:', err)
      setError('Error al cargar el reporte.')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (error) {
    return (
      <ASection title="A1: Origen" subtitle="Tu Perfil Cerebral" icon="🎯" colorClass="from-purple-500 to-blue-500">
        <ASectionPart title="Completar Evaluación" icon={<Zap />}>
          <div className="space-y-4">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-900/50 rounded-lg">
              <p className="text-red-700 dark:text-red-300 font-semibold text-lg">{error}</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                Por favor completa la evaluación de Perfil Cerebral para ver tus resultados. El proceso toma aproximadamente 10-15 minutos.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/despega/a1-cerebral')} 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6 text-lg"
            >
              <Target className="w-5 h-5 mr-2" />
              Comenzar Evaluación de Perfil Cerebral
            </Button>
            <Button 
              onClick={() => router.push('/despega')} 
              variant="outline"
              className="w-full"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </ASectionPart>
      </ASection>
    )
  }

  if (!profile) return null

  const discToDespega = { D: 'Impulsor', I: 'Catalizador', S: 'Estabilizador', C: 'Arquitecto' }
  const despegaLabels = { Impulsor: 'Impulsor - Orientado a Resultados', Catalizador: 'Catalizador - Influyente', Estabilizador: 'Estabilizador - Constante', Arquitecto: 'Arquitecto - Analítico' }
  const primaryLabel = discToDespega[profile.primary as keyof typeof discToDespega]
  const secondaryLabel = discToDespega[profile.secondary as keyof typeof discToDespega]

  return (
    <ASection title="A1: Origen" subtitle="Tu Perfil Cerebral" icon="🎯" colorClass="from-purple-500 to-blue-500">
      <ASectionPart title="Tu Perfil Cerebral" icon={<Target />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Tipo Dominante</p>
            <div className="text-3xl font-black text-purple-400 mb-2">{primaryLabel}</div>
            <p className="font-semibold text-white mb-4 text-sm">{despegaLabels[primaryLabel as keyof typeof despegaLabels]}</p>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${Math.max(0, profile.primaryScore)}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.max(0, Math.round(profile.primaryScore))}%</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Tipo Secundario</p>
            <div className="text-3xl font-black text-blue-400 mb-2">{secondaryLabel}</div>
            <p className="font-semibold text-white mb-4 text-sm">{despegaLabels[secondaryLabel as keyof typeof despegaLabels]}</p>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${Math.max(0, profile.secondaryScore)}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.max(0, Math.round(profile.secondaryScore))}%</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-white mb-4">Tus 4 Perfiles Despega Cerebral</h3>
          <div className="space-y-3">
            {[
              { label: 'Impulsor', score: profile.D },
              { label: 'Catalizador', score: profile.I },
              { label: 'Estabilizador', score: profile.S },
              { label: 'Arquitecto', score: profile.C }
            ].map((dim, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <p className="font-bold text-white w-40">{dim.label}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Entender Tus Patrones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">Descubre cómo tu perfil te ayuda en entrevistas y equipos.</p>
              <Button onClick={() => router.push('/despega/a1-patterns')} variant="outline" className="border-slate-600" size="sm">
                Ver Detalles
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/40 to-teal-900/20 border-cyan-600/30 border-2">
            <CardHeader>
              <CardTitle className="text-lg text-cyan-300">📞 Call Entrena</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">Practica entrevistas con un entrenamiento personalizado para tu perfil {primaryLabel}.</p>
              <Button 
                onClick={() => router.push(`/despega/a1-call-entrena?profile=${profile.primary}`)} 
                className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white" 
                size="sm"
              >
                <Phone className="w-3 h-3 mr-1" />
                Comenzar Call Entrena
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg">Avanzar a A2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">Crea tu plan de 90 días.</p>
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
