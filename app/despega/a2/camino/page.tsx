"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { RouteRecommendation } from "@/components/a2-route-recommendation"

export default function A2CaminoPage() {
  const router = useRouter()
  const [selectedCamino, setSelectedCamino] = useState<string | null>(null)

  const handleContinue = () => {
    if (selectedCamino) {
      router.push(`/despega/a2/recomendaciones?camino=${selectedCamino}`)
    }
  }

  const handleSelectAndContinue = (route: string) => {
    setSelectedCamino(route)
    // Navigate immediately
    router.push(`/despega/a2/recomendaciones?camino=${route}`)
  }

  const caminoOptions = [
    {
      id: "persona",
      name: "Camino Persona",
      icon: "❤️",
      description: "Transforma tu ser, tus relaciones y tu bienestar",
      examples: ["Autoconocimiento", "Relaciones", "Equilibrio", "Bienestar"],
    },
    {
      id: "profesional",
      name: "Camino Profesional",
      icon: "",
      description: "Domina tu carrera, liderazgo y ejecución",
      examples: ["Carrera", "Liderazgo", "Productividad", "Estrategia"],
    },
    {
      id: "hibrido",
      name: "Camino Híbrido",
      icon: "",
      description: "Lo mejor de ambos mundos integrado",
      examples: ["Personal + Profesional", "Integración", "Momentum", "Transformación"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-muted/90 dark:text-muted/5">
            Tu Camino Personalizado
          </h1>
          <p className="text-lg text-muted-foreground dark:text-muted-foreground">
            Basado en tu perfil DISC, aquí está nuestra recomendación
          </p>
        </div>

        {/* Smart Recommendation Section */}
        <div className="space-y-4">
          <RouteRecommendation onSelectRoute={handleSelectAndContinue} />
        </div>

        {/* Manual Selection Fallback */}
        <div className="border-t pt-12">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl font-bold">¿Prefieres elegir manualmente?</h2>
            <p className="text-muted-foreground">También puedes explorar todas las opciones disponibles</p>
          </div>

          {/* Manual Selection */}
          <div className="grid md:grid-cols-3 gap-4">
          {caminoOptions.map((camino) => (
            <div
              key={camino.id}
              onClick={() => setSelectedCamino(camino.id)}
              className={`cursor-pointer transition-all ${
                selectedCamino === camino.id
                  ? "ring-2 ring-slate-900 dark:ring-slate-50"
                  : ""
              }`}
            >
              <Card
                className={`h-full hover:shadow-lg transition-shadow ${
                  selectedCamino === camino.id
                    ? "bg-muted/10 dark:bg-card"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="text-5xl mb-2">{camino.icon}</div>
                  <CardTitle>{camino.name}</CardTitle>
                  <CardDescription>{camino.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {camino.examples.map((example) => (
                      <div key={example} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-[20px] bg-muted/40"></div>
                        <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                          {example}
                        </span>
                      </div>
                    ))}
                  </div>
                  {selectedCamino === camino.id && (
                    <div className="mt-4 p-2 bg-muted/90 dark:bg-muted/10 rounded text-white dark:text-muted/90 text-sm font-medium text-center">
                      Seleccionado
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1"
          >
            Atrás
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedCamino}
            className="flex-1"
          >
            Continuar <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
