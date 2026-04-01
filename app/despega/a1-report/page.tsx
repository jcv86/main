'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, CheckCircle2, Zap, Target, Phone, Sparkles } from 'lucide-react'
import { ASection, ASectionPart } from '@/components/a-section-layout'
import { DESPEGA_PROFILES } from '@/lib/despega-profiles'
import { StepHeader } from '@/components/step-header'

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

interface AIInsights {
  fortalezas: string
  areasDesarrollo: string
  entrevistas: string
  equipoTrabajo: string
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
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, loading: authLoading } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (authLoading || !user?.id) return
    loadReport()
  }, [authLoading, user?.id])

  useEffect(() => {
    if (profile && !insights) {
      loadAIInsights()
    }
  }, [profile])

  const loadAIInsights = async () => {
    try {
      setInsightsLoading(true)
      const response = await fetch('/api/a1-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0]
        })
      })

      if (!response.ok) throw new Error('Failed to generate insights')
      const data = await response.json()
      setInsights(data.insights)
    } catch (err) {
      console.error('[v0] Error loading AI insights:', err)
      // Silently fail - insights are optional
    } finally {
      setInsightsLoading(false)
    }
  }

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

      console.log('[v0] Raw disc_profile from database:', disc_profile)

      // Normalize scores to 0-100 scale that sums to 100%
      const rawScores = {
        D: Math.abs(disc_profile.D || 0),
        I: Math.abs(disc_profile.I || 0),
        S: Math.abs(disc_profile.S || 0),
        C: Math.abs(disc_profile.C || 0)
      }

      console.log('[v0] Absolute raw scores:', rawScores)

      // Calculate total to normalize
      const total = rawScores.D + rawScores.I + rawScores.S + rawScores.C || 1
      const normalizedScores = {
        D: (rawScores.D / total) * 100,
        I: (rawScores.I / total) * 100,
        S: (rawScores.S / total) * 100,
        C: (rawScores.C / total) * 100
      }

      console.log('[v0] Total raw:', total)
      console.log('[v0] Normalized scores (should sum to ~100):', normalizedScores)
      console.log('[v0] Sum check:', Object.values(normalizedScores).reduce((a, b) => a + b, 0))

      const profile: CerebroProfile = {
        D: normalizedScores.D,
        I: normalizedScores.I,
        S: normalizedScores.S,
        C: normalizedScores.C,
        primary: 'D',
        primaryScore: normalizedScores.D,
        secondary: 'I',
        secondaryScore: normalizedScores.I
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

      console.log('[v0] Final profile:', profile)
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

      {/* AI-Generated Insights Section */}
      <ASectionPart title="Insights Generados con IA" icon={<Sparkles />}>
        {insightsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600 mr-2" />
            <p className="text-slate-400">Generando insights personalizados...</p>
          </div>
        ) : insights ? (
          <div className="space-y-6">
            {/* Fortalezas */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border-2 border-emerald-600/30 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-600 rounded-lg flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Tus Fortalezas Profesionales</h4>
                  <p className="text-slate-300 leading-relaxed">{insights.fortalezas}</p>
                </div>
              </div>
            </div>

            {/* Áreas de Desarrollo */}
            <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 border-2 border-blue-600/30 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-600 rounded-lg flex-shrink-0">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Áreas de Desarrollo</h4>
                  <p className="text-slate-300 leading-relaxed">{insights.areasDesarrollo}</p>
                </div>
              </div>
            </div>

            {/* Recomendaciones para Entrevistas */}
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-2 border-purple-600/30 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-600 rounded-lg flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Consejos para Entrevistas</h4>
                  <p className="text-slate-300 leading-relaxed">{insights.entrevistas}</p>
                </div>
              </div>
            </div>

            {/* Trabajo en Equipo */}
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border-2 border-amber-600/30 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-600 rounded-lg flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-2">Trabajo en Equipo</h4>
                  <p className="text-slate-300 leading-relaxed">{insights.equipoTrabajo}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Los insights no pudieron ser generados en este momento.</p>
        )}
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
          {/* Primary Profile Card */}
          <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400 rounded-xl p-6 shadow-lg border-2 border-purple-300">
            <p className="text-purple-100 text-sm mb-2 font-semibold">Tu Tipo Dominante</p>
            <div className="text-4xl font-black text-white mb-3">{primaryLabel}</div>
            <p className="font-semibold text-purple-50 mb-4 text-sm">{despegaLabels[primaryLabel as keyof typeof despegaLabels]}</p>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden border border-white/30 mb-2">
              <div className="h-full bg-gradient-to-r from-yellow-300 to-white" style={{ width: `${Math.max(0, profile.primaryScore)}%` }} />
            </div>
            <p className="text-xs text-purple-100 font-bold">{Math.max(0, Math.round(profile.primaryScore))}%</p>
          </div>

          {/* Secondary Profile Card */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 rounded-xl p-6 shadow-lg border-2 border-blue-300">
            <p className="text-blue-100 text-sm mb-2 font-semibold">Tu Tipo Secundario</p>
            <div className="text-4xl font-black text-white mb-3">{secondaryLabel}</div>
            <p className="font-semibold text-blue-50 mb-4 text-sm">{despegaLabels[secondaryLabel as keyof typeof despegaLabels]}</p>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden border border-white/30 mb-2">
              <div className="h-full bg-gradient-to-r from-cyan-300 to-white" style={{ width: `${Math.max(0, profile.secondaryScore)}%` }} />
            </div>
            <p className="text-xs text-blue-100 font-bold">{Math.max(0, Math.round(profile.secondaryScore))}%</p>
          </div>
        </div>

        {/* All 4 Profiles Breakdown */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 mb-8 border-2 border-purple-500/30 shadow-lg">
          <h3 className="font-bold text-2xl text-white mb-6">Tu Perfil Cerebral Completo</h3>
          <div className="space-y-4">
            {[
              { label: 'Impulsor', score: profile.D, color: 'from-red-500 to-orange-500', icon: '⚡' },
              { label: 'Catalizador', score: profile.I, color: 'from-yellow-500 to-orange-400', icon: '🔥' },
              { label: 'Estabilizador', score: profile.S, color: 'from-green-500 to-teal-500', icon: '🛡️' },
              { label: 'Arquitecto', score: profile.C, color: 'from-blue-500 to-purple-500', icon: '🏗️' }
            ].map((dim, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors">
                <span className="text-2xl">{dim.icon}</span>
                <p className="font-bold text-white w-32">{dim.label}</p>
                <div className="flex-1 h-4 bg-slate-600 rounded-full overflow-hidden border border-slate-500">
                  <div className={`h-full bg-gradient-to-r ${dim.color} shadow-lg`} style={{ width: `${Math.max(0, dim.score)}%` }} />
                </div>
                <div className="flex items-center gap-2">
                  <p className="w-16 text-right font-bold text-lg text-white">{Math.max(0, Math.round(dim.score))}%</p>
                </div>
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
