"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, Users, Target, Lightbulb, Heart, Palette, Clock, CheckCircle } from "lucide-react"
import { useSession } from "@/components/session-wrapper"

interface TestInfo {
  id: string
  title: string
  description: string
  duration: string
  questions: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  path: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: "Personality" | "Skills" | "Intelligence" | "Career"
}

const availableTests: TestInfo[] = [
  {
    id: "disc",
    title: "DISC Assessment",
    description: "Discover your behavioral style and communication preferences in professional settings.",
    duration: "10-15 min",
    questions: 15,
    icon: Target,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    path: "/test/disc",
    difficulty: "Beginner",
    category: "Personality",
  },
  {
    id: "big-five",
    title: "Big Five Personality",
    description: "Comprehensive personality assessment covering five major dimensions of human personality.",
    duration: "15-20 min",
    questions: 30,
    icon: Brain,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    path: "/test/big-five",
    difficulty: "Intermediate",
    category: "Personality",
  },
  {
    id: "mbti",
    title: "MBTI Assessment",
    description: "Identify your psychological preferences and personality type based on Myers-Briggs theory.",
    duration: "15-20 min",
    questions: 25,
    icon: Users,
    color: "bg-green-100 text-green-700 border-green-200",
    path: "/test/mbti",
    difficulty: "Intermediate",
    category: "Personality",
  },
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence",
    description: "Assess your ability to recognize, understand, and manage emotions effectively.",
    duration: "10-15 min",
    questions: 20,
    icon: Heart,
    color: "bg-red-100 text-red-700 border-red-200",
    path: "/test/emotional-intelligence",
    difficulty: "Beginner",
    category: "Intelligence",
  },
  {
    id: "riasec",
    title: "Career Interests (RIASEC)",
    description: "Discover your career interests and find professions that match your personality.",
    duration: "12-18 min",
    questions: 35,
    icon: Palette,
    color: "bg-orange-100 text-orange-700 border-orange-200",
    path: "/test/riasec",
    difficulty: "Intermediate",
    category: "Career",
  },
  {
    id: "soft-skills",
    title: "Soft Skills Assessment",
    description: "Evaluate your interpersonal and professional soft skills for career development.",
    duration: "15-20 min",
    questions: 30,
    icon: Lightbulb,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    path: "/test/soft-skills",
    difficulty: "Advanced",
    category: "Skills",
  },
]

export default function TestsPage() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [completedTests, setCompletedTests] = useState<string[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  useEffect(() => {
    // Load completed tests from localStorage or API
    const loadCompletedTests = () => {
      try {
        const completed = localStorage.getItem("completed_tests")
        if (completed) {
          setCompletedTests(JSON.parse(completed))
        }
      } catch (error) {
        console.error("Error loading completed tests:", error)
      }
    }

    if (mounted) {
      loadCompletedTests()
    }
  }, [mounted])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to authentication...</p>
        </div>
      </div>
    )
  }

  const categories = ["All", "Personality", "Skills", "Intelligence", "Career"]
  const filteredTests =
    selectedCategory === "All" ? availableTests : availableTests.filter((test) => test.category === selectedCategory)

  const handleStartTest = (testPath: string) => {
    router.push(testPath)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "Advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const completionPercentage = (completedTests.length / availableTests.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Badge variant="secondary" className="text-sm">
            <Brain className="h-4 w-4 mr-1" />
            Career Assessments
          </Badge>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Assessment Progress
            </CardTitle>
            <CardDescription>Complete all assessments to get comprehensive career insights</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">
                {completedTests.length} of {availableTests.length} completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">{Math.round(completionPercentage)}% complete</p>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gray-900 text-white" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const IconComponent = test.icon
            const isCompleted = completedTests.includes(test.id)

            return (
              <Card key={test.id} className="relative hover:shadow-lg transition-shadow">
                {isCompleted && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${test.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                          {test.difficulty}
                        </Badge>
                        <Badge variant="outline">{test.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{test.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="h-4 w-4" />
                      <span>{test.questions} questions</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStartTest(test.path)}
                    className="w-full bg-gray-900 hover:bg-gray-800"
                    disabled={isCompleted}
                  >
                    {isCompleted ? "View Results" : "Start Assessment"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Assessment Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Before Starting:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Find a quiet environment</li>
                  <li>• Answer honestly and instinctively</li>
                  <li>• Don't overthink your responses</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">For Best Results:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Complete all assessments</li>
                  <li>• Take breaks between tests</li>
                  <li>• Review results with our AI coach</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
