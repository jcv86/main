"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight } from "lucide-react"
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

const sampleQuestions: Question[] = [
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
]

export default function EmotionalIntelligenceTest() {
  const [mounted, setMounted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const router = useRouter()
  const { user, loading } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
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

  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100
  const question = sampleQuestions[currentQuestion]

  const handleNext = () => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => ({ ...prev, [question.id]: selectedAnswer }))

      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
        setSelectedAnswer(null)
      } else {
        // Test completed, navigate to results
        router.push("/test/emotional-intelligence/results")
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setSelectedAnswer(answers[sampleQuestions[currentQuestion - 1].id] || null)
    }
  }

  const handleBack = () => {
    router.push("/test")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Emotional Intelligence Assessment</h1>
            <Badge variant="secondary">
              {currentQuestion + 1} of {sampleQuestions.length}
            </Badge>
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

              <Button onClick={handleNext} disabled={selectedAnswer === null} className="bg-gray-900 hover:bg-gray-800">
                {currentQuestion === sampleQuestions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
