'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowRight, CheckCircle2, Zap, Target } from 'lucide-react'
import { ASection, ASectionPart } from '@/components/a-section'

interface DiscProfile {
  D: number
  I: number
  S: number
  C: number
  primary: string
  primaryScore: number
  secondary: string
  secondaryScore: number
}

interface DiscInterpretation {
  profileName: string
  description: string
}

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
      const { data: testData } = await supabase
        .from('despega_a1_test_results')
        .select('test_data')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (testData) {
        const testDataObj = testData.test_data as any
        const normalize = (value: number) => Math.max(0, Math.min(100, (value + 100) / 2))

        const profile: DiscProfile = {
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
          { letter: 'D' as const, value: profile.D },
          { letter: 'I' as const, value: profile.I },
          { letter: 'S' as const, value: profile.S },
          { letter: 'C' as const, value: profile.C }
        ]
        scores.sort((a, b) => b.value - a.value)

        profile.primary = scores[0].letter
        profile.primaryScore = scores[0].value
        profile.secondary = scores[1].letter
        profile.secondaryScore = scores[1].value

        setProfile(profile)
        setInterpretation({
          profileName: `Perfil ${profile.primary}${profile.secondary}`,
          description: 'Tu patrón dominante en el Perfil Cerebral'
        })
        setLoading(false)
        return
      }

      setError('No se encontraron respuestas de tu evaluación. Por favor completa la evaluación.')
    } catch (err) {
      setError('Error al cargar tu reporte. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <p className="text-slate-600 dark:text-slate-400">Cargando tu reporte...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ASection
        title="A1: Origen"
        subtitle="Tu Perfil Cerebral"
        icon="🎯"
        colorClass="from-purple-500 to-blue-500"
      >
        <ASectionPart title="Error" icon={<Zap />}>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button 
            onClick={() => router.push('/despega/a1-cerebral')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Realizar Evaluación
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </ASectionPart>
      </ASection>
    )
  }

  if (!profile || !interpretation) return null

  const discToDespega = { D: 'E', I: 'I', S: 'R', C: 'P' }
  const despegaLabels = { E: 'Energía', I: 'Influencia', R: 'Relaciones', P: 'Plan Ejecutivo' }
  const primaryLetter = discToDespega[profile.primary as keyof typeof discToDespega]
  const secondaryLetter = discToDespega[profile.secondary as keyof typeof discToDespega]

  return (
    <ASection
      title="A1: Origen"
      subtitle="Descubre tu Perfil Cerebral y potencial único"
      icon="🎯"
      colorClass="from-purple-500 to-blue-500"
    >
      <ASectionPart title="Tu Perfil Cerebral" icon={<Target />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Tipo Dominante</p>
            <div className="text-5xl font-black text-purple-400 mb-2">{primaryLetter}</div>
            <p className="font-semibold text-white mb-4">{despegaLabels[primaryLetter as keyof typeof despegaLabels]}</p>
            <p className="text-slate-300 text-sm mb-4">{interpretation.description}</p>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500" style={{ width: `${Math.max(0, profile.primaryScore)}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.max(0, Math.round(profile.primaryScore))}%</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
            <p className="text-slate-400 text-sm mb-2">Tipo Secundario</p>
            <div className="text-5xl font-black text-blue-400 mb-2">{secondaryLetter}</div>
            <p className="font-semibold text-white mb-4">{despegaLabels[secondaryLetter as keyof typeof despegaLabels]}</p>
            <p className="text-slate-300 text-sm mb-4">Tu segunda fortaleza principal</p>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${Math.max(0, profile.secondaryScore)}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">{Math.max(0, Math.round(profile.secondaryScore))}%</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 mb-8">
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
              <Button 
                onClick={() => router.push('/despega/a1-patterns')} 
                variant="outline" 
                className="border-slate-600" 
                size="sm"
              >
                Ver Detalles
              </Button>
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
