"use client"

import Link from "next/link"
import { ArrowRight, Lock, CheckCircle2, Brain, BookOpen, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ComoFuncionaPage() {
  const pillars = [
    {
      title: "Conozcámonos",
      subtitle: "C1 - Career Foundation",
      duration: "Día 1",
      description: "Define tu situación actual y tus metas profesionales. Responderás preguntas clave sobre tu carrera, motivaciones y expectativas.",
      icon: Brain,
      objectives: ["Clarificar metas profesionales", "Identificar motivaciones", "Establecer baseline inicial"],
      output: "Perfil de carrera personalizado",
      requiresAuth: false,
    },
    {
      title: "Rutas",
      subtitle: "A1 - Identity Audit",
      duration: "Días 2-7",
      description: "Descubre tu identidad profesional a través de 6 evaluaciones psicométricas validadas científicamente.",
      icon: BookOpen,
      objectives: ["Autoconocimiento profundo", "Identificar fortalezas y debilidades", "Entender tu DISC, MBTI y más"],
      output: "6 reportes de personalidad personalizados",
      requiresAuth: true,
      tests: ["DISC Profile", "MBTI Type", "Big Five", "RIASEC", "EQ Index", "Soft Skills"],
    },
    {
      title: "Entrenamiento",
      subtitle: "C2 + A2-A4 - Training Modules",
      duration: "Días 8-60",
      description: "Programas de entrenamiento adaptativos basados en tu perfil. Incluye simulaciones de entrevistas y construcción de documentos estratégicos.",
      icon: Zap,
      objectives: ["Desarrollar habilidades críticas", "Preparar para entrevistas", "Crear documentos profesionales"],
      output: "Certificados completados, CV optimizado, STAR stories",
      requiresAuth: true,
    },
    {
      title: "Realidad",
      subtitle: "Market Integration",
      duration: "Día 61+",
      description: "Aplica todo lo aprendido en búsqueda activa. Acceso a recursos del mercado y networking.",
      icon: CheckCircle2,
      objectives: ["Job searching guidance", "Network building", "Continuous learning"],
      output: "Recursos de búsqueda, conectar con oportunidades",
      requiresAuth: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-purple/10">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <Link href="/" className="text-purple/40 hover:text-purple/30 transition-colors text-sm font-medium mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-3">Cómo Funciona</h1>
            <p className="text-xl text-purple/40 max-w-2xl">Un viaje estructurado de 90 días diseñado para transformar tu carrera. Conoce los 4 pilares de tu desarrollo profesional.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        {/* Overview */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Viaje de 90 Días</h2>
            <p className="text-purple/60 mb-6">
              Despega Tu Carrera no es otro curso más. Es un sistema estructurado que te guía paso a paso a través de 4 pilares fundamentales, con IA adaptándose a tu progreso.
            </p>
            <ul className="space-y-3">
              {[
                "Personalizados basados en tu perfil",
                "Avanzas solo cuando dominas cada sección",
                "Coaching de IA disponible 24/7",
                "Acceso a 120+ recursos profesionales",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
                  <span className="text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-purple/5 border border-purple/10 rounded-xl p-8 h-full flex flex-col justify-center">
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 border border-cyan/20">
                <p className="text-sm text-purple/40 mb-1">Duración Total</p>
                <p className="text-2xl font-bold text-white">90 Días</p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-cyan/20">
                <p className="text-sm text-purple/40 mb-1">Tiempo Semanal Recomendado</p>
                <p className="text-2xl font-bold text-white">5-7 Horas</p>
              </div>
              <div className="bg-background rounded-lg p-4 border border-cyan/20">
                <p className="text-sm text-purple/40 mb-1">Evaluaciones Incluidas</p>
                <p className="text-2xl font-bold text-white">6 Tests</p>
              </div>
            </div>
          </div>
        </div>

        {/* The 4 Pillars */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-12">Los 4 Pilares</h2>
          <div className="space-y-6">
            {pillars.map((pillar, index) => {
              const IconComponent = pillar.icon
              return (
                <div key={index} className="group border border-purple/10 rounded-xl p-8 hover:border-cyan/30 transition-colors bg-purple/5 hover:bg-purple/10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-cyan/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-cyan" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-2xl font-bold text-white">{pillar.title}</h3>
                          <span className="text-xs px-2 py-1 bg-cyan/10 text-cyan rounded-full font-mono">
                            {pillar.subtitle}
                          </span>
                        </div>
                        <p className="text-purple/40 text-sm">{pillar.duration}</p>
                      </div>
                    </div>
                    {pillar.requiresAuth && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-purple/10 rounded-full">
                        <Lock className="w-4 h-4 text-purple/60" />
                        <span className="text-xs text-purple/60 font-medium">Requiere login</span>
                      </div>
                    )}
                  </div>

                  <p className="text-purple/60 mb-6 text-lg">{pillar.description}</p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Objectives */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan rounded-full"></span>
                        Objetivos
                      </h4>
                      <ul className="space-y-2">
                        {pillar.objectives.map((obj, idx) => (
                          <li key={idx} className="text-sm text-purple/60 flex gap-2">
                            <span className="text-cyan">→</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tests/Features */}
                    {pillar.tests && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-cyan rounded-full"></span>
                          Evaluaciones
                        </h4>
                        <ul className="space-y-2">
                          {pillar.tests.map((test, idx) => (
                            <li key={idx} className="text-sm text-purple/60 flex gap-2">
                              <span className="text-cyan">✓</span>
                              <span>{test}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Output */}
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan rounded-full"></span>
                        Resultado
                      </h4>
                      <p className="text-sm text-purple/60">{pillar.output}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Flujo de Progresión</h2>
          <div className="bg-purple/5 border border-purple/10 rounded-xl p-8">
            <div className="grid md:grid-cols-4 gap-4">
              {["Conozcámonos", "Rutas", "Entrenamiento", "Realidad"].map((stage, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-cyan/10 border-2 border-cyan rounded-full flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-cyan">{idx + 1}</span>
                  </div>
                  <p className="text-white font-semibold text-center text-sm">{stage}</p>
                  {idx < 3 && (
                    <ArrowRight className="w-5 h-5 text-cyan mt-4 md:hidden" />
                  )}
                </div>
              ))}
            </div>
            <div className="hidden md:flex justify-center gap-4 mt-4 text-cyan">
              <ArrowRight className="w-6 h-6" />
              <ArrowRight className="w-6 h-6" />
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Smart Unlock Rules */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Progresión Inteligente</h2>
          <div className="bg-purple/5 border border-purple/10 rounded-xl p-8">
            <p className="text-purple/60 mb-6">
              No saltamos etapas. El sistema verifica que hayas dominado cada sección antes de avanzar:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  label: "Competencia Validada",
                  desc: "Debes aprobar evaluaciones con 70%+ para avanzar",
                },
                {
                  label: "Secuencia Obligatoria",
                  desc: "Los módulos se desbloquean en orden. No puedes saltear etapas.",
                },
                {
                  label: "Reintentos Ilimitados",
                  desc: "Puedes retomar cualquier evaluación sin límite de intentos",
                },
                {
                  label: "Retroalimentación en Tiempo Real",
                  desc: "La IA te da feedback personalizado después de cada respuesta",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-background rounded-lg p-4 border border-cyan/10">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-cyan" />
                    {item.label}
                  </h4>
                  <p className="text-sm text-purple/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white mb-8">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            {[
              {
                question: "¿Puedo pausar el programa?",
                answer: "Sí, puedes pausar cuando quieras. No hay fecha límite. Puedes retomar desde donde lo dejaste.",
              },
              {
                question: "¿Necesito estudiar a tiempo completo?",
                answer: "No. Recomendamos 5-7 horas por semana. Algunos lo completan más rápido, otros toman 120+ días.",
              },
              {
                question: "¿Qué pasa si no paso una evaluación?",
                answer: "Puedes retomar la evaluación ilimitadas veces. Obtendrás retroalimentación personalizada para mejorar.",
              },
              {
                question: "¿Acceso de por vida?",
                answer: "Sí, mantiene acceso completo a todos los contenidos y recursos mientras tu cuenta esté activa.",
              },
              {
                question: "¿Puedo acceder desde móvil?",
                answer: "Completamente responsive. Diseñado para web, tablet y móvil.",
              },
              {
                question: "¿Hay certificado al terminar?",
                answer: "Sí, recibirás un certificado digital verificable que puedes compartir en LinkedIn.",
              },
            ].map((faq, idx) => (
              <details key={idx} className="group bg-purple/5 border border-purple/10 rounded-lg p-4 hover:border-cyan/30 transition-colors cursor-pointer">
                <summary className="flex items-center justify-between text-white font-semibold group-open:text-cyan transition-colors">
                  {faq.question}
                  <span className="text-purple/40 group-open:text-cyan">+</span>
                </summary>
                <p className="text-purple/60 mt-3">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan/10 to-purple/10 border border-cyan/20 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para comenzar?</h2>
          <p className="text-purple/60 mb-8 max-w-2xl mx-auto">
            Únete a cientos de profesionales que ya están transformando sus carreras con Despega Tu Carrera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-cyan hover:bg-cyan/90 text-black font-semibold">
                Comenzar Ahora
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-purple/20 text-white hover:bg-purple/5">
                Más Información
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
