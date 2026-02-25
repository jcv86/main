'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock, Zap, Target, Award, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function JourneySummaryPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <Link href="/despega/base" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Inicio
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50">Tu Resumen del Viaje</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Visualiza tu transformación de 90 días en DespegarTuCarrera</p>
          </div>
        </div>

        {/* OVERALL PROGRESS */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6" />
              Tu Progreso General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-5xl font-bold mb-2">50%</div>
                <p className="text-indigo-100">Completado en 45 días</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-2">45/90</div>
                <p className="text-indigo-100">días en el programa</p>
              </div>
            </div>
            <Progress value={50} className="h-3 bg-white/30" />
            <p className="text-sm text-indigo-100">Ritmo: 1 fase cada 22.5 días. A3 y A4 por completar.</p>
          </CardContent>
        </Card>

        {/* PHASES BREAKDOWN */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Las 4 Fases</h2>
          
          {/* A1 */}
          <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🧠</div>
                    <div>
                      <h3 className="font-bold text-lg">A1: Autoconocimiento (Cerebral)</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Descubrimiento de tu perfil DISC y valores</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-semibold">Estado:</span> Completado ✓</p>
                    <p><span className="font-semibold">Tiempo:</span> 15 días</p>
                    <p><span className="font-semibold">Logro:</span> Test DISC realizado, perfil identificado</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white h-fit">Completado</Badge>
              </div>
              <Progress value={100} className="mt-4 h-2" />
            </CardContent>
          </Card>

          {/* A2 */}
          <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🏗️</div>
                    <div>
                      <h3 className="font-bold text-lg">A2: Exploración y Construcción</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Plan de acción y sprints de transformación</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-semibold">Estado:</span> En Progreso (Sprint 1/3)</p>
                    <p><span className="font-semibold">Tiempo:</span> 30 días de 90</p>
                    <p><span className="font-semibold">Logro:</span> 12 acciones completadas, 7 días de racha</p>
                  </div>
                </div>
                <Badge className="bg-yellow-600 text-white h-fit">En Progreso</Badge>
              </div>
              <Progress value={50} className="mt-4 h-2" />
            </CardContent>
          </Card>

          {/* A3 */}
          <Card className="border-2 border-slate-300 bg-slate-50 dark:bg-slate-900/20 opacity-75">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="font-bold text-lg">A3: Aterrizaje y Simulación</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Entrenamientos realistas y feedback en vivo</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-semibold">Estado:</span> Próximo (Comienza en día 30)</p>
                    <p><span className="font-semibold">Duración:</span> 30 días</p>
                    <p><span className="font-semibold">Incluye:</span> Simulaciones entrevistas, presentaciones, decisiones</p>
                  </div>
                </div>
                <Badge variant="outline" className="h-fit">Próximo</Badge>
              </div>
              <Progress value={0} className="mt-4 h-2" />
            </CardContent>
          </Card>

          {/* A4 */}
          <Card className="border-2 border-slate-300 bg-slate-50 dark:bg-slate-900/20 opacity-60">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🌍</div>
                    <div>
                      <h3 className="font-bold text-lg">A4: La Realidad y Contexto Estratégico</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Inteligencia de mercado, tendencias, oportunidades</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-semibold">Estado:</span> Futuro (Comienza en día 60)</p>
                    <p><span className="font-semibold">Duración:</span> 30 días</p>
                    <p><span className="font-semibold">Incluye:</span> Radar estratégico, noticias, módulos, biblioteca</p>
                  </div>
                </div>
                <Badge variant="outline" className="h-fit">Futuro</Badge>
              </div>
              <Progress value={0} className="mt-4 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* STATS GRID */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="w-8 h-8 mx-auto text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-purple-600">1/4</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Fases Completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Zap className="w-8 h-8 mx-auto text-yellow-600 mb-3" />
              <div className="text-3xl font-bold text-yellow-600">12</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Acciones Completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-green-600 mb-3" />
              <div className="text-3xl font-bold text-green-600">7/7</div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Racha Días</p>
            </CardContent>
          </Card>
        </div>

        {/* KEY INSIGHTS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Insights Clave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">Mantiene ritmo consistente</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">7 días de racha significa que estás comprometido diariamente</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">Progreso en sprint actual</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Sprint 1 de 3 en marcha. Completaste 12 acciones y sigues adelante</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-50">A3 comienza en 15 días</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Prepárate para entrenamientos realistas. Este es el pico de intensidad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEXT STEPS */}
        <Card className="border-2 border-green-500 bg-green-50 dark:bg-green-950/30">
          <CardHeader>
            <CardTitle>Tu Próximo Paso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              Continúa en <strong>A2 Sprint 1: Fundamentos</strong>. Completa las acciones diarias para fortalecer tu base antes de A3.
            </p>
            <div className="flex gap-3">
              <Link href="/despega/a2/dashboard" className="flex-1">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                  Ir a A2 Dashboard
                </Button>
              </Link>
              <Link href="/despega/base" className="flex-1">
                <Button variant="outline" className="w-full">
                  Volver a Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </main>
  )
}
