'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

interface DiscScores {
  D: number
  I: number
  S: number
  C: number
}

const discProfiles = {
  D: {
    name: 'Dominante',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    icon: '🎯',
    description: 'Orientado a resultados. Decides rápido, lideras con visión y no temes el riesgo.',
    strengths: ['Liderazgo', 'Decisión rápida', 'Visión estratégica', 'Orientación a objetivos'],
    routes: ['Liderazgo Estratégico', 'Emprendimiento', 'Transformación Digital'],
  },
  I: {
    name: 'Influyente',
    color: 'from-yellow-500 to-orange-400',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    icon: '⭐',
    description: 'Inspirador y comunicativo. Conectas con otros y transmites entusiasmo contagioso.',
    strengths: ['Comunicación', 'Influencia', 'Carisma', 'Trabajo en equipo'],
    routes: ['Comunicación Efectiva', 'Liderazgo de Equipos', 'Ventas y Negociación'],
  },
  S: {
    name: 'Estable',
    color: 'from-green-500 to-teal-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    icon: '🛡️',
    description: 'Confiable y cooperativo. Eres el pilar que mantiene el equilibrio en el equipo.',
    strengths: ['Lealtad', 'Consistencia', 'Apoyo', 'Paciencia'],
    routes: ['Gestión de Procesos', 'Coaching y Mentoreo', 'Gestión de Proyectos'],
  },
  C: {
    name: 'Cuidadoso',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    icon: '🧠',
    description: 'Analítico y preciso. Buscas calidad y entiendes los detalles que otros no ven.',
    strengths: ['Análisis profundo', 'Precisión', 'Pensamiento crítico', 'Excelencia'],
    routes: ['Análisis y Estrategia', 'Calidad y Mejora Continua', 'Compliance y Riesgos'],
  },
}

export default function A1ResultadoPage() {
  const router = useRouter()
  const [testData, setTestData] = useState<any>(null)
  const [scores, setScores] = useState<DiscScores | null>(null)
  const [dominantProfile, setDominantProfile] = useState<string>('')
  const [c1Context, setC1Context] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadResults = async () => {
      try {
        const supabase = createClient()
        if (!supabase) {
          setLoading(false)
          return
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        // Get latest test results from a1_tests_results
        const { data: testResults } = await supabase
          .from('a1_tests_results')
          .select('*')
          .eq('user_id', user.id)
          .eq('test_name', 'Despega Cerebral')
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (testResults) {
          console.log("[v0] Found test results:", testResults)
          setTestData(testResults)
          
          // Parse scores from responses object
          let parsedScores: DiscScores = { D: 0, I: 0, S: 0, C: 0 }
          
          // Try to get scores from responses.d_score, i_score, s_score, c_score
          if (testResults.responses) {
            parsedScores = {
              D: testResults.responses.d_score || 0,
              I: testResults.responses.i_score || 0,
              S: testResults.responses.s_score || 0,
              C: testResults.responses.c_score || 0,
            }
          }
          
          setScores(parsedScores)
          
          // Find dominant profile
          const dominantProf = testResults.responses?.dominant_profile || testResults.profile_type || 'D'
          setDominantProfile(dominantProf)
          console.log("[v0] Set dominant profile:", dominantProf)

          // Load C1 context for informe personalization
          const { data: c1Data } = await supabase
            .from('canon_conozcamonos_1_responses')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          if (c1Data) {
            console.log("[v0] Found C1 context:", c1Data)
            setC1Context(c1Data.responses)
          }
        } else {
          console.log("[v0] No test results found")
        }
      } catch (error) {
        console.error('[v0] Error loading test results:', error)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Cargando tus resultados...</div>
      </div>
    )
  }

  if (!scores || !dominantProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">No se encontraron resultados</div>
      </div>
    )
  }

  const profile = discProfiles[dominantProfile as keyof typeof discProfiles]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Header Celebration */}
      <div className="pt-20 pb-12 px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-balance">
          ¡Tu Perfil Está Listo!
        </h1>
        <p className="text-xl text-slate-300 text-balance">
          Hemos analizado tus respuestas. Aquí está tu perfil profesional personalizado.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 space-y-12">
        {/* Perfil Principal */}
        <div className={`rounded-2xl p-8 md:p-12 bg-gradient-to-br ${profile.color} shadow-2xl border border-white/10`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-6xl md:text-7xl">{profile.icon}</div>
            <div className="flex-1 text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-3">{profile.name}</h2>
              <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">
                {profile.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {profile.strengths.map((strength) => (
                  <span
                    key={strength}
                    className="px-4 py-2 bg-white/20 rounded-full text-sm font-semibold backdrop-blur-sm"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Puntuaciones de Dimensiones */}
        <div className="grid md:grid-cols-2 gap-6">
          {(['D', 'I', 'S', 'C'] as const).map((letter) => {
            const score = scores[letter]
            const profileData = discProfiles[letter as keyof typeof discProfiles]
            const percentage = (score / 25) * 100

            return (
              <div key={letter} className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-white">{profileData.name}</h3>
                  <span className="text-2xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
                    {score}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${profileData.color} rounded-full transition-all duration-700`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Recommended Routes */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Rutas Recomendadas Para Ti</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {profile.routes.map((route) => (
              <div
                key={route}
                className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white text-lg">{route}</h4>
                    <p className="text-slate-400 text-sm mt-2">
                      Especialmente diseñada para tu perfil {profile.name}
                    </p>
        </div>

        {/* Contexto C1 Personalizado - WOW #1 */}
        {c1Context && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-6">Tu Contexto Personalizado</h3>
            <div className="space-y-4">
              {c1Context[3] && (
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-blue-400">
                  <p className="text-sm text-slate-400 mb-2">Tu desafío actual:</p>
                  <p className="text-white font-semibold">{c1Context[3]}</p>
                </div>
              )}
              {c1Context[4] && (
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-emerald-400">
                  <p className="text-sm text-slate-400 mb-2">Tu objetivo para 90 días:</p>
                  <p className="text-white font-semibold">{c1Context[4]}</p>
                </div>
              )}
              {c1Context[1] && (
                <div className="bg-slate-700/50 rounded-lg p-4 border-l-4 border-purple-400">
                  <p className="text-sm text-slate-400 mb-2">Tu situación actual:</p>
                  <p className="text-white font-semibold">{c1Context[1]}</p>
                </div>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-6 italic">
              Este perfil ha sido personalizado según tus respuestas. No podría escribirse sin el contexto que compartiste.
            </p>
          </div>
        )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center pt-8">
          <Link
            href="/despega/a2"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Explorar Tus Rutas de Transformación
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
