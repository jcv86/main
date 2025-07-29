"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Assessment {
  id: string
  title: string
  description: string
  type: "personality" | "skills" | "technical" | "cognitive"
  duration: number
  questions: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  tags: string[]
  isCompleted: boolean
  completedAt?: Date
  score?: number
  href: string
  icon: keyof typeof Icons
}

const assessments: Assessment[] = [
  {
    id: "personality-test",
    title: "Comprehensive Personality Assessment",
    description:
      "Discover your personality traits, strengths, and work preferences through our comprehensive assessment.",
    type: "personality",
    duration: 25,
    questions: 120,
    difficulty: "beginner",
    category: "Self-Discovery",
    tags: ["personality", "traits", "self-awareness"],
    isCompleted: true,
    completedAt: new Date("2024-01-15"),
    score: 85,
    href: "/personality-test",
    icon: "brain",
  },
  {
    id: "disc-test",
    title: "DISC Behavioral Assessment",
    description: "Understand your behavioral style and communication preferences with the DISC assessment.",
    type: "personality",
    duration: 15,
    questions: 60,
    difficulty: "beginner",
    category: "Behavioral Analysis",
    tags: ["disc", "behavior", "communication"],
    isCompleted: true,
    completedAt: new Date("2024-01-20"),
    score: 92,
    href: "/disc-test",
    icon: "users",
  },
  {
    id: "big-five-test",
    title: "Big Five Personality Test",
    description:
      "Explore the five major dimensions of personality: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism.",
    type: "personality",
    duration: 20,
    questions: 100,
    difficulty: "intermediate",
    category: "Personality Psychology",
    tags: ["big-five", "psychology", "traits"],
    isCompleted: false,
    href: "/big-five-test",
    icon: "target",
  },
  {
    id: "skills-assessment",
    title: "Professional Skills Assessment",
    description:
      "Evaluate your professional skills across various domains including leadership, communication, and problem-solving.",
    type: "skills",
    duration: 30,
    questions: 80,
    difficulty: "intermediate",
    category: "Professional Development",
    tags: ["skills", "professional", "competencies"],
    isCompleted: false,
    href: "/skills-assessment",
    icon: "award",
  },
  {
    id: "technical-skills-test",
    title: "Technical Skills Evaluation",
    description: "Assess your technical competencies in programming, data analysis, and digital tools.",
    type: "technical",
    duration: 45,
    questions: 50,
    difficulty: "advanced",
    category: "Technical Competency",
    tags: ["technical", "programming", "digital"],
    isCompleted: false,
    href: "/technical-skills-test",
    icon: "laptop",
  },
  {
    id: "soft-skills-test",
    title: "Soft Skills Assessment",
    description: "Evaluate your interpersonal skills, emotional intelligence, and workplace collaboration abilities.",
    type: "skills",
    duration: 25,
    questions: 70,
    difficulty: "intermediate",
    category: "Interpersonal Skills",
    tags: ["soft-skills", "emotional-intelligence", "collaboration"],
    isCompleted: true,
    completedAt: new Date("2024-01-10"),
    score: 78,
    href: "/soft-skills-test",
    icon: "heart",
  },
  {
    id: "adaptive-skills-test",
    title: "Adaptive Skills Assessment",
    description: "Measure your ability to adapt to change, learn new skills, and handle uncertainty in the workplace.",
    type: "cognitive",
    duration: 35,
    questions: 90,
    difficulty: "advanced",
    category: "Adaptability",
    tags: ["adaptability", "learning", "resilience"],
    isCompleted: false,
    href: "/adaptive-skills-test",
    icon: "zap",
  },
  {
    id: "personality-coach-test",
    title: "AI Personality Coach Assessment",
    description: "Get personalized insights and coaching recommendations based on your personality profile.",
    type: "personality",
    duration: 30,
    questions: 85,
    difficulty: "intermediate",
    category: "AI Coaching",
    tags: ["ai", "coaching", "personalized"],
    isCompleted: false,
    href: "/personality-coach-test",
    icon: "lightbulb",
  },
]

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

const typeColors = {
  personality: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  skills: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  technical: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  cognitive: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300",
}

export default function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment) => {
      const matchesSearch =
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesType = selectedType === "all" || assessment.type === selectedType
      const matchesDifficulty = selectedDifficulty === "all" || assessment.difficulty === selectedDifficulty

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "completed" && assessment.isCompleted) ||
        (activeTab === "pending" && !assessment.isCompleted)

      return matchesSearch && matchesType && matchesDifficulty && matchesTab
    })
  }, [searchTerm, selectedType, selectedDifficulty, activeTab])

  const completedCount = assessments.filter((a) => a.isCompleted).length
  const totalCount = assessments.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  const averageScore =
    assessments.filter((a) => a.isCompleted && a.score).reduce((sum, a) => sum + (a.score || 0), 0) / completedCount ||
    0

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Career Assessments</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover your strengths, identify growth areas, and unlock your career potential with our comprehensive
          assessment suite.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Progress</CardTitle>
            <Icons.target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalCount} assessments completed
            </p>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Icons.award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
            <p className="text-xs text-muted-foreground">Based on {completedCount} completed assessments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Recommendation</CardTitle>
            <Icons.lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Skills Assessment</div>
            <p className="text-xs text-muted-foreground">Complete your professional skills evaluation</p>
            <Button size="sm" className="mt-2" asChild>
              <Link href="/skills-assessment">Start Now</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Assessments</CardTitle>
          <CardDescription>Filter and search through available assessments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Assessment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="personality">Personality</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="cognitive">Cognitive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Assessments</TabsTrigger>
          <TabsTrigger value="pending">Pending ({totalCount - completedCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <AssessmentGrid assessments={filteredAssessments} />
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <AssessmentGrid assessments={filteredAssessments} />
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <AssessmentGrid assessments={filteredAssessments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function AssessmentGrid({ assessments }: { assessments: Assessment[] }) {
  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Icons.search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No assessments found</h3>
          <p className="text-muted-foreground text-center">
            Try adjusting your filters or search terms to find more assessments.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assessments.map((assessment) => (
        <AssessmentCard key={assessment.id} assessment={assessment} />
      ))}
    </div>
  )
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const Icon = Icons[assessment.icon]

  return (
    <Card
      className={cn(
        "transition-all hover:shadow-lg",
        assessment.isCompleted && "border-green-200 dark:border-green-800",
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            {assessment.isCompleted && <Icons.checkCircle className="h-5 w-5 text-green-600" />}
          </div>
          <div className="flex flex-col gap-1">
            <Badge className={cn("text-xs", typeColors[assessment.type])}>{assessment.type}</Badge>
            <Badge className={cn("text-xs", difficultyColors[assessment.difficulty])}>{assessment.difficulty}</Badge>
          </div>
        </div>
        <CardTitle className="text-lg">{assessment.title}</CardTitle>
        <CardDescription className="text-sm">{assessment.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icons.clock className="h-4 w-4" />
            <span>{assessment.duration} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icons.help className="h-4 w-4" />
            <span>{assessment.questions} questions</span>
          </div>
        </div>

        {assessment.isCompleted && assessment.score && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span className="font-medium">{assessment.score}%</span>
            </div>
            <Progress value={assessment.score} className="h-2" />
            <p className="text-xs text-muted-foreground">Completed on {assessment.completedAt?.toLocaleDateString()}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {assessment.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {assessment.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{assessment.tags.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={assessment.href}>{assessment.isCompleted ? "View Results" : "Start Assessment"}</Link>
          </Button>
          {assessment.isCompleted && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`${assessment.href}/results`}>
                <Icons.eye className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
