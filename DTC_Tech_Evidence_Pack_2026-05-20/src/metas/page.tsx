import type { Metadata } from "next"
import MetasSMARTClient from "./metas-client"

export const metadata: Metadata = {
  title: "Metas SMART | Despega Tu Carrera",
  description: "Sistema de metas SMART integrado con tus resultados de tests psicométricos",
}

export default function MetasSMARTPage() {
  return <MetasSMARTClient />
}
