import type { Metadata } from "next"
import { generateOrganizationSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema-org"

export const metadata: Metadata = {
  title: "Contacto | Despega Tu Carrera",
  description: "Contacta al equipo de Despega Tu Carrera para consultas sobre acceso, soporte, pilotos e instituciones.",
  alternates: {
    canonical: "https://www.despegatucarrera.com/contact",
  },
  openGraph: {
    title: "Contacto | Despega Tu Carrera",
    description: "Contacta al equipo de Despega Tu Carrera para consultas sobre acceso, soporte y pilotos.",
    type: "website",
    url: "https://www.despegatucarrera.com/contact",
  },
}

const contactFaqs = [
  {
    question: "¿Cuándo recibiré respuesta?",
    answer: "Revisamos las consultas recibidas y respondemos tan pronto como sea posible, según disponibilidad del equipo.",
  },
  {
    question: "¿Qué debo incluir en mi consulta?",
    answer: "Incluye tu nombre, un email de contacto, un asunto claro y el contexto necesario para entender tu solicitud.",
  },
  {
    question: "¿Puedo consultar por un piloto institucional?",
    answer: "Sí. Indica la institución, el objetivo que quieren explorar y cualquier contexto relevante para preparar una primera conversación.",
  },
  {
    question: "¿Qué canal uso para soporte?",
    answer: "Puedes usar el formulario o los datos de contacto publicados en esta página. Para problemas de acceso, incluye el correo asociado a tu cuenta sin compartir contraseñas ni códigos de verificación.",
  },
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
