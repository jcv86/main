'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb, Zap, Target, ArrowRight, CheckCircle2, Brain, BookOpen, Users, Compass } from 'lucide-react'
import { StepHeader } from '@/components/step-header'
import { PillarStatusCard } from '@/components/pillar-status-card'

export default function BienvenidaPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        // Check if user exists in Supabase or is a demo user
        let userEmail = user?.email
        if (!user) {
          // Check if demo user exists in localStorage
          const demoUserStr = typeof window !== 'undefined' ? localStorage.getItem('demo_user') : null
          if (demoUserStr) {
            try {
              const demoUser = JSON.parse(demoUserStr)
              userEmail = demoUser.email
              console.log('[v0] Demo user found for bienvenida:', demoUser.email)
            } catch (e) {
              console.error('[v0] Error parsing demo user:', e)
              router.push('/auth/signin')
              return
            }
          } else {
            router.push('/auth/signin')
            return
          }
        }
        
        setUserName(userEmail?.split('@')[0] || 'Despega Pro')
        setLoading(false)
      } catch (err) {
        console.error('[v0] Auth error:', err)
        router.push('/auth/signin')
      }
    }
    checkAuth()
  }, [supabase, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <StepHeader
          stepNumber={0}
          pillarName="Despega Tu Carrera"
          title="Bienvenido al Viaje de Transformación"
          description="Tu camino hacia la excelencia en entrevistas y desarrollo profesional está dividido en 4 pilares fundamentales. Completa cada uno en orden para desbloquear el siguiente."
          estimatedTime="90 días"
          pillarColor="purple"
        />

        {/* Pilares Grid */}
        <div className="space-y-6 mb-12">
          {/* Paso 1: Conocer tu Perfil */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple/10 to-pink/10 dark:from-purple/20 dark:to-pink/20">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] flex-shrink-0" style={{ backgroundColor: 'rgba(80, 160, 170, 0.4)' }}>
                  <span className="text-3xl font-bold" style={{ color: 'rgba(80, 160, 170)' }}>1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Conozcámonos</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Diagnóstico integral de tu situación profesional actual. Entendemos tu perfil, objetivos y contexto para personalizar todo tu viaje.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(80, 160, 170)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Evaluación de Perfil:</strong> Identifica tus fortalezas y áreas de mejora</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(80, 160, 170)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Contexto Laboral:</strong> Comprende tus objetivos y situación actual</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(80, 160, 170)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Baseline Personalizado:</strong> Creamos tu punto de partida único</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-background/80 rounded-lg border border-purple/20">
                    <p className="text-sm text-muted-foreground dark:text-white/85">
                      <strong style={{ color: 'rgba(80, 160, 170, 0.8)' }}>Duración:</strong> ~30 minutos | <strong style={{ color: 'rgba(80, 160, 170, 0.8)' }}>Resultado:</strong> Tu perfil personalizado que guía el viaje
                    </p>
                  </div>
                  <Link href="/despega/conocer" className="block mt-6">
                    <Button className="w-full text-white font-bold text-lg py-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)' }}>
                      Comenzar Diagnóstico <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 2: Tu Plan de 90 Días */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-purple/10 to-blue/10 dark:from-purple/20 dark:to-blue/20">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] bg-purple/30 flex-shrink-0">
                  <span className="text-3xl font-bold text-purple">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Tu Plan: Ruta de 90 Días</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Plan estratégico personalizado de 90 días estructurado en 3 fases progresivas para tu transformación profesional.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 1 (Días 1-30):</strong> Fundamentación - Aprende principios, desarrolla storytelling, define tu valor</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 2 (Días 31-60):</strong> Exploración - Descubre oportunidades, construye red, mejora presencia digital</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 3 (Días 61-90):</strong> Implementación - Aplica en entrevistas reales, negocia ofertas</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-background/80 rounded-lg border border-purple/20">
                    <p className="text-sm text-muted-foreground dark:text-white/85">
                      <strong className="text-purple">Dedicación:</strong> 2-3 horas por semana | <strong className="text-purple">Feedback:</strong> Inmediato después de cada sesión
                    </p>
                  </div>
                  <Link href="/despega/plan" className="block mt-6">
                    <Button className="w-full bg-purple hover:bg-purple/90 text-white font-bold text-lg py-6">
                      Ver Tu Plan <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 3: Entrena y Analiza */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-training/10 to-orange/10 dark:from-training/20 dark:to-orange/20">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] bg-training/30 flex-shrink-0">
                  <span className="text-3xl font-bold text-training">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Entrena y Analiza</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Práctica intensiva con simulaciones realistas y feedback multimodal avanzado. Domina 4 módulos en 4 niveles de dificultad.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-training"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>4 Módulos:</strong> Entrevistas, Presentaciones, Decisiones Estratégicas, Comunicación Ejecutiva</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-training"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>4 Niveles:</strong> Guiada → Estructurada → Desafiante → Maestría (progresión obligatoria)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-training"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Análisis Completo:</strong> Postura, tono, gestos, coherencia, contenido - feedback IA instantáneo</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-background/80 rounded-lg border border-training/20">
                    <p className="text-sm text-muted-foreground dark:text-white/85">
                      <strong className="text-training">Entrevistador IA:</strong> Conversacional y adaptativo | <strong className="text-training">Feedback:</strong> Detallado después de cada sesión
                    </p>
                  </div>
                  <Link href="/despega/a3" className="block mt-6">
                    <Button className="w-full bg-training hover:bg-training/90 text-black font-bold text-lg py-6">
                      Comenzar Entrenamiento <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 4: Ejecución Continua */}
          <Card className="border-0 shadow-md bg-gradient-to-br from-green/10 to-emerald/10 dark:from-green/20 dark:to-emerald/20">
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] bg-green/30 flex-shrink-0">
                  <span className="text-3xl font-bold text-green">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Ejecución Continua</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Aplicación real en el mercado laboral. De la búsqueda a la colocación con soporte continuo y análisis de oportunidades.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Bolsa de Oportunidades:</strong> Empleos filtrados + contactos + referrals personalizados</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Dashboard de Progreso:</strong> Métrica de empleabilidad, comparativa con benchmark, evolución en tiempo real</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green"></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Feedback del Mercado:</strong> Análisis de entrevistas reales, optimización continua, contacto con reclutadores</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-background/80 rounded-lg border border-green/20">
                    <p className="text-sm text-muted-foreground dark:text-white/85">
                      <strong className="text-green">Duración:</strong> Indefinida durante búsqueda | <strong className="text-green">Soporte:</strong> Coaches + comunidad + premium
                    </p>
                  </div>
                  <Link href="/despega/a4" className="block mt-6">
                    <Button className="w-full bg-green hover:bg-green/90 text-white font-bold text-lg py-6">
                      Acceder Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tu Viaje en 4 Pilares */}
        <div className="bg-white dark:bg-card rounded-[2px] shadow-sm p-8 mb-8 border-0 dark:border-card" style={{ backgroundColor: 'rgb(10, 30, 30)' }}>
          <h2 className="text-lg font-semibold text-muted/90 dark:text-white mb-6">Tu Viaje en 4 Pilares</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple/20 flex-shrink-0" style={{ backgroundColor: 'rgb(80, 160, 170, 0.4)' }}>
                <span className="text-lg font-bold text-purple" style={{ color: 'rgb(80, 160, 170)' }}>1</span>
              </div>
              <div>
                <p className="font-medium text-muted/90 dark:text-white" style={{ color: 'rgb(80, 160, 170)' }}>Diagnóstico Personal</p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Comprende tu perfil único y punto de partida profesional</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple/20 flex-shrink-0" style={{ backgroundColor: 'rgb(90, 90, 150, 0.4)' }}>
                <span className="text-lg font-bold text-purple" style={{ color: 'rgb(90, 90, 150)' }}>2</span>
              </div>
              <div>
                <p className="font-medium text-muted/90 dark:text-white" style={{ color: 'rgb(90, 90, 150)' }}>Plan Estratégico</p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Ruta de 90 días personalizada en 3 fases estructuradas</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-training/20 flex-shrink-0" style={{ backgroundColor: 'rgb(170, 70, 170, 0.4)' }}>
                <span className="text-lg font-bold text-training" style={{ color: 'rgb(170, 70, 170)' }}>3</span>
              </div>
              <div>
                <p className="font-medium text-muted/90 dark:text-white" style={{ color: 'rgb(170, 70, 170)' }}>Entrenamiento Intensivo</p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">4 módulos × 4 niveles con feedback multimodal IA</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green/20 flex-shrink-0" style={{ backgroundColor: 'rgb(225, 120, 130, 0.4)' }}>
                <span className="text-lg font-bold text-green" style={{ color: 'rgb(225, 120, 130)' }}>4</span>
              </div>
              <div>
                <p className="font-medium text-muted/90 dark:text-white" style={{ color: 'rgb(225, 120, 130)' }}>Ejecución Real</p>
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Del mercado laboral a tu colocación con soporte continuo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-purple/5 dark:bg-purple/30 rounded-[28px] p-6 border border-purple/30 dark:border-purple/10 mb-8">
          <h3 className="font-semibold text-muted/90 dark:text-white mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-purple" />
            Tu Viaje de Transformación
          </h3>
          <p className="text-sm text-muted-foreground dark:text-white/85 mb-4">Cronología personalizada según tu ritmo:</p>
          <ul className="space-y-3 text-sm text-muted-foreground dark:text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-purple font-bold min-w-24">Pilar 1:</span>
              <span>Diagnóstico inicial con preguntas personalizadas (~30 minutos)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple font-bold min-w-24">Pilar 2:</span>
              <span>Recibe tu plan de 90 días en 3 fases (Lectura: ~1 hora)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-training font-bold min-w-24">Pilar 3:</span>
              <span>Entrenamientos intensivos progresivos (2-3 horas/semana, 12 semanas)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-training font-bold min-w-24">→ Cada sesión:</span>
              <span>Feedback multimodal detallado (IA análisis en tiempo real)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green font-bold min-w-24">Pilar 4:</span>
              <span>Ejecución continua - Del día 90 en adelante (indefinido o hasta colocación)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green font-bold min-w-24">→ Soporte:</span>
              <span>Dashboard de empleabilidad, oportunidades, coaching y comunidad</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => router.push('/despega/conozcamonos-1')}
            className="bg-purple/80 hover:bg-purple/70 text-white px-8 py-6 text-base font-semibold"
          >
            Comenzar el Viaje
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/despega')}
            className="px-8 py-6 text-base"
          >
            Ir al Dashboard
          </Button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground dark:text-muted-foreground mt-8">
          Puedes volver a esta página en cualquier momento desde el menú de Despega
        </p>
      </div>
    </div>
  )
}
