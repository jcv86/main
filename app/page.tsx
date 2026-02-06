import type { Metadata } from "next"
import LandingPageOptimized from "@/components/landing-page-optimized"
import FAQSection from "@/components/seo-optimized-content"
import LLMOOptimizedFooter from "@/components/llmo-optimized-footer"
import { Suspense } from "react"

// Force cache invalidation: 2026-02-06 16:10:00Z - Remove BookOpen reference from landing page
export const metadata: Metadata = {
  title: "Despega Tu Carrera - Tests de Personalidad y Desarrollo Profesional",
  description:
    "Descubre tu verdadero potencial con tests científicos de personalidad e Inteligencia Emocional. Plataforma integral de autoconocimiento y desarrollo profesional con IA personalizada.",
  keywords: [
    "test de personalidad",
    "desarrollo profesional",
    "autoconocimiento",
    "coaching con IA",
    "soft skills",
    "orientación vocacional",
    "evaluación de competencias",
    "plan de carrera",
    "tests psicométricos",
    "inteligencia emocional",
  ],
  authors: [{ name: "Despega Tu Carrera" }],
  creator: "Despega Tu Carrera",
  publisher: "Despega Tu Carrera",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://www.despegatucarrera.com",
    siteName: "Despega Tu Carrera",
    title: "Despega Tu Carrera - Tests de Personalidad y Desarrollo Profesional",
    description:
      "Plataforma integral de autoconocimiento: Tests científicos de personalidad, orientación vocacional y coaching con IA para tu desarrollo profesional.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Despega Tu Carrera - Plataforma de Tests de Personalidad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Despega Tu Carrera - Tests de Personalidad y Desarrollo Profesional",
    description:
      "Tests científicos de personalidad e Inteligencia Emocional. Coaching con IA y desarrollo profesional personalizado.",
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
        "Despega Tu Carrera es una plataforma integral de autoconocimiento y desarrollo profesional que combina tests científicos de personalidad (Evaluación Conductual, Mapa de Preferencias, Análisis de Dimensiones, Brújula Vocacional e Inteligencia Emocional) con coaching personalizado mediante inteligencia artificial para ayudarte a descubrir tu verdadero potencial y alcanzar tus metas profesionales.",
    },
    {
      question: "¿Son confiables los tests de personalidad?",
      answer:
        "Sí, todos nuestros tests están basados en metodologías científicamente validadas y ampliamente utilizadas en psicología organizacional y desarrollo profesional. Nuestras evaluaciones cuentan con décadas de investigación respaldándolas y son utilizadas por miles de empresas y profesionales en todo el mundo.",
    },
    {
      question: "¿Cuánto tiempo toma completar los tests?",
      answer:
        "Cada test toma entre 10-20 minutos en completarse. Recomendamos tomarte el tiempo necesario para responder con honestidad y sin prisas para obtener resultados más precisos. Puedes hacer los tests en diferentes momentos según tu disponibilidad.",
    },
    {
      question: "¿Necesito tener conocimientos previos de psicología?",
      answer:
        "No, absolutamente no se requieren conocimientos previos. Todos los tests están diseñados para ser intuitivos y fáciles de entender. Los resultados se presentan de manera clara con explicaciones detalladas y ejemplos prácticos para tu vida profesional.",
    },
    {
      question: "¿Cómo funciona el coaching con IA?",
      answer:
        "Nuestros coaches virtuales Sofia y Dani utilizan inteligencia artificial avanzada para analizar tus resultados y ofrecerte orientación personalizada. Puedes hacerles preguntas sobre tus resultados, pedir consejos para situaciones específicas de tu carrera, y recibir planes de acción adaptados a tu perfil único.",
    },
    {
      question: "¿Los resultados son privados y seguros?",
      answer:
        "Sí, todos tus datos y resultados son completamente privados y seguros. Utilizamos encriptación de última generación y cumplimos con las normativas de protección de datos. Solo tú tienes acceso a tus resultados completos y puedes elegir qué compartir y con quién.",
    },
  ]

  return (
    <main className="min-h-screen">
      <LandingPageOptimized />

      <Suspense fallback={null}>
        <FAQSection faqs={faqs} />
      </Suspense>

      <Suspense fallback={null}>
        <LLMOOptimizedFooter />
      </Suspense>
    </main>
  )
}
