"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Target,
  TrendingUp,
  Award,
  Save,
  WifiOff,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { SyncStatusComponent } from "@/components/sync-status"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: number
  category: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface AssessmentResult {
  category: string
  score: number
  maxScore: number
  percentage: number
  level: string
  recommendations: string[]
}

const mockQuestions: Question[] = [
  {
    id: 1,
    category: "JavaScript",
    question: "¿Cuál es la diferencia principal entre 'let' y 'var' en JavaScript?",
    options: [
      "No hay diferencia",
      "let tiene scope de bloque, var tiene scope de función",
      "var es más rápido que let",
      "let solo se puede usar en funciones",
    ],
    correctAnswer: 1,
    explanation:
      "'let' tiene scope de bloque mientras que 'var' tiene scope de función, lo que hace que 'let' sea más predecible y menos propenso a errores.",
    difficulty: "intermediate",
  },
  {
    id: 2,
    category: "React",
    question: "¿Qué hook de React se usa para manejar efectos secundarios?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: 1,
    explanation:
      "useEffect se usa para manejar efectos secundarios como llamadas a APIs, suscripciones, o manipulación del DOM.",
    difficulty: "beginner",
  },
  {
    id: 3,
    category: "CSS",
    question: "¿Cuál es la diferencia entre 'display: none' y 'visibility: hidden'?",
    options: [
      "Son exactamente iguales",
      "display: none oculta el elemento y no ocupa espacio, visibility: hidden lo oculta pero mantiene el espacio",
      "visibility: hidden es más rápido",
      "display: none solo funciona en elementos de bloque",
    ],
    correctAnswer: 1,
    explanation:
      "'display: none' remueve completamente el elemento del flujo del documento, mientras que 'visibility: hidden' solo lo hace invisible pero mantiene su espacio.",
    difficulty: "intermediate",
  },
  {
    id: 4,
    category: "Node.js",
    question: "¿Qué es el Event Loop en Node.js?",
    options: [
      "Un bucle infinito que bloquea la aplicación",
      "El mecanismo que permite a Node.js realizar operaciones no bloqueantes",
      "Una función para crear eventos",
      "Un método para debuggear aplicaciones",
    ],
    correctAnswer: 1,
    explanation:
      "El Event Loop es el mecanismo que permite a Node.js realizar operaciones I/O no bloqueantes a pesar de que JavaScript es single-threaded.",
    difficulty: "advanced",
  },
  {
    id: 5,
    category: "Database",
    question: "¿Qué significa ACID en bases de datos?",
    options: [
      "Advanced Computer Information Database",
      "Atomicity, Consistency, Isolation, Durability",
      "Automatic Code Integration Development",
      "Application Control Interface Design",
    ],
    correctAnswer: 1,
    explanation:
      "ACID son las propiedades que garantizan que las transacciones de base de datos se procesen de manera confiable: Atomicidad, Consistencia, Aislamiento y Durabilidad.",
    difficulty: "intermediate",
  },
  {
    id: 6,
    category: "Git",
    question: "¿Cuál es la diferencia entre 'git merge' y 'git rebase'?",
    options: [
      "No hay diferencia",
      "merge crea un commit de merge, rebase reescribe la historia",
      "rebase es más lento que merge",
      "merge solo funciona con branches remotos",
    ],
    correctAnswer: 1,
    explanation:
      "'git merge' crea un nuevo commit que combina dos branches, mientras que 'git rebase' reescribe la historia moviendo commits a una nueva base.",
    difficulty: "advanced",
  },
  {
    id: 7,
    category: "TypeScript",
    question: "¿Qué es un 'interface' en TypeScript?",
    options: [
      "Una clase abstracta",
      "Un contrato que define la estructura de un objeto",
      "Una función especial",
      "Un tipo de variable",
    ],
    correctAnswer: 1,
    explanation:
      "Un interface en TypeScript define un contrato que especifica qué propiedades y métodos debe tener un objeto.",
    difficulty: "beginner",
  },
  {
    id: 8,
    category: "API",
    question: "¿Qué significa REST en el contexto de APIs?",
    options: [
      "Really Easy Simple Technology",
      "Representational State Transfer",
      "Remote Execution Service Tool",
      "Rapid Enterprise Software Testing",
    ],
    correctAnswer: 1,
    explanation:
      "REST (Representational State Transfer) es un estilo arquitectónico para diseñar servicios web que usa HTTP de manera estándar.",
    difficulty: "intermediate",
  },
]

