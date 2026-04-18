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
      <ASection title="A1: Origen" subtitle="Tu Perfil Cerebral" icon="🎯" colorClass="from-purple/50">
        <ASectionPart title="Completar Evaluación" icon={<Zap />}>
          <div className="space-y-4">
            <div className="p-6 bg-red/5 dark:bg-red/20 border-2 border-red/20 dark:border-red/50 rounded-lg">
              <p className="text-red dark:text-red/30 font-semibold text-lg">{error}</p>
              <p className="text-red dark:text-red/40 text-sm mt-2">
                Por favor completa la evaluación de Perfil Cerebral para ver tus resultados. El proceso toma aproximadamente 10-15 minutos.
              </p>
            </div>
            <Button 
              onClick={() => router.push('/despega/a1-cerebral')} 
              className="w-full bg-purple hover:from-purple-700 hover:to-blue text-white font-semibold py-6 text-lg"
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
      <ASectionPart title="✨ Tu Análisis Personalizado - ESE ERES TÚ" icon={<Sparkles />}>
        {insightsLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple mb-4" />
            <p className="text-muted/40 text-lg">Analizando tu perfil con IA...</p>
            <p className="text-muted/50 text-sm mt-2">Esto toma unos segundos</p>
          </div>
        ) : insights ? (
          <div className="space-y-6">
            <div className="bg-background">
              <p className="text-muted/30 text-center text-lg">
                Basado en tu perfil de El Ritual y contexto personal, aquí está tu análisis completo:
              </p>
            </div>
            <EnhancedInsightsGrid insights={insights} />
          </div>
        ) : (
          <p className="text-muted/40 text-center py-8">Los insights no pudieron ser generados en este momento. Intenta de nuevo más tarde.</p>
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
    <ASection title="A1: Origen" subtitle="Tu Perfil Cerebral" icon="🎯" colorClass="from-purple/50">
      <ASectionPart title="Tu Perfil Cerebral" icon={<Target />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Primary Profile Card */}
          <div className="bg-background">
            <p className="text-purple/10 text-sm mb-2 font-semibold">Tu Tipo Dominante</p>
            <div className="text-4xl font-black text-white mb-3">{primaryLabel}</div>
            <p className="font-semibold text-purple/5 mb-4 text-sm">{despegaLabels[primaryLabel as keyof typeof despegaLabels]}</p>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden border border-white/30 mb-2">
              <div className="h-full bg-background" style={{ width: `${Math.max(0, profile.primaryScore)}%` }} />
            </div>
            <p className="text-xs text-purple/10 font-bold">{Math.max(0, Math.round(profile.primaryScore))}%</p>
          </div>

          {/* Secondary Profile Card */}
          <div className="bg-background">
            <p className="text-blue/10 text-sm mb-2 font-semibold">Tu Tipo Secundario</p>
            <div className="text-4xl font-black text-white mb-3">{secondaryLabel}</div>
            <p className="font-semibold text-blue/5 mb-4 text-sm">{despegaLabels[secondaryLabel as keyof typeof despegaLabels]}</p>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden border border-white/30 mb-2">
              <div className="h-full bg-background" style={{ width: `${Math.max(0, profile.secondaryScore)}%` }} />
            </div>
            <p className="text-xs text-blue/10 font-bold">{Math.max(0, Math.round(profile.secondaryScore))}%</p>
          </div>
        </div>

        {/* All 4 Profiles Breakdown */}
        <div className="bg-background">
          <h3 className="font-bold text-2xl text-white mb-6">Tu Perfil Cerebral Completo</h3>
          <div className="space-y-4">
            {[
              { label: 'Impulsor', score: profile.D, color: 'from-red-500/50', icon: '⚡' },
              { label: 'Catalizador', score: profile.I, color: 'from-yellow-500400', icon: '🔥' },
              { label: 'Estabilizador', score: profile.S, color: 'from-green', icon: '🛡️' },
              { label: 'Arquitecto', score: profile.C, color: 'from-blue/50', icon: '🏗️' }
            ].map((dim, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-muted/70/50 rounded-[28px] border border-muted/60 hover:border-muted/50 transition-colors">
                <span className="text-2xl">{dim.icon}</span>
                <p className="font-bold text-white w-32">{dim.label}</p>
                <div className="flex-1 h-4 bg-muted/60 rounded-full overflow-hidden border border-muted/50">
                  <div className={`h-full bg-background
                </div>
                <div className="flex items-center gap-2">
                  <p className="w-16 text-right font-bold text-lg text-white">{Math.max(0, Math.round(dim.score))}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ASectionPart>

      {/* AI-Generated Insights Section - EL CORAZÓN DEL WOW EFFECT */}
      <ASectionPart title="✨ Tu Análisis Personalizado - ESE ERES TÚ" icon={<Sparkles />}>
        {insightsLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-purple mb-4" />
            <p className="text-muted/30 text-lg font-semibold">Generando tu análisis personalizado con IA...</p>
            <p className="text-muted/50 text-sm mt-2">Esto toma unos segundos mientras analizamos tu perfil</p>
          </div>
        ) : insights ? (
          <div className="space-y-8">
            {/* Resumen Ejecutivo */}
            <div className="bg-background">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎯</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-3">Tu Perfil: {primaryLabel} + {secondaryLabel}</h3>
                  <p className="text-muted/20 leading-relaxed text-base">
                    Eres una persona con características únicas. Tu combinación {profile.primary}/{profile.secondary} 
                    te hace especial en cómo tomas decisiones, te relacionas con otros, y enfrentas desafíos. 
                    Los siguientes 8 insights te mostrarán exactamente qué te hace diferente y cómo aprovecharlo.
                  </p>
                </div>
              </div>
            </div>

            {/* Introducción */}
            <div className="bg-muted/80/50 border border-muted/70 rounded-xl p-6 text-center">
              <p className="text-muted/30 text-lg">
                Basado en tu Perfil de El Ritual y tu contexto personal, aquí está tu análisis completo:
              </p>
            </div>

            {/* Los 8 Insights con Grid */}
            <EnhancedInsightsGrid insights={insights} />

            {/* Phase Transition Handler */}
            <PhaseTransitionHandler
              currentPhase="a1"
              isComplete={true}
              nextPhaseLabel="Exploración: Diseña Tu Ruta"
              nextPhaseUrl="/despega/conozcamonos-2"
            />
          </div>
        ) : (
          <div className="bg-red/20 border-2 border-red/50 rounded-xl p-8 text-center">
            <p className="text-red/30 text-lg font-semibold">Los insights no pudieron ser generados</p>
            <p className="text-red/40 text-sm mt-2">Por favor intenta de nuevo. Si el problema persiste, contacta con soporte.</p>
          </div>
        )}
      </ASectionPart>

      {/* A1 WOW REPORT - El Reporte de Transformación */}
      <ASectionPart title="🚀 Tu Reporte de Transformación" icon={<Sparkles />}>
        <div className="mb-6">
          <p className="text-muted/30 text-center text-lg mb-6">
            Ahora que entiendes tu perfil, aquí está tu mapa de acción. Las 5 herramientas que te hacen imprescindible.
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

      <ASectionPart title="Próximos Pasos" icon={<CheckCircle2 />}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-muted/80/40 border-muted/70">
            <CardHeader>
              <CardTitle className="text-lg">Entender Tus Patrones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted/40 mb-4">Descubre cómo tu perfil te ayuda en entrevistas y equipos.</p>
              <Button onClick={() => router.push('/despega/a1-patterns')} variant="outline" className="border-muted/60" size="sm">
                Ver Detalles
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardHeader>
              <CardTitle className="text-lg text-cyan/30">📞 Call Entrena</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted/30 mb-4">Practica entrevistas con un entrenamiento personalizado para tu perfil {primaryLabel}.</p>
              <Button 
                onClick={() => router.push(`/despega/a1-call-entrena?profile=${profile.primary}`)} 
                className="w-full bg-blue hover:from-blue hover:to-blue text-white" 
                size="sm"
              >
                <Phone className="w-3 h-3 mr-1" />
                Comenzar Call Entrena
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-muted/80/40 border-muted/70">
            <CardHeader>
              <CardTitle className="text-lg">Avanzar a A2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted/40 mb-4">Crea tu plan de 90 días.</p>
              <Button onClick={() => router.push('/despega/a2-routes')} className="w-full bg-purple hover:bg-purple" size="sm">
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
