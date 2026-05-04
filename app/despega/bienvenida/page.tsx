'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Lightbulb, Zap, Target, ArrowRight, CheckCircle2, Brain, BookOpen, Users, Compass, ChevronDown } from 'lucide-react'
import { StepHeader } from '@/components/step-header'
import { PillarStatusCard } from '@/components/pillar-status-card'

export default function BienvenidaPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [expandedDetails, setExpandedDetails] = useState(false)
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

        {/* Pilares Grid with Expandable Details */}
        <div className="relative mb-12">
          {/* Leer más button - Top right corner */}
          <div className="absolute -top-12 right-0 z-10">
            <button
              onClick={() => setExpandedDetails(!expandedDetails)}
              className="text-sm font-medium hover:opacity-80 transition flex items-center gap-1"
              style={{ color: 'rgb(80, 160, 170)' }}
            >
              {expandedDetails ? 'Leer menos' : '+ Leer más'}
              <ChevronDown 
                className="w-4 h-4 transition-transform" 
                style={{ 
                  transform: expandedDetails ? 'rotate(180deg)' : 'rotate(0deg)'
                }} 
              />
            </button>
          </div>

          <div className="space-y-6">
          {/* Paso 1: Conocer tu Perfil */}
          <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
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
                    <Button className="w-full text-white font-bold text-lg py-6 rounded-[20px]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)' }}>
                      Comenzar Diagnóstico <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 2: Tu Plan de 90 Días */}
          <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] flex-shrink-0" style={{ backgroundColor: 'rgba(90, 90, 150, 0.4)' }}>
                  <span className="text-3xl font-bold" style={{ color: 'rgba(90, 90, 150)' }}>2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Exploración: Ruta de 90 Días</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Plan estratégico personalizado de 90 días estructurado en 3 fases progresivas para tu transformación profesional.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(90, 90, 150)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 1 (Días 1-30):</strong> Fundamentación - Aprende principios, desarrolla storytelling, define tu valor</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(90, 90, 150)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 2 (Días 31-60):</strong> Exploración - Descubre oportunidades, construye red, mejora presencia digital</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(90, 90, 150)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 3 (Días 61-90):</strong> Implementación - Aplica en entrevistas reales, negocia ofertas</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-background/80 rounded-[2px] border border-purple/20">
                    <p className="text-sm text-muted-foreground dark:text-white/85">
                      <strong style={{ color: 'rgba(90, 90, 150)' }}>Dedicación:</strong> 2-3 horas por semana | <strong style={{ color: 'rgba(90, 90, 150)' }}>Feedback:</strong> Inmediato después de cada sesión
                    </p>
                  </div>
                  <Link href="/despega/plan" className="block mt-6">
                    <Button className="w-full text-white font-bold text-lg py-6 rounded-[20px]" style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}>
                      Ver Tu Plan <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 3: Entrena y Analiza */}
          <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] flex-shrink-0" style={{ backgroundColor: 'rgb(170, 70, 170, 0.4)' }}>
                  <span className="text-3xl font-bold" style={{ color: 'rgb(170, 70, 170)' }}>3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Entrenamiento: Entrena y Analiza</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Práctica intensiva con simulaciones realistas y feedback multimodal avanzado. Domina 4 módulos en 4 niveles de dificultad.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(170, 70, 170)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>4 Módulos:</strong> Entrevistas, Presentaciones, Decisiones Estratégicas, Comunicación Ejecutiva</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(170, 70, 170)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>4 Niveles:</strong> Guiada → Estructurada → Desafiante → Maestría (progresión obligatoria)</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(170, 70, 170)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Análisis Completo:</strong> Postura, tono, gestos, coherencia, contenido - feedback IA instantáneo</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-background/80 rounded-[2px] border border-training/20">
                    <p className="text-sm text-muted-foreground dark:text-white/85">
                      <strong style={{ color: 'rgb(170, 70, 170)' }}>Entrevistador IA:</strong> Conversacional y adaptativo | <strong style={{ color: 'rgb(170, 70, 170)' }}>Feedback:</strong> Detallado después de cada sesión
                    </p>
                  </div>
                  <Link href="/despega/a3" className="block mt-6">
                    <Button className="w-full text-white font-bold text-lg py-6 rounded-[20px]" style={{ backgroundColor: 'rgb(170, 70, 170, 0.8)' }}>
                      Comenzar Entrenamiento <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Paso 4: Ejecución Continua */}
          <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] flex-shrink-0" style={{ backgroundColor: 'rgba(225, 120, 130, 0.4)' }}>
                  <span className="text-3xl font-bold" style={{ color: 'rgba(225, 120, 130)' }}>4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">La Realidad: Ejecución Continua</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Aplicación real en el mercado laboral. De la búsqueda a la colocación con soporte continuo y análisis de oportunidades.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(225, 120, 130)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Bolsa de Oportunidades:</strong> Empleos filtrados + contactos + referrals personalizados</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(225, 120, 130)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Dashboard de Progreso:</strong> Métrica de empleabilidad, comparativa con benchmark, evolución en tiempo real</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(225, 120, 130)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Feedback del Mercado:</strong> Análisis de entrevistas reales, optimización continua, contacto con reclutadores</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-background/80 rounded-[2px] border border-green/20">
                    <p className="text-sm text-muted-foreground dark:text-white/85">
                      <strong style={{ color: 'rgba(225, 120, 130)' }}>Duración:</strong> Indefinida durante búsqueda | <strong style={{ color: 'rgba(225, 120, 130)' }}>Soporte:</strong> Coaches + comunidad + premium
                    </p>
                  </div>
                  <Link href="/despega/a4" className="block mt-6">
                    <Button className="w-full text-white font-bold text-lg py-6 rounded-[20px]" style={{ backgroundColor: 'rgba(225, 120, 130, 0.6)' }}>
                      Acceder Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>

        {/* Expanded Details Section */}
        {expandedDetails && (
          <div className="mb-12 space-y-6">
            {/* Pilar 1 Details */}
            <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}>
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-xl font-bold text-muted/90 dark:text-white mb-4" style={{ color: 'rgba(80, 160, 170)' }}>
                  Pilar 1: Conozcámonos - Descripción Detallada
                </h3>
                <div className="space-y-4 text-sm text-muted-foreground dark:text-muted-foreground">
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Evaluación de Perfil:</p>
                    <p>Analizamos tus fortalezas comunicativas, puntos de mejora técnicos y blandos, y definimos tu diferencial único en el mercado laboral.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Contexto Laboral:</p>
                    <p>Comprendemos tus objetivos de carrera, sector preferido, tipo de rol, ubicación, nivel de experiencia y expectativas salariales para personalizar todo tu viaje.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Baseline Personalizado:</p>
                    <p>Creamos tu punto de partida único con métricas iniciales de desempeño en comunicación, presencia y confianza que te permitirá medir tu progreso a lo largo de los 90 días.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pilar 2 Details */}
            <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(90, 90, 150, 0.15)' }}>
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-xl font-bold text-muted/90 dark:text-white mb-4" style={{ color: 'rgba(90, 90, 150)' }}>
                  Pilar 2: Exploración - Descripción Detallada
                </h3>
                <div className="space-y-4 text-sm text-muted-foreground dark:text-muted-foreground">
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Fase 1 (Días 1-30) - Fundamentación:</p>
                    <p>Domina los principios clave de comunicación ejecutiva, desarrolla tu storytelling profesional único, define tu propuesta de valor y construye la mentalidad ganadora necesaria.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Fase 2 (Días 31-60) - Exploración:</p>
                    <p>Descubre oportunidades en el mercado, construye una red profesional estratégica, optimiza tu presencia digital (LinkedIn, portafolio) y prepárate para el siguiente nivel.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Fase 3 (Días 61-90) - Implementación:</p>
                    <p>Aplica todo lo aprendido en entrevistas reales, negocia ofertas laborales, perfecciona tu pitch ejecutivo y consolida tu posición en el mercado laboral.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pilar 3 Details */}
            <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(170, 70, 170, 0.15)' }}>
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-xl font-bold text-muted/90 dark:text-white mb-4" style={{ color: 'rgb(170, 70, 170)' }}>
                  Pilar 3: Entrenamiento - Descripción Detallada
                </h3>
                <div className="space-y-4 text-sm text-muted-foreground dark:text-muted-foreground">
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">4 Módulos Especializados:</p>
                    <p><strong>Entrevistas:</strong> Situacionales, técnicas y ejecutivas | <strong>Presentaciones:</strong> Pitch, demos, keynotes | <strong>Decisiones Estratégicas:</strong> Case studies y resolución de problemas | <strong>Comunicación Ejecutiva:</strong> Negociación, liderazgo y persuasión.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">4 Niveles de Progresión:</p>
                    <p><strong>Guiada:</strong> Coach te acompaña paso a paso | <strong>Estructurada:</strong> Más autonomía, mismo soporte | <strong>Desafiante:</strong> Presión de tiempo y contextos complejos | <strong>Maestría:</strong> Entrevistas libre sin límites con máximo realismo.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Análisis Multimodal IA:</p>
                    <p>Feedback instantáneo en postura corporal, tonalidad de voz, lenguaje verbal, coherencia del mensaje, impacto emocional y recomendaciones personalizadas para cada sesión.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pilar 4 Details */}
            <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(225, 120, 130, 0.15)' }}>
              <CardContent className="pt-8 pb-8 px-8">
                <h3 className="text-xl font-bold text-muted/90 dark:text-white mb-4" style={{ color: 'rgba(225, 120, 130)' }}>
                  Pilar 4: La Realidad - Descripción Detallada
                </h3>
                <div className="space-y-4 text-sm text-muted-foreground dark:text-muted-foreground">
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Aplicación Real en el Mercado:</p>
                    <p>Después del día 90, pasas a ejecución continua donde aplicas todo en entrevistas reales con empresas. El soporte y coaching continúan a lo largo de toda tu búsqueda laboral.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Bolsa de Oportunidades:</p>
                    <p>Acceso a oportunidades laborales filtradas por tu perfil, conexión con reclutadores, referrals personalizados y análisis de ofertas para negociación óptima.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Dashboard de Empleabilidad:</p>
                    <p>Métrica visual de tu empleabilidad, comparativa con benchmark del mercado, evolución de tu desempeño en tiempo real y feedback del mercado basado en entrevistas reales.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white mb-2">Soporte Continuo:</p>
                    <p>Coaching personalizado, acceso a comunidad de mentores y profesionales, sesiones de preparación específicas por empresa y soporte hasta tu colocación exitosa.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
