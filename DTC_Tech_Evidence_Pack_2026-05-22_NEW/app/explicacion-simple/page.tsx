export default function ExplicacionSimplePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-purple/10 px-6 py-3 rounded-full mb-6">
            <span className="text-purple font-bold text-lg">Explicación Clara y Directa</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 text-foreground">Despega Tu Carrera</h1>
          <p className="text-2xl text-muted-foreground">Desarrollo profesional inteligente y personalizado</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Section 1: What is it */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-muted/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">¿Qué es Despega Tu Carrera?</h2>
            <p className="text-xl text-muted leading-relaxed mb-4">
              Es una plataforma web que integra evaluaciones psicométricas, inteligencia artificial y una biblioteca
              especializada para impulsar el desarrollo profesional.
            </p>
            <p className="text-xl text-muted leading-relaxed">
              Funciona como un sistema de coaching profesional personalizado, disponible 24/7, que te ayuda a
              identificar fortalezas, áreas de mejora y trazar un plan de crecimiento profesional basado en datos.
            </p>
          </div>

          {/* Section 2: The Problem */}
          <div className="bg-background">
            <h2 className="text-3xl font-bold text-foreground mb-4">El Problema que Resuelve</h2>
            <p className="text-lg text-muted mb-4">
              El mercado laboral chileno enfrenta desafíos críticos de empleabilidad y desarrollo profesional:
            </p>
            <div className="bg-white rounded-xl p-6 mb-4">
              <h3 className="font-bold text-red text-xl mb-3">Datos del Mercado Chileno (2025):</h3>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-red font-bold mt-1">•</span>
                  <span>
                    <strong>8.1%</strong> de desempleo entre profesionales (máximo histórico)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red font-bold mt-1">•</span>
                  <span>
                    <strong>21.4%</strong> de desempleo juvenil (menores de 25 años)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red font-bold mt-1">•</span>
                  <span>
                    <strong>60%</strong> de empresas no encuentran talento con las habilidades adecuadas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red font-bold mt-1">•</span>
                  <span>
                    <strong>85%</strong> del éxito profesional depende de habilidades blandas (Harvard)
                  </span>
                </li>
              </ul>
            </div>
            <div className="space-y-3 text-lg text-muted">
              <p className="font-semibold">Las personas enfrentan:</p>
              <ul className="space-y-2 ml-6">
                <li>• Falta de autoconocimiento profesional estructurado</li>
                <li>• Indecisión vocacional sin herramientas objetivas</li>
                <li>• Dificultad para identificar brechas de competencias</li>
                <li>• Acceso limitado a coaching profesional (costo $150k-$300k CLP/mes)</li>
                <li>• Recursos bibliográficos dispersos y costosos</li>
              </ul>
            </div>
          </div>

          {/* Section 3: How it works - 3 Core Tools */}
          <div className="bg-background">
            <h2 className="text-3xl font-bold text-foreground mb-6">¿Cómo Funciona? Tres Pilares Integrados</h2>

            <div className="space-y-6">
              {/* Tool 1 */}
              <div className="bg-white rounded-xl p-6 border-l-4 border-purple/50">
                <h3 className="text-2xl font-bold text-purple mb-3">1. Evaluaciones Psicométricas</h3>
                <p className="text-lg text-muted mb-3">
                  <strong>Seis instrumentos validados científicamente:</strong>
                </p>
                <ul className="space-y-2 ml-6 text-muted mb-4">
                  <li>• DISC (estilos de comportamiento)</li>
                  <li>• MBTI (tipos de personalidad)</li>
                  <li>• Big Five (rasgos de personalidad)</li>
                  <li>• RIASEC (intereses vocacionales)</li>
                  <li>• Soft Skills (habilidades interpersonales)</li>
                  <li>• Inteligencia Emocional (gestión emocional)</li>
                </ul>
                <p className="text-muted">
                  <strong>Resultado:</strong> Perfil profesional completo con análisis de fortalezas, debilidades,
                  estilo de trabajo, compatibilidad de carreras y plan de desarrollo personalizado.
                </p>
              </div>

              {/* Tool 2 */}
              <div className="bg-white rounded-xl p-6 border-l-4 border-blue/50">
                <h3 className="text-2xl font-bold text-blue mb-3">2. Cerebro (Biblioteca Digital Inteligente)</h3>
                <p className="text-lg text-muted mb-3">
                  <strong>Repositorio de 120+ libros de desarrollo profesional:</strong>
                </p>
                <ul className="space-y-2 ml-6 text-muted mb-4">
                  <li>• Búsqueda semántica con IA (encuentra conceptos, no solo palabras)</li>
                  <li>• Acceso instantáneo a contenido de alto valor</li>
                  <li>• Cobertura RAG ~60% para respuestas contextualizadas</li>
                  <li>• Temas: liderazgo, productividad, comunicación, estrategia, innovación</li>
                </ul>
                <p className="text-muted">
                  <strong>Tecnología:</strong> Vector embeddings con pgvector en Supabase para búsqueda avanzada por
                  similitud semántica.
                </p>
              </div>

              {/* Tool 3 */}
              <div className="bg-white rounded-xl p-6 border-l-4 border-green">
                <h3 className="text-2xl font-bold text-emerald-700 mb-3">3. Coach IA Personalizado</h3>
                <p className="text-lg text-muted mb-3">
                  <strong>Asistente inteligente con contexto completo:</strong>
                </p>
                <ul className="space-y-2 ml-6 text-muted mb-4">
                  <li>• Integra resultados de tus evaluaciones psicométricas</li>
                  <li>• Accede al contenido de la biblioteca (120+ libros)</li>
                  <li>• Conversaciones adaptadas a tu perfil y objetivos</li>
                  <li>• Recomendaciones específicas basadas en evidencia</li>
                </ul>
                <p className="text-muted">
                  <strong>Tecnología:</strong> OpenAI GPT-4 con RAG (Retrieval-Augmented Generation) para respuestas
                  contextualizadas y precisas.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Target Audience */}
          <div className="bg-background">
            <h2 className="text-3xl font-bold text-foreground mb-4">¿Para Quién es?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-xl text-foreground mb-3">Individuos (B2C)</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Estudiantes universitarios (orientación vocacional)</li>
                  <li>• Profesionales junior (primeros 5 años de carrera)</li>
                  <li>• Profesionales senior (desarrollo de liderazgo)</li>
                  <li>• Personas en transición laboral</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-xl text-foreground mb-3">Instituciones (B2B)</h3>
                <ul className="space-y-2 text-muted">
                  <li>• Universidades (servicios de empleabilidad)</li>
                  <li>• Empresas (desarrollo organizacional)</li>
                  <li>• Consultoras de RRHH</li>
                  <li>• Programas de capacitación</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Value Proposition */}
          <div className="bg-background">
            <h2 className="text-3xl font-bold text-foreground mb-4">Propuesta de Valor</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-indigo-700 mb-2">1. Integración Total</h3>
                <p className="text-muted">
                  Primera plataforma en Chile que combina evaluaciones + IA + biblioteca especializada en un solo
                  ecosistema.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-indigo-700 mb-2">2. Personalización Basada en Datos</h3>
                <p className="text-muted">
                  El Coach IA conoce tu perfil psicométrico completo y adapta consejos según tu personalidad y objetivos
                  específicos.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-indigo-700 mb-2">3. Accesibilidad 24/7</h3>
                <p className="text-muted">
                  Sin horarios, sin citas. Acceso inmediato cuando lo necesitas, desde cualquier dispositivo.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-indigo-700 mb-2">4. Costo-Efectividad</h3>
                <p className="text-muted">
                  Acceso gratuito a herramientas que costarían $150k-$300k CLP/mes con un coach tradicional. Planes
                  premium a fracción del costo del mercado.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-indigo-700 mb-2">5. Contexto Chileno</h3>
                <p className="text-muted">
                  Diseñado específicamente para el mercado laboral chileno con datos locales de empleabilidad y
                  carreras.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: How to Use */}
          <div className="bg-background">
            <h2 className="text-3xl font-bold text-foreground mb-6">Proceso de Uso</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-white rounded-xl p-5 border-l-4 border-purple/50">
                <div className="w-10 h-10 bg-purple/50 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Registro</p>
                  <p className="text-muted-foreground">Creación de cuenta con email. Proceso de onboarding guiado.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-xl p-5 border-l-4 border-purple/50">
                <div className="w-10 h-10 bg-purple/50 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Evaluaciones Psicométricas</p>
                  <p className="text-muted-foreground">
                    Completa las 6 evaluaciones (15-20 min cada una). Total: 90-120 minutos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-xl p-5 border-l-4 border-purple/50">
                <div className="w-10 h-10 bg-purple/50 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Análisis de Resultados</p>
                  <p className="text-muted-foreground">
                    Perfil profesional detallado con visualizaciones, fortalezas, áreas de mejora y plan de acción.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white rounded-xl p-5 border-l-4 border-purple/50">
                <div className="w-10 h-10 bg-purple/50 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">Interacción Continua</p>
                  <p className="text-muted-foreground">
                    Conversa con el Coach IA, consulta la biblioteca, actualiza evaluaciones trimestralmente.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Technology Stack */}
          <div className="bg-background">
            <h2 className="text-3xl font-bold text-foreground mb-4">Stack Tecnológico</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-foreground mb-3">Frontend</h3>
                <ul className="space-y-1 text-muted">
                  <li>• Next.js 15 (React 19)</li>
                  <li>• TypeScript</li>
                  <li>• Tailwind CSS</li>
                  <li>• shadcn/ui</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-foreground mb-3">Backend & Database</h3>
                <ul className="space-y-1 text-muted">
                  <li>• Supabase (PostgreSQL)</li>
                  <li>• pgvector (búsqueda semántica)</li>
                  <li>• Row Level Security (RLS)</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-foreground mb-3">AI & ML</h3>
                <ul className="space-y-1 text-muted">
                  <li>• OpenAI GPT-4</li>
                  <li>• RAG Architecture</li>
                  <li>• Vector embeddings</li>
                </ul>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold text-lg text-foreground mb-3">Infrastructure</h3>
                <ul className="space-y-1 text-muted">
                  <li>• Vercel (hosting)</li>
                  <li>• Vercel Blob (storage)</li>
                  <li>• Edge Functions</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 8: Team */}
          <div className="bg-background">
            <h2 className="text-3xl font-bold text-foreground mb-6">Equipo</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 border-l-4 border-rose-500">
                <p className="font-bold text-rose-700 text-2xl mb-2">Joaquin Covarrubias</p>
                <p className="text-muted-foreground font-semibold mb-3">Fundador & CEO</p>
                <p className="text-muted">
                  Visionario del proyecto. Responsable de la estrategia, financiamiento y dirección general. Define la
                  propuesta de valor y el modelo de negocio.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-blue/50">
                <p className="font-bold text-blue text-2xl mb-2">Travis Comber</p>
                <p className="text-muted-foreground font-semibold mb-3">CTO & Lead Developer</p>
                <p className="text-muted">
                  Arquitecto y desarrollador fullstack. Responsable de la construcción completa de la plataforma desde
                  cero: frontend, backend, integraciones IA, base de datos, seguridad y deployment.
                </p>
              </div>
            </div>
          </div>

          {/* Section 9: Launch & Roadmap */}
          <div className="bg-background">
            <h2 className="text-3xl font-bold text-foreground mb-6">Lanzamiento y Roadmap</h2>
            <div className="bg-white rounded-xl p-6 text-center mb-6">
              <p className="text-sm text-muted-foreground mb-2">LANZAMIENTO PÚBLICO</p>
              <p className="text-6xl font-bold text-orange mb-2">Q1 2026</p>
              <p className="text-xl text-muted">Enero - Marzo 2026</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5">
                <p className="font-bold text-lg text-foreground mb-2">Q2 2026: Expansión Mobile</p>
                <p className="text-muted">Apps iOS/Android + Features de voz</p>
              </div>
              <div className="bg-white rounded-xl p-5">
                <p className="font-bold text-lg text-foreground mb-2">Q3-Q4 2026: Enterprise & Multi-idioma</p>
                <p className="text-muted">Portales corporativos + Expansión LATAM</p>
              </div>
              <div className="bg-white rounded-xl p-5">
                <p className="font-bold text-lg text-foreground mb-2">2027: Integraciones Avanzadas</p>
                <p className="text-muted">APIs HR, LinkedIn, plataformas de reclutamiento</p>
              </div>
            </div>
          </div>

          {/* Final Summary */}
          <div className="bg-background">
            <h2 className="text-4xl font-bold mb-6 text-center">Resumen Ejecutivo</h2>
            <p className="text-xl leading-relaxed text-center mb-6">
              <strong>Despega Tu Carrera</strong> es la primera plataforma integral de desarrollo profesional en Chile
              que combina evaluaciones psicométricas validadas, inteligencia artificial avanzada y una biblioteca
              especializada de 120+ libros en un solo ecosistema accesible 24/7.
            </p>
            <div className="bg-white/10 rounded-xl p-6 text-center">
              <p className="text-lg font-semibold mb-2">Objetivo Central</p>
              <p className="text-xl">
                Democratizar el acceso a herramientas profesionales de desarrollo de carrera mediante tecnología de
                punta, datos científicos y personalización impulsada por IA.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
