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
        router.push('/auth/signin')
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
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-4">
          <Link href="/despega/base" className="inline-flex items-center text-sm text-muted-foreground hover:text-muted/90 dark:text-muted-foreground dark:hover:text-muted/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Inicio
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-muted/90 dark:text-muted/5">Tu Resumen del Viaje</h1>
            <p className="text-lg text-muted-foreground dark:text-muted-foreground mt-2">Visualiza tu transformación de 90 días en DespegarTuCarrera</p>
          </div>
        </div>

        {/* OVERALL PROGRESS */}
        <Card className="border-0 shadow-lg bg-background">
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
                <p className="text-blue/10">Completado en 45 días</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-2">45/90</div>
                <p className="text-blue/10">días en el programa</p>
              </div>
            </div>
            <Progress value={50} className="h-3 bg-white/30" />
            <p className="text-sm text-blue/10">Ritmo: 1 fase cada 22.5 días. A3 y A4 por completar.</p>
          </CardContent>
        </Card>

        {/* PHASES BREAKDOWN */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-muted/90 dark:text-muted/5">Las 4 Fases</h2>
          
          {/* A1 */}
          <Card className="border-2 border-green bg-green/5 dark:bg-green/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🧠</div>
                    <div>
                      <h3 className="font-bold text-lg">A1: Autoconocimiento (Cerebral)</h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Descubrimiento de tu perfil DISC y valores</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-semibold">Estado:</span> Completado ✓</p>
                    <p><span className="font-semibold">Tiempo:</span> 15 días</p>
                    <p><span className="font-semibold">Logro:</span> Test DISC realizado, perfil identificado</p>
                  </div>
                </div>
                <Badge className="bg-green text-white h-fit">Completado</Badge>
              </div>
              <Progress value={100} className="mt-4 h-2" />
            </CardContent>
          </Card>

          {/* A2 */}
          <Card className="border-2 border-orange bg-yellow/5 dark:bg-yellow/20">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🏗️</div>
                    <div>
                      <h3 className="font-bold text-lg">A2: Exploración y Construcción</h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Plan de acción y sprints de transformación</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-sm">
                    <p><span className="font-semibold">Estado:</span> En Progreso (Sprint 1/3)</p>
                    <p><span className="font-semibold">Tiempo:</span> 30 días de 90</p>
                    <p><span className="font-semibold">Logro:</span> 12 acciones completadas, 7 días de racha</p>
                  </div>
                </div>
                <Badge className="bg-yellow text-white h-fit">En Progreso</Badge>
              </div>
              <Progress value={50} className="mt-4 h-2" />
            </CardContent>
          </Card>

          {/* A3 */}
          <Card className="border-2 border-muted/30 bg-muted/5 dark:bg-background/20 opacity-75">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🎯</div>
                    <div>
                      <h3 className="font-bold text-lg">A3: Aterrizaje y Simulación</h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Entrenamientos realistas y feedback en vivo</p>
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
          <Card className="border-2 border-muted/30 bg-muted/5 dark:bg-background/20 opacity-60">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-3xl">🌍</div>
                    <div>
                      <h3 className="font-bold text-lg">A4: La Realidad y Contexto Estratégico</h3>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Inteligencia de mercado, tendencias, oportunidades</p>
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
              <Award className="w-8 h-8 mx-auto text-purple mb-3" />
              <div className="text-3xl font-bold text-purple">1/4</div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2">Fases Completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Zap className="w-8 h-8 mx-auto text-yellow mb-3" />
              <div className="text-3xl font-bold text-yellow">12</div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2">Acciones Completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto text-green mb-3" />
              <div className="text-3xl font-bold text-green">7/7</div>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2">Racha Días</p>
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
              <CheckCircle2 className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-muted/90 dark:text-muted/5">Mantiene ritmo consistente</p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">7 días de racha significa que estás comprometido diariamente</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-muted/90 dark:text-muted/5">Progreso en sprint actual</p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Sprint 1 de 3 en marcha. Completaste 12 acciones y sigues adelante</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-muted/90 dark:text-muted/5">A3 comienza en 15 días</p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Prepárate para entrenamientos realistas. Este es el pico de intensidad</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* NEXT STEPS */}
        <Card className="border-2 border-green bg-green/5 dark:bg-green/30">
          <CardHeader>
            <CardTitle>Tu Próximo Paso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground dark:text-white/85">
              Continúa en <strong>A2 Sprint 1: Fundamentos</strong>. Completa las acciones diarias para fortalecer tu base antes de A3.
            </p>
            <div className="flex gap-3">
              <Link href="/despega/a2/dashboard" className="flex-1">
                <Button className="w-full bg-green hover:bg-green text-white font-semibold">
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
