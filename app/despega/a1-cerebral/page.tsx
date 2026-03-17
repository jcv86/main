"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function A1CerebralPage() {
  const [stage, setStage] = useState<"intro" | "test">("intro")
  
  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Test DISC - Perfil Cerebral</h1>
          <p className="text-lg text-gray-600 mb-8">Descubre tu perfil DISC con 28 preguntas LiderDISC</p>
          <Button onClick={() => setStage("test")} size="lg">Comenzar Test</Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Test en Progreso</h2>
        <p className="text-gray-600">Próximamente: Test completo con 28 preguntas</p>
        <Button onClick={() => setStage("intro")} className="mt-8" variant="outline">Volver</Button>
      </div>
    </div>
  )
}
