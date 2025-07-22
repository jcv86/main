"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
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
  Sliders,
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
  const [speechRecognition, setSpeechRecognition] = useState<any>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [currentHelp, setCurrentHelp] = useState("")
  const [rankings, setRankings] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "es-ES"

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        const question = personalityQuestions[currentQuestion]
        if (question.type === "open") {
          setAnswers((prev) => ({ ...prev, [question.id]: transcript }))
        }
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      setSpeechRecognition(recognition)
    }
  }, [currentQuestion])

  const startListening = () => {
    if (speechRecognition) {
      setIsListening(true)
      speechRecognition.start()
    }
  }

  const stopListening = () => {
    if (speechRecognition) {
      speechRecognition.stop()
      setIsListening(false)
    }
  }

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleRankingChange = (items: string[]) => {
    setRankings(items)
    const question = personalityQuestions[currentQuestion]
    handleAnswer(question.id, items)
  }

  const nextQuestion = () => {
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setRankings([])
    } else {
      // Calculate results and navigate
      const results = calculateResults()
      localStorage.setItem("personalityResults", JSON.stringify(results))
      router.push("/personality-results")
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setRankings([])
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

    personalityQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        counts[question.category]++

        switch (question.type) {
          case "scale":
            scores[question.category] += answer
            break
          case "slider":
            scores[question.category] += answer / 20 // Convert 0-100 to 0-5 scale
            break
          case "multiple":
            // Score based on option index (reversed for some categories)
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
            // Score based on ranking position
            if (Array.isArray(answer)) {
              answer.forEach((item, index) => {
                scores[question.category] += 5 - index
              })
            }
            break
          default:
            scores[question.category] += 3 // Neutral score for open questions
        }
      }
    })

    // Normalize scores to 0-100 scale
    Object.keys(scores).forEach((key) => {
      const category = key as keyof typeof scores
      if (counts[category] > 0) {
        scores[category] = Math.round((scores[category] / (counts[category] * 5)) * 100)
      }
    })

    return scores
  }

  const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100
  const question = personalityQuestions[currentQuestion]
  const currentAnswer = answers[question.id]
  const canProceed =
    currentAnswer !== undefined &&
    currentAnswer !== "" &&
    (question.type !== "checkbox" || (Array.isArray(currentAnswer) && currentAnswer.length > 0)) &&
    (question.type !== "ranking" || (Array.isArray(currentAnswer) && currentAnswer.length === question.options?.length))

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

  const CategoryIcon = categoryInfo[question.category].icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sliders className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Test de Personalidad</h1>
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
              <CategoryIcon className={`h-6 w-6 ${categoryInfo[question.category].color}`} />
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
                <CardTitle className="text-xl mb-2">{question.text}</CardTitle>
                {question.scenario && (
                  <Badge variant="outline" className="mb-2">
                    Escenario: {question.scenario}
                  </Badge>
                )}
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
                <div className="flex gap-2">
                  {speechRecognition && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={isListening ? stopListening : startListening}
                      disabled={isListening}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Detener
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Hablar
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(question.text)
                      utterance.lang = "es-ES"
                      speechSynthesis.speak(utterance)
                    }}
                  >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Escuchar pregunta
                  </Button>
                </div>
                {isListening && (
                  <Alert>
                    <Mic className="h-4 w-4" />
                    <AlertDescription>Escuchando... Habla claramente y pausadamente.</AlertDescription>
                  </Alert>
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
