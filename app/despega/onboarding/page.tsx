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

            {/* INSIGHTS SECTION - Rich DISC-adapted insights */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
              <h3 className="text-xl font-bold">Tus Insights Personalizados</h3>
              <div className="space-y-4">
                {/* Energía Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="font-semibold text-lg">Energía ({results.energia}%)</span>
                  </div>
                  {results.energia > 70 ? (
                    <>
                      <p className="text-sm font-medium">Actúas con consistencia y equilibrio personal</p>
                      <p className="text-sm text-muted-foreground">Tu energía es sostenida, permitiendo que mantengas un rendimiento constante. Te expresas desde la calma, buscando siempre el bienestar integral.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Tu oportunidad:</strong> Comparte con otros cómo mantienes tu energía. Podrías formalizar tus hábitos en rutinas que otros puedan aprender.</p>
                    </>
                  ) : results.energia > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas mantener un equilibrio en tu energía</p>
                      <p className="text-sm text-muted-foreground">Aunque a veces fluctúa, reconoces la importancia del descanso y la actividad física. No siempre logres consistencia, pero estás en el camino.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Próximo paso:</strong> Identifica UNA sola acción sostenible (sueño, ejercicio o hidratación) y perfecciónala primero.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu energía es variable y requiere atención</p>
                      <p className="text-sm text-muted-foreground">A menudo te sientes agotado o sin consistencia en tus hábitos. Recuperar el equilibrio es clave para tu rendimiento.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Acción urgente:</strong> Crea un sistema que sostenga tu energía automáticamente. Comienza mañana con 7 horas de sueño.</p>
                    </>
                  )}
                </div>

                {/* Enfoque Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-green-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="font-semibold text-lg">Concentración & Precisión ({results.enfoque}%)</span>
                  </div>
                  {results.enfoque > 70 ? (
                    <>
                      <p className="text-sm font-medium">Actúas con orden y profundidad</p>
                      <p className="text-sm text-muted-foreground">Tu concentración es una fortaleza clave. Te apoyas en la claridad antes de actuar, evitando precipitaciones.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Tu oportunidad:</strong> Confía un poco más en tu criterio sin esperar información perfecta. Comparte tus ideas en proceso, no solo 'listas' finales.</p>
                    </>
                  ) : results.enfoque > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas concentrarte aunque las distracciones te desvían</p>
                      <p className="text-sm text-muted-foreground">Tienes momentos de enfoque profundo, pero no son constantes. Necesitas crear mejores condiciones para la concentración.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Técnica recomendada:</strong> Crea un sistema de prioridades visual. Identifica las 3 cosas MÁS importantes cada día y trabaja solo esas.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu concentración es un desafío actual</p>
                      <p className="text-sm text-muted-foreground">Las distracciones te capturan fácilmente y te cuesta sostener el enfoque en tareas importantes.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Comienza ahora:</strong> Apaga notificaciones por 90 minutos. Usa Pomodoro (25 min enfoque, 5 min descanso). Repite 4 veces.</p>
                    </>
                  )}
                </div>

                {/* Relaciones Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-orange-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="font-semibold text-lg">Conexión e Influencia ({results.relaciones}%)</span>
                  </div>
                  {results.relaciones > 70 ? (
                    <>
                      <p className="text-sm font-medium">Actúas con apertura y calidez natural</p>
                      <p className="text-sm text-muted-foreground">Tu capacidad de conectar es natural. Te expresas con empatía, buscando entender antes de ser entendido.</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2"><strong>Tu oportunidad:</strong> Establece límites saludables. No todas las conexiones requieren profundidad. Aprende a decir 'no' desde el amor.</p>
                    </>
                  ) : results.relaciones > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas conectar con otros pero a veces te sientes reservado</p>
                      <p className="text-sm text-muted-foreground">Tienes buenas relaciones, pero podrían ser más profundas. Tomas tus tiempos para abrirte.</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2"><strong>Siguiente paso:</strong> Cultiva UNA conexión genuina. Elige una persona y reúnete con ella regularmente.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu conexión con otros es limitada</p>
                      <p className="text-sm text-muted-foreground">Prefieres la soledad o tienes dificultad expresando calidez. Las relaciones son un desafío actual.</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2"><strong>Desarrollo importante:</strong> Practica escucha activa. Esta semana, haz preguntas genuinas a 3 personas y solo escucha.</p>
                    </>
                  )}
                </div>

                {/* Plan Ejecutivo Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-purple-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="font-semibold text-lg">Liderazgo y Ejecución ({results.plan_ejecutivo}%)</span>
                  </div>
                  {results.plan_ejecutivo > 70 ? (
                    <>
                      <p className="text-sm font-medium">Actúas con lógica orientada a resultados</p>
                      <p className="text-sm text-muted-foreground">Tu toma de decisiones es directa y estratégica. Ejecutas lo que planificas de forma confiable.</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2"><strong>Próximo nivel:</strong> Lidera iniciativas estratégicas. Tu visión ejecutiva fuerte es valiosa para equipos.</p>
                    </>
                  ) : results.plan_ejecutivo > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas llevar adelante tus planes</p>
                      <p className="text-sm text-muted-foreground">Aunque a veces necesitas impulso adicional. Tienes intención, pero cuesta la consistencia.</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2"><strong>Técnica:</strong> Visualiza tus objetivos a 1-3 años y trabaja hacia atrás. Divide en metas trimestrales.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu ejecución es inconsistente</p>
                      <p className="text-sm text-muted-foreground">Planificas bien, pero la implementación es un desafío. Necesitas sistemas que te sostengan.</p>
                      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2"><strong>Estructura urgente:</strong> Crea UN ritual matutino de 10 min. Revisa tus 3 prioridades. Repítelo mañana.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Overall Recommendation from knowledge base */}
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg mt-4">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📚 Tu Ruta de Desarrollo Personalizada:</p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  Basado en tu perfil y en los insights de 120+ libros de desarrollo profesional en nuestra biblioteca:
                </p>
                <div className="space-y-2 text-sm">
                  {results.nivel === "Principiante" ? (
                    <>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Libro recomendado:</strong> "Los 7 Hábitos de la Gente Altamente Efectiva" - Construye una base sólida desarrollando una dimensión a la vez.</p>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Plan de 30 días:</strong> Semana 1: Enfócate en dormir bien. Semana 2: Agrega 20 min de ejercicio. Semana 3: Una conexión genuina. Semana 4: Consolida todo.</p>
                    </>
                  ) : results.nivel === "Intermedio" ? (
                    <>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Libro recomendado:</strong> "Deep Work" de Cal Newport - Tienes buen balance. Ahora potencia tu fortaleza más débil y amplifica tus fortalezas.</p>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Tu enfoque:</strong> Identifica la dimensión con menor puntuación y dedica este mes a desarrollarla específicamente.</p>
                    </>
                  ) : results.nivel === "Avanzado" ? (
                    <>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Libro recomendado:</strong> "El Monje que vendió su Ferrari" - Eres un profesional en desarrollo continuo. Ahora enfócate en complementariedades.</p>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Tu rol:</strong> Ayuda a otros en su jornada. Considera mentoría o liderazgo transformacional.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Libro recomendado:</strong> "The Mastery Manual" - Has alcanzado maestría. Transforma tu experiencia en impacto duradero.</p>
                      <p className="text-blue-800 dark:text-blue-200"><strong>Próximo paso:</strong> Documenta tu metodología. Lidera con ejemplo. Eres un modelo para otros.</p>
                    </>
                  )}
                </div>
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
              onClick={() => router.push("/dashboard?refresh=true")} 
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
