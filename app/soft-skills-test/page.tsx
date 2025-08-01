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
  Pause,
  RotateCcw,
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

// Conversational flow for voice-complete mode
const CONVERSATION_FLOW = [
  {
    id: "intro",
    category: "Introducción",
    systemMessage:
      "¡Hola! Soy tu asistente de evaluación de habilidades blandas. Vamos a tener una conversación natural sobre tus competencias profesionales en el contexto del mercado laboral chileno. No hay respuestas correctas o incorrectas, solo queremos conocerte mejor. ¿Estás listo para comenzar?",
    userPrompt: "Responde cuando estés listo para iniciar la evaluación",
    skills: [],
  },
  {
    id: "communication",
    category: "Comunicación",
    systemMessage:
      "Perfecto, comencemos. Me gustaría conocer sobre tu comunicación en el trabajo. Cuéntame, ¿cómo te sientes cuando tienes que presentar ideas o proyectos frente a tu equipo o jefes en Chile? ¿Hay alguna situación comunicacional que recuerdes especialmente, ya sea positiva o desafiante?",
    userPrompt: "Habla sobre tu experiencia comunicándote en el ambiente laboral chileno",
    skills: ["communication"],
  },
  {
    id: "leadership",
    category: "Liderazgo",
    systemMessage:
      "Interesante lo que me cuentas sobre comunicación. Ahora hablemos de liderazgo. En el contexto empresarial chileno, ¿has tenido oportunidades de liderar equipos o proyectos? Me gustaría que me cuentes sobre tu estilo de liderazgo. ¿Prefieres un enfoque más directo y tradicional, o te inclinas por un estilo más colaborativo y moderno?",
    userPrompt: "Describe tu experiencia y estilo de liderazgo en Chile",
    skills: ["leadership"],
  },
  {
    id: "teamwork",
    category: "Trabajo en Equipo",
    systemMessage:
      "Muy bien, ahora me gustaría conocer sobre tu trabajo en equipo. En Chile tenemos una cultura laboral bastante colaborativa. ¿Cómo te adaptas a trabajar con personas de diferentes regiones del país o backgrounds socioeconómicos? ¿Qué rol sueles tomar naturalmente en los equipos de trabajo?",
    userPrompt: "Comparte tu experiencia trabajando en equipos diversos en Chile",
    skills: ["teamwork"],
  },
  {
    id: "problem_solving",
    category: "Resolución de Problemas",
    systemMessage:
      "Excelente. Ahora hablemos de cómo resuelves problemas. En el mercado laboral chileno, a menudo enfrentamos desafíos únicos. ¿Puedes contarme sobre algún problema complejo que hayas resuelto en tu trabajo? ¿Cómo fue tu proceso? ¿Prefieres seguir procedimientos establecidos o buscar soluciones innovadoras?",
    userPrompt: "Describe tu enfoque para resolver problemas complejos en el contexto chileno",
    skills: ["problemSolving"],
  },
  {
    id: "adaptability",
    category: "Adaptabilidad",
    systemMessage:
      "Me parece muy interesante tu enfoque. Ahora, sobre adaptabilidad. El mercado laboral chileno ha cambiado mucho, especialmente con la transformación digital y los cambios post-pandemia. ¿Cómo has manejado estos cambios? ¿Qué tan cómodo te sientes adaptándote a nuevas tecnologías, modalidades de trabajo, o cambios en regulaciones laborales?",
    userPrompt: "Habla sobre tu capacidad de adaptación a los cambios del mercado chileno",
    skills: ["adaptability"],
  },
  {
    id: "emotional_intelligence",
    category: "Inteligencia Emocional",
    systemMessage:
      "Perfecto. Ahora me gustaría conocer sobre tu inteligencia emocional. En la cultura laboral chilena, las relaciones personales son muy importantes. ¿Cómo manejas las emociones en el trabajo, tanto las tuyas como las de tus colegas? ¿Has enfrentado situaciones emocionalmente desafiantes en tu ambiente laboral?",
    userPrompt: "Comparte tu experiencia manejando emociones en el trabajo en Chile",
    skills: ["emotionalIntelligence"],
  },
  {
    id: "time_management",
    category: "Gestión del Tiempo",
    systemMessage:
      "Muy bien, para finalizar, hablemos de gestión del tiempo. En Chile tenemos nuestras particularidades, como los horarios de almuerzo, los feriados largos, y el balance vida-trabajo. ¿Cómo organizas tu tiempo? ¿Qué estrategias usas para ser productivo considerando el ritmo laboral chileno?",
    userPrompt: "Describe tu sistema de gestión del tiempo adaptado al contexto chileno",
    skills: ["timeManagement"],
  },
  {
    id: "conclusion",
    category: "Conclusión",
    systemMessage:
      "Excelente, hemos terminado nuestra conversación. Ha sido muy enriquecedor conocer sobre tus habilidades blandas y cómo las aplicas en el contexto laboral chileno. Ahora voy a procesar toda la información que me has compartido para generar tu perfil personalizado de competencias. ¡Muchas gracias por tu tiempo y honestidad!",
    userPrompt: "Puedes agregar cualquier comentario final o simplemente decir que has terminado",
    skills: [
      "communication",
      "leadership",
      "teamwork",
      "problemSolving",
      "adaptability",
      "emotionalIntelligence",
      "timeManagement",
    ],
  },
]

