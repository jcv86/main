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
  const [expandedPilars, setExpandedPilars] = useState<Record<number, boolean>>({})
  const supabase = createClient()

  const togglePilar = (index: number) => {
    setExpandedPilars(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

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

                  {/* Leer más button */}
                  <div className="flex justify-end mt-4 mb-4">
                    <button
                      onClick={() => togglePilar(1)}
                      className="text-sm font-medium hover:opacity-80 transition flex items-center gap-1"
                      style={{ color: 'rgb(80, 160, 170)' }}
                    >
                      {expandedPilars[1] ? 'Leer menos' : '+ Leer más'}
                      <ChevronDown 
                        className="w-4 h-4 transition-transform" 
                        style={{ 
                          transform: expandedPilars[1] ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </button>
                  </div>

                  {/* Expanded details for Pilar 1 */}
                  {expandedPilars[1] && (
                    <div className="bg-[rgba(80,160,170,0.2)] rounded-lg p-6 mb-4 border border-[rgb(80,160,170)]/10 space-y-5">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Detalles Completos del Diagnóstico Integral</h4>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">
                          Este pilar es la piedra angular de tu transformación. Nos sumergimos profundamente en tu perfil profesional actual, identificando patrones de comunicación, limitaciones mentales, y oportunidades de diferenciación que muchos candidatos nunca reconocen por su cuenta.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-teal-400/20">
                          <h5 className="font-semibold text-teal-300 mb-2">1. Evaluación Comunicativa Profunda</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Análisis de Fortalezas:</strong> Identificamos tus puntos fuertes en presentación, capacidad de síntesis, claridad conceptual y carisma natural.</li>
                            <li>• <strong>Mapa de Debilidades:</strong> Detectamos patrones limitantes como miedo escénico, falta de estructura narrativa, tonalidad monótona, o ansiedad ante preguntas difíciles.</li>
                            <li>• <strong>Diferencial Competitivo:</strong> Definimos qué te hace diferente de otros candidatos en tu sector (ejemplo: experiencia única, perspectiva multicultural, solución de problemas compleja).</li>
                            <li>• <strong>Gaps vs Mercado:</strong> Comparamos tu perfil actual con lo que empresas top buscan en tu rol, identificando brecha exacta.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-teal-400/20">
                          <h5 className="font-semibold text-teal-300 mb-2">2. Análisis Contextual Laboral Exhaustivo</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Trayectoria Actual:</strong> Mapeamos tu carrera: decisiones clave, inflection points, y por qué tomaste cada paso.</li>
                            <li>• <strong>Objetivos Reales:</strong> Vamos más allá de lo obvio (ingresos, título) para entender motivación profunda: impacto, aprendizaje, balance, legado.</li>
                            <li>• <strong>Sector + Rol Target:</strong> Definimos industrias, empresas específicas, y posiciones donde eres más fuerte (SaaS, FinTech, Scale-up, Fortune 500).</li>
                            <li>• <strong>Restricciones y Realidades:</strong> Comprendemos limitantes reales: ubicación geográfica, visa, nivel de experiencia, compensación esperada, negocios no negociables.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-teal-400/20">
                          <h5 className="font-semibold text-teal-300 mb-2">3. Baseline de Desempeño Personalizado</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Puntuación Inicial:</strong> Creamos un score de "empleabilidad" que mide: confianza (1-10), claridad de pitch (1-10), preparación técnica (1-10), networking (1-10).</li>
                            <li>• <strong>Métricas de Progreso:</strong> Estableces hitos medibles: "pasar de ansiedad 8/10 a confianza 7/10", "mejorar respuesta a preguntas difíciles de 30% aciertos a 80%".</li>
                            <li>• <strong>Tracking Visual:</strong> Dashboard personalizado que muestra evolución semana a semana, permitiendo celebrar progreso real.</li>
                            <li>• <strong>Puntos de Referencia:</strong> Comparación con candidatos que pasaron antes por tu misma situación y cómo progresaron.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-teal-400/20">
                          <h5 className="font-semibold text-teal-300 mb-2">4. Documento de Estrategia Personal</h5>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mb-2">Recibirás un documento PDF + acceso online con:</p>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• Resumen ejecutivo de tu perfil (quién eres profesionalmente)</li>
                            <li>• Listado de 5 fortalezas clave + cómo usarlas en entrevistas</li>
                            <li>• Listado de 5 áreas de mejora + plan concreto para cada una</li>
                            <li>• Tu diferencial competitivo en 1-2 párrafos memorables</li>
                            <li>• Roadmap de 90 días personalizado basado en tu situación actual</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-teal-400/10 rounded p-4 border border-teal-400/30">
                        <p className="text-sm text-teal-300 font-semibold">💡 Resultado esperado después del Diagnóstico:</p>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mt-2">
                          Tendrás claridad total de quién eres profesionalmente, cuál es tu posición en el mercado, qué necesitas mejorar, y un plan concreto para los próximos 90 días. Pasarás de "no sé por dónde empezar" a "tengo un roadmap claro y realista".
                        </p>
                      </div>
                    </div>
                  )}
                  
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

                  {/* Leer más button */}
                  <div className="flex justify-end mt-4 mb-4">
                    <button
                      onClick={() => togglePilar(2)}
                      className="text-sm font-medium hover:opacity-80 transition flex items-center gap-1"
                      style={{ color: 'rgba(90, 90, 150)' }}
                    >
                      {expandedPilars[2] ? 'Leer menos' : '+ Leer más'}
                      <ChevronDown 
                        className="w-4 h-4 transition-transform" 
                        style={{ 
                          transform: expandedPilars[2] ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </button>
                  </div>

                  {/* Expanded details for Pilar 2 */}
                  {expandedPilars[2] && (
                    <div className="bg-[rgba(80,160,170,0.2)] rounded-lg p-6 mb-4 border border-[rgb(80,160,170)]/10 space-y-5">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Detalles del Plan Estratégico de 90 Días</h4>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">
                          Este es tu roadmap ejecutivo personalizado. Basado en tu diagnóstico y objetivos, diseñamos 3 fases que te llevan desde donde estás ahora hasta la colocación. Cada fase tiene hitos específicos, acciones concretas, y resultados medibles.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-purple-400/20">
                          <h5 className="font-semibold text-purple-300 mb-2">FASE 1: Fundamentación (Días 1-30)</h5>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mb-3 font-medium text-purple-300">Objetivo: Construir tus cimientos comunicativos</p>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Semana 1-2: Storytelling Personal</strong> - Desarrollas tu narrativa profesional: quién eres, de dónde vienes, por qué hiciste X cambio, dónde vas. No es un CV aburrido, es una historia conectante.</li>
                            <li>• <strong>Semana 2-3: Propuesta de Valor</strong> - Definimos exactamente qué problema resuelves, para quién, por qué mejor que otros. Tu "elevator pitch" perfecto.</li>
                            <li>• <strong>Semana 3-4: Mentalidad Ganadora</strong> - Trabajamos creencias limitantes, ansiedades, y patrones de autosabotaje. Construimos la mentalidad de alguien que ES empleable.</li>
                            <li>• <strong>Semana 4: Mock Interview Inicial</strong> - Tu primer simulacro de entrevista para ver baseline real de performance.</li>
                            <li className="pt-2 border-t border-[rgb(80,160,170)]/10 mt-3 pt-3"><strong>KPI Fase 1:</strong> Tener narrativa clara, pitch de 2-3 minutos impactante, confianza mejorada 30%.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-purple-400/20">
                          <h5 className="font-semibold text-purple-300 mb-2">FASE 2: Exploración (Días 31-60)</h5>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mb-3 font-medium text-purple-300">Objetivo: Posicionarte en el mercado + descubrir oportunidades</p>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Semana 5-6: Mapeo de Mercado</strong> - Identificamos empresas target (10-15), escenarios en cada una, y estrategia de approach por cada una.</li>
                            <li>• <strong>Semana 6-7: LinkedIn Mastery</strong> - Optimizamos tu perfil para que reclutadores te encuentren. Cambio de foto, headline poderoso, descripción estratégica, endorsements correctos.</li>
                            <li>• <strong>Semana 7-8: Networking Activo</strong> - Construyes conexiones reales: informational interviews, conexiones en LinkedIn, referrals. No es contactar 1000 personas; es relaciones genuinas con 20-30.</li>
                            <li>• <strong>Semana 8: Aplicaciones Estratégicas</strong> - Comienzas a aplicar y conectar con reclutadores para conseguir tus primeras entrevistas reales.</li>
                            <li className="pt-2 border-t border-[rgb(80,160,170)]/10 mt-3 pt-3"><strong>KPI Fase 2:</strong> Tener 5-10 conversaciones iniciales, 2-3 entrevistas reales programadas, perfil LinkedIn optimizado.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-purple-400/20">
                          <h5 className="font-semibold text-purple-300 mb-2">FASE 3: Implementación (Días 61-90)</h5>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mb-3 font-medium text-purple-300">Objetivo: Convertir entrevistas en ofertas</p>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Semana 9-10: Entrevistas Reales</strong> - Aplicas todo lo aprendido en entrevistas de verdad. Coaching específico pre/post entrevista para cada una.</li>
                            <li>• <strong>Semana 10-11: Perfeccionamiento</strong> - Iteramos basado en feedback real. Si pasaste a Round 2, preparamos específicamente para eso.</li>
                            <li>• <strong>Semana 11-12: Negociación + Cierre</strong> - Recibes ofertas y necesitas cerrar la mejor. Coaching en negociación salarial, benefits, rol exacto.</li>
                            <li>• <strong>Semana 13 en adelante: Continuidad</strong> - Sigues en la búsqueda si es necesario, con soporte hasta colocación confirmada.</li>
                            <li className="pt-2 border-t border-[rgb(80,160,170)]/10 mt-3 pt-3"><strong>KPI Fase 3:</strong> Mínimo 5 ofertas, negociación exitosa, aceptación de rol target.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-purple-400/20">
                          <h5 className="font-semibold text-purple-300 mb-2">Estructura Semanal (Todas las Fases)</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• 2-3 horas de training/coaching semanal (sesiones 60-90 min)</li>
                            <li>• 2-3 mock interviews con feedback video (grabadas y analizadas)</li>
                            <li>• Acceso 24/7 a recursos: templates, scripts, case studies resueltos</li>
                            <li>• Comunidad privada con otros candidatos en el programa (aprendizaje colectivo)</li>
                            <li>• Reportes semanales de progreso vs plan inicial</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-purple-400/10 rounded p-4 border border-purple-400/30">
                        <p className="text-sm text-purple-300 font-semibold">💡 Resultado esperado después del Plan de 90 Días:</p>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mt-2">
                          Tendrás tu hoja de ruta completa, conocerás exactamente qué trabajar cada semana, y si sigues el plan consistentemente, habrás hablado con reclutadores, pasado múltiples entrevistas, y recibido ofertas concretas. Tu situación laboral habrá transformado radicalmente.
                        </p>
                      </div>
                    </div>
                  )}
                  
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

                  {/* Leer más button */}
                  <div className="flex justify-end mt-4 mb-4">
                    <button
                      onClick={() => togglePilar(3)}
                      className="text-sm font-medium hover:opacity-80 transition flex items-center gap-1"
                      style={{ color: 'rgb(170, 70, 170)' }}
                    >
                      {expandedPilars[3] ? 'Leer menos' : '+ Leer más'}
                      <ChevronDown 
                        className="w-4 h-4 transition-transform" 
                        style={{ 
                          transform: expandedPilars[3] ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </button>
                  </div>

                  {/* Expanded details for Pilar 3 */}
                  {expandedPilars[3] && (
                    <div className="bg-[rgba(80,160,170,0.2)] rounded-lg p-6 mb-4 border border-[rgb(80,160,170)]/10 space-y-5">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Detalles del Entrenamiento Intensivo con IA</h4>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">
                          Este es el corazón de la transformación. Prácticas intensivas, realistas, con feedback multimodal de IA que simula entrevistas de verdad a nivel de dificultad empresarial (F500, startups, PMEs). Entrenas exactamente como lo harías en una situación real.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-pink-400/20">
                          <h5 className="font-semibold text-pink-300 mb-2">Los 4 Módulos de Entrenamiento</h5>
                          <div className="space-y-3">
                            <div className="pl-4 border-l border-pink-400/50">
                              <p className="font-semibold text-pink-300 mb-1">Módulo 1: Entrevistas (Situacionales + Técnicas)</p>
                              <p className="text-sm text-muted-foreground dark:text-white/80 mb-2">Dominas respuestas STAR (Situation-Task-Action-Result), behavioral questions, preguntas técnicas según tu rol, y cuestionamientos difíciles tipo "Por qué dejaste tu último trabajo?"</p>
                            </div>
                            <div className="pl-4 border-l border-pink-400/50">
                              <p className="font-semibold text-pink-300 mb-1">Módulo 2: Presentaciones (Pitch + Demos + Keynotes)</p>
                              <p className="text-sm text-muted-foreground dark:text-white/80 mb-2">Creas un pitch ejecutivo de 3 minutos, dominas cómo presentar un proyecto/producto (si aplica), y aprendes storytelling para captar atención sin perderla.</p>
                            </div>
                            <div className="pl-4 border-l border-pink-400/50">
                              <p className="font-semibold text-pink-300 mb-1">Módulo 3: Decisiones Estratégicas (Case Studies)</p>
                              <p className="text-sm text-muted-foreground dark:text-white/80 mb-2">Resuelves problemas reales: "Cómo aumentarías usuarios 10x?", "Cómo optimizarías este proceso?" Aprendes a pensar como directivo, estructurado y claro.</p>
                            </div>
                            <div className="pl-4 border-l border-pink-400/50">
                              <p className="font-semibold text-pink-300 mb-1">Módulo 4: Comunicación Ejecutiva (Negociación + Liderazgo)</p>
                              <p className="text-sm text-muted-foreground dark:text-white/80 mb-2">Negocias salario de forma asertiva, manejas conflictos, delegas, das feedback, y comunicas visión como líder. Esencial para roles sénior.</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-pink-400/20">
                          <h5 className="font-semibold text-pink-300 mb-2">Los 4 Niveles de Dificultad Progresiva</h5>
                          <div className="space-y-3">
                            <div className="pl-4 border-l border-pink-400/50">
                              <p className="font-semibold text-pink-300 mb-1">Nivel 1: Guiada</p>
                              <p className="text-sm text-muted-foreground dark:text-white/80">Coach te acompaña paso a paso. Simula entrevista, te da indicaciones en vivo, pausa para correcciones, explica qué podrías mejorar. Ideal para principiantes.</p>
                            </div>
                            <div className="pl-4 border-l border-pink-400/50">
                              <p className="font-semibold text-pink-300 mb-1">Nivel 2: Estructurada</p>
                              <p className="text-sm text-muted-foreground dark:text-white/80">Más autonomía. La entrevista corre sin pausas, pero después recibes feedback detallado. Grabada, analizada, métricas claras de qué mejorar.</p>
                            </div>
                            <div className="pl-4 border-l border-pink-400/50">
                              <p className="font-semibold text-pink-300 mb-1">Nivel 3: Desafiante</p>
                              <p className="text-sm text-muted-foreground dark:text-white/80">Presión real. Tiempo limitado, preguntas complejas lanzadas al azar, preguntas difíciles dirigidas a debilidades identificadas. Simula estrés real de entrevista.</p>
                            </div>
                            <div className="pl-4 border-l border-pink-400/50">
                              <p className="font-semibold text-pink-300 mb-1">Nivel 4: Maestría</p>
                              <p className="text-sm text-muted-foreground dark:text-white/80">Entrevista total sin límites. Candidato vs IA como si fuera empresa real. Multironda. Después: análisis video frame-by-frame de qué hiciste bien/mal.</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-pink-400/20">
                          <h5 className="font-semibold text-pink-300 mb-2">Feedback Multimodal IA en Tiempo Real</h5>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mb-3">Después de cada simulacro, recibes análisis profundo:</p>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Lenguaje Corporal:</strong> Postura, contacto visual, gestos. ¿Parecías seguro? ¿Defensivo? ¿Relajado?</li>
                            <li>• <strong>Tonalidad de Voz:</strong> Velocidad de habla, pausas, volumen, énfasis. ¿Hablaste demasiado rápido de nervios? ¿Demasiado lento?</li>
                            <li>• <strong>Contenido:</strong> ¿Respondiste la pregunta realmente? ¿Fuiste claro o vago? ¿Diste ejemplo? ¿Fue memorable?</li>
                            <li>• <strong>Métrica de Impacto:</strong> Score 1-100 de qué tan bien fue la respuesta + comparación vs otras veces que practicaste.</li>
                            <li>• <strong>Recomendaciones Específicas:</strong> "En min 3:45 hablaste muy rápido sobre tus logros. Intenta pausar después de cada logro para dejar que la info asiente. Aquí está la grabación, mira y practica."</li>
                            <li>• <strong>Plan de Mejora:</strong> "Para la próxima, trabaja en: 1) Respiración (estabas nervioso), 2) Ejemplos específicos (fueron genéricos), 3) Cierre fuerte (te desvaneció al final".</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-pink-400/20">
                          <h5 className="font-semibold text-pink-300 mb-2">Estructura de Entrenamiento Semanal</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• 2-3 simulacros de entrevista por semana (módulos rotados)</li>
                            <li>• Cada simulacro: 30-60 min de práctica + 20-30 min de feedback video analizado</li>
                            <li>• Acceso a "Question Bank": 500+ preguntas reales de entrevista por rol/industria</li>
                            <li>• Desafíos semanal: ej "Esta semana: responde 3 preguntas de case study en menos de 5 min cada una"</li>
                            <li>• Comunidad: Ve cómo otros practican, aprende de sus errores, celebra sus éxitos</li>
                            <li>• Reportes de Progreso: Cada 2 semanas, dashboard muestra evolución en cada métrica</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-pink-400/10 rounded p-4 border border-pink-400/30">
                        <p className="text-sm text-pink-300 font-semibold">💡 Resultado esperado después del Entrenamiento:</p>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mt-2">
                          Habrás practicado 20-30+ entrevistas realistas en diferentes escenarios y dificultades. Sabrás exactamente cómo responder preguntas complejas, cómo manejar presión, cómo comunicar tu valor. Cuando enfaces una entrevista real, será la entrevista #31, no la #1. Confianza 9/10, preparación 10/10.
                        </p>
                      </div>
                    </div>
                  )}
                  
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

                  {/* Leer más button */}
                  <div className="flex justify-end mt-4 mb-4">
                    <button
                      onClick={() => togglePilar(4)}
                      className="text-sm font-medium hover:opacity-80 transition flex items-center gap-1"
                      style={{ color: 'rgba(225, 120, 130)' }}
                    >
                      {expandedPilars[4] ? 'Leer menos' : '+ Leer más'}
                      <ChevronDown 
                        className="w-4 h-4 transition-transform" 
                        style={{ 
                          transform: expandedPilars[4] ? 'rotate(180deg)' : 'rotate(0deg)'
                        }} 
                      />
                    </button>
                  </div>

                  {/* Expanded details for Pilar 4 */}
                  {expandedPilars[4] && (
                    <div className="bg-[rgba(80,160,170,0.2)] rounded-lg p-6 mb-4 border border-[rgb(80,160,170)]/10 space-y-5">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Detalles de Ejecución Continua en el Mercado Real</h4>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">
                          Después del día 90, entra en vigor la fase real. Ya no es simulación. Ya no es coaching general. Es: tú vs mercado laboral real, con soporte total. Desde el primer "hola" con un reclutador hasta la firma de tu contrato.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">1. Bolsa de Oportunidades + Matching Automático</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Job Board Exclusivo:</strong> 200+ empleos pre-vetted en tu sector y rol target. Cada semana se agregan más oportunidades.</li>
                            <li>• <strong>Algoritmo de Matching:</strong> Sistema que te notifica SOLO de oportunidades donde tienes 70%+ match (no te abrumamos con 1000 opciones inútiles).</li>
                            <li>• <strong>Reclutadores Activos:</strong> Red de 50+ reclutadores senior que conocen el programa y buzan activamente por candidatos graduados. Te presentan directamente sin que apliques.</li>
                            <li>• <strong>Referral Network:</strong> Acceso a programa de referrals: si conoces a alguien en empresa target, conectamos para recomendación formal (aumenta 3x chance de entrevista).</li>
                            <li>• <strong>Feedback de Oportunidades:</strong> No es "aquí hay trabajo". Es: "Este rol es ideal para ti porque X. Acá está el hiring manager en LinkedIn. Aquí está análisis de qué buscan. Aquí va tu estrategia de approach".</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">2. Dashboard de Empleabilidad en Tiempo Real</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Score de Empleabilidad:</strong> Métrica 1-100 que actualiza cada semana. Basada en: cantidad de conversaciones, quality de networking, feedback positivo en entrevistas, velocidad de progreso.</li>
                            <li>• <strong>Comparativa de Mercado:</strong> "Tu score es 72. Promedio para tu rol/sector: 55. Top 10% llega a 85+". Te posiciona en contexto real.</li>
                            <li>• <strong>Análisis de Progreso:</strong> Gráficas semana a semana. Ves dónde estás ganando tracción, dónde estancado. Ejemplo: "Conversaciones subieron 40%, pero tasa de aceptar entrevista bajó. Ajustemos approach".</li>
                            <li>• <strong>Oportunidades en Pipeline:</strong> Visualización clara: "Conversaciones iniciales (5) → Entrevistas Stage 1 (3) → Entrevistas Stage 2 (1) → Oferta (0)". Dónde están cayendo candidatos.</li>
                            <li>• <strong>Predictor de Colocación:</strong> IA analiza tu trajectory: "Si mantienes este ritmo, oferta en 3-4 semanas".</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">3. Coaching Específico por Empresa/Entrevista</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Pre-Entrevista (24-48 horas antes):</strong> Coach analiza la empresa, rol, hiring manager, tendencias de preguntas, y diseña tu estrategia específica. "En Google suelen preguntar X. En Stripe suelen profundizar en Y. Acá está qué responder".</li>
                            <li>• <strong>Simulacro Específico:</strong> Practicas una entrevista simulada exacta al tipo que vas a tener. Feedback personalizado: "Te van a preguntar sobre tu gestión de conflictos. Acá está cómo estructurar respuesta para Stripe específicamente".</li>
                            <li>• <strong>Post-Entrevista (dentro de 4 horas):</strong> Si fue bien: "Excelente, acá 3 cosas que brillaron. Ahora a esperar". Si tuvo áreas de mejora: "Mira min 12:34. Cuando preguntaron sobre X, respondiste Y pero podrías haber dicho Z".</li>
                            <li>• <strong>Negociación de Oferta:</strong> Cuando tienes oferta, coach trabaja contigo en: ¿es competitiva? ¿qué pedir? ¿cómo pedir? Mejora promedio: +15% salario, +2 días vacaciones, flexibilidad adicional.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">4. Comunidad + Mentores + Soporte Grupal</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Comunidad Privada:</strong> Grupo de Slack/Discord con 500+ personas: candidatos en búsqueda, graduados que ya tienen roles, mentores voluntarios. Espacio de aprendizaje colectivo.</li>
                            <li>• <strong>Office Hours Semanales:</strong> Sesiones en vivo donde coaches resuelven dudas en tiempo real. "¿Cómo negocie mi salario?" "¿Qué hago si rechazo el feedback de una entrevista?"</li>
                            <li>• <strong>Red de Mentores:</strong> Acceso a 100+ profesionales senior en tu industria (ex-Googlers, CTOs, VPs de diferentes empresas) que ofrecen 1-1 mentoría para preguntas específicas.</li>
                            <li>• <strong>Webinars Temáticos:</strong> "Cómo negociar en tech", "Habilidades blandas que empresas buscan", "Cómo responder preguntas complicadas", etc. Speakers invitados: hiring managers de empresas top.</li>
                            <li>• <strong>Accountability Partners:</strong> Emparejamiento con otro candidato similar para que se motiven mutuamente, compartan progress, y se den feedback.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">5. Duración + Promesa de Soporte Continuo</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Indefinido Hasta Colocación:</strong> No importa si tarda 120 días o 180 días. Seguimos apoyándote. Este no es un "90 días y listo". Es "hasta que estés empleado en rol que mereces".</li>
                            <li>• <strong>Garantía Implícita:</strong> Si hiciste todo el programa correctamente (asistencia, practicaste, aplicaste lecciones) y aún así no tienes oferta en 120 días, rediseñamos estrategia completamente gratis.</li>
                            <li>• <strong>Post-Colocación:</strong> Incluso después de aceptar oferta: soporte para 30 días más para asegurar que transición es suave, que negocias onboarding bien, y que tienes éxito en primer mes.</li>
                          </ul>
                        </div>

                        <div className="bg-[rgba(80,160,170,0.2)] rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">Ejemplos Reales de Soporte en Ejecución</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Lunes:</strong> Graduado recibe recomendación de reclutador para rol en Stripe. Coach envía análisis: "Ideal para ti. Aquí hiring manager. Aquí 5 preguntas que típicamente hacen. Aquí tu approach".</li>
                            <li>• <strong>Martes:</strong> Entrevista Stage 1 (30 min). Dos horas después, coach envía video feedback: "Excelente connection, pero en min 8 cuando explicaste proyecto X fuiste vago. Aca está como hacerlo mejor".</li>
                            <li>• <strong>Jueves:</strong> Llamada con coach: "Pasaste Stage 1. Stage 2 es con VP. Estos suelen ir profundo en liderazgo. Practicamos aquí 3 scenarios típicos".</li>
                            <li>• <strong>Siguiente semana:</strong> Entrevista Stage 2 sale bien. Coach: "Perfecto. Ahora a esperar. Pero mientras, acá 2 oportunidades más que también te match bien. Quiero que sigas en conversaciones, no esperes sentado".</li>
                            <li>• <strong>Semana 3:</strong> Llega oferta de Stripe. Salary $150k. Coach: "Es buena pero puedes pedir más. Aquí benchmark para tu rol en SF. Aquí cómo pedir 165k sin parecer desagradecido. Script exacto".</li>
                            <li>• <strong>Semana 4:</strong> Aceptas oferta de $160k. Coach: "Félicidades. Ahora, vamos a asegurar que en primer mes te va bien. Aquí qué esperar, cómo prepararte, qué preguntar en onboarding".</li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-rose-400/10 rounded p-4 border border-rose-400/30">
                        <p className="text-sm text-rose-300 font-semibold">💡 Resultado esperado después de Ejecución:</p>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mt-2">
                          Estás empleado en rol que realmente querías, con compensación que negociaste estratégicamente, en empresa donde vas a crecer. No fue accidente. Fue resultado directo de 90 días + ejecución sistemática + soporte a cada paso. Tu vida cambió.
                        </p>
                      </div>
                    </div>
                  )}
                  
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
    </div>
  )
}
