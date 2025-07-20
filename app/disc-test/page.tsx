"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ArrowLeft,
  ArrowRight,
  Target,
  CheckCircle,
  Sparkles,
  Bot,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

const discQuestions = [
  {
    id: 1,
    question: "Al liderar una nueva iniciativa estratégica en tu empresa, tu enfoque principal es:",
    alternativeQuestion: "Cuando te asignan la responsabilidad de una nueva iniciativa importante, prefieres:",
    options: [
      { text: "Establecer objetivos claros y dirigir la ejecución con autoridad", type: "D", score: 4 },
      { text: "Inspirar al equipo y generar entusiasmo por la visión", type: "I", score: 4 },
      { text: "Asegurar que todos estén alineados y cómodos con los cambios", type: "S", score: 4 },
      { text: "Desarrollar un plan detallado con métricas y controles de calidad", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Esta pregunta evalúa tu estilo de liderazgo natural cuando inicias proyectos importantes.",
      examples: [
        "Dominance (D): Tomas control inmediato, defines metas claras y diriges con autoridad",
        "Influence (I): Motivas al equipo, comunicas la visión de manera inspiradora",
        "Steadiness (S): Te aseguras de que todos se sientan incluidos y cómodos",
        "Conscientiousness (C): Planificas meticulosamente con análisis detallado",
      ],
      tips: "Piensa en cómo realmente te comportas cuando lideras, no en cómo crees que deberías comportarte.",
    },
  },
  {
    id: 2,
    question: "Durante una presentación ejecutiva importante ante la alta dirección:",
    alternativeQuestion: "Al comunicarte con ejecutivos senior o management, tu estilo es:",
    options: [
      { text: "Presento resultados directamente con recomendaciones claras de acción", type: "D", score: 4 },
      { text: "Uso storytelling y datos persuasivos para generar buy-in", type: "I", score: 4 },
      { text: "Busco consenso y me aseguro de que todos estén de acuerdo", type: "S", score: 4 },
      { text: "Proporciono análisis exhaustivo con datos que respalden cada punto", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Esta pregunta mide tu estilo de comunicación en contextos de alta responsabilidad.",
      examples: [
        "D: 'Los números muestran X, recomiendo hacer Y inmediatamente'",
        "I: 'Imaginen el impacto que tendremos si implementamos esta estrategia...'",
        "S: '¿Qué opinan todos? ¿Están cómodos con esta dirección?'",
        "C: 'He analizado 15 variables y los datos indican que...'",
      ],
      tips: "Considera cómo te sientes más natural comunicándote con autoridades.",
    },
  },
  {
    id: 3,
    question: "En reuniones de equipo regulares, tu participación se caracteriza por:",
    alternativeQuestion: "Durante las reuniones de trabajo con tu equipo, tiendes a:",
    options: [
      { text: "Dirigir la agenda y mantener el foco en resultados", type: "D", score: 4 },
      { text: "Facilitar la discusión y mantener la energía positiva", type: "I", score: 4 },
      { text: "Escuchar activamente y asegurar que todos participen", type: "S", score: 4 },
      { text: "Aportar datos precisos y hacer preguntas analíticas", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Evalúa tu rol natural en dinámicas de grupo y colaboración.",
      examples: [
        "D: Controlas el tiempo, interrumpes tangentes, enfocas en deliverables",
        "I: Haces bromas, conectas ideas, mantienes el ambiente positivo",
        "S: Te aseguras de que los callados hablen, medias conflictos",
        "C: Cuestionas supuestos, pides clarificaciones, verificas datos",
      ],
      tips: "Reflexiona sobre tu comportamiento típico en reuniones, no en tu rol ideal.",
    },
  },
  {
    id: 4,
    question: "Cuando debes tomar una decisión importante bajo presión de tiempo:",
    alternativeQuestion: "Ante decisiones críticas con deadlines ajustados, tu enfoque es:",
    options: [
      { text: "Decido rápidamente basándome en mi experiencia e intuición", type: "D", score: 4 },
      { text: "Consulto con personas clave para obtener diferentes perspectivas", type: "I", score: 4 },
      { text: "Busco la opción que genere menos disrupciones al equipo", type: "S", score: 4 },
      { text: "Analizo los datos disponibles aunque tome más tiempo", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Mide tu proceso de toma de decisiones cuando el tiempo es limitado.",
      examples: [
        "D: 'Tengo suficiente información, vamos con la opción A'",
        "I: 'Déjame consultar con 2-3 personas antes de decidir'",
        "S: '¿Cuál opción afectará menos al equipo?'",
        "C: 'Necesito revisar estos números una vez más'",
      ],
      tips: "Piensa en situaciones reales donde tuviste presión de tiempo para decidir.",
    },
  },
  {
    id: 5,
    question: "Tu ambiente de trabajo ideal tiene estas características:",
    alternativeQuestion: "Las condiciones de trabajo donde te sientes más productivo incluyen:",
    options: [
      { text: "Autonomía completa con metas claras y recursos suficientes", type: "D", score: 4 },
      { text: "Interacción frecuente con colegas y variedad en las tareas", type: "I", score: 4 },
      { text: "Estabilidad, procesos claros y relaciones armoniosas", type: "S", score: 4 },
      { text: "Tiempo para análisis profundo y estándares de calidad altos", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Identifica las condiciones ambientales que maximizan tu rendimiento.",
      examples: [
        "D: Oficina privada, control total sobre tu agenda, metas ambiciosas",
        "I: Espacios abiertos, reuniones frecuentes, proyectos diversos",
        "S: Rutinas establecidas, equipo estable, ambiente colaborativo",
        "C: Espacio silencioso, tiempo para investigar, herramientas de análisis",
      ],
      tips: "Considera dónde y cuándo has sido más productivo en tu carrera.",
    },
  },
  {
    id: 6,
    question: "Al enfrentar un problema complejo que afecta múltiples áreas:",
    alternativeQuestion: "Cuando analizas problemas multifacéticos y complejos, tu método es:",
    options: [
      { text: "Identifico la causa raíz y ataco el problema directamente", type: "D", score: 4 },
      { text: "Facilito sesiones de brainstorming para generar soluciones creativas", type: "I", score: 4 },
      { text: "Busco soluciones que satisfagan a todas las partes involucradas", type: "S", score: 4 },
      { text: "Descompongo el problema en partes y analizo cada componente", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Evalúa tu enfoque para resolver problemas complejos y multidimensionales.",
      examples: [
        "D: 'El 80% del problema viene de X, enfoquémonos ahí'",
        "I: 'Juntemos a todos los stakeholders para una sesión creativa'",
        "S: '¿Cómo podemos resolver esto sin afectar negativamente a nadie?'",
        "C: 'Necesito mapear todas las variables y sus interrelaciones'",
      ],
      tips: "Recuerda cómo abordas naturalmente los problemas complejos en el trabajo.",
    },
  },
  {
    id: 7,
    question: "Cuando recibes feedback sobre tu desempeño, prefieres que sea:",
    alternativeQuestion: "Tu estilo preferido para recibir retroalimentación profesional es:",
    options: [
      { text: "Directo, específico y enfocado en resultados medibles", type: "D", score: 4 },
      { text: "Positivo, motivacional y que reconozca mis contribuciones", type: "I", score: 4 },
      { text: "Constructivo, privado y que incluya apoyo para mejorar", type: "S", score: 4 },
      { text: "Detallado, basado en datos y con ejemplos específicos", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Determina cómo prefieres recibir y procesar la retroalimentación.",
      examples: [
        "D: 'Tus ventas bajaron 15%, necesitas mejorar el cierre'",
        "I: 'Tu presentación fue excelente, aquí hay algunas ideas para hacerla aún mejor'",
        "S: 'Hablemos en privado sobre algunas oportunidades de desarrollo'",
        "C: 'Basándome en estos 5 indicadores, aquí están las áreas específicas...'",
      ],
      tips: "Piensa en qué tipo de feedback te ha resultado más útil y motivador.",
    },
  },
  {
    id: 8,
    question: "Para influir y persuadir a otros, tu método más efectivo es:",
    alternativeQuestion: "Cuando necesitas convencer a colegas o clientes, tu estrategia es:",
    options: [
      { text: "Presentar argumentos lógicos con autoridad y confianza", type: "D", score: 4 },
      { text: "Conectar emocionalmente y mostrar beneficios inspiradores", type: "I", score: 4 },
      { text: "Construir consenso gradualmente y abordar todas las preocupaciones", type: "S", score: 4 },
      { text: "Proporcionar evidencia detallada y análisis riguroso", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Mide tu estilo natural de influencia y persuasión.",
      examples: [
        "D: 'Los datos son claros, esta es la mejor opción'",
        "I: 'Imagina cómo esto transformará nuestro trabajo diario'",
        "S: 'Entiendo tus preocupaciones, hablemos de cada una'",
        "C: 'He preparado un análisis de 20 páginas que demuestra...'",
      ],
      tips: "Reflexiona sobre cuándo has sido más persuasivo en situaciones profesionales.",
    },
  },
  {
    id: 9,
    question: "Cuando surge un conflicto interpersonal en tu equipo:",
    alternativeQuestion: "Tu enfoque para manejar tensiones y conflictos entre colegas es:",
    options: [
      { text: "Abordo el conflicto directamente y busco una resolución rápida", type: "D", score: 4 },
      { text: "Facilito una conversación abierta para que todos se expresen", type: "I", score: 4 },
      { text: "Medío pacientemente hasta encontrar una solución que funcione para todos", type: "S", score: 4 },
      { text: "Analizo objetivamente los hechos para encontrar la solución más justa", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Evalúa tu estilo de manejo de conflictos y mediación.",
      examples: [
        "D: 'Sentémonos los tres ahora mismo y resolvamos esto'",
        "I: 'Organicemos una reunión donde todos puedan compartir su perspectiva'",
        "S: 'Hablemos individualmente primero para entender todas las posiciones'",
        "C: 'Revisemos los hechos objetivos y las políticas aplicables'",
      ],
      tips: "Considera cómo reaccionas instintivamente cuando hay tensión en el equipo.",
    },
  },
  {
    id: 10,
    question: "Al implementar cambios organizacionales, tu ritmo preferido es:",
    alternativeQuestion: "Para ejecutar transformaciones en procesos o sistemas, prefieres:",
    options: [
      { text: "Implementación rápida y decisiva con ajustes sobre la marcha", type: "D", score: 4 },
      { text: "Rollout dinámico con comunicación constante y celebraciones", type: "I", score: 4 },
      { text: "Implementación gradual con tiempo para que todos se adapten", type: "S", score: 4 },
      { text: "Piloto controlado con métricas detalladas antes del rollout completo", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Determina tu velocidad y estilo preferido para implementar cambios.",
      examples: [
        "D: 'Lanzamos el lunes, ajustamos lo que no funcione'",
        "I: 'Hagamos un gran lanzamiento con training interactivo'",
        "S: 'Implementemos por fases para que nadie se sienta abrumado'",
        "C: 'Probemos con un grupo pequeño y midamos resultados primero'",
      ],
      tips: "Piensa en cómo prefieres manejar cambios en tu trabajo o vida personal.",
    },
  },
  {
    id: 11,
    question: "En situaciones de alto riesgo o crisis, tu comportamiento típico es:",
    alternativeQuestion: "Cuando enfrentas situaciones críticas con mucho en juego, tiendes a:",
    options: [
      { text: "Me energizo y tomo control de la situación inmediatamente", type: "D", score: 4 },
      { text: "Mantengo la moral alta del equipo mientras buscamos soluciones", type: "I", score: 4 },
      { text: "Me mantengo calmado y proporciono estabilidad al grupo", type: "S", score: 4 },
      { text: "Analizo cuidadosamente todos los riesgos antes de actuar", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Mide tu respuesta natural ante situaciones de alta presión y riesgo.",
      examples: [
        "D: Te conviertes en el líder de crisis, tomas decisiones rápidas",
        "I: Mantienes al equipo motivado, comunicas con optimismo",
        "S: Eres el ancla emocional, proporcionas calma y apoyo",
        "C: Te enfocas en minimizar riesgos con análisis cuidadoso",
      ],
      tips: "Recuerda cómo has reaccionado en crisis reales o situaciones de mucha presión.",
    },
  },
  {
    id: 12,
    question: "Tu principal fuente de motivación y energía en el trabajo proviene de:",
    alternativeQuestion: "Lo que más te energiza y motiva profesionalmente es:",
    options: [
      { text: "Lograr objetivos ambiciosos y superar desafíos difíciles", type: "D", score: 4 },
      { text: "Reconocimiento público y conexiones significativas con otros", type: "I", score: 4 },
      { text: "Contribuir al bienestar del equipo y mantener armonía", type: "S", score: 4 },
      { text: "Producir trabajo de alta calidad y ser reconocido como experto", type: "C", score: 4 },
    ],
    helpContent: {
      explanation: "Identifica tus motivadores intrínsecos y fuentes de energía profesional.",
      examples: [
        "D: Te motivan las metas stretch, competencia, ganar",
        "I: Te energiza el reconocimiento, networking, impacto social",
        "S: Te motiva ayudar a otros, estabilidad, trabajo en equipo",
        "C: Te energiza la maestría, precisión, ser el experto",
      ],
      tips: "Piensa en qué aspectos del trabajo te dan más satisfacción y energía.",
    },
  },
]

export default function DISCTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)
  const [aiInsight, setAiInsight] = useState<string>("")
  const [loadingInsight, setLoadingInsight] = useState(false)
  const [helpUsed, setHelpUsed] = useState<Set<number>>(new Set())
  const [rephrased, setRephrased] = useState<Set<number>>(new Set())
  const [showAlternative, setShowAlternative] = useState<Record<number, boolean>>({})
  const [showTips, setShowTips] = useState(false)

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [discQuestions[currentQuestion].id]: value,
    }))
  }

  const handleHelp = () => {
    setHelpUsed((prev) => new Set([...prev, discQuestions[currentQuestion].id]))
  }

  const handleRephrase = () => {
    const questionId = discQuestions[currentQuestion].id
    setRephrased((prev) => new Set([...prev, questionId]))
    setShowAlternative((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }))
  }

  const handleNext = async () => {
    // Get AI insight for the current answer
    if (answers[discQuestions[currentQuestion].id] && !aiInsight) {
      setLoadingInsight(true)
      try {
        const response = await fetch("/api/ai-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "disc_question_insight",
            question: showAlternative[discQuestions[currentQuestion].id]
              ? discQuestions[currentQuestion].alternativeQuestion
              : discQuestions[currentQuestion].question,
            answer: answers[discQuestions[currentQuestion].id],
            questionNumber: currentQuestion + 1,
          }),
        })
        const data = await response.json()
        setAiInsight(data.insight)
      } catch (error) {
        console.error("Failed to get AI insight:", error)
      }
      setLoadingInsight(false)
    }

    if (currentQuestion < discQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setAiInsight("") // Reset insight for next question
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setAiInsight("") // Reset insight when going back
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setShowCompletion(true)

    try {
      // Calculate DISC scores
      const scores = calculateDISCScores(answers)

      // Get AI analysis of complete results
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "disc_complete_analysis",
          answers: answers,
          scores: scores,
          helpUsed: Array.from(helpUsed),
          rephrased: Array.from(rephrased),
        }),
      })

      const aiAnalysis = await response.json()

      // Store results with AI analysis
      const results = {
        scores,
        aiAnalysis: aiAnalysis.analysis,
        helpUsed: Array.from(helpUsed),
        rephrased: Array.from(rephrased),
        completedAt: new Date().toISOString(),
      }

      localStorage.setItem("discResults", JSON.stringify(results))

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 3000))

      router.push("/disc-results")
    } catch (error) {
      console.error("Failed to process DISC results:", error)
      // Fallback to basic results
      const scores = calculateDISCScores(answers)
      localStorage.setItem("discResults", JSON.stringify({ scores }))
      router.push("/disc-results")
    }
  }

  const calculateDISCScores = (answers: Record<number, string>) => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }

    Object.entries(answers).forEach(([questionId, selectedOption]) => {
      const question = discQuestions.find((q) => q.id === Number.parseInt(questionId))
      if (question) {
        const option = question.options.find((opt) => opt.text === selectedOption)
        if (option) {
          scores[option.type as keyof typeof scores] += option.score
        }
      }
    })

    // Convert to percentages
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
    return {
      D: Math.round((scores.D / total) * 100),
      I: Math.round((scores.I / total) * 100),
      S: Math.round((scores.S / total) * 100),
      C: Math.round((scores.C / total) * 100),
    }
  }

  const progress = ((currentQuestion + 1) / discQuestions.length) * 100
  const currentAnswer = answers[discQuestions[currentQuestion].id]
  const isLastQuestion = currentQuestion === discQuestions.length - 1
  const canProceed = currentAnswer !== undefined
  const currentQuestionData = discQuestions[currentQuestion]
  const isQuestionRephrased = rephrased.has(currentQuestionData.id)
  const isHelpUsed = helpUsed.has(currentQuestionData.id)

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">DISC Assessment Complete!</h2>
              <p className="text-gray-600 mb-4">
                AI is analyzing your responses and generating your personalized DISC profile...
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Bot className="h-5 w-5 text-blue-600 animate-pulse" />
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DISC Personality Assessment</h1>
              <p className="text-gray-600">Discover your behavioral style and communication preferences</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Question {currentQuestion + 1} of {discQuestions.length}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Tips Panel */}
        <Collapsible open={showTips} onOpenChange={setShowTips}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full mb-4 justify-between bg-transparent">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-yellow-600" />
                <span>Tips para responder el test DISC</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTips ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mb-4">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-yellow-800">🎯 Responde con honestidad:</strong>
                    <p className="text-yellow-700">
                      Elige la opción que mejor describe tu comportamiento natural, no lo que crees que es "correcto".
                    </p>
                  </div>
                  <div>
                    <strong className="text-yellow-800">🏢 Contexto profesional:</strong>
                    <p className="text-yellow-700">Piensa en situaciones de trabajo reales que hayas vivido.</p>
                  </div>
                  <div>
                    <strong className="text-yellow-800">⚡ Primera impresión:</strong>
                    <p className="text-yellow-700">Tu primera reacción suele ser la más auténtica.</p>
                  </div>
                  <div>
                    <strong className="text-yellow-800">🆘 Usa la ayuda:</strong>
                    <p className="text-yellow-700">
                      Si no entiendes una pregunta, usa los botones de ayuda y reformulación.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">
                  {showAlternative[currentQuestionData.id]
                    ? currentQuestionData.alternativeQuestion
                    : currentQuestionData.question}
                </CardTitle>
                <CardDescription>Choose the option that best describes your typical behavior</CardDescription>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                {/* Help Button */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleHelp}
                      className="flex items-center space-x-1 bg-transparent"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span>Help</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ayuda para esta pregunta</DialogTitle>
                      <DialogDescription>Explicación detallada y ejemplos para ayudarte a responder</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Explicación:</h4>
                        <p className="text-gray-700">{currentQuestionData.helpContent.explanation}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Ejemplos por tipo DISC:</h4>
                        <ul className="space-y-2">
                          {currentQuestionData.helpContent.examples.map((example, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-1">💡 Consejo:</h4>
                        <p className="text-sm text-blue-800">{currentQuestionData.helpContent.tips}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Rephrase Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRephrase}
                  className="flex items-center space-x-1 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Rephrase</span>
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex space-x-2 mt-2">
              {isHelpUsed && (
                <Badge variant="secondary" className="text-xs">
                  <HelpCircle className="w-3 h-3 mr-1" />
                  Help Used
                </Badge>
              )}
              {isQuestionRephrased && (
                <Badge variant="outline" className="text-xs">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Rephrased
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup value={currentAnswer} onValueChange={handleAnswer} className="space-y-4">
              {currentQuestionData.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <RadioGroupItem value={option.text} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* AI Insight Card */}
        {(aiInsight || loadingInsight) && (
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {loadingInsight ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <Sparkles className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">AI Insight</h4>
                  <p className="text-sm text-blue-800">{loadingInsight ? "Analyzing your response..." : aiInsight}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mb-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={handleSubmit} disabled={!canProceed || isSubmitting} className="min-w-[140px]">
              {isSubmitting ? (
                <>
                  <Bot className="w-4 h-4 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Complete Test
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="p-4 bg-blue-50 rounded-lg mb-6">
          <div className="flex items-start space-x-3">
            <Bot className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>AI-Powered Assessment:</strong> Our AI analyzes your responses in real-time to provide
                personalized insights and a comprehensive behavioral profile.
              </p>
            </div>
          </div>
        </div>

        {/* Question Progress Indicators */}
        <div className="grid grid-cols-12 gap-1">
          {discQuestions.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full ${
                index < currentQuestion
                  ? "bg-green-500"
                  : index === currentQuestion
                    ? "bg-blue-500"
                    : answers[discQuestions[index].id]
                      ? "bg-gray-400"
                      : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
