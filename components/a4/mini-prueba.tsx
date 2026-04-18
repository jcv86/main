"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  Trophy,
  Loader2,
  ArrowRight,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "fácil" | "medio" | "difícil"
}

export function MiniPrueba() {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [userStats, setUserStats] = useState<any>(null)
  const { user } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (!user?.id) return

    const loadData = async () => {
      try {
        // Load mini quiz questions from database
        const { data: quizData } = await supabase
          .from("a4_mini_quiz")
          .select("*")
          .eq("active", true)
          .order("difficulty", { ascending: false })
          .limit(5)

        setQuestions(quizData || generateDefaultQuestions())

        // Load user stats
        const { data: stats } = await supabase
          .from("despega_cerebral_stats")
          .select("*")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle()

        setUserStats(stats)
        setAnswers(new Array((quizData || generateDefaultQuestions()).length).fill(null))
      } catch (error) {
        console.error("[v0] Error loading quiz:", error)
        const defaultQuestions = generateDefaultQuestions()
        setQuestions(defaultQuestions)
        setAnswers(new Array(defaultQuestions.length).fill(null))
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  const generateDefaultQuestions = (): Question[] => [
    {
      id: "q1",
      question: "¿Qué es el Índice de Precios al Consumidor (IPC)?",
      options: [
        "Una medida que refleja los cambios en precios de bienes y servicios",
        "El precio promedio de los productos importados",
        "La tasa de interés del Banco Central",
        "El valor del dólar en el mercado",
      ],
      correctAnswer: 0,
      explanation:
        "El IPC mide la variación de precios de un conjunto representativo de bienes y servicios que consume un hogar promedio.",
      difficulty: "fácil",
    },
    {
      id: "q2",
      question:
        "Si el Banco Central SUBE la tasa de interés, ¿qué sucede típicamente en la economía?",
      options: [
        "Los créditos se hacen más caros, desalienta el consumo",
        "Los créditos se hacen más baratos, se impulsa el consumo",
        "El desempleo sube inmediatamente",
        "La inflación desaparece",
      ],
      correctAnswer: 0,
      explanation:
        "Una tasa de interés más alta encarece el financiamiento, reduciendo el consumo e inversión para frenar la inflación.",
      difficulty: "medio",
    },
    {
      id: "q3",
      question: "¿Cuál es el objetivo principal del Banco Central de Chile?",
      options: [
        "Maximizar el rendimiento de la bolsa",
        "Mantener la estabilidad de precios y el pleno empleo",
        "Garantizar la ganancia de los bancos",
        "Controlar completamente el tipo de cambio",
      ],
      correctAnswer: 1,
      explanation:
        "El Banco Central tiene mandatos de estabilidad de precios (inflación) y empleo, buscando un equilibrio entre ambos.",
      difficulty: "fácil",
    },
    {
      id: "q4",
      question:
        "¿Qué significa que una empresa tenga 'leverage' o apalancamiento?",
      options: [
        "Que usa dinero prestado para financiar sus operaciones",
        "Que tiene muchos empleados",
        "Que vende más que la competencia",
        "Que tiene oficinas en varios países",
      ],
      correctAnswer: 0,
      explanation:
        "El apalancamiento es el uso de dinero prestado (deuda) para amplificar los retornos sobre el capital invertido.",
      difficulty: "medio",
    },
    {
      id: "q5",
      question:
        "Si la tasa de desempleo sube inesperadamente, ¿cuál es el impacto PROBABLE en la inflación a corto plazo?",
      options: [
        "La inflación sube porque hay menos demanda",
        "La inflación baja porque hay menos demanda agregada",
        "La inflación no se ve afectada",
        "La inflación sube porque hay menos producción",
      ],
      correctAnswer: 1,
      explanation:
        "Un desempleo más alto típicamente reduce la demanda agregada, lo que presiona a la baja la inflación en el corto plazo.",
      difficulty: "difícil",
    },
  ]

  const handleAnswer = (optionIndex: number) => {
    if (showExplanation) return

    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = optionIndex
    setAnswers(newAnswers)

    setShowExplanation(true)

    // Calculate score
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setShowExplanation(false)
    } else {
      setQuizComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setAnswers(new Array(questions.length).fill(null))
    setShowExplanation(false)
    setQuizComplete(false)
    setScore(0)
  }

  if (loading) {
    return (
      <Card className="bg-background">
        <CardContent className="pt-12 pb-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Cargando mini prueba...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    const isPerfect = percentage === 100
    const isGood = percentage >= 80
    const isOkay = percentage >= 60

    return (
      <div className="space-y-6">
        <Card className="border-0 bg-background">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-[20px] bg-background">
                  {isPerfect ? (
                    <Trophy className="w-12 h-12 text-white" />
                  ) : isGood ? (
                    <Zap className="w-12 h-12 text-white" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-2">{percentage}%</h2>
            <p className="text-lg text-muted-foreground mb-2">
              Has respondido {score} de {questions.length} correctamente
            </p>

            <div className="mb-6">
              {isPerfect && (
                <p className="text-lg font-semibold text-purple">
                  ¡Excelente! Eres un experto en economía
                </p>
              )}
              {!isPerfect && isGood && (
                <p className="text-lg font-semibold text-purple">
                  ¡Muy bien! Tienes sólida comprensión económica
                </p>
              )}
              {!isPerfect && !isGood && isOkay && (
                <p className="text-lg font-semibold text-purple">
                  Buen inicio. Considera estudiar más para mejorar
                </p>
              )}
              {!isOkay && (
                <p className="text-lg font-semibold text-purple">
                  Keep learning. La economía es compleja, ¡practica más!
                </p>
              )}
            </div>

            <div className="space-y-2 mb-6">
              <Button onClick={handleRestart} className="w-full">
                Repetir Prueba
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <a href="/despega/a4">Volver al Radar</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Answer Review */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Revisión de Respuestas</h3>
          <div className="space-y-2">
            {questions.map((q, idx) => {
              const isCorrect =
                answers[idx] === q.correctAnswer
              return (
                <div
                  key={q.id}
                  className="flex items-center gap-3 p-3 rounded-[28px] bg-card/70 backdrop-blur-sm"
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green/50 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red flex-shrink-0" />
                  )}
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-1">{q.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Respuesta: {q.options[answers[idx] || 0]}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      isCorrect
                        ? "bg-green/50/10 text-green dark:text-green/40"
                        : "bg-red/50/10 text-red dark:text-red/40"
                    }
                  >
                    {isCorrect ? "Correcta" : "Incorrecta"}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const userAnswer = answers[currentQuestionIndex]
  const isAnswered = userAnswer !== null
  const isCorrect = userAnswer === currentQuestion.correctAnswer

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Mini Prueba de Economía</h2>
            <p className="text-sm text-muted-foreground">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple">
              {score} / {questions.length}
            </div>
            <p className="text-xs text-muted-foreground">Correctas</p>
          </div>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
      </div>

      {/* Question Card */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">
                {currentQuestion.question}
              </CardTitle>
            </div>
            <Badge
              className={
                currentQuestion.difficulty === "fácil"
                  ? "bg-green/50/10 text-green dark:text-green/40"
                  : currentQuestion.difficulty === "medio"
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                    : "bg-red/50/10 text-red dark:text-red/40"
              }
              variant="outline"
            >
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-[28px] border-2 transition-all ${`}
                !isAnswered
                  ? "border-border hover:border-purple/50 hover:bg-purple/5 cursor-pointer"
                  : idx === currentQuestion.correctAnswer
                    ? "border-green bg-green/50/10"
                    : idx === userAnswer && !isCorrect
                      ? "border-red/50 bg-red/50/10"
                      : "border-border opacity-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${`}
                    isAnswered && idx === currentQuestion.correctAnswer
                      ? "bg-green/50 border-green text-white"
                      : isAnswered && idx === userAnswer && !isCorrect
                        ? "bg-red/50 border-red/50 text-white"
                        : "border-current"
                  }`}
                >
                  {idx === currentQuestion.correctAnswer && isAnswered ? (
                    "✓"
                  ) : idx === userAnswer && !isCorrect && isAnswered ? (
                    "✗"
                  ) : (
                    String.fromCharCode(65 + idx)
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Explanation */}
      {showExplanation && (
        <Alert
          className={`border-0 ${
            isCorrect
              ? "bg-green/50/10"
              : "bg-red/50/10"`}
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className={isCorrect ? "text-green dark:text-green/40" : "text-red dark:text-red/40"}>
            <p className="font-semibold mb-2">
              {isCorrect ? "¡Correcto!" : "Respuesta incorrecta"}
            </p>
            <p>{currentQuestion.explanation}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Navigation */}
      <Button
        onClick={handleNext}
        disabled={!isAnswered}
        className="w-full"
        size="lg"
      >
        {currentQuestionIndex === questions.length - 1 ? "Ver Resultados" : "Siguiente"}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
