"use client"

import { BrandieSenseiTestRunner } from "@/components/brandie-sensei-test-runner"

export default function BrandieTestPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🥋 Brandie Sensei Nivel 2</h1>
          <p className="text-lg text-muted-foreground">
            Test de Coherencia Cruzada del Chat Coach DTC
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Sistema de auditoría para asegurar que todas las respuestas del Chat Coach mantienen coherencia 
            en los 5 ejes (Rol, Límite, Pilar, Tono, Valor) y cumplen con la especificación DTC.
          </p>
        </div>

        <BrandieSenseiTestRunner />
      </div>
    </div>
  )
}
