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
