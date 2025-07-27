"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
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
  MessageSquare,
  Crown,
  Users,
  Lightbulb,
  Zap,
  Heart,
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Mic,
  MicOff,
  Loader2,
  Trash2,
  Volume2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Info,
  Settings,
  Keyboard,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { questions } from "./questions"

interface SoftSkillsResults {
  communication: number
  leadership: number
  teamwork: number
  problemSolving: number
  adaptability: number
  emotionalIntelligence: number
  timeManagement: number
  overallScore: number
  completedAt: string
  totalQuestions: number
  answeredQuestions: number
  results: Array<{
    category: string
    score: number
    level: number
  }>
}

type InputMode = "mixed" | "voice-complete"

export default function SoftSkillsTestPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [helpUsed, setHelpUsed] = useState<Set<number>>(new Set())
  const [reformulated, setReformulated] = useState<Set<number>>(new Set())
  const [currentReformulation, setCurrentReformulation] = useState<Record<number, number>>({})
  const [showTips, setShowTips] = useState(false)
  const [inputMode, setInputMode] = useState<InputMode>("mixed")
  const [showModeSelection, setShowModeSelection] = useState(true)

  // Speech recognition states
  const [isListening, setIsListening] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [speechError, setSpeechError] = useState("")
  const [speechSupported, setSpeechSupported] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const startListening = async () => {
    if (!speechSupported) {
      setSpeechError("El reconocimiento de voz no está soportado en este navegador. Prueba con Chrome o Edge.")
      return
    }

    try {
      setIsInitializing(true)
      setSpeechError("")
      console.log("Iniciando reconocimiento de voz...")

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = "es-ES"
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 3

      let hasReceivedFinalResult = false
      let lastSpeechTime = Date.now()

      recognition.onstart = () => {
        console.log("Reconocimiento de voz iniciado")
        setIsListening(true)
        setIsInitializing(false)
        hasReceivedFinalResult = false
        lastSpeechTime = Date.now()

        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current)
          initTimeoutRef.current = null
        }
      }

      recognition.onspeechstart = () => {
        console.log("Detectado inicio de habla")
        lastSpeechTime = Date.now()
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
          silenceTimerRef.current = null
        }
      }

      recognition.onspeechend = () => {
        console.log("Detectado fin de habla, iniciando timer de silencio")
        lastSpeechTime = Date.now()

        // Iniciar timer de 3 segundos después de que termine el habla
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        silenceTimerRef.current = setTimeout(() => {
          console.log("3 segundos de silencio completados, deteniendo reconocimiento")
          if (recognition && isListening) {
            recognition.stop()
          }
        }, 3000)
      }

      recognition.onresult = (event) => {
        console.log("Resultado recibido:", event)
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
            hasReceivedFinalResult = true
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          console.log("Transcripción final:", finalTranscript)
          setTranscript((prev) => {
            const newTranscript = prev + finalTranscript + " "
            console.log("Transcripción actualizada:", newTranscript)
            return newTranscript
          })
          setInterimTranscript("")
          lastSpeechTime = Date.now()

          // Resetear timer cuando recibimos texto final
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current)
            silenceTimerRef.current = null
          }
        } else {
          console.log("Transcripción temporal:", interimTranscript)
          setInterimTranscript(interimTranscript)
          lastSpeechTime = Date.now()
        }
      }

      recognition.onerror = (event) => {
        console.error("Error en reconocimiento de voz:", event.error)
        setIsListening(false)
        setIsInitializing(false)

        // No detener por errores menores si ya tenemos resultados
        if (hasReceivedFinalResult && (event.error === "no-speech" || event.error === "aborted")) {
          console.log("Error menor ignorado, ya tenemos resultados")
          return
        }

        switch (event.error) {
          case "not-allowed":
            setSpeechError(
              "Permisos de micrófono denegados. Por favor, permite el acceso al micrófono y recarga la página.",
            )
            break
          case "network":
            setSpeechError("Error de conexión. Verifica tu conexión a internet e intenta nuevamente.")
            break
          case "no-speech":
            if (!hasReceivedFinalResult) {
              setSpeechError("No se detectó voz. Intenta hablar más cerca del micrófono.")
            }
            break
          case "audio-capture":
            setSpeechError("No se pudo acceder al micrófono. Verifica que esté conectado y funcionando.")
            break
          case "service-not-allowed":
            setSpeechError("El servicio de reconocimiento de voz no está disponible.")
            break
          case "aborted":
            // Error normal cuando se detiene manualmente
            console.log("Reconocimiento detenido manualmente")
            break
          default:
            setSpeechError(`Error de reconocimiento de voz: ${event.error}. Intenta nuevamente.`)
        }
      }

      recognition.onend = () => {
        console.log("Reconocimiento de voz terminado")
        setIsListening(false)
        setIsInitializing(false)
        setInterimTranscript("")

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
          silenceTimerRef.current = null
        }
      }

      recognitionRef.current = recognition
      recognition.start()

      // Timeout de inicialización más largo
      initTimeoutRef.current = setTimeout(() => {
        if (isInitializing) {
          console.log("Timeout de inicialización")
          recognition.stop()
          setSpeechError("No se pudo inicializar el reconocimiento de voz. Intenta nuevamente.")
          setIsInitializing(false)
        }
      }, 10000) // 10 segundos para inicializar
    } catch (error) {
      console.error("Error al iniciar reconocimiento de voz:", error)
      setSpeechError("Error al inicializar el reconocimiento de voz. Intenta nuevamente.")
      setIsInitializing(false)
    }
  }

  const stopListening = () => {
    console.log("Deteniendo reconocimiento de voz manualmente...")
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
      initTimeoutRef.current = null
    }
    setIsListening(false)
    setIsInitializing(false)
    setInterimTranscript("")
  }

  const clearTranscription = () => {
    console.log("Limpiando transcripción...")
    setTranscript("")
    setInterimTranscript("")
    setSpeechError("")
    setWordCount(0)
    setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: "" }))
  }

  const handleAnswer = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleHelp = (questionId: number) => {
    setHelpUsed((prev) => new Set([...prev, questionId]))
  }

  const handleReformulate = (questionId: number) => {
    const current = currentReformulation[questionId] || 0
    const maxReformulations = questions.find((q) => q.id === questionId)?.reformulations?.length || 0
    const next = (current + 1) % (maxReformulations + 1)

    setCurrentReformulation((prev) => ({ ...prev, [questionId]: next }))
    setReformulated((prev) => new Set([...prev, questionId]))
  }

  const getCurrentQuestionText = (question: any) => {
    const reformulationIndex = currentReformulation[question.id] || 0
    if (reformulationIndex > 0 && question.reformulations) {
      return question.reformulations[reformulationIndex - 1]
    }
    return question.text
  }

  const handleDragEnd = (result: any, questionId: number) => {
    if (!result.destination) return

    const items = Array.from(answers[questionId] || questions.find((q) => q.id === questionId)?.options || [])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    handleAnswer(questionId, items)
  }

  const calculateResults = (): SoftSkillsResults => {
    const categories = {
      communication: [1, 2, 3, 4, 5],
      leadership: [6, 7, 8, 9, 10],
      teamwork: [11, 12, 13, 14, 15],
      problemSolving: [16, 17, 18, 19, 20],
      adaptability: [21, 22, 23, 24, 25],
      emotionalIntelligence: [26, 27, 28, 29, 30],
      timeManagement: [31, 32, 33, 34, 35],
    }

    const categoryScores: Record<string, number> = {}

    Object.entries(categories).forEach(([category, questionIds]) => {
      let totalScore = 0
      let maxScore = 0

      questionIds.forEach((id) => {
        const question = questions.find((q) => q.id === id)
        const answer = answers[id]

        if (question && answer !== undefined) {
          let score = 0
          let max = 0

          switch (question.type) {
            case "scale":
              score = question.reverse ? 6 - answer : answer
              max = 5
              break

            case "open":
              const text = answer.toString().toLowerCase()
              const words = text.split(/\s+/).filter((word) => word.length > 2)
              score = Math.min(5, Math.max(1, Math.floor(words.length / 10) + 1))

              // Keyword bonuses específicos para Chile
              const keywords = {
                communication: [
                  "comunicar",
                  "explicar",
                  "hablar",
                  "escuchar",
                  "presentar",
                  "reunión",
                  "equipo",
                  "mensaje",
                  "claro",
                  "entender",
                  "chileno",
                  "chile",
                  "cordial",
                  "respetuoso",
                ],
                leadership: [
                  "liderar",
                  "dirigir",
                  "equipo",
                  "decisión",
                  "responsabilidad",
                  "motivar",
                  "guiar",
                  "proyecto",
                  "objetivo",
                  "estrategia",
                  "chile",
                  "chileno",
                  "empresa",
                ],
                teamwork: [
                  "colaborar",
                  "equipo",
                  "grupo",
                  "cooperar",
                  "compartir",
                  "ayudar",
                  "juntos",
                  "apoyo",
                  "compañeros",
                  "unidos",
                  "chile",
                  "chileno",
                ],
                problemSolving: [
                  "problema",
                  "solución",
                  "resolver",
                  "analizar",
                  "pensar",
                  "estrategia",
                  "método",
                  "proceso",
                  "lógica",
                  "creatividad",
                  "chile",
                  "mercado",
                ],
                adaptability: [
                  "cambio",
                  "adaptar",
                  "flexible",
                  "nuevo",
                  "diferente",
                  "ajustar",
                  "aprender",
                  "evolucionar",
                  "modificar",
                  "versátil",
                  "chile",
                  "mercado",
                ],
                emotionalIntelligence: [
                  "emociones",
                  "sentir",
                  "empatía",
                  "entender",
                  "relaciones",
                  "social",
                  "sensible",
                  "comprensivo",
                  "apoyo",
                  "humano",
                  "chile",
                  "cultura",
                ],
                timeManagement: [
                  "tiempo",
                  "organizar",
                  "planificar",
                  "prioridad",
                  "deadline",
                  "eficiente",
                  "productivo",
                  "horario",
                  "gestión",
                  "puntual",
                  "chile",
                  "trabajo",
                ],
              }

              const categoryKeywords = keywords[category as keyof typeof keywords] || []
              const keywordMatches = categoryKeywords.filter((keyword) => text.includes(keyword)).length
              score += Math.min(2, keywordMatches * 0.3)

              if (words.length > 50) score += 0.5
              max = 5
              break

            case "multiple":
            case "scenario":
              score = answer
              max = 4
              break

            case "ranking":
              if (Array.isArray(answer)) {
                score = answer.length > 0 ? 4 : 0
              } else {
                score = 2
              }
              max = 4
              break

            case "checkbox":
              if (Array.isArray(answer)) {
                score = Math.min(4, answer.length)
              } else {
                score = 0
              }
              max = 4
              break

            case "slider":
              score = (answer / 100) * 5
              max = 5
              break

            case "binary":
              score = 3
              max = 4
              break

            default:
              score = 0
              max = 5
          }

          totalScore += score
          maxScore += max
        }
      })

      categoryScores[category] = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    })

    const overallScore = Math.round(Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / 7)

    const results = Object.entries(categoryScores).map(([category, score]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      score,
      level: Math.floor(score / 20) + 1,
    }))

    return {
      communication: categoryScores.communication,
      leadership: categoryScores.leadership,
      teamwork: categoryScores.teamwork,
      problemSolving: categoryScores.problemSolving,
      adaptability: categoryScores.adaptability,
      emotionalIntelligence: categoryScores.emotionalIntelligence,
      timeManagement: categoryScores.timeManagement,
      overallScore,
      completedAt: new Date().toISOString(),
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).length,
      results,
    }
  }

  const handleComplete = async () => {
    setIsCompleting(true)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const results = calculateResults()
    localStorage.setItem("softSkillsResults", JSON.stringify(results))
    router.push("/soft-skills-results")
  }

  const handleStartTest = (mode: InputMode) => {
    setInputMode(mode)
    setShowModeSelection(false)
    setIsStarted(true)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]
  const isAnswered = answers[currentQ?.id] !== undefined
  const allAnswered = questions.every((q) => answers[q.id] !== undefined)

  // Validation for different question types
  const isValid = () => {
    const answer = answers[currentQ.id]

    switch (currentQ.type) {
      case "open":
        return answer?.toString().trim().length >= 10
      case "ranking":
        return Array.isArray(answer) && answer.length > 0
      case "checkbox":
        return Array.isArray(answer) && answer.length > 0
      default:
        return isAnswered
    }
  }

  const canProceed = isValid()

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setSpeechSupported(!!SpeechRecognition)
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        recognitionRef.current = null
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
        initTimeoutRef.current = null
      }
    }
  }, [])

  // Clear transcription when changing questions
  useEffect(() => {
    setTranscript("")
    setInterimTranscript("")
    setSpeechError("")
    setWordCount(0)
    if (isListening) {
      stopListening()
    }
  }, [currentQuestion])

  // Update word count when transcript changes
  useEffect(() => {
    const words = transcript
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [transcript])

  // Update textarea when transcript changes
  useEffect(() => {
    if (transcript && currentQ?.type === "open") {
      console.log("Actualizando respuesta con transcripción:", transcript)
      setAnswers((prev) => ({ ...prev, [currentQ.id]: transcript }))
    }
  }, [transcript, currentQ?.id, currentQ?.type])

  // Auto-start voice recognition for voice-complete mode
  useEffect(() => {
    if (
      inputMode === "voice-complete" &&
      currentQ?.type === "open" &&
      speechSupported &&
      !isListening &&
      !isInitializing
    ) {
      // Auto-start voice recognition after a short delay
      const timer = setTimeout(() => {
        startListening()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion, inputMode, speechSupported, isListening, isInitializing])

  // Mode Selection Screen
  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Evaluación de Habilidades Blandas</h1>
            <p className="text-xl text-gray-600 mb-8">Elige cómo prefieres responder las preguntas abiertas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mixed Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  Modo Mixto
                </CardTitle>
                <CardDescription>Puedes elegir entre voz y escritura para cada pregunta abierta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Flexibilidad total para cada pregunta
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Botones de voz y escritura disponibles
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Puedes cambiar de método cuando quieras
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Ideal para usuarios que prefieren control
                  </div>
                </div>
                <Button onClick={() => handleStartTest("mixed")} className="w-full" variant="outline">
                  <Keyboard className="w-4 h-4 mr-2" />
                  Elegir Modo Mixto
                </Button>
              </CardContent>
            </Card>

            {/* Voice Complete Mode */}
            <Card
              className={`cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300 ${!speechSupported ? "opacity-50" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-green-600" />
                  </div>
                  Hablado Completo
                </CardTitle>
                <CardDescription>Todas las preguntas abiertas se responden automáticamente por voz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Reconocimiento de voz automático
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Experiencia completamente hablada
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Detección automática de silencio (3 seg)
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Ideal para evaluación natural y fluida
                  </div>
                </div>
                <Button
                  onClick={() => handleStartTest("voice-complete")}
                  className="w-full"
                  disabled={!speechSupported}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Elegir Hablado Completo
                </Button>
                {!speechSupported && (
                  <p className="text-xs text-amber-600 text-center">
                    Reconocimiento de voz no disponible en este navegador
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information about speech recognition */}
          {speechSupported && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-green-600" />
                  Información sobre Reconocimiento de Voz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">Características:</h4>
                    <ul className="space-y-1">
                      <li>• Optimizado para español chileno</li>
                      <li>• Detección automática de silencio</li>
                      <li>• Transcripción en tiempo real</li>
                      <li>• Se detiene tras 3 segundos sin habla</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Consejos:</h4>
                    <ul className="space-y-1">
                      <li>• Habla claramente y pausadamente</li>
                      <li>• Usa un ambiente silencioso</li>
                      <li>• Permite acceso al micrófono</li>
                      <li>• Puedes hacer pausas naturales</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Puedes cambiar el modo más tarde si es necesario</p>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Evaluación de Habilidades Blandas</h1>
            <p className="text-xl text-gray-600 mb-8">
              Evalúa tus habilidades interpersonales y de trabajo en el contexto del mercado laboral chileno
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-500" />
                Evaluación Especializada para el Mercado Chileno
              </CardTitle>
              <CardDescription>
                Evaluación integral de 35 preguntas adaptadas específicamente al ambiente laboral y cultura empresarial
                de Chile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: MessageSquare, name: "Comunicación", color: "bg-blue-100 text-blue-700" },
                  { icon: Crown, name: "Liderazgo", color: "bg-purple-100 text-purple-700" },
                  { icon: Users, name: "Trabajo en Equipo", color: "bg-green-100 text-green-700" },
                  { icon: Lightbulb, name: "Resolución de Problemas", color: "bg-yellow-100 text-yellow-700" },
                  { icon: Zap, name: "Adaptabilidad", color: "bg-orange-100 text-orange-700" },
                  { icon: Heart, name: "Inteligencia Emocional", color: "bg-red-100 text-red-700" },
                  { icon: Clock, name: "Gestión del Tiempo", color: "bg-indigo-100 text-indigo-700" },
                ].map((category, index) => {
                  const Icon = category.icon
                  return (
                    <div key={index} className="text-center">
                      <div
                        className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto mb-2`}
                      >
                        <Icon className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">{category.name}</p>
                    </div>
                  )
                })}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  🇨🇱 Especializado para Chile:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Preguntas adaptadas a la cultura laboral y empresarial chilena
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Escenarios basados en situaciones reales del mercado de trabajo en Chile
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Considera particularidades regionales y diversidad socioeconómica chilena
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Evaluación contextualizada para empresas tradicionales y startups chilenas
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Características Avanzadas:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    35 preguntas con 8 tipos diferentes: escala, abiertas, ranking, checkbox, slider, binarias, múltiple
                    opción y escenarios
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Sistema de ayuda contextual con explicaciones específicas para Chile
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <Volume2 className="w-4 h-4 text-green-500" />
                    Reconocimiento de voz en español chileno para preguntas abiertas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Interfaz drag-and-drop para preguntas de ranking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Resultados con recomendaciones para el mercado laboral chileno
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Tiempo estimado: 20-25 minutos
                  </li>
                </ul>
              </div>

              <Button onClick={() => setShowModeSelection(true)} className="w-full" size="lg">
                Comenzar Evaluación Especializada para Chile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Evaluación de Habilidades Blandas - Chile</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {inputMode === "voice-complete" ? (
                <>
                  <Volume2 className="w-3 h-3 mr-1" />
                  Hablado Completo
                </>
              ) : (
                <>
                  <Settings className="w-3 h-3 mr-1" />
                  Modo Mixto
                </>
              )}
            </Badge>
          </div>
          <p className="text-gray-600">
            Pregunta {currentQuestion + 1} de {questions.length} • Especializada para el mercado laboral chileno
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <currentQ.categoryIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge variant="secondary">{currentQ.category}</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    🇨🇱 Chile
                  </Badge>
                  {currentQ.type === "scale" && <Badge variant="outline">Escala 1-5</Badge>}
                  {currentQ.type === "open" && (
                    <div className="flex items-center gap-1">
                      <Badge variant="outline">Pregunta Abierta</Badge>
                      {speechSupported && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Volume2 className="w-3 h-3 mr-1" />
                          {inputMode === "voice-complete" ? "Auto-Voz" : "Voz Disponible"}
                        </Badge>
                      )}
                    </div>
                  )}
                  {currentQ.type === "multiple" && <Badge variant="outline">Opción Múltiple</Badge>}
                  {currentQ.type === "scenario" && <Badge variant="outline">Escenario</Badge>}
                  {currentQ.type === "ranking" && <Badge variant="outline">Ranking</Badge>}
                  {currentQ.type === "checkbox" && <Badge variant="outline">Selección Múltiple</Badge>}
                  {currentQ.type === "slider" && <Badge variant="outline">Deslizador</Badge>}
                  {currentQ.type === "binary" && <Badge variant="outline">Elección Binaria</Badge>}

                  {helpUsed.has(currentQ.id) && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      <Info className="w-3 h-3 mr-1" />
                      Ayuda Usada
                    </Badge>
                  )}
                  {reformulated.has(currentQ.id) && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reformulada
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl">Pregunta {currentQuestion + 1}</CardTitle>
              </div>
            </div>

            <CardDescription className="text-lg leading-relaxed mb-4">
              {getCurrentQuestionText(currentQ)}
            </CardDescription>

            {/* Help System */}
            <div className="flex gap-2 mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleHelp(currentQ.id)}
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    ¿No entiendes la pregunta?
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Explicación de la Pregunta</DialogTitle>
                    <DialogDescription className="text-base leading-relaxed">{currentQ.explanation}</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {currentQ.reformulations && currentQ.reformulations.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReformulate(currentQ.id)}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reformular pregunta
                </Button>
              )}
            </div>

            {/* Tips Section */}
            <Collapsible open={showTips} onOpenChange={setShowTips}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600">
                  {showTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Tips para el contexto chileno
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium mb-1">💡 Consejos para esta evaluación en Chile:</div>
                    <ul className="text-xs space-y-1 text-blue-700">
                      <li>• Responde considerando la cultura laboral chilena</li>
                      <li>• Piensa en situaciones reales que hayas vivido en Chile</li>
                      <li>• Considera las particularidades regionales y sociales del país</li>
                      <li>• Para preguntas abiertas, menciona contexto chileno específico</li>
                      <li>• Usa la ayuda contextual si necesitas clarificación</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </CardHeader>

          <CardContent>
            {/* Scale Questions */}
            {currentQ.type === "scale" && (
              <RadioGroup
                value={answers[currentQ.id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, Number.parseInt(value))}
                className="space-y-4"
              >
                {[
                  { value: 1, label: "Totalmente en desacuerdo" },
                  { value: 2, label: "En desacuerdo" },
                  { value: 3, label: "Neutral" },
                  { value: 4, label: "De acuerdo" },
                  { value: 5, label: "Totalmente de acuerdo" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Open-ended Questions */}
            {currentQ.type === "open" && (
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={answers[currentQ.id] || ""}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    placeholder="Escribe tu respuesta aquí considerando el contexto chileno... (mínimo 10 caracteres)"
                    className="min-h-[120px] resize-none"
                    rows={5}
                    disabled={inputMode === "voice-complete" && isListening}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {(answers[currentQ.id]?.toString() || "").length} caracteres
                  </div>
                </div>

                {/* Speech Recognition Controls */}
                {speechSupported && (
                  <div className="space-y-3">
                    {inputMode === "mixed" && (
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant={isListening ? "destructive" : "outline"}
                          size="sm"
                          onClick={isListening ? stopListening : startListening}
                          disabled={isInitializing}
                          className="flex items-center gap-2"
                        >
                          {isInitializing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isListening ? (
                            <>
                              <MicOff className="w-4 h-4" />
                              Detener Grabación
                            </>
                          ) : (
                            <>
                              <Mic className="w-4 h-4" />
                              Hablar Respuesta
                            </>
                          )}
                        </Button>

                        {transcript && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearTranscription}
                            className="flex items-center gap-2 text-gray-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Limpiar
                          </Button>
                        )}
                      </div>
                    )}

                    {inputMode === "voice-complete" && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          {isListening ? "Escuchando..." : "Modo hablado completo activo"}
                        </div>
                        {isListening && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={stopListening}
                            className="flex items-center gap-2"
                          >
                            <MicOff className="w-4 h-4" />
                            Detener
                          </Button>
                        )}
                      </div>
                    )}

                    {(isListening || isInitializing) && (
                      <div className="flex items-center gap-2 text-sm">
                        {isInitializing && (
                          <div className="flex items-center gap-2 text-blue-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Inicializando...
                          </div>
                        )}
                      </div>
                    )}

                    {/* Real-time Transcription Display */}
                    {(transcript || interimTranscript || isListening) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-800 mb-2 flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Transcripción en Tiempo Real
                        </div>
                        <div className="text-sm min-h-[40px]">
                          <span className="text-green-900">{transcript}</span>
                          <span className="text-green-600 italic">{interimTranscript}</span>
                          {isListening && !transcript && !interimTranscript && (
                            <span className="text-green-600 italic">Esperando que hables...</span>
                          )}
                        </div>
                        {(transcript || interimTranscript) && (
                          <div className="text-xs text-green-600 mt-2 flex items-center gap-4">
                            <span>{wordCount} palabras</span>
                            <span>{transcript.length} caracteres</span>
                            {isListening && (
                              <span className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                                Se detendrá automáticamente tras 3 segundos de silencio
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Speech Error Display */}
                    {speechError && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-800">{speechError}</AlertDescription>
                      </Alert>
                    )}

                    {/* Speech Recognition Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="text-sm text-blue-800">
                        <div className="font-medium mb-1">💡 Consejos para usar el reconocimiento de voz:</div>
                        <ul className="text-xs space-y-1 text-blue-700">
                          <li>• Habla claramente en español chileno</li>
                          <li>• Asegúrate de estar en un lugar silencioso</li>
                          <li>• La grabación se detendrá automáticamente tras 3 segundos de silencio</li>
                          <li>
                            •{" "}
                            {inputMode === "voice-complete"
                              ? "El reconocimiento se inicia automáticamente"
                              : "Puedes combinar voz y escritura en la misma respuesta"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Message */}
                {currentQ.type === "open" &&
                  answers[currentQ.id] &&
                  answers[currentQ.id]?.toString().trim().length < 10 && (
                    <p className="text-sm text-amber-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Necesitas al menos 10 caracteres para continuar
                    </p>
                  )}
              </div>
            )}

            {/* Multiple Choice and Scenario Questions */}
            {(currentQ.type === "multiple" || currentQ.type === "scenario") && currentQ.options && (
              <RadioGroup
                value={answers[currentQ.id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, Number.parseInt(value))}
                className="space-y-4"
              >
                {currentQ.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} className="mt-1" />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 text-sm leading-relaxed cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Binary Questions */}
            {currentQ.type === "binary" && currentQ.options && (
              <RadioGroup
                value={answers[currentQ.id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, Number.parseInt(value))}
                className="space-y-4"
              >
                {currentQ.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <RadioGroupItem value={option.value.toString()} id={`binary-${option.value}`} className="mt-1" />
                    <Label htmlFor={`binary-${option.value}`} className="flex-1 text-sm leading-relaxed cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Ranking Questions */}
            {currentQ.type === "ranking" && currentQ.options && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Arrastra y suelta para ordenar según tu preferencia en el contexto chileno (1 = más importante, 5 =
                  menos importante):
                </p>
                <DragDropContext onDragEnd={(result) => handleDragEnd(result, currentQ.id)}>
                  <Droppable droppableId="ranking">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {(answers[currentQ.id] || currentQ.options || []).map((item: any, index: number) => (
                          <Draggable key={item.value} draggableId={item.value.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                                  snapshot.isDragging ? "bg-blue-50 border-blue-300" : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                <GripVertical className="w-5 h-5 text-gray-400" />
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                                  {index + 1}
                                </span>
                                <span className="flex-1 text-sm">{item.label}</span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}

            {/* Checkbox Questions */}
            {currentQ.type === "checkbox" && currentQ.options && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Selecciona todas las opciones que apliquen en tu experiencia en Chile:
                </p>
                {currentQ.options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={`checkbox-${option.value}`}
                      checked={(answers[currentQ.id] || []).includes(option.value)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = answers[currentQ.id] || []
                        if (checked) {
                          handleAnswer(currentQ.id, [...currentAnswers, option.value])
                        } else {
                          handleAnswer(
                            currentQ.id,
                            currentAnswers.filter((v: number) => v !== option.value),
                          )
                        }
                      }}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={`checkbox-${option.value}`}
                      className="flex-1 text-sm leading-relaxed cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {/* Slider Questions */}
            {currentQ.type === "slider" && currentQ.sliderConfig && (
              <div className="space-y-6">
                <div className="px-4">
                  <Slider
                    value={[answers[currentQ.id] || 50]}
                    onValueChange={(value) => handleAnswer(currentQ.id, value[0])}
                    min={currentQ.sliderConfig.min}
                    max={currentQ.sliderConfig.max}
                    step={currentQ.sliderConfig.step}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 px-4">
                  {currentQ.sliderConfig.labels.map((label, index) => (
                    <span
                      key={index}
                      className={index === 1 ? "text-center" : index === 2 ? "text-right" : "text-left"}
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-blue-600">{answers[currentQ.id] || 50}%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="text-sm text-gray-500">
            {currentQuestion + 1} / {questions.length}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={!allAnswered || isCompleting}
              className="flex items-center gap-2"
            >
              {isCompleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Completar Evaluación
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed} className="flex items-center gap-2">
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Enhanced Tip */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🇨🇱 Consejo para Chile:</span>{" "}
            {currentQ.type === "open"
              ? inputMode === "voice-complete"
                ? "En modo hablado completo, el reconocimiento de voz se inicia automáticamente. Habla claramente sobre tu experiencia en el mercado laboral chileno."
                : "Para preguntas abiertas, menciona experiencias específicas del mercado laboral chileno. Puedes usar reconocimiento de voz o escribir. Considera aspectos culturales y regionales de Chile."
              : currentQ.type === "ranking"
                ? "Ordena según tu experiencia en el ambiente laboral chileno. Considera las particularidades de nuestra cultura empresarial."
                : currentQ.type === "checkbox"
                  ? "Selecciona todas las opciones que reflejen tu experiencia real en Chile. Considera diferentes tipos de empresas y regiones."
                  : currentQ.type === "slider"
                    ? "Ajusta según tu experiencia en el contexto laboral chileno. Considera las normas culturales y profesionales del país."
                    : "Elige la respuesta que mejor refleje tu comportamiento en el ambiente laboral chileno. Considera nuestra cultura empresarial y normas sociales."}
          </p>
        </div>
      </div>
    </div>
  )
}
