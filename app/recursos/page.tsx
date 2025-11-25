import { Suspense } from "react"
import RecursosClient from "./recursos-client"

export const metadata = {
  title: "Biblioteca de Recursos DTC | Despega Tu Carrera",
  description: "Motor de recomendación personalizado basado en tus resultados de tests, metas y preferencias",
}

export default function RecursosPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 animate-pulse">Cargando recursos...</div>}>
      <RecursosClient />
    </Suspense>
  )
}
