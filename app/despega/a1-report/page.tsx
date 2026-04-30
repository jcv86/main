'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, CheckCircle2, Zap, Target, Phone, Sparkles } from 'lucide-react'
import { PhaseTransitionHandler } from '@/components/phase-transition-handler'
import { EnhancedInsightsGrid } from '@/components/a1-enhanced-insights-grid'
import { A1WowReport } from '@/components/a1-wow-report'
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
  fortalezasPrincipales: string
  areasDesarrollo: string
  estiloEntrevista: string
  dinamicaEquipo: string
  carreraAlign: string
  comunicacionEfectiva: string
  gestionConflicto: string
  proxiPaso: string
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
      
      // Fetch C1 context if available
      let c1Context = {}
      try {
        const { data: c1Data } = await supabase
          .from('conozcamonos_1_responses')
          .select('responses')
          .eq('user_id', user?.id)
          .single()
        
        if (c1Data?.responses) {
          const resp = c1Data.responses
          c1Context = {
            currentSituation: resp.currentSituation || resp.situacion,
            challenges: resp.challenges || resp.desafios,
            goals: resp.goals || resp.objetivos
          }
        }
      } catch (err) {
        console.warn('[v0] Could not load C1 context:', err)
        // Continue without C1 context
      }
      
      // Fetch enhanced insights from the new endpoint
      const response = await fetch('/api/despega/a1-enhanced-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          userName: user?.user_metadata?.full_name || user?.email?.split('@')[0],
          c1Context
        })
      })

      if (!response.ok) throw new Error('Failed to generate insights')
      const data = await response.json()
      setInsights(data.insights)
      
      // Save insights to database for persistence
      try {
        await fetch('/api/despega/save-a1-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            discProfile: profile,
            insights: data.insights
          })
        })
      } catch (err) {
        console.warn('[v0] Failed to save insights to database:', err)
        // Don't fail if persistence fails - insights are still shown
      }
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-purple" />
      </div>
    )
  }

  if (error) {
    return (
      <ASection title="Tu Perfil Cerebral" subtitle="Descubre Tu Tipo de Personalidad" icon="🎯" colorClass="from-purple/50">
        <ASectionPart title="Completar Evaluación" icon={<Zap />}>
          <div className="space-y-4">
            <div className="p-6 bg-red/20 dark:bg-red/20 border-2 border-red rounded-lg">
              <p className="text-white font-semibold text-lg">{error}</p>
              <p className="text-white/85 text-base mt-3 leading-relaxed">
                Por favor completa la evaluación de Perfil Cerebral para ver tus resultados. El proceso toma aproximadamente 10-15 minutos.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/despega/a1-cerebral')} 
              className="w-full bg-purple hover:bg-purple-700 text-white font-semibold py-6 text-lg"
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
      <ASectionPart title="✨ Tu Análisis Personalizado" icon={<Sparkles />}>
        {insightsLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple mb-4" />
            <p className="text-white text-lg font-semibold">Analizando tu perfil con IA...</p>
            <p className="text-white/75 text-sm mt-2">Esto toma unos segundos</p>
          </div>
        ) : insights ? (
          <div className="space-y-6">
            <div className="bg-background">
              <p className="text-white/85 text-center text-lg">
                Basado en tu perfil y contexto personal, aquí está tu análisis completo:
              </p>
            </div>
            <EnhancedInsightsGrid insights={insights} />
          </div>
        ) : (
          <p className="text-white/75 text-center py-8">Los insights no pudieron ser generados en este momento. Intenta de nuevo más tarde.</p>
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
    <ASection title="Tu Perfil Cerebral" subtitle="Descubre Tu Tipo de Personalidad" icon="🧠" colorClass="from-purple/50">
      <ASectionPart title="Tu Perfil Cerebral Completo" icon={<Target />}>
        <div className="space-y-8">
          {/* Primary and Secondary Profile Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Primary Profile Card */}
            <div className="bg-gradient-to-br from-purple/20 to-purple/5 border-2 border-purple/40 rounded-2xl p-8">
              <p className="text-purple font-bold text-sm uppercase tracking-wide mb-3">Tu Tipo Principal</p>
              <h2 className="text-5xl font-black text-white mb-2">{primaryLabel.split(' - ')[0]}</h2>
              <p className="text-white/75 text-base mb-6 leading-relaxed">{primaryLabel.split(' - ')[1]}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden border border-white/30">
                  <div className="h-full bg-purple" style={{ width: `${Math.max(0, profile.primaryScore)}%` }} />
                </div>
                <p className="text-2xl font-bold text-white w-16 text-right">{Math.max(0, Math.round(profile.primaryScore))}%</p>
              </div>
            </div>

            {/* Secondary Profile Card */}
            <div className="bg-gradient-to-br from-blue/20 to-blue/5 border-2 border-blue/40 rounded-2xl p-8">
              <p className="text-blue font-bold text-sm uppercase tracking-wide mb-3">Tu Tipo Secundario</p>
              <h2 className="text-5xl font-black text-white mb-2">{secondaryLabel.split(' - ')[0]}</h2>
              <p className="text-white/75 text-base mb-6 leading-relaxed">{secondaryLabel.split(' - ')[1]}</p>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden border border-white/30">
                  <div className="h-full bg-blue" style={{ width: `${Math.max(0, profile.secondaryScore)}%` }} />
                </div>
                <p className="text-2xl font-bold text-white w-16 text-right">{Math.max(0, Math.round(profile.secondaryScore))}%</p>
              </div>
            </div>
          </div>

          {/* All 4 Profiles Breakdown */}
          <div className="bg-card border border-border rounded-2xl p-8">
            <h3 className="font-bold text-2xl text-white mb-8">Desglose Completo de Dimensiones</h3>
            <div className="space-y-5">
              {[
                { label: 'Impulsor', score: profile.D, color: 'from-red-500', icon: '⚡', description: 'Orientado a resultados' },
                { label: 'Catalizador', score: profile.I, color: 'from-yellow-500', icon: '🔥', description: 'Influyente y comunicativo' },
                { label: 'Estabilizador', score: profile.S, color: 'from-green', icon: '🛡️', description: 'Constante y confiable' },
                { label: 'Arquitecto', score: profile.C, color: 'from-blue', icon: '🏗️', description: 'Analítico y preciso' }
              ].map((dim, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-background/50 hover:bg-background transition-all rounded-xl border border-white/10 hover:border-white/20">
                  <span className="text-3xl">{dim.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <p className="font-bold text-white text-lg">{dim.label}</p>
                      <p className="text-white/60 text-sm">{dim.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-40">
                    <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden border border-white/30">
                      <div className={`h-full bg-gradient-to-r ${dim.color}`} style={{ width: `${(dim.score / 10) * 100}%` }} />
                    </div>
                    <p className="text-lg font-bold text-white w-10 text-right">{Math.max(0, Math.round(dim.score))}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ASectionPart>

      {/* AI-Generated Insights Section */}
      <ASectionPart title="✨ Tu Análisis Personalizado" icon={<Sparkles />}>
        {insightsLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-purple mb-4" />
            <p className="text-white text-lg font-semibold">Generando tu análisis con IA...</p>
            <p className="text-white/75 text-sm mt-2">Analizando tu perfil personalizado</p>
          </div>
        ) : insights ? (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-purple/15 to-blue/15 border-l-4 border-purple rounded-xl p-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Tu Perfil: {primaryLabel.split(' - ')[0]} + {secondaryLabel.split(' - ')[0]}
              </h3>
              <p className="text-white/85 text-lg leading-relaxed">
                Eres una persona con características únicas. Tu combinación te hace especial en cómo tomas decisiones, te relacionas con otros, y enfrentas desafíos. 
                Los siguientes insights te mostrarán exactamente qué te hace diferente y cómo aprovecharlo en tu carrera.
              </p>
            </div>

            {/* AI-Generated Insights Grid */}
            <EnhancedInsightsGrid insights={insights} />

            {/* Phase Transition Handler */}
            <PhaseTransitionHandler
              currentPhase="a1"
              isComplete={true}
              nextPhaseLabel="Siguiente Fase: Diseña Tu Ruta"
              nextPhaseUrl="/despega/conozcamonos-2"
            />
          </div>
        ) : (
          <div className="bg-red/20 border-2 border-red/50 rounded-xl p-8 text-center">
            <p className="text-red font-semibold text-lg">No se pudieron generar los insights</p>
            <p className="text-red/80 text-base mt-2">Por favor intenta de nuevo. Si el problema persiste, contacta con soporte.</p>
          </div>
        )}
      </ASectionPart>

      {/* Wow Report - Action Map */}
      <ASectionPart title="🚀 Tu Mapa de Acción" icon={<Sparkles />}>
        <div className="mb-8">
          <p className="text-white/85 text-center text-lg leading-relaxed">
            Ahora que entiendes tu perfil cerebral, aquí está tu mapa de acción personalizado. Estas son las 5 herramientas clave que te hacen imprescindible.
          </p>
        </div>
        {profile && insights ? (
          <A1WowReport 
            profile={profile} 
            insights={insights}
            userName={user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          />
        ) : null}
      </ASectionPart>

      {/* Next Steps */}
      <ASectionPart title="Próximos Pasos" icon={<CheckCircle2 />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple/20 to-purple/5 border-2 border-purple/40 hover:border-purple/60 transition-all">
            <CardHeader>
              <CardTitle className="text-xl text-white">🔍 Patrones Profundos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-white/85 mb-6 leading-relaxed">Descubre cómo tu perfil te ayuda en entrevistas, equipos y liderazgo.</p>
              <Button onClick={() => router.push('/despega/a1-patterns')} variant="outline" className="border-purple/40 w-full" size="sm">
                Explorar Patrones
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue/20 to-blue/5 border-2 border-blue/40 hover:border-blue/60 transition-all">
            <CardHeader>
              <CardTitle className="text-xl text-white">📞 Entrena de Entrevistas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-white/85 mb-6 leading-relaxed">Practica entrevistas personalizadas según tu tipo de personalidad.</p>
              <Button 
                onClick={() => router.push(`/despega/a1-call-entrena?profile=${profile.primary}`)} 
                className="w-full bg-blue hover:bg-blue/90 text-white font-semibold" 
                size="sm"
              >
                <Phone className="w-4 h-4 mr-2" />
                Comenzar
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green/20 to-green/5 border-2 border-green/40 hover:border-green/60 transition-all">
            <CardHeader>
              <CardTitle className="text-xl text-white">🗺️ Crea Tu Ruta</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-white/85 mb-6 leading-relaxed">Diseña tu plan de 90 días personalizado para alcanzar tus objetivos.</p>
              <Button onClick={() => router.push('/despega/conozcamonos-2')} className="w-full bg-green hover:bg-green/90 text-white font-semibold" size="sm">
                Siguiente Fase
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </ASectionPart>
    </ASection>
  )
}
