import { ChileanResourcesExplorer } from "@/components/chilean-resources-explorer"
import { Card, CardContent } from "@/components/ui/card"

export const metadata = {
  title: "Recursos Públicos Chilenos - Despega Tu Carrera",
  description:
    "Accede a 46+ recursos públicos chilenos para tu desarrollo profesional: datos laborales, educación, empleo y más.",
}

export default function RecursosPublicosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue/5 via-blue/5 to-muted/10 dark:from-background dark:via-muted/90 dark:to-muted/80">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue/10 to-blue/10 dark:from-blue/30 dark:to-blue/30 rounded-full mb-4">
              <p className="text-sm font-semibold text-cyan dark:text-cyan/30">Recursos del Sector Público</p>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue to-blue bg-clip-text text-transparent dark:from-blue/40 dark:to-blue/40">Recursos Públicos Chilenos</h1>
            <p className="text-xl text-muted/70 dark:text-muted/30 font-medium">
              Accede a 46+ bases de datos y recursos del gobierno chileno para tu desarrollo profesional
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center border-2 border-blue/20 dark:border-cyan/50 bg-white dark:bg-background">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-cyan dark:text-cyan/40">46+</div>
                <p className="text-sm text-muted/70 dark:text-muted/30 mt-1 font-medium">Recursos</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-blue/20 dark:border-teal-900/50 bg-white dark:bg-background">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-teal-700 dark:text-teal-400">8</div>
                <p className="text-sm text-muted/70 dark:text-muted/30 mt-1 font-medium">Categorías</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-green/20 dark:border-emerald-900/50 bg-white dark:bg-background">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">100%</div>
                <p className="text-sm text-muted/70 dark:text-muted/30 mt-1 font-medium">Gratuitos</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-blue/20 dark:border-blue/50 bg-white dark:bg-background">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue dark:text-blue/40">Oficial</div>
                <p className="text-sm text-muted/70 dark:text-muted/30 mt-1 font-medium">Verificados</p>
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
