"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, ArrowLeft, Check } from "lucide-react"

// Step 1: Main areas (choose 3-5)
const mainAreas = [
  {
    id: "bienestar",
    label: "Bienestar emocional y salud mental",
    description: "Ansiedad, estrés, autoestima, autocuidado",
  },
  {
    id: "relaciones",
    label: "Relaciones (pareja / familia / amigos / equipos)",
    description: "Comunicación, límites, conflictos, liderazgo",
  },
  {
    id: "habitos",
    label: "Hábitos, productividad y organización",
    description: "Procrastinación, foco, rutinas, descanso",
  },
  {
    id: "proposito",
    label: "Propósito, sentido, decisiones de vida",
    description: "Vocación, valores, sentido, espiritualidad",
  },
  {
    id: "dinero",
    label: "Dinero y trabajo (finanzas personales)",
    description: "Deudas, ahorro, negociación de sueldo, relación con dinero",
  },
  {
    id: "carrera",
    label: "Carrera y empleabilidad",
    description: "Entrevistas, CV, cambio de área, jefes difíciles",
  },
  {
    id: "tecnologia",
    label: "Tecnología, IA y futuro del trabajo",
    description: "Adaptación digital, IA, nuevas habilidades",
  },
]

// Step 2: Subtopics for each area
const subtopics: Record<string, string[]> = {
  bienestar: ["Ansiedad", "Estrés", "Autoexigencia", "Autoestima", "Autocuidado", "Burnout"],
  relaciones: ["Comunicación", "Límites sanos", "Conflictos", "Liderazgo", "Familia", "Pareja"],
  habitos: ["Procrastinación", "Foco", "Rutinas", "Descanso", "Ejercicio", "Alimentación"],
  proposito: ["Vocación", "Valores", "Sentido de vida", "Decisiones importantes", "Espiritualidad"],
  dinero: ["Deudas", "Ahorro", "Inversión", "Negociación salarial", "Relación con dinero"],
  carrera: ["Entrevistas", "CV", "LinkedIn", "Cambio de área", "Networking", "Jefes difíciles"],
  tecnologia: ["Inteligencia Artificial", "Automatización", "Nuevas habilidades", "Adaptación digital"],
}

export default function OnboardingIntereses({ onComplete }: { onComplete: (preferences: any) => void }) {
  const [step, setStep] = useState(1)
  const [selectedAreas, setSelectedAreas] = useState<Set<string>>(new Set())
  const [selectedSubtopics, setSelectedSubtopics] = useState<Set<string>>(new Set())

  const progress = (step / 3) * 100

  const toggleArea = (id: string) => {
    setSelectedAreas((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSubtopic = (topic: string) => {
    setSelectedSubtopics((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) next.delete(topic)
      else next.add(topic)
      return next
    })
  }

  const handleComplete = () => {
    onComplete({
      areas: Array.from(selectedAreas),
      subtopics: Array.from(selectedSubtopics),
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle>Personaliza tu feed de noticias</CardTitle>
          <CardDescription>
            {step === 1 && "Paso 1 de 3: Elige 3-5 áreas de desarrollo que te interesan"}
            {step === 2 && "Paso 2 de 3: Selecciona subtemas específicos"}
            {step === 3 && "Paso 3 de 3: Confirma tus preferencias"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-3">
              {mainAreas.map((area) => (
                <Card
                  key={area.id}
                  className={`cursor-pointer transition-all ${`}
                    selectedAreas.has(area.id) ? "border-blue/50 bg-blue/5" : "hover:border-muted/30"`}
                  }`}
                  onClick={() => toggleArea(area.id)}
                >
                  <CardContent className="p-4 flex items-start gap-3">
                    <Checkbox checked={selectedAreas.has(area.id)} className="mt-1" />
                    <div>
                      <h4 className="font-medium">{area.label}</h4>
                      <p className="text-sm text-muted/50">{area.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {selectedAreas.size < 3 && (
                <p className="text-sm text-yellow">Selecciona al menos 3 áreas para continuar</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {Array.from(selectedAreas).map((areaId) => (
                <div key={areaId}>
                  <h4 className="font-semibold mb-3 capitalize">{areaId}</h4>
                  <div className="flex flex-wrap gap-2">
                    {subtopics[areaId]?.map((topic) => (
                      <Button
                        key={topic}
                        variant={selectedSubtopics.has(topic) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSubtopic(topic)}
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-green/5 border border-green/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green" />
                  <h4 className="font-semibold text-green">Configuración completa</h4>
                </div>
                <p className="text-sm text-green">
                  Has seleccionado {selectedAreas.size} áreas y {selectedSubtopics.size} subtemas específicos
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tus áreas de interés:</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.from(selectedAreas).map((area) => (
                    <span key={area} className="px-3 py-1 bg-blue/10 text-blue rounded-full text-sm capitalize">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted/60">
                Puedes ajustar estas preferencias en cualquier momento desde la configuración de tu feed.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Atrás
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && selectedAreas.size < 3}
                className="ml-auto"
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="ml-auto">
                Completar
                <Check className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
