import { AdvancedBrainInterface } from "@/components/advanced-brain-interface"

export const metadata = {
  title: "Cerebro Avanzado | DTC Platform",
  description: "Sistema inteligente de búsqueda semántica con IA",
}

export default function CerebroAvanzadoPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Cerebro Avanzado</h1>
        <p className="text-muted-foreground">
          Haz preguntas y obtén respuestas basadas en más de 120 libros de desarrollo profesional
        </p>
      </div>
      <AdvancedBrainInterface />
    </div>
  )
}
