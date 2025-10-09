import { Loader2, Brain } from "lucide-react"

export default function CerebroLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
      <div className="text-center space-y-4">
        <div className="relative">
          <Brain className="h-16 w-16 text-purple-600 animate-pulse mx-auto" />
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Cargando Cerebro Inteligente</h2>
          <p className="text-gray-600">Preparando el sistema de búsqueda semántica...</p>
        </div>
      </div>
    </div>
  )
}
