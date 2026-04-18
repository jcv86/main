import type { Metadata } from "next"
import { InteractiveFAQ } from "@/components/interactive-faq"
import { Breadcrumbs } from "@/components/seo-optimized-content"

export const metadata: Metadata = {
  title: "Preguntas Frecuentes - Despega Tu Carrera",
  description:
    "Encuentra respuestas a las preguntas más comunes sobre tests psicométricos, biblioteca profesional, coaching con IA y más. Si no encuentras tu respuesta, pregúntale a Sofia o Dani.",
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <Breadcrumbs
          items={[
            { name: "Inicio", url: "/" },
            { name: "Preguntas Frecuentes", url: "/faq" },
          ]}
        />

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Preguntas Frecuentes</h1>
          <p className="text-xl text-muted/60 max-w-3xl mx-auto">
            Encuentra respuestas rápidas a las preguntas más comunes. Si no encuentras lo que buscas, nuestros coaches
            virtuales Sofia y Dani están disponibles 24/7 para ayudarte.
          </p>
        </div>

        <InteractiveFAQ />
      </div>
    </div>
  )
}
