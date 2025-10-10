import type { Metadata } from "next"
import DISCTestClient from "./disc-client"

export const metadata: Metadata = {
  title: "Test DISC - Evaluación de Estilo de Comportamiento Profesional | TuCarrera.cl",
  description:
    "Descubre tu perfil DISC (Dominancia, Influencia, Estabilidad, Cumplimiento) con nuestro test psicométrico profesional. Conoce tu estilo de trabajo, fortalezas y áreas de desarrollo. Resultados instantáneos y gratuitos.",
  keywords: [
    "test DISC",
    "test DISC Chile",
    "evaluación DISC gratis",
    "perfil comportamiento laboral",
    "test personalidad trabajo",
    "DISC Dominancia Influencia",
    "evaluación estilo trabajo",
    "test psicométrico DISC",
  ],
  openGraph: {
    title: "Test DISC Profesional - Descubre tu Estilo de Comportamiento",
    description: "Evaluación DISC completa y gratuita. Conoce tu perfil profesional en 15 minutos.",
    type: "website",
    url: "https://tucarrera.cl/test/disc",
  },
}

export default function DISCTestPage() {
  return <DISCTestClient />
}
