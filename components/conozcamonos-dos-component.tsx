"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, ChevronLeft, AlertCircle } from "lucide-react"
import { CanonRulesEngine, type C2Responses } from "@/lib/canon-rules-engine"

interface C2ComponentProps {
  c1Responses: Record<number, string>
  a1ProfileType: string
  onComplete: (responses: C2Responses, generatedRoute: any) => void
  onBack: () => void
}

const C2_QUESTIONS = [
  {
    id: 1,
    type: "select",
    question: "¿Cuántos minutos diarios puedes dedicar?",
    options: ["15", "30", "45", "60+"],
    key: "tiempo_disponible_diario_minutos"
  },
  {
    id: 2,
    type: "slider",
    question: "¿Cuál es tu nivel de energía actual para este cambio? (1=muy bajo, 10=muy alto)",
    min: 1,
    max: 10,
    key: "energia_nivel_actual"
  },
  {
    id: 3,
    type: "checkbox",
    question: "¿Cuáles son tus barreras principales? (selecciona todas las que apliquen)",
    options: ["Tiempo", "Dinero", "Confianza", "Contexto personal", "Otra"],
    key: "barreras_principales"
  },
  {
    id: 4,
    type: "select",
    question: "¿Qué formato prefieres para aprender?",
    options: ["Video", "Texto", "Audio", "Mixto"],
    key: "formato_preferido"
  },
  {
    id: 5,
    type: "select",
    question: "¿Qué tipo de soporte necesitas?",
    options: ["Autodidacta", "Grupo", "Mentor personal", "Estructura diaria"],
    key: "soporte_necesario"
  },
  {
    id: 6,
    type: "textarea",
    question: "Describe brevemente tu contexto de vida actual",
    key: "contexto_vida"
  },
  {
    id: 7,
    type: "textarea",
    question: "¿Cuál es tu métrica de éxito para estos 90 días?",
    key: "metrica_exito"
  },
  {
    id: 8,
    type: "textarea",
    question: "¿Qué esperas lograr en 30 días?",
    key: "expectativa_30_dias"
  },
  {
    id: 9,
    type: "textarea",
    question: "¿Qué esperas lograr en 90 días?",
    key: "expectativa_90_dias"
  }
]

export function ConozcamonosDosComponent({
  c1Responses,
  a1ProfileType,
  onComplete,
  onBack
}: C2ComponentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const question = C2_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / C2_QUESTIONS.length) * 100

  const handleNext = async () => {
    if (currentQuestion < C2_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setLoading(true)
      try {
        // Prepare C2 responses
        const c2Responses: C2Responses = {
          tiempo_disponible_diario_minutos: parseInt(responses.tiempo_disponible_diario_minutos || "30"),
          energia_nivel_actual: responses.energia_nivel_actual || 5,
          barreras_principales: responses.barreras_principales || [],
          formato_preferido: responses.formato_preferido?.toLowerCase() || "mixto",
          soporte_necesario: responses.soporte_necesario?.toLowerCase() || "autodidacta",
          contexto_vida: responses.contexto_vida || "",
          metrica_exito: responses.metrica_exito || "",
          expectativa_30_dias: responses.expectativa_30_dias || "",
          expectativa_60_dias: "", // Será generado
          expectativa_90_dias: responses.expectativa_90_dias || ""
        }

        // Generate route using CANON rules engine
        const generatedRoute = CanonRulesEngine.generateRoute(
          c2Responses,
          a1ProfileType,
          c1Responses
        )

        // Enrich route with OpenAI master insight
        console.log('[v0] C2: Enriqueciendo ruta con OpenAI...')
        let enrichedRoute = generatedRoute
        try {
          const enrichRes = await fetch('/api/canon/c2-openai-route-enhancement', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              c2Responses,
              generatedRoute,
              a1Profile: a1ProfileType
            })
          })

          if (enrichRes.ok) {
            const enrichData = await enrichRes.json()
            enrichedRoute = enrichData.enrichedRoute
            console.log('[v0] C2: Ruta enriquecida exitosamente')
          } else {
            console.warn('[v0] C2: No se pudo enriquecer ruta, continuando con base')
          }
        } catch (error) {
          console.warn('[v0] C2: Error enriqueciendo ruta:', error)
        }

        // Save to database
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          await supabase.from("canon_conozcamonos_2_responses").insert({
            user_id: user.id,
            responses: c2Responses,
            ruta_generada: enrichedRoute,
            completed_at: new Date()
          })
        }

        onComplete(c2Responses, enrichedRoute)
      } catch (error) {
        console.error("[v0] Error in C2 completion:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleResponseChange = (key: string, value: any) => {
    setResponses({ ...responses, [key]: value })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-muted/90 dark:text-muted/5 mb-2">
            Tu Ruta Personalizada
          </h2>
          <p className="text-lg text-muted/60 dark:text-muted/40">
            Vamos a crear una ruta 30/60/90 que se adapte a tu realidad.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-muted/60 dark:text-muted/40">
              Pregunta {currentQuestion + 1} de {C2_QUESTIONS.length}
            </span>
            <span className="text-sm font-semibold text-muted/60 dark:text-muted/40">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 border-0 shadow-lg bg-transparent">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-muted/90 dark:text-muted/5">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {question.type === "select" && (
              <div className="grid grid-cols-2 gap-3">
                {question.options?.map((opt) => (
                  <Button
                    key={opt}
                    onClick={() => handleResponseChange(question.key, opt)}
                    variant={responses[question.key] === opt ? "default" : "outline"}
                    className="h-12 text-left justify-start"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            )}

            {question.type === "slider" && (
              <div className="space-y-4 py-4">
                <Slider
                  min={question.min}
                  max={question.max}
                  step={1}
                  value={[responses[question.key] || question.min]}
                  onValueChange={(val) => handleResponseChange(question.key, val[0])}
                  className="w-full"
                />
                <div className="text-center text-3xl font-bold text-muted/90 dark:text-muted/10">
                  {responses[question.key] || question.min}
                </div>
              </div>
            )}

            {question.type === "checkbox" && (
              <div className="space-y-3">
                {question.options?.map((opt) => (
                  <div key={opt} className="flex items-center gap-3">
                    <Checkbox
                      checked={(responses[question.key] || []).includes(opt)}
                      onCheckedChange={(checked) => {
                        const current = responses[question.key] || []
                        const updated = checked
                          ? [...current, opt]
                          : current.filter((v: string) => v !== opt)
                        handleResponseChange(question.key, updated)
                      }}
                    />
                    <Label className="cursor-pointer">{opt}</Label>
                  </div>
                ))}
              </div>
            )}

            {question.type === "textarea" && (
              <textarea
                value={responses[question.key] || ""}
                onChange={(e) => handleResponseChange(question.key, e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full min-h-32 p-4 rounded-[28px] border border-muted/30 dark:border-muted/60 bg-muted/5 dark:bg-transparent text-muted/90 dark:text-muted/10 resize-none"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
            variant="outline"
            className="flex-1 h-12"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={loading}
            className="flex-1 h-12"
          >
            {currentQuestion === C2_QUESTIONS.length - 1 ? (
              <>
                Generar Ruta
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <Button onClick={onBack} variant="ghost" className="w-full mt-4">
          Volver
        </Button>
      </div>
    </div>
  )
}
