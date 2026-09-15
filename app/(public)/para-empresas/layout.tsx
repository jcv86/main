import type { Metadata } from "next"
import { generateOrganizationSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema-org"

export const metadata: Metadata = {
  title: "Para Empresas | Despega Tu Carrera",
  description:
    "Conoce cómo una organización puede evaluar Despega Tu Carrera mediante un piloto acotado, con alcance, métricas y resguardos acordados antes de comenzar.",
  alternates: {
    canonical: "https://www.despegatucarrera.com/para-empresas",
  },
  openGraph: {
    title: "Para Empresas | Despega Tu Carrera",
    description:
      "Pilotos institucionales de desarrollo profesional con alcance, evidencia y responsabilidades definidas antes de escalar.",
    type: "website",
    url: "https://www.despegatucarrera.com/para-empresas",
  },
}

const enterpriseFaqs = [
  {
    question: "¿Cómo se define un piloto?",
    answer:
      "El alcance se acuerda caso a caso: objetivo, participantes, duración, soporte, resguardos y señales observables antes de comenzar.",
  },
  {
    question: "¿Qué resultados garantiza DTC?",
    answer:
      "DTC no garantiza retención, ascensos, empleo, ahorro ni retorno sobre inversión. El piloto busca observar participación, aprendizaje y utilidad antes de decidir cualquier expansión.",
  },
  {
    question: "¿Qué datos puede ver una organización?",
    answer:
      "El alcance de cualquier reporte debe definirse explícitamente. Las respuestas individuales permanecen protegidas y no se convierten automáticamente en información visible para la organización.",
  },
  {
    question: "¿Existen integraciones, white-label o precios estándar?",
    answer:
      "No se publican como capacidades o condiciones estándar. Cualquier necesidad técnica, personalización o condición comercial debe evaluarse y acordarse específicamente para el piloto.",
  },
]

export default function ParaEmpresasLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = generateOrganizationSchema()
  const faqSchema = generateFAQSchema(enterpriseFaqs)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "https://www.despegatucarrera.com" },
    { name: "Para Empresas", url: "https://www.despegatucarrera.com/para-empresas" },
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
