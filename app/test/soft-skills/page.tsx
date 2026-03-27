"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/components/session-wrapper"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import TestIntroScreen from "@/components/test-intro-screen"
import TestCompletionScreen from "@/components/test-completion-screen"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, MessageSquare, Star } from "lucide-react"

interface Question {
  id: number
  text: string
  type: "likert" | "scenario" | "open_ended"
  skill:
    | "communication"
    | "leadership"
    | "teamwork"
    | "problem_solving"
    | "adaptability"
    | "time_management"
    | "emotional_intelligence"
    | "creativity"
  options?: string[]
}

const softSkillsQuestions: Question[] = [
  // Communication Skills
  {
    id: 1,
    text: "I can clearly explain complex ideas to others",
    type: "likert",
    skill: "communication",
  },
  {
    id: 2,
    text: "I actively listen to others and ask clarifying questions",
    type: "likert",
    skill: "communication",
  },
  {
    id: 3,
    text: "Describe a situation where you had to communicate bad news to a team. How did you approach it?",
    type: "open_ended",
    skill: "communication",
  },
  {
    id: 4,
    text: "I adapt my communication style based on my audience",
    type: "likert",
    skill: "communication",
  },

  // Leadership Skills
  {
    id: 5,
    text: "I can motivate others to achieve common goals",
    type: "likert",
    skill: "leadership",
  },
  {
    id: 6,
    text: "I take initiative when I see opportunities for improvement",
    type: "likert",
    skill: "leadership",
  },
  {
    id: 7,
    text: "Your team is facing a major deadline with limited resources. How do you lead them through this challenge?",
    type: "scenario",
    skill: "leadership",
    options: [
      "Delegate tasks based on each person's strengths and provide clear direction",
      "Work alongside the team and lead by example while maintaining morale",
      "Negotiate with stakeholders for more time or resources",
      "Focus on the most critical deliverables and communicate priorities clearly",
    ],
  },
  {
    id: 8,
    text: "I can make difficult decisions when necessary",
    type: "likert",
    skill: "leadership",
  },

  // Teamwork Skills
  {
    id: 9,
    text: "I collaborate effectively with people from diverse backgrounds",
    type: "likert",
    skill: "teamwork",
  },
  {
    id: 10,
    text: "I contribute positively to team dynamics",
    type: "likert",
    skill: "teamwork",
  },
  {
    id: 11,
    text: "Describe a time when you had to work with a difficult team member. How did you handle the situation?",
    type: "open_ended",
    skill: "teamwork",
  },
  {
    id: 12,
    text: "I can compromise when necessary for the team's benefit",
    type: "likert",
    skill: "teamwork",
  },

  // Problem Solving Skills
  {
    id: 13,
    text: "I can break down complex problems into manageable parts",
    type: "likert",
    skill: "problem_solving",
  },
  {
    id: 14,
    text: "I consider multiple solutions before making decisions",
    type: "likert",
    skill: "problem_solving",
  },
  {
    id: 15,
    text: "You discover a critical error in a project just before the deadline. What's your approach?",
    type: "scenario",
    skill: "problem_solving",
    options: [
      "Immediately assess the impact and develop a quick fix",
      "Gather the team to brainstorm solutions collaboratively",
      "Escalate to management while preparing potential solutions",
      "Analyze the root cause to prevent future occurrences",
    ],
  },
  {
    id: 16,
    text: "I remain calm and focused when facing unexpected challenges",
    type: "likert",
    skill: "problem_solving",
  },

  // Adaptability Skills
  {
    id: 17,
    text: "I adjust quickly to changes in priorities or procedures",
    type: "likert",
    skill: "adaptability",
  },
  {
    id: 18,
    text: "I'm comfortable working in ambiguous situations",
    type: "likert",
    skill: "adaptability",
  },
  {
    id: 19,
    text: "Tell me about a time when you had to learn a new skill quickly for work. How did you approach it?",
    type: "open_ended",
    skill: "adaptability",
  },
  {
    id: 20,
    text: "I see change as an opportunity rather than a threat",
    type: "likert",
    skill: "adaptability",
  },

  // Time Management Skills
  {
    id: 21,
    text: "I prioritize tasks effectively based on importance and urgency",
    type: "likert",
    skill: "time_management",
  },
  {
    id: 22,
    text: "I meet deadlines consistently",
    type: "likert",
    skill: "time_management",
  },
  {
    id: 23,
    text: "You have multiple urgent projects with competing deadlines. How do you manage your time?",
    type: "scenario",
    skill: "time_management",
    options: [
      "Create a detailed schedule and stick to it religiously",
      "Communicate with stakeholders to negotiate realistic timelines",
      "Focus on high-impact tasks first and delegate when possible",
      "Break large tasks into smaller, manageable chunks",
    ],
  },
  {
    id: 24,
    text: "I can estimate accurately how long tasks will take",
    type: "likert",
    skill: "time_management",
  },

  // Emotional Intelligence Skills
  {
    id: 25,
    text: "I can recognize and manage my emotions effectively",
    type: "likert",
    skill: "emotional_intelligence",
  },
  {
    id: 26,
    text: "I can read others' emotions and respond appropriately",
    type: "likert",
    skill: "emotional_intelligence",
  },
  {
    id: 27,
    text: "Describe a situation where you had to manage your emotions in a stressful work situation.",
    type: "open_ended",
    skill: "emotional_intelligence",
  },
  {
    id: 28,
    text: "I can help others manage their emotions during difficult times",
    type: "likert",
    skill: "emotional_intelligence",
  },

  // Creativity Skills
  {
    id: 29,
    text: "I can generate innovative solutions to problems",
    type: "likert",
    skill: "creativity",
  },
  {
    id: 30,
    text: "I think outside the box when approaching challenges",
    type: "likert",
    skill: "creativity",
  },
]

