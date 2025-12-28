import { Video, Loader2 } from "lucide-react"

export default function AdminVideoAnalysisLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <Video className="h-12 w-12 animate-pulse mx-auto text-blue-600" />
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          <p className="text-lg text-gray-600">Cargando herramienta de análisis de videos...</p>
        </div>
      </div>
    </div>
  )
}
