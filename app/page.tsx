import type { Metadata } from "next"
import { LandingPageOptimized } from "@/components/landing-page-optimized"
import { FAQSection } from "@/components/seo-optimized-content"
import { LLMOOptimizedFooter } from "@/components/llmo-optimized-footer"
import { AuthRedirect } from "@/components/auth-redirect"

export const metadata: Metadata = {
  title: "Despega Tu Carrera - Plataforma #1 de Desarrollo Profesional con IA en Chile",
  description:
    "Descubre tu potencial profesional con tests psicométricos científicos (Despega Cerebral, Mapa de Personalidad, 5 Dimensiones, Brújula Vocacional), accede a 120+ libros de desarrollo y recibe coaching personalizado con IA. Más de 10,000 profesionales confían en nosotros.",
  keywords: [
    "plataforma desarrollo profesional Chile",
    "tests psicométricos online",
    "coaching inteligencia artificial",
    "orientación vocacional Chile",
    "test personalidad profesional",
    "biblioteca desarrollo profesional",
    "evaluación competencias laborales",
    "crecimiento profesional Chile",
  ],
  openGraph: {
    title: "Despega Tu Carrera - Tu Mentor Virtual para el Éxito Profesional",
    description:
      "La plataforma más completa de Chile para desarrollo profesional. Tests científicos + 120 libros + Coach IA disponible 24/7",
    type: "website",
    locale: "es_CL",
    url: "https://despegatucarrera.cl",
    siteName: "Despega Tu Carrera",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Despega Tu Carrera - Desarrollo Profesional con IA",
      },
    ],
  },
}

const faqs = [
  {
    question: "¿Qué es Despega Tu Carrera y cómo puede ayudarme?",
    answer:
      "Despega Tu Carrera es la plataforma líder en Chile para desarrollo profesional. Combina tests psicométricos científicos (Despega Cerebral, Mapa de Personalidad, 5 Dimensiones, Brújula Vocacional, Inteligencia Emocional), una biblioteca con más de 120 libros profesionales y coaching personalizado con inteligencia artificial. Te ayudamos a descubrir tu potencial, desarrollar habilidades clave y alcanzar tus objetivos profesionales.",
  },
  {
    question: "¿Los tests psicométricos son confiables?",
    answer:
      "Sí, utilizamos tests psicométricos validados científicamente y reconocidos internacionalmente. Nuestros tests incluyen Despega Cerebral (comportamiento laboral), Mapa de Personalidad (tipos de personalidad), 5 Dimensiones (rasgos de personalidad), Brújula Vocacional (orientación vocacional) e Inteligencia Emocional. Miles de empresas y profesionales confían en estas evaluaciones para tomar decisiones informadas.",
  },
  {
    question: "¿Cómo funciona el coaching con inteligencia artificial?",
    answer:
      "Nuestro Coach IA analiza tu perfil psicométrico y te brinda recomendaciones personalizadas 24/7. Utiliza tecnología GPT-4 entrenada con conocimiento de 120+ libros profesionales y 100+ recursos especializados. Recibe consejos sobre desarrollo de carrera, habilidades blandas, liderazgo y crecimiento profesional adaptados específicamente a tu perfil y objetivos.",
  },
  {
    question: "¿Qué incluye la biblioteca profesional?",
    answer:
      "Acceso a más de 120 libros completos sobre desarrollo profesional, liderazgo, inteligencia emocional, productividad, comunicación efectiva y habilidades blandas. Incluye bestsellers como '7 Hábitos de la Gente Altamente Efectiva', 'Inteligencia Emocional', 'Hábitos Atómicos', 'Cómo Ganar Amigos' y muchos más. Además, 100+ recursos web curados del mercado chileno.",
  },
  {
    question: "¿Cuánto tiempo toma completar los tests?",
    answer:
      "Cada test toma entre 10-20 minutos. Despega Cerebral: 15 min, Mapa de Personalidad: 20 min, 5 Dimensiones: 15 min, Brújula Vocacional: 20 min, Inteligencia Emocional: 15 min, Competencias: 15 min. Puedes tomarlos en cualquier momento y desde cualquier dispositivo. Los resultados están disponibles inmediatamente después de completar cada evaluación.",
  },
  {
    question: "¿Es gratis la plataforma?",
    answer:
      "Sí, Despega Tu Carrera ofrece acceso gratuito a todos sus tests psicométricos, biblioteca completa de libros y coaching básico con IA. Estamos comprometidos con democratizar el acceso al desarrollo profesional en Chile. Planes premium con funcionalidades avanzadas estarán disponibles próximamente.",
  },
  {
    question: "¿Puedo usar Despega Tu Carrera para mi equipo o empresa?",
    answer:
      "Sí, ofrecemos soluciones para empresas que desean evaluar y desarrollar el talento de sus equipos. Contáctanos para conocer planes corporativos que incluyen evaluaciones masivas, dashboards de equipo, análisis comparativos y coaching especializado para líderes.",
  },
  {
    question: "¿Los resultados de los tests son privados?",
    answer:
      "Absolutamente. Tus resultados son completamente privados y solo tú puedes acceder a ellos. No compartimos información personal con terceros. Puedes descargar tus resultados en PDF o compartirlos voluntariamente cuando lo desees, por ejemplo, en procesos de selección o desarrollo profesional.",
  },
]

