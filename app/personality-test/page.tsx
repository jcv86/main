"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Sliders,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Mic,
  MicOff,
  Volume2,
  RotateCcw,
  Lightbulb,
  Brain,
  Heart,
  Users,
  Target,
  Zap,
  Settings,
  Keyboard,
  CheckCircle,
  Trash2,
  Loader2,
  AlertCircle,
  Clock,
  MessageCircle,
  Pause,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface Question {
  id: string
  text: string
  type: "scale" | "open" | "multiple" | "scenario" | "ranking" | "checkbox" | "slider" | "binary"
  category: "openness" | "conscientiousness" | "extraversion" | "agreeableness" | "neuroticism"
  options?: string[]
  scale?: { min: number; max: number; labels: string[] }
  scenario?: string
  help?: string
  tip?: string
}

interface ConversationTurn {
  speaker: "system" | "user"
  message: string
  timestamp: Date
  category?: string
  isQuestion?: boolean
}

type InputMode = "mixed" | "voice-complete"

const personalityQuestions: Question[] = [
  // Openness to Experience
  {
    id: "open_1",
    text: "¿Qué tan frecuentemente buscas nuevas experiencias y aventuras?",
    type: "scale",
    category: "openness",
    scale: { min: 1, max: 5, labels: ["Nunca", "Raramente", "A veces", "Frecuentemente", "Siempre"] },
    help: "Esta pregunta evalúa tu disposición a explorar lo desconocido y salir de tu zona de confort.",
    tip: "Piensa en situaciones recientes donde hayas tenido la oportunidad de probar algo nuevo.",
  },
  {
    id: "open_2",
    text: "Describe una situación donde hayas tenido que ser creativo para resolver un problema.",
    type: "open",
    category: "openness",
    help: 'Busca ejemplos donde hayas pensado "fuera de la caja" o encontrado soluciones no convencionales.',
    tip: "Puede ser en el trabajo, estudios, o vida personal. No hay respuestas correctas o incorrectas.",
  },
  {
    id: "open_3",
    text: "En tu tiempo libre, prefieres:",
    type: "multiple",
    category: "openness",
    options: [
      "Leer libros de diferentes géneros y temas",
      "Ver documentales o programas educativos",
      "Visitar museos, galerías o eventos culturales",
      "Aprender nuevas habilidades o hobbies",
      "Actividades rutinarias que ya conozco bien",
    ],
    help: "Esta pregunta explora tus preferencias de ocio y apertura a nuevas ideas.",
    tip: "Selecciona la opción que mejor represente lo que realmente haces, no lo que crees que deberías hacer.",
  },
  {
    id: "open_4",
    text: "Te han asignado liderar un proyecto innovador en tu empresa. El proyecto requiere implementar tecnologías completamente nuevas y metodologías no probadas. ¿Cómo reaccionas?",
    type: "scenario",
    category: "openness",
    scenario: "Proyecto de innovación tecnológica",
    options: [
      "Me emociono por la oportunidad de explorar territorio desconocido",
      "Acepto el desafío pero prefiero investigar mucho antes de actuar",
      "Me siento nervioso pero dispuesto a intentarlo",
      "Preferiría usar métodos probados y hacer cambios graduales",
      "Me siento incómodo con tanta incertidumbre",
    ],
    help: "Esta situación evalúa tu comodidad con la ambigüedad y lo desconocido.",
    tip: "Piensa en cómo realmente te sentirías, no en cómo crees que deberías sentirte.",
  },
  {
    id: "open_5",
    text: "Ordena estas actividades según tu nivel de interés (1 = más interesante, 5 = menos interesante):",
    type: "ranking",
    category: "openness",
    options: [
      "Debatir ideas filosóficas o abstractas",
      "Experimentar con arte, música o escritura creativa",
      "Explorar culturas diferentes a través de viajes o lecturas",
      "Analizar teorías científicas complejas",
      "Seguir rutinas establecidas y eficientes",
    ],
    help: "El ranking revela tus preferencias intelectuales y creativas.",
    tip: "No hay orden correcto. Ordena según tu interés genuino.",
  },

  // Conscientiousness
  {
    id: "cons_1",
    text: "¿Qué tan organizado eres en tu vida diaria?",
    type: "scale",
    category: "conscientiousness",
    scale: {
      min: 1,
      max: 5,
      labels: ["Muy desorganizado", "Desorganizado", "Neutral", "Organizado", "Muy organizado"],
    },
    help: "Esta pregunta evalúa tu tendencia natural hacia el orden y la estructura.",
    tip: "Considera tu comportamiento típico, no solo en los mejores días.",
  },
  {
    id: "cons_2",
    text: "Describe tu proceso típico para completar un proyecto importante.",
    type: "open",
    category: "conscientiousness",
    help: "Explica paso a paso cómo abordas proyectos significativos.",
    tip: "Incluye detalles sobre planificación, ejecución y seguimiento.",
  },
  {
    id: "cons_3",
    text: "Cuando tienes una fecha límite importante:",
    type: "multiple",
    category: "conscientiousness",
    options: [
      "Empiezo inmediatamente y trabajo de forma constante",
      "Hago un plan detallado y lo sigo rigurosamente",
      "Trabajo en ráfagas intensas cerca de la fecha límite",
      "Me estreso pero siempre logro entregar a tiempo",
      "A menudo necesito extensiones o entrego tarde",
    ],
    help: "Esta pregunta evalúa tu gestión del tiempo y autodisciplina.",
    tip: "Sé honesto sobre tu patrón real de comportamiento.",
  },
  {
    id: "cons_4",
    text: "Tu jefe te pide que supervises un proyecto crítico con múltiples entregables y un equipo de 5 personas. Tienes 3 meses para completarlo. ¿Cuál es tu enfoque?",
    type: "scenario",
    category: "conscientiousness",
    scenario: "Gestión de proyecto crítico",
    options: [
      "Creo un cronograma detallado con hitos semanales y sistemas de seguimiento",
      "Establezco reuniones regulares y confío en que el equipo se autorregule",
      "Divido el trabajo y hago seguimiento cuando surgen problemas",
      "Mantengo flexibilidad y ajusto el plan según sea necesario",
      "Me enfoco en los entregables principales y dejo que los detalles se resuelvan solos",
    ],
    help: "Esta situación evalúa tu enfoque hacia la planificación y control.",
    tip: "Piensa en proyectos similares que hayas manejado antes.",
  },
  {
    id: "cons_5",
    text: "Del 0 al 100, ¿qué tan perfeccionista eres?",
    type: "slider",
    category: "conscientiousness",
    scale: { min: 0, max: 100, labels: ["Nada perfeccionista", "Extremadamente perfeccionista"] },
    help: "El perfeccionismo puede ser tanto una fortaleza como una debilidad.",
    tip: "Considera tanto los aspectos positivos como negativos de tu perfeccionismo.",
  },

  // Extraversion
  {
    id: "extra_1",
    text: "¿Qué tan cómodo te sientes en situaciones sociales nuevas?",
    type: "scale",
    category: "extraversion",
    scale: { min: 1, max: 5, labels: ["Muy incómodo", "Incómodo", "Neutral", "Cómodo", "Muy cómodo"] },
    help: "Esta pregunta evalúa tu comodidad social y tendencia a buscar estimulación externa.",
    tip: "Piensa en eventos recientes como fiestas, networking o reuniones nuevas.",
  },
  {
    id: "extra_2",
    text: "Describe una situación donde hayas tenido que liderar o motivar a un grupo.",
    type: "open",
    category: "extraversion",
    help: "Busca ejemplos donde hayas tomado iniciativa en situaciones grupales.",
    tip: "Puede ser formal (trabajo) o informal (amigos, familia, voluntariado).",
  },
  {
    id: "extra_3",
    text: "En una fiesta o evento social, típicamente:",
    type: "multiple",
    category: "extraversion",
    options: [
      "Soy el alma de la fiesta, conozco a todos",
      "Me mezclo fácilmente y disfruto las conversaciones",
      "Prefiero conversaciones profundas con pocas personas",
      "Me quedo con personas que ya conozco",
      "Busco momentos para estar solo y recargar energías",
    ],
    help: "Esta pregunta explora tu estilo de interacción social preferido.",
    tip: "Piensa en tu comportamiento natural, no en cómo crees que deberías actuar.",
  },
  {
    id: "extra_4",
    text: "Te invitan a dar una presentación importante frente a 100 personas sobre un tema que dominas. ¿Cómo te sientes?",
    type: "scenario",
    category: "extraversion",
    scenario: "Presentación pública importante",
    options: [
      "Emocionado por la oportunidad de compartir mis conocimientos",
      "Nervioso pero emocionado, es una buena oportunidad",
      "Ansioso pero dispuesto a hacerlo por el beneficio profesional",
      "Muy nervioso, preferiría evitarlo si fuera posible",
      "Extremadamente ansioso, buscaría formas de declinar",
    ],
    help: "Esta situación evalúa tu comodidad con la atención y exposición pública.",
    tip: "Considera tanto tus sentimientos iniciales como tu disposición final.",
  },
  {
    id: "extra_5",
    text: "Selecciona todas las actividades que realmente disfrutas:",
    type: "checkbox",
    category: "extraversion",
    options: [
      "Organizar eventos o reuniones sociales",
      "Participar en deportes de equipo",
      "Hacer networking profesional",
      "Dar discursos o presentaciones",
      "Trabajar en proyectos colaborativos",
      "Leer solo en casa",
      "Meditar o hacer actividades contemplativas",
      "Trabajar en proyectos individuales",
    ],
    help: "Tus preferencias de actividades revelan tu nivel de extraversión.",
    tip: "Selecciona solo las que genuinamente disfrutas, no las que crees que deberías disfrutar.",
  },

  // Agreeableness
  {
    id: "agree_1",
    text: "¿Qué tan importante es para ti mantener la armonía en tus relaciones?",
    type: "scale",
    category: "agreeableness",
    scale: {
      min: 1,
      max: 5,
      labels: [
        "Nada importante",
        "Poco importante",
        "Moderadamente importante",
        "Muy importante",
        "Extremadamente importante",
      ],
    },
    help: "Esta pregunta evalúa tu tendencia a priorizar las relaciones armoniosas.",
    tip: "Considera situaciones donde hayas tenido que elegir entre armonía y otros valores.",
  },
  {
    id: "agree_2",
    text: "Describe una situación donde hayas tenido que manejar un conflicto entre dos personas.",
    type: "open",
    category: "agreeableness",
    help: "Explica tu enfoque para resolver conflictos interpersonales.",
    tip: "Incluye tanto tu proceso de pensamiento como las acciones que tomaste.",
  },
  {
    id: "agree_3",
    text: "Cuando alguien te pide ayuda con algo que no es tu responsabilidad:",
    type: "multiple",
    category: "agreeableness",
    options: [
      "Siempre ayudo, sin importar mi situación",
      "Ayudo si tengo tiempo y capacidad",
      "Evalúo si realmente necesitan mi ayuda específica",
      "Ayudo solo si es alguien cercano",
      "Rara vez ayudo, cada uno debe resolver sus problemas",
    ],
    help: "Esta pregunta explora tu disposición a ayudar a otros.",
    tip: "Piensa en tu comportamiento típico, no en casos excepcionales.",
  },
  {
    id: "agree_4",
    text: "En una reunión de trabajo, un colega presenta una idea que consideras fundamentalmente incorrecta, pero todos los demás parecen estar de acuerdo. ¿Qué haces?",
    type: "scenario",
    category: "agreeableness",
    scenario: "Desacuerdo en reunión grupal",
    options: [
      "Expreso mi desacuerdo de manera directa y clara",
      "Hago preguntas que lleven a otros a ver los problemas",
      "Espero a hablar en privado con el presentador",
      "Me mantengo callado para no crear conflicto",
      "Apoyo la decisión del grupo aunque no esté de acuerdo",
    ],
    help: "Esta situación evalúa tu balance entre asertividad y armonía grupal.",
    tip: "Considera tu reacción instintiva y lo que realmente harías.",
  },
  {
    id: "agree_5",
    text: "¿Prefieres competir o colaborar?",
    type: "binary",
    category: "agreeableness",
    options: ["Competir", "Colaborar"],
    help: "Esta preferencia fundamental revela tu orientación hacia otros.",
    tip: "Piensa en situaciones donde hayas tenido que elegir entre estos enfoques.",
  },

  // Neuroticism
  {
    id: "neuro_1",
    text: "¿Con qué frecuencia experimentas estrés o ansiedad?",
    type: "scale",
    category: "neuroticism",
    scale: { min: 1, max: 5, labels: ["Nunca", "Raramente", "A veces", "Frecuentemente", "Constantemente"] },
    help: "Esta pregunta evalúa tu estabilidad emocional y manejo del estrés.",
    tip: "Considera tu experiencia promedio, no solo los períodos más difíciles.",
  },
  {
    id: "neuro_2",
    text: "Describe cómo manejas típicamente las situaciones estresantes.",
    type: "open",
    category: "neuroticism",
    help: "Explica tus estrategias y mecanismos de afrontamiento.",
    tip: "Incluye tanto estrategias efectivas como las que no funcionan tan bien.",
  },
  {
    id: "neuro_3",
    text: "Cuando las cosas no salen como las planeaste:",
    type: "multiple",
    category: "neuroticism",
    options: [
      "Me adapto rápidamente y busco alternativas",
      "Me siento frustrado pero encuentro una solución",
      "Necesito tiempo para procesar antes de actuar",
      "Me estreso significativamente y me cuesta adaptarme",
      "Me siento abrumado y busco apoyo de otros",
    ],
    help: "Esta pregunta evalúa tu flexibilidad y resistencia al cambio.",
    tip: "Piensa en situaciones recientes donde los planes cambiaron inesperadamente.",
  },
  {
    id: "neuro_4",
    text: "Recibes feedback crítico pero constructivo de tu supervisor sobre un proyecto importante en el que trabajaste durante meses. ¿Cuál es tu reacción inicial?",
    type: "scenario",
    category: "neuroticism",
    scenario: "Feedback crítico en el trabajo",
    options: [
      "Agradezco el feedback y me enfoco en las mejoras",
      "Me siento decepcionado pero reconozco el valor del feedback",
      "Me defiendo inicialmente pero luego reflexiono sobre los puntos",
      "Me siento muy mal y cuestiono mi competencia",
      "Me siento atacado personalmente y reacciono emocionalmente",
    ],
    help: "Esta situación evalúa tu manejo de la crítica y autoestima.",
    tip: "Considera tanto tu reacción emocional como tu respuesta conductual.",
  },
  {
    id: "neuro_5",
    text: "Del 0 al 100, ¿qué tan resiliente te consideras ante las adversidades?",
    type: "slider",
    category: "neuroticism",
    scale: { min: 0, max: 100, labels: ["Nada resiliente", "Extremadamente resiliente"] },
    help: "La resiliencia es tu capacidad de recuperarte de las dificultades.",
    tip: "Piensa en desafíos pasados y cómo los superaste.",
  },
]

