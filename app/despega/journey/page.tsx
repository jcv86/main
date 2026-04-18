'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, CheckCircle2, Circle, Lock } from 'lucide-react'
import Link from 'next/link'

interface PhaseProgress {
  phase: 'A1' | 'A2' | 'A4' | 'A3'
  name: string
  description: string
  status: 'completed' | 'in-progress' | 'upcoming'
  progress: number
  color: string
  bgColor: string
  icon: React.ReactNode
  href: string
  weeks: string
}

export default function JourneyPage() {
  const router = useRouter()
  const supabase = createClient()
  const [phases, setPhases] = useState<PhaseProgress[]>([])
  const [overallProgress, setOverallProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const loadUserProgress = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        setUserName(user.user_metadata?.name || user.email || 'Usuario')

        // Get user journey progress from DB
        const { data: progressData } = await supabase
          .from('user_journey_progress')
          .select('*')
          .eq('user_id', user.id)
          .single()

        // Default phases structure
        const defaultPhases: PhaseProgress[] = [
          {
            phase: 'A1',
            name: 'El Espejo',
            description: 'Descubre quién eres realmente',
            status: 'completed',
            progress: 100,
            color: 'text-blue dark:text-blue-400',
            bgColor: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
            icon: <CheckCircle2 className="w-6 h-6" />,
            href: '/despega/a1-cerebral',
            weeks: 'Semana 1',
          },
          {
            phase: 'A2',
            name: 'Tu Plan',
            description: 'Define tu transformación en 90 días',
            status: 'in-progress',
            progress: 40,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
            icon: <Circle className="w-6 h-6" />,
            href: '/despega/a2/dashboard',
            weeks: 'Semanas 2-5',
          },
          {
            phase: 'A4',
            name: 'La Realidad',
            description: 'Entiende tu contexto y oportunidades',
            status: 'in-progress',
            progress: 30,
            color: 'text-blue dark:text-cyan-400',
            bgColor: 'from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900',
            icon: <Circle className="w-6 h-6" />,
            href: '/despega/a4-base',
            weeks: 'Semanas 2-5',
          },
          {
            phase: 'A3',
            name: 'Tu Práctica',
            description: 'Entrena y practica tu transformación',
            status: 'upcoming',
            progress: 0,
            color: 'text-orange dark:text-orange-400',
            bgColor: 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
            icon: <Lock className="w-6 h-6" />,
            href: '/despega/a3',
            weeks: 'Semanas 6-13',
          },
        ]

        // Apply custom progress if available
        if (progressData) {
          defaultPhases.forEach(phase => {
            const phaseData = progressData[`${phase.phase.toLowerCase()}_progress`]
            if (phaseData !== undefined) {
              phase.progress = phaseData
              phase.status = phaseData === 100 ? 'completed' : phaseData > 0 ? 'in-progress' : 'upcoming'
            }
          })
        }

        setPhases(defaultPhases)
        const avgProgress = Math.round(defaultPhases.reduce((sum, p) => sum + p.progress, 0) / defaultPhases.length)
        setOverallProgress(avgProgress)
        setLoading(false)
      } catch (error) {
        console.error('Error loading journey progress:', error)
        setLoading(false)
      }
    }

    loadUserProgress()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Cargando tu jornada...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Tu Jornada de Transformación</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
            Hola {userName}, aquí ves el progreso de tu transformación profesional en 90 días
          </p>

          {/* OVERALL PROGRESS */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg p-6 border border-blue/30 dark:border-indigo-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Progreso General</h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">A través de todas las fases</p>
              </div>
              <Badge className="bg-indigo-600 text-white text-lg px-4 py-2">{overallProgress}%</Badge>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex justify-between text-xs text-indigo-700 dark:text-indigo-300 mt-3">
              <span>Inicio</span>
              <span>A mitad</span>
              <span>Completo</span>
            </div>
          </div>
        </div>

        {/* PHASES GRID */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {phases.map((phase, idx) => (
            <div key={phase.phase}>
              <Link href={phase.href} className="block h-full">
                <Card className={`bg-gradient-to-br ${phase.bgColor} border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer h-full flex flex-col`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-2xl font-bold ${phase.color}`}>{phase.phase}</span>
                          <Badge variant={phase.status === 'completed' ? 'default' : phase.status === 'in-progress' ? 'secondary' : 'outline'}>
                            {phase.status === 'completed' ? 'Completado' : phase.status === 'in-progress' ? 'En Progreso' : 'Próximo'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">{phase.name}</CardTitle>
                        <CardDescription className="text-sm mt-1">{phase.description}</CardDescription>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">{phase.weeks}</p>
                      </div>
                      <div className={phase.color}>{phase.icon}</div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progreso</span>
                          <span className="text-sm font-bold">{phase.progress}%</span>
                        </div>
                        <Progress value={phase.progress} className="h-2" />
                      </div>

                      {phase.status === 'upcoming' && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                          Disponible cuando completes A2 y A4
                        </p>
                      )}

                      {phase.status !== 'upcoming' && (
                        <Button className="w-full mt-4" variant={phase.status === 'completed' ? 'outline' : 'default'}>
                          {phase.status === 'completed' ? 'Revisar' : 'Continuar'} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>

        {/* CYCLE VISUALIZATION */}
        <Card>
          <CardHeader>
            <CardTitle>Tu Flujo de Transformación</CardTitle>
            <CardDescription>Cómo se conectan todas las fases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300">A1</div>
                <div className="flex-1 h-1 bg-gradient-to-r from-blue-300 to-slate-300 dark:from-blue-700 dark:to-slate-700"></div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">↓</div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center font-bold text-green-700 dark:text-green-300">A2</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tu Plan Personalizado</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center font-bold text-cyan-700 dark:text-cyan-300">A4</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Contexto del Mercado</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-slate-300 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">↓</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center font-bold text-orange-700 dark:text-orange-300">A3</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Entrenamientos Inteligentes</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Usando tu plan + contexto de mercado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEXT STEPS */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-8 border border-blue/30 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-4">Próximos Pasos</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>Ya completaste A1 y descubriste tu perfil</span>
            </li>
            <li className="flex gap-3">
              <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>Ahora trabaja en A2 para definir tu plan de 90 días</span>
            </li>
            <li className="flex gap-3">
              <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>Usa A4 para entender el contexto del mercado</span>
            </li>
            <li className="flex gap-3">
              <Circle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>Practica en A3 con entrenamientos personalizados</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
