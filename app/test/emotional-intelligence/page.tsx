"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, Heart, CheckCircle, Clock } from "lucide-react"
import { useSession } from "@/components/session-wrapper"
import { UnifiedTestSystem } from "@/lib/unified-test-system"

interface Question {
  id: number
  text: string
  options: Array<{
    text: string
    value: number
    label: string
  }>
}

const emotionalIntelligenceQuestions: Question[] = [
  {
    id: 1,
    text: "I can easily recognize when I'm feeling stressed or overwhelmed.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 2,
    text: "I can tell when someone is upset, even if they don't say anything.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 3,
    text: "I can manage my emotions effectively during difficult situations.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 4,
    text: "I'm good at motivating myself to achieve my goals.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 5,
    text: "I can help others feel better when they're upset or frustrated.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 6,
    text: "I understand what triggers my emotional reactions.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 7,
    text: "I can read people's emotions accurately through their body language.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 8,
    text: "I stay calm under pressure and don't let emotions cloud my judgment.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 9,
    text: "I can bounce back quickly from setbacks and disappointments.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 10,
    text: "I'm skilled at building rapport and connecting with others.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 11,
    text: "I can accurately assess my own strengths and weaknesses.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 12,
    text: "I notice when someone's words don't match their emotions.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 13,
    text: "I can control my impulses and think before acting.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 14,
    text: "I maintain optimism even when facing challenges.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 15,
    text: "I can influence others' emotions in a positive way.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 16,
    text: "I'm aware of how my emotions affect my behavior and decisions.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 17,
    text: "I can sense the emotional climate of a room when I enter it.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 18,
    text: "I can adapt my communication style based on others' emotional needs.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 19,
    text: "I use positive self-talk to manage difficult emotions.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
  {
    id: 20,
    text: "I can resolve conflicts by understanding all parties' emotional perspectives.",
    options: [
      { text: "Never", value: 1, label: "Never" },
      { text: "Rarely", value: 2, label: "Rarely" },
      { text: "Sometimes", value: 3, label: "Sometimes" },
      { text: "Often", value: 4, label: "Often" },
      { text: "Always", value: 5, label: "Always" },
    ],
  },
]

export default function EmotionalIntelligenceTest() {
  const [mounted, setMounted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  const router = useRouter()
  const { user, isLoading } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  useEffect(() => {
    // Load existing answer for current question
    setSelectedAnswer(answers[emotionalIntelligenceQuestions[currentQuestion]?.id] || null)
  }, [currentQuestion, answers])

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const updatedAnswers = { ...answers, [emotionalIntelligenceQuestions[currentQuestion].id]: selectedAnswer }
      setAnswers(updatedAnswers)

      if (currentQuestion < emotionalIntelligenceQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        // Submit test with updated answers immediately
        submitTestWithAnswers(updatedAnswers)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const submitTestWithAnswers = async (finalAnswers: Record<number, number>) => {
    if (Object.keys(finalAnswers).length < emotionalIntelligenceQuestions.length) {
      alert("Please answer all questions before continuing.")
      return
    }

    setIsSubmitting(true)
    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 60000)

    const totalScore = Object.values(finalAnswers).reduce((sum, score) => sum + score, 0)
    const maxScore = emotionalIntelligenceQuestions.length * 5
    const percentage = Math.round((totalScore / maxScore) * 100)

    const results = {
      total_score: totalScore,
      max_score: maxScore,
      percentage,
      level: percentage >= 80 ? "High" : percentage >= 60 ? "Moderate" : percentage >= 40 ? "Developing" : "Low",
      duration_minutes: duration,
      completion_date: new Date().toISOString(),
      answers: finalAnswers,
      competency_scores: {
        self_awareness: Math.round(
          ((finalAnswers[1] + finalAnswers[6] + finalAnswers[11] + finalAnswers[16]) / 20) * 100,
        ),
        self_regulation: Math.round(
          ((finalAnswers[3] + finalAnswers[8] + finalAnswers[13] + finalAnswers[19]) / 20) * 100,
        ),
        motivation: Math.round(((finalAnswers[4] + finalAnswers[9] + finalAnswers[14]) / 15) * 100),
        empathy: Math.round(((finalAnswers[2] + finalAnswers[7] + finalAnswers[12] + finalAnswers[17]) / 20) * 100),
        social_skills: Math.round(
          ((finalAnswers[5] + finalAnswers[10] + finalAnswers[15] + finalAnswers[20]) / 20) * 100,
        ),
      },
      overall_score: percentage,
    }

    try {
      console.log("[v0] Saving EI test to database...")

      if (!user?.email) {
        throw new Error("No user email found")
      }

      const saveResult = await UnifiedTestSystem.saveTestResult(user.email, "Emotional Intelligence", results, duration)

      if (!saveResult.success || !saveResult.savedToDatabase) {
        console.error("[v0] Failed to save to database:", saveResult.error)
        toast({
          title: "Error Crítico de Guardado",
          description: `No se pudieron guardar tus resultados en la base de datos: ${saveResult.error || "Error desconocido"}. Por favor contacta soporte.`,
          variant: "destructive",
          duration: 10000,
        })
        setIsSubmitting(false)
        return
      }

      console.log("[v0] Results saved successfully to database")
      toast({
        title: "Test Completado",
        description: "Tus resultados han sido guardados correctamente.",
        duration: 3000,
      })

      router.push("/test/emotional-intelligence/results")
    } catch (error: any) {
      console.error("[v0] Error submitting test:", error)
      toast({
        title: "Error al Guardar Resultados",
        description: `No se pudieron guardar tus resultados: ${error.message}. Por favor contacta soporte.`,
        variant: "destructive",
        duration: 10000,
      })
      setIsSubmitting(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading assessment...</p>
            </div>
          </CardContent>
        </Card>
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

  const progress = ((currentQuestion + 1) / emotionalIntelligenceQuestions.length) * 100
  const question = emotionalIntelligenceQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/test")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Emotional Intelligence Assessment</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Heart className="h-4 w-4" />
                <span>Understanding and managing emotions</span>
              </div>
            </div>
            <Badge variant="secondary">
              {currentQuestion + 1} of {emotionalIntelligenceQuestions.length}
            </Badge>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{Math.round((Date.now() - startTime) / 60000)} min</span>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">{question.text}</p>

            <RadioGroup
              value={selectedAnswer?.toString() || ""}
              onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null || isSubmitting}
                className="bg-gray-900 hover:bg-gray-800"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : currentQuestion === emotionalIntelligenceQuestions.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-1">
            {emotionalIntelligenceQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestion
                    ? "bg-gray-900"
                    : answers[emotionalIntelligenceQuestions[index].id]
                      ? "bg-gray-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Object.keys(answers).length} of {emotionalIntelligenceQuestions.length} questions answered
          </p>
        </div>
      </div>
    </div>
  )
}
