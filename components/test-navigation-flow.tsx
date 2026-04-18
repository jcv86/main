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
    name: "Despega Cerebral™",
    description: "Descubre tu estilo de comportamiento y preferencias de comunicación",
    duration: "10-15 min",
    questions: 15,
    difficulty: "Beginner",
    icon: Target,
    color: "bg-blue/50",
    path: "/test/disc",
  },
  {
    id: "emotional-intelligence",
    name: "Inteligencia Emocional Despega™",
    description: "Evalúa tu capacidad para entender y gestionar emociones",
    duration: "10-15 min",
    questions: 20,
    difficulty: "Beginner",
    icon: Heart,
    color: "bg-red/50",
    path: "/test/emotional-intelligence",
  },
  {
    id: "mbti",
    name: "Mapa de Personalidad Despega™",
    description: "Identifica tu tipo de personalidad y preferencias",
    duration: "15-20 min",
    questions: 25,
    difficulty: "Intermediate",
    icon: Brain,
    color: "bg-purple/50",
    path: "/test/mbti",
    prerequisites: ["disc"],
  },
  {
    id: "big-five",
    name: "5 Dimensiones Despega™",
    description: "Evaluación integral de personalidad en cinco dimensiones",
    duration: "15-20 min",
    questions: 30,
    difficulty: "Intermediate",
    icon: Users,
    color: "bg-green/50",
    path: "/test/big-five",
    prerequisites: ["disc", "emotional-intelligence"],
  },
  {
    id: "riasec",
    name: "Brújula Vocacional Despega™",
    description: "Descubre tus intereses profesionales y carreras compatibles",
    duration: "12-18 min",
    questions: 36,
    difficulty: "Intermediate",
    icon: Palette,
    color: "bg-orange/50",
    path: "/test/riasec",
    prerequisites: ["mbti"],
  },
  {
    id: "soft-skills",
    name: "Competencias Despega™",
    description: "Evalúa tus habilidades interpersonales y competencias profesionales",
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
            Progreso de Evaluación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completado General</span>
              <span className="text-sm text-muted/60">
                {completedTests.length}/{tests.length} evaluaciones
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <div className="flex items-center justify-between text-sm text-muted/60">
              <span>Inicio</span>
              <span>{overallProgress}% completado</span>
              <span>Completo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Next Test */}
      {recommendedTest && (
        <Card className="border-blue/20 bg-blue/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue">
              <PlayCircle className="h-5 w-5" />
              Evaluación Recomendada Siguiente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${recommendedTest.color} text-white`}>
                  <recommendedTest.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue">{recommendedTest.name}</h3>
                  <p className="text-sm text-blue">{recommendedTest.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-blue">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recommendedTest.duration}
                    </span>
                    <span>{recommendedTest.questions} preguntas</span>
                    <Badge variant="outline" className="text-xs">
                      {recommendedTest.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={() => startTest(recommendedTest.id)} className="bg-blue hover:bg-blue">
                Iniciar Evaluación
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
                  ? "border-green/20 bg-green/5"
                  : isAvailable
                    ? "border-muted/20 hover:border-muted/30"
                    : "border-muted/10 bg-muted/5"`}
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
                  {isCompleted && <CheckCircle className="h-6 w-6 text-green" />}
                  {!isAvailable && <AlertCircle className="h-6 w-6 text-muted/40" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted/60">{test.description}</p>

                <div className="flex items-center justify-between text-sm text-muted/50">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {test.duration}
                    </span>
                    <span>{test.questions} preguntas</span>
                  </div>
                </div>

                {progress > 0 && progress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Progreso</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
                )}

                {test.prerequisites && !isCompleted && (
                  <div className="text-xs text-muted/50">
                    <span className="font-medium">Prerrequisitos:</span>{" "}
                    {test.prerequisites.map((prereq) => {
                      const prereqTest = tests.find((t) => t.id === prereq)
                      const isPrereqCompleted = completedTests.includes(prereq)
                      return (
                        <span key={prereq} className={isPrereqCompleted ? "text-green" : "text-red"}>
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
                      Ver Resultados
                    </Button>
                  ) : isAvailable ? (
                    <Button size="sm" onClick={() => startTest(test.id)} className="flex-1">
                      {progress > 0 ? "Continuar" : "Iniciar Evaluación"}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="flex-1 bg-transparent">
                      Completar Prerrequisitos
                    </Button>
                  )}

                  {isCompleted && (
                    <Button variant="ghost" size="sm" onClick={() => startTest(test.id)}>
                      Volver a Intentar
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
        <Card className="border-green/20 bg-green/5">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green mb-2">🎉 Todas las Evaluaciones Completadas!</h3>
            <p className="text-green mb-4">
              Has completado todas las evaluaciones de personalidad y carrera. Visita tu panel de control para ver tu
              perfil completo.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="bg-green hover:bg-green">
              Ver Perfil Completo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export { TestNavigationFlow }