// Enhanced Speech Recognition Hook
const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
    }
    return () => clearAllTimers()
  }, [])

  const clearAllTimers = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current)
      initTimeoutRef.current = null
    }
  }

  const startListening = () => {
    if (!isSupported || isListening || isInitializing) return

    try {
      setIsInitializing(true)
      setError(null)

      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "es-ES"
      recognition.maxAlternatives = 3

      let hasReceivedFinalResult = false

      recognition.onstart = () => {
        setIsListening(true)
        setIsInitializing(false)
        hasReceivedFinalResult = false
        if (initTimeoutRef.current) {
          clearTimeout(initTimeoutRef.current)
          initTimeoutRef.current = null
        }
      }

      recognition.onspeechend = () => {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }
        silenceTimerRef.current = setTimeout(() => {
          if (recognition && isListening) {
            recognition.stop()
          }
        }, 3000)
      }

      recognition.onresult = (event: any) => {
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
          setTranscript((prev) => prev + finalTranscript + " ")
          setInterimTranscript("")
        } else {
          setInterimTranscript(interimTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        if (hasReceivedFinalResult && (event.error === "no-speech" || event.error === "aborted")) {
          return
        }
        setIsListening(false)
        setIsInitializing(false)

        switch (event.error) {
          case "not-allowed":
            setError("Permisos de micrófono denegados. Por favor, permite el acceso al micrófono.")
            break
          case "network":
            setError("Error de conexión. Verifica tu conexión a internet.")
            break
          case "no-speech":
            if (!hasReceivedFinalResult) {
              setError("No se detectó voz. Intenta hablar más cerca del micrófono.")
            }
            break
          default:
            setError(`Error de reconocimiento de voz: ${event.error}`)
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        setInterimTranscript("")
        setIsInitializing(false)
        clearAllTimers()
      }

      recognitionRef.current = recognition
      recognition.start()

      initTimeoutRef.current = setTimeout(() => {
        if (isInitializing) {
          recognition.stop()
          setError("No se pudo inicializar el reconocimiento de voz.")
          setIsInitializing(false)
        }
      }, 10000)
    } catch (error) {
      setError("Error al inicializar el reconocimiento de voz.")
      setIsInitializing(false)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && (isListening || isInitializing)) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    clearAllTimers()
    setIsListening(false)
    setIsInitializing(false)
    setInterimTranscript("")
  }

  const clearTranscript = () => {
    setTranscript("")
    setInterimTranscript("")
    setError(null)
  }

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    isInitializing,
    startListening,
    stopListening,
    clearTranscript,
  }
}

// Text-to-Speech Hook
const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setIsSupported(true)

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }

      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  const speak = (text: string) => {
    if (!isSupported) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Try to find a Spanish voice
    const spanishVoice = voices.find(
      (voice) => voice.lang.startsWith("es") || voice.name.toLowerCase().includes("spanish"),
    )

    if (spanishVoice) {
      utterance.voice = spanishVoice
    }

    utterance.lang = "es-ES"
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return { speak, stop, isSpeaking, isSupported }
}

