"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Heart,
  MessageSquare,
  Target,
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BookOpen,
  TrendingUp,
} from "lucide-react"

interface TestQuestion {
  id: string
  text: string
  options: Array<{
    id: string
    text: string
    value: number
  }>
  category: string
}

const SAMPLE_QUESTIONS: TestQuestion[] = [
  {
    id: "ei_1",
    text: "¿Con qué frecuencia reconoces tus emociones en el momento que las experimentas durante reuniones de trabajo?",
    category: "Autoconciencia Emocional",
    options: [
      { id: "1", text: "Nunca me doy cuenta", value: 1 },
      { id: "2", text: "Rara vez", value: 2 },
      { id: "3", text: "A veces", value: 3 },
      { id: "4", text: "Frecuentemente", value: 4 },
      { id: "5", text: "Siempre soy consciente", value: 5 },
    ],
  },
  {
    id: "ei_2",
    text: "Cuando un colega te critica tu trabajo frente a otros, ¿cuál es tu reacción más probable?",
    category: "Autorregulación",
    options: [
      { id: "a", text: "Me defendería inmediatamente", value: 2 },
      { id: "b", text: "Me quedaría callado pero molesto", value: 2 },
      { id: "c", text: "Pediría hablar en privado después", value: 4 },
      { id: "d", text: "Agradecería el feedback constructivo", value: 5 },
      { id: "e", text: "Me disculparía profusamente", value: 1 },
    ],
  },
  {
    id: "ei_3",
    text: "¿Qué tan bien puedes identificar las emociones de otros observando su lenguaje corporal?",
    category: "Empatía",
    options: [
      { id: "1", text: "Muy mal", value: 1 },
      { id: "2", text: "Mal", value: 2 },
      { id: "3", text: "Regular", value: 3 },
      { id: "4", text: "Bien", value: 4 },
      { id: "5", text: "Muy bien", value: 5 },
    ],
  },
  {
    id: "ei_4",
    text: "En una situación de conflicto en el equipo, ¿cuál es tu enfoque típico?",
    category: "Habilidades Sociales",
    options: [
      { id: "a", text: "Evito involucrarme", value: 1 },
      { id: "b", text: "Tomo partido por quien creo que tiene razón", value: 2 },
      { id: "c", text: "Trato de mediar y encontrar soluciones", value: 5 },
      { id: "d", text: "Reporto la situación a mi supervisor", value: 3 },
      { id: "e", text: "Espero que se resuelva solo", value: 1 },
    ],
  },
  {
    id: "ei_5",
    text: "¿Con qué frecuencia adaptas tu estilo de comunicación según la persona con quien hablas?",
    category: "Adaptabilidad Social",
    options: [
      { id: "1", text: "Nunca, siempre hablo igual", value: 1 },
      { id: "2", text: "Rara vez", value: 2 },
      { id: "3", text: "A veces", value: 3 },
      { id: "4", text: "Frecuentemente", value: 4 },
      { id: "5", text: "Siempre me adapto", value: 5 },
    ],
  },
]

export default function AdaptiveSkillsTestPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [testStarted, setTestStarted] = useState(false)

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / SAMPLE_QUESTIONS.length) * 100

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0)
    const averageScore = totalScore / Object.values(answers).length
    const percentage = Math.round((averageScore / 5) * 100)

    let level = "En desarrollo"
    if (percentage >= 85) level = "Excelente"
    else if (percentage >= 70) level = "Alto"
    else if (percentage >= 55) level = "Medio"
    else if (percentage >= 40) level = "Básico"

    return { percentage, level, totalScore, averageScore }
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Adaptativo de Inteligencia Emocional</h1>
            <p className="text-xl text-gray-600 mb-8">
              Evaluación personalizada que se adapta a tus respuestas para mayor precisión
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Sparkles className="w-3 h-3 mr-1" />
                Tecnología Adaptativa
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Brain className="w-3 h-3 mr-1" />
                Coach IA Integrado
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <BookOpen className="w-3 h-3 mr-1" />
                Recomendaciones Personalizadas
              </Badge>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-center text-2xl">Inteligencia Emocional</CardTitle>
              <CardDescription className="text-center text-lg">
                Evalúa tu capacidad para reconocer, comprender y gestionar emociones propias y ajenas en el contexto
                laboral
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Duración</h3>
                  <p className="text-sm text-gray-600">5-8 minutos</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Preguntas</h3>
                  <p className="text-sm text-gray-600">5 preguntas adaptativas</p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  ¿Cómo funciona el test adaptativo?
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Se adapta a tus respuestas en tiempo real</li>
                  <li>• Evita preguntas redundantes para mayor eficiencia</li>
                  <li>• Proporciona resultados más precisos en menos tiempo</li>
                  <li>• Incluye feedback inmediato del Coach IA</li>
                </ul>
              </div>

              <Button onClick={() => setTestStarted(true)} size="lg" className="w-full">
                <ArrowRight className="w-5 h-5 mr-2" />
                Comenzar Test Adaptativo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    const results = calculateResults()

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">¡Test Completado!</h1>
            <p className="text-xl text-gray-600">Tus resultados de Inteligencia Emocional</p>
          </div>

          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-6 h-6" />
                Evaluación Completada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-green-600">{results.percentage}%</div>
                  <div className="text-sm text-green-700">Puntuación General</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{results.level}</div>
                  <div className="text-sm text-blue-700">Nivel de Desarrollo</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">5/5</div>
                  <div className="text-sm text-purple-700">Preguntas Respondidas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                Análisis del Coach IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  <strong>¡Excelente trabajo completando tu evaluación de Inteligencia Emocional!</strong>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Tus resultados muestran un <strong>{results.level.toLowerCase()}</strong> nivel de desarrollo
                  emocional con una puntuación de <strong>{results.percentage}%</strong>.
                  {results.percentage >= 70
                    ? " Esto indica que tienes una sólida base en el reconocimiento y manejo de emociones, tanto propias como ajenas."
                    : " Hay excelentes oportunidades para desarrollar estas habilidades fundamentales para el éxito profesional."}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  La inteligencia emocional es una de las competencias más valoradas en el mercado laboral chileno
                  actual. Te recomiendo enfocarte en la práctica diaria de estas habilidades y considerar la lectura de
                  recursos especializados de nuestra biblioteca.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>
                    ¿Te gustaría que conversemos sobre estrategias específicas para seguir desarrollando tu inteligencia
                    emocional?
                  </strong>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                Recomendaciones Personalizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Inteligencia Emocional - Daniel Goleman</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Libro fundamental para profundizar en el desarrollo de la inteligencia emocional
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ 2-3 semanas</span>
                      <span>📚 Biblioteca DTC</span>
                      <Badge variant="outline" className="border-red-300 text-red-700">
                        Alta Prioridad
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Sesión de Coaching Personalizada</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Conversación con el Coach IA para crear un plan de desarrollo específico
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ 30 minutos</span>
                      <span>🤖 Coach IA DTC</span>
                      <Badge variant="outline" className="border-red-300 text-red-700">
                        Alta Prioridad
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Ejercicios de Autoconciencia Emocional</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Actividades prácticas para mejorar el reconocimiento de emociones
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>⏱️ 15 min/día</span>
                      <span>📱 Práctica Diaria</span>
                      <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                        Media Prioridad
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-blue-600" />
                Próximos Pasos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <p className="text-sm">
                    Revisa tus resultados y reflexiona sobre las áreas de fortaleza identificadas
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <p className="text-sm">
                    Comienza leyendo "Inteligencia Emocional" de Daniel Goleman en nuestra biblioteca
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <p className="text-sm">
                    Programa una sesión de coaching para crear tu plan personalizado de desarrollo
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    4
                  </div>
                  <p className="text-sm">
                    Practica las técnicas de autoconciencia emocional en situaciones laborales reales
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    5
                  </div>
                  <p className="text-sm">Repite la evaluación en 4-6 semanas para medir tu progreso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button onClick={() => router.push("/career-coach")}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Hablar con el Coach
            </Button>
            <Button variant="outline" onClick={() => router.push("/library")}>
              <BookOpen className="w-4 h-4 mr-2" />
              Ver Libros Recomendados
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Hacer Otro Test
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test de Inteligencia Emocional</h1>
          <p className="text-gray-600">
            Pregunta {currentQuestionIndex + 1} de {SAMPLE_QUESTIONS.length}
          </p>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 mt-2">
            <Sparkles className="w-3 h-3 mr-1" />
            Adaptativo
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">
                  {currentQuestion.category}
                </Badge>
                <CardTitle className="text-xl">Pregunta Adaptativa</CardTitle>
              </div>
            </div>
            <CardDescription className="text-lg leading-relaxed">{currentQuestion.text}</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ""}
              onValueChange={(value) => handleAnswer(Number.parseInt(value))}
              className="space-y-4"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Button onClick={handleNext} disabled={!answers[currentQuestion.id]} size="lg" className="px-8">
            {currentQuestionIndex === SAMPLE_QUESTIONS.length - 1 ? "Ver Resultados" : "Siguiente"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Adaptive Info */}
        <Alert>
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            Este test se adapta a tus respuestas para proporcionarte la evaluación más precisa y eficiente posible.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
