import type { Metadata } from "next"
import dynamic from "next/dynamic"

const LandingPageOptimized = dynamic(() => import("@/components/landing-page-optimized"), { 
  ssr: true,
  loading: () => <div className="min-h-screen" />
})
// Removed: FAQSection component - moved to dedicated /faq page
// const FAQSection = dynamic(() => import("@/components/seo-optimized-content"), { 
//   ssr: true,
//   loading: () => <div className="min-h-screen" />
// })

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
  if (typeof window !== 'undefined') {
    console.log('[v0] Home page rendering on client')
  }
  
  return (
    <main className="min-h-screen">
      <LandingPageOptimized />
      {/* FAQ sections moved to /faq page - see dedicated FAQ page for all questions */}
    </main>
  )
}
