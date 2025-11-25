import type { Metadata } from "next"
import SimulacionesClient from "./simulaciones-client"

export const metadata: Metadata = {
  title: "Simulaciones DTC | Practica Entrevistas y Conversaciones",
  description:
    "Practica entrevistas laborales y conversaciones difíciles con IA. Mejora tus habilidades de comunicación en un entorno seguro.",
}

export default function SimulacionesPage() {
  return <SimulacionesClient />
}
