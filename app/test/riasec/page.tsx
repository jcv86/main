"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Palette, CheckCircle, Clock } from "lucide-react"
import { useSession } from "@/components/session-wrapper"

interface Question {
  id: number
  text: string
  category: "R" | "I" | "A" | "S" | "E" | "C"
  type: "interest" | "activity" | "preference"
}

const riasecQuestions: Question[] = [
  // Realistic (R) - Hands-on, practical activities
  { id: 1, text: "I enjoy working with tools and machinery", category: "R", type: "interest" },
  { id: 2, text: "I like to build things with my hands", category: "R", type: "activity" },
  { id: 3, text: "I prefer outdoor work to office work", category: "R", type: "preference" },
  { id: 4, text: "I enjoy fixing mechanical problems", category: "R", type: "activity" },
  { id: 5, text: "I like working with plants and animals", category: "R", type: "interest" },
  { id: 6, text: "I enjoy physical activities and sports", category: "R", type: "activity" },

  // Investigative (I) - Research, analysis, problem-solving
  { id: 7, text: "I enjoy solving complex problems", category: "I", type: "activity" },
  { id: 8, text: "I like to conduct experiments", category: "I", type: "interest" },
  { id: 9, text: "I prefer working independently on research", category: "I", type: "preference" },
  { id: 10, text: "I enjoy analyzing data and information", category: "I", type: "activity" },
  { id: 11, text: "I like to understand how things work", category: "I", type: "interest" },
  { id: 12, text: "I enjoy reading scientific articles", category: "I", type: "activity" },

  // Artistic (A) - Creative, expressive activities
  { id: 13, text: "I enjoy creative writing and storytelling", category: "A", type: "activity" },
  { id: 14, text: "I like to express myself through art", category: "A", type: "interest" },
  { id: 15, text: "I prefer unstructured, creative environments", category: "A", type: "preference" },
  { id: 16, text: "I enjoy music and performing arts", category: "A", type: "interest" },
  { id: 17, text: "I like to design and create new things", category: "A", type: "activity" },
  { id: 18, text: "I enjoy photography and visual arts", category: "A", type: "activity" },

  // Social (S) - Helping, teaching, serving others
  { id: 19, text: "I enjoy helping people solve their problems", category: "S", type: "activity" },
  { id: 20, text: "I like to teach and train others", category: "S", type: "interest" },
  { id: 21, text: "I prefer working in teams and groups", category: "S", type: "preference" },
  { id: 22, text: "I enjoy counseling and advising people", category: "S", type: "activity" },
  { id: 23, text: "I like to volunteer for community causes", category: "S", type: "interest" },
  { id: 24, text: "I enjoy organizing social events", category: "S", type: "activity" },

  // Enterprising (E) - Leading, persuading, managing
  { id: 25, text: "I enjoy leading and managing others", category: "E", type: "activity" },
  { id: 26, text: "I like to persuade and influence people", category: "E", type: "interest" },
  { id: 27, text: "I prefer competitive environments", category: "E", type: "preference" },
  { id: 28, text: "I enjoy sales and marketing activities", category: "E", type: "activity" },
  { id: 29, text: "I like to start new projects and ventures", category: "E", type: "interest" },
  { id: 30, text: "I enjoy public speaking and presentations", category: "E", type: "activity" },

  // Conventional (C) - Organizing, data management, detail work
  { id: 31, text: "I enjoy organizing and filing information", category: "C", type: "activity" },
  { id: 32, text: "I like to work with numbers and data", category: "C", type: "interest" },
  { id: 33, text: "I prefer structured, organized environments", category: "C", type: "preference" },
  { id: 34, text: "I enjoy following established procedures", category: "C", type: "activity" },
  { id: 35, text: "I like to keep detailed records", category: "C", type: "interest" },
  { id: 36, text: "I enjoy administrative and clerical work", category: "C", type: "activity" },
]

