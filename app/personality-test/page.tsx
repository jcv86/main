"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Brain,
  Heart,
  Users,
  Shield,
  Target,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Lightbulb,
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

interface Question {
  id: number
  text: string
  trait: "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism"
  reverse?: boolean
}

const questions: Question[] = [
  // Openness (Apertura)
  { id: 1, text: "Me gusta explorar nuevas ideas y conceptos en mi trabajo", trait: "openness" },
  { id: 2, text: "Prefiero seguir métodos tradicionales y probados", trait: "openness", reverse: true },
  { id: 3, text: "Disfruto de los desafíos creativos en mi carrera", trait: "openness" },
  { id: 4, text: "Me siento cómodo con la rutina y la predictibilidad", trait: "openness", reverse: true },
  { id: 5, text: "Me interesa aprender sobre diferentes culturas y perspectivas", trait: "openness" },
  { id: 6, text: "Prefiero trabajos con tareas claras y definidas", trait: "openness", reverse: true },
  { id: 7, text: "Me emociona la posibilidad de innovar en mi campo", trait: "openness" },
  { id: 8, text: "Evito situaciones ambiguas o poco estructuradas", trait: "openness", reverse: true },

  // Conscientiousness (Responsabilidad)
  { id: 9, text: "Siempre cumplo con mis compromisos laborales", trait: "conscientiousness" },
  { id: 10, text: "A veces dejo las tareas para el último momento", trait: "conscientiousness", reverse: true },
  { id: 11, text: "Soy muy organizado con mis proyectos y documentos", trait: "conscientiousness" },
  { id: 12, text: "Me cuesta mantener el orden en mi espacio de trabajo", trait: "conscientiousness", reverse: true },
  { id: 13, text: "Planifico cuidadosamente antes de actuar", trait: "conscientiousness" },
  { id: 14, text: "Prefiero improvisar sobre la marcha", trait: "conscientiousness", reverse: true },
  { id: 15, text: "Soy persistente hasta completar mis objetivos", trait: "conscientiousness" },
  { id: 16, text: "Me distraigo fácilmente de mis metas principales", trait: "conscientiousness", reverse: true },

  // Extraversion (Extraversión)
  { id: 17, text: "Me energizo trabajando con otras personas", trait: "extraversion" },
  { id: 18, text: "Prefiero trabajar solo la mayor parte del tiempo", trait: "extraversion", reverse: true },
  { id: 19, text: "Me siento cómodo liderando reuniones o presentaciones", trait: "extraversion" },
  { id: 20, text: "Evito ser el centro de atención en el trabajo", trait: "extraversion", reverse: true },
  { id: 21, text: "Disfruto del networking y conocer nuevos colegas", trait: "extraversion" },
  { id: 22, text: "Me siento agotado después de eventos sociales laborales", trait: "extraversion", reverse: true },
  { id: 23, text: "Hablo con facilidad en grupos grandes", trait: "extraversion" },
  { id: 24, text: "Necesito tiempo a solas para recargar energías", trait: "extraversion", reverse: true },

  // Agreeableness (Amabilidad)
  { id: 25, text: "Busco el consenso antes de tomar decisiones importantes", trait: "agreeableness" },
  {
    id: 26,
    text: "No me importa tomar decisiones impopulares si son correctas",
    trait: "agreeableness",
    reverse: true,
  },
  { id: 27, text: "Me preocupo por el bienestar de mis compañeros", trait: "agreeableness" },
  { id: 28, text: "Priorizo los resultados por encima de las relaciones", trait: "agreeableness", reverse: true },
  { id: 29, text: "Trato de evitar conflictos en el trabajo", trait: "agreeableness" },
  { id: 30, text: "No tengo problema en confrontar cuando es necesario", trait: "agreeableness", reverse: true },
  { id: 31, text: "Soy empático con las dificultades de otros", trait: "agreeableness" },
  { id: 32, text: "Me enfoco en mis propios objetivos sin distraerme", trait: "agreeableness", reverse: true },

  // Neuroticism (Neuroticismo)
  { id: 33, text: "Me estreso fácilmente bajo presión", trait: "neuroticism" },
  { id: 34, text: "Mantengo la calma en situaciones difíciles", trait: "neuroticism", reverse: true },
  { id: 35, text: "Me preocupo mucho por cometer errores", trait: "neuroticism" },
  { id: 36, text: "Confío en mi capacidad para manejar desafíos", trait: "neuroticism", reverse: true },
  { id: 37, text: "Los cambios inesperados me generan ansiedad", trait: "neuroticism" },
  { id: 38, text: "Me adapto fácilmente a nuevas situaciones", trait: "neuroticism", reverse: true },
  { id: 39, text: "Tiendo a ver el lado negativo de las situaciones", trait: "neuroticism" },
  { id: 40, text: "Generalmente mantengo una actitud positiva", trait: "neuroticism", reverse: true },
]

