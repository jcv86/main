import { ChileanResourcesExplorer } from "@/components/chilean-resources-explorer"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Recursos Públicos Chilenos - Despega Tu Carrera",
  description:
    "Accede a 46+ recursos públicos chilenos para tu desarrollo profesional: datos laborales, educación, empleo y más.",
}

export default function RecursosPublicosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Recursos Públicos Chilenos</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Accede a 46+ bases de datos y recursos del gobierno chileno para tu desarrollo profesional
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">46+</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Recursos</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">8</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Categorías</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">100%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gratuitos</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">Oficial</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Verificados</p>
              </CardContent>
            </Card>
          </div>

          {/* Explorer */}
          <ChileanResourcesExplorer />
        </div>
      </div>
    </main>
  )
}
