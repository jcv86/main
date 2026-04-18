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
  Monitor,
  Zap,
  Smartphone,
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
    title: "Despega Cerebral™",
    description: "Descubre tu estilo de comportamiento y preferencias de comunicación en entornos profesionales.",
    icon: Target,
    duration: "10-15 min",
    questions: 20,
    difficulty: "Beginner",
    category: "Personality",
    path: "/despega/a1-cerebral",
    color: "bg-blue/10 text-blue border-blue/20",
  },
  {
    id: "emotional-intelligence",
    title: "Despega Empatía™",
    description: "Evalúa tu inteligencia emocional y tu capacidad para reconocer, entender y gestionar emociones de manera efectiva.",
    icon: Heart,
    duration: "10-15 min",
    questions: 20,
    difficulty: "Beginner",
    category: "Intelligence",
    path: "/test/emotional-intelligence",
    color: "bg-cyan/10 text-cyan border-blue/20",
  },
  {
    id: "mbti",
    title: "Despega Resonancia™",
    description: "Descubre tu tipo de personalidad y tus preferencias psicológicas en el trabajo.",
    icon: Brain,
    duration: "15-20 min",
    questions: 25,
    difficulty: "Intermediate",
    category: "Personality",
    path: "/test/mbti",
    color: "bg-purple/10 text-purple border-purple/20",
    prerequisites: ["disc"],
  },
  {
    id: "big-five",
    title: "Despega Brújula™",
    description:
      "Evalúa tus cinco dimensiones principales de comportamiento para navegar mejor tu desarrollo profesional.",
    icon: Users,
    duration: "15-20 min",
    questions: 30,
    difficulty: "Intermediate",
    category: "Personality",
    path: "/test/big-five",
    color: "bg-green/10 text-green border-green/20",
    prerequisites: ["disc", "emotional-intelligence"],
  },
  {
    id: "riasec",
    title: "Despega Rumbo™",
    description: "Descubre tu rumbo profesional ideal y las carreras que se alinean con tu vocación.",
    icon: Palette,
    duration: "12-18 min",
    questions: 36,
    difficulty: "Intermediate",
    category: "Career",
    path: "/test/riasec",
    color: "bg-orange/10 text-orange border-orange/20",
    prerequisites: ["mbti"],
  },
  {
    id: "soft-skills",
    title: "Competencias Despega™",
    description: "Evalúa tus habilidades interpersonales y competencias profesionales para el desarrollo de carrera.",
    icon: Star,
    duration: "15-20 min",
    questions: 30,
    difficulty: "Advanced",
    category: "Skills",
    path: "/test/soft-skills",
    color: "bg-yellow/10 text-yellow border-yellow/20",
    prerequisites: ["big-five", "riasec"],
  },
]

