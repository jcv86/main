"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Heart,
  Clock,
  CheckCircle,
  RefreshCw,
  Home,
  Laptop,
  Building2,
  Globe,
  TrendingUp,
  Award,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  Verified,
  MapPin,
  Eye,
  Target,
  Star,
  Send,
  ExternalLink,
  Briefcase,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { questions } from "./questions"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

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
  const initTimeoutRef = useRef<NodeJS.Timeout | null>

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

interface ChileanJob {
  id: string
  title: string
  company: string
  location: string
  modality: string
  postedDate: string
  experience: string
  type: string
  industry: string
  salary?: string
  salaryMin?: number
  salaryMax?: number
  currency?: string
  description: string
  skills: string[]
  isUrgent: boolean
  source: string
  verified: boolean
  companyDescription: string
  responsibilities: string[]
  requirements: string[]
  benefits: string[]
  applicationUrl: string
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

  const calculateResults = () => {
    const skillScores = {
      communication: 0,
      leadership: 0,
      teamwork: 0,
      problemSolving: 0,
      adaptability: 0,
      emotionalIntelligence: 0,
      timeManagement: 0,
    }

    questions.forEach((question) => {
      const answer = answers[question.id]

      if (answer !== undefined) {
        Object.keys(skillScores).forEach((skill) => {
          if (question.skills.includes(skill)) {
            const baseScore = 100 / question.skills.length
            let adjustedScore = baseScore

            if (question.type === "radio") {
              adjustedScore = baseScore * (answer / 4)
            } else if (question.type === "checkbox") {
              if (Array.isArray(answer)) {
                adjustedScore = baseScore * (answer.includes(true) ? 1 : 0)
              } else {
                adjustedScore = baseScore * (answer ? 1 : 0)
              }
            } else if (question.type === "slider") {
              adjustedScore = baseScore * (answer / 100)
            } else if (question.type === "drag") {
              const correctOrder = question.options.map((option) => option.id)
              let orderScore = 0
              if (Array.isArray(answer)) {
                answer.forEach((item, index) => {
                  if (item.id === correctOrder[index]) {
                    orderScore += baseScore / answer.length
                  }
                })
              }
              adjustedScore = orderScore
            }

            skillScores[skill as keyof typeof skillScores] += adjustedScore
          }
        })
      }
    })

    Object.keys(skillScores).forEach((skill) => {
      skillScores[skill as keyof typeof skillScores] = Math.max(
        0,
        Math.min(100, skillScores[skill as keyof typeof skillScores]),
      )
    })

    const overallScore = Math.round(Object.values(skillScores).reduce((sum, score) => sum + score, 0) / 7)

    const results = Object.entries(skillScores).map(([skill, score]) => ({
      category: skill.charAt(0).toUpperCase() + skill.slice(1),
      score,
      level: Math.floor(score / 20) + 1,
    }))

    return {
      communication: skillScores.communication,
      leadership: skillScores.leadership,
      teamwork: skillScores.teamwork,
      problemSolving: skillScores.problemSolving,
      adaptability: skillScores.adaptability,
      emotionalIntelligence: skillScores.emotionalIntelligence,
      timeManagement: skillScores.timeManagement,
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

  const validatePassword = (password: string) => {
    const errors = []
    if (password.length < 8) {
      errors.push("La contraseña debe tener al menos 8 caracteres.")
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("La contraseña debe contener al menos una letra mayúscula.")
    }
    if (!/[a-z]/.test(password)) {
      errors.push("La contraseña debe contener al menos una letra minúscula.")
    }
    if (!/[0-9]/.test(password)) {
      errors.push("La contraseña debe contener al menos un número.")
    }
    if (!/[^a-zA-Z0-9\s]/.test(password)) {
      errors.push("La contraseña debe contener al menos un símbolo.")
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: "none", color: "text-gray-400" }
    if (password.length < 6) return { strength: "weak", color: "text-red-500" }
    if (password.length < 8) return { strength: "fair", color: "text-orange-500" }

    const validation = validatePassword(password)
    if (validation.isValid) return { strength: "strong", color: "text-green-500" }
    if (validation.errors.length <= 2) return { strength: "good", color: "text-yellow-500" }
    return { strength: "fair", color: "text-orange-500" }
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      "full-time": "Tiempo completo",
      "part-time": "Medio tiempo",
      contract: "Contrato",
      internship: "Práctica",
      freelance: "Freelance",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case "remoto":
        return <Home className="w-4 h-4" />
      case "híbrido":
        return <Laptop className="w-4 h-4" />
      case "presencial":
        return <Building2 className="w-4 h-4" />
      default:
        return <Building2 className="w-4 h-4" />
    }
  }

  const getSourceBadge = (source: string) => {
    const sourceMap = {
      trabajando: { name: "Trabajando.com", color: "bg-blue-100 text-blue-800" },
      getonboard: { name: "GetOnBoard", color: "bg-green-100 text-green-800" },
      laborum: { name: "Laborum", color: "bg-purple-100 text-purple-800" },
      computrabajo: { name: "CompuTrabajo", color: "bg-orange-100 text-orange-800" },
      "indeed-chile": { name: "Indeed Chile", color: "bg-red-100 text-red-800" },
    }

    const sourceInfo = sourceMap[source as keyof typeof sourceMap] || {
      name: source,
      color: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge className={sourceInfo.color} variant="secondary">
        <Globe className="w-3 h-3 mr-1" />
        {sourceInfo.name}
      </Badge>
    )
  }

  const formatSalary = (job: ChileanJob) => {
    if (job.salary) return job.salary
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()} ${job.currency}`
    }
    if (job.salaryMin) {
      return `Desde $${job.salaryMin.toLocaleString()} ${job.currency}`
    }
    return "Salario a convenir"
  }

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Hace 1 día"
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    return `Hace ${Math.floor(diffDays / 30)} meses`
  }

  const getExperienceLabel = (experience: string) => {
    const labels = {
      "sin-experiencia": "Sin experiencia",
      junior: "Junior (0-2 años)",
      "semi-senior": "Semi-Senior (3-5 años)",
      senior: "Senior (5+ años)",
      gerencial: "Gerencial/Ejecutivo",
    }
    return labels[experience as keyof typeof labels] || experience
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [regionFilter, setRegionFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [modalityFilter, setModalityFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [salaryMinFilter, setSalaryMinFilter] = useState("")
  const [salaryMaxFilter, setSalaryMaxFilter] = useState("")
  const [postedDaysFilter, setPostedDaysFilter] = useState("all")
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalJobs, setTotalJobs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [savedJobs, setSavedJobs] = useState([])
  const [appliedJobs, setAppliedJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState(null)

  const searchJobs = async () => {
    setLoading(true)
    setError(null)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setJobs([
        {
          id: "1",
          title: "Frontend Developer",
          company: "NotCo",
          location: "Santiago",
          modality: "híbrido",
          postedDate: new Date().toISOString(),
          experience: "junior",
          type: "full-time",
          industry: "FoodTech",
          salary: "$1.500.000 - $2.000.000 CLP",
          description: "Buscamos un desarrollador frontend con experiencia en React para unirse a nuestro equipo.",
          skills: ["React", "JavaScript", "HTML", "CSS"],
          isUrgent: true,
          source: "getonboard",
          verified: true,
          companyDescription: "NotCo es una empresa de alimentos de tecnología.",
          responsibilities: ["Desarrollo de interfaces de usuario", "Mantenimiento de código"],
          requirements: ["Experiencia en React", "Conocimientos de JavaScript"],
          benefits: ["Seguro de salud", "Días de vacaciones"],
          applicationUrl: "https://www.getonbrd.com",
        },
      ])
      setTotalJobs(1)
      setTotalPages(1)
      setStats({
        totalJobs: 1,
        lastUpdated: new Date().toISOString(),
        avgSalary: 1750000,
        bySource: { getonboard: 1 },
        byRegion: { Metropolitana: 1 },
        byIndustry: { FoodTech: 1 },
      })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveJob = (jobId) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter((id) => id !== jobId))
    } else {
      setSavedJobs([...savedJobs, jobId])
    }
  }

  const handleApplyJob = (jobId, applicationUrl) => {
    setAppliedJobs([...appliedJobs, jobId])
    window.open(applicationUrl, "_blank")
  }

  const getJobTypeColor = (type) => {
    const typeColors = {
      "full-time": "bg-green-100 text-green-800",
      "part-time": "bg-blue-100 text-blue-800",
      contract: "bg-yellow-100 text-yellow-800",
      internship: "bg-purple-100 text-purple-800",
      freelance: "bg-orange-100 text-orange-800",
    }
    return typeColors[type] || "bg-gray-100 text-gray-800"
  }

  const clearFilters = () => {
    setSearchTerm("")
    setRegionFilter("all")
    setLocationFilter("all")
    setTypeFilter("all")
    setExperienceFilter("all")
    setModalityFilter("all")
    setIndustryFilter("all")
    setSalaryMinFilter("")
    setSalaryMaxFilter("")
    setPostedDaysFilter("all")
  }

  const Separator = () => <div className="w-full h-px bg-gray-200" />

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda de Empleos en Chile</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Encuentra las mejores oportunidades laborales en Chile. Empleos de empresas líderes como Banco de Chile,
            NotCo, Fintual y más.
          </p>
          {stats && (
            <div className="flex justify-center items-center space-x-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>{stats.totalJobs.toLocaleString()} empleos disponibles</span>
              </div>
              <div className="flex items-center space-x-1">
                <RefreshCw className="w-4 h-4" />
                <span>Actualizado: {new Date(stats.lastUpdated).toLocaleDateString("es-CL")}</span>
              </div>
              {stats.avgSalary > 0 && (
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>Salario promedio: ${stats.avgSalary.toLocaleString()} CLP</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Buscar Empleos</span>
              <Badge variant="outline" className="ml-auto">
                Empresas chilenas verificadas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por título, empresa, tecnología o habilidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Región" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las regiones</SelectItem>
                  <SelectItem value="Metropolitana">Metropolitana</SelectItem>
                  <SelectItem value="Valparaíso">Valparaíso</SelectItem>
                  <SelectItem value="Biobío">Biobío</SelectItem>
                  <SelectItem value="Coquimbo">Coquimbo</SelectItem>
                  <SelectItem value="Antofagasta">Antofagasta</SelectItem>
                  <SelectItem value="La Araucanía">La Araucanía</SelectItem>
                  <SelectItem value="O'Higgins">O'Higgins</SelectItem>
                  <SelectItem value="Maule">Maule</SelectItem>
                </SelectContent>
              </Select>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Comuna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las comunas</SelectItem>
                  <SelectItem value="Santiago">Santiago</SelectItem>
                  <SelectItem value="Las Condes">Las Condes</SelectItem>
                  <SelectItem value="Providencia">Providencia</SelectItem>
                  <SelectItem value="Vitacura">Vitacura</SelectItem>
                  <SelectItem value="Ñuñoa">Ñuñoa</SelectItem>
                  <SelectItem value="Concepción">Concepción</SelectItem>
                  <SelectItem value="Valparaíso">Valparaíso</SelectItem>
                  <SelectItem value="Viña del Mar">Viña del Mar</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de empleo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="full-time">Tiempo completo</SelectItem>
                  <SelectItem value="part-time">Medio tiempo</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                  <SelectItem value="internship">Práctica</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="sin-experiencia">Sin experiencia</SelectItem>
                  <SelectItem value="junior">Junior (0-2 años)</SelectItem>
                  <SelectItem value="semi-senior">Semi-Senior (3-5 años)</SelectItem>
                  <SelectItem value="senior">Senior (5+ años)</SelectItem>
                  <SelectItem value="gerencial">Gerencial/Ejecutivo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las modalidades</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                  <SelectItem value="remoto">Remoto</SelectItem>
                  <SelectItem value="híbrido">Híbrido</SelectItem>
                </SelectContent>
              </Select>

              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Industria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las industrias</SelectItem>
                  <SelectItem value="Tecnología">Tecnología</SelectItem>
                  <SelectItem value="Servicios Financieros">Servicios Financieros</SelectItem>
                  <SelectItem value="FinTech">FinTech</SelectItem>
                  <SelectItem value="FoodTech">FoodTech</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Telecomunicaciones">Telecomunicaciones</SelectItem>
                  <SelectItem value="Minería">Minería</SelectItem>
                  <SelectItem value="Educación">Educación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Salario mínimo (CLP)</label>
                <Input
                  type="number"
                  placeholder="Ej: 1500000"
                  value={salaryMinFilter}
                  onChange={(e) => setSalaryMinFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Salario máximo (CLP)</label>
                <Input
                  type="number"
                  placeholder="Ej: 3000000"
                  value={salaryMaxFilter}
                  onChange={(e) => setSalaryMaxFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Posted Date Filter */}
            <Select value={postedDaysFilter} onValueChange={setPostedDaysFilter}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Publicado en los últimos..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier fecha</SelectItem>
                <SelectItem value="1">Último día</SelectItem>
                <SelectItem value="7">Última semana</SelectItem>
                <SelectItem value="30">Último mes</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={searchJobs} disabled={loading} className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>{loading ? "Buscando..." : "Buscar Empleos"}</span>
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {!loading && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-gray-600">
                {totalJobs > 0 ? (
                  <span>
                    Mostrando {jobs.length} de {totalJobs.toLocaleString()} empleos encontrados
                  </span>
                ) : (
                  <span>No se encontraron empleos con los filtros seleccionados</span>
                )}
              </div>
              {stats && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(stats.bySource).map(([source, count]) => (
                    <Badge key={source} variant="outline" className="text-xs">
                      {source}: {count}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Job Results */}
        {!loading && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Building2 className="w-4 h-4" />
                            <span className="font-medium">{job.company}</span>
                            {job.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                <Verified className="w-3 h-3 mr-1" />
                                Verificada
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {job.isUrgent && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Urgente
                            </Badge>
                          )}
                          {getSourceBadge(job.source)}
                        </div>
                      </div>

                      {/* Location and Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getModalityIcon(job.modality)}
                          <span className="capitalize">{job.modality}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatPostedDate(job.postedDate)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{getExperienceLabel(job.experience)}</span>
                        </div>
                      </div>

                      {/* Salary and Type */}
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className={getJobTypeColor(job.type)}>{getTypeLabel(job.type)}</Badge>
                        <Badge variant="outline">{job.industry}</Badge>
                        <Badge variant="outline" className="font-semibold">
                          {formatSalary(job)}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 line-clamp-2">{job.description}</p>

                      {/* Skills */}
                      {job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {job.skills.slice(0, 6).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{job.skills.length - 6} más
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 lg:w-48">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver Detalles
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                              <span>{job.title}</span>
                              <div className="flex items-center space-x-2">
                                {job.verified && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    <Verified className="w-3 h-3 mr-1" />
                                    Verificada
                                  </Badge>
                                )}
                                {getSourceBadge(job.source)}
                              </div>
                            </DialogTitle>
                            <DialogDescription>
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="font-medium">{job.company}</span>
                                <span>•</span>
                                <span>{job.location}</span>
                                <span>•</span>
                                <span>{formatPostedDate(job.postedDate)}</span>
                              </div>
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-6">
                            {/* Job Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900">Salario</h4>
                                <p className="text-sm text-gray-600">{formatSalary(job)}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Tipo</h4>
                                <p className="text-sm text-gray-600">{getTypeLabel(job.type)}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Modalidad</h4>
                                <p className="text-sm text-gray-600 capitalize">{job.modality}</p>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Experiencia</h4>
                                <p className="text-sm text-gray-600">{getExperienceLabel(job.experience)}</p>
                              </div>
                            </div>

                            <Separator />

                            {/* Company Description */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Sobre la empresa</h4>
                              <p className="text-sm text-gray-600">{job.companyDescription}</p>
                            </div>

                            <Separator />

                            {/* Job Description */}
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Descripción del puesto</h4>
                              <p className="text-sm text-gray-600">{job.description}</p>
                            </div>

                            {/* Responsibilities */}
                            {job.responsibilities.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Responsabilidades</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {job.responsibilities.map((responsibility, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{responsibility}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Requirements */}
                            {job.requirements.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Requisitos</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {job.requirements.map((requirement, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                      <span>{requirement}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Benefits */}
                            {job.benefits.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Beneficios</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  {job.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start space-x-2">
                                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                      <span>{benefit}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Skills */}
                            {job.skills.length > 0 && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Habilidades requeridas</h4>
                                <div className="flex flex-wrap gap-2">
                                  {job.skills.map((skill) => (
                                    <Badge key={skill} variant="secondary">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex space-x-3 pt-4">
                              <Button
                                onClick={() => handleApplyJob(job.id, job.applicationUrl)}
                                className="flex-1"
                                disabled={appliedJobs.includes(job.id)}
                              >
                                {appliedJobs.includes(job.id) ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Aplicado
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Aplicar en {job.source}
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => handleSaveJob(job.id)}
                                className={savedJobs.includes(job.id) ? "bg-red-50 text-red-600" : ""}
                              >
                                <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        onClick={() => handleApplyJob(job.id, job.applicationUrl)}
                        disabled={appliedJobs.includes(job.id)}
                        className="w-full"
                      >
                        {appliedJobs.includes(job.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aplicado
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Aplicar
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => handleSaveJob(job.id)}
                        className={`w-full ${savedJobs.includes(job.id) ? "bg-red-50 text-red-600" : ""}`}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                        {savedJobs.includes(job.id) ? "Guardado" : "Guardar"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron empleos</h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar tus filtros de búsqueda o busca términos más generales.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar todos los filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        {stats && !loading && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Estadísticas del Mercado Laboral Chileno</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Por Portal</h4>
                  <div className="space-y-1">
                    {Object.entries(stats.bySource).map(([source, count]) => (
                      <div key={source} className="flex justify-between text-sm">
                        <span className="capitalize">{source}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Por Región</h4>
                  <div className="space-y-1">
                    {Object.entries(stats.byRegion)
                      .slice(0, 5)
                      .map(([region, count]) => (
                        <div key={region} className="flex justify-between text-sm">
                          <span>{region}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Por Industria</h4>
                  <div className="space-y-1">
                    {Object.entries(stats.byIndustry)
                      .slice(0, 5)
                      .map(([industry, count]) => (
                        <div key={industry} className="flex justify-between text-sm">
                          <span>{industry}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
