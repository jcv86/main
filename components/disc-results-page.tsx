'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface ResultsProps {
  results: {
    D: number
    I: number
    S: number
    C: number
    dominantProfile: "D" | "I" | "S" | "C"
    secondaryProfile: "D" | "I" | "S" | "C"
    total: number
  }
  caminoPersona?: boolean
  caminoProfesional?: boolean
  c1Context?: Record<number, string>
  onContinue?: () => void
}

export function DiscResultsPage({ results, c1Context, onContinue }: ResultsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const profile = results.dominantProfile

  const profileData: Record<string, any> = {
    D: {
      name: 'Impulsor - Orientado a Resultados',
      emoji: '⚡',
      color: 'from-red-600500',
      tagColor: 'bg-red',
      description: 'Eres directo, decidido y enfocado en lograr objetivos. Te mueves rápido, tomas decisiones firmes y no te detienes ante obstáculos.',
      whatItMeans: 'Te caracterizas por tu impulso para actuar y hacer cosas. Eres alguien que toma el control de situaciones y avanza sin dudar.',
    },
    I: {
      name: 'Catalizador - Influyente',
      emoji: '✨',
      color: 'from-yellow-500400',
      tagColor: 'bg-orange',
      description: 'Eres entusiasta, comunicativo y motivador. Te encanta conectar con las personas y contagiar tu energía positiva.',
      whatItMeans: 'Te destacas por tu capacidad de influir y motivar a otros. Eres alguien que genera entusiasmo y hace que las personas se sientan involucradas.',
    },
    S: {
      name: 'Estabilizador - Constante',
      emoji: '🛡️',
      color: 'from-green-600500',
      tagColor: 'bg-green',
      description: 'Eres leal, paciente y confiable. Te gusta la estabilidad y trabajar en equipo de manera consistente.',
      whatItMeans: 'Te caracterizas por tu confiabilidad y tu capacidad de mantener la calma. Eres alguien que otros pueden seguir contando con que estará ahí.',
    },
    C: {
      name: 'Arquitecto - Analítico',
      emoji: '🧠',
      color: 'from-blue-600/50',
      tagColor: 'bg-blue',
      description: 'Eres detallista, metódico y buscas precisión. Te importa que todo esté bien hecho y entiendes la importancia de los detalles.',
      whatItMeans: 'Te destacas por tu pensamiento estructurado y tu atención a los detalles. Eres alguien que se asegura de que las cosas se hagan correctamente.',
    },
  }

  const pData = profileData[profile]

  const sections = [
    {
      id: 'strengths',
      icon: '💪',
      title: 'Tus Fortalezas',
      content: {
        D: ['Tomas decisiones rápidas y firmes', 'Estableces objetivos claros y ambiciosos', 'Conduces equipos con visión y dirección', 'Actúas con determinación bajo presión', 'Impulsa el progreso sin estancamientos'],
        I: ['Inspiras y motivas a otros', 'Comunicas con energía y claridad', 'Generas conexiones rápidas', 'Adaptas tu mensaje según la audiencia', 'Enciendes entusiasmo en proyectos nuevos'],
        S: ['Construyes relaciones duraderas', 'Mantienes la calma bajo estrés', 'Ofreces apoyo consistente', 'Creas ambientes de confianza', 'Eres el ancla que estabiliza el equipo'],
        C: ['Analizas problemas profundamente', 'Planificas con precisión', 'Garantizas calidad en tu trabajo', 'Identificas riesgos antes que otros', 'Aseguras que detalles críticos no se pierdan'],
      },
    },
    {
      id: 'collaboration',
      icon: '👥',
      title: 'Cómo Colaboras en Equipo',
      content: {
        D: 'Estableces objetivos directos y claros. Tomas iniciativa, asumes responsabilidad y buscas resultados ágiles. Prefieres libertad para ejecutar, pero mantiene el foco en lo que importa.',
        I: 'Energizas al equipo con entusiasmo. Comunicas de forma clara, adaptas flexible los cambios y conectas personas con ideas. Eres el motor que mantiene la participación activa.',
        S: 'Proporcionas estabilidad y confianza. Trabajas en armonía grupal, apoyas sin esperar reconocimiento y te comprometes completamente con objetivos colectivos.',
        C: 'Aseguras estándares altos. Aportas análisis detallados, prevés problemas y sigues procesos establecidos. Tu rigor evita que detalles críticos se escape.',
      },
    },
    {
      id: 'motivation',
      icon: '🔥',
      title: 'Qué Te Motiva',
      content: {
        D: ['Objetivos desafiantes y visibles', 'Autoridad para tomar decisiones', 'Reconocimiento de resultados concretos', 'Ambientes competitivos y dinámicos', 'Ver progreso rápido y tangible'],
        I: ['Reconocimiento social y personal', 'Interacciones significativas y auténticas', 'Proyectos que permitan tu expresión', 'Ambientes positivos y colaborativos', 'Celebrar logros con el equipo'],
        S: ['Estabilidad y seguridad laboral', 'Relaciones profundas y duraderas', 'Contribución al bienestar del equipo', 'Claridad sobre tu rol y aporte', 'Ser parte de algo mayor que ti'],
        C: ['Excelencia y precisión en todo', 'Problemas complejos por resolver', 'Datos y información confiable', 'Sistemas bien organizados y claros', 'Mejora continua y optimización'],
      },
    },
    {
      id: 'leadership',
      icon: '👔',
      title: 'Tu Estilo de Liderazgo',
      content: {
        D: 'Lideras por resultados. Das dirección clara, estableces estándares altos y esperas que el equipo actúe con rapidez. No temes la confrontación si es necesaria para avanzar.',
        I: 'Lideras por inspiración. Motivas con entusiasmo genuino, creas ambiente positivo y haces que otros quieran seguirte. Tu carisma es tu herramienta principal.',
        S: 'Lideras por ejemplo. Generas confianza siendo consistente, apoyas sin condiciones y creas ambientes seguros donde todos pueden crecer y expresarse.',
        C: 'Lideras por excelencia. Estableces estándares claros, aseguras calidad en cada paso y lideras desde el rigor y la precisión en los detalles importantes.',
      },
    },
    {
      id: 'growth',
      icon: '🌱',
      title: 'Áreas para Crecer',
      content: {
        D: ['Escuchar más activamente las perspectivas diferentes', 'Desarrollar paciencia con ritmos más lentos', 'Considerar procesos, no solo resultados rápidos', 'Fortalecer conexiones emocionales con el equipo', 'Valorar el viaje, no solo la meta'],
        I: ['Profundizar en análisis antes de actuar', 'Mantener el enfoque en objetivos a largo plazo', 'Escuchar sin interrumpir o adelantarte', 'Seguimiento consistente después de lanzamientos', 'Desarrollar rigor en la ejecución'],
        S: ['Tomar más iniciativa en decisiones críticas', 'Expresar tu opinión con mayor firmeza', 'No asumir toda la carga del equipo', 'Adaptarte más rápido a cambios necesarios', 'Valorar más tu propia contribución'],
        C: ['Actuar sin información perfecta (80% es suficiente)', 'Ser más flexible con procesos adaptables', 'Comunicar hallazgos de forma ágil', 'Confiar más en la intuición del equipo', 'Permitir que otros aprendan con errores'],
      },
    },
    {
      id: 'ideal-role',
      icon: '🎯',
      title: 'Dónde Brillas',
      content: {
        D: ['Liderando proyectos ambiciosos', 'En entornos de ritmo rápido y dinámico', 'Tomando decisiones bajo presión', 'En roles con autoridad y responsabilidad directa', 'Donde hay oportunidad de transformación'],
        I: ['Generando conexiones y alianzas estratégicas', 'En roles de comunicación y presentación', 'Motivando y desarrollando otros', 'En entornos colaborativos y energéticos', 'Iniciando proyectos nuevos'], 
        S: ['Construyendo equipos sólidos y seguros', 'En funciones de apoyo y desarrollo de personas', 'En entornos estable y predecible', 'Mentoreando y acompañando a otros', 'Donde importa la continuidad y lealtad'],
        C: ['Solucionando problemas complejos', 'En roles que requieren precisión extrema', 'En entornos estructurado y metódico', 'Análisis y planificación detallada', 'Donde la calidad es crítica para el éxito'],
      },
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Hero */}
        <div className={`bg-background
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-6xl md:text-7xl">{pData.emoji}</span>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{pData.name}</h1>
                <p className="text-white/80 text-lg mt-2">{pData.whatItMeans}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Summary */}
        <Card className="bg-muted/80/50 border-muted/70">
          <CardContent className="pt-6">
            <p className="text-muted/10 text-center text-lg leading-relaxed">
              {pData.description}
            </p>
          </CardContent>
        </Card>

        {/* Scores Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['D', 'I', 'S', 'C'] as const).map((key) => {
            const names: Record<string, string> = { D: 'Impulsor', I: 'Catalizador', S: 'Estabilizador', C: 'Arquitecto' }
            const colors: Record<string, string> = { D: 'bg-red', I: 'bg-orange', S: 'bg-green', C: 'bg-blue' }
            const isActive = profile === key

            return (
              <Card
                key={key}
                className={`${
                  isActive
                    ? `${colors[key]} text-white border-2 border-white`
                    : 'bg-transparent border-muted/70 text-muted/30'
                } transition-all`}
              >
                <CardContent className="p-4 text-center">
                  <div className={`text-4xl font-bold mb-1 ${isActive ? 'text-white' : 'text-muted/10'}`}>
                    {Math.round(results[key])}
                  </div>
                  <div className="text-sm font-semibold">{names[key]}</div>
                  {isActive && <div className="text-xs mt-1 opacity-90">Tu perfil</div>}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Context Display */}
        {c1Context && (Object.keys(c1Context).length > 0) && (
          <Card className="bg-muted/80/50 border-muted/70">
            <CardHeader>
              <CardTitle className="text-white text-lg">Tu Contexto Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {c1Context[3] && (
                <div className="bg-muted/70/50 p-4 rounded-[28px] border-l-4 border-blue/50">
                  <p className="text-xs text-muted/40 font-semibold mb-1">Tu Desafío Actual</p>
                  <p className="text-white">{c1Context[3]}</p>
                </div>
              )}
              {c1Context[4] && (
                <div className="bg-muted/70/50 p-4 rounded-[28px] border-l-4 border-emerald-500">
                  <p className="text-xs text-muted/40 font-semibold mb-1">Tu Objetivo para 90 Días</p>
                  <p className="text-white">{c1Context[4]}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Detailed Sections */}
        <div className="space-y-3">
          {sections.map((section) => (
            <Card
              key={section.id}
              className="bg-muted/80/50 border-muted/70 cursor-pointer hover:border-muted/60 transition-colors"
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <CardTitle className="text-white text-lg">{section.title}</CardTitle>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted/40 transition-transform ${
                      expandedSection === section.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CardHeader>

              {expandedSection === section.id && (
                <CardContent className="pt-0 pb-4">
                  {Array.isArray(section.content[profile]) ? (
                    <ul className="space-y-2">
                      {(section.content[profile] as string[]).map((item: string, idx: number) => (
                        <li key={idx} className="flex gap-3 text-muted/20">
                          <span className="text-emerald-500 font-bold flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted/20 leading-relaxed">{String(section.content[profile])}</p>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        {onContinue && (
          <Card className="bg-background">
            <CardContent className="pt-8 pb-8 space-y-4 text-center">
              <h3 className="text-xl font-semibold text-white">
                Ahora vamos a crear tu ruta personalizada
              </h3>
              <p className="text-muted/20 text-sm">
                Conocemos tu perfil DISC y contexto personal. Responde 9 preguntas más sobre tu ejecución para generar tu plan de 30/60/90 días con acciones específicas diseñadas para ti.
              </p>
              <Button
                onClick={onContinue}
                className="w-full h-12 text-base font-semibold bg-background"
              >
                Generar mi Ruta Personalizada →
              </Button>
              <p className="text-xs text-muted/40">Tiempo estimado: 3 minutos</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
