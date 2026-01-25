"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

// Test A1 Base - Despega Cerebral (obligatorio)
const TEST_A1_QUESTIONS = [
  {
    id: 1,
    category: "energia",
    question: "¿Cómo describes tu nivel de energía durante el día?",
    options: [
      { value: 1, label: "Muy bajo - Me siento agotado constantemente" },
      { value: 2, label: "Bajo - Tengo poca energía para actividades" },
      { value: 3, label: "Medio - Energía variable según el día" },
      { value: 4, label: "Alto - Generalmente me siento con buena energía" },
      { value: 5, label: "Muy alto - Tengo energía abundante todo el día" },
    ],
  },
  {
    id: 2,
    category: "enfoque",
    question: "¿Qué tan fácil te resulta concentrarte en una tarea?",
    options: [
      { value: 1, label: "Muy difícil - Me distraigo constantemente" },
      { value: 2, label: "Difícil - Necesito mucho esfuerzo para concentrarme" },
      { value: 3, label: "Regular - A veces logro concentrarme" },
      { value: 4, label: "Fácil - Puedo concentrarme con relativa facilidad" },
      { value: 5, label: "Muy fácil - Entro en estado de flujo con frecuencia" },
    ],
  },
  {
    id: 3,
    category: "relaciones",
    question: "¿Cómo evalúas tus habilidades de comunicación?",
    options: [
      { value: 1, label: "Muy débiles - Me cuesta expresarme" },
      { value: 2, label: "Débiles - Tengo dificultades frecuentes" },
      { value: 3, label: "Regulares - Me comunico de forma básica" },
      { value: 4, label: "Buenas - Me expreso con claridad" },
      { value: 5, label: "Excelentes - Comunico ideas complejas fácilmente" },
    ],
  },
  {
    id: 4,
    category: "plan_ejecutivo",
    question: "¿Qué tan efectivo eres ejecutando tus planes?",
    options: [
      { value: 1, label: "Nada efectivo - Raramente completo lo que planeo" },
      { value: 2, label: "Poco efectivo - Completo menos del 30%" },
      { value: 3, label: "Moderado - Completo alrededor del 50%" },
      { value: 4, label: "Efectivo - Completo más del 70%" },
      { value: 5, label: "Muy efectivo - Completo casi todo lo que planeo" },
    ],
  },
  {
    id: 5,
    category: "energia",
    question: "¿Cómo es tu calidad de sueño?",
    options: [
      { value: 1, label: "Muy mala - Duermo menos de 5 horas o mal" },
      { value: 2, label: "Mala - Sueño irregular o poco reparador" },
      { value: 3, label: "Regular - A veces duermo bien" },
      { value: 4, label: "Buena - Generalmente duermo bien" },
      { value: 5, label: "Excelente - Sueño reparador y consistente" },
    ],
  },
  {
    id: 6,
    category: "enfoque",
    question: "¿Cómo manejas las distracciones digitales?",
    options: [
      { value: 1, label: "Muy mal - Estoy pegado al celular todo el día" },
      { value: 2, label: "Mal - Me distraigo frecuentemente" },
      { value: 3, label: "Regular - A veces logro desconectarme" },
      { value: 4, label: "Bien - Controlo mi uso de tecnología" },
      { value: 5, label: "Muy bien - Uso intencional y controlado" },
    ],
  },
  {
    id: 7,
    category: "relaciones",
    question: "¿Cómo describes tu red de contactos profesionales?",
    options: [
      { value: 1, label: "Inexistente - No tengo red profesional" },
      { value: 2, label: "Muy pequeña - Menos de 10 contactos activos" },
      { value: 3, label: "Pequeña - Entre 10-30 contactos" },
      { value: 4, label: "Media - Entre 30-100 contactos" },
      { value: 5, label: "Grande - Más de 100 contactos activos" },
    ],
  },
  {
    id: 8,
    category: "plan_ejecutivo",
    question: "¿Cómo priorizas tus tareas diarias?",
    options: [
      { value: 1, label: "No priorizo - Hago lo que aparece" },
      { value: 2, label: "Raramente - Solo en emergencias" },
      { value: 3, label: "A veces - Cuando tengo tiempo" },
      { value: 4, label: "Frecuentemente - Tengo un sistema básico" },
      { value: 5, label: "Siempre - Tengo un sistema robusto de priorización" },
    ],
  },
]

type Step = "intro" | "camino" | "test" | "results"