const traitInfo = {
  openness: {
    name: "Apertura",
    description: "Creatividad, curiosidad intelectual y apertura a nuevas experiencias",
    icon: "🎨",
    color: "bg-purple-100 text-purple-800",
  },
  conscientiousness: {
    name: "Responsabilidad",
    description: "Organización, disciplina y orientación hacia objetivos",
    icon: "📋",
    color: "bg-blue-100 text-blue-800",
  },
  extraversion: {
    name: "Extraversión",
    description: "Sociabilidad, asertividad y búsqueda de estimulación",
    icon: "👥",
    color: "bg-green-100 text-green-800",
  },
  agreeableness: {
    name: "Amabilidad",
    description: "Cooperación, confianza y orientación hacia otros",
    icon: "🤝",
    color: "bg-yellow-100 text-yellow-800",
  },
  neuroticism: {
    name: "Neuroticismo",
    description: "Estabilidad emocional y manejo del estrés",
    icon: "🧘",
    color: "bg-red-100 text-red-800",
  },
}

const insights = [
  "La personalidad Big Five es el modelo más respaldado científicamente para evaluar rasgos de personalidad.",
  "Cada rasgo se mide en un continuum, no hay respuestas 'correctas' o 'incorrectas'.",
  "Tus resultados pueden ayudarte a entender mejor tus fortalezas y áreas de desarrollo profesional.",
  "Este test complementa perfectamente tu evaluación DISC para un perfil más completo.",
  "Los empleadores chilenos valoran cada vez más la autoconciencia y el desarrollo personal.",
  "Conocer tu personalidad te ayuda a elegir roles y ambientes laborales más compatibles.",
  "El Big Five predice mejor el desempeño laboral que otros tests de personalidad.",
  "Tus rasgos pueden cambiar ligeramente con el tiempo y las experiencias de vida.",
]

export default function BigFiveTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showInsight, setShowInsight] = useState(false)
  const [currentInsight, setCurrentInsight] = useState(0)
  const { t } = useLanguage()

  useEffect(() => {
    // Show insight every 5 questions
    if (currentQuestion > 0 && currentQuestion % 5 === 0) {
      setShowInsight(true)
      setCurrentInsight(Math.floor(Math.random() * insights.length))
      const timer = setTimeout(() => setShowInsight(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [currentQuestion])

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: Number.parseInt(value) }
    setAnswers(newAnswers)
  }

  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const scores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    }

    const counts = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0,
    }

    questions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        const score = question.reverse ? 6 - answer : answer
        scores[question.trait] += score
        counts[question.trait]++
      }
    })

    // Convert to percentiles (0-100)
    const results = Object.keys(scores).reduce(
      (acc, trait) => {
        const rawScore = scores[trait as keyof typeof scores]
        const questionCount = counts[trait as keyof typeof counts]
        const maxScore = questionCount * 5
        const percentage = Math.round((rawScore / maxScore) * 100)
        acc[trait as keyof typeof scores] = Math.max(0, Math.min(100, percentage))
        return acc
      },
      {} as Record<keyof typeof scores, number>,
    )

    return results
  }

  const finishTest = () => {
    const results = calculateResults()
    // Save results to localStorage for now
    localStorage.setItem(
      "bigFiveResults",
      JSON.stringify({
        results,
        completedAt: new Date().toISOString(),
      }),
    )
    router.push("/big-five-results")
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQuestionData = questions[currentQuestion]
  const currentAnswer = answers[currentQuestionData?.id]

  return (
    <TooltipProvider>
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Test Big Five (OCEAN)</h1>
              <p className="text-muted-foreground">Evaluación científica de personalidad</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progreso General</span>
              <span className="text-sm text-muted-foreground">
                {currentQuestion + 1} de {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Insight Modal */}
        {showInsight && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">💡 Insight Profesional</h3>
                  <p className="text-blue-800 text-sm">{insights[currentInsight]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">Pregunta {currentQuestion + 1}</CardTitle>
                <CardDescription className="text-lg">{currentQuestionData?.text}</CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-semibold">{traitInfo[currentQuestionData?.trait]?.name}</p>
                    <p className="text-sm">{traitInfo[currentQuestionData?.trait]?.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup value={currentAnswer?.toString() || ""} onValueChange={handleAnswer} className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer">
                  Totalmente en desacuerdo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer">
                  En desacuerdo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="r3" />
                <Label htmlFor="r3" className="cursor-pointer">
                  Neutral
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="r4" />
                <Label htmlFor="r4" className="cursor-pointer">
                  De acuerdo
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="r5" />
                <Label htmlFor="r5" className="cursor-pointer">
                  Totalmente de acuerdo
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {currentAnswer && <CheckCircle className="w-4 h-4 text-green-600" />}
            {currentAnswer ? "Respondida" : "Selecciona una respuesta"}
          </div>

          <Button onClick={finishTest} disabled={!currentAnswer} className="flex items-center gap-2">
            {currentQuestion === questions.length - 1 ? (
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
      </div>
    </TooltipProvider>
  )
}