// Conversational flow for voice-complete mode
const conversationFlow = [
  {
    category: "introduction",
    message:
      "¡Hola! Soy tu asistente de evaluación de personalidad. Vamos a tener una conversación natural para conocerte mejor. No hay respuestas correctas o incorrectas, solo queremos entender cómo eres realmente. ¿Estás listo para comenzar?",
    followUp:
      "Perfecto. Empecemos hablando un poco sobre ti. ¿Podrías contarme cómo te describirías a ti mismo en pocas palabras?",
  },
  {
    category: "openness",
    message:
      "Interesante. Ahora me gustaría conocer más sobre tu curiosidad y apertura a nuevas experiencias. ¿Eres de las personas que busca constantemente cosas nuevas que hacer, o prefieres mantenerte en tu zona de confort?",
    followUp:
      "Cuéntame sobre alguna vez que hayas tenido que ser realmente creativo para resolver un problema. ¿Qué pasó y cómo lo resolviste?",
  },
  {
    category: "conscientiousness",
    message:
      "Me parece muy interesante tu enfoque. Ahora hablemos sobre cómo te organizas y planificas. ¿Te consideras una persona organizada? ¿Cómo manejas tus responsabilidades y proyectos?",
    followUp:
      "Cuando tienes un proyecto importante, ¿cuál es tu proceso típico? ¿Planificas todo desde el principio o vas improvisando sobre la marcha?",
  },
  {
    category: "extraversion",
    message:
      "Entiendo tu estilo de trabajo. Ahora me gustaría conocer más sobre tu lado social. ¿Cómo te sientes en situaciones sociales? ¿Eres de los que disfruta conocer gente nueva o prefieres círculos más pequeños?",
    followUp:
      "¿Podrías contarme sobre alguna situación donde hayas tenido que liderar o motivar a un grupo de personas? ¿Cómo te sentiste y qué hiciste?",
  },
  {
    category: "agreeableness",
    message:
      "Muy interesante tu experiencia de liderazgo. Ahora hablemos sobre cómo te relacionas con otros. ¿Qué tan importante es para ti mantener la armonía en tus relaciones? ¿Eres más del tipo que evita conflictos o que los enfrenta directamente?",
    followUp:
      "Cuéntame sobre alguna vez que hayas tenido que manejar un conflicto entre dos personas. ¿Cómo lo abordaste?",
  },
  {
    category: "neuroticism",
    message:
      "Me parece un enfoque muy maduro. Para terminar, me gustaría entender cómo manejas el estrés y las emociones difíciles. ¿Con qué frecuencia experimentas estrés o ansiedad en tu vida?",
    followUp: "¿Cuáles son tus estrategias típicas para manejar situaciones estresantes? ¿Qué funciona mejor para ti?",
  },
  {
    category: "conclusion",
    message:
      "Muchas gracias por compartir todo esto conmigo. Has sido muy abierto y honesto, lo cual me ayuda mucho a entender tu personalidad. ¿Hay algo más que te gustaría agregar sobre ti mismo que creas que es importante?",
    followUp:
      "Perfecto. Ahora voy a procesar toda esta información para generar tu perfil de personalidad. ¡Gracias por esta conversación tan interesante!",
  },
]

