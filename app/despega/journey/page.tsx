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
            color: 'text-blue dark:text-blue/40',
            bgColor: 'from-blue/5/10950900',
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
            color: 'text-green dark:text-green/40',
            bgColor: 'from-green/5100950900',
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
            color: 'text-blue dark:text-cyan/40',
            bgColor: 'from-blue/5/10',
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
            color: 'text-orange dark:text-orange/40',
            bgColor: 'from-orange/5100950',
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
        <div className="text-muted/60 dark:text-muted/40">Cargando tu jornada...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* HERO SECTION */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Tu Jornada de Transformación</h1>
          <p className="text-lg text-muted/60 dark:text-muted/40 mb-6">
            Hola {userName}, aquí ves el progreso de tu transformación profesional en 90 días
          </p>

          {/* OVERALL PROGRESS */}
          <div className="bg-background">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-blue/10">Progreso General</h3>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">A través de todas las fases</p>
              </div>
              <Badge className="bg-blue text-white text-lg px-4 py-2">{overallProgress}%</Badge>
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
                <Card className={`bg-background
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
                        <p className="text-xs text-muted/60 dark:text-muted/40 mt-2">{phase.weeks}</p>
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
                        <p className="text-xs text-muted/60 dark:text-muted/40 italic">
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
                <div className="w-20 h-20 rounded-[28px] bg-blue/10 dark:bg-blue flex items-center justify-center font-bold text-blue dark:text-blue/30">A1</div>
                <div className="flex-1 h-1 bg-background"></div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-[28px] bg-muted/30 dark:bg-muted/70 flex items-center justify-center font-bold text-muted/70 dark:text-muted/30">↓</div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-[28px] bg-green/10 dark:bg-green flex items-center justify-center font-bold text-green dark:text-green/30">A2</div>
                  <p className="text-sm text-muted/60 dark:text-muted/40">Tu Plan Personalizado</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-[28px] bg-cyan/10 dark:bg-cyan flex items-center justify-center font-bold text-cyan dark:text-cyan/30">A4</div>
                  <p className="text-sm text-muted/60 dark:text-muted/40">Contexto del Mercado</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-[28px] bg-muted/30 dark:bg-muted/70 flex items-center justify-center font-bold text-muted/70 dark:text-muted/30">↓</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-[28px] bg-orange/10 dark:bg-orange flex items-center justify-center font-bold text-orange dark:text-orange/30">A3</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Entrenamientos Inteligentes</p>
                  <p className="text-xs text-muted/60 dark:text-muted/40">Usando tu plan + contexto de mercado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEXT STEPS */}
        <div className="mt-12 bg-background">
          <h3 className="text-lg font-semibold mb-4">Próximos Pasos</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-green dark:text-green/40 flex-shrink-0 mt-0.5" />
              <span>Ya completaste A1 y descubriste tu perfil</span>
            </li>
            <li className="flex gap-3">
              <Circle className="w-5 h-5 text-muted/40 flex-shrink-0 mt-0.5" />
              <span>Ahora trabaja en A2 para definir tu plan de 90 días</span>
            </li>
            <li className="flex gap-3">
              <Circle className="w-5 h-5 text-muted/40 flex-shrink-0 mt-0.5" />
              <span>Usa A4 para entender el contexto del mercado</span>
            </li>
            <li className="flex gap-3">
              <Circle className="w-5 h-5 text-muted/40 flex-shrink-0 mt-0.5" />
              <span>Practica en A3 con entrenamientos personalizados</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
