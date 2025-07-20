"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  Target,
  BookOpen,
  MessageSquare,
  Users,
  Lightbulb,
  Zap,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface SoftSkillResult {
  category: string
  score: number
  level: number
}

interface SoftSkillsResults {
  results: SoftSkillResult[]
  completedAt: string
  totalQuestions: number
  answeredQuestions: number
}

const categoryIcons = {
  Communication: MessageSquare,
  Leadership: Target,
  Teamwork: Users,
  "Problem Solving": Lightbulb,
  Adaptability: Zap,
  "Emotional Intelligence": Users,
  "Time Management": Clock,
}

const getScoreLevel = (score: number) => {
  if (score >= 90) return { level: "Exceptional", color: "text-green-600", bgColor: "bg-green-100" }
  if (score >= 80) return { level: "Strong", color: "text-blue-600", bgColor: "bg-blue-100" }
  if (score >= 70) return { level: "Good", color: "text-yellow-600", bgColor: "bg-yellow-100" }
  if (score >= 60) return { level: "Developing", color: "text-orange-600", bgColor: "bg-orange-100" }
  return { level: "Needs Focus", color: "text-red-600", bgColor: "bg-red-100" }
}

const getRecommendations = (category: string, score: number) => {
  const recommendations: Record<string, Record<string, string[]>> = {
    Communication: {
      high: [
        "Mentor others in effective communication techniques",
        "Lead presentation skills workshops",
        "Take on roles requiring stakeholder management",
      ],
      medium: [
        "Practice active listening techniques",
        "Join public speaking groups like Toastmasters",
        "Seek feedback on your communication style",
      ],
      low: [
        "Take a business communication course",
        "Practice explaining complex topics simply",
        "Work on written communication skills",
      ],
    },
    Leadership: {
      high: [
        "Seek leadership roles in cross-functional projects",
        "Mentor junior team members",
        "Consider leadership development programs",
      ],
      medium: [
        "Volunteer to lead small team initiatives",
        "Study different leadership styles",
        "Practice delegation and empowerment",
      ],
      low: [
        "Start with informal leadership opportunities",
        "Read leadership books and case studies",
        "Observe effective leaders in your organization",
      ],
    },
    Teamwork: {
      high: [
        "Facilitate team building activities",
        "Help resolve conflicts between team members",
        "Share collaboration best practices",
      ],
      medium: [
        "Actively participate in team discussions",
        "Practice giving and receiving feedback",
        "Work on building trust with colleagues",
      ],
      low: [
        "Focus on being a reliable team member",
        "Learn about different working styles",
        "Practice compromise and flexibility",
      ],
    },
    "Problem Solving": {
      high: [
        "Lead complex problem-solving initiatives",
        "Teach problem-solving frameworks to others",
        "Take on challenging analytical projects",
      ],
      medium: [
        "Practice structured problem-solving methods",
        "Seek diverse perspectives on challenges",
        "Document your problem-solving process",
      ],
      low: [
        "Learn basic problem-solving frameworks",
        "Break complex problems into smaller parts",
        "Practice root cause analysis techniques",
      ],
    },
    Adaptability: {
      high: [
        "Champion change initiatives in your organization",
        "Help others navigate transitions",
        "Take on roles in dynamic environments",
      ],
      medium: [
        "Embrace new technologies and processes",
        "Practice flexibility in your daily routine",
        "Seek feedback on your adaptability",
      ],
      low: [
        "Start with small changes in your routine",
        "Learn about change management principles",
        "Practice staying calm under pressure",
      ],
    },
    "Emotional Intelligence": {
      high: [
        "Become a go-to person for interpersonal issues",
        "Coach others on emotional awareness",
        "Lead initiatives requiring high EQ",
      ],
      medium: [
        "Practice reading non-verbal cues",
        "Work on managing your emotional responses",
        "Develop empathy through active listening",
      ],
      low: [
        "Learn about emotional intelligence concepts",
        "Practice self-awareness exercises",
        "Seek feedback on your interpersonal skills",
      ],
    },
    "Time Management": {
      high: [
        "Share time management strategies with others",
        "Take on projects with tight deadlines",
        "Help optimize team workflows",
      ],
      medium: [
        "Experiment with different productivity methods",
        "Practice saying no to non-essential tasks",
        "Use time-tracking tools to improve awareness",
      ],
      low: [
        "Learn basic time management techniques",
        "Start using a task management system",
        "Practice prioritization methods like Eisenhower Matrix",
      ],
    },
  }

  const level = score >= 80 ? "high" : score >= 60 ? "medium" : "low"
  return recommendations[category]?.[level] || []
}

