import type { Metadata } from "next"
import OnePagerClient from "./one-pager-client"

export const metadata: Metadata = {
  title: "Resumen Ejecutivo - Despega Tu Carrera",
  description: "Resumen ejecutivo completo de la plataforma Despega Tu Carrera y propuesta de valor",
  robots: {
    index: false,
    follow: false,
  },
}

export default function OnePager() {
  return <OnePagerClient />
}
