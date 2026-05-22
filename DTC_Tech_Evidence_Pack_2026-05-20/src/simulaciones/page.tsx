import type { Metadata } from "next"
import EntrenamientoEntrevistasClient from "./simulaciones-client"

export const metadata: Metadata = {
  title: "Entrenamiento de Entrevistas | Practica y Mejora",
  description:
    "Entrenamiento profesional de entrevistas laborales con IA. Practica con escenarios realistas y recibe feedback detallado.",
}

export default function EntrenamientoEntrevistasPage() {
  return <EntrenamientoEntrevistasClient />
}
