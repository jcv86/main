'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { calculateDiscProfile, interpretDiscProfile, type DiscProfile, type DiscInterpretation } from '@/lib/disc-calculator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, ArrowRight, Download } from 'lucide-react'

export default function A1ReportPage() {
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
      // Get latest test results from despega_a1_test_results (where UnifiedTestSystem saves)
      const { data: testData, error: testError } = await supabase
        .from('despega_a1_test_results')
        .select('test_data, test_type')
        .eq('user_id', user?.id)
        .eq('test_type', 'Despega Cerebral')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (testError || !testData) {
        console.log('[v0] No test data found, trying canon_disc_responses...')
        
        // Fallback: try canon_disc_responses table
        const { data: discData, error: discError } = await supabase
          .from('canon_disc_responses')
          .select('responses')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (discError || !discData) {
          setError('No se encontraron respuestas DISC. Por favor completa la evaluación.')
          console.error('[v0] No DISC responses found in either table')
          return
        }

        // Calculate from canon_disc_responses format
        const calcProfile = calculateDiscProfile(discData.responses)
        const calcInterpretation = interpretDiscProfile(calcProfile)

        setProfile(calcProfile)
        setInterpretation(calcInterpretation)

        // Save profile to user_a1_profiles
        await supabase.from('user_a1_profiles').upsert({
          user_id: user?.id,
          disc_profile: calcProfile,
          disc_interpretation: calcInterpretation,
          updated_at: new Date().toISOString()
        })

        console.log('[v0] A1 Report generated from canon_disc_responses')
        return
      }

      // Extract test data from despega_a1_test_results format
      const testDataObj = testData.test_data as any
      
      // Map Despega Cerebral scores (energia, enfoque, relaciones, plan_ejecutivo) to DISC format
      const discProfile: DiscProfile = {
        D: testDataObj.energia || 0,
        I: testDataObj.relaciones || 0,
        S: testDataObj.plan_ejecutivo || 0,
        C: testDataObj.enfoque || 0,
        primary: 'D',
        primaryScore: testDataObj.energia || 0,
        secondary: 'I',
        secondaryScore: testDataObj.relaciones || 0
      }

      // Recalculate to determine actual primary/secondary
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

      setProfile(discProfile)
      setInterpretation(calcInterpretation)

      // Save profile to user_a1_profiles
      await supabase.from('user_a1_profiles').upsert({
        user_id: user?.id,
        disc_profile: discProfile,
        disc_interpretation: calcInterpretation,
        updated_at: new Date().toISOString()
      })

      console.log('[v0] A1 Report generated successfully from despega_a1_test_results')
    } catch (err) {
      console.error('[v0] Error loading A1 report:', err)
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
          <p className="text-slate-600 dark:text-slate-400">Generando tu reporte A1...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <Card className="max-w-md p-8">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <Button onClick={() => router.push('/despega/a1-cerebral')} className="w-full">
            Volver a la Evaluación
          </Button>
        </Card>
      </div>
    )
  }

  if (!profile || !interpretation) {
    return null
  }

  const categoryColors = {
    D: 'from-red-500 to-red-600',
    I: 'from-yellow-500 to-yellow-600',
    S: 'from-green-500 to-green-600',
    C: 'from-blue-500 to-blue-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Tu Perfil DISC A1 Origen
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Diagnóstico completo de tu estilo de trabajo y personalidad
          </p>
        </div>

        {/* Primary Profile Card */}
        <Card className="p-8 mb-8 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Tu Perfil Primario
              </h2>
              <div className={`bg-gradient-to-br ${categoryColors[profile.primary]} rounded-xl p-8 text-white mb-4`}>
                <div className="text-lg font-semibold opacity-90">Tipo {profile.primary}</div>
                <div className="text-4xl font-bold">{profile.primaryScore}%</div>
                <div className="text-sm opacity-75 mt-2">{interpretation.profileName}</div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">
                Perfil: <strong>{interpretation.profileName}</strong>
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
                Puntuaciones DISC
              </h3>
              <div className="space-y-3">
                {['D', 'I', 'S', 'C'].map((category) => (
                  <div key={category}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {category} - {['Dominancia', 'Influencia', 'Estabilidad', 'Consciencia'][['D', 'I', 'S', 'C'].indexOf(category)]}
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        {profile[category as keyof typeof profile] as number}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} rounded-full`}
                        style={{ width: `${profile[category as keyof typeof profile]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Description */}
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-blue-900 dark:text-blue-200 text-sm">
              {interpretation.description}
            </p>
          </div>
        </Card>

        {/* Strengths and Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              ✓ Fortalezas
            </h3>
            <ul className="space-y-2">
              {interpretation.strengths.map((strength, i) => (
                <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-green-500 font-bold">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-l-4 border-orange-500">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              ⚠ Áreas de Desarrollo
            </h3>
            <ul className="space-y-2">
              {interpretation.developmentAreas.map((area, i) => (
                <li key={i} className="flex gap-2 text-slate-700 dark:text-slate-300">
                  <span className="text-orange-500 font-bold">•</span>
                  {area}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="p-6 mb-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            📈 Recomendaciones para tu Ruta
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interpretation.recommendations.map((rec, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                <p className="text-slate-700 dark:text-slate-300">{rec}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/despega/conozcamonos-1')}
          >
            Volver
          </Button>
          <Button
            onClick={() => router.push('/despega/a2/intro')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Continuar a A2 Ruta
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