export default function SkillsAssessmentPage() {
  const router = useRouter()
  const { user, isOffline, saveOfflineData } = useAuth()
  const { toast } = useToast()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<AssessmentResult[]>([])
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes
  const [isActive, setIsActive] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            handleFinishAssessment()
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (timeRemaining === 0) {
      handleFinishAssessment()
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timeRemaining])

  // Auto-save progress
  useEffect(() => {
    if (autoSaveEnabled && user && Object.keys(answers).length > 0) {
      const saveProgress = async () => {
        try {
          const progressData = {
            id: `assessment-progress-${user.id}`,
            user_id: user.id,
            current_question: currentQuestion,
            answers: answers,
            time_remaining: timeRemaining,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }

          await saveOfflineData("assessment_progress", progressData, "update")
        } catch (error) {
          console.error("Error saving progress:", error)
        }
      }

      const debounceTimer = setTimeout(saveProgress, 2000)
      return () => clearTimeout(debounceTimer)
    }
  }, [answers, currentQuestion, timeRemaining, user, saveOfflineData, autoSaveEnabled])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartAssessment = () => {
    setIsActive(true)
    toast({
      title: "Evaluación iniciada",
      description: "Tienes 30 minutos para completar la evaluación.",
    })
  }

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setShowExplanation(false)
    }
  }

  const calculateResults = (): AssessmentResult[] => {
    const categories = [...new Set(mockQuestions.map((q) => q.category))]

    return categories.map((category) => {
      const categoryQuestions = mockQuestions.filter((q) => q.category === category)
      const correctAnswers = categoryQuestions.filter((q) => answers[q.id] === q.correctAnswer).length
      const percentage = (correctAnswers / categoryQuestions.length) * 100

      let level = "Principiante"
      let recommendations: string[] = []

      if (percentage >= 80) {
        level = "Avanzado"
        recommendations = [
          `Excelente dominio de ${category}`,
          "Considera enseñar o mentorear a otros",
          "Mantente actualizado con las últimas tendencias",
        ]
      } else if (percentage >= 60) {
        level = "Intermedio"
        recommendations = [
          `Buen conocimiento de ${category}`,
          "Practica con proyectos más complejos",
          "Profundiza en conceptos avanzados",
        ]
      } else {
        level = "Principiante"
        recommendations = [
          `Necesitas reforzar conocimientos en ${category}`,
          "Comienza con tutoriales básicos",
          "Practica con ejercicios simples",
        ]
      }

      return {
        category,
        score: correctAnswers,
        maxScore: categoryQuestions.length,
        percentage,
        level,
        recommendations,
      }
    })
  }

  const handleFinishAssessment = async () => {
    setIsActive(false)
    const assessmentResults = calculateResults()
    setResults(assessmentResults)
    setShowResults(true)

    // Save results
    if (user) {
      try {
        const resultData = {
          id: crypto.randomUUID(),
          user_id: user.id,
          assessment_type: "technical_skills",
          results: assessmentResults,
          answers: answers,
          completed_at: new Date().toISOString(),
          time_taken: 30 * 60 - timeRemaining,
          created_at: new Date().toISOString(),
        }

        await saveOfflineData("skill_assessments", resultData)

        toast({
          title: "Evaluación completada",
          description: isOffline
            ? "Los resultados se sincronizarán cuando se restaure la conexión."
            : "Los resultados han sido guardados exitosamente.",
        })
      } catch (error) {
        console.error("Error saving results:", error)
        toast({
          title: "Error al guardar",
          description: "No se pudieron guardar los resultados.",
          variant: "destructive",
        })
      }
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setTimeRemaining(30 * 60)
    setIsActive(false)
    setShowExplanation(false)
  }

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / mockQuestions.length) * 100
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Award className="w-8 h-8 text-yellow-600" />
              <h1 className="text-3xl font-bold text-gray-900">Resultados de la Evaluación</h1>
            </div>
            <p className="text-gray-600">Has completado la evaluación técnica. Aquí están tus resultados detallados.</p>
          </div>

          {/* Sync Status */}
          <div className="mb-6">
            <SyncStatusComponent compact />
          </div>

          {/* Overall Stats */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Resumen General</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)}%
                  </div>
                  <div className="text-sm text-gray-600">Puntuación Promedio</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {results.reduce((acc, r) => acc + r.score, 0)}/{results.reduce((acc, r) => acc + r.maxScore, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Respuestas Correctas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{formatTime(30 * 60 - timeRemaining)}</div>
                  <div className="text-sm text-gray-600">Tiempo Utilizado</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Results */}
          <div className="space-y-6 mb-8">
            {results.map((result) => (
              <Card key={result.category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{result.category}</span>
                    <Badge
                      className={
                        result.percentage >= 80
                          ? "bg-green-100 text-green-800"
                          : result.percentage >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {result.level}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {result.score} de {result.maxScore} correctas
                    </span>
                    <span className="text-lg font-semibold">{Math.round(result.percentage)}%</span>
                  </div>
                  <Progress value={result.percentage} className="h-2" />

                  <div>
                    <h4 className="font-medium mb-2">Recomendaciones:</h4>
                    <ul className="space-y-1">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center space-x-4">
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Repetir Evaluación
            </Button>
            <Button onClick={() => router.push("/dashboard")}>
              <Target className="w-4 h-4 mr-2" />
              Ir al Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <BookOpen className="w-6 h-6" />
                <span>Evaluación de Habilidades Técnicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Offline Warning */}
              {isOffline && (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <WifiOff className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-800">Modo sin conexión</div>
                    <div className="text-sm text-yellow-700">
                      Los resultados se sincronizarán cuando se restaure la conexión.
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Esta evaluación mide tus conocimientos técnicos en diferentes áreas del desarrollo web.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Duración</div>
                    <div className="text-blue-700">30 minutos</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Preguntas</div>
                    <div className="text-green-700">{mockQuestions.length} preguntas</div>
                  </div>
                </div>

                <div className="text-left space-y-2">
                  <h3 className="font-medium">Categorías incluidas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(mockQuestions.map((q) => q.category))].map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button onClick={handleStartAssessment} className="w-full" size="lg">
                <Clock className="w-4 h-4 mr-2" />
                Comenzar Evaluación
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = mockQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Evaluación Técnica</h1>
            <div className="flex items-center space-x-4">
              <SyncStatusComponent compact />
              <div className="flex items-center space-x-2 text-lg font-mono">
                <Clock className="w-5 h-5 text-red-600" />
                <span className={timeRemaining < 300 ? "text-red-600" : "text-gray-900"}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Pregunta {currentQuestion + 1} de {mockQuestions.length}
              </span>
              <span>
                {getAnsweredCount()} de {mockQuestions.length} respondidas
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{currentQ.category}</Badge>
              <Badge
                className={
                  currentQ.difficulty === "beginner"
                    ? "bg-green-100 text-green-800"
                    : currentQ.difficulty === "intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {currentQ.difficulty === "beginner" && "Principiante"}
                {currentQ.difficulty === "intermediate" && "Intermedio"}
                {currentQ.difficulty === "advanced" && "Avanzado"}
              </Badge>
            </div>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQ.id]?.toString()}
              onValueChange={(value) => handleAnswerSelect(currentQ.id, Number.parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Show explanation after answering */}
            {answers[currentQ.id] !== undefined && showExplanation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900 mb-1">Explicación:</div>
                    <div className="text-blue-800 text-sm">{currentQ.explanation}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button onClick={handlePreviousQuestion} disabled={currentQuestion === 0} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex items-center space-x-2">
            {answers[currentQ.id] !== undefined && !showExplanation && (
              <Button onClick={() => setShowExplanation(true)} variant="outline" size="sm">
                Ver Explicación
              </Button>
            )}

            <Button
              onClick={() => {
                const progressData = {
                  current_question: currentQuestion,
                  answers: answers,
                  time_remaining: timeRemaining,
                }
                toast({
                  title: "Progreso guardado",
                  description: isOffline
                    ? "Se sincronizará cuando se restaure la conexión."
                    : "Tu progreso ha sido guardado.",
                })
              }}
              variant="outline"
              size="sm"
            >
              <Save className="w-4 h-4 mr-1" />
              Guardar
            </Button>
          </div>

          {currentQuestion === mockQuestions.length - 1 ? (
            <Button
              onClick={handleFinishAssessment}
              disabled={getAnsweredCount() === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Finalizar
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Auto-save indicator */}
        {autoSaveEnabled && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
              <Save className="w-3 h-3" />
              <span>Guardado automático activado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
