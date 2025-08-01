"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Brain,
  Heart,
  Users,
  Shield,
  Target,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Mic,
  MicOff,
  Trash2,
  Volume2,
  AlertCircle,
  Settings,
  Keyboard,
  Pause,
  RotateCcw,
  Info,
  HelpCircle,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

type InputMode = "mixed" | "voice-complete"
type QuestionType = "likert" | "multiple" | "slider" | "binary"

interface PersonalityQuestion {
  id: number
  text: string
  type: QuestionType
  trait: keyof typeof PERSONALITY_TRAITS
  reverse?: boolean
  options?: string[]
  min?: number
  max?: number
  help?: string
}

// Big Five personality traits
const PERSONALITY_TRAITS = {
  openness: { name: "Apertura", icon: Brain, color: "bg-purple-500" },
  conscientiousness: { name: "Responsabilidad", icon: Target, color: "bg-blue-500" },
  extraversion: { name: "Extraversión", icon: Users, color: "bg-green-500" },
  agreeableness: { name: "Amabilidad", icon: Heart, color: "bg-pink-500" },
  neuroticism: { name: "Neuroticismo", icon: Shield, color: "bg-red-500" },
}

// Structured personality questions based on Big Five model
const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  // Openness to Experience (4 questions)
  {
    id: 1,
    text: "Me gusta explorar ideas nuevas y conceptos abstractos",
    type: "likert",
    trait: "openness",
    help: "Reflexiona sobre tu curiosidad intelectual y apertura a nuevas experiencias mentales",
  },
  {
    id: 2,
    text: "Disfruto de actividades artísticas y creativas",
    type: "likert",
    trait: "openness",
    help: "Considera tu interés en arte, música, literatura o cualquier expresión creativa",
  },
  {
    id: 3,
    text: "Prefiero las rutinas familiares antes que probar cosas nuevas",
    type: "likert",
    trait: "openness",
    reverse: true,
    help: "Piensa en tu comodidad con lo conocido versus tu deseo de novedad",
  },
  {
    id: 4,
    text: "¿Qué tan importante es para ti la originalidad y la innovación?",
    type: "slider",
    trait: "openness",
    min: 1,
    max: 10,
    help: "Evalúa cuánto valoras ser único y crear cosas nuevas",
  },

  // Conscientiousness (4 questions)
  {
    id: 5,
    text: "Siempre completo las tareas que empiezo",
    type: "likert",
    trait: "conscientiousness",
    help: "Reflexiona sobre tu persistencia y seguimiento de compromisos",
  },
  {
    id: 6,
    text: "Soy muy organizado y mantengo mis cosas en orden",
    type: "likert",
    trait: "conscientiousness",
    help: "Considera tu nivel de organización personal y del espacio de trabajo",
  },
  {
    id: 7,
    text: "A menudo dejo las cosas para el último momento",
    type: "likert",
    trait: "conscientiousness",
    reverse: true,
    help: "Piensa en tu tendencia a procrastinar o planificar con anticipación",
  },
  {
    id: 8,
    text: "¿Cómo calificarías tu nivel de autodisciplina?",
    type: "slider",
    trait: "conscientiousness",
    min: 1,
    max: 10,
    help: "Evalúa tu capacidad de autocontrol y seguimiento de metas",
  },

  // Extraversion (4 questions)
  {
    id: 9,
    text: "Me siento cómodo siendo el centro de atención",
    type: "likert",
    trait: "extraversion",
    help: "Reflexiona sobre tu comodidad en situaciones sociales prominentes",
  },
  {
    id: 10,
    text: "Prefiero trabajar en equipo que solo",
    type: "likert",
    trait: "extraversion",
    help: "Considera tu preferencia por colaboración versus trabajo independiente",
  },
  {
    id: 11,
    text: "Me considero una persona reservada y callada",
    type: "likert",
    trait: "extraversion",
    reverse: true,
    help: "Piensa en tu nivel de expresividad y comunicación social",
  },
  {
    id: 12,
    text: "¿De dónde obtienes principalmente tu energía?",
    type: "multiple",
    trait: "extraversion",
    options: [
      "De estar con otras personas y socializar",
      "De momentos de soledad y reflexión",
      "De un equilibrio entre ambos",
      "Depende de la situación específica",
    ],
    help: "Reflexiona sobre qué actividades te recargan emocionalmente",
  },

  // Agreeableness (4 questions)
  {
    id: 13,
    text: "Trato de ayudar a otros siempre que puedo",
    type: "likert",
    trait: "agreeableness",
    help: "Considera tu tendencia natural a apoyar y asistir a otros",
  },
  {
    id: 14,
    text: "Confío en las personas hasta que me demuestren lo contrario",
    type: "likert",
    trait: "agreeableness",
    help: "Reflexiona sobre tu nivel inicial de confianza en otros",
  },
  {
    id: 15,
    text: "Prefiero competir que colaborar",
    type: "likert",
    trait: "agreeableness",
    reverse: true,
    help: "Piensa en tu orientación hacia la competencia versus cooperación",
  },
  {
    id: 16,
    text: "¿Cómo manejas típicamente los conflictos interpersonales?",
    type: "multiple",
    trait: "agreeableness",
    options: [
      "Busco soluciones que beneficien a todos",
      "Defiendo firmemente mi posición",
      "Trato de evitar el conflicto",
      "Analizo objetivamente la situación",
    ],
    help: "Reflexiona sobre tu estilo natural de resolución de conflictos",
  },

  // Neuroticism (4 questions)
  {
    id: 17,
    text: "Me preocupo frecuentemente por cosas que podrían salir mal",
    type: "likert",
    trait: "neuroticism",
    help: "Considera tu tendencia a anticipar problemas o dificultades",
  },
  {
    id: 18,
    text: "Mantengo la calma bajo presión",
    type: "likert",
    trait: "neuroticism",
    reverse: true,
    help: "Reflexiona sobre tu estabilidad emocional en situaciones estresantes",
  },
  {
    id: 19,
    text: "Mis emociones cambian frecuentemente durante el día",
    type: "likert",
    trait: "neuroticism",
    help: "Piensa en la estabilidad de tu estado emocional",
  },
  {
    id: 20,
    text: "¿Qué tan bien manejas el estrés y la ansiedad?",
    type: "slider",
    trait: "neuroticism",
    min: 1,
    max: 10,
    reverse: true,
    help: "Evalúa tu capacidad de gestión emocional en situaciones difíciles",
  },
]