export default function SoftSkillsTestPage() {
  const router = useRouter()
  const { t } = useLanguage()

  // Mode selection
  const [inputMode, setInputMode] = useState<InputMode>("mixed")
  const [showModeSelection, setShowModeSelection] = useState(true)

  // Traditional mode states
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [helpUsed, setHelpUsed] = useState<Set<number>>(new Set())
  const [reformulated, setReformulated] = useState<Set<number>>(new Set())
  const [currentReformulation, setCurrentReformulation] = useState<Record<number, number>>({})
  const [showTips, setShowTips] = useState(false)

  // Conversational mode states
  const [currentStep, setCurrentStep] = useState(0)
  const [conversationAnswers, setConversationAnswers] = useState<Record<string, string>>({})
  const [isConversationActive, setIsConversationActive] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showCountdown, setShowCountdown] = useState(false)

  // Speech recognition and synthesis
  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported: speechRecognitionSupported,
    error: speechError,
    isInitializing,
    startListening,
    stopListening,
    clearTranscript,
  } = useSpeechRecognition()

  const { speak, stop: stopSpeaking, isSpeaking, isSupported: textToSpeechSupported } = useTextToSpeech()

  // Auto-start conversation when step changes in voice-complete mode
  useEffect(() => {
    if (inputMode === "voice-complete" && isConversationActive && !isSpeaking && !isListening) {
      const currentStepData = CONVERSATION_FLOW[currentStep]
      if (currentStepData && currentStepData.systemMessage) {
        // Start countdown before speaking
        setShowCountdown(true)
        setCountdown(3)

        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval)
              setShowCountdown(false)
              // Start speaking after countdown
              setTimeout(() => {
                speak(currentStepData.systemMessage)
              }, 500)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }
  }, [currentStep, inputMode, isConversationActive, isSpeaking, isListening, speak])

  // Auto-start listening after system finishes speaking
  useEffect(() => {
    if (inputMode === "voice-complete" && !isSpeaking && isConversationActive && speechRecognitionSupported) {
      const timer = setTimeout(() => {
        if (!isListening && !isInitializing) {
          startListening()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [
    isSpeaking,
    isConversationActive,
    inputMode,
    speechRecognitionSupported,
    isListening,
    isInitializing,
    startListening,
  ])

  // Save conversation answer when transcript changes
  useEffect(() => {
    if (inputMode === "voice-complete" && transcript) {
      const currentStepData = CONVERSATION_FLOW[currentStep]
      if (currentStepData) {
        setConversationAnswers((prev) => ({
          ...prev,
          [currentStepData.id]: transcript.trim(),
        }))
      }
    }
  }, [transcript, currentStep, inputMode])

  const handleStartTest = (mode: InputMode) => {
    setInputMode(mode)
    setShowModeSelection(false)

    if (mode === "voice-complete") {
      setIsConversationActive(true)
      setCurrentStep(0)
    } else {
      setIsStarted(true)
    }
  }

  const handleNextConversationStep = () => {
    if (currentStep < CONVERSATION_FLOW.length - 1) {
      setCurrentStep((prev) => prev + 1)
      clearTranscript()
      if (isListening) {
        stopListening()
      }
      if (isSpeaking) {
        stopSpeaking()
      }
    } else {
      handleCompleteConversation()
    }
  }

  const handlePreviousConversationStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      clearTranscript()
      if (isListening) {
        stopListening()
      }
      if (isSpeaking) {
        stopSpeaking()
      }
    }
  }

  const handleRestartCurrentStep = () => {
    clearTranscript()
    if (isListening) {
      stopListening()
    }
    if (isSpeaking) {
      stopSpeaking()
    }

    // Restart the current step
    const currentStepData = CONVERSATION_FLOW[currentStep]
    if (currentStepData) {
      setTimeout(() => {
        speak(currentStepData.systemMessage)
      }, 500)
    }
  }

  const handleCompleteConversation = async () => {
    setIsCompleting(true)

    if (isListening) {
      stopListening()
    }
    if (isSpeaking) {
      stopSpeaking()
    }

    // Process conversational answers
    const results = processConversationalAnswers(conversationAnswers)

    localStorage.setItem("softSkillsResults", JSON.stringify(results))

    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/soft-skills-results")
  }

  // Traditional question handling functions
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

  const handleComplete = async () => {
    setIsCompleting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    const results = calculateResults()
    localStorage.setItem("softSkillsResults", JSON.stringify(results))
    router.push("/soft-skills-results")
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

  // Process conversational answers into skill scores
  const processConversationalAnswers = (answers: Record<string, string>): SoftSkillsResults => {
    const skillScores = {
      communication: 0,
      leadership: 0,
      teamwork: 0,
      problemSolving: 0,
      adaptability: 0,
      emotionalIntelligence: 0,
      timeManagement: 0,
    }

    // Analyze each answer for skill indicators
    Object.entries(answers).forEach(([stepId, answer]) => {
      const step = CONVERSATION_FLOW.find((s) => s.id === stepId)
      if (!step || !answer) return

      const text = answer.toLowerCase()
      const words = text.split(/\s+/).filter((word) => word.length > 2)
      const wordCount = words.length

      // Base score from response length and detail
      const baseScore = Math.min(85, Math.max(40, (wordCount / 20) * 60 + 25))

      // Skill-specific keyword analysis
      step.skills.forEach((skill) => {
        const keywords = getSkillKeywords(skill)
        const keywordMatches = keywords.filter((keyword) => text.includes(keyword)).length
        const keywordBonus = Math.min(15, keywordMatches * 3)

        skillScores[skill as keyof typeof skillScores] = Math.min(100, baseScore + keywordBonus)
      })
    })

    // Ensure all skills have at least a base score
    Object.keys(skillScores).forEach((skill) => {
      if (skillScores[skill as keyof typeof skillScores] === 0) {
        skillScores[skill as keyof typeof skillScores] = 60 // Default neutral score
      }
    })

    const overallScore = Math.round(Object.values(skillScores).reduce((sum, score) => sum + score, 0) / 7)

    const results = Object.entries(skillScores).map(([skill, score]) => ({
      category: skill.charAt(0).toUpperCase() + skill.slice(1),
      score,
      level: Math.floor(score / 20) + 1,
    }))

    return {
      ...skillScores,
      overallScore,
      completedAt: new Date().toISOString(),
      totalQuestions: CONVERSATION_FLOW.length,
      answeredQuestions: Object.keys(answers).length,
      results,
    }
  }

  const getSkillKeywords = (skill: string): string[] => {
    const keywordMap: Record<string, string[]> = {
      communication: [
        "comunicar",
        "hablar",
        "explicar",
        "presentar",
        "escuchar",
        "mensaje",
        "reunión",
        "equipo",
        "claro",
        "entender",
        "expresar",
        "dialogar",
        "conversar",
        "feedback",
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
        "delegar",
        "inspirar",
        "coordinar",
        "gestionar",
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
        "sinergia",
        "coordinación",
        "integración",
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
        "innovar",
        "optimizar",
        "mejorar",
        "eficiencia",
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
        "transformar",
        "actualizar",
        "innovación",
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
        "inteligencia",
        "autocontrol",
        "motivación",
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
        "calendario",
        "agenda",
        "programar",
      ],
    }

    return keywordMap[skill] || []
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

  // Mode Selection Screen
  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Evaluación de Habilidades Blandas</h1>
            <p className="text-xl text-gray-600 mb-8">Elige tu método de evaluación preferido</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mixed Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  Cuestionario Tradicional
                </CardTitle>
                <CardDescription>Preguntas estructuradas con opciones específicas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    35 preguntas estructuradas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Diferentes tipos: escalas, ranking, múltiple opción
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Control total sobre el ritmo
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Sistema de ayuda contextual
                  </div>
                </div>
                <Button onClick={() => handleStartTest("mixed")} className="w-full" variant="outline">
                  <Keyboard className="w-4 h-4 mr-2" />
                  Elegir Cuestionario
                </Button>
              </CardContent>
            </Card>

            {/* Voice Complete Mode */}
            <Card
              className={`cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300 ${
                !speechRecognitionSupported || !textToSpeechSupported ? "opacity-50" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-green-600" />
                  </div>
                  Conversación Natural
                </CardTitle>
                <CardDescription>Conversación completamente hablada con el asistente de IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Conversación natural y fluida
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    El sistema habla automáticamente
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Respuestas libres y espontáneas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Evaluación más natural y humana
                  </div>
                </div>
                <Button
                  onClick={() => handleStartTest("voice-complete")}
                  className="w-full"
                  disabled={!speechRecognitionSupported || !textToSpeechSupported}
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Elegir Conversación
                </Button>
                {(!speechRecognitionSupported || !textToSpeechSupported) && (
                  <p className="text-xs text-amber-600 text-center">
                    Funciones de voz no disponibles en este navegador
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Conversational Mode Interface
  if (inputMode === "voice-complete") {
    const currentStepData = CONVERSATION_FLOW[currentStep]
    const progress = ((currentStep + 1) / CONVERSATION_FLOW.length) * 100

    if (isCompleting) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
                  <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                </div>
                <Heart className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Procesando tu conversación...</h3>
                <p className="text-muted-foreground">
                  Analizando tus respuestas y generando tu perfil de habilidades blandas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Conversación sobre Habilidades Blandas</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Volume2 className="w-3 h-3 mr-1" />
                Conversación Natural
              </Badge>
            </div>
            <p className="text-gray-600">
              Paso {currentStep + 1} de {CONVERSATION_FLOW.length} • {currentStepData?.category}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso de la conversación</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Countdown */}
          {showCountdown && countdown > 0 && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Card className="p-8">
                <CardContent className="text-center">
                  <div className="text-6xl font-bold text-blue-600 mb-4">{countdown}</div>
                  <p className="text-lg text-gray-600">El asistente hablará en...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Conversation Card */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{currentStepData?.category}</CardTitle>
                  <CardDescription>Conversación natural sobre tus habilidades</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isSpeaking && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                      Hablando
                    </Badge>
                  )}
                  {isListening && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      <Mic className="w-3 h-3 mr-1 animate-pulse" />
                      Escuchando
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* System Message */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-900 mb-2">Asistente de Evaluación:</h4>
                    <p className="text-green-800 leading-relaxed">{currentStepData?.systemMessage}</p>
                  </div>
                </div>
              </div>

              {/* User Response Area */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mic className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-2">Tu respuesta:</h4>
                    <div className="min-h-[100px] bg-white rounded-lg p-3 border">
                      {transcript && <p className="text-gray-900 mb-2">{transcript}</p>}
                      {interimTranscript && <p className="text-gray-600 italic">{interimTranscript}</p>}
                      {!transcript && !interimTranscript && !isListening && (
                        <p className="text-gray-500 italic">
                          {isSpeaking
                            ? "Escucha al asistente y luego responde..."
                            : "Tu respuesta aparecerá aquí cuando hables..."}
                        </p>
                      )}
                      {isListening && !transcript && !interimTranscript && (
                        <p className="text-blue-600 italic flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          Escuchando... Habla ahora
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Speech Error */}
              {speechError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{speechError}</AlertDescription>
                </Alert>
              )}

              {/* Controls */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestartCurrentStep}
                  disabled={isInitializing}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <RotateCcw className="w-4 h-4" />
                  Repetir pregunta
                </Button>

                {isListening && (
                  <Button variant="destructive" size="sm" onClick={stopListening} className="flex items-center gap-2">
                    <MicOff className="w-4 h-4" />
                    Detener grabación
                  </Button>
                )}

                {isSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={stopSpeaking}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Pause className="w-4 h-4" />
                    Pausar asistente
                  </Button>
                )}

                {transcript && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearTranscript}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpiar respuesta
                  </Button>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreviousConversationStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <Button onClick={handleNextConversationStep} className="flex items-center gap-2">
                  {currentStep === CONVERSATION_FLOW.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Finalizar Conversación
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4" />
                Consejos para la conversación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2">Durante la conversación:</h4>
                  <ul className="space-y-1">
                    <li>• Responde de forma natural y espontánea</li>
                    <li>• Comparte experiencias específicas del trabajo en Chile</li>
                    <li>• No hay respuestas correctas o incorrectas</li>
                    <li>• Puedes tomarte el tiempo que necesites</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Aspectos técnicos:</h4>
                  <ul className="space-y-1">
                    <li>• El sistema se detiene automáticamente tras 3 segundos de silencio</li>
                    <li>• Puedes repetir la pregunta si no la escuchaste bien</li>
                    <li>• Habla claramente y en un ambiente silencioso</li>
                    <li>• Puedes navegar entre pasos si necesitas volver atrás</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Traditional Mode - Start Screen
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

              <Button onClick={() => setIsStarted(true)} className="w-full" size="lg">
                Comenzar Evaluación Tradicional
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Traditional Mode - Main Interface
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

  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin">
                <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <Heart className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Analizando tus habilidades blandas...</h3>
              <p className="text-muted-foreground">Procesando tus respuestas y generando tu perfil de competencias</p>
            </div>
          </CardContent>
        </Card>
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
              <Settings className="w-3 h-3 mr-1" />
              Cuestionario Tradicional
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
                      {speechRecognitionSupported && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Volume2 className="w-3 h-3 mr-1" />
                          Voz Disponible
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
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {(answers[currentQ.id]?.toString() || "").length} caracteres
                  </div>
                </div>

                {/* Speech Recognition Controls */}
                {speechRecognitionSupported && (
                  <div className="space-y-3">
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
                          onClick={clearTranscript}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Limpiar
                        </Button>
                      )}
                    </div>

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
                            <span>{transcript.split(" ").filter((w) => w.length > 0).length} palabras</span>
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
                          <li>• Puedes combinar voz y escritura en la misma respuesta</li>
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
              ? "Para preguntas abiertas, menciona experiencias específicas del mercado laboral chileno. Puedes usar reconocimiento de voz o escribir. Considera aspectos culturales y regionales de Chile."
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
