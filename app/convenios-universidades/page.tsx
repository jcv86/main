import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Propuesta de Convenios Universitarios | Despega Tu Carrera",
  description:
    "Propuesta de alianzas estratégicas entre Despega Tu Carrera y universidades chilenas para mejorar la empleabilidad estudiantil",
}

export default function UniversityPartnershipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/5 via-blue/5 to-blue/5">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue/10 text-indigo-700 rounded-full text-sm font-semibold mb-4">
            Propuesta de Alianzas Estratégicas
          </div>
          <h1 className="text-5xl font-bold text-muted/90 mb-6 text-balance">Convenios Universitarios</h1>
          <p className="text-xl text-muted/60 max-w-3xl mx-auto text-balance">
            Transformemos juntos la empleabilidad estudiantil en Chile con tecnología de vanguardia
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-muted/90 mb-6">Resumen Ejecutivo</h2>
          <div className="prose prose-lg max-w-none text-muted/70">
            <p className="text-lg leading-relaxed mb-4">
              <strong>Despega Tu Carrera (DTC)</strong> es una plataforma integral de desarrollo profesional impulsada
              por IA que complementa y potencia los servicios actuales de empleabilidad de las universidades chilenas.
            </p>
            <p className="text-lg leading-relaxed">
              Proponemos alianzas estratégicas con instituciones líderes como la{" "}
              <strong>Universidad del Desarrollo (UDD)</strong>, Universidad de Chile, PUC, y otras universidades del
              CRUCH para ofrecer a sus estudiantes herramientas científicas de autoconocimiento, coaching personalizado
              24/7 y acceso a una biblioteca especializada con 120+ libros de desarrollo profesional.
            </p>
          </div>
        </div>

        {/* El Desafío */}
        <div className="bg-gradient-to-br from-red-50 to-orange/5 rounded-2xl shadow-lg p-8 mb-8 border-2 border-red-100">
          <h2 className="text-3xl font-bold text-muted/90 mb-6">🎯 El Desafío de la Empleabilidad en Chile</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-red mb-3">Brecha de Habilidades Crítica</h3>
              <p className="text-muted/70 mb-2">
                <strong>+50%</strong> de adultos en Chile están por debajo del nivel mínimo en lectura y matemáticas
              </p>
              <p className="text-muted/60 text-sm">
                La mayoría no puede resolver problemas en entornos tecnológicos, obstaculizando empleabilidad y
                crecimiento económico.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-orange mb-3">Déficit en Habilidades Blandas</h3>
              <p className="text-muted/70 mb-2">
                Integración <strong>limitada</strong> de soft skills en planes de estudio
              </p>
              <p className="text-muted/60 text-sm">
                Pensamiento crítico, comunicación efectiva y trabajo colaborativo son esenciales pero poco desarrollados
                sistemáticamente.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow mb-3">Falta de Orientación Personalizada</h3>
              <p className="text-muted/70 mb-2">
                Recursos de <strong>orientación vocacional</strong> insuficientes
              </p>
              <p className="text-muted/60 text-sm">
                Los centros de carrera universitarios atienden miles de estudiantes con equipos reducidos, limitando el
                acompañamiento individual.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-yellow-700 mb-3">Pertinencia Curricular</h3>
              <p className="text-muted/70 mb-2">
                Desconexión entre <strong>academia y mercado laboral</strong>
              </p>
              <p className="text-muted/60 text-sm">
                Programas de estudio que no siempre reflejan las competencias demandadas por empleadores actuales.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-bold text-muted/90 mb-3">💡 La Oportunidad</h3>
            <p className="text-muted/70">
              Las universidades que inviertan en <strong>tecnología educativa (EdTech)</strong> para complementar sus
              servicios de empleabilidad tendrán una ventaja competitiva significativa en rankings de empleabilidad y
              satisfacción estudiantil.
            </p>
          </div>
        </div>

        {/* La Solución DTC */}
        <div className="bg-gradient-to-br from-blue/5 to-blue/5 rounded-2xl shadow-lg p-8 mb-8 border-2 border-blue/10">
          <h2 className="text-3xl font-bold text-muted/90 mb-6">✨ Despega Tu Carrera: La Solución Integral</h2>

          <div className="space-y-6">
            {/* Cerebro */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue/10 rounded-lg p-3 shrink-0">
                  <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-muted/90 mb-2">🧠 CEREBRO - Sistema de Conocimiento con IA</h3>
                  <ul className="space-y-2 text-muted/70">
                    <li className="flex items-start gap-2">
                      <span className="text-blue mt-1">•</span>
                      <span>
                        <strong>120+ libros especializados</strong> en desarrollo profesional, liderazgo, y
                        empleabilidad
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue mt-1">•</span>
                      <span>
                        <strong>Búsqueda semántica avanzada</strong> con pgvector y embeddings (OpenAI)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue mt-1">•</span>
                      <span>
                        <strong>~60% de cobertura RAG</strong> - respuestas basadas en contenido verificado
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue mt-1">•</span>
                      <span>Acceso instantáneo a conocimiento curado sin necesidad de leer libros completos</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tests */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue/10 rounded-lg p-3 shrink-0">
                  <svg className="w-8 h-8 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-muted/90 mb-2">📊 6 Evaluaciones Psicométricas Científicas</h3>
                  <div className="grid md:grid-cols-2 gap-3 text-muted/70">
                    <div>
                      <p className="font-semibold text-blue">Personalidad y Comportamiento:</p>
                      <ul className="space-y-1 ml-4">
                        <li>• DISC - Estilo de comunicación</li>
                        <li>• MBTI - Tipo psicológico</li>
                        <li>• Big Five - Rasgos de personalidad</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-blue">Habilidades y Vocación:</p>
                      <ul className="space-y-1 ml-4">
                        <li>• RIASEC - Intereses vocacionales</li>
                        <li>• Soft Skills - Competencias blandas</li>
                        <li>• Inteligencia Emocional</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-muted/60 mt-3 text-sm">
                    Resultados inmediatos con análisis detallados, recomendaciones personalizadas y perfiles de carreras
                    compatibles.
                  </p>
                </div>
              </div>
            </div>

            {/* Coach IA */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple/10 rounded-lg p-3 shrink-0">
                  <svg className="w-8 h-8 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-muted/90 mb-2">🤖 Coach IA Personalizado 24/7</h3>
                  <ul className="space-y-2 text-muted/70">
                    <li className="flex items-start gap-2">
                      <span className="text-purple mt-1">•</span>
                      <span>
                        <strong>GPT-4</strong> entrenado en desarrollo profesional y coaching de carrera
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple mt-1">•</span>
                      <span>
                        <strong>Contexto completo del estudiante:</strong> integra resultados de tests, historial de
                        consultas y preferencias
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple mt-1">•</span>
                      <span>
                        <strong>Disponibilidad 24/7</strong> - orientación instantánea sin citas ni esperas
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple mt-1">•</span>
                      <span>Escalable: atiende ilimitados estudiantes simultáneamente</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Propuesta de Valor para Universidades */}
        <div className="bg-gradient-to-br from-green/5 to-green/5 rounded-2xl shadow-lg p-8 mb-8 border-2 border-green-100">
          <h2 className="text-3xl font-bold text-muted/90 mb-6">🎁 Propuesta de Valor para Universidades</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-green mb-4">📈 Mejora en Rankings</h3>
              <ul className="space-y-2 text-muted/70">
                <li className="flex items-start gap-2">
                  <span className="text-green">✓</span>
                  <span>
                    <strong>Empleabilidad:</strong> Estudiantes mejor preparados para el mercado laboral
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green">✓</span>
                  <span>
                    <strong>Satisfacción estudiantil:</strong> Servicios de valor agregado diferenciadores
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green">✓</span>
                  <span>
                    <strong>Prestigio institucional:</strong> Liderazgo en innovación educativa
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">💰 Optimización de Recursos</h3>
              <ul className="space-y-2 text-muted/70">
                <li className="flex items-start gap-2">
                  <span className="text-green">✓</span>
                  <span>
                    <strong>Escalabilidad:</strong> Atención a todos los estudiantes sin aumentar personal
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green">✓</span>
                  <span>
                    <strong>Complemento al CDC:</strong> Coach IA libera tiempo para casos complejos
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green">✓</span>
                  <span>
                    <strong>Implementación rápida:</strong> Plataforma lista, sin desarrollo interno
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-teal-700 mb-4">📊 Datos y Analytics</h3>
              <ul className="space-y-2 text-muted/70">
                <li className="flex items-start gap-2">
                  <span className="text-blue">✓</span>
                  <span>
                    <strong>Dashboard institucional:</strong> Métricas de uso y engagement
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue">✓</span>
                  <span>
                    <strong>Insights agregados:</strong> Tendencias y necesidades estudiantiles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue">✓</span>
                  <span>
                    <strong>Reportes personalizables:</strong> KPIs relevantes para cada institución
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-xl font-bold text-cyan-700 mb-4">🏆 Ventaja Competitiva</h3>
              <ul className="space-y-2 text-muted/70">
                <li className="flex items-start gap-2">
                  <span className="text-blue">✓</span>
                  <span>
                    <strong>Diferenciación:</strong> Servicio único en el mercado chileno
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue">✓</span>
                  <span>
                    <strong>Atracción de talentos:</strong> Argumento de valor en admisión
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue">✓</span>
                  <span>
                    <strong>Retención:</strong> Mayor satisfacción y compromiso estudiantil
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modelos de Convenio */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-muted/90 mb-6">🤝 Modelos de Convenio Propuestos</h2>

          <div className="space-y-6">
            {/* Modelo 1 */}
            <div className="border-2 border-blue/20 rounded-xl p-6 bg-blue/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-2xl font-bold text-muted/90">Licencia Institucional Completa</h3>
              </div>
              <div className="space-y-3 ml-13">
                <p className="text-muted/70">
                  <strong>Alcance:</strong> Acceso ilimitado para todos los estudiantes de pregrado y postgrado
                </p>
                <p className="text-muted/70">
                  <strong>Incluye:</strong>
                </p>
                <ul className="ml-6 space-y-1 text-muted/60">
                  <li>• 6 tests psicométricos completos</li>
                  <li>• Coach IA 24/7 sin restricciones</li>
                  <li>• Acceso completo a Biblioteca (120+ libros)</li>
                  <li>• Dashboard administrativo para Centro de Desarrollo de Carrera</li>
                  <li>• Branding co-branded (logo universidad + DTC)</li>
                  <li>• Reportes mensuales de uso y métricas</li>
                  <li>• Capacitación para staff del CDC</li>
                </ul>
                <p className="text-muted/70">
                  <strong>Inversión:</strong> Cuota anual por número de estudiantes matriculados
                </p>
                <div className="bg-white rounded-lg p-4 mt-4">
                  <p className="text-sm text-muted/60 mb-2">
                    <strong>Ejemplo de pricing por tramos:</strong>
                  </p>
                  <ul className="text-sm text-muted/60 space-y-1">
                    <li>• 1,000 - 5,000 estudiantes: $X USD/año</li>
                    <li>• 5,001 - 10,000 estudiantes: $Y USD/año</li>
                    <li>• 10,001+ estudiantes: Cotización personalizada</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modelo 2 */}
            <div className="border-2 border-blue/20 rounded-xl p-6 bg-blue/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-2xl font-bold text-muted/90">Programa Piloto por Facultad</h3>
              </div>
              <div className="space-y-3 ml-13">
                <p className="text-muted/70">
                  <strong>Alcance:</strong> Implementación inicial en una o dos facultades estratégicas
                </p>
                <p className="text-muted/70">
                  <strong>Incluye:</strong>
                </p>
                <ul className="ml-6 space-y-1 text-muted/60">
                  <li>• Acceso completo para estudiantes de facultades seleccionadas</li>
                  <li>• Período de prueba de 6-12 meses</li>
                  <li>• Evaluación de resultados y métricas de éxito</li>
                  <li>• Opción de expansión institucional posterior</li>
                  <li>• Soporte técnico y acompañamiento constante</li>
                </ul>
                <p className="text-muted/70">
                  <strong>Ideal para:</strong> Universidades que quieren validar valor antes de despliegue masivo
                </p>
                <p className="text-muted/70">
                  <strong>Inversión:</strong> Tarifa reducida proporcional al número de estudiantes del piloto
                </p>
              </div>
            </div>

            {/* Modelo 3 */}
            <div className="border-2 border-purple/20 rounded-xl p-6 bg-purple/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-2xl font-bold text-muted/90">Alianza de Co-Desarrollo</h3>
              </div>
              <div className="space-y-3 ml-13">
                <p className="text-muted/70">
                  <strong>Alcance:</strong> Colaboración estratégica universidad-DTC
                </p>
                <p className="text-muted/70">
                  <strong>Incluye:</strong>
                </p>
                <ul className="ml-6 space-y-1 text-muted/60">
                  <li>• Acceso institucional completo</li>
                  <li>• Co-desarrollo de contenidos específicos (ej: tests personalizados por carrera)</li>
                  <li>• Investigación conjunta sobre empleabilidad y desarrollo profesional</li>
                  <li>• Publicaciones académicas co-autoradas</li>
                  <li>• Universidad como caso de estudio y referencia</li>
                  <li>• Posible participación accionaria o revenue share</li>
                </ul>
                <p className="text-muted/70">
                  <strong>Ideal para:</strong> Instituciones líderes que buscan ser pioneras e innovadoras
                </p>
                <p className="text-muted/70">
                  <strong>Inversión:</strong> Estructura personalizada según nivel de colaboración
                </p>
              </div>
            </div>

            {/* Modelo 4 */}
            <div className="border-2 border-green/20 rounded-xl p-6 bg-green/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  4
                </div>
                <h3 className="text-2xl font-bold text-muted/90">Freemium Institucional</h3>
              </div>
              <div className="space-y-3 ml-13">
                <p className="text-muted/70">
                  <strong>Alcance:</strong> Acceso básico gratuito + opciones premium
                </p>
                <p className="text-muted/70">
                  <strong>Capa Gratuita:</strong>
                </p>
                <ul className="ml-6 space-y-1 text-muted/60">
                  <li>• 2-3 tests psicométricos básicos</li>
                  <li>• Coach IA con límite de consultas mensuales</li>
                  <li>• Acceso limitado a biblioteca (selección curada)</li>
                </ul>
                <p className="text-muted/70">
                  <strong>Capa Premium (opcional para universidad):</strong>
                </p>
                <ul className="ml-6 space-y-1 text-muted/60">
                  <li>• Acceso completo ilimitado</li>
                  <li>• Dashboard administrativo</li>
                  <li>• Branding institucional</li>
                </ul>
                <p className="text-muted/70">
                  <strong>Ideal para:</strong> Universidades con presupuesto limitado que quieren ofrecer beneficio
                  básico
                </p>
                <p className="text-muted/70">
                  <strong>Inversión:</strong> Gratuito (básico) o cuota por premium
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Casos de Éxito Potenciales */}
        <div className="bg-gradient-to-br from-yellow/5 to-yellow-50 rounded-2xl shadow-lg p-8 mb-8 border-2 border-amber-100">
          <h2 className="text-3xl font-bold text-muted/90 mb-6">🌟 Casos de Uso y Beneficiarios</h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow mb-2">Universidad del Desarrollo (UDD)</h3>
              <p className="text-muted/70 mb-3">
                <strong>Situación actual:</strong> 6° lugar en ranking de empleabilidad con 85.3% para recién egresados.
                Centro de Desarrollo de Carrera con workshops, prácticas y +200 empresas colaboradoras.
              </p>
              <p className="text-muted/70">
                <strong>Oportunidad con DTC:</strong> Complementar su excelente programa presencial con herramientas
                digitales 24/7. Los estudiantes podrían usar DTC entre workshops para reforzar aprendizajes, preparar
                entrevistas y explorar carreras alineadas a su perfil psicométrico.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow mb-2">Universidad de Chile (U. de Chile)</h3>
              <p className="text-muted/70 mb-3">
                <strong>Situación actual:</strong> Líder en investigación y excelencia académica. FCFM cuenta con Unidad
                de Orientación Vocacional.
              </p>
              <p className="text-muted/70">
                <strong>Oportunidad con DTC:</strong> Alianza de co-desarrollo para investigación en empleabilidad y
                desarrollo de competencias. Potencial para crear tests especializados para carreras STEM y generar
                publicaciones académicas conjuntas.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow mb-2">Pontificia Universidad Católica (PUC)</h3>
              <p className="text-muted/70 mb-3">
                <strong>Situación actual:</strong> Top 3 en empleabilidad, programas de orientación y vinculación con
                empleadores.
              </p>
              <p className="text-muted/70">
                <strong>Oportunidad con DTC:</strong> Reforzar su posición de liderazgo siendo la primera universidad en
                ofrecer Coach IA 24/7 a sus estudiantes. Diferenciador clave en proceso de admisión y retención
                estudiantil.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h3 className="text-lg font-bold text-yellow mb-2">Universidades Regionales del CRUCH</h3>
              <p className="text-muted/70 mb-3">
                <strong>Situación actual:</strong> Recursos limitados para servicios de empleabilidad comparados con
                universidades metropolitanas.
              </p>
              <p className="text-muted/70">
                <strong>Oportunidad con DTC:</strong> Democratización del acceso a herramientas de clase mundial. Modelo
                freemium o licencias subsidiadas permitirían igualar la cancha competitiva con instituciones más
                grandes.
              </p>
            </div>
          </div>
        </div>

        {/* Implementación */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-muted/90 mb-6">🚀 Proceso de Implementación</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue/10 rounded-full w-12 h-12 flex items-center justify-center font-bold text-indigo-700 shrink-0">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-muted/90 mb-1">Reunión de Descubrimiento (Semana 1)</h3>
                <p className="text-muted/60">
                  Entendemos necesidades específicas, estructura del CDC, número de estudiantes y objetivos
                  institucionales.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue/10 rounded-full w-12 h-12 flex items-center justify-center font-bold text-blue shrink-0">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-muted/90 mb-1">Propuesta Personalizada (Semana 2)</h3>
                <p className="text-muted/60">
                  Presentamos modelo de convenio ajustado, pricing, alcance y timeline de implementación.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple/10 rounded-full w-12 h-12 flex items-center justify-center font-bold text-purple shrink-0">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-muted/90 mb-1">Configuración Técnica (Semanas 3-4)</h3>
                <p className="text-muted/60">
                  Integración con sistemas universitarios (SSO, APIs), personalización de branding, configuración de
                  dashboard administrativo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green/10 rounded-full w-12 h-12 flex items-center justify-center font-bold text-green shrink-0">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold text-muted/90 mb-1">Capacitación y Lanzamiento (Semana 5)</h3>
                <p className="text-muted/60">
                  Training para equipo del CDC, campaña de comunicación a estudiantes, lanzamiento oficial.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-100 rounded-full w-12 h-12 flex items-center justify-center font-bold text-yellow shrink-0">
                5
              </div>
              <div>
                <h3 className="text-lg font-bold text-muted/90 mb-1">Seguimiento y Optimización (Ongoing)</h3>
                <p className="text-muted/60">
                  Reportes mensuales, reuniones trimestrales de revisión, ajustes según feedback y uso real.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue/5 rounded-xl p-6 mt-8">
            <p className="text-muted/70">
              <strong>Tiempo total de implementación:</strong> 4-6 semanas desde firma de convenio hasta lanzamiento
              completo
            </p>
          </div>
        </div>

        {/* Próximos Pasos */}
        <div className="bg-gradient-to-br from-blue to-purple rounded-2xl shadow-lg p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-6">📞 Próximos Pasos</h2>

          <div className="space-y-4 mb-8">
            <p className="text-lg text-blue/10">
              Estamos listos para agendar una reunión de presentación ejecutiva con autoridades de su institución.
            </p>
            <p className="text-lg text-blue/10">Durante la reunión, profundizaremos en:</p>
            <ul className="space-y-2 text-blue/10 ml-6">
              <li>• Demo en vivo de la plataforma completa</li>
              <li>• Casos de uso específicos para su universidad</li>
              <li>• Propuesta de valor cuantificada (ROI esperado)</li>
              <li>• Opciones de convenio y pricing personalizado</li>
              <li>• Roadmap de producto y futuros desarrollos</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Contacto</h3>
            <div className="space-y-2">
              <p>
                <strong>Joaquín Covarrubias</strong> - Fundador & CEO
              </p>
              <p>
                <strong>Travis Comber</strong> - CTO & Lead Developer
              </p>
              <p className="text-blue/10 mt-4">
                Para agendar reunión o solicitar más información, contáctenos a través de la plataforma.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted/60 pt-8 border-t border-muted/20">
          <p className="mb-2">Despega Tu Carrera | Plataforma de Desarrollo Profesional impulsada por IA</p>
          <p className="text-sm">Lanzamiento previsto: Q1 2026</p>
        </div>
      </div>
    </div>
  )
}