export default function TestsPage() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [completedTests, setCompletedTests] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos")
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
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

  const filteredTests =
    selectedCategory === "Todos" ? tests : tests.filter((test) => test.category === selectedCategory)

  const categories = ["Todos", ...Array.from(new Set(tests.map((test) => test.category)))]
  const completionPercentage = (completedTests.length / tests.length) * 100
  const nextTest = getNextRecommendedTest()

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-muted/5 dark:bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-gray-900 dark:border-muted/10 mx-auto mb-4"></div>
          <p className="text-muted/60 dark:text-muted/40 text-sm sm:text-base">Cargando evaluaciones...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-muted/5 dark:bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted/60 dark:text-muted/40 text-sm sm:text-base">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/5 dark:bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")} size={isMobile ? "sm" : "default"}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push("/test-verification")}
              className="text-xs sm:text-sm bg-blue/5 dark:bg-blue border-blue/20 dark:border-blue/10 text-blue dark:text-blue/30 hover:bg-blue/10 dark:hover:bg-blue flex-1 sm:flex-none"
              size={isMobile ? "sm" : "default"}
            >
              {isMobile ? <Smartphone className="h-4 w-4 mr-2" /> : <Monitor className="h-4 w-4 mr-2" />}
              {isMobile ? "Tests Móviles" : "Verificación en Vivo"}
            </Button>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white mb-2">
            Evaluaciones de Personalidad
          </h1>
          <p className="text-muted/60 dark:text-muted/40 text-sm sm:text-base">
            Completa evaluaciones integrales para descubrir tu personalidad, habilidades e intereses profesionales.
          </p>
        </div>

        {/* Mobile Device Banner */}
        {isMobile && (
          <Card className="mb-6 sm:mb-8 border-green/20 dark:border-green bg-gradient-to-r from-green/5 dark:from-green-950 to-green/5 dark:to-green">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green/10 dark:bg-green rounded-lg">
                  <Smartphone className="h-5 w-5 text-green dark:text-green/40" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green dark:text-green/30 text-sm">
                    Experiencia Optimizada para Móvil
                  </h3>
                  <p className="text-xs text-green dark:text-green/40">
                    Todos los tests están optimizados para dispositivos móviles con interfaces táctiles y diseños
                    responsivos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Status Banner */}
        <Card className="mb-6 sm:mb-8 border-blue/20 dark:border-blue/10 bg-gradient-to-r from-blue/5 dark:from-blue-950 to-blue/5 dark:to-blue">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue/10 dark:bg-blue rounded-lg">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-blue dark:text-blue/40" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue dark:text-blue/30 text-sm sm:text-base">
                    Verificación de Tests en Tiempo Real
                  </h3>
                  <p className="text-xs sm:text-sm text-blue dark:text-blue/40">
                    Todos los tests de personalidad son verificados continuamente para asegurar navegación, validación y
                    flujos de completitud adecuados en {isMobile ? "dispositivos móviles" : "todos los dispositivos"}.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/test-verification")}
                className="bg-blue hover:bg-blue dark:bg-blue dark:hover:bg-blue w-full sm:w-auto"
                size={isMobile ? "sm" : "default"}
              >
                {isMobile ? <Smartphone className="h-4 w-4 mr-2" /> : <Monitor className="h-4 w-4 mr-2" />}
                Ver Tests en Vivo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              Progreso de Evaluaciones
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Completa todas las evaluaciones para obtener información integral sobre tu carrera y recomendaciones
              personalizadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium">Progreso General</span>
              <span className="text-xs sm:text-sm text-muted/60 dark:text-muted/40">
                {completedTests.length} de {tests.length} completados
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />

            {nextTest && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-blue/5 dark:bg-blue rounded-lg border border-blue/20 dark:border-blue/10">
                <div className="flex items-center gap-3">
                  <nextTest.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue dark:text-blue/40 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-blue dark:text-blue/30 text-sm sm:text-base truncate">
                      Recomendado: {nextTest.title}
                    </p>
                    <p className="text-xs sm:text-sm text-blue dark:text-blue/40">
                      {nextTest.duration} • {nextTest.questions} preguntas •{" "}
                      {nextTest.difficulty === "Beginner"
                        ? "Principiante"
                        : nextTest.difficulty === "Intermediate"
                          ? "Intermedio"
                          : "Avanzado"}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(nextTest.path)}
                  className="bg-blue hover:bg-blue dark:bg-blue dark:hover:bg-blue w-full sm:w-auto"
                  size={isMobile ? "sm" : "default"}
                >
                  Iniciar Test
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Filter - Mobile Optimized */}
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="text-xs sm:text-sm"
            >
              {category === "Todos"
                ? "Todos"
                : category === "Personality"
                  ? "Personalidad"
                  : category === "Skills"
                    ? "Habilidades"
                    : category === "Intelligence"
                      ? "Inteligencia"
                      : category === "Career"
                        ? "Carrera"
                        : category}
            </Button>
          ))}
        </div>

        {/* Tests Grid - Mobile Responsive */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => {
            const IconComponent = test.icon
            const isCompleted = completedTests.includes(test.id)
            const isAvailable = isTestAvailable(test)

            return (
              <Card
                key={test.id}
                className={`relative transition-all hover:shadow-lg ${
                  isCompleted
                    ? "border-green/20 dark:border-green bg-green/5 dark:bg-green"
                    : isAvailable
                      ? "hover:border-muted/30 dark:hover:border-muted/60"
                      : "opacity-60 bg-muted/5 dark:bg-background"
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <Badge className="bg-green/10 dark:bg-green text-green dark:text-green/30 border-green/20 dark:border-green text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completado
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className={`p-2 sm:p-3 rounded-lg ${test.color}`}>
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate text-foreground dark:text-white">
                        {test.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            test.difficulty === "Beginner"
                              ? "bg-green/10 dark:bg-green text-green dark:text-green/30 border-green/20 dark:border-green"
                              : test.difficulty === "Intermediate"
                                ? "bg-yellow/10 dark:bg-yellow text-yellow dark:text-yellow/30 border-yellow/20 dark:border-yellow"
                                : "bg-red/10 dark:bg-red text-red dark:text-red/30 border-red/20 dark:border-red"
                          }`}
                        >
                          {test.difficulty === "Beginner"
                            ? "Principiante"
                            : test.difficulty === "Intermediate"
                              ? "Intermedio"
                              : "Avanzado"}
                        </Badge>
                        <Badge variant="outline" className="text-xs dark:border-muted/60 dark:text-muted/30">
                          {test.category === "Personality"
                            ? "Personalidad"
                            : test.category === "Skills"
                              ? "Habilidades"
                              : test.category === "Intelligence"
                                ? "Inteligencia"
                                : test.category === "Career"
                                  ? "Carrera"
                                  : test.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-xs sm:text-sm leading-relaxed text-muted/60 dark:text-muted/40">
                    {test.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-muted/60 dark:text-muted/40">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{test.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{test.questions} preguntas</span>
                    </div>
                  </div>

                  {test.prerequisites && !isCompleted && (
                    <div className="text-xs text-muted/50 dark:text-muted/40 p-2 bg-muted/10 dark:bg-card rounded">
                      <span className="font-medium">Requisitos previos:</span>{" "}
                      {test.prerequisites.map((prereq) => {
                        const prereqTest = tests.find((t) => t.id === prereq)
                        const isPrereqCompleted = completedTests.includes(prereq)
                        return (
                          <span
                            key={prereq}
                            className={
                              isPrereqCompleted
                                ? "text-green dark:text-green/40"
                                : "text-red dark:text-red/40"
                            }
                          >
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
                          className="flex-1 text-xs sm:text-sm"
                        >
                          Ver Resultados
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(test.path)}
                          className="text-xs sm:text-sm"
                        >
                          Repetir
                        </Button>
                      </>
                    ) : isAvailable ? (
                      <Button
                        size="sm"
                        onClick={() => router.push(test.path)}
                        className="flex-1 bg-muted/90 hover:bg-gray-800 dark:bg-blue dark:hover:bg-blue/50 text-xs sm:text-sm"
                      >
                        <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        Iniciar Evaluación
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled className="flex-1 bg-transparent text-xs sm:text-sm">
                        Completar Requisitos
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Completion Message */}
        {completedTests.length === tests.length && (
          <Card className="mt-6 sm:mt-8 border-green/20 dark:border-green bg-green/5 dark:bg-green">
            <CardContent className="p-6 sm:p-8 text-center">
              <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green dark:text-green/40 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-green dark:text-green/30 mb-2">
                🎉 ¡Todas las Evaluaciones Completadas!
              </h3>
              <p className="text-green dark:text-green/40 mb-4 sm:mb-6 text-sm sm:text-base">
                ¡Felicitaciones! Has completado todas las evaluaciones de personalidad y carrera. Visita tu dashboard
                para explorar tu perfil completo y obtener recomendaciones personalizadas.
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-green hover:bg-green dark:bg-green dark:hover:bg-green"
                size={isMobile ? "sm" : "default"}
              >
                Ver Perfil Completo
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
