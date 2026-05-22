import { Suspense } from "react"
import { ExecutiveSummary } from "@/components/executive-summary"

export default function ExecutiveSummaryPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Qué-Hacer Ejecutivo</h1>
        <p className="text-muted-foreground mt-2">Resumen de 3 minutos para tomadores de decisión (Dirección & B2B)</p>
      </div>

      <Suspense fallback={<div>Cargando resumen ejecutivo...</div>}>
        <ExecutiveSummary />
      </Suspense>
    </div>
  )
}
