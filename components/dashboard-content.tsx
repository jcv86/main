"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  Calendar,
  ArrowLeft,
  Play,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface TestResult {
  id: string
  name: string
  type: string
  score: number
  completedAt: Date
  status: "completed" | "in-progress" | "not-started"
  description: string
  duration: string
  questions: number
}

interface LearningResource {
  id: string
  title: string
  author: string
  category: string
  progress: number
  type: "Book" | "Course" | "Article" | "Video"
  duration?: string
  rating: number
}

export function DashboardContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Sample test results with more detailed data
  const testResults: TestResult[] = [
    {
      id: "1",
      name: "DISC Assessment",
      type: "personality",
      score: 85,
      completedAt: new Date("2024-01-15"),
      status: "completed",
      description: "Behavioral style and communication preferences",
      duration: "10 minutes",
      questions: 24,
    },
    {
      id: "2",
      name: "Big Five Personality",
      type: "personality",
      score: 78,
      completedAt: new Date("2024-01-10"),
      status: "completed",
      description: "Five major dimensions of personality",
      duration: "15 minutes",
      questions: 50,
    },
    {
      id: "3",
      name: "Emotional Intelligence",
      type: "skills",
      score: 0,
      completedAt: new Date(),
      status: "in-progress",
      description: "Ability to understand and manage emotions",
      duration: "10 minutes",
      questions: 30,
    },
    {
      id: "4",
      name: "RIASEC Career Interest",
      type: "career",
      score: 0,
      completedAt: new Date(),
      status: "not-started",
      description: "Career interests and vocational preferences",
      duration: "8 minutes",
      questions: 36,
    },
    {
      id: "5",
      name: "MBTI Type Indicator",
      type: "personality",
      score: 0,
      completedAt: new Date(),
      status: "not-started",
      description: "Psychological preferences and type",
      duration: "12 minutes",
      questions: 40,
    },
    {
      id: "6",
      name: "Soft Skills Evaluation",
      type: "skills",
      score: 0,
      completedAt: new Date(),
      status: "not-started",
      description: "Interpersonal and professional skills",
      duration: "12 minutes",
      questions: 35,
    },
  ]

  // Sample learning resources
  const learningResources: LearningResource[] = [
    {
      id: "1",
      title: "Leadership in the 21st Century",
      author: "John Maxwell",
      category: "Leadership",
      progress: 65,
      type: "Book",
      duration: "8 hours",
      rating: 4.8,
    },
    {
      id: "2",
      title: "Emotional Intelligence 2.0",
      author: "Travis Bradberry",
      category: "Skills",
      progress: 30,
      type: "Book",
      duration: "6 hours",
      rating: 4.6,
    },
    {
      id: "3",
      title: "Career Development Masterclass",
      author: "CareerDev Team",
      category: "Career",
      progress: 0,
      type: "Course",
      duration: "4 hours",
      rating: 4.9,
    },
    {
      id: "4",
      title: "Effective Communication Strategies",
      author: "Dale Carnegie",
      category: "Communication",
      progress: 85,
      type: "Course",
      duration: "3 hours",
      rating: 4.7,
    },
    {
      id: "5",
      title: "Building High-Performance Teams",
      author: "Patrick Lencioni",
      category: "Leadership",
      progress: 0,
      type: "Book",
      duration: "5 hours",
      rating: 4.5,
    },
    {
      id: "6",
      title: "The Future of Work",
      author: "Industry Experts",
      category: "Trends",
      progress: 100,
      type: "Article",
      duration: "30 minutes",
      rating: 4.4,
    },
  ]

  const availableTests = [
    {
      id: "disc",
      title: "DISC Assessment",
      description: "Understand your behavioral style and communication preferences",
      icon: Users,
      duration: "10 minutes",
      questions: 24,
      category: "Personality",
      difficulty: "Beginner",
    },
    {
      id: "big-five",
      title: "Big Five Personality",
      description: "Explore the five major dimensions of personality",
      icon: Star,
      duration: "15 minutes",
      questions: 50,
      category: "Personality",
      difficulty: "Intermediate",
    },
    {
      id: "mbti",
      title: "MBTI Type Indicator",
      description: "Discover your psychological preferences and type",
      icon: Brain,
      duration: "12 minutes",
      questions: 40,
      category: "Personality",
      difficulty: "Intermediate",
    },
    {
      id: "riasec",
      title: "RIASEC Career Interest",
      description: "Find careers that match your interests and values",
      icon: Target,
      duration: "8 minutes",
      questions: 36,
      category: "Career",
      difficulty: "Beginner",
    },
    {
      id: "emotional-intelligence",
      title: "Emotional Intelligence",
      description: "Assess your ability to understand and manage emotions",
      icon: Award,
      duration: "10 minutes",
      questions: 30,
      category: "Skills",
      difficulty: "Intermediate",
    },
    {
      id: "soft-skills",
      title: "Soft Skills Evaluation",
      description: "Evaluate your interpersonal and professional skills",
      icon: TrendingUp,
      duration: "12 minutes",
      questions: 35,
      category: "Skills",
      difficulty: "Advanced",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-foreground/10 text-foreground border-foreground/20"
      case "in-progress":
        return "bg-muted text-mutedForeground border-border"
      case "not-started":
        return "bg-secondary text-secondaryForeground border-border"
      default:
        return "bg-muted text-mutedForeground border-border"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-muted text-mutedForeground border-border"
    }
  }

  const completedTests = testResults.filter((test) => test.status === "completed").length
  const totalTests = testResults.length
  const completionPercentage = (completedTests / totalTests) * 100

  const totalLearningHours = learningResources.reduce((acc, resource) => {
    if (resource.duration) {
      const hours = Number.parseFloat(resource.duration.split(" ")[0])
      return acc + (resource.progress / 100) * hours
    }
    return acc
  }, 0)

  const averageScore =
    testResults.filter((test) => test.status === "completed").reduce((acc, test) => acc + test.score, 0) /
      completedTests || 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push("/")} className="border-border hover:bg-muted">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-background" />
                </div>
                <span className="text-2xl font-bold text-foreground">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-border">
                <Star className="h-3 w-3 mr-1" />
                Level 5
              </Badge>
              <Button
                onClick={() => router.push("/ai-coach")}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Coach
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
          <p className="text-mutedForeground">Continue your professional development journey</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="overview" className="data-[state=active]:bg-background">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="assessments" className="data-[state=active]:bg-background">
              <Target className="h-4 w-4 mr-2" />
              Assessments
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-background">
              <Award className="h-4 w-4 mr-2" />
              Results
            </TabsTrigger>
            <TabsTrigger value="library" className="data-[state=active]:bg-background">
              <BookOpen className="h-4 w-4 mr-2" />
              Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="border-border bg-card hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Tests Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {completedTests}/{totalTests}
                  </div>
                  <p className="text-xs text-mutedForeground">{Math.round(completionPercentage)}% completion rate</p>
                  <Progress value={completionPercentage} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Average Score</CardTitle>
                  <TrendingUp className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{Math.round(averageScore)}%</div>
                  <p className="text-xs text-mutedForeground">Across completed assessments</p>
                  <Progress value={averageScore} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Learning Hours</CardTitle>
                  <Clock className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{Math.round(totalLearningHours)}</div>
                  <p className="text-xs text-mutedForeground">Hours completed this month</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-foreground">Streak</CardTitle>
                  <Calendar className="h-4 w-4 text-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">7</div>
                  <p className="text-xs text-mutedForeground">Days active</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Activity */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Recent Activity</CardTitle>
                  <CardDescription>Your latest progress and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testResults.slice(0, 4).map((test) => (
                      <div key={test.id} className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-foreground rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{test.name}</p>
                          <p className="text-xs text-mutedForeground">
                            {test.status === "completed"
                              ? `Completed ${test.completedAt.toLocaleDateString()} - Score: ${test.score}%`
                              : test.status === "in-progress"
                                ? "In progress"
                                : "Ready to start"}
                          </p>
                        </div>
                        <Badge className={getStatusColor(test.status)} variant="outline">
                          {test.status === "completed" ? "Done" : test.status === "in-progress" ? "Active" : "New"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Actions</CardTitle>
                  <CardDescription>Continue your development journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border hover:bg-muted bg-transparent"
                    onClick={() => router.push("/ai-coach")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat with AI Coach
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border hover:bg-muted bg-transparent"
                    onClick={() => setActiveTab("assessments")}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Take New Assessment
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border hover:bg-muted bg-transparent"
                    onClick={() => setActiveTab("results")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    View Results
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-border hover:bg-muted bg-transparent"
                    onClick={() => setActiveTab("library")}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Browse Library
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Available Assessments</h2>
              <p className="text-mutedForeground">
                Take scientifically-backed assessments to gain insights into your personality, skills, and career
                preferences.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {availableTests.map((test) => {
                const testResult = testResults.find((result) => result.id === test.id)
                const isCompleted = testResult?.status === "completed"
                const isInProgress = testResult?.status === "in-progress"

                return (
                  <Card
                    key={test.id}
                    className={`border-border bg-card hover:bg-muted/50 transition-colors ${
                      isCompleted ? "ring-1 ring-foreground/20" : ""
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <test.icon className="h-8 w-8 text-foreground" />
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-muted text-mutedForeground">
                            {test.duration}
                          </Badge>
                          {isCompleted && <CheckCircle className="h-4 w-4 text-foreground" />}
                        </div>
                      </div>
                      <CardTitle className="text-lg text-foreground">{test.title}</CardTitle>
                      <CardDescription className="text-mutedForeground">{test.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-mutedForeground">{test.questions} questions</span>
                          <Badge className={getDifficultyColor(test.difficulty)} variant="outline">
                            {test.difficulty}
                          </Badge>
                        </div>
                        {isCompleted && testResult && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-mutedForeground">Your Score:</span>
                              <span className="font-medium text-foreground">{testResult.score}%</span>
                            </div>
                            <Progress value={testResult.score} className="h-2" />
                          </div>
                        )}
                        <div className="flex space-x-2">
                          {isCompleted ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveTab("results")}
                                className="flex-1 border-border hover:bg-muted"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View Results
                              </Button>
                              <Button size="sm" className="flex-1 bg-foreground text-background hover:bg-foreground/90">
                                <ArrowRight className="h-4 w-4 mr-1" />
                                Retake
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" className="w-full bg-foreground text-background hover:bg-foreground/90">
                              <Play className="h-4 w-4 mr-1" />
                              {isInProgress ? "Continue" : "Start Assessment"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Results</h2>
              <p className="text-mutedForeground">Review your assessment results and track your progress over time.</p>
            </div>

            <div className="space-y-4">
              {testResults.map((test) => (
                <Card key={test.id} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Target className="h-6 w-6 text-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{test.name}</h3>
                          <p className="text-sm text-mutedForeground">{test.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-mutedForeground">{test.duration}</span>
                            <span className="text-xs text-mutedForeground">•</span>
                            <span className="text-xs text-mutedForeground">{test.questions} questions</span>
                            {test.status === "completed" && (
                              <>
                                <span className="text-xs text-mutedForeground">•</span>
                                <span className="text-xs text-mutedForeground">
                                  Completed {test.completedAt.toLocaleDateString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        {test.status === "completed" && (
                          <div className="text-right">
                            <div className="text-3xl font-bold text-foreground">{test.score}%</div>
                            <div className="text-xs text-mutedForeground">Score</div>
                          </div>
                        )}
                        <div className="flex flex-col space-y-2">
                          <Badge className={getStatusColor(test.status)} variant="outline">
                            {test.status === "completed"
                              ? "Completed"
                              : test.status === "in-progress"
                                ? "In Progress"
                                : "Not Started"}
                          </Badge>
                          <Button variant="outline" size="sm" className="border-border hover:bg-muted bg-transparent">
                            {test.status === "completed" ? "View Details" : "Start Test"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    {test.status === "completed" && (
                      <div className="mt-4">
                        <Progress value={test.score} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Learning Library</h2>
              <p className="text-mutedForeground">
                Access curated resources, books, and materials for your professional development.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {learningResources.map((resource) => (
                <Card key={resource.id} className="border-border bg-card hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <BookOpen className="h-8 w-8 text-foreground" />
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-muted text-mutedForeground">
                          {resource.type}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-foreground" />
                          <span className="text-xs text-foreground">{resource.rating}</span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg text-foreground">{resource.title}</CardTitle>
                    <CardDescription className="text-mutedForeground">by {resource.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-mutedForeground">Progress</span>
                        <span className="text-foreground font-medium">{resource.progress}%</span>
                      </div>
                      <Progress value={resource.progress} className="h-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="border-border text-foreground">
                            {resource.category}
                          </Badge>
                          {resource.duration && (
                            <span className="text-xs text-mutedForeground">{resource.duration}</span>
                          )}
                        </div>
                        <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                          {resource.progress > 0 ? "Continue" : "Start"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default DashboardContent