const likertOptions = [
  { value: 1, label: "Never" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Always" },
]

export default function SoftSkillsTest() {
  const [showIntro, setShowIntro] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionData, setCompletionData] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  const handleLikertAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleTextAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const calculateSkillScores = () => {
    const skillScores = {
      communication: 0,
      leadership: 0,
      teamwork: 0,
      problem_solving: 0,
      adaptability: 0,
      time_management: 0,
      emotional_intelligence: 0,
      creativity: 0,
    }

    const skillCounts = {
      communication: 0,
      leadership: 0,
      teamwork: 0,
      problem_solving: 0,
      adaptability: 0,
      time_management: 0,
      emotional_intelligence: 0,
      creativity: 0,
    }

    softSkillsQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined && question.type === "likert") {
        const numericAnswer = typeof answer === "number" ? answer : 3
        skillScores[question.skill] += numericAnswer
        skillCounts[question.skill]++
      } else if (answer !== undefined && (question.type === "scenario" || question.type === "open_ended")) {
        skillScores[question.skill] += 4 // Give credit for completing open-ended questions
        skillCounts[question.skill]++
      }
    })

    // Convert to percentages
    const percentageScores: Record<string, number> = {}
    Object.keys(skillScores).forEach((skill) => {
      const skillKey = skill as keyof typeof skillScores
      if (skillCounts[skillKey] > 0) {
        percentageScores[skill] = Math.round((skillScores[skillKey] / (skillCounts[skillKey] * 5)) * 100)
      } else {
        percentageScores[skill] = 0
      }
    })

    return percentageScores
  }

  const submitTest = async () => {
    if (Object.keys(answers).length < softSkillsQuestions.length) {
      toast({
        title: "Test Incompleto",
        description: "Por favor responde todas las preguntas antes de continuar.",
        variant: "destructive",
      })
      return
    }

    if (!user?.email) {
      toast({
        title: "Autenticación Requerida",
        description: "Debes estar autenticado para guardar los resultados.",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    setIsSubmitting(true)
    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    const skillScores = calculateSkillScores()
    const overallScore = Math.round(Object.values(skillScores).reduce((sum, score) => sum + score, 0) / 8)

    const results = {
      skill_scores: skillScores,
      overall_score: overallScore,
      completion_date: endTime.toISOString(),
      duration_minutes: duration,
      total_questions: softSkillsQuestions.length,
      answered_questions: Object.keys(answers).length,
      answers,
    }

    try {
      console.log("[v0] Submitting Soft Skills test results to database...")
      const saveResult = await UnifiedTestSystem.saveTestResult(
        user.email,
        "soft-skills",
        results,
        duration,
      )

      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save results")
      }

      console.log("[v0] Soft Skills test results saved successfully to database")

      const topSkill = Object.entries(skillScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
      setCompletionData({
        overallScore,
        topSkill: topSkill.replace(/_/g, " "),
        skillCount: Object.keys(skillScores).length,
      })
      setShowCompletion(true)

      toast({
        title: "Test Completado",
        description: "Tus resultados han sido guardados exitosamente.",
      })
    } catch (error) {
      console.error("[v0] Error submitting Soft Skills test:", error)
      toast({
        title: "Error al guardar resultados",
        description: "No se pudieron guardar tus resultados en la base de datos. Por favor contacta soporte.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (showIntro) {
    return (
      <TestIntroScreen
        testName="Competencias Blandas Despega"
        description="Evalúa tus habilidades interpersonales y profesionales clave para el éxito en cualquier entorno."
        whatItMeasures={[
          "Comunicación efectiva y escucha activa",
          "Liderazgo y capacidad de motivar equipos",
          "Trabajo en equipo y colaboración",
          "Resolución de problemas complejos",
          "Adaptabilidad al cambio",
          "Gestión del tiempo y prioridades",
          "Inteligencia emocional",
          "Creatividad e innovación",
        ]}
        whyRelevant="Las competencias blandas son el factor diferenciador en tu desarrollo profesional y personal, determinando tu capacidad de liderar, colaborar y crear impacto real en cualquier contexto."
        duration="20-25 minutos"
        questionCount={30}
        onStart={() => setShowIntro(false)}
        onBack={() => router.push("/test")}
      />
    )
  }

  if (showCompletion && completionData) {
    return (
      <TestCompletionScreen
        testName="Competencias Blandas Despega"
        summary={`Has completado el test evaluando ${completionData.skillCount} competencias clave para tu desarrollo integral.`}
        highlightedInsight={`Tu competencia más desarrollada es ${completionData.topSkill}, con una puntuación de ${completionData.overallScore}%.`}
        onViewFullReport={() => router.push("/test/soft-skills/results")}
        onTalkToCoach={() => router.push("/coach?context=soft-skills")}
      />
    )
  }

  const progress = ((currentQuestion + 1) / softSkillsQuestions.length) * 100
  const question = softSkillsQuestions[currentQuestion]
  const currentAnswer = answers[question.id]
  const canProceed = currentAnswer !== undefined && currentAnswer !== ""

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Tests
          </Button>
          <Badge variant="secondary" className="text-sm">
            <Star className="h-4 w-4 mr-1" />
            Competencias Blandas Despega
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Competencias Blandas Despega</h2>
                <p className="text-gray-600">
                  Pregunta {currentQuestion + 1} de {softSkillsQuestions.length}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>~20 minutos</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{question.text}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {question.skill.replace("_", " ")}
                </Badge>
                <Badge variant={question.type === "open_ended" ? "default" : "secondary"}>
                  {question.type === "open_ended" ? (
                    <>
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Respuesta Abierta
                    </>
                  ) : question.type === "scenario" ? (
                    "Escenario"
                  ) : (
                    "Escala de Calificación"
                  )}
                </Badge>
              </div>
            </div>
            <CardDescription>
              {question.type === "open_ended"
                ? "Proporciona una respuesta detallada describiendo tu experiencia (mínimo 50 caracteres)"
                : question.type === "scenario"
                  ? "Elige la respuesta que mejor se ajuste a tu respuesta típica"
                  : "Evalúa cuánto te describen este comportamiento"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {question.type === "likert" && (
              <RadioGroup
                value={currentAnswer?.toString() || ""}
                onValueChange={(value) => handleLikertAnswer(question.id, Number.parseInt(value))}
              >
                <div className="space-y-3">
                  {likertOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                      <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === "scenario" && question.options && (
              <RadioGroup
                value={(currentAnswer as string) || ""}
                onValueChange={(value) => handleTextAnswer(question.id, value)}
              >
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {question.type === "open_ended" && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe tu experiencia en detalle..."
                  value={(currentAnswer as string) || ""}
                  onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{((currentAnswer as string) || "").length} caracteres (mínimo 50 requeridos)</span>
                  {((currentAnswer as string) || "").length >= 50 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completo
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {currentQuestion === softSkillsQuestions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={!canProceed || isSubmitting}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completar Test
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(Math.min(softSkillsQuestions.length - 1, currentQuestion + 1))}
              disabled={!canProceed}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Counter */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-1">
            {softSkillsQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestion
                    ? "bg-gray-900"
                    : answers[softSkillsQuestions[index].id]
                      ? "bg-gray-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Object.keys(answers).length} de {softSkillsQuestions.length} preguntas respondidas
          </p>
        </div>

        {/* Skills Info */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Competencias Evaluadas:</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="p-2 bg-blue-50 rounded text-blue-900">Comunicación</div>
              <div className="p-2 bg-purple-50 rounded text-purple-900">Liderazgo</div>
              <div className="p-2 bg-green-50 rounded text-green-900">Trabajo en Equipo</div>
              <div className="p-2 bg-orange-50 rounded text-orange-900">Resolución de Problemas</div>
              <div className="p-2 bg-pink-50 rounded text-pink-900">Adaptabilidad</div>
              <div className="p-2 bg-yellow-50 rounded text-yellow-900">Gestión del Tiempo</div>
              <div className="p-2 bg-red-50 rounded text-red-900">Inteligencia Emocional</div>
              <div className="p-2 bg-indigo-50 rounded text-indigo-900">Creatividad</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
