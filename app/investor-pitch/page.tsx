import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Presentación para Inversionistas - Despega Tu Carrera | Plataforma de Desarrollo Profesional",
  description:
    "Oportunidad de inversión: Plataforma de desarrollo profesional impulsada por IA revolucionando el crecimiento profesional en América Latina",
  robots: {
    index: false,
    follow: false,
  },
}

export default function InvestorPitch() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-muted/20 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-purple hover:text-purple">
            ← Volver al Inicio
          </Link>
          <h1 className="text-xl font-bold text-foreground">Presentación para Inversionistas</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="bg-background">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-purple/10 text-sm font-semibold mb-2 uppercase tracking-wide">
              Oportunidad de Inversión
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Despega Tu Carrera</h1>
            <p className="text-2xl text-purple/10 mb-6">
              Democratizando el Desarrollo Profesional en América Latina mediante IA
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-sm text-purple/10">Fecha de Lanzamiento</div>
                <div className="text-2xl font-bold">Q1 2026</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-sm text-purple/10">Mercado</div>
                <div className="text-2xl font-bold">Chile (LATAM)</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3">
                <div className="text-sm text-purple/10">Etapa</div>
                <div className="text-2xl font-bold">Pre-Lanzamiento</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Problem */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-muted/20">
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <span className="w-12 h-12 bg-red/10 rounded-xl flex items-center justify-center text-2xl">🎯</span>
              El Problema
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background">
                <h3 className="font-bold text-lg mb-3 text-foreground">Acceso Limitado</h3>
                <p className="text-muted">
                  Las herramientas de desarrollo profesional son caras e inaccesibles para la mayoría de los
                  profesionales chilenos. La coaching de carrera cuesta $100-300+ por sesión.
                </p>
              </div>
              <div className="bg-background">
                <h3 className="font-bold text-lg mb-3 text-foreground">Soluciones Fragmentadas</h3>
                <p className="text-muted">
                  Las pruebas, libros y coaching están dispersos en múltiples plataformas. No existe una solución
                  unificada para un desarrollo de carrera completo.
                </p>
              </div>
              <div className="bg-background">
                <h3 className="font-bold text-lg mb-3 text-foreground">Sin Personalización</h3>
                <p className="text-muted">
                  El consejo genérico no considera las personalidades individuales, las fortalezas o las condiciones del
                  mercado local en Chile y América Latina.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="mb-12">
          <div className="bg-purple rounded-2xl p-8 shadow-lg text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <span className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm">
                ✨
              </span>
              Nuestra Solución
            </h2>
            <p className="text-xl text-purple/10 mb-8">
              Una plataforma de desarrollo profesional impulsada por IA que combina pruebas psicométricas validadas
              científicamente, contenido de clase mundial y coaching personalizado - accesible para todos.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">🧠</div>
                <h3 className="font-bold text-lg mb-2">Sistema Cerebro AI</h3>
                <p className="text-purple/10 text-sm">
                  Coach impulsado por GPT-4 con búsqueda semántica en 120+ libros y 100+ recursos del mercado chileno
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-bold text-lg mb-2">6 Pruebas Psicométricas</h3>
                <p className="text-purple/10 text-sm">
                  Pruebas DISC, MBTI, Big Five, RIASEC, EQ y Soft Skills con insights generados por IA
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl mb-3">📚</div>
                <h3 className="font-bold text-lg mb-2">Biblioteca Profesional</h3>
                <p className="text-purple/10 text-sm">
                  120+ libros completos en texto sobre liderazgo, productividad, EQ y desarrollo de carrera
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Opportunity */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-muted/20">
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <span className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">📈</span>
              Oportunidad de Mercado
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-background">
                <h3 className="font-bold text-2xl mb-4 text-foreground">Mercado de Chile</h3>
                <ul className="space-y-3 text-muted">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>9.5M+ profesionales</strong> en el trabajo chileno
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>$2.4B+ tamaño del mercado</strong> de desarrollo profesional
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>73% penetración de internet</strong> con creciente adopción digital
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-green rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Tasa de educación alta</strong> - 60%+ con educación universitaria
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-background">
                <h3 className="font-bold text-2xl mb-4 text-foreground">Expansión en LATAM</h3>
                <ul className="space-y-3 text-muted">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>280M+ profesionales</strong> en la región de América Latina
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>$65B+ mercado</strong> para capacitación profesional en LATAM
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>15% CAGR</strong> en e-learning y educación digital
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-blue rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <strong>Idioma y cultura compartidos</strong> facilitan la expansión rápida
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-purple/5 rounded-xl p-6 border border-purple/10">
              <h3 className="font-bold text-xl mb-3 text-foreground">Tendencias de Crecimiento</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple mb-1">Primero en IA</div>
                  <p className="text-sm text-muted-foreground">Gen Z y Millennials demandan soluciones impulsadas por IA</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue mb-1">Trabajo Remoto</div>
                  <p className="text-sm text-muted-foreground">Mayor necesidad de desarrollo profesional autodirigido</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green mb-1">Brecha de Habilidades</div>
                  <p className="text-sm text-muted-foreground">
                    Empresas invirtiendo fuertemente en el reforzamiento de empleados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Model */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-muted/20">
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <span className="w-12 h-12 bg-blue/10 rounded-xl flex items-center justify-center text-2xl">💰</span>
              Modelo de Negocio
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background rounded-xl p-6 border border-purple/10">
                <h3 className="font-bold text-xl mb-4 text-foreground">Freemium (Lanzamiento)</h3>
                <div className="text-3xl font-bold text-purple mb-2">$0</div>
                <ul className="space-y-2 text-muted text-sm mb-4">
                  <li>✓ Todas las 6 pruebas psicométricas</li>
                  <li>✓ Acceso completo a la biblioteca (120+ libros)</li>
                  <li>✓ Coaching básico de IA</li>
                  <li>✓ Resultados e insights</li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  Construye base de usuarios y recopila datos para ajuste producto-mercado
                </p>
              </div>

              <div className="bg-background">
                <h3 className="font-bold text-xl mb-4 text-foreground">Premium Individual</h3>
                <div className="text-3xl font-bold text-blue mb-2">$29/mes</div>
                <ul className="space-y-2 text-muted text-sm mb-4">
                  <li>✓ Todo en Gratuito</li>
                  <li>✓ Sesiones de coaching de IA ilimitadas</li>
                  <li>✓ Análisis avanzados y seguimiento</li>
                  <li>✓ Simulaciones de trayectoria de carrera</li>
                  <li>✓ Soporte prioritario</li>
                </ul>
                <p className="text-xs text-muted-foreground">Objetivo: conversión de 5-10% de usuarios gratuitos</p>
              </div>

              <div className="bg-background">
                <h3 className="font-bold text-xl mb-4 text-foreground">Empresarial (B2B)</h3>
                <div className="text-3xl font-bold text-green mb-2">Personalizado</div>
                <ul className="space-y-2 text-muted text-sm mb-4">
                  <li>✓ Dashboards y análisis de equipo</li>
                  <li>✓ Evaluaciones masivas</li>
                  <li>✓ Opciones de marca blanca</li>
                  <li>✓ Integración con sistemas HR</li>
                  <li>✓ Soporte dedicado</li>
                </ul>
                <p className="text-xs text-muted-foreground">Objetivo: grandes empresas chilenas y consultorías de HR</p>
              </div>
            </div>
          </div>
        </section>

        {/* Competitive Advantage */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-muted/20">
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <span className="w-12 h-12 bg-orange/10 rounded-xl flex items-center justify-center text-2xl">🚀</span>
              Ventaja Competitiva
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-purple/5 rounded-lg p-5 border border-purple/10">
                  <h3 className="font-bold text-lg mb-2 text-foreground">🧠 Tecnología AI Avanzada</h3>
                  <p className="text-muted text-sm">
                    Sistema Cerebro propio con búsqueda semántica en 120+ libros. Los competidores ofrecen chatbots
                    básicos sin bases de conocimiento personalizadas.
                  </p>
                </div>

                <div className="bg-blue/5 rounded-lg p-5 border border-blue/10">
                  <h3 className="font-bold text-lg mb-2 text-foreground">🇨🇱 Expertise en el Mercado de Chile</h3>
                  <p className="text-muted text-sm">
                    Construido específicamente para profesionales chilenos con datos del mercado laboral chileno,
                    estadísticas de INE e integración con ChileValora. Los competidores globales carecen de contexto
                    local.
                  </p>
                </div>

                <div className="bg-green/5 rounded-lg p-5 border border-emerald-100">
                  <h3 className="font-bold text-lg mb-2 text-foreground">📊 Conjunto Completo de Evaluaciones</h3>
                  <p className="text-muted text-sm">
                    6 pruebas validadas científicamente en una plataforma. Los competidores suelen ofrecer 1-2 pruebas,
                    requiriendo que los usuarios utilicen múltiples plataformas.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-orange/5 rounded-lg p-5 border border-orange/10">
                  <h3 className="font-bold text-lg mb-2 text-foreground">💡 Plataforma Todo en Uno</h3>
                  <p className="text-muted text-sm">
                    Pruebas + Biblioteca + Coaching de IA en una sola plataforma. Los usuarios actualmente necesitan 3-4
                    suscripciones diferentes con un costo total de $100+ mensual.
                  </p>
                </div>

                <div className="bg-red/5 rounded-lg p-5 border border-pink-100">
                  <h3 className="font-bold text-lg mb-2 text-foreground">⚡ Stack Tecnológico Moderno</h3>
                  <p className="text-muted text-sm">
                    Construido con Next.js 15, React 19, PostgreSQL con pgvector. Los competidores utilizan tecnología
                    obsoleta con sistemas más lentos y menos inteligentes.
                  </p>
                </div>

                <div className="bg-blue/5 rounded-lg p-5 border border-indigo-100">
                  <h3 className="font-bold text-lg mb-2 text-foreground">🎯 Acceso Freemium</h3>
                  <p className="text-muted text-sm">
                    Acceso completo a las características principales de forma gratuita. Los competidores cobran $50-300
                    al inicio, limitando la accesibilidad y la penetración del mercado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Traction & Roadmap */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-muted/20">
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <span className="w-12 h-12 bg-purple/10 rounded-xl flex items-center justify-center text-2xl">📅</span>
              Desarrollo y Roadmap
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-green pl-6 bg-green/5 py-4 rounded-r-xl">
                <h3 className="font-bold text-xl mb-2 text-foreground">✅ Completado (Estado Actual)</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Desarrollo completo de la plataforma - 185 tablas de base de datos</li>
                  <li>• 6 pruebas psicométricas con análisis impulsado por IA</li>
                  <li>• Sistema Cerebro AI con búsqueda semántica operativo</li>
                  <li>• 120+ libros integrados con acceso completo a texto</li>
                  <li>• Infraestructura conforme a GDPR</li>
                  <li>• 15+ sistemas de monitoreo administrativo</li>
                </ul>
              </div>

              <div className="border-l-4 border-purple pl-6 py-4">
                <h3 className="font-bold text-xl mb-2 text-foreground">Q1 2026 - Lanzamiento Oficial</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Lanzamiento público de la plataforma en Chile</li>
                  <li>• Campaña de marketing y optimización SEO</li>
                  <li>• Adquisición de usuarios: objetivo 1,000 usuarios en 3 meses</li>
                  <li>• Recopila datos de ajuste producto-mercado</li>
                </ul>
              </div>

              <div className="border-l-4 border-blue pl-6 py-4">
                <h3 className="font-bold text-xl mb-2 text-foreground">Q2-Q4 2026</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Lanzamiento de la capa Premium Individual ($29/mes)</li>
                  <li>• Aplicaciones móviles (iOS & Android)</li>
                  <li>• Desarrollo del producto empresarial B2B</li>
                  <li>• Comienza conversaciones con grandes empresas chilenas</li>
                  <li>• Objetivo: 10,000 usuarios gratuitos, 500 usuarios pagos</li>
                </ul>
              </div>

              <div className="border-l-4 border-emerald-600 pl-6 py-4">
                <h3 className="font-bold text-xl mb-2 text-foreground">2027 - Expansión en LATAM</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Expande a Argentina, Perú, Colombia, México</li>
                  <li>• Soporte multilingüe (portugués para Brasil)</li>
                  <li>• Contratos empresariales con subsidiarias LATAM de Fortune 500</li>
                  <li>• Objetivo: 100,000 usuarios, $2M ARR</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-muted/20">
            <h2 className="text-3xl font-bold mb-6 text-foreground flex items-center gap-3">
              <span className="w-12 h-12 bg-purple/10 rounded-xl flex items-center justify-center text-2xl">👥</span>
              Equipo
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background rounded-xl p-6 border border-purple/10">
                <div className="w-20 h-20 bg-purple/20 rounded-full flex items-center justify-center text-3xl font-bold text-purple mb-4">
                  JC
                </div>
                <h3 className="font-bold text-2xl mb-2 text-foreground">Joaquin Covarrubias</h3>
                <div className="text-purple font-semibold mb-3">Fundador y CEO</div>
                <p className="text-muted mb-4">
                  Emprendedor visionario con comprensión profunda del mercado de desarrollo profesional chileno. Ha
                  conseguido financiamiento inicial y ha proporcionado dirección estratégica para el desarrollo de la
                  plataforma.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple/10 text-purple rounded-full text-sm">
                    Estrategia de Negocio
                  </span>
                  <span className="px-3 py-1 bg-purple/10 text-purple rounded-full text-sm">
                    Investigación de Mercado
                  </span>
                  <span className="px-3 py-1 bg-purple/10 text-purple rounded-full text-sm">Financiamiento</span>
                </div>
              </div>

              <div className="bg-background">
                <div className="w-20 h-20 bg-blue/20 rounded-full flex items-center justify-center text-3xl font-bold text-blue mb-4">
                  TC
                </div>
                <h3 className="font-bold text-2xl mb-2 text-foreground">Travis Comber</h3>
                <div className="text-blue font-semibold mb-3">CTO y Desarrollador Líder</div>
                <p className="text-muted mb-4">
                  Desarrollador Fullstack que diseñó y construyó toda la plataforma desde cero. Experto en Next.js,
                  React, integración de IA y diseño de sistemas escalables. Responsable de toda la implementación
                  técnica.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue/10 text-blue rounded-full text-sm">Desarrollo Fullstack</span>
                  <span className="px-3 py-1 bg-blue/10 text-blue rounded-full text-sm">Integración de IA</span>
                  <span className="px-3 py-1 bg-blue/10 text-blue rounded-full text-sm">
                    Diseño de Arquitectura de Sistema
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Ask */}
        <section className="mb-12">
          <div className="bg-purple rounded-2xl p-12 text-white shadow-xl">
            <h2 className="text-4xl font-bold mb-6">Oportunidad de Inversión</h2>
            <p className="text-xl text-purple/10 mb-8">
              Buscamos inversores estratégicos para acelerar el crecimiento, expandir nuestro equipo y escalar en
              América Latina.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-2xl mb-2">Uso de Fondos</h3>
                <ul className="space-y-2 text-purple/10 text-sm">
                  <li>• Marketing y adquisición de usuarios (40%)</li>
                  <li>• Expansión del equipo (30%)</li>
                  <li>• Desarrollo del producto (20%)</li>
                  <li>• Operaciones e infraestructura (10%)</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-2xl mb-2">Objetivos a 12 Meses</h3>
                <ul className="space-y-2 text-purple/10 text-sm">
                  <li>• 25,000 usuarios registrados</li>
                  <li>• 2,000 suscriptores pagos</li>
                  <li>• 10 clientes empresariales</li>
                  <li>• $500K ARR</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-2xl mb-2">Estrategia de Salida</h3>
                <ul className="space-y-2 text-purple/10 text-sm">
                  <li>• Adquisición por líder de EdTech</li>
                  <li>• Objetivo de adquisición en HR Tech</li>
                  <li>• Posibles compradores estratégicos: LinkedIn, Coursera, Udemy</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <h3 className="text-2xl font-bold mb-4">¿Por Qué Invertir Ahora?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-bold mb-1">Plataforma Completa Construida</div>
                    <div className="text-purple/10 text-sm">
                      Sin riesgo de desarrollo - lista para lanzar y escalar de inmediato
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-bold mb-1">Mercado Dirigible Grande</div>
                    <div className="text-purple/10 text-sm">$65B+ mercado LATAM con crecimiento anual del 15%</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-bold mb-1">Monetización Clara</div>
                    <div className="text-purple/10 text-sm">
                      Modelo freemium probado con oportunidad empresarial B2B
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <div>
                    <div className="font-bold mb-1">Ventaja Primero en IA</div>
                    <div className="text-purple/10 text-sm">
                      Tecnología AI propia que los competidores llevarán años en replicar
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg border border-muted/20">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Hablemos</h2>
            <p className="text-xl text-muted-foreground mb-8">
              ¿Interesado en aprender más? Nos encantaría discutir esta oportunidad contigo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:joaquin@despegatucarrera.cl"
                className="px-8 py-4 bg-purple text-white rounded-xl font-semibold hover:bg-purple transition-colors"
              >
                Contacta a Joaquin (CEO)
              </a>
              <Link
                href="/whitepaper"
                className="px-8 py-4 bg-muted/10 text-foreground rounded-xl font-semibold hover:bg-muted/20 transition-colors"
              >
                Ver Whitepaper Técnico
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-muted-foreground border-t border-muted/20">
        <p className="mb-2">
          <strong>Despega Tu Carrera</strong> - Democratizando el Desarrollo Profesional en LATAM
        </p>
        <p>Joaquin Covarrubias (Fundador y CEO) • Travis Comber (CTO y Desarrollador Líder)</p>
      </footer>
    </div>
  )
}
