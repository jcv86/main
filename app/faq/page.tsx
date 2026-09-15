import type { Metadata } from "next"
import { InteractiveFAQ } from "@/components/interactive-faq"
import { Breadcrumbs } from "@/components/seo-optimized-content"
import { FAQ_DATA } from "@/lib/faq-data"

const SITE_URL = "https://www.despegatucarrera.com"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Despega Tu Carrera (DTC)",
  description:
    "Respuestas actuales sobre el recorrido A1–A4, la ruta de 90 días, Vera, acceso, privacidad, instituciones y los límites de Despega Tu Carrera.",
  keywords: [
    "preguntas frecuentes Despega Tu Carrera",
    "qué es DTC",
    "cómo funciona Despega Tu Carrera",
    "Vera coach IA",
    "ruta profesional 90 días",
    "desarrollo profesional Chile",
    "privacidad DTC",
  ],
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: `${SITE_URL}/faq`,
    siteName: "Despega Tu Carrera",
    title: "Preguntas Frecuentes sobre Despega Tu Carrera (DTC)",
    description:
      "Cómo funciona el recorrido A1–A4, qué hace Vera, cómo se accede y qué límites tiene la plataforma.",
  },
}

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faqpage`,
    inLanguage: "es-CL",
    name: "Preguntas Frecuentes sobre Despega Tu Carrera",
    url: `${SITE_URL}/faq`,
    isPartOf: {
      "@type": "WebSite",
      name: "Despega Tu Carrera",
      url: SITE_URL,
    },
    about: {
      "@type": "Organization",
      name: "Despega Tu Carrera",
      url: SITE_URL,
    },
    mainEntity: FAQ_DATA.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container mx-auto px-4 py-12 md:py-16 max-w-5xl">
        <Breadcrumbs
          items={[
            { name: "Inicio", url: "/" },
            { name: "Preguntas Frecuentes", url: "/faq" },
          ]}
        />

        <header className="text-center mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(80,160,170,0.4)] bg-[rgba(80,160,170,0.08)] px-4 py-1.5 text-xs font-medium text-[rgba(80,160,170,0.95)] uppercase tracking-wider mb-5">
            Centro de ayuda
          </span>
          <h1 className="text-3xl md:text-5xl font-light mb-4 text-foreground text-balance">
            Preguntas frecuentes sobre Despega Tu Carrera
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-3xl mx-auto text-pretty leading-relaxed">
            Información actual sobre el recorrido A1–A4, la ruta de 90 días, Vera, acceso, privacidad y los límites del producto.
          </p>
        </header>

        <section itemScope itemType="https://schema.org/FAQPage" aria-label="Preguntas frecuentes">
          <InteractiveFAQ />
        </section>
      </div>
    </main>
  )
}
