import type { Metadata } from "next"
import { generateOrganizationSchema, generateFAQSchema, generateBreadcrumbSchema, generateProductSchema } from "@/lib/schema-org"

export const metadata: Metadata = {
  title: "Para Empresas | Despega Tu Carrera",
  description: "Solución de desarrollo profesional para empresas. Reduce rotación, mejora retención, y desarrolla talento con nuestra plataforma de coaching IA.",
  openGraph: {
    title: "Para Empresas | Despega Tu Carrera",
    description: "Solución B2B de desarrollo profesional con coaching IA para empresas.",
    type: "website",
    url: "https://www.despegatucarrera.com/para-empresas",
  },
}

const enterpriseFaqs = [
  { question: "¿Cómo funciona el programa piloto?", answer: "El programa piloto dura 4-8 semanas e incluye un grupo selecto de empleados para medir resultados." },
  { question: "¿Qué métricas de ROI proporcionan?", answer: "Medimos retención, engagement, tiempo de promoción, y satisfacción laboral." },
  { question: "¿Se integra con nuestros sistemas de HR?", answer: "Sí, nos integramos con ADP, SAP SuccessFactors, Workday, y otros sistemas HR." },
  { question: "¿Ofrecen white-label?", answer: "Sí, el plan Enterprise incluye opciones de personalización completa de marca." },
  { question: "¿Cuántos empleados necesitamos mínimo?", answer: "El programa Startup acepta desde 10 empleados. Enterprise es para 100+ empleados." },
  { question: "¿Tienen soporte en español?", answer: "Sí, todo nuestro soporte y contenido está disponible en español latinoamericano." },
]

export default function ParaEmpresasLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = generateOrganizationSchema()
  const faqSchema = generateFAQSchema(enterpriseFaqs)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "https://www.despegatucarrera.com" },
    { name: "Para Empresas", url: "https://www.despegatucarrera.com/para-empresas" },
  ])
  const productSchema = generateProductSchema({
    name: "DTC Enterprise - Desarrollo Profesional para Empresas",
    description: "Plataforma de coaching IA para desarrollo de talento corporativo",
    price: "2000",
    currency: "USD",
    rating: 4.9,
    ratingCount: 48,
    availability: "https://schema.org/InStock",
  })

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {children}
    </>
  )
}
