import { Suspense } from "react"
import { PromptBankDashboard } from "@/components/prompt-bank-dashboard"

export default function PromptBankPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Banco Maestro de Prompts</h1>
        <p className="text-muted-foreground">Biblioteca completa de 50+ prompts entrenables para Sofia y Dani</p>
      </div>

      <Suspense fallback={<div>Cargando banco de prompts...</div>}>
        <PromptBankDashboard />
      </Suspense>
    </div>
  )
}
