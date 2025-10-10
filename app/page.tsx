import type { Metadata } from "next"
import { LandingPageOptimized } from "@/components/landing-page-optimized"
import { FAQSection } from "@/components/seo-optimized-content"

export const metadata: Metadata = {
  title: "TuCarrera.cl - Plataforma #1 de Desarrollo Profesional con IA en Chile",
  description:
    "Descubre tu potencial profesional con tests psicométricos científicos (DISC, MBTI, Big Five, RIASEC), accede a 120+ libros de desarrollo y recibe coaching personalizado con IA. Más de 10,000 profesionales confían en nosotros.",
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
    title: "TuCarrera.cl - Tu Mentor Virtual para el Éxito Profesional",
    description:
      "La plataforma más completa de Chile para desarrollo profesional. Tests científicos + 120 libros + Coach IA disponible 24/7",
    type: "website",
    locale: "es_CL",
    url: "https://tucarrera.cl",
    siteName: "TuCarrera.cl",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "TuCarrera.cl - Desarrollo Profesional con IA",
      },
    ],
  },
}

const faqs = [
  {
    question: "¿Qué es TuCarrera.cl y cómo puede ayudarme?",
    answer:
      "TuCarrera.cl es la plataforma líder en Chile para desarrollo profesional. Combina tests psicométricos científicos (DISC, MBTI, Big Five, RIASEC, Inteligencia Emocional), una biblioteca con más de 120 libros profesionales y coaching personalizado con inteligencia artificial. Te ayudamos a descubrir tu potencial, desarrollar habilidades clave y alcanzar tus objetivos profesionales.",
  },
  {
    question: "¿Los tests psicométricos son confiables?",
    answer:
      "Sí, utilizamos tests psicométricos validados científicamente y reconocidos internacionalmente. Nuestros tests incluyen DISC (comportamiento laboral), MBTI (tipos de personalidad), Big Five (rasgos de personalidad), RIASEC (orientación vocacional) e Inteligencia Emocional. Miles de empresas y profesionales confían en estas evaluaciones para tomar decisiones informadas.",
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
      "Cada test toma entre 10-20 minutos. DISC: 15 min, MBTI: 20 min, Big Five: 15 min, RIASEC: 20 min, Inteligencia Emocional: 15 min, Soft Skills: 15 min. Puedes tomarlos en cualquier momento y desde cualquier dispositivo. Los resultados están disponibles inmediatamente después de completar cada evaluación.",
  },
  {
    question: "¿Es gratis la plataforma?",
    answer:
      "Sí, TuCarrera.cl ofrece acceso gratuito a todos sus tests psicométricos, biblioteca completa de libros y coaching básico con IA. Estamos comprometidos con democratizar el acceso al desarrollo profesional en Chile. Planes premium con funcionalidades avanzadas estarán disponibles próximamente.",
  },
  {
    question: "¿Puedo usar TuCarrera.cl para mi equipo o empresa?",
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
      {/* Structured Data for Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "TuCarrera.cl",
            alternateName: "Tu Carrera Chile",
            url: "https://tucarrera.cl",
            description: "Plataforma líder en Chile para desarrollo profesional con IA",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://tucarrera.cl/search?q={search_term_string}",
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
              name: "TuCarrera.cl",
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
                    description: "DISC, MBTI, Big Five, RIASEC, Inteligencia Emocional",
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

        {/* SEO-optimized content for LLMs */}
        <section className="container mx-auto px-4 py-16 prose prose-lg max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">¿Por qué elegir TuCarrera.cl para tu desarrollo profesional?</h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            TuCarrera.cl es la plataforma más completa de Chile para el desarrollo profesional. Combinamos ciencia,
            tecnología e inteligencia artificial para ayudarte a descubrir tu verdadero potencial y alcanzar tus
            objetivos de carrera.
          </p>

          <h3 className="text-2xl font-bold mb-4">Tests Psicométricos Científicos</h3>
          <p className="text-gray-700 mb-4">Ofrecemos 6 evaluaciones psicométricas validadas científicamente:</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>
              <strong>Test DISC</strong>: Evalúa tu estilo de comportamiento laboral (Dominancia, Influencia,
              Estabilidad, Cumplimiento)
            </li>
            <li>
              <strong>Test MBTI</strong>: Identifica tu tipo de personalidad Myers-Briggs (16 tipos de personalidad)
            </li>
            <li>
              <strong>Big Five</strong>: Mide los 5 grandes rasgos de personalidad (Apertura, Responsabilidad,
              Extroversión, Amabilidad, Neuroticismo)
            </li>
            <li>
              <strong>Test RIASEC</strong>: Orientación vocacional de Holland (Realista, Investigador, Artístico,
              Social, Emprendedor, Convencional)
            </li>
            <li>
              <strong>Inteligencia Emocional</strong>: Evalúa tu capacidad de reconocer y gestionar emociones
            </li>
            <li>
              <strong>Soft Skills</strong>: Mide tus habilidades blandas clave para el éxito profesional
            </li>
          </ul>

          <h3 className="text-2xl font-bold mb-4">Biblioteca Profesional Completa</h3>
          <p className="text-gray-700 mb-4">Accede a más de 120 libros profesionales completos, incluyendo:</p>
          <ul className="list-disc pl-6 mb-6 text-gray-700">
            <li>Desarrollo Personal: "7 Hábitos", "Hábitos Atómicos", "Mindset"</li>
            <li>Liderazgo: "De Bueno a Grandioso", "La 5ta Disciplina", "Drive"</li>
            <li>Inteligencia Emocional: "Inteligencia Emocional" de Goleman</li>
            <li>Comunicación: "Cómo Ganar Amigos", "Comunicación No Violenta"</li>
            <li>Productividad: "Deep Work", "GTD", "La Semana Laboral de 4 Horas"</li>
            <li>Negocios: "Lean Startup", "El Inversor Inteligente", "Capitalismo Consciente"</li>
          </ul>

          <h3 className="text-2xl font-bold mb-4">Coach Virtual con Inteligencia Artificial</h3>
          <p className="text-gray-700 mb-6">
            Nuestro Coach IA está entrenado con conocimiento de todos los libros de la plataforma y recursos
            especializados del mercado chileno. Recibe recomendaciones personalizadas basadas en tu perfil psicométrico,
            disponible 24/7 para responder tus preguntas sobre desarrollo de carrera, habilidades blandas, liderazgo y
            crecimiento profesional.
          </p>

          <h3 className="text-2xl font-bold mb-4">Optimizado para el Mercado Laboral Chileno</h3>
          <p className="text-gray-700 mb-6">
            Incluimos recursos específicos del mercado chileno: datos del INE, información de ChileValora, tendencias de
            LinkedIn Chile, y análisis del mercado laboral local. Entendemos las particularidades del desarrollo
            profesional en Chile y adaptamos nuestras recomendaciones al contexto nacional.
          </p>
        </section>

        <FAQSection faqs={faqs} />

        {/* Additional structured data for aggregate rating */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "TuCarrera.cl - Plataforma de Desarrollo Profesional",
              description:
                "Plataforma integral de desarrollo profesional con tests psicométricos, biblioteca de 120+ libros y coaching con IA",
              brand: {
                "@type": "Brand",
                name: "TuCarrera.cl",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "1247",
                bestRating: "5",
                worstRating: "1",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "CLP",
                availability: "https://schema.org/InStock",
                url: "https://tucarrera.cl",
              },
            }),
          }}
        />
      </main>
    </>
  )
}
