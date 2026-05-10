"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Trophy, Zap, CheckCircle2, AlertCircle } from "lucide-react"

interface TestQuestion {
  id: string
  pregunta: string
  opciones: string[]
  respuesta_correcta: number
  explicacion: string
}

interface GamifiedTest {
  id: string
  titulo: string
  descripcion: string
  categoria: string
  nivel: "basico" | "intermedio" | "avanzado"
  puntos: number
  badge?: string
  preguntas: TestQuestion[]
  tiempo_limite_minutos?: number
}

interface A4GamifiedTestsProps {
  tests?: GamifiedTest[]
  onCompleteTest?: (testId: string, score: number) => void
}

export function A4GamifiedTests({ tests: initialTests, onCompleteTest }: A4GamifiedTestsProps) {
  const [tests, setTests] = useState<GamifiedTest[]>(initialTests || [])
  const [loading, setLoading] = useState(!initialTests)
  const [selectedTest, setSelectedTest] = useState<GamifiedTest | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!initialTests) {
      fetchTests()
    }
  }, [initialTests])

  const fetchTests = async () => {
    try {
      const response = await fetch('/api/despega/a4-tests')
      if (!response.ok) throw new Error('Failed to fetch tests')
      const data = await response.json()
      setTests(data.data || [])
    } catch (error) {
      console.error('[v0] Error fetching tests:', error)
      setTests([])
    } finally {
      setLoading(false)
    }
  }

  const startTest = (test: GamifiedTest) => {
    setSelectedTest(test)
    setCurrentQuestion(0)
    setUserAnswers(new Array(test.preguntas.length).fill(null))
    setShowResults(false)
    setScore(0)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerIndex
    setUserAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestion < (selectedTest?.preguntas.length ?? 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const submitTest = () => {
    if (!selectedTest) return

    let correctCount = 0
    selectedTest.preguntas.forEach((question, index) => {
      if (userAnswers[index] === question.respuesta_correcta) {
        correctCount++
      }
    })

    const calculatedScore = Math.round((correctCount / selectedTest.preguntas.length) * 100)
    setScore(calculatedScore)
    setShowResults(true)

    if (calculatedScore >= 70) {
      onCompleteTest?.(selectedTest.id, selectedTest.puntos)
    }
  }

  const getNivelColor = (nivel: string) => {
    // Return inline styles for difficulty level badges
    if (nivel === "basico") {
      return "" // Will use inline style
    } else if (nivel === "intermedio") {
      return "" // Will use inline style
    } else if (nivel === "avanzado") {
      return "" // Will use inline style
    }
    return "bg-muted/10"
  }

  const getNivelStyle = (nivel: string) => {
    const styles: Record<string, React.CSSProperties> = {
      "basico": { backgroundColor: "rgba(225, 120, 130, 0.4)", color: "#78c657" },
      "intermedio": { backgroundColor: "rgba(225, 120, 130, 0.4)", color: "rgba(255, 255, 255, 0.6)" },
      "avanzado": { backgroundColor: "rgba(225, 120, 130, 0.4)", color: "#e08b93" },
    }
    return styles[nivel] || {}
  }

  if (!selectedTest) {
    if (loading) {
      return (
        <div className="w-full space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Cargando tests...</p>
          </div>
        </div>
      )
    }

    if (tests.length === 0) {
      return (
        <div className="w-full space-y-6">
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay tests disponibles</p>
          </div>
        </div>
      )
    }

    return (
      <div className="w-full space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-8 h-8 text-yellow" />
          <div>
            <h2 className="text-2xl font-normal">Tests Gamificados</h2>
            <p className="text-sm text-muted-foreground">
              Completa tests de contexto profesional y gana puntos + badges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition cursor-pointer" onClick={() => startTest(test)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{test.titulo}</CardTitle>
                    <CardDescription>{test.descripcion}</CardDescription>
                  </div>
                  <Badge style={getNivelStyle(test.nivel)}>
                    {test.nivel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow" />
                  <span className="text-sm font-semibold">{test.puntos} puntos</span>
                </div>
                {test.badge && (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-purple" />
                    <span className="text-sm">Badge: {test.badge}</span>
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {test.preguntas.length} preguntas
                  {test.tiempo_limite_minutos && ` • ${test.tiempo_limite_minutos} min`}
                </div>
                <Button className="w-full border-none" style={{ backgroundColor: "rgba(225, 120, 130, 0.6)", borderRadius: "20px" }}>Comenzar Test</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const question = selectedTest.preguntas[currentQuestion]
  const progressPercent = ((currentQuestion + 1) / selectedTest.preguntas.length) * 100

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Test Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{selectedTest.titulo}</CardTitle>
              <CardDescription className="mt-2">
                Pregunta {currentQuestion + 1} de {selectedTest.preguntas.length}
              </CardDescription>
            </div>
            <Badge style={getNivelStyle(selectedTest.nivel)}>
              {selectedTest.nivel}
            </Badge>
          </div>
          <Progress value={progressPercent} className="mt-4" />
        </CardHeader>
      </Card>

      {!showResults ? (
        <>
          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{question.pregunta}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={userAnswers[currentQuestion]?.toString() ?? ""} onValueChange={(val) => handleAnswerSelect(parseInt(val))}>
                {question.opciones.map((opcion, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {opcion}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-3 justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
            >
              Pregunta Anterior
            </Button>

            {currentQuestion === selectedTest.preguntas.length - 1 ? (
              <Button
                onClick={submitTest}
                disabled={userAnswers[currentQuestion] === null}
                className="px-8"
              >
                Enviar Test
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={userAnswers[currentQuestion] === null}
                className="px-8"
              >
                Siguiente Pregunta
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Results */}
          <Card className={score >= 70 ? "border-green/20 bg-green/5 dark:bg-green/20" : "border-orange/20 bg-orange/5 dark:bg-orange/20"}>
            <CardContent className="pt-6 text-center space-y-4">
              {score >= 70 ? (
                <>
                  <CheckCircle2 className="w-12 h-12 text-green mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-green dark:text-green/10">¡Excelente!</h3>
                    <p className="text-sm text-green dark:text-green/20">Has pasado el test</p>
                  </div>
                  <div className="text-3xl font-bold text-green dark:text-green/10">{score}%</div>
                  <p className="text-sm text-green dark:text-green/20">
                    +{selectedTest.puntos} puntos ganados
                    {selectedTest.badge && ` • Badge desbloqueado: ${selectedTest.badge}`}
                  </p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-12 h-12 text-orange mx-auto" />
                  <div>
                    <h3 className="text-xl font-bold text-orange dark:text-orange/10">Necesitas mejorar</h3>
                    <p className="text-sm text-orange dark:text-orange/20">Intenta nuevamente más adelante</p>
                  </div>
                  <div className="text-3xl font-bold text-orange dark:text-orange/10">{score}%</div>
                  <p className="text-sm text-orange dark:text-orange/20">
                    Necesitas al menos 70% para pasar
                  </p>
                </>
              )}

              {/* Answer Review */}
              <div className="mt-6 space-y-4 text-left max-h-96 overflow-y-auto">
                {selectedTest.preguntas.map((q, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-[28px] border-l-4 ${
                      userAnswers[index] === q.respuesta_correcta
                        ? "border-l-green-600 bg-green/5 dark:bg-green/20"
                        : "border-l-orange-600 bg-orange/5 dark:bg-orange/20"
                    }`}
                  >
                    <div className="text-sm font-semibold mb-1">{q.pregunta}</div>
                    <div className="text-xs text-muted-foreground mb-2">{q.explicacion}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setSelectedTest(null)}
            >
              Volver a Tests
            </Button>
            {score < 70 && (
              <Button
                className="flex-1"
                onClick={() => startTest(selectedTest)}
              >
                Intentar de Nuevo
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
