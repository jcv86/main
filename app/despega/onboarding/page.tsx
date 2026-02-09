"use client"

// Version: DISC-2024-v4 - COMPLETE DISC TEST ONLY
// All 20 questions are DISC-based (Dominancia, Influencia, Estabilidad, Consciencia)
// No legacy energy/focus/relations questions

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

// Test A1 Base - Despega Cerebral DISC (obligatorio) - 20 DISC questions only
const TEST_A1_QUESTIONS = [
  // ACCIÓN - Questions 1-5
  { id: 1, category: "accion", question: "Prefiero tomar decisiones rápidas y directas sin hesitación", options: [{ value: 1, label: "Analizo primero" }, { value: 2, label: "Reflexiono un poco" }, { value: 3, label: "Normal" }, { value: 4, label: "Bastante directo" }, { value: 5, label: "Decido rápido" }] },
  { id: 2, category: "accion", question: "¿Cómo respondes ante desafíos o competencia?", options: [{ value: 1, label: "Evito conflictos" }, { value: 2, label: "Prefiero cooperar" }, { value: 3, label: "Compito moderadamente" }, { value: 4, label: "Busco ganar" }, { value: 5, label: "Debo ganar a toda costa" }] },
  { id: 3, category: "accion", question: "¿Cuánto necesitas tener control sobre las situaciones?", options: [{ value: 1, label: "Poco control" }, { value: 2, label: "Algo de control" }, { value: 3, label: "Equilibrado" }, { value: 4, label: "Bastante control" }, { value: 5, label: "Control total" }] },
  { id: 4, category: "accion", question: "¿Cuál es tu estilo de comunicación?", options: [{ value: 1, label: "Muy diplomático" }, { value: 2, label: "Considerado" }, { value: 3, label: "Directo" }, { value: 4, label: "Muy directo" }, { value: 5, label: "Brutal honestidad" }] },
  { id: 5, category: "accion", question: "¿Te gusta tomar riesgos calculados para lograr objetivos?", options: [{ value: 1, label: "Prefiero seguridad" }, { value: 2, label: "Riesgos bajos" }, { value: 3, label: "Riesgos moderados" }, { value: 4, label: "Riesgos altos" }, { value: 5, label: "Busco riesgos" }] },
  
  // INSPIRACIÓN - Questions 6-10
  { id: 6, category: "inspiracion", question: "¿Con qué frecuencia socializas o conectas con gente nueva?", options: [{ value: 1, label: "Casi nunca" }, { value: 2, label: "Raramente" }, { value: 3, label: "Ocasionalmente" }, { value: 4, label: "Frecuentemente" }, { value: 5, label: "Constantemente" }] },
  { id: 7, category: "inspiracion", question: "¿Cuán fácil te resulta persuadir o convencer a otros?", options: [{ value: 1, label: "Muy difícil" }, { value: 2, label: "Difícil" }, { value: 3, label: "Moderado" }, { value: 4, label: "Fácil" }, { value: 5, label: "Muy fácil" }] },
  { id: 8, category: "inspiracion", question: "¿Cómo describes tu entusiasmo y optimismo?", options: [{ value: 1, label: "Reservado" }, { value: 2, label: "Moderado" }, { value: 3, label: "Normal" }, { value: 4, label: "Entusiasta" }, { value: 5, label: "Extremadamente entusiasta" }] },
  { id: 9, category: "inspiracion", question: "¿Disfrutas ser el centro de atención?", options: [{ value: 1, label: "Prefiero pasar desapercibido" }, { value: 2, label: "Más bien solo" }, { value: 3, label: "Indiferente" }, { value: 4, label: "Me gusta brillar" }, { value: 5, label: "Amo la atención" }] },
  { id: 10, category: "inspiracion", question: "¿Cómo te adaptas a nuevas personas o entornos?", options: [{ value: 1, label: "Lentamente con dificultad" }, { value: 2, label: "Lentamente" }, { value: 3, label: "Moderadamente" }, { value: 4, label: "Rápidamente" }, { value: 5, label: "Instantáneamente" }] },
  
  // APOYO - Questions 11-15
  { id: 11, category: "apoyo", question: "¿Cómo prefieres tu entorno de trabajo?", options: [{ value: 1, label: "Muy dinámico" }, { value: 2, label: "Dinámico" }, { value: 3, label: "Equilibrado" }, { value: 4, label: "Estable" }, { value: 5, label: "Muy predecible" }] },
  { id: 12, category: "apoyo", question: "¿Eres paciente y tolerante con los errores de otros?", options: [{ value: 1, label: "Poco paciente" }, { value: 2, label: "Algo impaciente" }, { value: 3, label: "Moderadamente" }, { value: 4, label: "Bastante paciente" }, { value: 5, label: "Muy paciente" }] },
  { id: 13, category: "apoyo", question: "¿Cuál es tu nivel de lealtad hacia personas o equipos?", options: [{ value: 1, label: "Cambio fácilmente" }, { value: 2, label: "Moderadamente leal" }, { value: 3, label: "Leal" }, { value: 4, label: "Muy leal" }, { value: 5, label: "Extremadamente leal" }] },
  { id: 14, category: "apoyo", question: "¿Prefieres tareas de largo plazo versus cambio constante?", options: [{ value: 1, label: "Cambio constante" }, { value: 2, label: "Más cambio que estabilidad" }, { value: 3, label: "Equilibrio" }, { value: 4, label: "Más estabilidad que cambio" }, { value: 5, label: "Largo plazo" }] },
  { id: 15, category: "apoyo", question: "¿Cómo reaccionas ante cambios no esperados?", options: [{ value: 1, label: "Entro en pánico" }, { value: 2, label: "Me perturba" }, { value: 3, label: "Me adapto" }, { value: 4, label: "Casi no me afecta" }, { value: 5, label: "Lo veo como oportunidad" }] },
  
  // EXCELENCIA - Questions 16-20
  { id: 16, category: "excelencia", question: "¿Cuán importante es el análisis detallado antes de decidir?", options: [{ value: 1, label: "Decido por intuición" }, { value: 2, label: "Poco análisis" }, { value: 3, label: "Moderado" }, { value: 4, label: "Mucho análisis" }, { value: 5, label: "Necesito datos" }] },
  { id: 17, category: "excelencia", question: "¿Cuál es tu relación con los procedimientos y reglas?", options: [{ value: 1, label: "Las ignoro" }, { value: 2, label: "Las sigo si me conviene" }, { value: 3, label: "Generalmente las sigo" }, { value: 4, label: "Las sigo siempre" }, { value: 5, label: "Necesito más reglas" }] },
  { id: 18, category: "excelencia", question: "¿Qué tan importante es la perfección y calidad en tu trabajo?", options: [{ value: 1, label: "Aproximado está bien" }, { value: 2, label: "Algo importante" }, { value: 3, label: "Moderado" }, { value: 4, label: "Muy importante" }, { value: 5, label: "Debe ser perfecto" }] },
  { id: 19, category: "excelencia", question: "¿Cómo manejas los errores o inconsistencias?", options: [{ value: 1, label: "Los ignoro" }, { value: 2, label: "Los tolero" }, { value: 3, label: "Los noto" }, { value: 4, label: "Los corijo siempre" }, { value: 5, label: "Me obsesiono" }] },
  { id: 20, category: "excelencia", question: "¿Necesitas evidencia antes de aceptar información nueva?", options: [{ value: 1, label: "Confío en palabras" }, { value: 2, label: "Algo de confianza" }, { value: 3, label: "Depende" }, { value: 4, label: "Bastante evidencia" }, { value: 5, label: "Necesito evidencia" }] },
]

