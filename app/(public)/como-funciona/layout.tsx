import type { Metadata } from "next"
import { generateOrganizationSchema, generateFAQSchema, generateBreadcrumbSchema, generateCourseSchema } from "@/lib/schema-org"

export const metadata: Metadata = {
  title: "Cómo Funciona | Despega Tu Carrera",
  description: "Descubre cómo funciona nuestro programa de desarrollo profesional de 90 días. 4 pilares, coaching IA personalizado, y resultados medibles.",
  openGraph: {
    title: "Cómo Funciona | Despega Tu Carrera",
    description: "Programa de desarrollo profesional de 90 días con coaching IA personalizado.",
    type: "website",
    url: "https://despegatucarrera.com/como-funciona",
  },
}

const howItWorksFaqs = [
  { question: "¿Cuánto tiempo dura el programa?", answer: "El programa completo dura 90 días, dividido en 4 pilares de desarrollo profesional." },
  { question: "¿Cuántas horas a la semana necesito dedicar?", answer: "Recomendamos entre 5 y 7 horas semanales para obtener los mejores resultados." },
  { question: "¿Necesito experiencia previa?", answer: "No necesitas experiencia previa. El programa se adapta a tu nivel actual." },
  { question: "¿Qué obtengo al finalizar?", answer: "Recibes un CV optimizado, perfil LinkedIn mejorado, y habilidades de entrevista comprobadas." },
  { question: "¿Cómo funciona el coaching con IA?", answer: "Nuestros coaches IA te guían de forma personalizada según tu perfil y objetivos." },
  { question: "¿El programa tiene costo?", answer: "Ofrecemos planes desde gratuitos hasta premium. Visita nuestra página de precios para más detalles." },
]

export default function ComoFuncionaLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = generateOrganizationSchema()
  const faqSchema = generateFAQSchema(howItWorksFaqs)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Inicio", url: "https://despegatucarrera.com" },
    { name: "Cómo Funciona", url: "https://despegatucarrera.com/como-funciona" },
  ])
  const courseSchema = generateCourseSchema({
    name: "Programa de Desarrollo Profesional DTC",
    description: "Programa de 90 días para transformar tu carrera profesional con coaching IA personalizado",
    provider: "Despega Tu Carrera",
    duration: "P90D",
    price: "0",
    currency: "CLP",
    rating: 4.8,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      {children}
    </>
  )
}
