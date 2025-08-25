"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface Question {
  id: number
  question_text: string
  options: string
  category: string
  test_type: string
}

interface Answer {
  questionId: number
  answer: number
  category: string
}

export default function SoftSkillsTest() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const userEmail = "travis@example.com" // Demo user

  useEffect(() => {
    checkUserAndLoadQuestions()
  }, [])

  const checkUserAndLoadQuestions = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if user exists, create if not
      const { data: existingUser } = await supabase.from("user_profiles").select("*").eq("email", userEmail).single()

      if (!existingUser) {
        const { error: createError } = await supabase.from("user_profiles").insert({
          email: userEmail,
          full_name: "Travis Demo User",
          created_at: new Date().toISOString(),
        })

        if (createError) {
          console.error("Error creating user:", createError)
          setError("Error setting up user profile")
          return
        }
      }

      await loadQuestions()
    } catch (err) {
      console.error("Error in setup:", err)
      setError("Error during setup")
    } finally {
      setLoading(false)
    }
  }

  const loadQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("test_questions")
        .select("*")
        .eq("test_type", "soft-skills")
        .order("id")

      if (error) {
        console.error("Database error:", error)
        throw new Error(`Error loading questions: ${error.message}`)
      }

      if (!data || data.length === 0) {
        throw new Error("No questions found for soft skills test")
      }

      console.log("Loaded questions:", data.length)
      setQuestions(data)
    } catch (err) {
      console.error("Error loading questions:", err)
      setError(err instanceof Error ? err.message : "Failed to load questions")
    }
  }

  const parseOptions = (optionsString: string): string[] => {
    try {
      // Try parsing as JSON first
      const parsed = JSON.parse(optionsString)
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      // If JSON parsing fails, try pipe-separated format
      if (optionsString.includes("|")) {
        return optionsString
          .split("|")
          .map((opt) => opt.trim())
          .filter((opt) => opt.length > 0)
      }

      // If comma-separated
      if (optionsString.includes(",")) {
        return optionsString
          .split(",")
          .map((opt) => opt.trim())
          .filter((opt) => opt.length > 0)
      }
    }

    // Fallback: return as single option
    return [optionsString]
  }

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value)
  }

  const handleNext = () => {
    if (!selectedAnswer) return

    const currentQuestion = questions[currentQuestionIndex]
    const answerValue = Number.parseInt(selectedAnswer)

    // Update answers array
    const newAnswers = [...answers]
    const existingAnswerIndex = newAnswers.findIndex((a) => a.questionId === currentQuestion.id)

    if (existingAnswerIndex >= 0) {
      newAnswers[existingAnswerIndex] = {
        questionId: currentQuestion.id,
        answer: answerValue,
        category: currentQuestion.category,
      }
    } else {
      newAnswers.push({
        questionId: currentQuestion.id,
        answer: answerValue,
        category: currentQuestion.category,
      })
    }

    setAnswers(newAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer("")
    } else {
      submitTest(newAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)

      // Load previous answer if exists
      const currentQuestion = questions[currentQuestionIndex - 1]
      const previousAnswer = answers.find((a) => a.questionId === currentQuestion.id)
      setSelectedAnswer(previousAnswer ? previousAnswer.answer.toString() : "")
    }
  }

  const submitTest = async (finalAnswers: Answer[]) => {
    try {
      setSubmitting(true)

      // Calculate scores by category
      const categoryScores: { [key: string]: number[] } = {}

      finalAnswers.forEach((answer) => {
        if (!categoryScores[answer.category]) {
          categoryScores[answer.category] = []
        }
        categoryScores[answer.category].push(answer.answer)
      })

      // Calculate average scores
      const results: { [key: string]: number } = {}
      Object.keys(categoryScores).forEach((category) => {
        const scores = categoryScores[category]
        results[category] = scores.reduce((sum, score) => sum + score, 0) / scores.length
      })

      // Save to database
      const { error } = await supabase.from("test_results").insert({
        user_email: userEmail,
        test_name: "Test de Habilidades Blandas",
        test_type: "soft-skills",
        results: results,
        raw_answers: finalAnswers,
        completed_at: new Date().toISOString(),
      })

      if (error) {
        console.error("Error saving results:", error)
        throw new Error(`Error submitting test: ${error.message}`)
      }

      // Redirect to results
      router.push("/test/soft-skills/results")
    } catch (err) {
      console.error("Error submitting test:", err)
      setError(err instanceof Error ? err.message : "Error submitting test")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando preguntas del test...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <CheckCircle className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">No se encontraron preguntas para este test.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Procesando tus respuestas...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const options = parseOptions(currentQuestion.options)

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test de Habilidades Blandas</h1>
          <p className="text-gray-600">
            Pregunta {currentQuestionIndex + 1} de {questions.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Progreso: {Math.round(progress)}%</span>
            <span>Categoría: {currentQuestion.category}</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">{currentQuestion.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={(index + 1).toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="text-sm text-gray-500">
            {currentQuestionIndex + 1} / {questions.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