type Step = "intro" | "camino" | "test" | "results"

export default function DespegaOnboarding() {
  const [step, setStep] = useState<Step>("intro")
  const [caminoPersona, setCaminoPersona] = useState(false)
  const [caminoProfesional, setCaminoProfesional] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [results, setResults] = useState<{
    accion: number
    inspiracion: number
    apoyo: number
    excelencia: number
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
      accion: 0,
      inspiracion: 0,
      apoyo: 0,
      excelencia: 0,
    }
    
    const counts = {
      accion: 0,
      inspiracion: 0,
      apoyo: 0,
      excelencia: 0,
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
      accion: counts.accion > 0 ? scores.accion / counts.accion : 0,
      inspiracion: counts.inspiracion > 0 ? scores.inspiracion / counts.inspiracion : 0,
      apoyo: counts.apoyo > 0 ? scores.apoyo / counts.apoyo : 0,
      excelencia: counts.excelencia > 0 ? scores.excelencia / counts.excelencia : 0,
    }

    const total = (avgScores.accion + avgScores.inspiracion + avgScores.apoyo + avgScores.excelencia) / 4
    
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

        // Save test results with new dimension names to resultados jsonb
        await supabase.from("despega_a1_test_results").insert({
          user_id: userId,
          resultados: {
            accion: Math.round(avgScores.accion * 20),
            inspiracion: Math.round(avgScores.inspiracion * 20),
            apoyo: Math.round(avgScores.apoyo * 20),
            excelencia: Math.round(avgScores.excelencia * 20),
            nivel: nivel,
            total: total,
          },
          respuestas: responses,
          diagnostico: nivel,
          score_total: total,
          recomendaciones: {
            accion: finalResults.accion > 70 ? "Alto potencial en toma de decisiones" : "Desarrolla tu capacidad de acción",
            inspiracion: finalResults.inspiracion > 70 ? "Natural inspirador de otros" : "Cultiva tu capacidad de inspirar",
            apoyo: finalResults.apoyo > 70 ? "Fuerte lealtad y apoyo" : "Desarrolla tu consistencia",
            excelencia: finalResults.excelencia > 70 ? "Alto estándar de calidad" : "Mejora tu enfoque en precisión",
          },
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
                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                  question.category === "accion" ? "bg-red-100 text-red-800" :
                  question.category === "inspiracion" ? "bg-yellow-100 text-yellow-800" :
                  question.category === "apoyo" ? "bg-blue-100 text-blue-800" :
                  "bg-green-100 text-green-800"
                }`}>
                  {question.category === "accion" ? "🎯 Acción" :
                   question.category === "inspiracion" ? "💫 Inspiración" :
                   question.category === "apoyo" ? "🛡️ Apoyo" :
                   "🔍 Excelencia"}
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
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="font-medium">Acción</span>
                </div>
                <div className="text-2xl font-bold">{(results.accion * 20).toFixed(0)}%</div>
                <Progress value={results.accion * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="font-medium">Inspiración</span>
                </div>
                <div className="text-2xl font-bold">{(results.inspiracion * 20).toFixed(0)}%</div>
                <Progress value={results.inspiracion * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="font-medium">Apoyo</span>
                </div>
                <div className="text-2xl font-bold">{(results.apoyo * 20).toFixed(0)}%</div>
                <Progress value={results.apoyo * 20} className="mt-2" />
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="font-medium">Excelencia</span>
                </div>
                <div className="text-2xl font-bold">{(results.excelencia * 20).toFixed(0)}%</div>
                <Progress value={results.excelencia * 20} className="mt-2" />
              </div>
            </div>

            {/* INSIGHTS SECTION - Acción/Inspiración/Apoyo/Excelencia Profile */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-red-50 to-green-50 dark:from-red-950 dark:to-green-950 rounded-lg">
              <h3 className="text-xl font-bold">Tus Insights Personalizados - Tu Perfil</h3>
              <div className="space-y-4">
                {/* Acción Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-red-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎯</span>
                    <span className="font-semibold text-lg">Acción - Tu Orientación a Resultados ({(results.accion * 20).toFixed(0)}%)</span>
                  </div>
                  {results.accion > 70 ? (
                    <>
                      <p className="text-sm font-medium">Eres un tomador de decisiones directo y orientado a logros</p>
                      <p className="text-sm text-muted-foreground">Buscas resultados rápidamente, compites por el éxito y prefieres tener control sobre las situaciones. Tu comunicación es directa y sin rodeos.</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2"><strong>Oportunidad de crecimiento:</strong> Desarrolla empatía en la ejecución. No todos disfrutan el ritmo de competencia. Escucha los tiempos ajenos.</p>
                    </>
                  ) : results.accion > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas lograr resultados con balance moderado</p>
                      <p className="text-sm text-muted-foreground">Tienes iniciativa y tomas decisiones, aunque a veces balanceas entre dirección y consideración por otros. Tienes capacidad de liderazgo natural.</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2"><strong>Próximo paso:</strong> Practica tomar decisiones con el 70% de información en lugar del 100%. La velocidad estratégica vence a la perfección.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu orientación es más reflexiva que competitiva</p>
                      <p className="text-sm text-muted-foreground">Prefieres consultar antes de actuar, evitando la confrontación. Tu enfoque es colaborativo y consensual.</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2"><strong>Desarrollo importante:</strong> Practica decir "sí" a oportunidades de liderazgo. Necesitas entrenar tu capacidad de decidir con confianza.</p>
                    </>
                  )}
                </div>

                {/* Inspiración Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-yellow-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💫</span>
                    <span className="font-semibold text-lg">Inspiración - Tu Capacidad de Motivar ({(results.inspiracion * 20).toFixed(0)}%)</span>
                  </div>
                  {results.inspiracion > 70 ? (
                    <>
                      <p className="text-sm font-medium">Eres naturalmente carismático y motivador</p>
                      <p className="text-sm text-muted-foreground">Conectas fácilmente con otros, inspiras mediante tu optimismo y energía. Te expresas con pasión y contagias motivación a tu alrededor.</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2"><strong>Oportunidad:</strong> Desarrolla seguimiento en la ejecución. La inspiración sin resultados es solo aire. Aprende a cerrar ciclos.</p>
                    </>
                  ) : results.inspiracion > 50 ? (
                    <>
                      <p className="text-sm font-medium">Tienes capacidad de conexión e inspiración moderada</p>
                      <p className="text-sm text-muted-foreground">Buscas inspirar a otros, aunque a veces tu mensaje se diluye. Tienes buena capacidad de conexión pero necesitas estructura para amplificarla.</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2"><strong>Siguiente paso:</strong> Encuentra UNA alianza auténtica donde puedas ser completamente tú. De esa plataforma, expande tu influencia naturalmente.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu acercamiento es más reservado y observador</p>
                      <p className="text-sm text-muted-foreground">Prefieres observar que ser el centro. La persuasión no es tu fortaleza natural, pero eso no significa que no puedas inspirar.</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2"><strong>Desarrollo:</strong> Practica contar historias auténticas. Esta semana cuenta una historia personal genuina en una conversación.</p>
                    </>
                  )}
                </div>

                {/* Apoyo Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🛡️</span>
                    <span className="font-semibold text-lg">Apoyo - Tu Lealtad y Confiabilidad ({(results.apoyo * 20).toFixed(0)}%)</span>
                  </div>
                  {results.apoyo > 70 ? (
                    <>
                      <p className="text-sm font-medium">Eres la roca donde otros pueden confiar</p>
                      <p className="text-sm text-muted-foreground">Tu lealtad es inquebrantable, tu paciencia es legendaria. Actúas con calma y consistencia, proporcionando estabilidad a tu entorno.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Oportunidad:</strong> Tu reto es iniciarte en cambios controlados. El mundo evolucionará con o sin ti. Aprende a liderar en transiciones.</p>
                    </>
                  ) : results.apoyo > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas equilibrio entre apoyo y cambio</p>
                      <p className="text-sm text-muted-foreground">Eres confiable, aunque ocasionalmente deseas movimiento o aventura. Tu fortaleza es tu consistencia, pero necesitas variedad.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Siguiente paso:</strong> Busca cambio positivo en UNA área importante. No resistas el cambio, sino condúcelo estratégicamente.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu acercamiento es dinámico y orientado al cambio</p>
                      <p className="text-sm text-muted-foreground">Prefieres variedad sobre predictibilidad. La rutina no es tu motivación. Prosperas en ambientes ágiles y flexibles.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Desarrollo:</strong> Practica compromisos a largo plazo. Elige UNA persona o proyecto y cultívalo durante 3 meses sin cambios.</p>
                    </>
                  )}
                </div>

                {/* Excelencia Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-green-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔍</span>
                    <span className="font-semibold text-lg">Excelencia - Tu Precisión y Análisis ({(results.excelencia * 20).toFixed(0)}%)</span>
                  </div>
                  {results.excelencia > 70 ? (
                    <>
                      <p className="text-sm font-medium">Eres lógico, preciso y orientado a la calidad</p>
                      <p className="text-sm text-muted-foreground">Tu análisis es profundo, valoras los datos antes de suposiciones. Te expresas con cautela y claridad, buscando siempre lo correcto.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Oportunidad:</strong> Comparte tus ideas en proceso, no solo cuando son perfectas. Confía en tu criterio incluso sin toda la información.</p>
                    </>
                  ) : results.excelencia > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas precisión con pragmatismo moderado</p>
                      <p className="text-sm text-muted-foreground">Tienes estándares altos, aunque balanceas entre perfección y lo "suficientemente bueno". Tu análisis es cuidadoso pero flexible.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Siguiente paso:</strong> Crea UN sistema donde documentes decisiones importantes. El método te liberará de la ansiedad de olvidar detalles.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu acercamiento es más flexible e intuitivo</p>
                      <p className="text-sm text-muted-foreground">Prefieres velocidad sobre perfección. Los detalles no siempre te cautivan. Eres capaz de actuar con información incompleta.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Desarrollo:</strong> Entrena el análisis antes de la acción. Esta semana, documenta UNA decisión importante y explica tu razonamiento.</p>
                    </>
                  )}
                </div>
              </div>
                    <>
                      <p className="text-sm font-medium">Eres un tomador de decisiones directo y orientado a logros</p>
                      <p className="text-sm text-muted-foreground">Buscas resultados rápidamente, compites por el éxito y prefieres tener control sobre las situaciones. Tu comunicación es directa y sin rodeos.</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2"><strong>Oportunidad de crecimiento:</strong> Desarrolla empatía en la ejecución. No todos disfrutan el ritmo de competencia. Escucha los tiempos ajenos.</p>
                    </>
                  ) : results.dominancia > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas lograr resultados con balance moderado</p>
                      <p className="text-sm text-muted-foreground">Tienes iniciativa y tomas decisiones, aunque a veces balanceas entre dirección y consideración por otros. Tienes capacidad de liderazgo natural.</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2"><strong>Próximo paso:</strong> Practica tomar decisiones con el 70% de información en lugar del 100%. La velocidad estratégica vence a la perfección.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu orientación es más reflexiva que competitiva</p>
                      <p className="text-sm text-muted-foreground">Prefieres consultar antes de actuar, evitando la confrontación. Tu enfoque es colaborativo y consensual.</p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-2"><strong>Desarrollo importante:</strong> Practica decir "sí" a oportunidades de liderazgo. Necesitas entrenar tu capacidad de decidir con confianza.</p>
                    </>
                  )}
                </div>

                {/* Inspiración Insight - Already updated above */}
                  {results.influencia > 70 ? (
                    <>
                      <p className="text-sm font-medium">Eres naturalmente carismático y motivador</p>
                      <p className="text-sm text-muted-foreground">Conectas fácilmente con otros, inspiras mediante tu optimismo y energía. Te expresas con pasión y contagias motivación a tu alrededor.</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2"><strong>Oportunidad:</strong> Desarrolla seguimiento en la ejecución. La inspiración sin resultados es solo aire. Aprende a cerrar ciclos.</p>
                    </>
                  ) : results.influencia > 50 ? (
                    <>
                      <p className="text-sm font-medium">Tienes capacidad de conexión e influencia moderada</p>
                      <p className="text-sm text-muted-foreground">Buscas inspirar a otros, aunque a veces tu mensaje se diluye. Tienes buena capacidad de conexión pero necesitas estructura para amplificarla.</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2"><strong>Siguiente paso:</strong> Encuentra UNA alianza auténtica donde puedas ser completamente tú. De esa plataforma, expande tu influencia naturalmente.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu acercamiento es más reservado y observador</p>
                      <p className="text-sm text-muted-foreground">Prefieres observar que ser el centro. La persuasión no es tu fortaleza natural, pero eso no significa que no puedas influir.</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2"><strong>Desarrollo:</strong> Practica contar historias auténticas. Esta semana cuenta una historia personal genuina en una conversación.</p>
                    </>
                  )}
                </div>

                {/* Estabilidad Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🛡️</span>
                    <span className="font-semibold text-lg">Estabilidad - Tu Lealtad y Apoyo ({(results.estabilidad * 20).toFixed(0)}%)</span>
                  </div>
                  {results.estabilidad > 70 ? (
                    <>
                      <p className="text-sm font-medium">Eres la roca donde otros pueden confiar</p>
                      <p className="text-sm text-muted-foreground">Tu lealtad es inquebrantable, tu paciencia es legendaria. Actúas con calma y consistencia, proporcionando estabilidad a tu entorno.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Oportunidad:</strong> Tu reto es iniciarte en cambios controlados. El mundo evolucionará con o sin ti. Aprende a liderar en transiciones.</p>
                    </>
                  ) : results.estabilidad > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas equilibrio entre estabilidad y cambio</p>
                      <p className="text-sm text-muted-foreground">Eres confiable, aunque ocasionalmente deseas movimiento o aventura. Tu fortaleza es tu consistencia, pero necesitas variedad.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Siguiente paso:</strong> Busca cambio positivo en UNA área importante. No resistas el cambio, sino condúcelo estratégicamente.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu acercamiento es dinámico y orientado al cambio</p>
                      <p className="text-sm text-muted-foreground">Prefieres variedad sobre predictibilidad. La rutina no es tu motivación. Prosperas en ambientes ágiles y flexibles.</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2"><strong>Desarrollo:</strong> Practica compromisos a largo plazo. Elige UNA persona o proyecto y cultívalo durante 3 meses sin cambios.</p>
                    </>
                  )}
                </div>

                {/* Consciencia Insight */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-green-500 space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔍</span>
                    <span className="font-semibold text-lg">Consciencia - Tu Precisión y Análisis ({(results.consciencia * 20).toFixed(0)}%)</span>
                  </div>
                  {results.consciencia > 70 ? (
                    <>
                      <p className="text-sm font-medium">Eres lógico, preciso y orientado a la calidad</p>
                      <p className="text-sm text-muted-foreground">Tu análisis es profundo, valoras los datos antes de suposiciones. Te expresas con cautela y claridad, buscando siempre lo correcto.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Oportunidad:</strong> Comparte tus ideas en proceso, no solo cuando son perfectas. Confía en tu criterio incluso sin toda la información.</p>
                    </>
                  ) : results.consciencia > 50 ? (
                    <>
                      <p className="text-sm font-medium">Buscas precisión con pragmatismo moderado</p>
                      <p className="text-sm text-muted-foreground">Tienes estándares altos, aunque balanceas entre perfección y lo "suficientemente bueno". Tu análisis es cuidadoso pero flexible.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Siguiente paso:</strong> Crea UN sistema donde documentes decisiones importantes. El método te liberará de la ansiedad de olvidar detalles.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium">Tu acercamiento es más flexible e intuitivo</p>
                      <p className="text-sm text-muted-foreground">Prefieres velocidad sobre perfección. Los detalles no siempre te cautivan. Eres capaz de actuar con información incompleta.</p>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2"><strong>Desarrollo:</strong> Entrena el análisis antes de la acción. Esta semana, documenta UNA decisión importante y explica tu razonamiento.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Overall Recommendation based on profile */}
              <div className="p-4 bg-gradient-to-r from-red-100 to-green-100 dark:from-red-900 dark:to-green-900 rounded-lg mt-4">
                <p className="font-semibold text-red-900 dark:text-red-100 mb-2">🎯 Tu Ruta de Desarrollo Personalizada:</p>
                <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                  Tu perfil ha sido analizado. A continuación, tu trayectoria personalizada basada en tus dimensiones Acción, Inspiración, Apoyo y Excelencia:
                </p>
                <div className="space-y-2 text-sm">
                  {results.nivel === "principiante" ? (
                    <>
                      <p className="text-red-800 dark:text-red-200"><strong>Tu Nivel:</strong> Principiante - Desarrollo fundamental en progreso. Construye una base sólida desarrollando una dimensión a la vez.</p>
                      <p className="text-red-800 dark:text-red-200"><strong>Foco Principal:</strong> Identifica tu dimensión más débil (la con menor %). Dedica este mes a desarrollarla específicamente.</p>
                      <p className="text-red-800 dark:text-red-200"><strong>Próximo Ciclo:</strong> Completa A1 Cerebral → Inicia A2 Rutas especializadas en tu fortaleza principal.</p>
                    </>
                  ) : results.nivel === "intermedio" ? (
                    <>
                      <p className="text-red-800 dark:text-red-200"><strong>Tu Nivel:</strong> Intermedio - Buen balance en desarrollo. Tienes fortalezas claras. Ahora potencia tu fortaleza más débil y amplifica tus fortalezas.</p>
                      <p className="text-red-800 dark:text-red-200"><strong>Tu Enfoque:</strong> Integra tus dimensiones. Si Acción es alta pero Inspiración baja, aprende a liderar inspirando. Si Excelencia es baja pero Apoyo alto, documenta tus procesos.</p>
                      <p className="text-red-800 dark:text-red-200"><strong>Próximo Ciclo:</strong> Completa A1 → Inicia A2 con enfoque en complementariedades entre tus dimensiones.</p>
                    </>
                  ) : results.nivel === "avanzado" ? (
                    <>
                      <p className="text-red-800 dark:text-red-200"><strong>Tu Nivel:</strong> Avanzado - Alto desarrollo en múltiples dimensiones. Eres un profesional en desarrollo continuo.</p>
                      <p className="text-red-800 dark:text-red-200"><strong>Tu Rol:</strong> Mentoriza a otros en su jornada. Tu rol natural es liderazgo transformacional. Ayuda a otros a entender su perfil.</p>
                      <p className="text-red-800 dark:text-red-200"><strong>Próximo Ciclo:</strong> Completa A1 → Avanza a A2 con rol de amplificador. Lidera equipos usando inteligencia de tu perfil.</p>
                    </>
                  ) : (
                    <>
                      <p className="text-red-800 dark:text-red-200"><strong>Tu Nivel:</strong> Maestría - Has alcanzado un desarrollo excepcional en tus dimensiones.</p>
                      <p className="text-red-800 dark:text-red-200"><strong>Tu Impacto:</strong> Eres un modelo para otros. Transforma tu experiencia en impacto duradero. Documenta tu metodología personal.</p>
                      <p className="text-red-800 dark:text-red-200"><strong>Próximo Paso:</strong> Lidera con ejemplo. Tu presencia enseña a otros. Multiplica tu impacto ayudando a otros a encontrar su perfil único.</p>
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
