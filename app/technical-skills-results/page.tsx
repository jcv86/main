"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Code,
  Database,
  Globe,
  Smartphone,
  Cloud,
  Shield,
  Bot,
  Trophy,
  Target,
  TrendingUp,
  BookOpen,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Brain,
  Zap,
  Award,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useToast } from "@/hooks/use-toast"

interface TestResults {
  answers: { [key: number]: number | string }
  results: {
    totalScore: number
    maxScore: number
    percentage: number
    categoryScores: { [key: string]: { score: number; max: number; questions: number } }
  }
  questions: any[]
  categories: string[]
  timeSpent: number
  completedAt: string
}

interface AIAnalysis {
  analysis: string
  loading: boolean
}

const categoryIcons = {
  "Frontend Development": Globe,
  "Backend Development": Code,
  "Database Management": Database,
  "DevOps & Cloud": Cloud,
  "Mobile Development": Smartphone,
  Cybersecurity: Shield,
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"]

export default function TechnicalSkillsResultsPage() {
  const [results, setResults] = useState<TestResults | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({ analysis: "", loading: false })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const savedResults = localStorage.getItem("technicalSkillsResults")
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults)
      setResults(parsedResults)
      generateAIAnalysis(parsedResults)
    }
    setLoading(false)
  }, [])

  const generateAIAnalysis = async (testResults: TestResults) => {
    setAiAnalysis({ analysis: "", loading: true })

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "technical_complete_analysis",
          data: {
            totalScore: testResults.results.totalScore,
            maxScore: testResults.results.maxScore,
            percentage: testResults.results.percentage,
            categoryScores: testResults.results.categoryScores,
            categories: testResults.categories,
            timeSpent: testResults.timeSpent,
            questionsAnswered: testResults.questions.length,
          },
        }),
      })

      const data = await response.json()
      setAiAnalysis({ analysis: data.insights, loading: false })
    } catch (error) {
      console.error("Error generating AI analysis:", error)
      setAiAnalysis({
        analysis: "Unable to generate AI analysis at this time. Please try again later.",
        loading: false,
      })
    }
  }

  const getSkillLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Expert", color: "text-purple-600", bgColor: "bg-purple-100" }
    if (percentage >= 80) return { level: "Advanced", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (percentage >= 70) return { level: "Proficient", color: "text-green-600", bgColor: "bg-green-100" }
    if (percentage >= 60) return { level: "Intermediate", color: "text-yellow-600", bgColor: "bg-yellow-100" }
    if (percentage >= 50) return { level: "Beginner", color: "text-orange-600", bgColor: "bg-orange-100" }
    return { level: "Novice", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getRadarData = () => {
    if (!results) return []

    return Object.entries(results.results.categoryScores).map(([category, scores]) => ({
      category: category.replace(" Development", "").replace(" Management", ""),
      score: Math.round((scores.score / scores.max) * 100),
      fullName: category,
    }))
  }

  const getBarData = () => {
    if (!results) return []

    return Object.entries(results.results.categoryScores).map(([category, scores], index) => ({
      category: category.replace(" Development", "").replace(" Management", ""),
      score: Math.round((scores.score / scores.max) * 100),
      fullName: category,
      fill: COLORS[index % COLORS.length],
    }))
  }

  const getPieData = () => {
    if (!results) return []

    return Object.entries(results.results.categoryScores).map(([category, scores], index) => ({
      name: category.replace(" Development", "").replace(" Management", ""),
      value: Math.round((scores.score / scores.max) * 100),
      fullName: category,
      fill: COLORS[index % COLORS.length],
    }))
  }

  const getStrengths = () => {
    if (!results) return []

    return Object.entries(results.results.categoryScores)
      .filter(([_, scores]) => (scores.score / scores.max) * 100 >= 80)
      .map(([category, scores]) => ({
        category,
        percentage: Math.round((scores.score / scores.max) * 100),
      }))
  }

  const getDevelopmentAreas = () => {
    if (!results) return []

    return Object.entries(results.results.categoryScores)
      .filter(([_, scores]) => (scores.score / scores.max) * 100 < 70)
      .map(([category, scores]) => ({
        category,
        percentage: Math.round((scores.score / scores.max) * 100),
      }))
  }

  const downloadResults = () => {
    if (!results) return

    const resultsText = `
Technical Skills Assessment Results
Generated on: ${new Date(results.completedAt).toLocaleDateString()}

Overall Score: ${results.results.percentage}%
Time Spent: ${formatTime(results.timeSpent)}
Categories Assessed: ${results.categories.join(", ")}

Category Breakdown:
${Object.entries(results.results.categoryScores)
  .map(
    ([category, scores]) =>
      `${category}: ${Math.round((scores.score / scores.max) * 100)}% (${scores.score}/${scores.max} points)`,
  )
  .join("\n")}

AI Analysis:
${aiAnalysis.analysis}
    `

    const blob = new Blob([resultsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `technical-skills-results-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Results Downloaded",
      description: "Your technical skills assessment results have been downloaded.",
    })
  }

  const shareResults = async () => {
    if (!results) return

    const shareText = `I just completed a comprehensive technical skills assessment! 🚀

Overall Score: ${results.results.percentage}%
Categories: ${results.categories.join(", ")}

Ready to level up your tech skills? Take the assessment: ${window.location.origin}/technical-skills-test`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Technical Skills Assessment Results",
          text: shareText,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(shareText)
      toast({
        title: "Results Copied",
        description: "Results have been copied to your clipboard.",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-4">Please take the technical skills assessment first.</p>
          <Link href="/technical-skills-test">
            <Button>
              <Code className="w-4 h-4 mr-2" />
              Take Assessment
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const skillLevel = getSkillLevel(results.results.percentage)
  const radarData = getRadarData()
  const barData = getBarData()
  const pieData = getPieData()
  const strengths = getStrengths()
  const developmentAreas = getDevelopmentAreas()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Technical Skills Assessment Results</h1>
              <p className="text-gray-600">
                Completed on {new Date(results.completedAt).toLocaleDateString()} • Time spent:{" "}
                {formatTime(results.timeSpent)}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={shareResults}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={downloadResults}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Link href="/technical-skills-test">
                <Button>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retake Test
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">Your Technical Proficiency Score</CardTitle>
            <CardDescription className="text-blue-700">
              Based on {results.questions.length} questions across {results.categories.length} technical categories
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-2">{results.results.percentage}%</div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full ${skillLevel.bgColor}`}>
                <Trophy className={`w-5 h-5 mr-2 ${skillLevel.color}`} />
                <span className={`font-semibold ${skillLevel.color}`}>{skillLevel.level}</span>
              </div>
            </div>
            <Progress value={results.results.percentage} className="h-3 mb-4" />
            <div className="text-sm text-gray-600">
              {results.results.totalScore} out of {results.results.maxScore} points earned
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="radar">Radar Analysis</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Scores</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="development">Development Plan</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart className="w-5 h-5 text-blue-600" />
                    <span>Category Performance</span>
                  </CardTitle>
                  <CardDescription>Your scores across different technical domains</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={12} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.fullName]} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span>Skill Distribution</span>
                  </CardTitle>
                  <CardDescription>Relative performance across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.fullName]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Development Areas */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span>Technical Strengths</span>
                  </CardTitle>
                  <CardDescription>Areas where you excel (80%+ scores)</CardDescription>
                </CardHeader>
                <CardContent>
                  {strengths.length > 0 ? (
                    <div className="space-y-3">
                      {strengths.map(({ category, percentage }) => {
                        const Icon = categoryIcons[category as keyof typeof categoryIcons]
                        return (
                          <div key={category} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-900">{category}</span>
                            </div>
                            <Badge className="bg-green-100 text-green-800">{percentage}%</Badge>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Focus on improving your scores to identify technical strengths.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-orange-600">
                    <TrendingUp className="w-5 h-5" />
                    <span>Development Opportunities</span>
                  </CardTitle>
                  <CardDescription>Areas for improvement (&lt;70% scores)</CardDescription>
                </CardHeader>
                <CardContent>
                  {developmentAreas.length > 0 ? (
                    <div className="space-y-3">
                      {developmentAreas.map(({ category, percentage }) => {
                        const Icon = categoryIcons[category as keyof typeof categoryIcons]
                        return (
                          <div key={category} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5 text-orange-600" />
                              <span className="font-medium text-orange-900">{category}</span>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800">{percentage}%</Badge>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Excellent! All your technical areas are performing well.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span>Technical Skills Radar</span>
                </CardTitle>
                <CardDescription>
                  Comprehensive view of your technical competencies across all assessed domains
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                      <Radar
                        name="Technical Skills"
                        dataKey="score"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip formatter={(value, name, props) => [`${value}%`, props.payload.fullName]} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {radarData.map((item, index) => (
                    <div key={item.category} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{item.fullName}</div>
                      <div className="text-2xl font-bold text-blue-600">{item.score}%</div>
                      <div className="text-sm text-gray-600">{getSkillLevel(item.score).level}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Scores Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <div className="grid gap-6">
              {Object.entries(results.results.categoryScores).map(([category, scores]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons]
                const percentage = Math.round((scores.score / scores.max) * 100)
                const level = getSkillLevel(percentage)

                return (
                  <Card key={category}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className="w-6 h-6 text-blue-600" />
                          <div>
                            <CardTitle>{category}</CardTitle>
                            <CardDescription>{scores.questions} questions assessed</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
                          <Badge className={`${level.bgColor} ${level.color} border-0`}>{level.level}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Score</span>
                          <span className="font-medium">
                            {scores.score} / {scores.max} points
                          </span>
                        </div>
                        <Progress value={percentage} className="h-3" />

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{scores.questions}</div>
                            <div className="text-sm text-gray-600">Questions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{scores.score}</div>
                            <div className="text-sm text-gray-600">Points Earned</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">{percentage}%</div>
                            <div className="text-sm text-gray-600">Accuracy</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-semibold ${level.color}`}>{level.level}</div>
                            <div className="text-sm text-gray-600">Skill Level</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-900">
                  <Bot className="w-6 h-6" />
                  <span>AI-Powered Technical Analysis</span>
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Comprehensive analysis of your technical skills performance powered by ChatGPT-4
                </CardDescription>
              </CardHeader>
              <CardContent>
                {aiAnalysis.loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-3 text-purple-700">
                      <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating comprehensive technical analysis...</span>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-purple max-w-none">
                    <div className="whitespace-pre-wrap text-purple-900 leading-relaxed">{aiAnalysis.analysis}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Development Plan Tab */}
          <TabsContent value="development" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  <span>30-Day Technical Development Plan</span>
                </CardTitle>
                <CardDescription>
                  Structured plan to improve your technical skills based on assessment results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Week 1-2: Immediate Focus */}
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-red-900 mb-2">Week 1-2: Immediate Focus Areas</h3>
                    <div className="space-y-2">
                      {developmentAreas.slice(0, 2).map(({ category }) => (
                        <div key={category} className="p-3 bg-red-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            {React.createElement(categoryIcons[category as keyof typeof categoryIcons], {
                              className: "w-4 h-4 text-red-600",
                            })}
                            <span className="font-medium text-red-900">{category}</span>
                          </div>
                          <ul className="text-sm text-red-800 space-y-1">
                            <li>• Review fundamental concepts and best practices</li>
                            <li>• Complete hands-on tutorials and exercises</li>
                            <li>• Practice with real-world scenarios</li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Week 3-4: Strength Building */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-green-900 mb-2">Week 3-4: Leverage Your Strengths</h3>
                    <div className="space-y-2">
                      {strengths.slice(0, 2).map(({ category }) => (
                        <div key={category} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            {React.createElement(categoryIcons[category as keyof typeof categoryIcons], {
                              className: "w-4 h-4 text-green-600",
                            })}
                            <span className="font-medium text-green-900">{category}</span>
                          </div>
                          <ul className="text-sm text-green-800 space-y-1">
                            <li>• Explore advanced topics and techniques</li>
                            <li>• Share knowledge through mentoring or teaching</li>
                            <li>• Lead projects that showcase your expertise</li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Success Tips */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Success Tips for Technical Growth
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">Learning Strategies:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Set aside 30-60 minutes daily for focused learning</li>
                          <li>• Build projects to apply new concepts</li>
                          <li>• Join technical communities and forums</li>
                          <li>• Follow industry leaders and best practices</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">Practice Methods:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Code challenges and algorithmic problems</li>
                          <li>• Open source contributions</li>
                          <li>• Personal projects and portfolios</li>
                          <li>• Peer code reviews and collaboration</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span>Recommended Next Steps</span>
                </CardTitle>
                <CardDescription>Continue your technical development journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link href="/interview-simulator">
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Practice Technical Interviews</h3>
                          <p className="text-sm text-gray-600">Test your skills in interview scenarios</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/skills-assessment">
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Target className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Update Skills Profile</h3>
                          <p className="text-sm text-gray-600">Add technical skills to your profile</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/career-coach">
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Bot className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">Get Career Coaching</h3>
                          <p className="text-sm text-gray-600">Personalized advice for tech career growth</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
