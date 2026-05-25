"use client"

import Link from "next/link"

export default function OnePagerClient() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Print-friendly */}
      <header className="bg-purple text-white py-8 no-print">
        <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold hover:text-purple/10">
            ← Volver al Inicio
          </Link>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
          >
            📄 Imprimir / Descargar PDF
          </button>
        </div>
      </header>

      {/* Main Content - Single Page */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white">
          {/* Header Section */}
          <div className="border-b-4 border-purple pb-6 mb-6">
            <h1 className="text-5xl font-bold mb-2 text-foreground">Despega Tu Carrera</h1>
            <p className="text-2xl text-purple font-semibold mb-4">
              Plataforma de Desarrollo Profesional Impulsada por IA para América Latina
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold text-muted">Lanzamiento:</span>
                <span className="text-muted-foreground">Q1 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-muted">Mercado:</span>
                <span className="text-muted-foreground">Chile → LATAM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-muted">Fundador:</span>
                <span className="text-muted-foreground">Joaquin Covarrubias</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-muted">CTO:</span>
                <span className="text-muted-foreground">Travis Comber</span>
              </div>
            </div>
          </div>

          {/* Two-Column Layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* The Problem */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-red/50 pl-3">El Problema</h2>
                <ul className="space-y-2 text-sm text-muted">
                  <li>
                    • <strong>Costoso:</strong> La orientación profesional cuesta $100-300/sesión, inaccesible para la
                    mayoría de los profesionales chilenos
                  </li>
                  <li>
                    • <strong>Fragmentado:</strong> Pruebas, libros y orientación dispersos en múltiples plataformas
                  </li>
                  <li>
                    • <strong>Genérico:</strong> Sin personalización basada en la personalidad individual o en las
                    condiciones del mercado local
                  </li>
                </ul>
              </section>

              {/* The Solution */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-purple/50 pl-3">
                  Nuestra Solución
                </h2>
                <p className="text-sm text-muted mb-3">
                  Plataforma todo-en-uno impulsada por IA combinando pruebas psicométricas validadas científicamente,
                  contenido de clase mundial y orientación personalizada - accesible para todos.
                </p>
                <div className="bg-purple/5 rounded-lg p-4 border border-purple/10">
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    <div>
                      <div className="text-2xl mb-1"></div>
                      <div className="font-bold text-foreground">Cerebro AI</div>
                      <div className="text-muted-foreground">GPT-4 Coach</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1"></div>
                      <div className="font-bold text-foreground">6 Pruebas</div>
                      <div className="text-muted-foreground">Psicométricas</div>
                    </div>
                    <div>
                      <div className="text-2xl mb-1"></div>
                      <div className="font-bold text-foreground">120+ Libros</div>
                      <div className="text-muted-foreground">Profesionales</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Key Features */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-blue/50 pl-3">
                  Características Principales
                </h2>
                <ul className="space-y-2 text-sm text-muted">
                  <li>
                    • <strong>Sistema Cerebro AI:</strong> Búsqueda semántica entre 120+ libros + 100+ recursos chilenos
                  </li>
                  <li>
                    • <strong>6 Pruebas Psicométricas:</strong> DISC, MBTI, Big Five, RIASEC, EQ, Habilidades blandas
                  </li>
                  <li>
                    • <strong>Biblioteca Profesional:</strong> Acceso completo a libros sobre liderazgo, productividad,
                    EQ
                  </li>
                  <li>
                    • <strong>Insigths Impulsados por IA:</strong> Análisis y planes de desarrollo profesional
                    personalizados
                  </li>
                  <li>
                    • <strong>Datos del Mercado Chileno:</strong> Estadísticas de INE, ChileValora, tendencias de
                    LinkedIn
                  </li>
                </ul>
              </section>

              {/* Technology Stack */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-green pl-3">Tecnología</h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/5 rounded p-2 border border-muted/20">
                    <div className="font-bold text-foreground mb-1">Frontend</div>
                    <div className="text-muted-foreground">Next.js 15, React 19, TypeScript, Tailwind</div>
                  </div>
                  <div className="bg-muted/5 rounded p-2 border border-muted/20">
                    <div className="font-bold text-foreground mb-1">Backend</div>
                    <div className="text-muted-foreground">Node.js, PostgreSQL, Supabase</div>
                  </div>
                  <div className="bg-muted/5 rounded p-2 border border-muted/20">
                    <div className="font-bold text-foreground mb-1">IA</div>
                    <div className="text-muted-foreground">OpenAI GPT-4, pgvector search</div>
                  </div>
                  <div className="bg-muted/5 rounded p-2 border border-muted/20">
                    <div className="font-bold text-foreground mb-1">Infraestructura</div>
                    <div className="text-muted-foreground">Vercel Edge, Global CDN</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Market Opportunity */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-green pl-3">
                  Oportunidad de Mercado
                </h2>
                <div className="bg-green/5 rounded-lg p-4 border border-emerald-100 mb-3">
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-green">$65B+</div>
                    <div className="text-xs text-muted-foreground">Mercado de Desarrollo Profesional en LATAM</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted">
                    <div>
                      <strong>Chile:</strong> 9.5M+ profesionales
                    </div>
                    <div>
                      <strong>LATAM:</strong> 280M+ profesionales
                    </div>
                    <div>
                      <strong>Crecimiento:</strong> 15% CAGR
                    </div>
                    <div>
                      <strong>Digital:</strong> 73% penetración
                    </div>
                  </div>
                </div>
              </section>

              {/* Business Model */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-blue/50 pl-3">
                  Modelo de Negocio
                </h2>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-purple/5 rounded p-3 border border-purple/10">
                    <div className="font-bold text-foreground mb-1">Freemium</div>
                    <div className="text-2xl font-bold text-purple mb-1">$0</div>
                    <div className="text-muted-foreground">Todas las pruebas + biblioteca + IA básica</div>
                  </div>
                  <div className="bg-blue/5 rounded p-3 border border-blue/10">
                    <div className="font-bold text-foreground mb-1">Premium</div>
                    <div className="text-2xl font-bold text-blue mb-1">$29/mes</div>
                    <div className="text-muted-foreground">IA ilimitada + análisis avanzados</div>
                  </div>
                  <div className="bg-green/5 rounded p-3 border border-emerald-100">
                    <div className="font-bold text-foreground mb-1">Enterprise</div>
                    <div className="text-2xl font-bold text-green mb-1">Personalizado</div>
                    <div className="text-muted-foreground">Tableros de equipo + integración con HR</div>
                  </div>
                </div>
              </section>

              {/* Competitive Advantage */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-orange pl-3">
                  ¿Por qué Elegirnos?
                </h2>
                <ul className="space-y-2 text-sm text-muted">
                  <li>
                    • <strong>Todo-en-Uno:</strong> Pruebas + Biblioteca + Orientación IA (competidores requieren 3-4
                    suscripciones)
                  </li>
                  <li>
                    • <strong>IA Avanzada:</strong> Sistema Cerebro propio con búsqueda semántica
                  </li>
                  <li>
                    • <strong>Experiencia Chilena:</strong> Construido específicamente para el mercado local con datos
                    de INE/ChileValora
                  </li>
                  <li>
                    • <strong>Batería Completa:</strong> 6 pruebas psicométricas vs 1-2 pruebas de los competidores
                  </li>
                  <li>
                    • <strong>Accesible:</strong> Modelo Freemium vs $50-300 de cuota inicial
                  </li>
                  <li>
                    • <strong>Tecnología Moderna:</strong> Next.js 15 + React 19 + Arquitectura IA-first
                  </li>
                </ul>
              </section>

              {/* Roadmap */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-purple/50 pl-3">Roadmap</h2>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-purple min-w-[80px]">Q1 2026:</span>
                    <span className="text-muted">Lanzamiento público, 1K usuarios en 3 meses</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-blue min-w-[80px]">Q2-Q4 2026:</span>
                    <span className="text-muted">
                      Suscripción Premium, aplicaciones móviles, B2B empresarial, 10K usuarios
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-green min-w-[80px]">2027:</span>
                    <span className="text-muted">
                      Expansión en LATAM (ARG, PER, COL, MEX), 100K usuarios, $2M ARR
                    </span>
                  </div>
                </div>
              </section>

              {/* Metrics */}
              <section>
                <h2 className="text-xl font-bold mb-3 text-foreground border-l-4 border-blue/50 pl-3">
                  Métricas de Plataforma
                </h2>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-muted/5 rounded p-2 border border-muted/20">
                    <div className="font-bold text-foreground">185 Tablas de Base de Datos</div>
                    <div className="text-muted-foreground">Arquitectura de datos completa</div>
                  </div>
                  <div className="bg-muted/5 rounded p-2 border border-muted/20">
                    <div className="font-bold text-foreground">~60% Cobertura RAG</div>
                    <div className="text-muted-foreground">Consultas de búsqueda semántica</div>
                  </div>
                  <div className="bg-muted/5 rounded p-2 border border-muted/20">
                    <div className="font-bold text-foreground">GDPR Compliant</div>
                    <div className="text-muted-foreground">Protección completa de datos</div>
                  </div>
                  <div className="bg-muted/5 rounded p-2 border border-muted/20">
                    <div className="font-bold text-foreground">15+ Sistemas de Administración</div>
                    <div className="text-muted-foreground">Monitoreo completo</div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Bottom Section - Full Width */}
          <div className="border-t-2 border-muted/20 pt-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Team */}
              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">Equipo</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-bold text-foreground">Joaquin Covarrubias</div>
                    <div className="text-purple text-xs">Fundador & CEO</div>
                    <div className="text-muted-foreground text-xs">
                      Estrategia de negocio, investigación de mercado, financiamiento
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">Travis Comber</div>
                    <div className="text-blue text-xs">CTO & Desarrollador Líder</div>
                    <div className="text-muted-foreground text-xs">Desarrollo completo de la plataforma desde cero</div>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">Contacto</h2>
                <div className="space-y-2 text-sm text-muted">
                  <div>
                    <strong>Email:</strong> joaquin@despegatucarrera.com
                  </div>
                  <div>
                    <strong>Website:</strong> www.despegatucarrera.com
                  </div>
                  <div>
                    <strong>Ubicación:</strong> Santiago, Chile
                  </div>
                  <div className="text-xs text-muted-foreground mt-3">
                    Para consultas de inversores, whitepaper técnico o demo de producto, por favor contacte a Joaquin
                    Covarrubias.
                  </div>
                </div>
              </section>

              {/* Key Stats Summary */}
              <section>
                <h2 className="text-lg font-bold mb-3 text-foreground">Estadísticas Rápidas</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado de la Plataforma:</span>
                    <span className="font-bold text-green"> Completo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objetivo de Lanzamiento:</span>
                    <span className="font-bold text-purple">Q1 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mercado Objetivo:</span>
                    <span className="font-bold text-foreground">9.5M+ pros</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Modelo de Ingresos:</span>
                    <span className="font-bold text-foreground">B2C + B2B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objetivo de 12 Meses:</span>
                    <span className="font-bold text-green">$500K ARR</span>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-muted/20 text-center text-xs text-muted-foreground">
            <p>
              <strong>Despega Tu Carrera</strong> - Democratizando el Desarrollo Profesional en América Latina
            </p>
            <p className="mt-1">© 2026 Despega Tu Carrera. Todos los derechos reservados.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