// Conversational flow for personality assessment
const PERSONALITY_CONVERSATION_FLOW = [
  {
    id: "intro",
    category: "Introducción",
    systemMessage:
      "¡Hola! Soy tu asistente especializado en evaluación de personalidad. Vamos a tener una conversación natural para conocer mejor tu personalidad y cómo te relacionas con el mundo. Esta evaluación se basa en el modelo de los Cinco Grandes factores de personalidad. No hay respuestas correctas o incorrectas, solo queremos conocerte mejor. ¿Estás listo para comenzar?",
    userPrompt: "Responde cuando estés listo para iniciar la evaluación de personalidad",
    traits: [],
  },
  {
    id: "openness",
    category: "Apertura a la Experiencia",
    systemMessage:
      "Perfecto, comencemos explorando tu apertura a nuevas experiencias. Me gustaría conocer qué tan curioso eres y cómo te relacionas con lo nuevo y lo creativo. ¿Te consideras una persona creativa? ¿Disfrutas explorando ideas nuevas, arte, o conceptos abstractos? ¿Cómo reaccionas cuando te enfrentas a situaciones completamente nuevas o desconocidas?",
    userPrompt: "Habla sobre tu curiosidad, creatividad y cómo te relacionas con nuevas experiencias",
    traits: ["openness"],
  },
  {
    id: "conscientiousness",
    category: "Responsabilidad y Organización",
    systemMessage:
      "Interesante lo que me cuentas sobre tu apertura. Ahora me gustaría conocer sobre tu nivel de organización y responsabilidad. ¿Cómo planificas tu día a día? ¿Te consideras una persona ordenada y meticulosa, o más bien espontánea y flexible? ¿Cómo manejas los plazos y compromisos? ¿Qué estrategias usas para lograr tus objetivos?",
    userPrompt: "Describe tu nivel de organización, planificación y cómo manejas responsabilidades",
    traits: ["conscientiousness"],
  },
  {
    id: "extraversion",
    category: "Extraversión y Sociabilidad",
    systemMessage:
      "Muy bien, ahora hablemos sobre tu sociabilidad y energía. ¿Cómo te sientes en grupos grandes de personas? ¿Prefieres liderar conversaciones o escuchar más? ¿De dónde obtienes tu energía: de estar con otros o de momentos de soledad? ¿Cómo te comportas en fiestas o eventos sociales? ¿Te gusta ser el centro de atención?",
    userPrompt: "Comparte cómo te relacionas socialmente y de dónde obtienes tu energía",
    traits: ["extraversion"],
  },
  {
    id: "agreeableness",
    category: "Amabilidad y Cooperación",
    systemMessage:
      "Excelente. Ahora me gustaría conocer sobre tu forma de relacionarte con otros. ¿Cómo manejas los conflictos? ¿Tiendes a confiar en las personas fácilmente o eres más cauteloso? ¿Te consideras competitivo o más bien cooperativo? ¿Cómo reaccionas cuando alguien necesita ayuda? ¿Qué tan importante es para ti mantener la armonía en tus relaciones?",
    userPrompt: "Habla sobre cómo manejas relaciones, conflictos y tu nivel de confianza en otros",
    traits: ["agreeableness"],
  },
  {
    id: "neuroticism",
    category: "Estabilidad Emocional",
    systemMessage:
      "Para finalizar, me gustaría conocer sobre tu estabilidad emocional y cómo manejas el estrés. ¿Cómo reaccionas bajo presión? ¿Te preocupas mucho por las cosas o tiendes a mantener la calma? ¿Cómo manejas la ansiedad o los momentos difíciles? ¿Qué estrategias usas para relajarte y mantener el equilibrio emocional?",
    userPrompt: "Describe cómo manejas el estrés, las emociones y mantienes tu equilibrio",
    traits: ["neuroticism"],
  },
  {
    id: "conclusion",
    category: "Conclusión",
    systemMessage:
      "Excelente, hemos terminado nuestra conversación sobre personalidad. Ha sido muy enriquecedor conocer sobre tu forma de ser, tus preferencias y cómo te relacionas con el mundo. Ahora voy a procesar toda la información que me has compartido para generar tu perfil personalizado de personalidad basado en los Cinco Grandes factores. ¡Muchas gracias por compartir tanto sobre ti!",
    userPrompt: "Puedes agregar cualquier comentario final sobre tu personalidad",
    traits: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"],
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

export default function PersonalityTestPage() {
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
  const [showHelp, setShowHelp] = useState<number | null>(null)

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
      const currentStepData = PERSONALITY_CONVERSATION_FLOW[currentStep]
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
      const currentStepData = PERSONALITY_CONVERSATION_FLOW[currentStep]
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

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < PERSONALITY_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setShowHelp(null)
    } else {
      handleCompleteTraditionalTest()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setShowHelp(null)
    }
  }

  const handleCompleteTraditionalTest = async () => {
    setIsCompleting(true)

    // Process traditional answers
    const results = processTraditionalAnswers(answers)

    localStorage.setItem("personalityResults", JSON.stringify(results))

    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/personality-results")
  }

  const processTraditionalAnswers = (answers: Record<number, any>) => {
    const traitScores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    }

    const traitCounts = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    }

    // Process each answer
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = PERSONALITY_QUESTIONS.find((q) => q.id === Number.parseInt(questionId))
      if (!question || answer === undefined) return

      let score = 0

      // Convert answer to score based on question type
      switch (question.type) {
        case "likert":
          score = Number.parseInt(answer) // 1-5 scale
          break
        case "slider":
          score = (Number.parseInt(answer) / (question.max || 10)) * 5 // Convert to 1-5 scale
          break
        case "multiple":
          // Score based on option selected (simplified)
          score =
            question.trait === "extraversion"
              ? answer === "0"
                ? 5
                : answer === "1"
                  ? 2
                  : answer === "2"
                    ? 3.5
                    : 3
              : 3.5 // Default neutral score for other traits
          break
        case "binary":
          score = answer === "true" ? 5 : 1
          break
        default:
          score = 3 // Neutral
      }

      // Apply reverse scoring if needed
      if (question.reverse) {
        score = 6 - score
      }

      // Convert to 0-100 scale and add to trait
      const normalizedScore = ((score - 1) / 4) * 100
      traitScores[question.trait] += normalizedScore
      traitCounts[question.trait]++
    })

    // Calculate averages
    Object.keys(traitScores).forEach((trait) => {
      const traitKey = trait as keyof typeof traitScores
      if (traitCounts[traitKey] > 0) {
        traitScores[traitKey] = Math.round(traitScores[traitKey] / traitCounts[traitKey])
      } else {
        traitScores[traitKey] = 60 // Default neutral score
      }
    })

    const overallScore = Math.round(Object.values(traitScores).reduce((sum, score) => sum + score, 0) / 5)

    return {
      ...traitScores,
      overallScore,
      completedAt: new Date().toISOString(),
      totalQuestions: PERSONALITY_QUESTIONS.length,
      answeredQuestions: Object.keys(answers).length,
      type: "personality",
      inputMode,
    }
  }

  const handleNextConversationStep = () => {
    if (currentStep < PERSONALITY_CONVERSATION_FLOW.length - 1) {
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
    const currentStepData = PERSONALITY_CONVERSATION_FLOW[currentStep]
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

    localStorage.setItem("personalityResults", JSON.stringify(results))

    await new Promise((resolve) => setTimeout(resolve, 2000))
    router.push("/personality-results")
  }

  // Process conversational answers into personality scores
  const processConversationalAnswers = (answers: Record<string, string>) => {
    const traitScores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    }

    // Analyze each answer for personality trait indicators
    Object.entries(answers).forEach(([stepId, answer]) => {
      const step = PERSONALITY_CONVERSATION_FLOW.find((s) => s.id === stepId)
      if (!step || !answer) return

      const text = answer.toLowerCase()
      const words = text.split(/\s+/).filter((word) => word.length > 2)
      const wordCount = words.length

      // Base score from response length and detail
      const baseScore = Math.min(85, Math.max(35, (wordCount / 20) * 60 + 25))

      // Trait-specific keyword analysis
      step.traits.forEach((trait) => {
        const keywords = getPersonalityKeywords(trait)
        const keywordMatches = keywords.filter((keyword) => text.includes(keyword)).length
        const keywordBonus = Math.min(15, keywordMatches * 3)

        traitScores[trait as keyof typeof traitScores] = Math.min(100, baseScore + keywordBonus)
      })
    })

    // Ensure all traits have at least a base score
    Object.keys(traitScores).forEach((trait) => {
      if (traitScores[trait as keyof typeof traitScores] === 0) {
        traitScores[trait as keyof typeof traitScores] = 60 // Default neutral score
      }
    })

    const overallScore = Math.round(Object.values(traitScores).reduce((sum, score) => sum + score, 0) / 5)

    return {
      ...traitScores,
      overallScore,
      completedAt: new Date().toISOString(),
      totalQuestions: PERSONALITY_CONVERSATION_FLOW.length,
      answeredQuestions: Object.keys(answers).length,
      type: "personality",
      inputMode,
    }
  }

  const getPersonalityKeywords = (trait: string): string[] => {
    const keywordMap: Record<string, string[]> = {
      openness: [
        "creativo",
        "curioso",
        "imaginativo",
        "artístico",
        "innovador",
        "original",
        "abstracto",
        "nuevo",
        "diferente",
        "explorar",
        "experimentar",
        "aventura",
        "cambio",
        "ideas",
      ],
      conscientiousness: [
        "organizado",
        "responsable",
        "planificar",
        "disciplina",
        "orden",
        "meticuloso",
        "puntual",
        "compromiso",
        "objetivo",
        "meta",
        "estructura",
        "sistema",
        "eficiente",
        "productivo",
      ],
      extraversion: [
        "social",
        "extrovertido",
        "energético",
        "hablador",
        "grupo",
        "gente",
        "fiesta",
        "líder",
        "activo",
        "entusiasta",
        "optimista",
        "confiado",
        "asertivo",
        "dominante",
      ],
      agreeableness: [
        "amable",
        "cooperativo",
        "empático",
        "comprensivo",
        "ayudar",
        "generoso",
        "confianza",
        "armonía",
        "paz",
        "colaborar",
        "apoyo",
        "bondadoso",
        "considerado",
        "tolerante",
      ],
      neuroticism: [
        "estrés",
        "ansiedad",
        "preocupar",
        "nervioso",
        "emocional",
        "sensible",
        "inestable",
        "tensión",
        "presión",
        "miedo",
        "inseguro",
        "vulnerable",
        "irritable",
        "melancólico",
      ],
    }

    return keywordMap[trait] || []
  }

  const renderQuestionInput = (question: PersonalityQuestion) => {
    const currentAnswer = answers[question.id]

    switch (question.type) {
      case "likert":
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
            className="space-y-3"
          >
            {[
              { value: "1", label: "Totalmente en desacuerdo" },
              { value: "2", label: "En desacuerdo" },
              { value: "3", label: "Neutral" },
              { value: "4", label: "De acuerdo" },
              { value: "5", label: "Totalmente de acuerdo" },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`q${question.id}-${option.value}`} />
                <Label htmlFor={`q${question.id}-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "slider":
        return (
          <div className="space-y-4">
            <div className="px-3">
              <Slider
                value={[currentAnswer || (question.max || 10) / 2]}
                onValueChange={(value) => handleAnswerChange(question.id, value[0])}
                max={question.max || 10}
                min={question.min || 1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 px-3">
              <span>Muy bajo ({question.min || 1})</span>
              <span className="font-medium">Valor: {currentAnswer || Math.floor((question.max || 10) / 2)}</span>
              <span>Muy alto ({question.max || 10})</span>
            </div>
          </div>
        )

      case "multiple":
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`q${question.id}-${index}`} />
                <Label htmlFor={`q${question.id}-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "binary":
        return (
          <RadioGroup
            value={currentAnswer?.toString()}
            onValueChange={(value) => handleAnswerChange(question.id, value === "true")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`q${question.id}-true`} />
              <Label htmlFor={`q${question.id}-true`} className="cursor-pointer">
                Sí
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`q${question.id}-false`} />
              <Label htmlFor={`q${question.id}-false`} className="cursor-pointer">
                No
              </Label>
            </div>
          </RadioGroup>
        )

      default:
        return null
    }
  }

  // Mode Selection Screen
  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test de Personalidad</h1>
            <p className="text-xl text-gray-600 mb-8">Elige tu método de evaluación de personalidad preferido</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Mixed Mode */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-purple-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-purple-600" />
                  </div>
                  Cuestionario Estructurado
                </CardTitle>
                <CardDescription>20 preguntas específicas sobre rasgos de personalidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Basado en el modelo Big Five
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Preguntas validadas científicamente
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Evaluación precisa y detallada
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Control total sobre el ritmo
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
              className={`cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-pink-300 ${
                !speechRecognitionSupported || !textToSpeechSupported ? "opacity-50" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-pink-600" />
                  </div>
                  Conversación de Personalidad
                </CardTitle>
                <CardDescription>Conversación natural sobre tu forma de ser y personalidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Conversación completamente natural
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    El sistema habla automáticamente
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Evaluación más humana y personal
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Basado en los Cinco Grandes factores
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

  // Loading/Completing State
  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin">
                <div className="w-4 h-4 bg-purple-600 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
              </div>
              <Brain className="w-8 h-8 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Analizando tu personalidad...</h3>
              <p className="text-muted-foreground">
                {inputMode === "voice-complete"
                  ? "Procesando tu conversación y generando tu perfil de personalidad"
                  : "Procesando tus respuestas y calculando tu perfil de personalidad"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Traditional Mode Interface
  if (inputMode === "mixed" && isStarted) {
    const currentQuestionData = PERSONALITY_QUESTIONS[currentQuestion]
    const progress = ((currentQuestion + 1) / PERSONALITY_QUESTIONS.length) * 100
    const TraitIcon = PERSONALITY_TRAITS[currentQuestionData.trait].icon
    const isAnswered = answers[currentQuestionData.id] !== undefined

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Cuestionario de Personalidad</h1>
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                <Settings className="w-3 h-3 mr-1" />
                Estructurado
              </Badge>
            </div>
            <p className="text-gray-600">
              Pregunta {currentQuestion + 1} de {PERSONALITY_QUESTIONS.length} •{" "}
              {PERSONALITY_TRAITS[currentQuestionData.trait].name}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progreso del cuestionario</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 ${PERSONALITY_TRAITS[currentQuestionData.trait].color} rounded-full flex items-center justify-center`}
                >
                  <TraitIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{currentQuestionData.text}</CardTitle>
                  <CardDescription>Evaluando: {PERSONALITY_TRAITS[currentQuestionData.trait].name}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(showHelp === currentQuestionData.id ? null : currentQuestionData.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                  {isAnswered && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Respondida
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Help Text */}
              {showHelp === currentQuestionData.id && currentQuestionData.help && (
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-blue-800">{currentQuestionData.help}</AlertDescription>
                </Alert>
              )}

              {/* Question Input */}
              <div className="bg-white rounded-lg p-6 border">{renderQuestionInput(currentQuestionData)}</div>

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </Button>

                <Button onClick={handleNextQuestion} disabled={!isAnswered} className="flex items-center gap-2">
                  {currentQuestion === PERSONALITY_QUESTIONS.length - 1 ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Finalizar Test
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

          {/* Question Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4" />
                Progreso por rasgo de personalidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(PERSONALITY_TRAITS).map(([trait, info]) => {
                  const traitQuestions = PERSONALITY_QUESTIONS.filter((q) => q.trait === trait)
                  const answeredCount = traitQuestions.filter((q) => answers[q.id] !== undefined).length
                  const TraitIcon = info.icon

                  return (
                    <div key={trait} className="text-center">
                      <div
                        className={`w-10 h-10 ${info.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                      >
                        <TraitIcon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-medium text-sm mb-1">{info.name}</h4>
                      <p className="text-xs text-gray-600">
                        {answeredCount}/{traitQuestions.length} respondidas
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className={`${info.color} h-1.5 rounded-full transition-all duration-300`}
                          style={{ width: `${(answeredCount / traitQuestions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Conversational Mode Interface
  if (inputMode === "voice-complete") {
    const currentStepData = PERSONALITY_CONVERSATION_FLOW[currentStep]
    const progress = ((currentStep + 1) / PERSONALITY_CONVERSATION_FLOW.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Conversación de Personalidad</h1>
              <Badge variant="outline" className="bg-pink-50 text-pink-700">
                <Volume2 className="w-3 h-3 mr-1" />
                Conversación Natural
              </Badge>
            </div>
            <p className="text-gray-600">
              Paso {currentStep + 1} de {PERSONALITY_CONVERSATION_FLOW.length} • {currentStepData?.category}
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
                  <div className="text-6xl font-bold text-pink-600 mb-4">{countdown}</div>
                  <p className="text-lg text-gray-600">El asistente de personalidad hablará en...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Conversation Card */}
          <Card className="mb-8 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{currentStepData?.category}</CardTitle>
                  <CardDescription>Exploración de tu personalidad</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {isSpeaking && (
                    <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                      <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                      Hablando
                    </Badge>
                  )}
                  {isListening && (
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                      <Mic className="w-3 h-3 mr-1 animate-pulse" />
                      Escuchando
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* System Message */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-purple-900 mb-2">Asistente de Personalidad:</h4>
                    <p className="text-purple-800 leading-relaxed">{currentStepData?.systemMessage}</p>
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
                    <h4 className="font-medium text-blue-900 mb-2">Tu respuesta personal:</h4>
                    <div className="min-h-[100px] bg-white rounded-lg p-3 border">
                      {transcript && <p className="text-gray-900 mb-2">{transcript}</p>}
                      {interimTranscript && <p className="text-gray-600 italic">{interimTranscript}</p>}
                      {!transcript && !interimTranscript && !isListening && (
                        <p className="text-gray-500 italic">
                          {isSpeaking
                            ? "Escucha la pregunta y luego comparte sobre tu personalidad..."
                            : "Tu respuesta personal aparecerá aquí cuando hables..."}
                        </p>
                      )}
                      {isListening && !transcript && !interimTranscript && (
                        <p className="text-blue-600 italic flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          Escuchando... Comparte sobre tu personalidad
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
                  {currentStep === PERSONALITY_CONVERSATION_FLOW.length - 1 ? (
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

          {/* Personality Conversation Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4" />
                Consejos para la conversación de personalidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <h4 className="font-semibold mb-2">Durante la conversación:</h4>
                  <ul className="space-y-1">
                    <li>• Sé honesto y auténtico sobre tu forma de ser</li>
                    <li>• Comparte ejemplos específicos de tu comportamiento</li>
                    <li>• No hay respuestas correctas o incorrectas</li>
                    <li>• Reflexiona sobre cómo realmente te comportas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Aspectos a considerar:</h4>
                  <ul className="space-y-1">
                    <li>• Piensa en situaciones cotidianas y laborales</li>
                    <li>• Considera tanto tus fortalezas como áreas de mejora</li>
                    <li>• Reflexiona sobre cómo otros te perciben</li>
                    <li>• Comparte tanto preferencias como comportamientos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <p className="text-gray-600 mb-4">Error: Estado de test no válido</p>
          <Button onClick={() => setShowModeSelection(true)}>Volver a selección de modo</Button>
        </CardContent>
      </Card>
    </div>
  )
}
