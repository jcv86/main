import type { Metadata } from "next"
import { Suspense } from "react"

// Lazy load components to avoid build errors
import dynamic from "next/dynamic"

const FAQSection = dynamic(() => import("@/components/seo-optimized-content"), { 
  ssr: true,
  loading: () => <div className="min-h-screen" />
})
const LLMOOptimizedFooter = dynamic(() => import("@/components/llmo-optimized-footer"), { 
  ssr: true,
  loading: () => <div className="h-64" />
})

// Force rebuild: 2026-02-06T17:10:00Z - Clear stale BookOpen cache
export const metadata: Metadata = {
  title: "Despega Tu Carrera - Tu Siguiente Versión Empieza Aquí",
  description:
    "Tu siguiente versión te está esperando. Descubre quién eres ahora, explora quién podrías ser, y construye el puente que te llevará allá con tests científicos, coaching IA y exploración de narrativas de transformación.",
  keywords: [
    "transición de identidad",
    "transformación profesional",
    "autoconocimiento",
    "coaching con IA",
    "transición de carrera",
    "test de personalidad",
    "orientación vocacional",
    "desarrollo personal",
    "cambio de carrera",
    "siguiente versión",
  ],
  authors: [{ name: "Despega Tu Carrera" }],
  creator: "Despega Tu Carrera",
  publisher: "Despega Tu Carrera",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.despegatucarrera.com",
    siteName: "Despega Tu Carrera",
    title: "Despega Tu Carrera - Tu Siguiente Versión Empieza Aquí",
    description:
      "Tu siguiente versión te está esperando. Descubre quién eres, explora quién podrías ser, y construye tu puente de transformación con tests científicos y coaching IA.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Despega Tu Carrera - Tu Siguiente Versión Empieza Aquí",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Despega Tu Carrera - Tu Siguiente Versión Empieza Aquí",
    description:
      "Tu siguiente versión te está esperando. Descubre quién eres ahora, explora nuevas identidades, y construye tu puente con coaching IA 24/7.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://www.despegatucarrera.com",
    languages: {
      "es-ES": "https://www.despegatucarrera.com",
      "es-MX": "https://www.despegatucarrera.com/mx",
      "es-AR": "https://www.despegatucarrera.com/ar",
    },
  },
}

export default function Home() {
  const faqs = [
    {
      question: "¿Qué es Despega Tu Carrera?",
      answer:
        "Despega Tu Carrera es una plataforma de transición de identidad profesional que te ayuda a descubrir quién eres ahora, explorar quién podrías ser, y construir el puente que te llevará allá. Combinamos tests científicos, exploración de narrativas de transformación y coaching con IA personalizado para acompañarte en tu viaje consciente de cambio profesional.",
    },
    {
      question: "¿Qué significa 'estar en transición'?",
      answer:
        "Significa estar entre versiones de ti mismo. No es una crisis, es un momento de potencial donde reconoces que quién eras ya no funciona completamente, pero quién serás aún no está definido. DTC te acompaña en esta fase liminal para convertirla en una transformación consciente y diseñada.",
    },
    {
      question: "¿Cómo funciona el 'Ritual de Entrada'?",
      answer:
        "El Ritual de Entrada (Fase A1) son tests científicamente validados que te muestran quién eres realmente hoy: tu personalidad, tus valores, tus emociones, tus competencias. No juzga, simplemente establece tu punto de partida real para que conozcas desde dónde estás transitando.",
    },
    {
      question: "¿Qué aprenderé en la fase de Exploración?",
      answer:
        "En la Exploración (A2-A3) tienes acceso a 120+ libros profesionales, 100+ recursos web y búsqueda semántica con IA. Aquí exploras narrativas de transformación, descubres nuevas versiones posibles de ti, y ensayas identidades futuras sin riesgo.",
    },
    {
      question: "¿Cómo me acompaña el coach IA en mi transición?",
      answer:
        "Sofia y Dani (coaches IA) entienden tu perfil único de transición y te acompañan 24/7. No solo responden preguntas, sino que construyen contigo tu camino personalizado paso a paso: desde reconocer dónde estás, hasta definir acciones concretas para vivir tu nueva identidad profesional.",
    },
    {
      question: "¿Es seguro compartir mis datos personales?",
      answer:
        "Sí. Utilizamos encriptación de última generación y cumplimos con normativas internacionales de protección de datos. Tus resultados y el proceso de transición son completamente privados. Solo tú decides qué compartir y con quién.",
    },
  ]

  const transitionFaqs = [
    {
      question: "¿Por qué este es mi momento para transitar?",
      answer:
        "Nunca es el momento 'perfecto'. Pero cuando sientes que quien eres ya no encaja completamente con tu vida, eso es una señal. No significa abandono: significa maduración. DTC te ayuda a honrar ese llamado y convertirlo en acción consciente.",
    },
    {
      question: "¿Qué pasa si no sé exactamente qué quiero cambiar?",
      answer:
        "Perfecto. Tu no-saber es tu punto de partida. El Ritual de Entrada y la Exploración no te dirán qué hacer. Te mostrarán quién eres, desde ahí surgen las preguntas correctas, y luego descubres las respuestas. Es un viaje de descubrimiento, no de certeza.",
    },
    {
      question: "¿Cuánto tiempo toma hacer una transición real?",
      answer:
        "La transición consciente es un ciclo de 90 días donde estableces fundaciones sólidas. Pero la verdadera transformación de identidad es un proceso de años. DTC te acompaña en los primeros 90 días críticos, y luego te da herramientas para seguir adelante por tu cuenta.",
    },
    {
      question: "¿Qué es exactamente el 'Momento Espejo'?",
      answer:
        "Es ese instante donde te ves a ti mismo sin filtros. Donde reconoces tanto tus fortalezas como lo que ya no funciona. El Ritual de Entrada es tu Momento Espejo estructurado. Algunos describen la primera vez que ven sus resultados como 'finalmente alguien me ve tal como soy'.",
    },
    {
      question: "¿Puedo estar en transición y mantener mi trabajo actual?",
      answer:
        "Absolutamente. De hecho, la mayoría de transiciones ocurren mientras sigues en tu rol. DTC está diseñado para eso. El Puente de Transición es practicar, experimentar, y gradualmente ir activando tu nueva identidad sin riesgo. Solo cuando estés listo, das el paso visible.",
    },
    {
      question: "¿Qué pasa si mi transición no sale como esperaba?",
      answer:
        "Excelente pregunta. Las transiciones no son lineales. A veces descubrimos que el camino que imaginábamos no era el nuestro. DTC te acompaña en esos giros también. El aprendizaje es el verdadero valor, no el destino exacto que imaginaste.",
    },
  ]

  return (
    <main className="min-h-screen">
      <Suspense fallback={null}>
        <FAQSection faqs={faqs} />
      </Suspense>

      <Suspense fallback={null}>
        <FAQSection faqs={transitionFaqs} title="¿Por Qué Este Es Tu Momento?" />
      </Suspense>

      <Suspense fallback={null}>
        <LLMOOptimizedFooter />
      </Suspense>
    </main>
  )
}