export default function Home() {
  return (
    <>
      <AuthRedirect />
      
      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Despega Tu Carrera",
            alternateName: "DTC",
            url: "https://despegatucarrera.cl",
            description: "Plataforma líder en Chile para desarrollo profesional con IA",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://despegatucarrera.cl/search?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />

      {/* Structured Data for Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Professional Development Platform",
            provider: {
              "@type": "Organization",
              name: "Despega Tu Carrera",
            },
            areaServed: {
              "@type": "Country",
              name: "Chile",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Servicios de Desarrollo Profesional",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Tests Psicométricos",
                    description:
                      "Despega Cerebral, Mapa de Personalidad, 5 Dimensiones, Brújula Vocacional, Inteligencia Emocional",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Biblioteca Profesional",
                    description: "120+ libros de desarrollo profesional",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Coaching con IA",
                    description: "Mentor virtual disponible 24/7",
                  },
                },
              ],
            },
          }),
        }}
      />

      <main itemScope itemType="https://schema.org/WebPage">
        <LandingPageOptimized />

        <section className="bg-white py-20 border-t border-gray-200">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Stats Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Lanzamiento Oficial en Q1 2026</h2>
              <p className="text-xl text-gray-600">Descubre tu potencial profesional con Despega Tu Carrera</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 mb-20">
              <div className="text-center">
                <div className="text-5xl font-bold text-purple-600 mb-2">Q1 2026</div>
                <p className="text-gray-600 font-medium">Lanzamiento Oficial</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">6</div>
                <p className="text-gray-600 font-medium">Tests Psicométricos</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-emerald-600 mb-2">120+</div>
                <p className="text-gray-600 font-medium">Libros Profesionales</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">24/7</div>
                <p className="text-gray-600 font-medium">Coach IA Disponible</p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900">
                Lo que dicen nuestros usuarios
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    "Los tests me ayudaron a entender mis fortalezas y el Coach IA me dio recomendaciones específicas
                    para mi carrera. En 3 meses logré el ascenso que buscaba."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-purple-700 font-bold text-lg">MG</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">María González</p>
                      <p className="text-sm text-gray-600">Gerente de Marketing</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 border border-blue-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    "La biblioteca es increíble. Leí 5 libros en 2 meses y apliqué las técnicas en mi trabajo. Mi
                    productividad aumentó notablemente y mi equipo lo notó."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-lg">CR</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Carlos Rojas</p>
                      <p className="text-sm text-gray-600">Ingeniero de Software</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-purple-50 rounded-2xl p-8 border border-emerald-100">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    "Como líder de equipo, los tests me ayudaron a entender mejor a mi equipo. Ahora puedo asignar
                    tareas según las fortalezas de cada persona."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 font-bold text-lg">AS</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Andrea Silva</p>
                      <p className="text-sm text-gray-600">Team Lead</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO-optimized content section with cards and better visual design */}
        <section className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
          <div className="container mx-auto px-4 py-20 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">¿Por qué elegir Despega Tu Carrera?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                La plataforma más completa de Chile para el desarrollo profesional. Combinamos ciencia, tecnología e
                inteligencia artificial para transformar tu carrera.
              </p>
            </div>

            {/* Main Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Tests Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Tests Psicométricos Científicos</h3>
                <p className="text-gray-600 mb-6">
                  6 evaluaciones validadas científicamente para descubrir tu potencial
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">Despega Cerebral</strong> - Comportamiento laboral
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">Mapa de Personalidad</strong> - 16 tipos de personalidad
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">5 Dimensiones</strong> - 5 rasgos principales
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">Brújula Vocacional</strong> - Orientación vocacional
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">Inteligencia Emocional Despega</strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">
                      <strong className="text-gray-900">Competencias Despega</strong>
                    </span>
                  </li>
                </ul>
              </div>

              {/* Library Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13M3 6.253C4.168 5.477 5.754 5 7.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Biblioteca Profesional</h3>
                <p className="text-gray-600 mb-6">120+ libros completos de desarrollo profesional</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">7 Hábitos, Hábitos Atómicos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">De Bueno a Grandioso, Drive</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Inteligencia Emocional</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Cómo Ganar Amigos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Deep Work, GTD</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Lean Startup y más</span>
                  </li>
                </ul>
              </div>

              {/* AI Coach Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Coach con IA</h3>
                <p className="text-gray-600 mb-6">Mentor virtual personalizado disponible 24/7</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Análisis de tu perfil psicométrico</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Recomendaciones personalizadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Entrenado con 120+ libros</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Consejos de desarrollo profesional</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Guía de habilidades blandas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-gray-700">Disponible cuando lo necesites</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Chile-specific section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-blue-100">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                    Optimizado para el Mercado Chileno
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Incluimos recursos específicos del mercado laboral chileno: datos del INE, información de
                    ChileValora, tendencias de LinkedIn Chile, y análisis del contexto profesional local.
                  </p>
                  <p className="text-gray-600">
                    Entendemos las particularidades del desarrollo profesional en Chile y adaptamos nuestras
                    recomendaciones al contexto nacional para maximizar tu éxito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} />

        <LLMOOptimizedFooter />
      </main>
    </>
  )
}
