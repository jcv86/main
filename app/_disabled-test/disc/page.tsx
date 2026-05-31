import type { Metadata } from "next"
import DISCTestClient from "./disc-client"

export const metadata: Metadata = {
  title: "A1 Despega Cerebral - Check-in de Autoconocimiento | Despega Tu Carrera",
  description:
    "Diagnóstico rápido de tus patrones en Energía, Enfoque, Relaciones y Plan Ejecutivo. Comprende tu sistema, no tu personalidad. Resultados instantáneos en 15 minutos.",
  keywords: [
    "despega cerebral",
    "A1 autoconocimiento",
    "diagnóstico patrones",
    "energía enfoque relaciones",
    "plan ejecutivo",
    "desarrollo profesional",
    "despega tu carrera",
    "sistemas comportamiento",
  ],
  openGraph: {
    title: "A1 Despega Cerebral - Entiende tus Patrones",
    description: "Diagnóstico gratuito de tus patrones en 4 dimensiones clave para tu carrera.",
    type: "website",
    url: "https://tucarrera.cl/test/a1",
  },
}

export default function DISCTestPage() {
  return <DISCTestClient />
}