export default function DespegaOnboarding() {
  const [step, setStep] = useState<Step>("intro")
  const [caminoPersona, setCaminoPersona] = useState(false)
  const [caminoProfesional, setCaminoProfesional] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [results, setResults] = useState<{
    energia: number
    enfoque: number
    relaciones: number
    plan_ejecutivo: number
    total: number
    nivel: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [supabase])

  const question = TEST_A1_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / TEST_A1_QUESTIONS.length) * 100

  const handleSelect = (value: number) => {
    setResponses({ ...responses, [question.id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < TEST_A1_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const calculateResults = async () => {
    setLoading(true)
    
    const scores = {
      energia: 0,
      enfoque: 0,
      relaciones: 0,
      plan_ejecutivo: 0,
    }
    
    const counts = {
      energia: 0,
      enfoque: 0,
      relaciones: 0,
      plan_ejecutivo: 0,
    }

    TEST_A1_QUESTIONS.forEach((q) => {
      const response = responses[q.id]
      if (response) {
        scores[q.category as keyof typeof scores] += response
        counts[q.category as keyof typeof counts]++
      }
    })

    // Calculate averages (scale 1-5)
    const avgScores = {
      energia: counts.energia > 0 ? scores.energia / counts.energia : 0,
      enfoque: counts.enfoque > 0 ? scores.enfoque / counts.enfoque : 0,
      relaciones: counts.relaciones > 0 ? scores.relaciones / counts.relaciones : 0,
      plan_ejecutivo: counts.plan_ejecutivo > 0 ? scores.plan_ejecutivo / counts.plan_ejecutivo : 0,
    }

    const total = (avgScores.energia + avgScores.enfoque + avgScores.relaciones + avgScores.plan_ejecutivo) / 4
    
    let nivel = "principiante"
    if (total >= 4) nivel = "avanzado"
    else if (total >= 3) nivel = "intermedio"

    const finalResults = { ...avgScores, total, nivel }
    setResults(finalResults)

    // Save to database
    if (userId) {
      try {
        // Create user profile
        await supabase.from("despega_user_profiles").upsert({
          user_id: userId,
          camino_persona_active: caminoPersona,
          camino_profesional_active: caminoProfesional,
          camino_foco: caminoPersona && caminoProfesional ? "ambos" : caminoPersona ? "persona" : "profesional",
          onboarding_completed: true,
          a1_test_completed: true,
        })

        // Save test results
        await supabase.from("despega_a1_test_results").insert({
          user_id: userId,
          score_energia: Math.round(avgScores.energia * 20),
          score_enfoque: Math.round(avgScores.enfoque * 20),
          score_relaciones: Math.round(avgScores.relaciones * 20),
          score_plan_ejecutivo: Math.round(avgScores.plan_ejecutivo * 20),
          nivel_detectado: nivel,
          respuestas_raw: responses,
        })

        // Initialize pilar progress
        const pilares = ["a1_cerebral", "a2_rutas", "aterrizaje", "base"]
        for (const pilar of pilares) {
          await supabase.from("despega_pilar_progress").upsert({
            user_id: userId,
            pilar,
            estado: { diagnostico_completado: pilar === "a1_cerebral" },
            progreso: pilar === "a1_cerebral" ? 10 : 0,
            score: 0,
            ciclo_actual: "30",
            ciclo_dia: 1,
          })
        }

        // Initialize rankings
        await supabase.from("despega_rankings").upsert({
          user_id: userId,
          score_pilar_a1: 10,
          score_pilar_a2: 0,
          score_aterrizaje: 0,
          score_base: 0,
          score_camino_persona: caminoPersona ? 5 : 0,
          score_camino_profesional: caminoProfesional ? 5 : 0,
          score_general: 10,
        })
      } catch (error) {
        console.error("Error saving onboarding data:", error)
      }
    }

    setLoading(false)
    setStep("results")
  }

  // STEP 1: Intro
  if (step === "intro") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Bienvenido a Despega</CardTitle>
            <CardDescription className="text-lg mt-2">
              Tu sistema de desarrollo integral para alcanzar tu máximo potencial personal y profesional
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Pilares de Desarrollo</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">90</div>
                <div className="text-sm text-muted-foreground">Días de Transformación</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Los 4 Pilares:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span><strong>A1 Despega Cerebral</strong> - Diagnóstico y acciones base</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span><strong>A2 Rutas</strong> - Energía, Enfoque, Relaciones, Plan Ejecutivo</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span><strong>Aterrizaje</strong> - CV, LinkedIn, Entrevistas, Negociación</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span><strong>Base</strong> - Noticias y Cultura General</span>
                </div>
              </div>
            </div>

            <Button onClick={() => setStep("camino")} className="w-full" size="lg">
              Comenzar mi Viaje
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 2: Selector de Camino
  if (step === "camino") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Elige tu Camino</CardTitle>
            <CardDescription>
              Puedes elegir uno o ambos caminos. Esto personaliza tu experiencia de desarrollo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  caminoPersona ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setCaminoPersona(!caminoPersona)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={caminoPersona} />
                  <div>
                    <h3 className="font-semibold text-lg">Camino Persona</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enfocado en tu desarrollo personal: energía, hábitos, bienestar, relaciones personales y autoconocimiento.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Energía</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Relaciones</span>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Bienestar</span>
                    </div>
                  </div>
                </div>
              </div>

              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  caminoProfesional ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setCaminoProfesional(!caminoProfesional)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox checked={caminoProfesional} />
                  <div>
                    <h3 className="font-semibold text-lg">Camino Profesional</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enfocado en tu desarrollo de carrera: enfoque, productividad, networking, plan ejecutivo y habilidades laborales.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Enfoque</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Plan Ejecutivo</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Carrera</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setStep("test")} 
              className="w-full" 
              size="lg"
              disabled={!caminoPersona && !caminoProfesional}
            >
              Continuar al Diagnóstico
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 3: Test A1 Base
  if (step === "test") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="space-y-4">
              <div>
                <CardTitle>Test A1 Base - Despega Cerebral</CardTitle>
                <CardDescription>
                  Este diagnóstico nos ayuda a entender tu punto de partida y personalizar tu ruta.
                </CardDescription>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pregunta {currentQuestion + 1} de {TEST_A1_QUESTIONS.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  question.category === "energia" ? "bg-blue-100 text-blue-800" :
                  question.category === "enfoque" ? "bg-green-100 text-green-800" :
                  question.category === "relaciones" ? "bg-orange-100 text-orange-800" :
                  "bg-purple-100 text-purple-800"
                }`}>
                  {question.category.charAt(0).toUpperCase() + question.category.slice(1).replace("_", " ")}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
              <RadioGroup 
                value={responses[question.id]?.toString() || ""} 
                onValueChange={(v) => handleSelect(parseInt(v))}
              >
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div 
                      key={option.value} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        responses[question.id] === option.value 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleSelect(option.value)}
                    >
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="cursor-pointer flex-1">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            <div className="flex gap-3">
              {currentQuestion > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="flex-1"
                >
                  Anterior
                </Button>
              )}
              <Button 
                onClick={handleNext}
                disabled={!responses[question.id]}
                className="flex-1"
              >
                {currentQuestion === TEST_A1_QUESTIONS.length - 1 ? "Ver Resultados" : "Siguiente"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // STEP 4: Results
  if (step === "results" && results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Tu Diagnóstico Inicial</CardTitle>
            <CardDescription>
              Basado en tus respuestas, hemos creado tu perfil de desarrollo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Nivel General</p>
              <p className="text-3xl font-bold capitalize mt-1">{results.nivel}</p>
              <p className="text-lg text-muted-foreground">{(results.total * 20).toFixed(0)}% de potencial actual</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-medium">Energía</span>
                </div>
                <div className="text-2xl font-bold">{(results.energia * 20).toFixed(0)}%</div>
                <Progress value={results.energia * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-medium">Enfoque</span>
                </div>
                <div className="text-2xl font-bold">{(results.enfoque * 20).toFixed(0)}%</div>
                <Progress value={results.enfoque * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="font-medium">Relaciones</span>
                </div>
                <div className="text-2xl font-bold">{(results.relaciones * 20).toFixed(0)}%</div>
                <Progress value={results.relaciones * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="font-medium">Plan Ejecutivo</span>
                </div>
                <div className="text-2xl font-bold">{(results.plan_ejecutivo * 20).toFixed(0)}%</div>
                <Progress value={results.plan_ejecutivo * 20} className="mt-2" />
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Tus Caminos Activos:</h3>
              <div className="flex gap-2">
                {caminoPersona && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Camino Persona
                  </span>
                )}
                {caminoProfesional && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                    Camino Profesional
                  </span>
                )}
              </div>
            </div>

            <Button 
              onClick={() => router.push("/despega")} 
              className="w-full" 
              size="lg"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Ir a mi Dashboard Despega"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
