import { ChileanResourcesExplorer } from "@/components/chilean-resources-explorer"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Recursos Públicos Chilenos - Despega Tu Carrera",
  description:
    "Accede a 46+ recursos públicos chilenos para tu desarrollo profesional: datos laborales, educación, empleo y más.",
}

export default function RecursosPublicosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-100 to-teal-100 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-full mb-4">
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Recursos del Sector Público</p>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-teal-400">Recursos Públicos Chilenos</h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 font-medium">
              Accede a 46+ bases de datos y recursos del gobierno chileno para tu desarrollo profesional
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center border-2 border-cyan-200 dark:border-cyan-900/50 bg-white dark:bg-slate-900">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-cyan-700 dark:text-cyan-400">46+</div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">Recursos</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-teal-200 dark:border-teal-900/50 bg-white dark:bg-slate-900">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">8</div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">Categorías</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">100%</div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">Gratuitos</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-blue-200 dark:border-blue-900/50 bg-white dark:bg-slate-900">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">Oficial</div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 font-medium">Verificados</p>
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
