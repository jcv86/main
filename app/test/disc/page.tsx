import type { Metadata } from "next"
import DISCTestClient from "./disc-client"

export const metadata: Metadata = {
  title: "Despega Cerebral - Evaluación de Estilo de Comportamiento | Despega Tu Carrera",
  description:
    "Descubre tu perfil de comportamiento profesional con Despega Cerebral. Conoce tu estilo de trabajo, fortalezas y áreas de desarrollo. Resultados instantáneos basados en el modelo DISC.",
  keywords: [
    "despega cerebral",
    "test DISC Chile",
    "evaluación comportamiento",
    "perfil comportamiento laboral",
    "test personalidad trabajo",
    "desarrollo profesional",
    "evaluación estilo trabajo",
    "despega tu carrera",
  ],
  openGraph: {
    title: "Despega Cerebral - Descubre tu Estilo de Comportamiento",
    description: "Evaluación completa y gratuita de tu perfil de comportamiento profesional en 15 minutos.",
    type: "website",
    url: "https://tucarrera.cl/test/disc",
  },
}

export default function DISCTestPage() {
  return <DISCTestClient />
}
