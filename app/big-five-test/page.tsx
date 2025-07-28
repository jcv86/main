"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Brain, HelpCircle, ArrowLeft, ArrowRight, CheckCircle, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

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
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showInsight, setShowInsight] = useState(false)
  const [currentInsight, setCurrentInsight] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
  }, [user, router])

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
        userId: user?.id,
      }),
    )
    router.push("/big-five-results")
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQuestionData = questions[currentQuestion]
  const currentAnswer = answers[currentQuestionData?.id]
  const traitProgress = questions.slice(0, currentQuestion + 1).reduce(
    (acc, q) => {
      acc[q.trait] = (acc[q.trait] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    )
  }

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

            {/* Trait Progress */}
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(traitInfo).map(([trait, info]) => (
                <div key={trait} className="text-center">
                  <Badge variant="outline" className={`${info.color} text-xs mb-1`}>
                    {info.icon} {info.name}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{traitProgress[trait] || 0}/8</div>
                </div>
              ))}
            </div>
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

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={finishTest}
              disabled={!currentAnswer || Object.keys(answers).length < questions.length}
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Finalizar Test
            </Button>
          ) : (
            <Button onClick={goToNext} disabled={!currentAnswer} className="flex items-center gap-2">
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Sobre el Test Big Five</p>
              <p>
                Este test evalúa los cinco grandes rasgos de personalidad reconocidos científicamente. Es el modelo más
                utilizado en psicología organizacional y predice mejor el desempeño laboral que otros tests de
                personalidad. Tus resultados se combinarán con tu perfil DISC para darte recomendaciones de carrera más
                precisas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
