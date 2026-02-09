import type { Metadata } from "next"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Dynamic imports with fallbacks
const LandingPageOptimized = dynamic(() => import("@/components/landing-page-optimized"), {
  loading: () => <div className="min-h-screen bg-slate-50" />,
  ssr: true,
})

const FAQSection = dynamic(() => import("@/components/seo-optimized-content"), {
  loading: () => null,
  ssr: true,
})

const LLMOOptimizedFooter = dynamic(() => import("@/components/llmo-optimized-footer"), {
  loading: () => null,
  ssr: true,
})

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
}

export default function Home() {
  const faqs = [
    {
      question: "¿Qué es Despega Tu Carrera?",
      answer:
        "Despega Tu Carrera es una plataforma integral de autoconocimiento y desarrollo profesional que combina tests científicos de personalidad con coaching personalizado mediante inteligencia artificial.",
    },
    {
      question: "¿Son confiables los tests de personalidad?",
      answer:
        "Sí, todos nuestros tests están basados en metodologías científicamente validadas y ampliamente utilizadas en psicología organizacional y desarrollo profesional.",
    },
    {
      question: "¿Cuánto tiempo toma completar los tests?",
      answer:
        "Cada test toma entre 10-20 minutos en completarse. Recomendamos tomarte el tiempo necesario para responder con honestidad.",
    },
    {
      question: "¿Necesito tener conocimientos previos de psicología?",
      answer:
        "No, absolutamente no se requieren conocimientos previos. Todos los tests están diseñados para ser intuitivos y fáciles de entender.",
    },
    {
      question: "¿Cómo funciona el coaching con IA?",
      answer:
        "Nuestros coaches virtuales Sofia y Dani utilizan inteligencia artificial avanzada para analizar tus resultados y ofrecerte orientación personalizada.",
    },
    {
      question: "¿Los resultados son privados y seguros?",
      answer:
        "Sí, todos tus datos y resultados son completamente privados y seguros. Utilizamos encriptación de última generación.",
    },
  ]

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <LandingPageOptimized />
      </Suspense>

      <Suspense fallback={null}>
        <FAQSection faqs={faqs} />
      </Suspense>

      <Suspense fallback={null}>
        <LLMOOptimizedFooter />
      </Suspense>
    </main>
  )
}