export default function SoftSkillsResults() {
  const router = useRouter()
  const [results, setResults] = useState<SoftSkillsResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedResults = localStorage.getItem("softSkillsResults")
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      router.push("/soft-skills-test")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">Loading your results...</div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p>No results found. Please take the assessment first.</p>
          <Button onClick={() => router.push("/soft-skills-test")} className="mt-4">
            Take Assessment
          </Button>
        </div>
      </div>
    )
  }

  const overallScore = Math.round(
    results.results.reduce((sum, result) => sum + result.score, 0) / results.results.length,
  )
  const overallLevel = getScoreLevel(overallScore)
  const topSkills = results.results.filter((r) => r.score >= 80).sort((a, b) => b.score - a.score)
  const improvementAreas = results.results.filter((r) => r.score < 70).sort((a, b) => a.score - b.score)

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Soft Skills Assessment Results</h1>
        <p className="text-muted-foreground">Completed on {new Date(results.completedAt).toLocaleDateString()}</p>
      </div>

      {/* Overall Score Card */}
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Overall Soft Skills Score</CardTitle>
          <CardDescription>Based on {results.answeredQuestions} questions across 7 skill areas</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <div className="text-6xl font-bold mb-2" style={{ color: overallLevel.color.replace("text-", "") }}>
              {overallScore}%
            </div>
            <Badge className={`${overallLevel.bgColor} ${overallLevel.color} text-lg px-4 py-2`}>
              {overallLevel.level}
            </Badge>
          </div>
          <Progress value={overallScore} className="h-3 mb-4" />
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="detailed" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="development">Development Areas</TabsTrigger>
          <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed" className="space-y-6">
          <div className="grid gap-6">
            {results.results.map((result) => {
              const Icon = categoryIcons[result.category as keyof typeof categoryIcons]
              const level = getScoreLevel(result.score)

              return (
                <Card key={result.category}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" />
                        <CardTitle>{result.category}</CardTitle>
                      </div>
                      <Badge className={`${level.bgColor} ${level.color}`}>{level.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{result.score}%</span>
                        <Progress value={result.score} className="flex-1 ml-4" />
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Recommendations:</h4>
                        <ul className="space-y-1">
                          {getRecommendations(result.category, result.score)
                            .slice(0, 3)
                            .map((rec, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Your Top Soft Skills
              </CardTitle>
              <CardDescription>Skills where you scored 80% or higher</CardDescription>
            </CardHeader>
            <CardContent>
              {topSkills.length > 0 ? (
                <div className="space-y-4">
                  {topSkills.map((skill) => {
                    const Icon = categoryIcons[skill.category as keyof typeof categoryIcons]
                    return (
                      <div key={skill.category} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="font-medium">{skill.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={skill.score} className="w-24" />
                          <span className="font-bold text-green-600">{skill.score}%</span>
                        </div>
                      </div>
                    )
                  })}

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Leverage Your Strengths:</h4>
                    <ul className="space-y-1 text-sm text-green-700">
                      <li>• Seek roles that utilize these strong skills</li>
                      <li>• Mentor others in these areas</li>
                      <li>• Lead projects that require these competencies</li>
                      <li>• Include these strengths prominently in your resume</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No skills scored above 80%. Focus on developing your skills to reach the "Strong" level.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Development Opportunities
              </CardTitle>
              <CardDescription>Skills where you scored below 70% - your biggest growth opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              {improvementAreas.length > 0 ? (
                <div className="space-y-4">
                  {improvementAreas.map((skill) => {
                    const Icon = categoryIcons[skill.category as keyof typeof categoryIcons]
                    const level = getScoreLevel(skill.score)
                    return (
                      <div key={skill.category} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-primary" />
                            <span className="font-medium">{skill.category}</span>
                          </div>
                          <Badge className={`${level.bgColor} ${level.color}`}>{skill.score}%</Badge>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2">Priority Actions:</h5>
                          <ul className="space-y-1">
                            {getRecommendations(skill.category, skill.score)
                              .slice(0, 2)
                              .map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center p-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-lg font-medium text-green-600">Excellent Work!</p>
                  <p className="text-muted-foreground">All your soft skills are at a good level or above.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action-plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                30-Day Action Plan
              </CardTitle>
              <CardDescription>Prioritized steps to improve your soft skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Week 1-2</span>
                    Immediate Focus Areas
                  </h4>
                  <div className="space-y-2">
                    {improvementAreas.slice(0, 2).map((skill) => (
                      <div key={skill.category} className="p-3 border-l-4 border-red-200 bg-red-50">
                        <p className="font-medium">{skill.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {getRecommendations(skill.category, skill.score)[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Week 3-4</span>
                    Build on Strengths
                  </h4>
                  <div className="space-y-2">
                    {topSkills.slice(0, 2).map((skill) => (
                      <div key={skill.category} className="p-3 border-l-4 border-yellow-200 bg-yellow-50">
                        <p className="font-medium">{skill.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {getRecommendations(skill.category, skill.score)[0]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Success Tips:</h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• Set specific, measurable goals for each skill area</li>
                    <li>• Practice new skills in low-risk situations first</li>
                    <li>• Seek feedback regularly from colleagues and mentors</li>
                    <li>• Track your progress and celebrate small wins</li>
                    <li>• Consider finding an accountability partner</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/skills-assessment")} className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Update Skills Profile
            </Button>
            <Button onClick={() => router.push("/career-coach")} variant="outline" className="flex-1">
              <Users className="h-4 w-4 mr-2" />
              Get Career Coaching
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
