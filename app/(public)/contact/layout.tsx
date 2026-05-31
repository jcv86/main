import type { Metadata } from "next"
import { generateOrganizationSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema-org"

export const metadata: Metadata = {
  title: "Contacto | Despega Tu Carrera",
  description: "Contáctanos para resolver tus dudas sobre el programa de desarrollo profesional. Respuesta en menos de 24 horas.",
  openGraph: {
    title: "Contacto | Despega Tu Carrera",
    description: "Contáctanos para resolver tus dudas sobre el programa de desarrollo profesional.",
    type: "website",
    url: "https://www.despegatucarrera.com/contact",
  },
}

const contactFaqs = [
  { question: "¿Cuánto tiempo tarda la respuesta?", answer: "Respondemos todas las consultas dentro de 24 horas hábiles." },
  { question: "¿Qué debo incluir en mi consulta?", answer: "Incluye tu nombre, email de contacto, asunto claro y una descripción detallada." },
  { question: "¿Puedo agendar una llamada?", answer: "Por ahora atendemos consultas vía email y WhatsApp." },
  { question: "¿Para qué sirve el WhatsApp?", answer: "WhatsApp es para consultas urgentes o tiempo-sensibles." },
]

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = generateOrganizationSchema()
  const faqSchema = generateFAQSchema(contactFaqs)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "https://www.despegatucarrera.com" },
    { name: "Contacto", url: "https://www.despegatucarrera.com/contact" },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}
