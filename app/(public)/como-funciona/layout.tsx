import type { Metadata } from "next"
import { generateOrganizationSchema, generateFAQSchema, generateBreadcrumbSchema } from "@/lib/schema-org"

export const metadata: Metadata = {
  title: "Cómo Funciona | Despega Tu Carrera",
  description: "Conoce el recorrido A1–A4 de Despega Tu Carrera: autoconocimiento, ruta profesional, práctica y contexto de mercado conectados por evidencia.",
  alternates: {
    canonical: "https://www.despegatucarrera.com/como-funciona",
  },
  openGraph: {
    title: "Cómo Funciona | Despega Tu Carrera",
    description: "Un recorrido conectado de cuatro etapas para comprender tu punto de partida, organizar una ruta, practicar y decidir con más contexto.",
    type: "website",
    url: "https://www.despegatucarrera.com/como-funciona",
  },
}

const howItWorksFaqs = [
  {
    question: "¿Cuánto dura el recorrido?",
    answer: "A2 organiza una ruta profesional de 90 días. A1, A3 y A4 aportan contexto, práctica y evidencia alrededor de esa ruta, y el progreso se guarda para que puedas retomarlo.",
  },
  {
    question: "¿Cuánto tiempo necesito dedicar?",
    answer: "No necesitas completar todo de una vez. El recorrido está organizado por etapas y actividades que puedes retomar desde tu cuenta, conservando el progreso registrado.",
  },
  {
    question: "¿Necesito experiencia previa?",
    answer: "No necesitas experiencia previa para comenzar. DTC parte por comprender tu punto de partida y construye el recorrido a partir de la información y evidencia que vayas aportando.",
  },
  {
    question: "¿Qué construyo durante el recorrido?",
    answer: "Vas construyendo una lectura de tu identidad profesional, una ruta documentada, prácticas y evidencia de progreso, además de contexto para revisar tus próximas decisiones.",
  },
  {
    question: "¿Cómo funciona Vera?",
    answer: "Vera usa el contexto disponible de tu recorrido para ayudarte a pensar, distinguir evidencia de inferencias y preparar siguientes pasos. La decisión final siempre es tuya.",
  },
  {
    question: "¿Cómo accedo actualmente?",
    answer: "El acceso actual se gestiona mediante el piloto e invitaciones. Puedes iniciar sesión si ya tienes acceso o contactar al equipo para solicitarlo.",
  },
]

export default function ComoFuncionaLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = generateOrganizationSchema()
  const faqSchema = generateFAQSchema(howItWorksFaqs)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "https://www.despegatucarrera.com" },
    { name: "Cómo Funciona", url: "https://www.despegatucarrera.com/como-funciona" },
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
