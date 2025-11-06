import { Suspense } from "react"
import AutomationDashboard from "@/components/automation-dashboard"

export default function AutomationPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<div>Cargando...</div>}>
        <AutomationDashboard />
      </Suspense>
    </div>
  )
}
