"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Heart, CheckCircle, Clock } from "lucide-react"
import { useSession } from "@/components/session-wrapper"

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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  const calculateResults = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0)
    const maxScore = emotionalIntelligenceQuestions.length * 5
    const percentage = Math.round((totalScore / maxScore) * 100)

    return {
      total_score: totalScore,
      max_score: maxScore,
      percentage,
      level: percentage >= 80 ? "High" : percentage >= 60 ? "Moderate" : percentage >= 40 ? "Developing" : "Low",
    }
  }

  const submitTest = async () => {
    if (Object.keys(answers).length < emotionalIntelligenceQuestions.length) {
      alert("Please answer all questions before continuing.")
      return
    }

    setIsSubmitting(true)
    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 60000)
    const results = calculateResults()

    const testResults = {
      ...results,
      duration_minutes: duration,
      completion_date: new Date().toISOString(),
      answers: answers,
    }

    try {
      // Save to localStorage for demo
      const completedTests = JSON.parse(localStorage.getItem("completed_tests") || "[]")
      if (!completedTests.includes("emotional-intelligence")) {
        completedTests.push("emotional-intelligence")
        localStorage.setItem("completed_tests", JSON.stringify(completedTests))
      }

      localStorage.setItem("emotional_intelligence_results", JSON.stringify(testResults))
      router.push("/test/emotional-intelligence/results")
    } catch (error) {
      console.error("Error submitting test:", error)
      alert("Error saving results. Please try again.")
    } finally {
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

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => ({ ...prev, [question.id]: selectedAnswer }))

      if (currentQuestion < emotionalIntelligenceQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(answers[emotionalIntelligenceQuestions[currentQuestion + 1]?.id] || null)
      } else {
        submitTest()
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setSelectedAnswer(answers[emotionalIntelligenceQuestions[currentQuestion - 1].id] || null)
    }
  }

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
