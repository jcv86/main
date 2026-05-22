import { Suspense } from "react"
import { DocumentationViewer } from "@/components/documentation-viewer"

export const metadata = {
  title: "Documentación Completa - DTC",
  description: "Documentación técnica completa de la plataforma DespegarTuCarrera",
}

export default function DocumentacionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={<div className="flex items-center justify-center min-h-screen">Cargando documentación...</div>}
      >
        <DocumentationViewer />
      </Suspense>
    </div>
  )
}
