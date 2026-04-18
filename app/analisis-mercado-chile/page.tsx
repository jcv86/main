import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Análisis del Mercado Chileno - DTC",
  description: "Análisis exhaustivo del mercado chileno de desarrollo profesional y empleabilidad",
}

export default function AnalisisMercadoChilePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue mb-6">
            Análisis del Mercado Chileno
          </h1>
          <p className="text-xl text-muted/60 max-w-3xl mx-auto">
            Investigación exhaustiva del mercado de empleabilidad, desarrollo profesional y EdTech en Chile
          </p>
          <div className="mt-6 text-sm text-muted/50">
            Actualizado: Enero 2026 | Fuentes: INE, Mineduc, ManpowerGroup, Mifuturo.cl
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-16 bg-white rounded-2xl shadow-lg p-8 border border-muted/20">
          <h2 className="text-3xl font-bold text-muted/90 mb-6">Resumen Ejecutivo</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-muted/70 leading-relaxed">
              El mercado chileno enfrenta una <strong>crisis de empleabilidad profesional sin precedentes</strong>, con
              8.1% de desempleo entre profesionales (máximo histórico) y 21.4% de desempleo juvenil. Simultáneamente, el
              60% de empleadores reporta escasez crítica de talento, revelando un
              <strong> desajuste estructural entre formación y demanda laboral</strong>.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red/5 p-4 rounded-lg border border-red/20">
                <div className="text-3xl font-bold text-red mb-2">917K</div>
                <div className="text-sm text-red">Desempleados totales (Q2 2025)</div>
              </div>
              <div className="bg-orange/5 p-4 rounded-lg border border-orange/20">
                <div className="text-3xl font-bold text-orange mb-2">60%</div>
                <div className="text-sm text-orange">Empresas con escasez de talento</div>
              </div>
              <div className="bg-blue/5 p-4 rounded-lg border border-blue/20">
                <div className="text-3xl font-bold text-blue mb-2">1.39M</div>
                <div className="text-sm text-blue">Estudiantes educación superior (2024)</div>
              </div>
            </div>
          </div>
        </section>

        {/* Problema del Mercado */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-muted/90 mb-8">1. Diagnóstico del Problema</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Crisis de Empleabilidad */}
            <div className="bg-red rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">🚨 Crisis de Empleabilidad</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <strong>8.1%</strong> desempleo profesional (Q1 2025) - máximo histórico
                    <br />
                    <span className="text-red/10 text-sm">+1.4 puntos vs 2024 (+76,229 personas)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">👨‍🎓</span>
                  <div>
                    <strong>21.4%</strong> desempleo juvenil (&lt;25 años)
                    <br />
                    <span className="text-red/10 text-sm">2.4x la tasa nacional (8.9%)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <strong>+69.1%</strong> aumento desempleo de larga duración
                    <br />
                    <span className="text-red/10 text-sm">24,800 profesionales cesantes &gt;6 meses</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <strong>41%</strong> de la fuerza laboral tiene educación superior
                    <br />
                    <span className="text-red/10 text-sm">vs 22.4% en 2010 - sobrecalificación</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Escasez de Talento */}
            <div className="bg-orange rounded-2xl shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">💼 Escasez Crítica de Talento</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <strong>60%</strong> de empleadores no encuentra talento calificado
                    <br />
                    <span className="text-orange/10 text-sm">Estudio ManpowerGroup 2025</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🏥</span>
                  <div>
                    Sectores más afectados:
                    <br />
                    <span className="text-orange/10 text-sm">Salud (77%), Industria (64%), Energía (63%)</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">💻</span>
                  <div>
                    Habilidades más escasas:
                    <br />
                    <span className="text-orange/10 text-sm">
                      TI/Data (21%), Ingenierías (21%), Atención Cliente (23%)
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <strong>85%</strong> del éxito laboral depende de soft skills
                    <br />
                    <span className="text-orange/10 text-sm">92% de reclutadores priorizan soft skills</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Causas Raíz */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-muted/20">
            <h3 className="text-2xl font-bold text-muted/90 mb-6">🔍 Causas Raíz del Problema</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue pl-4">
                <h4 className="font-bold text-muted/90 mb-2">Desajuste Educación-Mercado</h4>
                <p className="text-muted/60 text-sm">
                  Exceso de profesionales en áreas no demandadas. Carreras tradicionales saturadas mientras sectores
                  tecnológicos carecen de talento.
                </p>
              </div>
              <div className="border-l-4 border-purple pl-4">
                <h4 className="font-bold text-muted/90 mb-2">Déficit de Soft Skills</h4>
                <p className="text-muted/60 text-sm">
                  Universidades priorizan conocimientos técnicos. Estudiantes egresan sin habilidades de comunicación,
                  liderazgo o adaptabilidad.
                </p>
              </div>
              <div className="border-l-4 border-green pl-4">
                <h4 className="font-bold text-muted/90 mb-2">Falta de Orientación Vocacional</h4>
                <p className="text-muted/60 text-sm">
                  Decisiones de carrera basadas en mitos familiares o prestigio social, no en aptitudes reales o demanda
                  del mercado.
                </p>
              </div>
              <div className="border-l-4 border-red pl-4">
                <h4 className="font-bold text-muted/90 mb-2">Herramientas Obsoletas</h4>
                <p className="text-muted/60 text-sm">
                  Servicios universitarios de carrera sobrecargados, tests vocacionales estáticos, sin coaching
                  personalizado ni seguimiento continuo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tamaño del Mercado */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-muted/90 mb-8">2. Tamaño y Oportunidad de Mercado</h2>

          <div className="bg-blue rounded-2xl shadow-lg p-8 text-white mb-8">
            <h3 className="text-2xl font-bold mb-6">📊 Segmentos de Mercado Primarios</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">1.39M</div>
                <div className="text-blue/10 mb-4">Estudiantes educación superior (2024)</div>
                <ul className="text-sm space-y-1 text-blue/5">
                  <li>• 58.8% en universidades</li>
                  <li>• 53.3% mujeres</li>
                  <li>• Top áreas: Tecnología (27.1%), Salud (18.9%), Comercio (18.2%)</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">~300K</div>
                <div className="text-blue/10 mb-4">Egresados anuales (estimado)</div>
                <ul className="text-sm space-y-1 text-blue/5">
                  <li>• Transición universidad → trabajo</li>
                  <li>• Alta vulnerabilidad laboral</li>
                  <li>• Necesitan orientación urgente</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">917K</div>
                <div className="text-blue/10 mb-4">Desempleados actuales</div>
                <ul className="text-sm space-y-1 text-blue/5">
                  <li>• 8.9% población activa</li>
                  <li>• Necesitan re-skilling</li>
                  <li>• Mercado B2C directo</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-muted/20">
              <h3 className="text-xl font-bold text-muted/90 mb-4">🎯 Mercado B2B (Universidades)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-muted/20">
                  <span className="text-muted/60">Universidades tradicionales</span>
                  <span className="font-bold text-muted/90">~60 instituciones</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-muted/20">
                  <span className="text-muted/60">Matrícula universitaria total</span>
                  <span className="font-bold text-muted/90">814,692 estudiantes</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-muted/20">
                  <span className="text-muted/60">Valor contrato promedio/año</span>
                  <span className="font-bold text-green">$15-50M CLP</span>
                </div>
                <div className="bg-blue/5 p-4 rounded-lg mt-4">
                  <p className="text-sm text-muted/70">
                    <strong>TAM potencial B2B:</strong> $900M - $3,000M CLP/año (60 universidades × $15-50M promedio)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-muted/20">
              <h3 className="text-xl font-bold text-muted/90 mb-4">💰 Mercado B2C (Usuarios Directos)</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-muted/20">
                  <span className="text-muted/60">Estudiantes universitarios</span>
                  <span className="font-bold text-muted/90">814K potenciales</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-muted/20">
                  <span className="text-muted/60">Profesionales desempleados</span>
                  <span className="font-bold text-muted/90">~370K (con ed. superior)</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-muted/20">
                  <span className="text-muted/60">Precio premium mensual</span>
                  <span className="font-bold text-green">$15,000 - $25,000 CLP</span>
                </div>
                <div className="bg-green/5 p-4 rounded-lg mt-4">
                  <p className="text-sm text-muted/70">
                    <strong>TAM potencial B2C:</strong> Con 1% penetración del mercado universitario (~8K usuarios) ×
                    $20K/mes = $160M CLP/mes = $1,920M CLP/año
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Análisis Competitivo */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-muted/90 mb-8">3. Análisis Competitivo</h2>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-muted/20 mb-6">
            <h3 className="text-xl font-bold text-muted/90 mb-6">Competidores Identificados</h3>
            <div className="space-y-6">
              {/* Competidor 1 */}
              <div className="border-l-4 border-orange pl-6 bg-orange/5 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-muted/90">Servicios Universitarios Tradicionales</h4>
                  <span className="text-xs bg-orange/20 text-orange px-3 py-1 rounded-full">
                    Competencia Indirecta
                  </span>
                </div>
                <p className="text-sm text-muted/60 mb-3">
                  Centros de Carrera, unidades de empleabilidad, orientación vocacional interna
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-xs text-muted/50">FORTALEZAS:</strong>
                    <ul className="text-sm text-muted/70 mt-1 space-y-1">
                      <li>• Acceso directo a estudiantes</li>
                      <li>• Sin costo adicional para usuarios</li>
                      <li>• Conexión con empresas locales</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-xs text-muted/50">DEBILIDADES:</strong>
                    <ul className="text-sm text-muted/70 mt-1 space-y-1">
                      <li>• Sobrecargados (1 orientador × 500+ alumnos)</li>
                      <li>• Sin tecnología avanzada</li>
                      <li>• Atención limitada, no 24/7</li>
                      <li>• No personalizado, no escalable</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Competidor 2 */}
              <div className="border-l-4 border-orange pl-6 bg-yellow/5 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-muted/90">Plataformas de Orientación Vocacional</h4>
                  <span className="text-xs bg-yellow/20 text-yellow px-3 py-1 rounded-full">
                    Competencia Directa
                  </span>
                </div>
                <p className="text-sm text-muted/60 mb-3">
                  Ej: OrientacionVocacional.cl, Ruta Vocacional INACAP, Chat Vocacional IA de AIEP
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-xs text-muted/50">FORTALEZAS:</strong>
                    <ul className="text-sm text-muted/70 mt-1 space-y-1">
                      <li>• Accesibles online</li>
                      <li>• Tests vocacionales gratuitos</li>
                      <li>• Algunas usan IA básica</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-xs text-muted/50">DEBILIDADES:</strong>
                    <ul className="text-sm text-muted/70 mt-1 space-y-1">
                      <li>• Tests estáticos, no adaptativos</li>
                      <li>• Sin coaching personalizado continuo</li>
                      <li>• No integran biblioteca de conocimiento</li>
                      <li>• Limitados a orientación inicial</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Competidor 3 */}
              <div className="border-l-4 border-blue/50 pl-6 bg-blue/5 p-4 rounded-r-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-muted/90">Plataformas EdTech LATAM</h4>
                  <span className="text-xs bg-blue/20 text-blue px-3 py-1 rounded-full">Competencia Lateral</span>
                </div>
                <p className="text-sm text-muted/60 mb-3">
                  Ej: Colegium, Lifebox, MÜUD, plataformas de upskilling como Coursera/Platzi
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong className="text-xs text-muted/50">FORTALEZAS:</strong>
                    <ul className="text-sm text-muted/70 mt-1 space-y-1">
                      <li>• Escalabilidad probada</li>
                      <li>• Financiamiento establecido</li>
                      <li>• Ecosistemas consolidados</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-xs text-muted/50">DEBILIDADES:</strong>
                    <ul className="text-sm text-muted/70 mt-1 space-y-1">
                      <li>• Enfocados en K-12 o cursos técnicos</li>
                      <li>• No especializados en empleabilidad</li>
                      <li>• Sin tests psicométricos profundos</li>
                      <li>• No integran coaching + biblioteca + tests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ventaja Competitiva de DTC */}
          <div className="bg-green rounded-2xl shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">🏆 Ventaja Competitiva de Despega Tu Carrera</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🧠</span>
                  <div>
                    <strong className="text-lg">Sistema Cerebro Único</strong>
                    <p className="text-green/5 text-sm mt-1">
                      120+ libros procesados con RAG, búsqueda semántica con pgvector. Ningún competidor integra
                      conocimiento masivo + IA conversacional.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🤖</span>
                  <div>
                    <strong className="text-lg">Coach IA Personalizado 24/7</strong>
                    <p className="text-green/5 text-sm mt-1">
                      GPT-4 integrado, respuestas basadas en perfil psicométrico del usuario. Competidores tienen
                      chatbots simples o nada.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <strong className="text-lg">6 Tests Psicométricos Profesionales</strong>
                    <p className="text-green/5 text-sm mt-1">
                      DISC, MBTI, Big Five, RIASEC, Soft Skills, Inteligencia Emocional. Competidores ofrecen 1-2 tests
                      básicos.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🔗</span>
                  <div>
                    <strong className="text-lg">Plataforma Integrada Todo-en-Uno</strong>
                    <p className="text-green/5 text-sm mt-1">
                      Tests → Biblioteca → Coach IA en un solo ecosistema. Competidores son fragmentados, usuario debe
                      usar múltiples herramientas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">🎓</span>
                  <div>
                    <strong className="text-lg">Modelo B2B + B2C Híbrido</strong>
                    <p className="text-green/5 text-sm mt-1">
                      Convenios universitarios (ingresos estables) + usuarios directos (escalabilidad). Competidores son
                      solo B2C o solo B2B.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <strong className="text-lg">Tecnología de Punta (Next.js 16, Supabase, OpenAI)</strong>
                    <p className="text-green/5 text-sm mt-1">
                      Stack moderno, escalable, serverless. Listo para 100K+ usuarios. Competidores tienen tecnología
                      legacy o limitada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tendencias del Mercado */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-muted/90 mb-8">4. Tendencias Clave del Mercado</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-muted/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🤖</span>
                <h3 className="text-xl font-bold text-muted/90">Adopción de IA en Empresas</h3>
              </div>
              <ul className="space-y-2 text-muted/70">
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    <strong>93%</strong> de empresas optimistas sobre impacto positivo de IA
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    <strong>80%</strong> de grandes empresas ya usan IA
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>Chile lidera LATAM en capacidades de IA (ILIA 2024)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange mt-1">⚠</span>
                  <span>Brecha: falta capacitación trabajadores para IA</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-blue/5 rounded-lg">
                <p className="text-sm text-muted/70">
                  <strong>Implicancia para DTC:</strong> Las empresas demandan talento que entienda IA. DTC debe
                  incorporar módulos de "AI Literacy" y preparar a usuarios para trabajos potenciados por IA.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-muted/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">📱</span>
                <h3 className="text-xl font-bold text-muted/90">Crecimiento EdTech LATAM</h3>
              </div>
              <ul className="space-y-2 text-muted/70">
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    Chile: <strong>114 startups EdTech</strong>, 3er ecosistema más grande LATAM
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    Demanda alta en <strong>upskilling, workforce skills, tutoring</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>Colegium crece 20%/año, adquiere 5 empresas desde 2020</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>Alianzas: U. Central + Coursera, UAH + Ucampus</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-green/5 rounded-lg">
                <p className="text-sm text-muted/70">
                  <strong>Implicancia para DTC:</strong> Mercado EdTech maduro y receptivo. Universidades abiertas a
                  alianzas tecnológicas. Momento ideal para lanzar.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-muted/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">🎯</span>
                <h3 className="text-xl font-bold text-muted/90">Prioridad en Soft Skills</h3>
              </div>
              <ul className="space-y-2 text-muted/70">
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    <strong>85%</strong> del éxito profesional depende de soft skills
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    <strong>92%</strong> de reclutadores priorizan soft skills sobre técnicas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange mt-1">⚠</span>
                  <span>Universidades no integran soft skills en currículum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red mt-1">✗</span>
                  <span>Brecha crítica: profesionales sin comunicación efectiva, liderazgo, adaptabilidad</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-purple/5 rounded-lg">
                <p className="text-sm text-muted/70">
                  <strong>Implicancia para DTC:</strong> Test de Soft Skills + módulos de desarrollo son diferenciador
                  clave. Posicionar DTC como "universidad de soft skills".
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-muted/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">💼</span>
                <h3 className="text-xl font-bold text-muted/90">Demanda de Upskilling</h3>
              </div>
              <ul className="space-y-2 text-muted/70">
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    Empresas priorizan <strong>desarrollo interno (27%)</strong> para cubrir escasez
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    Programas de <strong>reskilling y upskilling</strong> en alta demanda
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green mt-1">✓</span>
                  <span>
                    Profesionales buscan <strong>cultura, experiencia</strong>, no solo salario
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange mt-1">⚠</span>
                  <span>Escasez en TI/Data (21%), Ingenierías (21%), ESG (21%)</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-orange/5 rounded-lg">
                <p className="text-sm text-muted/70">
                  <strong>Implicancia para DTC:</strong> Oportunidad B2B Enterprise - vender paquetes de upskilling a
                  empresas para sus empleados (mercado adicional de miles de profesionales).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recomendaciones Estratégicas */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-muted/90 mb-8">
            5. Recomendaciones para Mejorar la Propuesta de Valor
          </h2>

          <div className="space-y-6">
            {/* Recomendación 1 */}
            <div className="bg-blue rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">🎯</span>
                <div>
                  <h3 className="text-2xl font-bold">1. Posicionamiento: "El Sistema Nervioso de tu Carrera"</h3>
                  <p className="text-blue/10 mt-1">
                    Cambiar narrativa de "plataforma de tests" a "ecosistema inteligente de carrera"
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Mensajes Clave:</h4>
                  <ul className="text-sm space-y-1 text-blue/5">
                    <li>• "Tu cerebro profesional externo que nunca duerme"</li>
                    <li>• "120+ libros de desarrollo profesional en tu bolsillo"</li>
                    <li>• "Coach IA que conoce tu perfil psicométrico completo"</li>
                    <li>• "La única plataforma que integra tests + biblioteca + coaching"</li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Audiencias Prioritarias:</h4>
                  <ul className="text-sm space-y-1 text-blue/5">
                    <li>
                      • <strong>Primaria:</strong> Universidades (UDD, PUC, U. Chile) - B2B
                    </li>
                    <li>
                      • <strong>Secundaria:</strong> Estudiantes 3er-5to año - B2C premium
                    </li>
                    <li>
                      • <strong>Terciaria:</strong> Profesionales desempleados 25-35 años
                    </li>
                    <li>
                      • <strong>Futuro:</strong> Empresas para upskilling empleados - B2B Enterprise
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recomendación 2 */}
            <div className="bg-background">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">🚀</span>
                <div>
                  <h3 className="text-2xl font-bold">2. Agregar Módulos de "AI Literacy" y Habilidades Futuras</h3>
                  <p className="text-purple/10 mt-1">
                    Responder a la demanda de preparación para trabajos potenciados por IA
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Nuevos Contenidos en Biblioteca:</h4>
                  <ul className="text-sm space-y-1 text-purple/5">
                    <li>
                      • <strong>Sección "Habilidades IA":</strong> Prompt engineering, uso ético de IA, automatización
                    </li>
                    <li>
                      • <strong>Libros sobre futuro del trabajo:</strong> Remote work, gig economy, freelancing
                    </li>
                    <li>
                      • <strong>Micro-certificaciones:</strong> "Completaste módulo AI Literacy - Certificado DTC"
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Nuevo Test: "Readiness IA"</h4>
                  <p className="text-sm text-purple/5">
                    Evaluar qué tan preparado está el usuario para trabajar con IA. Resultados: áreas donde IA puede
                    amenazar su rol vs áreas donde puede potenciarlo.
                  </p>
                </div>
              </div>
            </div>

            {/* Recomendación 3 */}
            <div className="bg-green rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">💼</span>
                <div>
                  <h3 className="text-2xl font-bold">3. Lanzar Vertical B2B Enterprise (Empresas)</h3>
                  <p className="text-green/10 mt-1">
                    Capturar mercado de upskilling corporativo - ingresos recurrentes altos
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Propuesta para Empresas:</h4>
                  <ul className="text-sm space-y-1 text-green/5">
                    <li>
                      • <strong>Licencias corporativas:</strong> $X por empleado/año
                    </li>
                    <li>
                      • <strong>Dashboard RH:</strong> Ver perfiles, brechas de habilidades del equipo
                    </li>
                    <li>
                      • <strong>Tests grupales:</strong> Identificar talento interno, armar equipos balanceados
                    </li>
                    <li>
                      • <strong>Planes de desarrollo personalizados:</strong> Coach IA para cada empleado
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Targets Primarios:</h4>
                  <ul className="text-sm space-y-1 text-green/5">
                    <li>
                      • <strong>Sectores con escasez de talento:</strong> Salud (77%), Industria (64%), Energía (63%)
                    </li>
                    <li>
                      • <strong>Empresas tech:</strong> Necesitan soft skills + upskilling constante
                    </li>
                    <li>
                      • <strong>Corporaciones grandes (500+ empleados):</strong> Presupuestos RH consolidados
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recomendación 4 */}
            <div className="bg-orange rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">📊</span>
                <div>
                  <h3 className="text-2xl font-bold">4. Profundizar Datos y Métricas de Impacto</h3>
                  <p className="text-orange/10 mt-1">
                    Construir casos de éxito medibles para validar ROI a universidades/empresas
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">KPIs a Rastrear Post-Lanzamiento:</h4>
                  <ul className="text-sm space-y-1 text-orange/5">
                    <li>
                      • <strong>Empleabilidad:</strong> % de usuarios que consiguen empleo en 3-6 meses post-uso DTC
                    </li>
                    <li>
                      • <strong>Tiempo para empleo:</strong> Reducción de días desempleado vs control
                    </li>
                    <li>
                      • <strong>Satisfacción salarial:</strong> Salario inicial vs expectativas (basado en tests)
                    </li>
                    <li>
                      • <strong>Retención laboral:</strong> % usuarios que permanecen en empleo 12+ meses
                    </li>
                    <li>
                      • <strong>Engagement:</strong> Sesiones por semana, libros leídos, mensajes al coach
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Estrategia de Validación:</h4>
                  <p className="text-sm text-orange/5 mb-2">
                    <strong>Fase 1 (Q1-Q2 2026):</strong> Pilotos con 2-3 universidades (300-500 estudiantes). Medir
                    resultados vs grupo control sin DTC.
                  </p>
                  <p className="text-sm text-orange/5">
                    <strong>Fase 2 (Q3-Q4 2026):</strong> Publicar whitepaper "Impacto DTC en Empleabilidad
                    Universitaria" con datos reales. Usar para ventas a otras universidades.
                  </p>
                </div>
              </div>
            </div>

            {/* Recomendación 5 */}
            <div className="bg-blue rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">🎓</span>
                <div>
                  <h3 className="text-2xl font-bold">5. Crear Programa de Certificación "DTC Career Specialist"</h3>
                  <p className="text-blue/10 mt-1">
                    Formar a orientadores universitarios en el uso de DTC - efecto multiplicador
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Programa de Certificación:</h4>
                  <ul className="text-sm space-y-1 text-blue/5">
                    <li>
                      • <strong>Curso online 8 horas:</strong> Cómo interpretar tests, usar coach IA, guiar estudiantes
                    </li>
                    <li>
                      • <strong>Certificación oficial DTC:</strong> Orientadores certificados como "DTC Specialists"
                    </li>
                    <li>
                      • <strong>Comunidad exclusiva:</strong> Red de orientadores para compartir casos de éxito
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Beneficios:</h4>
                  <ul className="text-sm space-y-1 text-blue/5">
                    <li>
                      • <strong>Para universidades:</strong> Orientadores capacitados, mejor servicio a estudiantes
                    </li>
                    <li>
                      • <strong>Para DTC:</strong> Evangelistas de la plataforma, casos de uso profundos
                    </li>
                    <li>
                      • <strong>Escalabilidad:</strong> 1 orientador certificado puede impactar 500+ estudiantes/año
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recomendación 6 */}
            <div className="bg-red rounded-2xl shadow-lg p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-5xl">🌎</span>
                <div>
                  <h3 className="text-2xl font-bold">
                    6. Expansión Regional LATAM (Priorizar Colombia, México, Argentina)
                  </h3>
                  <p className="text-pink-100 mt-1">
                    Mercado LATAM enfrenta problemas similares - replicar modelo chileno
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Por qué estos países:</h4>
                  <ul className="text-sm space-y-1 text-red/5">
                    <li>
                      • <strong>Colombia:</strong> 2.5M estudiantes universitarios, crisis empleabilidad similar
                    </li>
                    <li>
                      • <strong>México:</strong> 4.5M estudiantes universitarios, mayor mercado EdTech LATAM
                    </li>
                    <li>
                      • <strong>Argentina:</strong> 2.1M estudiantes, alto nivel educativo pero alta informalidad
                      laboral
                    </li>
                    <li>
                      • <strong>Ecosistema EdTech maduro:</strong> Receptivos a soluciones tecnológicas
                    </li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                  <h4 className="font-bold mb-2">Estrategia de Entrada:</h4>
                  <p className="text-sm text-red/5">
                    <strong>2027:</strong> Post-validación en Chile, lanzar en 1-2 países con alianzas estratégicas.
                    Adaptar biblioteca (agregar libros locales), ajustar pricing regional, establecer partnerships con
                    universidades top (UNAM, ITESM en México; U. de los Andes en Colombia; UBA en Argentina).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Plan de Acción Inmediato */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-muted/90 mb-8">6. Plan de Acción Inmediato (Q1 2026)</h2>

          <div className="bg-muted/90 rounded-2xl shadow-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">🎯 Prioridades de Lanzamiento</h3>
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-blue text-white px-3 py-1 rounded-full text-sm font-bold">Semana 1-4</span>
                  <h4 className="text-xl font-bold">Cerrar Primeros 3 Convenios Universitarios</h4>
                </div>
                <ul className="text-muted/20 space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-blue/40 mt-1">→</span>
                    <span>Contactar directamente a Directores de Centros de Carrera de UDD, PUC, U. Chile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue/40 mt-1">→</span>
                    <span>Ofrecer piloto gratuito 3 meses con 100-200 estudiantes por universidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue/40 mt-1">→</span>
                    <span>Compromiso: medir empleabilidad vs grupo control, publicar resultados</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-purple text-white px-3 py-1 rounded-full text-sm font-bold">Semana 5-8</span>
                  <h4 className="text-xl font-bold">Lanzamiento Beta Público B2C</h4>
                </div>
                <ul className="text-muted/20 space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-purple/40 mt-1">→</span>
                    <span>Tier Freemium: 1 test gratis + 5 consultas coach IA/mes + búsqueda biblioteca limitada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple/40 mt-1">→</span>
                    <span>
                      Tier Premium: $19,990 CLP/mes - todos los tests ilimitados + coach IA 24/7 + biblioteca completa
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple/40 mt-1">→</span>
                    <span>
                      Campaña marketing digital: Instagram/TikTok targeting estudiantes 20-25 años, LinkedIn para
                      profesionales desempleados
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-green text-white px-3 py-1 rounded-full text-sm font-bold">Semana 9-12</span>
                  <h4 className="text-xl font-bold">Agregar Módulo "AI Literacy"</h4>
                </div>
                <ul className="text-muted/20 space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green/40 mt-1">→</span>
                    <span>
                      Incorporar 10-15 libros sobre IA, futuro del trabajo, prompt engineering a la biblioteca
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green/40 mt-1">→</span>
                    <span>Crear test "AI Readiness" - 20 preguntas evaluando preparación para trabajos con IA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green/40 mt-1">→</span>
                    <span>Coach IA entrenado para dar consejos específicos sobre upskilling en habilidades IA</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-orange text-white px-3 py-1 rounded-full text-sm font-bold">Continuo</span>
                  <h4 className="text-xl font-bold">Construir Casos de Éxito y Testimonios</h4>
                </div>
                <ul className="text-muted/20 space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <span className="text-orange/40 mt-1">→</span>
                    <span>
                      Seguimiento activo a primeros 100 usuarios: encuestas mensuales, entrevistas en profundidad
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange/40 mt-1">→</span>
                    <span>Identificar 5-10 casos de éxito tempranos: "Conseguí trabajo en 2 meses usando DTC"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange/40 mt-1">→</span>
                    <span>Video-testimonios para marketing, page de landing "Historias de Éxito"</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusión */}
        <section className="mb-16">
          <div className="bg-blue rounded-2xl shadow-2xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-6">Conclusión</h2>
            <p className="text-xl text-blue/5 max-w-4xl mx-auto leading-relaxed mb-8">
              Chile enfrenta una crisis estructural de empleabilidad con <strong>8.1% de desempleo profesional</strong>y{" "}
              <strong>60% de empresas con escasez de talento</strong>. Despega Tu Carrera está posicionado de manera
              única para resolver este problema con su ecosistema integrado de tests psicométricos, biblioteca de 120+
              libros con búsqueda semántica, y coach IA 24/7 personalizado.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">$4-5B</div>
                <div className="text-blue/10">Mercado potencial combinado B2B + B2C Chile</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">1.39M</div>
                <div className="text-blue/10">Estudiantes educación superior - audiencia principal</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">Q1 2026</div>
                <div className="text-blue/10">Lanzamiento oficial - timing perfecto</div>
              </div>
            </div>
            <p className="text-lg text-blue/10 max-w-3xl mx-auto mt-8">
              Con las mejoras estratégicas propuestas (AI Literacy, vertical B2B Enterprise, certificación para
              orientadores), DTC puede capturar una porción significativa del mercado y expandirse exitosamente a LATAM
              en 2027.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-muted/50 text-sm">
          <p>Análisis de Mercado Despega Tu Carrera | Enero 2026</p>
          <p className="mt-2">
            Desarrollado por: <strong>Travis Comber</strong> (CTO & Lead Developer) | Dirigido por:{" "}
            <strong>Joaquin Covarrubias</strong> (Founder & CEO)
          </p>
        </footer>
      </div>
    </div>
  )
}
