import { Suspense } from "react"
import { KPIDashboard } from "@/components/kpi-dashboard"

export default function KPIDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">KPI Dashboard - Resumen Operativo</h1>
        <p className="text-muted-foreground mt-2">Monitoreo de KPIs por capítulo según documento maestro</p>
      </div>

      <Suspense fallback={<div>Cargando KPIs...</div>}>
        <KPIDashboard />
      </Suspense>
    </div>
  )
}
