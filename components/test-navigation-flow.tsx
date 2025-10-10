"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  Clock,
  ArrowRight,
  Brain,
  Heart,
  Users,
  Target,
  Palette,
  Star,
  PlayCircle,
  AlertCircle,
} from "lucide-react"

interface TestInfo {
  id: string
  name: string
  description: string
  duration: string
  questions: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  icon: any
  color: string
  path: string
  prerequisites?: string[]
}

const tests: TestInfo[] = [
  {
    id: "disc",
    name: "DISC Assessment",
    description: "Discover your behavioral style and communication preferences",
    duration: "10-15 min",
    questions: 15,
    difficulty: "Beginner",
    icon: Target,
    color: "bg-blue-500",
    path: "/test/disc",
  },
  {
    id: "emotional-intelligence",
    name: "Emotional Intelligence",
    description: "Assess your ability to understand and manage emotions",
    duration: "10-15 min",
    questions: 20,
    difficulty: "Beginner",
    icon: Heart,
    color: "bg-red-500",
    path: "/test/emotional-intelligence",
  },
  {
    id: "mbti",
    name: "MBTI Personality",
    description: "Identify your personality type and preferences",
    duration: "15-20 min",
    questions: 25,
    difficulty: "Intermediate",
    icon: Brain,
    color: "bg-purple-500",
    path: "/test/mbti",
    prerequisites: ["disc"],
  },
  {
    id: "big-five",
    name: "Big Five Personality",
    description: "Comprehensive personality assessment across five dimensions",
    duration: "15-20 min",
    questions: 30,
    difficulty: "Intermediate",
    icon: Users,
    color: "bg-green-500",
    path: "/test/big-five",
    prerequisites: ["disc", "emotional-intelligence"],
  },
  {
    id: "riasec",
    name: "RIASEC Career Interests",
    description: "Discover your career interests and compatible fields",
    duration: "12-18 min",
    questions: 36,
    difficulty: "Intermediate",
    icon: Palette,
    color: "bg-orange-500",
    path: "/test/riasec",
    prerequisites: ["mbti"],
  },
  {
    id: "soft-skills",
    name: "Soft Skills Assessment",
    description: "Evaluate your interpersonal and professional competencies",
    duration: "15-20 min",
    questions: 30,
    difficulty: "Advanced",
    icon: Star,
    color: "bg-pink-500",
    path: "/test/soft-skills",
    prerequisites: ["big-five", "riasec"],
  },
]

export default function TestNavigationFlow() {
  const [completedTests, setCompletedTests] = useState<string[]>([])
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testProgress, setTestProgress] = useState<Record<string, number>>({})
  const router = useRouter()

  useEffect(() => {
    // Load completed tests from localStorage
    const completed = JSON.parse(localStorage.getItem("completed_tests") || "[]")
    setCompletedTests(completed)

    // Load test progress
    const progress: Record<string, number> = {}
    tests.forEach((test) => {
      const results = localStorage.getItem(`${test.id.replace("-", "_")}_results`)
      if (results) {
        progress[test.id] = 100
      } else {
        progress[test.id] = 0
      }
    })
    setTestProgress(progress)
  }, [])

  const isTestAvailable = (test: TestInfo) => {
    if (!test.prerequisites) return true
    return test.prerequisites.every((prereq) => completedTests.includes(prereq))
  }

  const getRecommendedTest = () => {
    return tests.find((test) => !completedTests.includes(test.id) && isTestAvailable(test))
  }

  const startTest = (testId: string) => {
    const test = tests.find((t) => t.id === testId)
    if (test) {
      setCurrentTest(testId)
      router.push(test.path)
    }
  }

  const overallProgress = Math.round((completedTests.length / tests.length) * 100)
  const recommendedTest = getRecommendedTest()

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Assessment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-600">
                {completedTests.length}/{tests.length} tests
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Start</span>
              <span>{overallProgress}% complete</span>
              <span>Complete</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Next Test */}
      {recommendedTest && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <PlayCircle className="h-5 w-5" />
              Recommended Next Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${recommendedTest.color} text-white`}>
                  <recommendedTest.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">{recommendedTest.name}</h3>
                  <p className="text-sm text-blue-700">{recommendedTest.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-blue-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recommendedTest.duration}
                    </span>
                    <span>{recommendedTest.questions} questions</span>
                    <Badge variant="outline" className="text-xs">
                      {recommendedTest.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => startTest(recommendedTest.id)} className="bg-blue-600 hover:bg-blue-700">
                Start Test
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Tests Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {tests.map((test) => {
          const isCompleted = completedTests.includes(test.id)
          const isAvailable = isTestAvailable(test)
          const progress = testProgress[test.id] || 0

          return (
            <Card
              key={test.id}
              className={`relative ${
                isCompleted
                  ? "border-green-200 bg-green-50"
                  : isAvailable
                    ? "border-gray-200 hover:border-gray-300"
                    : "border-gray-100 bg-gray-50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${test.color} text-white`}>
                      <test.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {test.difficulty}
                      </Badge>
                    </div>
                  </div>
                  {isCompleted && <CheckCircle className="h-6 w-6 text-green-600" />}
                  {!isAvailable && <AlertCircle className="h-6 w-6 text-gray-400" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{test.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {test.duration}
                    </span>
                    <span>{test.questions} questions</span>
                  </div>
                </div>

                {progress > 0 && progress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
                )}

                {test.prerequisites && !isCompleted && (
                  <div className="text-xs text-gray-500">
                    <span className="font-medium">Prerequisites:</span>{" "}
                    {test.prerequisites.map((prereq) => {
                      const prereqTest = tests.find((t) => t.id === prereq)
                      const isPrereqCompleted = completedTests.includes(prereq)
                      return (
                        <span key={prereq} className={isPrereqCompleted ? "text-green-600" : "text-red-500"}>
                          {prereqTest?.name}
                          {test.prerequisites!.indexOf(prereq) < test.prerequisites!.length - 1 && ", "}
                        </span>
                      )
                    })}
                  </div>
                )}

                <div className="flex gap-2">
                  {isCompleted ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`${test.path}/results`)}
                      className="flex-1"
                    >
                      View Results
                    </Button>
                  ) : isAvailable ? (
                    <Button size="sm" onClick={() => startTest(test.id)} className="flex-1">
                      {progress > 0 ? "Continue" : "Start Test"}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="flex-1 bg-transparent">
                      Complete Prerequisites
                    </Button>
                  )}

                  {isCompleted && (
                    <Button variant="ghost" size="sm" onClick={() => startTest(test.id)}>
                      Retake
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Completion Summary */}
      {completedTests.length === tests.length && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-900 mb-2">🎉 All Assessments Complete!</h3>
            <p className="text-green-700 mb-4">
              You've completed all personality and career assessments. Visit your dashboard to see your comprehensive
              profile.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="bg-green-600 hover:bg-green-700">
              View Complete Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { TestNavigationFlow }
