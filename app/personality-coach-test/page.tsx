"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Brain,
  Mic,
  MicOff,
  Volume2,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
  RotateCcw,
  Pause,
  Play,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface ConversationStep {
  id: string
  category: string
  systemMessage: string
  userPrompt: string
  traits: string[]
  followUpQuestions?: string[]
}

const PERSONALITY_CONVERSATION_FLOW: ConversationStep[] = [
  {
    id: "intro",
    category: "Bienvenida",
    systemMessage:
      "¡Hola! Soy tu Coach de Personalidad con IA. Vamos a tener una conversación natural para conocer mejor tu personalidad y cómo te relacionas con el mundo profesional. Esta evaluación se basa en el modelo de los Cinco Grandes factores de personalidad, el más respaldado científicamente. No hay respuestas correctas o incorrectas, solo queremos conocerte mejor. ¿Estás listo para comenzar esta exploración de tu personalidad?",
    userPrompt: "Cuéntame un poco sobre ti y qué te motivó a realizar esta evaluación de personalidad",
    traits: [],
    followUpQuestions: [
      "¿Qué esperas descubrir sobre ti mismo?",
      "¿Has hecho tests de personalidad antes?",
      "¿Qué aspectos de tu personalidad te gustaría entender mejor?",
    ],
  },
  {
    id: "openness",
    category: "Apertura a la Experiencia",
    systemMessage:
      "Perfecto, ahora me gustaría explorar tu apertura a nuevas experiencias. Esta dimensión refleja tu curiosidad intelectual, creatividad y disposición hacia lo nuevo. En el contexto laboral chileno, la apertura es muy valorada en roles de innovación y adaptación al cambio. Cuéntame: ¿Te consideras una persona creativa? ¿Cómo reaccionas cuando te enfrentas a situaciones completamente nuevas o desconocidas? ¿Disfrutas explorando ideas abstractas o prefieres lo concreto y práctico?",
    userPrompt:
      "Habla sobre tu curiosidad, creatividad y cómo te relacionas con nuevas experiencias, tanto en lo personal como en lo profesional",
    traits: ["openness"],
    followUpQuestions: [
      "¿Qué tipo de actividades creativas disfrutas?",
      "¿Cómo te adaptas a los cambios en el trabajo?",
      "¿Prefieres seguir métodos probados o experimentar con nuevos enfoques?",
    ],
  },
  {
    id: "conscientiousness",
    category: "Responsabilidad y Organización",
    systemMessage:
      "Excelente. Ahora exploremos tu nivel de organización y responsabilidad. Esta dimensión es crucial en el mercado laboral chileno, donde se valora mucho la confiabilidad y el cumplimiento. ¿Cómo planificas tu día a día? ¿Te consideras una persona ordenada y meticulosa, o más bien espontánea y flexible? ¿Cómo manejas los plazos y compromisos? ¿Qué estrategias usas para lograr tus objetivos a largo plazo?",
    userPrompt: "Describe tu nivel de organización, planificación y cómo manejas responsabilidades y compromisos",
    traits: ["conscientiousness"],
    followUpQuestions: [
      "¿Cómo organizas tu espacio de trabajo?",
      "¿Qué haces cuando tienes múltiples proyectos con fechas límite?",
      "¿Prefieres planificar con detalle o improvisar sobre la marcha?",
    ],
  },
  {
    id: "extraversion",
    category: "Extraversión y Energía Social",
    systemMessage:
      "Muy interesante. Ahora hablemos sobre tu sociabilidad y de dónde obtienes tu energía. En Chile, donde las relaciones personales son fundamentales en los negocios, entender tu estilo social es clave. ¿Cómo te sientes en grupos grandes de personas? ¿Prefieres liderar conversaciones o escuchar más? ¿De dónde obtienes tu energía: de estar con otros o de momentos de soledad? ¿Cómo te comportas en eventos de networking o fiestas de la empresa?",
    userPrompt:
      "Comparte cómo te relacionas socialmente, de dónde obtienes tu energía y cómo te comportas en situaciones grupales",
    traits: ["extraversion"],
    followUpQuestions: [
      "¿Te gusta ser el centro de atención?",
      "¿Cómo recargas tu energía después de un día intenso?",
      "¿Prefieres trabajar en equipo o de forma independiente?",
    ],
  },
  {
    id: "agreeableness",
    category: "Amabilidad y Cooperación",
    systemMessage:
      "Perfecto. Ahora exploremos cómo te relacionas con otros y tu orientación hacia la cooperación. En la cultura laboral chilena, donde se valora el buen trato y la armonía, esto es especialmente relevante. ¿Cómo manejas los conflictos interpersonales? ¿Tiendes a confiar en las personas fácilmente o eres más cauteloso? ¿Te consideras más competitivo o cooperativo? ¿Cómo reaccionas cuando alguien necesita ayuda? ¿Qué tan importante es para ti mantener la armonía en tus relaciones?",
    userPrompt: "Habla sobre cómo manejas relaciones, conflictos y tu nivel de confianza y cooperación con otros",
    traits: ["agreeableness"],
    followUpQuestions: [
      "¿Cómo resuelves desacuerdos con colegas?",
      "¿Qué haces cuando ves que alguien está luchando con una tarea?",
      "¿Prefieres competir o colaborar para alcanzar objetivos?",
    ],
  },
  {
    id: "neuroticism",
    category: "Estabilidad Emocional",
    systemMessage:
      "Excelente. Para finalizar, me gustaría conocer sobre tu estabilidad emocional y cómo manejas el estrés. Esta dimensión es crucial para roles de liderazgo y trabajo bajo presión en el mercado chileno. ¿Cómo reaccionas bajo presión o en situaciones estresantes? ¿Te preocupas mucho por las cosas o tiendes a mantener la calma? ¿Cómo manejas la ansiedad o los momentos difíciles? ¿Qué estrategias usas para relajarte y mantener el equilibrio emocional?",
    userPrompt: "Describe cómo manejas el estrés, las emociones y mantienes tu equilibrio en situaciones desafiantes",
    traits: ["neuroticism"],
    followUpQuestions: [
      "¿Qué te ayuda a mantener la calma en situaciones difíciles?",
      "¿Cómo afecta el estrés a tu rendimiento laboral?",
      "¿Qué técnicas usas para manejar la ansiedad o preocupación?",
    ],
  },
  {
    id: "integration",
    category: "Integración y Reflexión",
    systemMessage:
      "Fantástico. Hemos explorado las cinco dimensiones principales de tu personalidad. Ahora me gustaría que reflexiones sobre cómo todos estos aspectos se integran en tu vida profesional. ¿Cómo crees que tu personalidad influye en tu estilo de trabajo? ¿Qué fortalezas identificas en ti mismo? ¿Hay algún aspecto de tu personalidad que te gustaría desarrollar más? ¿Cómo te ves aplicando estos insights en tu carrera en Chile?",
    userPrompt:
      "Reflexiona sobre cómo tu personalidad influye en tu trabajo, tus fortalezas principales y cómo planeas aplicar estos insights en tu desarrollo profesional",
    traits: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"],
    followUpQuestions: [
      "¿Qué aspectos de tu personalidad te han ayudado más en tu carrera?",
      "¿Hay algún rasgo que sientes que te ha limitado profesionalmente?",
      "¿Cómo planeas usar estos insights para tu próximo paso profesional?",
    ],
  },
  {
    id: "conclusion",
    category: "Conclusión y Próximos Pasos",
    systemMessage:
      "Excelente, hemos completado una exploración profunda de tu personalidad. Ha sido muy enriquecedor conocer sobre tu forma de ser, tus preferencias y cómo te relacionas con el mundo profesional. Ahora voy a procesar toda la información que me has compartido para generar tu perfil personalizado de personalidad basado en los Cinco Grandes factores, junto con recomendaciones específicas para el mercado laboral chileno. ¿Hay algo más sobre tu personalidad o aspiraciones profesionales que te gustaría agregar antes de que genere tu análisis completo?",
    userPrompt:
      "Comparte cualquier reflexión final sobre tu personalidad o aspiraciones profesionales que consideres importante",
    traits: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"],
    followUpQuestions: [
      "¿Qué esperas del análisis de tu personalidad?",
      "¿Hay algún aspecto específico en el que te gustaría recibir recomendaciones?",
      "¿Cómo planeas usar esta información en tu búsqueda laboral?",
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

      recognition.onstart = () => {
        setIsListening(true)
        setIsInitializing(false)
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
            setError("No se detectó voz. Intenta hablar más cerca del micrófono.")
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

export default function PersonalityCoachTestPage() {
  const router = useRouter()
  const { user } = useAuth()

  // Conversation states
  const [currentStep, setCurrentStep] = useState(0)
  const [conversationAnswers, setConversationAnswers] = useState<Record<string, string>>({})
  const [isActive, setIsActive] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showCountdown, setShowCountdown] = useState(false)
  const [currentResponse, setCurrentResponse] = useState("")
  const [showFollowUp, setShowFollowUp] = useState(false)

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

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
  }, [user, router])

  // Auto-start conversation when step changes
  useEffect(() => {
    if (isActive && !isSpeaking && !isListening) {
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
  }, [currentStep, isActive, isSpeaking, isListening, speak])

  // Auto-start listening after system finishes speaking
  useEffect(() => {
    if (isActive && !isSpeaking && speechRecognitionSupported) {
      const timer = setTimeout(() => {
        if (!isListening && !isInitializing) {
          startListening()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isSpeaking, isActive, speechRecognitionSupported, isListening, isInitializing, startListening])

  // Save conversation answer when transcript changes
  useEffect(() => {
    if (transcript) {
      const currentStepData = PERSONALITY_CONVERSATION_FLOW[currentStep]
      if (currentStepData) {
        setConversationAnswers((prev) => ({
          ...prev,
          [currentStepData.id]: transcript.trim(),
        }))
        setCurrentResponse(transcript.trim())
      }
    }
  }, [transcript, currentStep])

  const handleStartTest = () => {
    if (!speechRecognitionSupported || !textToSpeechSupported) {
      toast.error("Tu navegador no soporta las funciones de voz necesarias para esta experiencia")
      return
    }
    setIsActive(true)
    setCurrentStep(0)
  }

  const handleNextStep = () => {
    if (currentStep < PERSONALITY_CONVERSATION_FLOW.length - 1) {
      setCurrentStep((prev) => prev + 1)
      clearTranscript()
      setCurrentResponse("")
      setShowFollowUp(false)
      if (isListening) {
        stopListening()
      }
      if (isSpeaking) {
        stopSpeaking()
      }
    } else {
      handleCompleteTest()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
      clearTranscript()
      setCurrentResponse("")
      setShowFollowUp(false)
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
    setCurrentResponse("")
    setShowFollowUp(false)
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

  const handleFollowUpQuestion = (question: string) => {
    if (isSpeaking) {
      stopSpeaking()
    }
    if (isListening) {
      stopListening()
    }

    setTimeout(() => {
      speak(question)
    }, 500)
  }

  const handleCompleteTest = async () => {
    setIsCompleting(true)

    if (isListening) {
      stopListening()
    }
    if (isSpeaking) {
      stopSpeaking()
    }

    try {
      // Process conversational answers into personality scores
      const results = processConversationalAnswers(conversationAnswers)

      // Send to AI analysis API
      const response = await fetch("/api/personality-analysis-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          testType: "big_five",
          results,
          rawAnswers: conversationAnswers,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process personality analysis")
      }

      const analysisData = await response.json()

      // Store results in localStorage for immediate access
      localStorage.setItem(
        "personalityCoachResults",
        JSON.stringify({
          results,
          aiAnalysis: analysisData.aiAnalysis,
          recommendations: analysisData.recommendations,
          completedAt: new Date().toISOString(),
          testType: "big_five_conversational",
        }),
      )

      toast.success("¡Análisis de personalidad completado!")

      // Navigate to results page
      router.push("/personality-coach-results")
    } catch (error) {
      console.error("Error completing test:", error)
      toast.error("Error al procesar el análisis. Intenta nuevamente.")
    } finally {
      setIsCompleting(false)
    }
  }

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
      type: "big_five_conversational",
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
        "filosofía",
        "arte",
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
        "detalle",
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
        "networking",
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
        "equipo",
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
        "calma",
      ],
    }

    return keywordMap[trait] || []
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p>Debes iniciar sesión para acceder a la evaluación de personalidad.</p>
          <Button onClick={() => router.push("/auth/login")} className="mt-4">
            Iniciar Sesión
          </Button>
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
              <h3 className="text-lg font-semibold mb-2">Analizando tu personalidad con IA...</h3>
              <p className="text-muted-foreground">
                Procesando tu conversación y generando tu perfil personalizado con recomendaciones para el mercado
                chileno
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Welcome Screen
  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Brain className="w-12 h-12 text-purple-600" />
              <Sparkles className="w-8 h-8 text-pink-500" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Coach de Personalidad con IA</h1>
            <p className="text-xl text-gray-600 mb-8">
              Conversación inteligente para descubrir tu personalidad profesional
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Experiencia Conversacional Única
              </CardTitle>
              <CardDescription>Una evaluación de personalidad completamente natural usando IA avanzada</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🎯 Lo que descubrirás:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Tu perfil Big Five completo y científicamente validado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Análisis personalizado con IA para el mercado chileno</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Recomendaciones de carrera específicas para Chile</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Libros y cursos personalizados para tu desarrollo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Integración con tu Coach IA para consejos continuos</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">🗣️ Cómo funciona:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600 mt-0.5 flex-shrink-0">
                        1
                      </div>
                      <span>El Coach IA te hace preguntas de forma natural</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600 mt-0.5 flex-shrink-0">
                        2
                      </div>
                      <span>Respondes hablando naturalmente (reconocimiento de voz)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600 mt-0.5 flex-shrink-0">
                        3
                      </div>
                      <span>La IA analiza tus respuestas en tiempo real</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600 mt-0.5 flex-shrink-0">
                        4
                      </div>
                      <span>Recibes un análisis completo y recomendaciones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-medium text-purple-600 mt-0.5 flex-shrink-0">
                        5
                      </div>
                      <span>Tu Coach IA recuerda todo para futuras conversaciones</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Technical Requirements */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Requisitos Técnicos:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div
                    className={`p-3 rounded-lg border ${speechRecognitionSupported ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className={`w-4 h-4 ${speechRecognitionSupported ? "text-green-600" : "text-red-600"}`} />
                      <span className="font-medium">Reconocimiento de Voz</span>
                    </div>
                    <p className={`text-sm ${speechRecognitionSupported ? "text-green-700" : "text-red-700"}`}>
                      {speechRecognitionSupported ? "Disponible y funcionando" : "No disponible en tu navegador"}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-lg border ${textToSpeechSupported ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className={`w-4 h-4 ${textToSpeechSupported ? "text-green-600" : "text-red-600"}`} />
                      <span className="font-medium">Síntesis de Voz</span>
                    </div>
                    <p className={`text-sm ${textToSpeechSupported ? "text-green-700" : "text-red-700"}`}>
                      {textToSpeechSupported ? "Disponible y funcionando" : "No disponible en tu navegador"}
                    </p>
                  </div>
                </div>
              </div>

              {(!speechRecognitionSupported || !textToSpeechSupported) && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Para la mejor experiencia, usa Chrome, Edge o Safari. Si las funciones de voz no están disponibles,
                    puedes usar nuestro{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/personality-test")}>
                      test tradicional de personalidad
                    </Button>
                    .
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center pt-4">
                <Button
                  onClick={handleStartTest}
                  size="lg"
                  className="px-8"
                  disabled={!speechRecognitionSupported || !textToSpeechSupported}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Conversación de Personalidad
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Duración aproximada: 15-20 minutos</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Active Conversation Interface
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
              IA Conversacional
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
                <p className="text-lg text-gray-600">El Coach IA hablará en...</p>
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
                <CardDescription>Exploración de tu personalidad con IA</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isSpeaking && (
                  <Badge variant="secondary" className="bg-pink-50 text-pink-700">
                    <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                    Coach hablando
                  </Badge>
                )}
                {isListening && (
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700">
                    <Mic className="w-3 h-3 mr-1 animate-pulse" />
                    Escuchando
                  </Badge>
                )}
                {isInitializing && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Iniciando...
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Coach Message */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Volume2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-purple-900 mb-2">Coach de Personalidad IA:</h4>
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
                  <h4 className="font-medium text-blue-900 mb-2">Tu respuesta:</h4>
                  <div className="min-h-[100px] bg-white rounded-lg p-3 border">
                    {currentResponse && <p className="text-gray-900 mb-2">{currentResponse}</p>}
                    {interimTranscript && <p className="text-gray-600 italic">{interimTranscript}</p>}
                    {!currentResponse && !interimTranscript && !isListening && (
                      <p className="text-gray-500 italic">
                        {isSpeaking
                          ? "Escucha la pregunta y luego comparte sobre tu personalidad..."
                          : "Tu respuesta aparecerá aquí cuando hables..."}
                      </p>
                    )}
                    {isListening && !currentResponse && !interimTranscript && (
                      <p className="text-blue-600 italic flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Escuchando... Comparte sobre tu personalidad
                      </p>
                    )}
                  </div>

                  {/* Follow-up Questions */}
                  {currentStepData?.followUpQuestions && currentResponse && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-blue-800">Preguntas de seguimiento:</h5>
                        <Button variant="ghost" size="sm" onClick={() => setShowFollowUp(!showFollowUp)}>
                          {showFollowUp ? "Ocultar" : "Mostrar"}
                        </Button>
                      </div>
                      {showFollowUp && (
                        <div className="space-y-2">
                          {currentStepData.followUpQuestions.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs h-auto p-2 text-left justify-start bg-white/50 hover:bg-white/80"
                              onClick={() => handleFollowUpQuestion(question)}
                            >
                              {question}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
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
                  Pausar coach
                </Button>
              )}

              {!isListening && !isSpeaking && !isInitializing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startListening}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Mic className="w-4 h-4" />
                  Comenzar a hablar
                </Button>
              )}

              <div className="flex-1" />

              {/* Manual text input as backup */}
              <div className="w-full mt-4">
                <Textarea
                  placeholder="O escribe tu respuesta aquí como alternativa..."
                  value={currentResponse}
                  onChange={(e) => {
                    setCurrentResponse(e.target.value)
                    const currentStepData = PERSONALITY_CONVERSATION_FLOW[currentStep]
                    if (currentStepData) {
                      setConversationAnswers((prev) => ({
                        ...prev,
                        [currentStepData.id]: e.target.value,
                      }))
                    }
                  }}
                  rows={3}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              <Button onClick={handleNextStep} className="flex items-center gap-2" disabled={!currentResponse.trim()}>
                {currentStep === PERSONALITY_CONVERSATION_FLOW.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Finalizar y Analizar
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

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Progreso de la conversación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {PERSONALITY_CONVERSATION_FLOW.map((step, index) => {
                const isCompleted = index < currentStep || (index === currentStep && currentResponse.trim())
                const isCurrent = index === currentStep

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-lg border text-center ${
                      isCurrent
                        ? "border-purple-300 bg-purple-50"
                        : isCompleted
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                        isCurrent
                          ? "bg-purple-500 text-white"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>
                    <h4 className="font-medium text-sm mb-1">{step.category}</h4>
                    <p className="text-xs text-gray-600">
                      {isCompleted ? "Completado" : isCurrent ? "En progreso" : "Pendiente"}
                    </p>
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
