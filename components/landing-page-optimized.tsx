'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Check, X, Zap, Target, Users, Brain, FileText, Headphones, TrendingUp, Award, Lock } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LandingPageOptimized() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [perfilResponses, setPerfilResponses] = useState({
    feeling: 'Perdido',
    seeking: 'Encontrar mi foco',
    style: 'Directo y asertivo'
  })

  const faqItems = [
    {
      q: '¿Para quién es DTC exactamente?',
      a: 'Para profesionales en tech, retail, finance, consultoría que saben que pueden más pero no saben exactamente qué, hacia dónde o cómo. Si tienes 2+ años de experiencia y sientes que estás atascado, DTC es para ti.'
    },
    {
      q: '¿Cuánto cuesta realmente?',
      a: 'Gratuito para diagnóstico + 30 días. Pro es $4,390/mes para acceso 90 días completos con acompañamiento IA 24/7, CV ATS y portfolio builder. Garantía 7 días: sin costo si no es para ti.'
    },
    {
      q: '¿Cuánto tiempo toma?',
      a: '90 días estructurados. Week 1-2: descubrimiento. Week 3-4: diseño de ruta. Week 5-8: ejecución. Week 9-12: lanzamiento. Pero muchos ven claridad en la primera semana.'
    },
    {
      q: '¿Qué pasa si no me gusta?',
      a: 'Te devolvemos cada peso en 7 días. Sin preguntas. Pero basándose en nuestros datos, 92% de usuarios continúan después de semana 1.'
    },
    {
      q: '¿Puedo usarlo si trabajo full time?',
      a: 'Sí. El diagnóstico toma 30 min/día. Diseño de ruta y ejecución son parcialmente asincrónico. Mucha gente lo hace en noches/fines de semana.'
    },
    {
      q: '¿Es solo para IT?',
      a: 'No. Hemos ayudado profesionales en retail, finance, consultoría, operaciones, ventas. El principio es el mismo: claridad → ruta → acción.'
    },
    {
      q: '¿Necesito un mentor humano?',
      a: 'No necesario. Nuestra IA hace 85% del trabajo. Si necesitas acompañamiento humano, lo conectamos (costo adicional), pero la mayoría no lo necesita.'
    },
    {
      q: '¿Qué pasa con mis datos?',
      a: 'Son tuyos. Nunca los vendemos. Los usamos para mejorar el diagnóstico y personalizarlo. Cifrado end-to-end. Privacy first.'
    }
  ]

  const comparisonFeatures = [
    { feature: 'Claridad sobre ti', dtc: true, tests: false, coaching: 'partial', ai: true },
    { feature: 'Costo', dtc: '$$$', tests: '$', coaching: '$$$$', ai: '$$$' },
    { feature: 'Tiempo', dtc: '90d', tests: '1d', coaching: '3-6m', ai: '90d' },
    { feature: 'Ruta personalizada', dtc: true, tests: false, coaching: 'partial', ai: true },
    { feature: 'Acompañamiento', dtc: true, tests: false, coaching: true, ai: true },
    { feature: 'CV + Portfolio', dtc: true, tests: false, coaching: false, ai: true }
  ]

  const differentiators = [
    {
      icon: Brain,
      title: 'Autoconocimiento Real',
      desc: 'No test fake. Tu verdadera esencia, sin juicio.',
      color: 'rgba(80, 160, 170, 0.6)'
    },
    {
      icon: Target,
      title: 'Ruta Personalizada',
      desc: 'No template. La TUYA, basada en quién eres.',
      color: 'rgba(90, 90, 150, 0.6)'
    },
    {
      icon: Zap,
      title: 'IA 24/7',
      desc: 'Siempre disponible. Responde tus dudas al instante.',
      color: 'rgba(170, 70, 170, 0.6)'
    },
    {
      icon: FileText,
      title: 'CV ATS Armado',
      desc: 'Te lo construimos juntos. Validado, no fake.',
      color: 'rgba(220, 100, 80, 0.6)'
    },
    {
      icon: Award,
      title: 'Portfolio Visible',
      desc: 'Tu evidencia. Lo que de verdad habla.',
      color: 'rgba(80, 170, 140, 0.6)'
    },
    {
      icon: TrendingUp,
      title: 'Resultados Medibles',
      desc: '+$215K promedio en año 1. Números reales.',
      color: 'rgba(220, 150, 80, 0.6)'
    }
  ]

  const timeline = [
    {
      week: '1-2',
      title: 'Descubrimiento Personal',
      items: [
        'Diagnóstico interactivo profundo',
        'Perfil Vivo generado (quién eres)',
        'Primeras recomendaciones'
      ],
      color: 'rgba(80, 160, 170, 0.6)'
    },
    {
      week: '3-4',
      title: 'Diseño de Ruta',
      items: [
        'Análisis de oportunidades reales',
        'Plan 90 días personalizado',
        'Validación con tu IA coach'
      ],
      color: 'rgba(90, 90, 150, 0.6)'
    },
    {
      week: '5-8',
      title: 'Ejecución + Portfolio',
      items: [
        'Construcción de CV ATS',
        'Evidencia linkada (projects)',
        'Interview prep personalizado'
      ],
      color: 'rgba(170, 70, 170, 0.6)'
    },
    {
      week: '9-12',
      title: 'Lanzamiento',
      items: [
        'Portfolio público listo',
        'Estrategia de búsqueda validada',
        'Networking guide personalizado'
      ],
      color: 'rgba(220, 100, 80, 0.6)'
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ===== NAVBAR ===== */}
      <nav className="border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img src="/dtc-logo.png" alt="DTC Logo" className="h-10 object-contain" />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth/signin" prefetch={true}>
                <Button size="sm" className="rounded-full text-white" style={{ backgroundColor: 'rgba(90, 200, 220, 0.80)' }}>
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        {/* TRUST SIGNALS */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-2xl font-bold text-teal-400 mb-2">2,400+</p>
              <p className="text-sm text-foreground/70">Profesionales transformados en Chile</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-400 mb-2">$215K</p>
              <p className="text-sm text-foreground/70">Incremento promedio en primer año</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-teal-400 mb-2">7 días</p>
              <p className="text-sm text-foreground/70">Garantía: sin costo si no es para ti</p>
            </div>
          </div>
        </div>

        {/* MAIN HERO */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
            Tienes talento, pero algo no encaja.
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-6 leading-relaxed">
            ¿No progresas en tu carrera? ¿El rol correcto o el equipo equivocado?
          </p>
          <p className="text-lg text-foreground/70 mb-10 leading-relaxed max-w-2xl mx-auto">
            En 90 días descubrirás quién realmente eres. Diseñarás tu ruta. Y avanzarás sin dudas.
          </p>
          
          {/* MAIN CTA */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <Link href="/auth/signin" prefetch={true}>
              <Button
                size="lg"
                className="text-lg px-12 py-7 shadow-lg hover:shadow-xl transition-all text-white"
                style={{ backgroundColor: 'rgba(80, 160, 170, 0.7)' }}
              >
                Diagnóstico Gratuito (5 min)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#como-funciona" className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors">
              ↓ Ver cómo funciona
            </a>
          </div>

          {/* INLINE FAQ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-black/30 rounded-2xl p-8 border border-white/10">
            <div className="text-sm">
              <p className="text-foreground/60 text-xs mb-2">¿Es como un test de personalidad?</p>
              <p className="text-foreground/90 text-sm">No. Es diagnóstico IA + diseño de ruta real + portfolio builder. Acción, no solo insight.</p>
            </div>
            <div className="text-sm">
              <p className="text-foreground/60 text-xs mb-2">¿Y si odio cambios?</p>
              <p className="text-foreground/90 text-sm">Comenzamos con CLARIDAD. A veces claridad = quedarte donde estás. Pero SABIENDO POR QUÉ.</p>
            </div>
            <div className="text-sm">
              <p className="text-foreground/60 text-xs mb-2">¿Es para todos?</p>
              <p className="text-foreground/90 text-sm">Tech, retail, finance, consultoría. 2+ años experiencia. Si sientes que puedes más, sí.</p>
            </div>
            <div className="text-sm">
              <p className="text-foreground/60 text-xs mb-2">¿Cuánto tiempo requiere?</p>
              <p className="text-foreground/90 text-sm">30 min/día en diagnóstico. Luego más flexible. Muchos lo hacen en noches/fines de semana.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESPONDE Y MIRA TU PERFIL VIVO ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10" id="como-funciona">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-center">
            Responde y mira cómo se arma tu Perfil Vivo.
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-16 max-w-3xl mx-auto">
            Esto es lo que hace una plataforma AI-first humana: parte desde ti, no desde la vacante. Cambia tus respuestas y observa cómo se adapta —en tiempo real.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {/* Question 1: Feeling */}
              <div>
                <p className="text-sm text-foreground/60 mb-3">1. ¿Cómo te sientes con tu rumbo hoy?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Perdido', 'Estancado', 'Explorando', 'Con claridad'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setPerfilResponses({ ...perfilResponses, feeling: option })}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        perfilResponses.feeling === option
                          ? 'bg-teal-500/50 text-white border border-teal-400'
                          : 'bg-black/40 text-foreground/70 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Seeking */}
              <div>
                <p className="text-sm text-foreground/60 mb-3">2. ¿Qué buscas ahora?</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Encontrar mi foco', 'Prepararme para entrevistas', 'Cambiar de rumbo', 'Crecer donde estoy'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setPerfilResponses({ ...perfilResponses, seeking: option })}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        perfilResponses.seeking === option
                          ? 'bg-teal-500/50 text-white border border-teal-400'
                          : 'bg-black/40 text-foreground/70 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Style */}
              <div>
                <p className="text-sm text-foreground/60 mb-3">3. Tu estilo de comunicación</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Directo y asertivo', 'Abierto y conversacional', 'Calmado y reflexivo', 'Preciso y estructurado'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setPerfilResponses({ ...perfilResponses, style: option })}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        perfilResponses.style === option
                          ? 'bg-teal-500/50 text-white border border-teal-400'
                          : 'bg-black/40 text-foreground/70 border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-foreground/50 pt-4">Cambia tus respuestas y observa tu Perfil Vivo →</p>
            </div>

            {/* RIGHT: Dynamic Perfil Vivo Preview */}
            <div className="p-8 rounded-2xl border-2 h-full sticky top-32" style={{ borderColor: 'rgba(80, 160, 170, 0.4)', backgroundColor: 'rgba(80, 160, 170, 0.08)' }}>
              <div className="text-center mb-6">
                <p className="text-sm text-teal-400 font-semibold mb-4">TU PERFIL VIVO</p>
                <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center border border-teal-500/30">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-foreground/60 text-xs mb-1">Sentimiento actual</p>
                  <p className="font-medium text-teal-300">{perfilResponses.feeling}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-xs mb-1">Lo que buscas</p>
                  <p className="font-medium text-cyan-300">{perfilResponses.seeking}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-xs mb-1">Estilo de comunicación</p>
                  <p className="font-medium text-blue-300">{perfilResponses.style}</p>
                </div>
                <hr className="my-3 border-white/10" />
                <div>
                  <p className="text-foreground/60 text-xs mb-1">Tipo de profesional</p>
                  <p className="font-medium">
                    {perfilResponses.feeling === 'Con claridad' ? 'Líder Ejecutivo' : perfilResponses.feeling === 'Explorando' ? 'Innovador Versátil' : perfilResponses.feeling === 'Perdido' ? 'Talento en Transición' : 'Especialista en Crecimiento'}
                  </p>
                </div>
                <div>
                  <p className="text-foreground/60 text-xs mb-1">Rol recomendado</p>
                  <p className="font-medium text-teal-400">
                    {perfilResponses.seeking === 'Cambiar de rumbo' ? 'Consultor / Product Manager' : perfilResponses.seeking === 'Prepararme para entrevistas' ? 'Especialista / Líder' : 'Estratega / Innovador'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NO PARTIMOS DE LA VACANTE ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            No partimos de la vacante.<br/>Partimos de ti.
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* LEFT: Traditional */}
            <div className="p-8 rounded-2xl border-2" style={{ borderColor: 'rgba(220, 100, 80, 0.3)' }}>
              <h3 className="text-xl font-bold mb-6 text-red-400">Aproximación Tradicional</h3>
              <div className="space-y-4">
                {[
                  'Buscar vacantes (alguien decide por ti)',
                  'Adaptar tu CV al job posting',
                  'Esperar respuesta del recruiter',
                  'Negociar sobre lo que encuentres',
                  'Repetir en 2 años'
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: DTC */}
            <div className="p-8 rounded-2xl border-2" style={{ borderColor: 'rgba(80, 160, 170, 0.3)' }}>
              <h3 className="text-xl font-bold mb-6 text-teal-400">Nuestro Enfoque</h3>
              <div className="space-y-4">
                {[
                  'Descubrir quién ERES (no solo qué sabes hacer)',
                  'Diseñar tu ruta alineada a ti',
                  'Crear evidencia de lo que puedes respaldar',
                  'Atraer oportunidades (en lugar de buscar)',
                  'Avanzar con CLARIDAD'
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span className="text-foreground/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EL PROBLEMA: FALTA DE CLARIDAD ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-center">
            El problema no es falta de opciones.
          </h2>
          <h3 className="text-3xl md:text-4xl font-light text-center text-teal-400 mb-16">
            Es la falta de claridad.
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* WITHOUT CLARITY */}
            <div className="p-8 rounded-2xl" style={{ backgroundColor: 'rgba(220, 100, 80, 0.08)', borderColor: 'rgba(220, 100, 80, 0.3)', borderWidth: '2px' }}>
              <h4 className="text-lg font-bold mb-6">Sin Claridad</h4>
              <div className="space-y-3">
                {[
                  { icon: '✗', text: 'Parálisis por análisis (5 opciones, 0 decisión)' },
                  { icon: '✗', text: 'Miedo a equivocarse' },
                  { icon: '✗', text: 'Baja confianza (lo ves en tu CV)' },
                  { icon: '✗', text: 'Pierdes $200-500K en oportunidades' },
                  { icon: '✗', text: 'Frustración → Resentimiento' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-red-400 text-lg mt-0.5">{item.icon}</span>
                    <span className="text-foreground/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WITH DTC */}
            <div className="p-8 rounded-2xl" style={{ backgroundColor: 'rgba(80, 160, 170, 0.08)', borderColor: 'rgba(80, 160, 170, 0.3)', borderWidth: '2px' }}>
              <h4 className="text-lg font-bold mb-6">Con DTC</h4>
              <div className="space-y-3">
                {[
                  { icon: '✓', text: 'Certainty (sabes quién eres, qué quieres)' },
                  { icon: '✓', text: 'Confianza (la ves al hablar)' },
                  { icon: '✓', text: '+$215K promedio en primer año' },
                  { icon: '✓', text: 'Ruta clara (próximos 90 días y más)' },
                  { icon: '✓', text: 'Acción (no indecisión)' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="text-teal-400 text-lg mt-0.5">{item.icon}</span>
                    <span className="text-foreground/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== POR QUÉ DTC NO SE PARECE A "LO DE SIEMPRE" ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            Por qué DTC no se parece a "lo de siempre"
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 font-semibold text-foreground/80">Aspecto</th>
                  <th className="text-center py-4 px-4 font-semibold text-teal-400">DTC</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground/60">Tests</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground/60">Coaching</th>
                  <th className="text-center py-4 px-4 font-semibold text-foreground/60">Coach+IA</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((item, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-4 px-4 text-foreground/90 font-medium">{item.feature}</td>
                    <td className="text-center py-4 px-4">
                      {typeof item.dtc === 'boolean' ? (
                        item.dtc ? <Check className="w-5 h-5 text-teal-400 mx-auto" /> : <X className="w-5 h-5 text-foreground/40 mx-auto" />
                      ) : (
                        <span className="text-teal-400">{item.dtc}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof item.tests === 'boolean' ? (
                        item.tests ? <Check className="w-5 h-5 text-teal-400 mx-auto" /> : <X className="w-5 h-5 text-foreground/40 mx-auto" />
                      ) : (
                        <span className="text-foreground/60">{item.tests}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof item.coaching === 'boolean' ? (
                        item.coaching ? <Check className="w-5 h-5 text-teal-400 mx-auto" /> : <X className="w-5 h-5 text-foreground/40 mx-auto" />
                      ) : (
                        <span className="text-foreground/60">{item.coaching === 'partial' ? 'Parcial' : item.coaching}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof item.ai === 'boolean' ? (
                        item.ai ? <Check className="w-5 h-5 text-teal-400 mx-auto" /> : <X className="w-5 h-5 text-foreground/40 mx-auto" />
                      ) : (
                        <span className="text-foreground/60">{item.ai}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== CLARIDAD PRIMERO. RESULTADOS EN CONSECUENCIA. ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-center">
            Claridad primero.
          </h2>
          <h3 className="text-3xl md:text-4xl font-light text-center text-teal-400 mb-16">
            Resultados en consecuencia.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((item, i) => {
              const IconComponent = item.icon
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border"
                  style={{
                    backgroundColor: `${item.color}08`,
                    borderColor: `${item.color}40`
                  }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center" style={{ backgroundColor: item.color }}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                  <p className="text-foreground/70 text-sm">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== ACOMPAÑAMIENTO 24/7 ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            Un acompañamiento que no se apaga.
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Tu IA coach disponible 24/7</h3>
              <p className="text-foreground/80 mb-6">
                No esperes a la próxima sesión. Cuando te surja una duda, una oportunidad, o simplemente necesites validar algo:
              </p>
              <ul className="space-y-3">
                {[
                  'Chat en tiempo real (respuesta en segundos)',
                  'Análisis de ofertas de trabajo',
                  'Prep para entrevistas personalizadas',
                  'Validación de decisiones',
                  'Ajustes a tu ruta según contexto'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-2xl border-2" style={{ borderColor: 'rgba(80, 160, 170, 0.4)', backgroundColor: 'rgba(80, 160, 170, 0.08)' }}>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-black/40">
                  <p className="text-xs text-foreground/60 mb-2">Chat IA</p>
                  <p className="text-sm">¿Debo irme de esta empresa?</p>
                  <p className="text-xs text-teal-400 mt-3">IA Coach: Basándome en tu perfil, estas son las 3 razones por las que deberías quedarte...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CV ATS ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-center">
            Tu CV ATS, armado con lo que sí puedes respaldar.
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-16">
            No inventamos logros. Construimos evidencia real, linkada, respaldada.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Resumen Inteligente', desc: 'Algoritmo ATS optimizado' },
              { title: 'Proyectos + Links', desc: 'Portfolio integrado' },
              { title: 'Skills Validadas', desc: 'Por IA + usuarios' },
              { title: 'Recs Personalizadas', desc: 'Dinámicas según rol' }
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border text-center"
                style={{
                  borderColor: 'rgba(80, 160, 170, 0.3)',
                  backgroundColor: 'rgba(80, 160, 170, 0.08)'
                }}
              >
                <FileText className="w-8 h-8 text-teal-400 mx-auto mb-3" />
                <h4 className="font-bold mb-1">{item.title}</h4>
                <p className="text-sm text-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NO ES UN TEST ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            No es un test. Ni una bolsa de empleos.
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl border-2" style={{ borderColor: 'rgba(220, 100, 80, 0.3)' }}>
              <h3 className="text-xl font-bold mb-6">Lo que NO es DTC</h3>
              <ul className="space-y-3">
                {[
                  'Un test tipo MBTI o Enneagrama',
                  'Una bolsa de empleos',
                  'Un coach humano (aunque puedes agregarlo)',
                  'Un "hágase rico rápido"'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 rounded-2xl border-2" style={{ borderColor: 'rgba(80, 160, 170, 0.3)' }}>
              <h3 className="text-xl font-bold mb-6 text-teal-400">Lo que SÍ es DTC</h3>
              <ul className="space-y-3">
                {[
                  'Diagnóstico profundo de quién eres',
                  'Ruta diseñada para TI (no template)',
                  'Portfolio + evidencia real',
                  'Acompañamiento IA 24/7'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            Empieza gratis. Sube cuando lo necesites.
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* GRATUITO */}
            <div className="p-8 rounded-2xl border-2" style={{ borderColor: 'rgba(100, 100, 100, 0.3)', backgroundColor: 'rgba(100, 100, 100, 0.05)' }}>
              <h3 className="text-2xl font-bold mb-2">Gratuito</h3>
              <p className="text-3xl font-bold text-white mb-6">$0</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Diagnóstico interactivo',
                  '30 días acceso a Perfil Vivo',
                  'Soporte por email',
                  'Primeras recomendaciones'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/signin" prefetch={true}>
                <Button className="w-full" variant="outline">
                  Comenzar ahora
                </Button>
              </Link>
            </div>

            {/* PRO */}
            <div className="p-8 rounded-2xl border-2" style={{ borderColor: 'rgba(80, 160, 170, 0.5)', backgroundColor: 'rgba(80, 160, 170, 0.1)' }}>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-3xl font-bold text-teal-400 mb-1">$4,390</p>
              <p className="text-sm text-foreground/60 mb-6">/mes (o de una)</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Todo lo del plan Gratuito',
                  'Acceso 90 días completos',
                  'IA Coach 24/7',
                  'CV ATS armado + validado',
                  'Portfolio builder integrado',
                  'Garantía: 7 días sin costo'
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <Check className="w-5 h-5 text-teal-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/signin" prefetch={true}>
                <Button
                  className="w-full text-white"
                  style={{ backgroundColor: 'rgba(80, 160, 170, 0.7)' }}
                >
                  Comenzar 90 días Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TIMELINE / ROADMAP ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            Hacia dónde vamos.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((phase, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border-2"
                style={{
                  borderColor: `${phase.color}60`,
                  backgroundColor: `${phase.color}10`
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 font-bold text-white"
                  style={{ backgroundColor: phase.color }}
                >
                  {i + 1}
                </div>
                <h4 className="text-lg font-bold mb-1">Semana {phase.week}</h4>
                <p className="text-sm font-semibold text-foreground/90 mb-4">{phase.title}</p>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="text-xs text-foreground/70">• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-center">
            Lo que probablemente estés preguntando.
          </h2>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden transition-all"
                style={{
                  borderColor: expandedFaq === i ? 'rgba(80, 160, 170, 0.6)' : 'rgba(100, 100, 100, 0.2)',
                  backgroundColor: expandedFaq === i ? 'rgba(80, 160, 170, 0.05)' : 'transparent'
                }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <p className="font-semibold">{item.q}</p>
                  <span className={`transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {expandedFaq === i && (
                  <div className="px-4 pb-4 text-foreground/80 border-t border-white/10">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-6">
            Da el primer paso hacia tu claridad.
          </h2>
          <p className="text-lg text-foreground/70 mb-12">
            El diagnóstico es gratis. Sin compromiso. Sin email spam. Solo claridad.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin" prefetch={true}>
              <Button
                size="lg"
                className="text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all text-white"
                style={{ backgroundColor: 'rgba(80, 160, 170, 0.7)' }}
              >
                Comienza Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-10 py-6"
            >
              Preguntas
            </Button>
          </div>

          <p className="text-xs text-foreground/50 mt-8">
            Garantía: Sin costo en primeros 7 días si no es para ti. Procesamos reembolsos al instante.
          </p>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-white/10 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 max-w-4xl">
            <div>
              <p className="font-semibold mb-4">Producto</p>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-foreground/90">Características</a></li>
                <li><a href="#" className="hover:text-foreground/90">Precios</a></li>
                <li><a href="#" className="hover:text-foreground/90">Garantía</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-foreground/90">Privacidad</a></li>
                <li><a href="#" className="hover:text-foreground/90">Términos</a></li>
                <li><a href="#" className="hover:text-foreground/90">Cookies</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Compañía</p>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-foreground/90">Sobre nosotros</a></li>
                <li><a href="#" className="hover:text-foreground/90">Blog</a></li>
                <li><a href="#" className="hover:text-foreground/90">Contacto</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Síguenos</p>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><a href="#" className="hover:text-foreground/90">LinkedIn</a></li>
                <li><a href="#" className="hover:text-foreground/90">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground/90">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-foreground/60">
            <p>© 2026 Despega Tu Carrera. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
