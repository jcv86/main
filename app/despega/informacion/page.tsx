'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, Play } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function InformacionPage() {
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
        
        if (!user) {
          router.push('/auth/signin')
          return
        }
        
        setUserName(user.email?.split('@')[0] || 'Usuario')
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
        {/* Coach Video Welcome */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold mb-2">Bienvenido, {userName}</h1>
          <p className="text-lg text-muted-foreground mb-8">Tu entrenador personal te habla sobre el programa</p>
          
          <div className="space-y-6">
            {/* Video Player */}
            <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg" style={{ aspectRatio: '16/9' }}>
              {/* Video Placeholder - Será reemplazado con video real */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4">
                    <Play className="w-8 h-8 text-white fill-white" />
                  </div>
                  <p className="text-white/60 text-sm">Video de bienvenida del coach</p>
                  <p className="text-white/40 text-xs mt-1">Próximamente disponible</p>
                </div>
              </div>
              {/* Video Element - Reemplazar src cuando tengas el video */}
              {/* <video width="100%" height="100%" controls>
                <source src="/videos/coach-welcome.mp4" type="video/mp4" />
                Tu navegador no soporta videos HTML5
              </video> */}
            </div>

            {/* Coach Message - Visible for Accessibility */}
            <div className="p-6 bg-gradient-to-r from-teal-500/10 to-purple-500/10 rounded-lg border border-white/20" role="region" aria-label="Transcripción del video del coach">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-teal-400 rounded-full"></span>
                Mensaje del Coach
              </h3>
              <p className="text-white/90 leading-relaxed whitespace-pre-line text-base">
                Hola, bienvenido a Despega Tu Carrera. Soy tu coach y estaré contigo en cada paso.

Los próximos 90 días transformamos tu empleabilidad. Diagnóstico, plan, entrenamiento intensivo, ejecución real.

Lo importante: no desaparece en el día 90. Sigo aquí.

Lee bien lo que viene y comenzamos.
              </p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-sm text-white/80 leading-relaxed">
              En este video, tu entrenador te presenta el programa completo, explica cómo funcionan los 4 pilares, 
              y te motiva a comenzar tu transformación profesional. Lee la información detallada abajo para entender exactamente 
              qué esperar en cada fase y cómo máximizar tu progreso.
            </p>
          </div>
        </div>

        {/* All Pilars Information - Expandable */}
        <div className="space-y-6">
          {/* Pilar 1 */}
          <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}>
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6 mb-6">
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
                    <div className="bg-white/5 rounded-lg p-6 mb-4 border border-white/10 space-y-5">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Detalles Completos del Diagnóstico Integral</h4>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">
                          Este pilar es la piedra angular de tu transformación. Nos sumergimos profundamente en tu perfil profesional actual, identificando patrones de comunicación, limitaciones mentales, y oportunidades de diferenciación que muchos candidatos nunca reconocen por su cuenta.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/5 rounded p-4 border border-teal-400/20">
                          <h5 className="font-semibold text-teal-300 mb-2">1. Evaluación Comunicativa Profunda</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Análisis de Fortalezas:</strong> Identificamos tus puntos fuertes en presentación, capacidad de síntesis, claridad conceptual y carisma natural.</li>
                            <li>• <strong>Mapa de Debilidades:</strong> Detectamos patrones limitantes como miedo escénico, falta de estructura narrativa, tonalidad monótona, o ansiedad ante preguntas difíciles.</li>
                            <li>• <strong>Diferencial Competitivo:</strong> Definimos qué te hace diferente de otros candidatos en tu sector (ejemplo: experiencia única, perspectiva multicultural, solución de problemas compleja).</li>
                            <li>• <strong>Gaps vs Mercado:</strong> Comparamos tu perfil actual con lo que empresas top buscan en tu rol, identificando brecha exacta.</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-teal-400/20">
                          <h5 className="font-semibold text-teal-300 mb-2">2. Análisis Contextual Laboral Exhaustivo</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Trayectoria Actual:</strong> Mapeamos tu carrera: decisiones clave, inflection points, y por qué tomaste cada paso.</li>
                            <li>• <strong>Objetivos Reales:</strong> Vamos más allá de lo obvio (ingresos, título) para entender motivación profunda: impacto, aprendizaje, balance, legado.</li>
                            <li>• <strong>Sector + Rol Target:</strong> Definimos industrias, empresas específicas, y posiciones donde eres más fuerte (SaaS, FinTech, Scale-up, Fortune 500).</li>
                            <li>• <strong>Restricciones y Realidades:</strong> Comprendemos limitantes reales: ubicación geográfica, visa, nivel de experiencia, compensación esperada, negocios no negociables.</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-teal-400/20">
                          <h5 className="font-semibold text-teal-300 mb-2">3. Baseline de Desempeño Personalizado</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Puntuación Inicial:</strong> Creamos un score de "empleabilidad" que mide: confianza (1-10), claridad de pitch (1-10), preparación técnica (1-10), networking (1-10).</li>
                            <li>• <strong>Métricas de Progreso:</strong> Estableces hitos medibles: "pasar de ansiedad 8/10 a confianza 7/10", "mejorar respuesta a preguntas difíciles de 30% aciertos a 80%".</li>
                            <li>• <strong>Tracking Visual:</strong> Dashboard personalizado que muestra evolución semana a semana, permitiendo celebrar progreso real.</li>
                            <li>• <strong>Puntos de Referencia:</strong> Comparación con candidatos que pasaron antes por tu misma situación y cómo progresaron.</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-teal-400/20">
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pilar 2 */}
          <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)' }}>
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] flex-shrink-0" style={{ backgroundColor: 'rgba(90, 90, 150, 0.4)' }}>
                  <span className="text-3xl font-bold" style={{ color: 'rgba(90, 90, 150)' }}>2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">Exploración: Ruta de 90 Días</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Plan estratégico personalizado de 90 días en 3 fases estructuradas para tu transformación profesional.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(90, 90, 150)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 1 (Días 1-30):</strong> Fundamentación - Aprender principios, desarrollar storytelling, definir valor</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(90, 90, 150)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 2 (Días 31-60):</strong> Exploración - Descubrir oportunidades, construir red, optimizar presencia digital</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(90, 90, 150)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Fase 3 (Días 61-90):</strong> Implementación - Aplicar en entrevistas reales, negociar ofertas</p>
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
                    <div className="bg-white/5 rounded-lg p-6 mb-4 border border-white/10 space-y-5">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Detalles del Plan Estratégico de 90 Días</h4>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">
                          Este es tu roadmap ejecutivo personalizado. Basado en tu diagnóstico y objetivos, diseñamos 3 fases que te llevan desde donde estás ahora hasta la colocación. Cada fase tiene hitos específicos, acciones concretas, y resultados medibles.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/5 rounded p-4 border border-purple-400/20">
                          <h5 className="font-semibold text-purple-300 mb-2">FASE 1: Fundamentación (Días 1-30)</h5>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mb-3 font-medium text-purple-300">Objetivo: Construir tus cimientos comunicativos</p>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Semana 1-2: Storytelling Personal</strong> - Desarrollas tu narrativa profesional: quién eres, de dónde vienes, por qué hiciste X cambio, dónde vas. No es un CV aburrido, es una historia conectante.</li>
                            <li>• <strong>Semana 2-3: Propuesta de Valor</strong> - Definimos exactamente qué problema resuelves, para quién, por qué mejor que otros. Tu "elevator pitch" perfecto.</li>
                            <li>• <strong>Semana 3-4: Mentalidad Ganadora</strong> - Trabajamos creencias limitantes, ansiedades, y patrones de autosabotaje. Construimos la mentalidad de alguien que ES empleable.</li>
                            <li>• <strong>Semana 4: Mock Interview Inicial</strong> - Tu primer simulacro de entrevista para ver baseline real de performance.</li>
                            <li className="pt-2 border-t border-white/10 mt-3 pt-3"><strong>KPI Fase 1:</strong> Tener narrativa clara, pitch de 2-3 minutos impactante, confianza mejorada 30%.</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-purple-400/20">
                          <h5 className="font-semibold text-purple-300 mb-2">FASE 2: Exploración (Días 31-60)</h5>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mb-3 font-medium text-purple-300">Objetivo: Posicionarte en el mercado + descubrir oportunidades</p>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Semana 5-6: Mapeo de Mercado</strong> - Identificamos empresas target (10-15), escenarios en cada una, y estrategia de approach por cada una.</li>
                            <li>• <strong>Semana 6-7: LinkedIn Mastery</strong> - Optimizamos tu perfil para que reclutadores te encuentren. Cambio de foto, headline poderoso, descripción estratégica, endorsements correctos.</li>
                            <li>• <strong>Semana 7-8: Networking Activo</strong> - Construyes conexiones reales: informational interviews, conexiones en LinkedIn, referrals. No es contactar 1000 personas; es relaciones genuinas con 20-30.</li>
                            <li>• <strong>Semana 8: Aplicaciones Estratégicas</strong> - Comienzas a aplicar y conectar con reclutadores para conseguir tus primeras entrevistas reales.</li>
                            <li className="pt-2 border-t border-white/10 mt-3 pt-3"><strong>KPI Fase 2:</strong> Tener 5-10 conversaciones iniciales, 2-3 entrevistas reales programadas, perfil LinkedIn optimizado.</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-purple-400/20">
                          <h5 className="font-semibold text-purple-300 mb-2">FASE 3: Implementación (Días 61-90)</h5>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mb-3 font-medium text-purple-300">Objetivo: Convertir entrevistas en ofertas</p>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Semana 9-10: Entrevistas Reales</strong> - Aplicas todo lo aprendido en entrevistas de verdad. Coaching específico pre/post entrevista para cada una.</li>
                            <li>• <strong>Semana 10-11: Perfeccionamiento</strong> - Iteramos basado en feedback real. Si pasaste a Round 2, preparamos específicamente para eso.</li>
                            <li>• <strong>Semana 11-12: Negociación + Cierre</strong> - Recibes ofertas y necesitas cerrar la mejor. Coaching en negociación salarial, benefits, rol exacto.</li>
                            <li>• <strong>Semana 13 en adelante: Continuidad</strong> - Sigues en la búsqueda si es necesario, con soporte hasta colocación confirmada.</li>
                            <li className="pt-2 border-t border-white/10 mt-3 pt-3"><strong>KPI Fase 3:</strong> Mínimo 5 ofertas, negociación exitosa, aceptación de rol target.</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-purple-400/20">
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pilar 3 */}
          <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(170, 70, 170, 0.2)' }}>
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] flex-shrink-0" style={{ backgroundColor: 'rgba(170, 70, 170, 0.4)' }}>
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
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>4 Niveles:</strong> Guiada → Estructurada → Desafiante → Maestría</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgb(170, 70, 170)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Feedback IA:</strong> Análisis de postura, tonalidad, contenido, impacto y recomendaciones en tiempo real</p>
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

                  {/* Expanded details for Pilar 3 - Truncated for space, same structure as Pilar 1 and 2 */}
                  {expandedPilars[3] && (
                    <div className="bg-white/5 rounded-lg p-6 mb-4 border border-white/10 space-y-5">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Detalles del Entrenamiento Intensivo con IA</h4>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">
                          Este es el corazón de la transformación. Prácticas intensivas, realistas, con feedback multimodal de IA que simula entrevistas de verdad a nivel de dificultad empresarial (F500, startups, PMEs). Entrenas exactamente como lo harías en una situación real.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/5 rounded p-4 border border-pink-400/20">
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

                        <div className="bg-white/5 rounded p-4 border border-pink-400/20">
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
                      </div>

                      <div className="bg-pink-400/10 rounded p-4 border border-pink-400/30">
                        <p className="text-sm text-pink-300 font-semibold">💡 Resultado esperado después del Entrenamiento:</p>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mt-2">
                          Habrás practicado 20-30+ entrevistas realistas en diferentes escenarios y dificultades. Sabrás exactamente cómo responder preguntas complejas, cómo manejar presión, cómo comunicar tu valor. Cuando enfaces una entrevista real, será la entrevista #31, no la #1. Confianza 9/10, preparación 10/10.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pilar 4 */}
          <Card className="border-0 shadow-md rounded-[2px]" style={{ backgroundColor: 'rgba(225, 120, 130, 0.2)' }}>
            <CardContent className="pt-8 pb-8 px-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-[28px] flex-shrink-0" style={{ backgroundColor: 'rgba(225, 120, 130, 0.4)' }}>
                  <span className="text-3xl font-bold" style={{ color: 'rgba(225, 120, 130)' }}>4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-muted/90 dark:text-white mb-2">La Realidad: Ejecución Continua</h3>
                  <p className="text-base text-muted-foreground dark:text-muted-foreground mb-4">
                    Aplicación en el mercado laboral real. De la búsqueda laboral a tu colocación con soporte continuo y oportunidades filtradas.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(225, 120, 130)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Bolsa de Oportunidades:</strong> Empleos filtrados por tu perfil, conexión con reclutadores, referrals personalizados</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(225, 120, 130)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Dashboard de Empleabilidad:</strong> Métrica visual, comparativa con benchmark, evolución en tiempo real</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(225, 120, 130)' }}></div>
                      <p className="text-sm text-muted-foreground dark:text-white/80"><strong>Soporte Continuo:</strong> Coaches, mentores, comunidad y sesiones específicas por empresa</p>
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

                  {/* Expanded details for Pilar 4 - Truncated for space, same structure */}
                  {expandedPilars[4] && (
                    <div className="bg-white/5 rounded-lg p-6 mb-4 border border-white/10 space-y-5">
                      <div>
                        <h4 className="font-semibold text-white mb-4 text-lg">Detalles de Ejecución Continua en el Mercado Real</h4>
                        <p className="text-sm text-muted-foreground dark:text-white/80 mb-4 leading-relaxed">
                          Después del día 90, entra en vigor la fase real. Ya no es simulación. Ya no es coaching general. Es: tú vs mercado laboral real, con soporte total. Desde el primer "hola" con un reclutador hasta la firma de tu contrato.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-white/5 rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">1. Bolsa de Oportunidades + Matching Automático</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Job Board Exclusivo:</strong> 200+ empleos pre-vetted en tu sector y rol target. Cada semana se agregan más oportunidades.</li>
                            <li>• <strong>Algoritmo de Matching:</strong> Sistema que te notifica SOLO de oportunidades donde tienes 70%+ match (no te abrumamos con 1000 opciones inútiles).</li>
                            <li>• <strong>Reclutadores Activos:</strong> Red de 50+ reclutadores senior que conocen el programa y buzan activamente por candidatos graduados.</li>
                            <li>• <strong>Referral Network:</strong> Acceso a programa de referrals: si conoces a alguien en empresa target, conectamos para recomendación formal.</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">2. Dashboard de Empleabilidad en Tiempo Real</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Score de Empleabilidad:</strong> Métrica 1-100 que actualiza cada semana basada en conversaciones, networking, y feedback positivo.</li>
                            <li>• <strong>Pipeline Visual:</strong> Conversaciones → Stage 1 → Stage 2 → Oferta. Ve exactamente dónde estás.</li>
                            <li>• <strong>Predictor de Colocación:</strong> IA analiza tu trajectory: "Si mantienes este ritmo, oferta en 3-4 semanas".</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">3. Coaching Específico por Empresa/Entrevista</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Pre-Entrevista:</strong> Coach analiza empresa, rol, hiring manager, tendencias de preguntas y diseña tu estrategia específica.</li>
                            <li>• <strong>Post-Entrevista:</strong> Feedback en video: qué brilló, qué mejorar, acciones concretas para siguiente ronda.</li>
                            <li>• <strong>Negociación de Oferta:</strong> Coaching en negociación salarial y benefits. Mejora promedio: +15% salario.</li>
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded p-4 border border-rose-400/20">
                          <h5 className="font-semibold text-rose-300 mb-2">4. Comunidad + Mentores + Soporte Grupal</h5>
                          <ul className="space-y-2 text-sm text-muted-foreground dark:text-white/80">
                            <li>• <strong>Comunidad Privada:</strong> 500+ personas: candidatos en búsqueda, graduados, mentores. Aprendizaje colectivo.</li>
                            <li>• <strong>Office Hours Semanales:</strong> Sesiones en vivo donde coaches resuelven dudas.</li>
                            <li>• <strong>Red de Mentores:</strong> 100+ profesionales senior disponibles para mentoría 1-1.</li>
                          </ul>
                        </div>

                        <div className="bg-rose-400/10 rounded p-4 border border-rose-400/30">
                          <p className="text-sm text-rose-300 font-semibold">💡 Resultado esperado después de Ejecución:</p>
                          <p className="text-sm text-muted-foreground dark:text-white/80 mt-2">
                            Estás empleado en rol que realmente querías, con compensación que negociaste estratégicamente, en empresa donde vas a crecer. No fue accidente. Fue resultado directo de 90 días + ejecución sistemática + soporte a cada paso. Tu vida cambió.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="mt-16 flex justify-center">
          <Link href="/despega/conozcamonos-1">
            <Button size="lg" className="bg-gradient-to-r from-teal-500 to-purple-500 hover:opacity-90">
              Comenzar Mi Transformación
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
