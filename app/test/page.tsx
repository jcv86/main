"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Brain,
  Heart,
  Users,
  Target,
  Palette,
  Star,
  CheckCircle,
  Clock,
  ArrowRight,
  PlayCircle,
  BarChart3,
  Settings,
} from "lucide-react"
import { useSession } from "@/components/session-wrapper"

interface Test {
  id: string
  title: string
  description: string
  icon: any
  duration: string
  questions: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  category: "Personality" | "Skills" | "Intelligence" | "Career"
  path: string
  color: string
  prerequisites?: string[]
}

const tests: Test[] = [
  {
    id: "disc",
    title: "DISC Assessment",
    description: "Discover your behavioral style and communication preferences in professional settings.",
    icon: Target,
    duration: "10-15 min",
    questions: 15,
    difficulty: "Beginner",
    category: "Personality",
    path: "/test/disc",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence",
    description: "Assess your ability to recognize, understand, and manage emotions effectively.",
    icon: Heart,
    duration: "10-15 min",
    questions: 20,
    difficulty: "Beginner",
    category: "Intelligence",
    path: "/test/emotional-intelligence",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    id: "mbti",
    title: "MBTI Assessment",
    description: "Identify your psychological preferences and personality type based on Myers-Briggs theory.",
    icon: Brain,
    duration: "15-20 min",
    questions: 25,
    difficulty: "Intermediate",
    category: "Personality",
    path: "/test/mbti",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    prerequisites: ["disc"],
  },
  {
    id: "big-five",
    title: "Big Five Personality",
    description: "Comprehensive personality assessment covering five major dimensions of human personality.",
    icon: Users,
    duration: "15-20 min",
    questions: 30,
    difficulty: "Intermediate",
    category: "Personality",
    path: "/test/big-five",
    color: "bg-green-100 text-green-700 border-green-200",
    prerequisites: ["disc", "emotional-intelligence"],
  },
  {
    id: "riasec",
    title: "Career Interests (RIASEC)",
    description: "Discover your career interests and find professions that match your personality.",
    icon: Palette,
    duration: "12-18 min",
    questions: 36,
    difficulty: "Intermediate",
    category: "Career",
    path: "/test/riasec",
    color: "bg-orange-100 text-orange-700 border-orange-200",
    prerequisites: ["mbti"],
  },
  {
    id: "soft-skills",
    title: "Soft Skills Assessment",
    description: "Evaluate your interpersonal and professional soft skills for career development.",
    icon: Star,
    duration: "15-20 min",
    questions: 30,
    difficulty: "Advanced",
    category: "Skills",
    path: "/test/soft-skills",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    prerequisites: ["big-five", "riasec"],
  },
]

export default function TestsPage() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [completedTests, setCompletedTests] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  useEffect(() => {
    // Load completed tests from localStorage
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

  const isTestAvailable = (test: Test) => {
    if (!test.prerequisites) return true
    return test.prerequisites.every((prereq) => completedTests.includes(prereq))
  }

  const getNextRecommendedTest = () => {
    return tests.find((test) => !completedTests.includes(test.id) && isTestAvailable(test))
  }

  const filteredTests = selectedCategory === "All" ? tests : tests.filter((test) => test.category === selectedCategory)

  const categories = ["All", ...Array.from(new Set(tests.map((test) => test.category)))]
  const completionPercentage = (completedTests.length / tests.length) * 100
  const nextTest = getNextRecommendedTest()

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
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/test-verification")} className="text-sm">
              <Settings className="h-4 w-4 mr-2" />
              Test Verification
            </Button>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personality Assessments</h1>
          <p className="text-gray-600">
            Complete comprehensive assessments to discover your personality, skills, and career interests.
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Assessment Progress
            </CardTitle>
            <CardDescription>
              Complete all assessments to get comprehensive career insights and personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">
                  {completedTests.length} of {tests.length} completed
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />

              {nextTest && (
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <nextTest.icon className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Recommended Next: {nextTest.title}</p>
                      <p className="text-sm text-blue-700">
                        {nextTest.duration} • {nextTest.questions} questions • {nextTest.difficulty}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => router.push(nextTest.path)} className="bg-blue-600 hover:bg-blue-700">
                    Start Test
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
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
            const isAvailable = isTestAvailable(test)

            return (
              <Card
                key={test.id}
                className={`relative transition-all hover:shadow-lg ${
                  isCompleted
                    ? "border-green-200 bg-green-50"
                    : isAvailable
                      ? "hover:border-gray-300"
                      : "opacity-60 bg-gray-50"
                }`}
              >
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
                    <div className={`p-3 rounded-lg ${test.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={
                            test.difficulty === "Beginner"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : test.difficulty === "Intermediate"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                : "bg-red-100 text-red-700 border-red-200"
                          }
                        >
                          {test.difficulty}
                        </Badge>
                        <Badge variant="outline">{test.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">{test.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{test.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4" />
                        <span>{test.questions} questions</span>
                      </div>
                    </div>

                    {test.prerequisites && !isCompleted && (
                      <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
                        <span className="font-medium">Prerequisites:</span>{" "}
                        {test.prerequisites.map((prereq) => {
                          const prereqTest = tests.find((t) => t.id === prereq)
                          const isPrereqCompleted = completedTests.includes(prereq)
                          return (
                            <span key={prereq} className={isPrereqCompleted ? "text-green-600" : "text-red-500"}>
                              {prereqTest?.title}
                              {test.prerequisites!.indexOf(prereq) < test.prerequisites!.length - 1 && ", "}
                            </span>
                          )
                        })}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {isCompleted ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`${test.path}/results`)}
                            className="flex-1"
                          >
                            View Results
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => router.push(test.path)}>
                            Retake
                          </Button>
                        </>
                      ) : isAvailable ? (
                        <Button
                          size="sm"
                          onClick={() => router.push(test.path)}
                          className="flex-1 bg-gray-900 hover:bg-gray-800"
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Assessment
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled className="flex-1 bg-transparent">
                          Complete Prerequisites
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Completion Message */}
        {completedTests.length === tests.length && (
          <Card className="mt-8 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 mb-2">🎉 All Assessments Complete!</h3>
              <p className="text-green-700 mb-6">
                Congratulations! You've completed all personality and career assessments. Visit your dashboard to
                explore your comprehensive profile and get personalized recommendations.
              </p>
              <Button onClick={() => router.push("/dashboard")} className="bg-green-600 hover:bg-green-700">
                View Complete Profile
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