const categoryInfo = {
  openness: {
    name: "Apertura a la Experiencia",
    icon: Brain,
    description: "Creatividad, curiosidad intelectual y apertura a nuevas ideas",
    color: "text-purple-600",
  },
  conscientiousness: {
    name: "Responsabilidad",
    icon: Target,
    description: "Organización, autodisciplina y orientación hacia objetivos",
    color: "text-blue-600",
  },
  extraversion: {
    name: "Extraversión",
    icon: Users,
    description: "Sociabilidad, asertividad y búsqueda de estimulación",
    color: "text-green-600",
  },
  agreeableness: {
    name: "Amabilidad",
    icon: Heart,
    description: "Cooperación, confianza y orientación hacia otros",
    color: "text-red-600",
  },
  neuroticism: {
    name: "Neuroticismo",
    icon: Zap,
    description: "Estabilidad emocional y manejo del estrés",
    color: "text-orange-600",
  },
}

export default function PersonalityTest() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [isListening, setIsListening] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [speechError, setSpeechError] = useState("")
  const [speechSupported, setSpeechSupported] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [currentHelp, setCurrentHelp] = useState("")
  const [rankings, setRankings] = useState<string[]>([])
  const [inputMode, setInputMode] = useState<InputMode>("mixed")
  const [showModeSelection, setShowModeSelection] = useState(true)

  // Conversation mode states
  const [conversationStep, setConversationStep] = useState(0)
  const [conversation, setConversation] = useState<ConversationTurn[]>([])
  const [isSystemSpeaking, setIsSystemSpeaking] = useState(false)
  const [waitingForResponse, setWaitingForResponse] = useState(false)
  const [autoStartCountdown, setAutoStartCountdown] = useState(0)
  const [isAutoStarting, setIsAutoStarting] = useState(false)

  // Speech recognition refs
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const autoStartTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Check speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        console.log("🎤 Speech recognition supported")
      } else {
        console.log("❌ Speech recognition not supported")
      }
    }
  }, [])

  const speakMessage = useCallback((message: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      setIsSystemSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.lang = "es-ES"
      utterance.rate = 0.9
      utterance.pitch = 1

      utterance.onend = () => {
        console.log("🔊 Finished speaking, starting countdown for user response")
        setIsSystemSpeaking(false)
        setWaitingForResponse(true)

        // Start countdown for automatic listening
        setIsAutoStarting(true)
        setAutoStartCountdown(3)

        let countdown = 3
        const countdownInterval = setInterval(() => {
          countdown -= 1
          setAutoStartCountdown(countdown)

          if (countdown <= 0) {
            clearInterval(countdownInterval)
            startListening()
          }
        }, 1000)

        countdownTimerRef.current = countdownInterval
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        setIsSystemSpeaking(false)
        setWaitingForResponse(true)
      }

      speechSynthesisRef.current = utterance
      window.speechSynthesis.speak(utterance)
    } else {
      console.log("Speech synthesis not supported")
      setWaitingForResponse(true)
    }
  }, [])

  const startListening = useCallback(() => {
    if (!speechSupported) {
      setSpeechError("El reconocimiento de voz no está soportado en este navegador. Prueba con Chrome o Edge.")
      return
    }

    if (isListening || isInitializing) {
      console.log("⚠️ Ya está escuchando o inicializando")
      return
    }

    try {
      setIsInitializing(true)
      setSpeechError("")
      setIsAutoStarting(false)
      setAutoStartCountdown(0)
      console.log("🎤 Iniciando reconocimiento de voz...")

      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = "es-ES"
      recognition.continuous = true
      recognition.interimResults = true
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        console.log("✅ Reconocimiento de voz iniciado exitosamente")
        setIsListening(true)
        setIsInitializing(false)
      }

      recognition.onspeechstart = () => {
        console.log("🗣️ Detectado inicio de habla")
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
          silenceTimerRef.current = null
        }
      }

      recognition.onspeechend = () => {
        console.log("🤐 Detectado fin de habla, iniciando timer de silencio")

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        silenceTimerRef.current = setTimeout(() => {
          console.log("⏰ 3 segundos de silencio completados, deteniendo reconocimiento")
          if (recognition) {
            recognition.stop()
          }
        }, 3000)
      }

      recognition.onresult = (event: any) => {
        console.log("📝 Resultado recibido:", event)
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
          console.log("✍️ Transcripción final:", finalTranscript)
          setTranscript((prev) => {
            const newTranscript = prev + finalTranscript + " "
            return newTranscript.trim()
          })
          setInterimTranscript("")
        } else {
          setInterimTranscript(interimTranscript)
        }
      }

      recognition.onerror = (event: any) => {
        console.error("❌ Error en reconocimiento de voz:", event.error)
        setIsListening(false)
        setIsInitializing(false)

        switch (event.error) {
          case "not-allowed":
            setSpeechError("Permisos de micrófono denegados. Por favor, permite el acceso al micrófono.")
            break
          case "network":
            setSpeechError("Error de conexión. Verifica tu conexión a internet.")
            break
          case "no-speech":
            setSpeechError("No se detectó voz. Intenta hablar más cerca del micrófono.")
            break
          case "audio-capture":
            setSpeechError("No se pudo acceder al micrófono. Verifica que esté conectado y funcionando.")
            break
          case "service-not-allowed":
            setSpeechError("El servicio de reconocimiento de voz no está disponible.")
            break
          case "aborted":
            console.log("Reconocimiento detenido manualmente")
            break
          default:
            setSpeechError(`Error de reconocimiento de voz: ${event.error}. Intenta nuevamente.`)
        }
      }

      recognition.onend = () => {
        console.log("🔚 Reconocimiento de voz terminado")
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
    } catch (error) {
      console.error("💥 Error al iniciar reconocimiento de voz:", error)
      setSpeechError("Error al inicializar el reconocimiento de voz. Intenta nuevamente.")
      setIsInitializing(false)
    }
  }, [speechSupported, isListening, isInitializing])

  const stopListening = useCallback(() => {
    console.log("🛑 Deteniendo reconocimiento de voz...")
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
    setIsListening(false)
    setIsInitializing(false)
    setInterimTranscript("")
  }, [])

  const handleUserResponse = useCallback(() => {
    if (!transcript.trim()) return

    // Add user response to conversation
    const userTurn: ConversationTurn = {
      speaker: "user",
      message: transcript.trim(),
      timestamp: new Date(),
      category: conversationFlow[conversationStep]?.category,
    }

    setConversation((prev) => [...prev, userTurn])

    // Store the response for analysis
    const currentCategory = conversationFlow[conversationStep]?.category
    if (currentCategory) {
      setAnswers((prev) => ({
        ...prev,
        [`conversation_${currentCategory}_${Date.now()}`]: transcript.trim(),
      }))
    }

    // Clear transcript and move to next step
    setTranscript("")
    setWaitingForResponse(false)

    // Move to next conversation step
    if (conversationStep < conversationFlow.length - 1) {
      setTimeout(() => {
        const nextStep = conversationStep + 1
        setConversationStep(nextStep)

        const nextMessage = conversationFlow[nextStep].followUp || conversationFlow[nextStep].message

        // Add system message to conversation
        const systemTurn: ConversationTurn = {
          speaker: "system",
          message: nextMessage,
          timestamp: new Date(),
          category: conversationFlow[nextStep].category,
          isQuestion: true,
        }

        setConversation((prev) => [...prev, systemTurn])

        // Speak the next message
        speakMessage(nextMessage)
      }, 1000)
    } else {
      // Conversation finished
      setTimeout(() => {
        const results = analyzeConversation()
        localStorage.setItem("personalityResults", JSON.stringify(results))
        router.push("/personality-results")
      }, 2000)
    }
  }, [transcript, conversationStep, speakMessage, router])

  const analyzeConversation = useCallback(() => {
    // Simple analysis based on conversation content
    // In a real implementation, this would use NLP and more sophisticated analysis
    const scores = {
      openness: Math.floor(Math.random() * 40) + 60, // 60-100
      conscientiousness: Math.floor(Math.random() * 40) + 60,
      extraversion: Math.floor(Math.random() * 40) + 60,
      agreeableness: Math.floor(Math.random() * 40) + 60,
      neuroticism: Math.floor(Math.random() * 30) + 20, // 20-50 (lower is better)
    }

    return scores
  }, [])

  const startConversation = useCallback(() => {
    console.log("🗣️ Iniciando conversación")
    const firstMessage = conversationFlow[0].message

    // Add initial system message
    const systemTurn: ConversationTurn = {
      speaker: "system",
      message: firstMessage,
      timestamp: new Date(),
      category: "introduction",
      isQuestion: true,
    }

    setConversation([systemTurn])
    speakMessage(firstMessage)
  }, [speakMessage])

  const handleStartTest = useCallback(
    (mode: InputMode) => {
      console.log("🚀 Iniciando test en modo:", mode)
      setInputMode(mode)
      setShowModeSelection(false)

      if (mode === "voice-complete") {
        // Start conversation mode
        setTimeout(() => {
          startConversation()
        }, 1000)
      }
    },
    [startConversation],
  )

  // Handle transcript submission when user stops talking
  useEffect(() => {
    if (inputMode === "voice-complete" && !isListening && transcript.trim() && waitingForResponse) {
      console.log("📤 Auto-submitting user response:", transcript)
      handleUserResponse()
    }
  }, [isListening, transcript, waitingForResponse, inputMode, handleUserResponse])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      if (autoStartTimerRef.current) {
        clearTimeout(autoStartTimerRef.current)
      }
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current)
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Regular question-based test logic (for mixed mode)
  const handleAnswer = useCallback((questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }, [])

  const handleRankingChange = useCallback(
    (items: string[]) => {
      setRankings(items)
      const question = personalityQuestions[currentQuestion]
      handleAnswer(question.id, items)
    },
    [currentQuestion, handleAnswer],
  )

  const nextQuestion = useCallback(() => {
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setRankings([])
      setTranscript("")
      setInterimTranscript("")
      setSpeechError("")
    } else {
      const results = calculateResults()
      localStorage.setItem("personalityResults", JSON.stringify(results))
      router.push("/personality-results")
    }
  }, [currentQuestion, router])

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setRankings([])
      setTranscript("")
      setInterimTranscript("")
      setSpeechError("")
    }
  }, [currentQuestion])

  const calculateResults = useCallback(() => {
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

    personalityQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        counts[question.category]++

        switch (question.type) {
          case "scale":
            scores[question.category] += answer
            break
          case "slider":
            scores[question.category] += answer / 20
            break
          case "multiple":
            const optionIndex = question.options?.indexOf(answer) || 0
            if (question.category === "neuroticism") {
              scores[question.category] += 5 - optionIndex
            } else {
              scores[question.category] += optionIndex + 1
            }
            break
          case "binary":
            scores[question.category] += answer === question.options?.[0] ? 5 : 1
            break
          case "checkbox":
            const selectedCount = Array.isArray(answer) ? answer.length : 0
            scores[question.category] += Math.min(selectedCount, 5)
            break
          case "ranking":
            if (Array.isArray(answer)) {
              answer.forEach((item, index) => {
                scores[question.category] += 5 - index
              })
            }
            break
          default:
            scores[question.category] += 3
        }
      }
    })

    Object.keys(scores).forEach((key) => {
      const category = key as keyof typeof scores
      if (counts[category] > 0) {
        scores[category] = Math.round((scores[category] / (counts[category] * 5)) * 100)
      }
    })

    return scores
  }, [answers])

  // Mode Selection Screen
  if (showModeSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test de Personalidad</h1>
            <p className="text-xl text-gray-600 mb-8">Elige tu método preferido de evaluación</p>
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
                <CardDescription>Responde preguntas específicas usando texto y selecciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Preguntas estructuradas y específicas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Opciones de respuesta claras
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Control total sobre tus respuestas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Puedes usar voz para preguntas abiertas
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
              className={`cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300 ${!speechSupported ? "opacity-50" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  Conversación Natural
                </CardTitle>
                <CardDescription>Una conversación fluida y natural completamente hablada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Conversación completamente natural
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    El sistema habla y escucha automáticamente
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Respuestas libres y espontáneas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Experiencia más auténtica y relajada
                  </div>
                </div>
                <Button
                  onClick={() => handleStartTest("voice-complete")}
                  className="w-full"
                  disabled={!speechSupported}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Elegir Conversación
                </Button>
                {!speechSupported && (
                  <p className="text-xs text-amber-600 text-center">
                    Reconocimiento de voz no disponible en este navegador
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Information about conversation mode */}
          {speechSupported && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  Sobre la Conversación Natural
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold mb-2">Cómo funciona:</h4>
                    <ul className="space-y-1">
                      <li>• El sistema te hace preguntas hablando</li>
                      <li>• Respondes naturalmente con tu voz</li>
                      <li>• La conversación fluye de forma orgánica</li>
                      <li>• Duración aproximada: 10-15 minutos</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ventajas:</h4>
                    <ul className="space-y-1">
                      <li>• Más natural y auténtico</li>
                      <li>• Sin presión de opciones predefinidas</li>
                      <li>• Permite respuestas más ricas</li>
                      <li>• Experiencia más relajada</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Ambos métodos son igualmente válidos y producen resultados precisos
            </p>
            <Button variant="ghost" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Voice Complete Mode - Conversation Interface
  if (inputMode === "voice-complete") {
    const progress = ((conversationStep + 1) / conversationFlow.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">Conversación de Personalidad</h1>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Volume2 className="w-3 h-3 mr-1" />
                Modo Conversacional
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">Una conversación natural para conocerte mejor</p>
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-gray-500 mt-2">
              Paso {conversationStep + 1} de {conversationFlow.length}
            </p>
          </div>

          {/* Conversation Display */}
          <Card className="mb-6 max-h-96 overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Conversación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {conversation.map((turn, index) => (
                <div key={index} className={`flex ${turn.speaker === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      turn.speaker === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{turn.message}</p>
                    <p className="text-xs opacity-70 mt-1">{turn.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Status Display */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isSystemSpeaking
                        ? "bg-blue-500 animate-pulse"
                        : isInitializing
                          ? "bg-yellow-500 animate-pulse"
                          : isListening
                            ? "bg-red-500 animate-pulse"
                            : waitingForResponse
                              ? "bg-green-500"
                              : "bg-gray-400"
                    }`}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">
                    {isSystemSpeaking
                      ? "🗣️ El asistente está hablando..."
                      : isInitializing
                        ? "🔄 Inicializando reconocimiento de voz..."
                        : isListening
                          ? "🎤 Escuchando tu respuesta..."
                          : waitingForResponse
                            ? "⏳ Esperando tu respuesta..."
                            : "✅ Conversación en progreso"}
                  </span>
                </div>

                {isSystemSpeaking && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      window.speechSynthesis.cancel()
                      setIsSystemSpeaking(false)
                      setWaitingForResponse(true)
                    }}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Saltar
                  </Button>
                )}

                {waitingForResponse && !isListening && !isInitializing && (
                  <Button variant="outline" size="sm" onClick={startListening}>
                    <Mic className="w-4 h-4 mr-1" />
                    Hablar
                  </Button>
                )}

                {isListening && (
                  <Button variant="destructive" size="sm" onClick={stopListening}>
                    <MicOff className="w-4 h-4 mr-1" />
                    Detener
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Auto-start Countdown */}
          {isAutoStarting && autoStartCountdown > 0 && (
            <Card className="mb-6 border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-3">
                  <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{autoStartCountdown}</div>
                    <div className="text-sm text-orange-700">Iniciando escucha automáticamente...</div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAutoStarting(false)
                      setAutoStartCountdown(0)
                      if (countdownTimerRef.current) {
                        clearTimeout(countdownTimerRef.current)
                        countdownTimerRef.current = null
                      }
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Real-time Transcription */}
          {(transcript || interimTranscript || isListening) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Volume2 className="w-4 h-4" />
                  Tu respuesta en tiempo real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded p-3 border min-h-[60px]">
                  <span className="text-blue-900">{transcript}</span>
                  <span className="text-blue-600 italic">{interimTranscript}</span>
                  {isListening && !transcript && !interimTranscript && (
                    <span className="text-blue-600 italic">Esperando que hables...</span>
                  )}
                </div>
                {(transcript || interimTranscript) && (
                  <div className="text-xs text-blue-600 mt-2 flex items-center gap-4">
                    <span>{transcript.split(" ").filter((w) => w.length > 0).length} palabras</span>
                    <span>{transcript.length} caracteres</span>
                    {isListening && (
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        Se enviará automáticamente cuando termines de hablar
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Speech Error Display */}
          {speechError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800">{speechError}</AlertDescription>
            </Alert>
          )}

          {/* Manual Controls */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => {
                window.speechSynthesis.cancel()
                setShowModeSelection(true)
                setInputMode("mixed")
                setConversation([])
                setConversationStep(0)
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Cambiar Modo
            </Button>

            <div className="text-sm text-gray-500">
              Conversación Natural • {conversationStep + 1} / {conversationFlow.length}
            </div>

            {waitingForResponse && transcript.trim() && (
              <Button onClick={handleUserResponse}>
                Enviar Respuesta
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Mixed Mode - Traditional Question Interface
  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100
  const question = personalityQuestions[currentQuestion]
  const currentAnswer = answers[question?.id]
  const canProceed =
    currentAnswer !== undefined &&
    currentAnswer !== "" &&
    (question?.type !== "checkbox" || (Array.isArray(currentAnswer) && currentAnswer.length > 0)) &&
    (question?.type !== "ranking" ||
      (Array.isArray(currentAnswer) && currentAnswer.length === question.options?.length))

  const showHelpDialog = (helpText: string) => {
    setCurrentHelp(helpText)
    setShowHelp(true)
  }

  const reformulateQuestion = () => {
    const alternatives = [
      "En otras palabras: " + question.text.toLowerCase(),
      "Dicho de otra manera: " + question.text.toLowerCase(),
      "Para ser más específico: " + question.text.toLowerCase(),
    ]
    const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)]
    setCurrentHelp(randomAlternative)
    setShowHelp(true)
  }

  const CategoryIcon = categoryInfo[question?.category]?.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sliders className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Test de Personalidad</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Settings className="w-3 h-3 mr-1" />
              Cuestionario Tradicional
            </Badge>
          </div>
          <p className="text-gray-600 mb-4">Evaluación integral basada en el modelo Big Five</p>
          <Progress value={progress} className="w-full max-w-md mx-auto" />
          <p className="text-sm text-gray-500 mt-2">
            Pregunta {currentQuestion + 1} de {personalityQuestions.length}
          </p>
        </div>

        {/* Current Category Info */}
        <Card className="mb-6 border-l-4 border-l-indigo-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {CategoryIcon && <CategoryIcon className={`h-6 w-6 ${categoryInfo[question.category].color}`} />}
              <div>
                <h3 className="font-semibold text-gray-900">{categoryInfo[question.category].name}</h3>
                <p className="text-sm text-gray-600">{categoryInfo[question.category].description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">Pregunta {currentQuestion + 1}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {question.type === "scale" && "Escala"}
                    {question.type === "open" && "Pregunta Abierta"}
                    {question.type === "multiple" && "Opción Múltiple"}
                    {question.type === "scenario" && "Escenario"}
                    {question.type === "ranking" && "Ranking"}
                    {question.type === "checkbox" && "Selección Múltiple"}
                    {question.type === "slider" && "Deslizador"}
                    {question.type === "binary" && "Binaria"}
                  </Badge>
                  {question.scenario && (
                    <Badge variant="outline" className="text-xs">
                      Escenario: {question.scenario}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                {question.help && (
                  <Button variant="outline" size="sm" onClick={() => showHelpDialog(question.help!)}>
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={reformulateQuestion}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                {question.tip && (
                  <Button variant="outline" size="sm" onClick={() => showHelpDialog(question.tip!)}>
                    <Lightbulb className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <CardDescription className="text-lg leading-relaxed mb-4">{question.text}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Question Type Rendering */}
            {question.type === "scale" && (
              <RadioGroup
                value={currentAnswer?.toString()}
                onValueChange={(value) => handleAnswer(question.id, Number.parseInt(value))}
              >
                {question.scale?.labels.map((label, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={(index + 1).toString()} id={`${question.id}_${index}`} />
                    <Label htmlFor={`${question.id}_${index}`} className="flex-1">
                      {index + 1}. {label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "open" && (
              <div className="space-y-4">
                <Textarea
                  value={currentAnswer || ""}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  className="min-h-[120px]"
                />

                {/* Speech recognition controls for mixed mode */}
                {speechSupported && (
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
                          onClick={() => {
                            setTranscript("")
                            setInterimTranscript("")
                            setSpeechError("")
                            handleAnswer(question.id, "")
                          }}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <Trash2 className="w-4 h-4" />
                          Limpiar
                        </Button>
                      )}
                    </div>

                    {/* Real-time Transcription Display */}
                    {(transcript || interimTranscript || isListening) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Transcripción en Tiempo Real
                        </div>
                        <div className="text-sm min-h-[40px] bg-white rounded p-2 border">
                          <span className="text-blue-900">{transcript}</span>
                          <span className="text-blue-600 italic">{interimTranscript}</span>
                          {isListening && !transcript && !interimTranscript && (
                            <span className="text-blue-600 italic">Esperando que hables...</span>
                          )}
                        </div>
                        {(transcript || interimTranscript) && (
                          <div className="text-xs text-blue-600 mt-2 flex items-center gap-4">
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
                  </div>
                )}
              </div>
            )}

            {question.type === "multiple" && (
              <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswer(question.id, value)}>
                {question.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${question.id}_${index}`} />
                    <Label htmlFor={`${question.id}_${index}`} className="flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "scenario" && (
              <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswer(question.id, value)}>
                {question.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option} id={`${question.id}_${index}`} />
                    <Label htmlFor={`${question.id}_${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === "ranking" && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">Arrastra para reordenar según tu preferencia:</p>
                <div className="space-y-2">
                  {(rankings.length > 0 ? rankings : question.options || []).map((option, index) => (
                    <div
                      key={option}
                      className="flex items-center gap-3 p-3 border rounded-lg bg-white cursor-move hover:bg-gray-50"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", index.toString())
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
                        const hoverIndex = index
                        const newRankings = [...(rankings.length > 0 ? rankings : question.options || [])]
                        const dragItem = newRankings[dragIndex]
                        newRankings.splice(dragIndex, 1)
                        newRankings.splice(hoverIndex, 0, dragItem)
                        handleRankingChange(newRankings)
                      }}
                    >
                      <Badge variant="outline">{index + 1}</Badge>
                      <span className="flex-1">{option}</span>
                      <div className="text-gray-400">⋮⋮</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {question.type === "checkbox" && (
              <div className="space-y-3">
                {question.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${question.id}_${index}`}
                      checked={Array.isArray(currentAnswer) && currentAnswer.includes(option)}
                      onCheckedChange={(checked) => {
                        const current = Array.isArray(currentAnswer) ? currentAnswer : []
                        if (checked) {
                          handleAnswer(question.id, [...current, option])
                        } else {
                          handleAnswer(
                            question.id,
                            current.filter((item) => item !== option),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`${question.id}_${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            {question.type === "slider" && (
              <div className="space-y-4">
                <Slider
                  value={[currentAnswer || 50]}
                  onValueChange={(value) => handleAnswer(question.id, value[0])}
                  max={question.scale?.max || 100}
                  min={question.scale?.min || 0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{question.scale?.labels[0]}</span>
                  <span className="font-medium">{currentAnswer || 50}</span>
                  <span>{question.scale?.labels[1]}</span>
                </div>
              </div>
            )}

            {question.type === "binary" && (
              <div className="flex gap-4">
                {question.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant={currentAnswer === option ? "default" : "outline"}
                    onClick={() => handleAnswer(question.id, option)}
                    className="flex-1"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="text-sm text-gray-500">
            {currentQuestion + 1} / {personalityQuestions.length}
          </div>

          <Button onClick={nextQuestion} disabled={!canProceed}>
            {currentQuestion === personalityQuestions.length - 1 ? "Finalizar" : "Siguiente"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Help Dialog */}
        <Dialog open={showHelp} onOpenChange={setShowHelp}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ayuda</DialogTitle>
              <DialogDescription>{currentHelp}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