const interestOptions = [
  { value: 1, label: "Strongly Dislike" },
  { value: 2, label: "Dislike" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Like" },
  { value: 5, label: "Strongly Like" },
]

export default function RIASECTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  const router = useRouter()
  const { user, isLoading } = useSession()

  const currentAnswer = answers[riasecQuestions[currentQuestion].id]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const calculateRIASECScores = () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }
    const counts = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 }

    riasecQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        scores[question.category] += answer
        counts[question.category]++
      }
    })

    // Convert to percentages
    const percentageScores = {
      R: Math.round((scores.R / (counts.R * 5)) * 100),
      I: Math.round((scores.I / (counts.I * 5)) * 100),
      A: Math.round((scores.A / (counts.A * 5)) * 100),
      S: Math.round((scores.S / (counts.S * 5)) * 100),
      E: Math.round((scores.E / (counts.E * 5)) * 100),
      C: Math.round((scores.C / (counts.C * 5)) * 100),
    }

    return percentageScores
  }

  const getHollandCode = (scores: Record<string, number>) => {
    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key]) => key)
    return sortedScores.join("")
  }

  const submitTest = async () => {
    if (Object.keys(answers).length < riasecQuestions.length) {
      alert("Por favor responde todas las preguntas antes de continuar.")
      return
    }

    setIsSubmitting(true)
    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    const scores = calculateRIASECScores()
    const hollandCode = getHollandCode(scores)
    const overallScore = Math.round(Object.values(scores).reduce((sum, score) => sum + score, 0) / 6)

    const results = {
      ...scores,
      holland_code: hollandCode,
      overall_score: overallScore,
      completion_date: endTime.toISOString(),
      duration_minutes: duration,
      total_questions: riasecQuestions.length,
      answered_questions: Object.keys(answers).length,
    }

    try {
      // Save to localStorage for demo
      const completedTests = JSON.parse(localStorage.getItem("completed_tests") || "[]")
      if (!completedTests.includes("riasec")) {
        completedTests.push("riasec")
        localStorage.setItem("completed_tests", JSON.stringify(completedTests))
      }

      localStorage.setItem("riasec_results", JSON.stringify(results))
      router.push("/test/riasec/results")
    } catch (error) {
      console.error("Error submitting test:", error)
      alert("Error al guardar los resultados. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading RIASEC assessment...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  const progress = currentAnswer
    ? ((currentQuestion + 1) / riasecQuestions.length) * 100
    : (currentQuestion / riasecQuestions.length) * 100
  const question = riasecQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <Badge variant="secondary" className="text-sm">
            <Palette className="h-4 w-4 mr-1" />
            RIASEC Career Interests
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">RIASEC Career Interest Assessment</h2>
                <p className="text-gray-600">
                  Question {currentQuestion + 1} of {riasecQuestions.length}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>~15 minutes</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{question.text}</CardTitle>
              <Badge variant="outline" className="capitalize">
                {question.type}
              </Badge>
            </div>
            <CardDescription>Rate your level of interest in this activity</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={currentAnswer?.toString() || ""}
              onValueChange={(value) => handleAnswer(question.id, Number.parseInt(value))}
            >
              <div className="space-y-3">
                {interestOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentQuestion === riasecQuestions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={!currentAnswer || isSubmitting}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Test
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(Math.min(riasecQuestions.length - 1, currentQuestion + 1))}
              disabled={!currentAnswer}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Counter */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-1">
            {riasecQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestion
                    ? "bg-gray-900"
                    : answers[riasecQuestions[index].id]
                      ? "bg-gray-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Object.keys(answers).length} of {riasecQuestions.length} questions answered
          </p>
        </div>

        {/* RIASEC Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-1">Realistic (R)</h4>
                <p className="text-blue-700">Hands-on, practical work with tools and machinery</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-1">Investigative (I)</h4>
                <p className="text-purple-700">Research, analysis, and problem-solving activities</p>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <h4 className="font-semibold text-pink-900 mb-1">Artistic (A)</h4>
                <p className="text-pink-700">Creative, expressive, and artistic activities</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-1">Social (S)</h4>
                <p className="text-green-700">Helping, teaching, and serving others</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-1">Enterprising (E)</h4>
                <p className="text-orange-700">Leading, persuading, and managing others</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">Conventional (C)</h4>
                <p className="text-gray-700">Organizing, data management, and detail work</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
