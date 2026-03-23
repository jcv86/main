"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Zap, Trophy, Clock, Brain } from "lucide-react"
import { getGamifiedTests } from "@/lib/supabase/a4-queries"

interface TestQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: number
}

export function GamifiedTests() {
  const [tests, setTests] = useState<any[]>([])
  const [selectedTest, setSelectedTest] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const testsData = await getGamifiedTests(10)
      setTests(testsData)
    } catch (error) {
      console.error("[v0] Error loading tests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTest = (test: any) => {
    setSelectedTest(test)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    })
  }

  const handleSubmitTest = () => {
    if (!selectedTest?.questions) return

    let correctCount = 0
    selectedTest.questions.forEach((question: TestQuestion) => {
      if (answers[question.id] === question.correct_answer) {
        correctCount++
      }
    })

    const calculatedScore = Math.round((correctCount / selectedTest.questions.length) * 100)
    setScore(calculatedScore)
    setSubmitted(true)
  }

  if (loading) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardContent className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  if (selectedTest) {
    return (
      <div className="space-y-4">
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedTest.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{selectedTest.description}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedTest(null)}>
                Volver
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {submitted ? (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Trophy className="w-12 h-12 mx-auto text-yellow-500" />
                  <div className="text-4xl font-bold">{score}%</div>
                  <p className="text-muted-foreground">
                    {score >= 80 ? "¡Excelente desempeño!" : score >= 60 ? "Buen trabajo" : "Sigue practicando"}
                  </p>
                </div>
                <Button className="w-full" onClick={() => setSelectedTest(null)}>
                  Volver a pruebas
                </Button>
              </div>
            ) : (
              <>
                <Progress value={(Object.keys(answers).length / (selectedTest.questions?.length || 1)) * 100} />
                <div className="space-y-4">
                  {selectedTest.questions?.map((question: TestQuestion, idx: number) => (
                    <div key={question.id} className="space-y-2">
                      <p className="font-medium">
                        {idx + 1}. {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options?.map((option: string, optionIdx: number) => (
                          <button
                            key={optionIdx}
                            onClick={() => handleSelectAnswer(question.id, optionIdx)}
                            className={`w-full p-3 rounded-lg border-2 transition-colors text-left ${
                              answers[question.id] === optionIdx
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full"
                  onClick={handleSubmitTest}
                  disabled={Object.keys(answers).length !== selectedTest.questions?.length}
                >
                  Enviar respuestas
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tests.length === 0 ? (
        <Card className="border-0 bg-card/70 backdrop-blur-sm md:col-span-2">
          <CardContent className="py-8 text-center text-muted-foreground">
            No hay pruebas disponibles en este momento.
          </CardContent>
        </Card>
      ) : (
        tests.map((test) => (
          <Card
            key={test.id}
            className="border-0 bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-colors cursor-pointer"
            onClick={() => handleSelectTest(test)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{test.description}</p>
                </div>
                <Badge variant="outline" className="flex-shrink-0">
                  {test.difficulty || "Normal"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4" />
                  {test.questions?.length || 0} preguntas
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {test.estimated_time || 10} min
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  +10 pts
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

  const handleSelectTest = (test: any) => {
    setSelectedTest(test)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const handleAnswerQuestion = (questionId: string, optionIndex: number) => {
    if (!submitted) {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: optionIndex,
      }))
    }
  }

  const handleSubmitTest = async () => {
    if (!session?.user?.id || !selectedTest) return

    const questions = selectedTest.questions as TestQuestion[]
    let correctCount = 0

    questions.forEach((question, index) => {
      if (answers[question.id] === question.correct_answer) {
        correctCount++
      }
    })

    const testScore = (correctCount / questions.length) * 100
    setScore(testScore)
    setSubmitted(true)

    // Save submission
    await submitTestAnswers(session.user.id, selectedTest.id, answers, testScore)
    await loadData()
  }

  const isTestCompleted = (testId: string) => completions.some((c) => c.test_id === testId)
  const getTestCompletion = (testId: string) => completions.find((c) => c.test_id === testId)

  if (loading) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardContent className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Test Selection or Test In Progress */}
      {!selectedTest ? (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Pruebas Gamificadas</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Aprende y gana puntos completando pruebas</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tests.map((test) => {
              const isCompleted = isTestCompleted(test.id)
              const completion = getTestCompletion(test.id)
              return (
                <div
                  key={test.id}
                  className="p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-sm">{test.title}</h3>
                    {isCompleted && (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        ✓ {completion?.score?.toFixed(0)}%
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">{test.description}</p>

                  <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {test.duration_minutes || 5} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      +{test.points_reward || 10} pts
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {test.difficulty || "Intermedio"}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleSelectTest(test)}
                    className="text-xs"
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? "Repetir" : "Comenzar"}
                  </Button>
                </div>
              )
            })}
          </CardContent>
        </Card>
      ) : (
        /* Test In Progress */
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="text-xl font-semibold">{selectedTest.title}</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSelectTest(null)}
                className="text-xs"
              >
                ← Volver
              </Button>
            </div>
            {!submitted && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Progreso: {Object.keys(answers).length} de {selectedTest.questions?.length || 0}
                  </span>
                </div>
                <Progress value={(Object.keys(answers).length / (selectedTest.questions?.length || 1)) * 100} />
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {submitted ? (
              <div className="text-center py-6">
                <div className="inline-block p-4 bg-green-500/10 rounded-lg mb-4">
                  <Trophy className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-2">¡Prueba completada!</h3>
                <div className="text-3xl font-bold text-primary mb-4">{score.toFixed(0)}%</div>
                <p className="text-sm text-muted-foreground mb-4">
                  {score >= 80
                    ? "¡Excelente trabajo!"
                    : score >= 60
                      ? "Buen esfuerzo, sigue practicando"
                      : "Intenta de nuevo para mejorar"}
                </p>
                <Button onClick={() => handleSelectTest(null)} className="text-sm">
                  Ver más pruebas
                </Button>
              </div>
            ) : (
              <>
                {selectedTest.questions?.map((question: TestQuestion, index: number) => (
                  <div key={question.id} className="space-y-3 pb-4 border-b border-border/50 last:border-0">
                    <div className="flex items-start gap-2">
                      <div className="px-2 py-1 bg-primary/20 rounded text-xs font-medium text-primary min-w-fit">
                        P{index + 1}
                      </div>
                      <h4 className="font-medium text-sm mt-0.5">{question.question}</h4>
                    </div>

                    <div className="space-y-2 ml-8">
                      {question.options.map((option, optionIndex) => (
                        <button
                          key={optionIndex}
                          onClick={() => handleAnswerQuestion(question.id, optionIndex)}
                          className={`w-full p-3 text-left text-sm rounded-lg border transition-colors ${
                            answers[question.id] === optionIndex
                              ? "border-primary bg-primary/10"
                              : "border-border/50 bg-muted/30 hover:bg-muted/50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                answers[question.id] === optionIndex
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            />
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSelectTest(null)}
                    className="text-sm"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmitTest}
                    disabled={Object.keys(answers).length < (selectedTest.questions?.length || 0)}
                    className="text-sm flex-1"
                  >
                    Enviar Respuestas
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
