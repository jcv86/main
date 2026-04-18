"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CompetencyRadarChart } from "@/components/competency-radar-chart"
import {
  Activity,
  Book,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Heart,
  Lightbulb,
  PieChart,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Download,
  Eye,
  Home,
  Share2,
  Shield,
  Zap,
  Star,
  Award,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useSession } from "@/components/session-wrapper"
import { EnhancedCoachFlow } from "@/components/enhanced-coach-flow"

interface TestResults {
  overall_score: number
  competency_scores: {
    self_awareness: number
    self_regulation: number
    motivation: number
    empathy: number
    social_skills: number
  }
  completed_at: string
  duration?: number
}

// Mock data for EnhancedCoachFlow as ieResult is not defined in the original code
const ieResult = {
  self_awareness: 80,
  self_regulation: 70,
  motivation: 90,
  empathy: 60,
  social_skills: 75,
  total_score: 77,
}

const competencyInfo = {
  self_awareness: {
    name: "Autoconciencia",
    icon: Brain,
    color: "bg-blue/50",
    description: "Capacidad para reconocer y entender tus propias emociones",
    lowDescription: "Desarrolla mayor conciencia de tus estados emocionales",
    mediumDescription: "Tienes buena conciencia emocional, sigue desarrollándola",
    highDescription: "Excelente autoconciencia emocional",
  },
  self_regulation: {
    name: "Autorregulación",
    icon: Target,
    color: "bg-green/50",
    description: "Habilidad para manejar y controlar tus emociones efectivamente",
    lowDescription: "Trabaja en técnicas de manejo emocional",
    mediumDescription: "Buen control emocional, continúa practicando",
    highDescription: "Excelente autorregulación emocional",
  },
  motivation: {
    name: "Motivación",
    icon: Lightbulb,
    color: "bg-orange",
    description: "Impulso interno hacia el logro y la perseverancia",
    lowDescription: "Busca fuentes de motivación intrínseca",
    mediumDescription: "Buena motivación, mantén el enfoque en tus objetivos",
    highDescription: "Motivación excepcional y orientación al logro",
  },
  empathy: {
    name: "Empatía",
    icon: Heart,
    color: "bg-red/50",
    description: "Capacidad para entender y conectar con las emociones de otros",
    lowDescription: "Practica la escucha activa y observación emocional",
    mediumDescription: "Buena empatía, sigue desarrollando la conexión emocional",
    highDescription: "Empatía excepcional y conexión emocional",
  },
  social_skills: {
    name: "Habilidades Sociales",
    icon: Users,
    color: "bg-purple/50",
    description: "Efectividad en el manejo de relaciones interpersonales",
    lowDescription: "Desarrolla habilidades de comunicación y liderazgo",
    mediumDescription: "Buenas habilidades sociales, continúa mejorando",
    highDescription: "Habilidades sociales excepcionales",
  },
}

const getScoreLevel = (score: number) => {
  if (score >= 85) return { level: "Excelente", color: "text-green", bgColor: "bg-green/10" }
  if (score >= 70) return { level: "Bueno", color: "text-blue", bgColor: "bg-blue/10" }
  if (score >= 55) return { level: "Promedio", color: "text-yellow", bgColor: "bg-yellow/10" }
  return { level: "En Desarrollo", color: "text-orange", bgColor: "bg-orange/10" }
}

const getRecommendations = (competencyScores: any) => {
  const recommendations = []

  if (competencyScores.self_awareness < 70) {
    recommendations.push({
      title: "Desarrolla tu Autoconciencia",
      description: "Practica la meditación mindfulness y lleva un diario emocional",
      icon: Brain,
      priority: "Alta",
    })
  }

  if (competencyScores.self_regulation < 70) {
    recommendations.push({
      title: "Mejora tu Autorregulación",
      description: "Aprende técnicas de respiración y manejo del estrés",
      icon: Target,
      priority: "Alta",
    })
  }

  if (competencyScores.empathy < 70) {
    recommendations.push({
      title: "Fortalece tu Empatía",
      description: "Practica la escucha activa y observa las señales no verbales",
      icon: Heart,
      priority: "Media",
    })
  }

  if (competencyScores.social_skills < 70) {
    recommendations.push({
      title: "Desarrolla Habilidades Sociales",
      description: "Participa en actividades de liderazgo y comunicación",
      icon: Users,
      priority: "Media",
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Mantén tu Excelencia",
      description: "Continúa desarrollando tus fortalezas y ayuda a otros",
      icon: Star,
      priority: "Mantenimiento",
    })
  }

  return recommendations
}

export default function EmotionalIntelligenceResults() {
  const router = useRouter()
  const [results, setResults] = useState<TestResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useSession()

  useEffect(() => {
    const loadResults = async () => {
      if (!user?.email) return

      try {
        setIsLoading(true)
        console.log("[v0] Loading EI results...")

        const testResult = await UnifiedTestSystem.loadTestResult(user.email, "Emotional Intelligence")

        if (testResult.success && testResult.data) {
          console.log("[v0] Found results:", testResult.data)
          setResults(testResult.data.results)
        } else {
          console.log("[v0] No test results found:", testResult.error)
        }
      } catch (error: any) {
        console.error("[v0] Error loading results:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los resultados",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadResults()
  }, [user])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mis Resultados de Inteligencia Emocional Despega",
        text: `He completado el test de Inteligencia Emocional Despega con una puntuación de ${results?.overall_score}%`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles",
      })
    }
  }

  const handleDownload = () => {
    toast({
      title: "Descarga iniciada",
      description: "Tu reporte detallado se está generando",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <Heart className="h-12 w-12 animate-pulse mx-auto mb-4 text-red" />
          <p className="text-muted/60">Cargando tus resultados...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <Heart className="h-16 w-16 mx-auto mb-6 text-red" />
            <h2 className="text-2xl font-bold text-foreground mb-4">No se encontraron resultados</h2>
            <p className="text-xl text-muted/60 mb-6">
              Parece que aún no has completado el test de Inteligencia Emocional Despega.
            </p>
            <Button onClick={() => router.push("/test/emotional-intelligence")} className="bg-red/50 hover:bg-red-600">
              Realizar Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overallLevel = getScoreLevel(results.overall_score)
  const recommendations = getRecommendations(results.competency_scores)

  // Mock testResults object for the Resumen Ejecutivo tab
  const testResults = {
    totalScore: results.overall_score,
    level: overallLevel.level,
    competencies: Object.entries(results.competency_scores).map(([key, score]) => ({
      name: competencyInfo[key as keyof typeof competencyInfo].name,
      score: score,
    })),
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => router.push("/test")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Tests
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue to-purple bg-clip-text text-transparent mb-2">
            Despega Empatía
          </h1>
          <p className="text-muted/60">Tus resultados del test de Inteligencia Emocional</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 shadow-xl bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Tu Puntuación General</h2>
                <div className="text-6xl font-bold mb-4">{results.overall_score}%</div>
                <Badge className={`${overallLevel.bgColor} ${overallLevel.color} text-lg px-4 py-2`}>
                  {overallLevel.level}
                </Badge>
                <p className="text-red/10 mt-4 text-lg">
                  {results.overall_score >= 85
                    ? "¡Excelente! Tienes una inteligencia emocional muy desarrollada que te permite navegar efectivamente las situaciones sociales y profesionales."
                    : results.overall_score >= 70
                      ? "¡Muy bien! Tienes una buena base de inteligencia emocional con oportunidades específicas de crecimiento."
                      : results.overall_score >= 55
                        ? "Tienes una inteligencia emocional promedio con varias áreas donde puedes desarrollar tus habilidades."
                        : "Hay grandes oportunidades para desarrollar tu inteligencia emocional y mejorar tus relaciones interpersonales."}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-2xl p-8">
                  <div className="text-4xl font-bold mb-2">{overallLevel.level}</div>
                  <div className="text-red/10 mb-4">Inteligencia Emocional</div>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Object.keys(results.competency_scores).length}</div>
                      <div className="text-red/10">Competencias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{results.duration || 25}m</div>
                      <div className="text-red/10">Duración</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PUENTE DE TRANSICION SECTION */}
        <Card className="mb-8 border-2 border-purple-300 bg-gradient-to-br from-purple/5 to-blue/5 dark:from-purple dark:to-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple" />
              Tu Puente de Transición Emocional
            </CardTitle>
            <CardDescription>
              No es tu nivel actual. Es cómo desarrollas una inteligencia emocional más integrada.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Eres Ahora */}
              <div className="p-4 bg-white dark:bg-background rounded-lg border-l-4 border-blue/50">
                <h4 className="font-semibold text-lg mb-2">Eres Ahora</h4>
                <p className="text-sm text-muted-foreground mb-3">Tu IE actual</p>
                <div className="text-2xl font-bold text-blue">{results.overall_score}%</div>
                <p className="text-xs text-muted-foreground mt-2">{overallLevel.level}</p>
              </div>

              {/* Puedes Ser */}
              <div className="p-4 bg-white dark:bg-background rounded-lg border-l-4 border-purple/50">
                <h4 className="font-semibold text-lg mb-2">Puedes Ser</h4>
                <p className="text-sm text-muted-foreground mb-3">IE más madura</p>
                <div className="text-xs space-y-1">
                  <p>• Mayor autoconocimiento</p>
                  <p>• Relaciones más auténticas</p>
                  <p>• Decisiones más equilibradas</p>
                </div>
              </div>

              {/* Cómo Llegas */}
              <div className="p-4 bg-white dark:bg-background rounded-lg border-l-4 border-green">
                <h4 className="font-semibold text-lg mb-2">Cómo Llegas</h4>
                <p className="text-sm text-muted-foreground mb-3">El puente práctico</p>
                <ul className="text-xs space-y-1">
                  <li>1. Observa tus patrones</li>
                  <li>2. Practica regulación</li>
                  <li>3. Desarrolla empatía</li>
                  <li>4. Integra sabiduría</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-purple/10 dark:bg-purple/30 rounded-lg border border-purple-300">
              <p className="text-sm text-foreground">
                <strong>Tu Siguiente Paso:</strong> Identifica tu área de máxima oportunidad en IE. Tu coach IA te diseñará un plan de prácticas para expandir esa competencia gradualmente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button onClick={handleShare} variant="outline" className="bg-white">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir Resultados
          </Button>
          <Button onClick={handleDownload} variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Descargar Reporte
          </Button>
          <Button onClick={() => router.push("/test")} variant="outline" className="bg-white">
            <BookOpen className="h-4 w-4 mr-2" />
            Otros Tests
          </Button>
          <Button onClick={() => router.push("/dashboard")} className="bg-blue/50 hover:bg-blue">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Dashboard
          </Button>
        </div>

        {/* Detailed Results Tabs */}
        <Tabs defaultValue="competencies" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-2 bg-white shadow-lg">
            <TabsTrigger value="resumen-ejecutivo" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Resumen</span>
            </TabsTrigger>
            <TabsTrigger value="competencies" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Competencias</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Análisis</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Recomendaciones</span>
            </TabsTrigger>
            <TabsTrigger value="development" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Desarrollo</span>
            </TabsTrigger>
            <TabsTrigger value="oportunidades" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Oportunidades</span>
            </TabsTrigger>
            <TabsTrigger value="biblioteca-dtc" className="flex items-center space-x-2">
              <Book className="h-4 w-4" />
              <span>Biblioteca DTC</span>
            </TabsTrigger>
            <TabsTrigger value="conexiones" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Conexiones</span>
            </TabsTrigger>
            <TabsTrigger value="reflexion" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Reflexión</span>
            </TabsTrigger>
            <TabsTrigger value="plan-90-dias" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Plan 90 Días</span>
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Coach IA</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen-ejecutivo" className="space-y-8">
            <Card className="border-2 border-purple/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple/5 to-pink-50">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Sparkles className="h-7 w-7 text-purple" />
                  <span>Resumen Ejecutivo Integral DTC</span>
                </CardTitle>
                <p className="text-muted/60 mt-2">
                  Tu foto 360° de inteligencia emocional: cómo te relacionas con tus emociones y las de otros
                </p>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                {/* Foto 360° del perfil */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Tu Foto 360° - Inteligencia Emocional</span>
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="bg-gradient-to-br from-purple/5 to-white">
                      <CardContent className="pt-6">
                        <p className="text-lg leading-relaxed text-gray-800">
                          <strong className="text-purple">Perfil IE Global:</strong> Con una puntuación de{" "}
                          {testResults.totalScore}/100, tu inteligencia emocional está en el nivel {testResults.level}.
                          Esto significa que{" "}
                          {testResults.totalScore >= 80
                            ? "tienes una excelente capacidad para reconocer y gestionar emociones"
                            : testResults.totalScore >= 60
                              ? "tienes buenas habilidades emocionales que puedes seguir desarrollando"
                              : testResults.totalScore >= 40
                                ? "estás en proceso de desarrollar tu conciencia emocional"
                                : "tienes un gran potencial para crecer en inteligencia emocional"}
                          .
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-red/5 to-white">
                      <CardContent className="pt-6">
                        <p className="text-lg leading-relaxed text-gray-800">
                          <strong className="text-pink-700">Competencias Destacadas:</strong> Tus fortalezas están en{" "}
                          {testResults.competencies
                            .filter((c) => c.score >= 70)
                            .map((c) => c.name.toLowerCase())
                            .slice(0, 2)
                            .join(" y ")}
                          , mientras que{" "}
                          {testResults.competencies
                            .filter((c) => c.score < 60)
                            .map((c) => c.name.toLowerCase())
                            .slice(0, 1)
                            .join("")}{" "}
                          es un área con potencial de desarrollo.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Top 5 ideas sobre tu forma de ser */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple">Top 5 Ideas Sobre Tu Inteligencia Emocional</h3>
                  <div className="space-y-3">
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-purple mb-2">1. Autoconciencia Emocional</h4>
                        <p className="text-muted">
                          {(testResults?.competencies?.find((c) => c.name === "Autoconciencia")?.score ?? 0) >= 70
                            ? "Tienes una excelente capacidad para identificar tus emociones en tiempo real y entender sus causas."
                            : "Estás desarrollando tu habilidad para reconocer tus emociones. Practicar el registro emocional diario te ayudará."}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-pink-500">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-red mb-2">2. Regulación Emocional</h4>
                        <p className="text-muted">
                          {(testResults?.competencies?.find((c) => c.name === "Autorregulación")?.score ?? 0) >= 70
                            ? "Manejas bien tus emociones intensas y sabes calmarte cuando es necesario."
                            : "Fortalecer tu capacidad de regulación emocional te ayudará en momentos de estrés. Técnicas de respiración son ideales."}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-blue mb-2">3. Empatía y Conexión</h4>
                        <p className="text-muted">
                          {(testResults?.competencies?.find((c) => c.name === "Empatía")?.score ?? 0) >= 70
                            ? "Tu capacidad empática te permite conectar profundamente con otros y entender sus perspectivas."
                            : "Desarrollar tu empatía fortalecerá tus relaciones. Practica la escucha activa sin juzgar."}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-green mb-2">4. Habilidades Sociales</h4>
                        <p className="text-muted">
                          {(testResults?.competencies?.find((c) => c.name === "Habilidades Sociales")?.score ?? 0) >= 70
                            ? "Te relacionas con facilidad y sabes comunicar tus emociones de forma efectiva."
                            : "Mejorar tu comunicación emocional fortalecerá tus vínculos. Practica expresar lo que sientes con claridad."}
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-orange mb-2">5. Motivación Interna</h4>
                        <p className="text-muted">
                          {(testResults?.competencies?.find((c) => c.name === "Motivación")?.score ?? 0) >= 70
                            ? "Tu motivación interna es sólida y te impulsa a alcanzar tus metas personales."
                            : "Conectar con tus valores y propósito fortalecerá tu motivación. Reflexiona sobre qué te mueve realmente."}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Mapa de impacto */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple">
                    Mapa de Impacto: Cómo tu IE influye en tu vida
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-red/5 to-white">
                      <CardContent className="pt-6 space-y-3">
                        <h4 className="font-semibold text-rose-800 flex items-center space-x-2">
                          <Heart className="h-5 w-5" />
                          <span>Vida Personal</span>
                        </h4>
                        <ul className="space-y-2 text-sm text-muted">
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-red mt-0.5 flex-shrink-0" />
                            <span>Relaciones familiares más profundas y auténticas</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-red mt-0.5 flex-shrink-0" />
                            <span>Mejor gestión del estrés y bienestar emocional</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-red mt-0.5 flex-shrink-0" />
                            <span>Mayor autoconocimiento y paz interior</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple/5 to-white">
                      <CardContent className="pt-6 space-y-3">
                        <h4 className="font-semibold text-purple flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>Relaciones</span>
                        </h4>
                        <ul className="space-y-2 text-sm text-muted">
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-purple/50 mt-0.5 flex-shrink-0" />
                            <span>Comunicación más clara y empática con tu pareja</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-purple/50 mt-0.5 flex-shrink-0" />
                            <span>Resolución constructiva de conflictos</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-purple/50 mt-0.5 flex-shrink-0" />
                            <span>Amistades más sólidas y significativas</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue/5 to-white">
                      <CardContent className="pt-6 space-y-3">
                        <h4 className="font-semibold text-blue flex items-center space-x-2">
                          <Target className="h-5 w-5" />
                          <span>Trabajo</span>
                        </h4>
                        <ul className="space-y-2 text-sm text-muted">
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-blue/50 mt-0.5 flex-shrink-0" />
                            <span>Liderazgo más efectivo y colaborativo</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-blue/50 mt-0.5 flex-shrink-0" />
                            <span>Mejor manejo de presión y decisiones difíciles</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <CheckCircle2 className="h-4 w-4 text-blue/50 mt-0.5 flex-shrink-0" />
                            <span>Ambiente laboral más positivo y productivo</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* 3 movimientos clave para 90 días */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple">
                    3 Movimientos Clave para los Próximos 90 Días
                  </h3>
                  <div className="space-y-3">
                    <Card className="border-l-4 border-l-rose-500">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-rose-800 mb-2">1. Movimiento Personal</h4>
                        <p className="text-muted mb-3">
                          <strong>Registro emocional diario:</strong> Durante 5 minutos cada noche, escribe cómo te
                          sentiste hoy y por qué. Esto fortalecerá tu autoconciencia emocional.
                        </p>
                        <p className="text-sm text-muted/60 italic">
                          Meta: Identificar patrones emocionales que te ayuden a conocerte mejor
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-purple mb-2">2. Movimiento Relacional</h4>
                        <p className="text-muted mb-3">
                          <strong>Conversaciones profundas semanales:</strong> Agenda 1 hora semanal con alguien
                          importante para hablar sin distracciones sobre cómo se sienten ambos. Practica la escucha
                          activa.
                        </p>
                        <p className="text-sm text-muted/60 italic">
                          Meta: Fortalecer vínculos genuinos y desarrollar empatía
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold text-blue mb-2">3. Movimiento Laboral</h4>
                        <p className="text-muted mb-3">
                          <strong>Técnica del semáforo emocional:</strong> Antes de reaccionar en situaciones tensas,
                          identifica tu emoción (rojo=detente, amarillo=reflexiona, verde=actúa con calma).
                        </p>
                        <p className="text-sm text-muted/60 italic">
                          Meta: Mejorar tu regulación emocional en contextos laborales
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competencies Tab */}
          <TabsContent value="competencies" className="space-y-6">
            <CompetencyRadarChart
              data={Object.entries(results.competency_scores).map(([key, score]) => ({
                name: competencyInfo[key as keyof typeof competencyInfo].name,
                value: score,
                fullMark: 100,
              }))}
              title="Tu Perfil de Inteligencia Emocional"
              description="Visualización de tus 5 competencias emocionales"
              strokeColor="#ef4444"
              fillColor="#ef4444"
              height={400}
            />

            <Card className="mb-8 border-2 border-purple/20 bg-gradient-to-br from-purple/5 to-pink-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="w-6 h-6 text-purple" />
                  Impacto en tu Vida Personal
                </CardTitle>
                <CardDescription>
                  Cómo tu inteligencia emocional influye en tus relaciones, bienestar y vida diaria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Users className="w-5 h-5" />
                      Relaciones Personales
                    </h3>
                    <p className="text-muted leading-relaxed">
                      Tu nivel de empatía ({results.competency_scores.empathy || 0}%) determina qué tan profundas son
                      tus conexiones. Una alta IE te permite entender las emociones de tu pareja, familia y amigos,
                      creando vínculos más auténticos y duraderos.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Home className="w-5 h-5" />
                      Vida Familiar
                    </h3>
                    <p className="text-muted leading-relaxed">
                      Tu habilidad para regular emociones ({results.competency_scores.self_regulation || 0}%) impacta
                      directamente el ambiente familiar. Manejar el estrés sin descargarlo en tu familia crea un hogar
                      más armonioso y seguro.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Heart className="w-5 h-5" />
                      Bienestar Emocional
                    </h3>
                    <p className="text-muted leading-relaxed">
                      Tu autoconciencia emocional ({results.competency_scores.self_awareness || 0}%) es la base de tu
                      salud mental. Reconocer y nombrar tus emociones te permite procesarlas en lugar de reprimirlas,
                      reduciendo ansiedad y mejorando tu bienestar general.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Sparkles className="w-5 h-5" />
                      Desarrollo Personal
                    </h3>
                    <p className="text-muted leading-relaxed">
                      Tus habilidades sociales ({results.competency_scores.social_skills || 0}%) te ayudan en el
                      trabajo, pero más importante aún, enriquecen tu vida personal permitiéndote construir una red de
                      apoyo sólida y relaciones significativas.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-l-4 border-purple">
                  <h3 className="font-semibold text-lg mb-3 text-purple">
                    💡 Recuerda: Tu inteligencia emocional es para tu vida, no solo para tu trabajo
                  </h3>
                  <p className="text-muted leading-relaxed">
                    La IE es la base para relaciones sanas con tu pareja, familia y amigos. Una alta IE mejora tu
                    bienestar mental, reduce conflictos personales y te ayuda a crear una vida más feliz y plena. El
                    éxito laboral es solo un beneficio secundario.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(results.competency_scores).map(([key, score]) => {
                const competency = competencyInfo[key as keyof typeof competencyInfo]
                const level = getScoreLevel(score)
                const IconComponent = competency.icon

                return (
                  <Card key={key} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${competency.color} bg-opacity-20`}>
                          <IconComponent className="h-8 w-8 text-muted" />
                        </div>
                        <Badge className={`${level.bgColor} ${level.color}`}>{level.level}</Badge>
                      </div>
                      <CardTitle className="text-xl">{competency.name}</CardTitle>
                      <CardDescription>{competency.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-foreground">{score}%</span>
                          <span className="text-sm text-muted/50">de 100</span>
                        </div>
                        <Progress value={score} className="h-3" />
                        <p className="text-sm text-muted/60 leading-relaxed">
                          {score >= 85
                            ? competency.highDescription
                            : score >= 70
                              ? competency.mediumDescription
                              : competency.lowDescription}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-blue/50" />
                    <span>Fortalezas Principales</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results.competency_scores)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([key, score], index) => {
                        const competency = competencyInfo[key as keyof typeof competencyInfo]
                        const IconComponent = competency.icon
                        return (
                          <div key={key} className="flex items-center space-x-3 p-3 bg-green/5 rounded-lg">
                            <div className="flex items-center justify-center w-8 h-8 bg-green/10 rounded-full text-green font-bold text-sm">
                              {index + 1}
                            </div>
                            <IconComponent className="h-6 w-6 text-green" />
                            <div className="flex-1">
                              <div className="font-semibold text-foreground">{competency.name}</div>
                              <div className="text-sm text-muted/60">
                                {score}% - {getScoreLevel(score).level}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-6 w-6 text-orange" />
                    <span>Áreas de Oportunidad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results.competency_scores)
                      .sort(([, a], [, b]) => a - b)
                      .slice(0, 3)
                      .map(([key, score], index) => {
                        const competency = competencyInfo[key as keyof typeof competencyInfo]
                        const IconComponent = competency.icon
                        return (
                          <div key={key} className="flex items-center space-x-3 p-3 bg-orange/5 rounded-lg">
                            <div className="flex items-center justify-center w-8 h-8 bg-orange/10 rounded-full text-orange font-bold text-sm">
                              {index + 1}
                            </div>
                            <IconComponent className="h-6 w-6 text-orange" />
                            <div className="flex-1">
                              <div className="font-semibold text-foreground">{competency.name}</div>
                              <div className="text-sm text-muted/60">{score}% - Potencial de mejora</div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-purple/50" />
                  <span>Perfil Emocional Detallado</span>
                </CardTitle>
                <CardDescription>Análisis comparativo de tus competencias emocionales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(results.competency_scores).map(([key, score]) => {
                    const competency = competencyInfo[key as keyof typeof competencyInfo]
                    const level = getScoreLevel(score)
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">{competency.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${level.bgColor} ${level.color} text-xs`}>{level.level}</Badge>
                            <span className="font-bold text-foreground">{score}%</span>
                          </div>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => {
                const IconComponent = rec.icon
                return (
                  <Card key={index} className="shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 rounded-lg bg-muted/20 bg-opacity-20">
                          <IconComponent className="h-6 w-6 text-muted" />
                        </div>
                        <Badge
                          variant={
                            rec.priority === "Alta" ? "destructive" : rec.priority === "Media" ? "default" : "secondary"
                          }
                        >
                          Prioridad {rec.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted/60 leading-relaxed">{rec.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="shadow-lg bg-gradient-to-r from-blue/5 to-purple/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-blue/50" />
                  <span>Plan de Acción Inmediato</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue/50 text-white rounded-full font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Esta Semana</h4>
                      <p className="text-muted/60">Comienza un diario emocional para aumentar tu autoconciencia</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue/50 text-white rounded-full font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Este Mes</h4>
                      <p className="text-muted/60">Practica técnicas de respiración y mindfulness diariamente</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue/50 text-white rounded-full font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Próximos 3 Meses</h4>
                      <p className="text-muted/60">Busca oportunidades de liderazgo y feedback de colegas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-green" />
                    <span>Recursos Recomendados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green/5 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Libros</h4>
                      <ul className="text-sm text-muted/60 space-y-1">
                        <li>• "Inteligencia Emocional" - Daniel Goleman</li>
                        <li>• "Emotional Intelligence 2.0" - Travis Bradberry</li>
                        <li>• "The EQ Edge" - Steven Stein</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue/5 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Cursos Online</h4>
                      <ul className="text-sm text-muted/60 space-y-1">
                        <li>• Mindfulness y Meditación</li>
                        <li>• Comunicación Efectiva</li>
                        <li>• Liderazgo Emocional</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-6 w-6 text-purple/50" />
                    <span>Ejercicios Prácticos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple/5 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Diarios</h4>
                      <ul className="text-sm text-muted/60 space-y-1">
                        <li>• Diario de emociones diario</li>
                        <li>• Registro de desencadenantes</li>
                        <li>• Reflexiones de interacciones sociales</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow/5 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Técnicas</h4>
                      <ul className="text-sm text-muted/60 space-y-1">
                        <li>• Respiración 4-7-8</li>
                        <li>• Escucha activa</li>
                        <li>• Pausa antes de reaccionar</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-gold-500" />
                  <span>Próximos Pasos</span>
                </CardTitle>
                <CardDescription>Continúa tu desarrollo con estas evaluaciones complementarias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => router.push("/test/disc")}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Target className="h-8 w-8 text-blue/50" />
                    <span className="font-semibold">Test DISC</span>
                    <span className="text-xs text-muted/50">Estilo de comportamiento</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/test/big-five")}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Brain className="h-8 w-8 text-purple/50" />
                    <span className="font-semibold">Big Five</span>
                    <span className="text-xs text-muted/50">Personalidad completa</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/test/soft-skills")}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Users className="h-8 w-8 text-green" />
                    <span className="font-semibold">Habilidades Blandas</span>
                    <span className="text-xs text-muted/50">Competencias profesionales</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oportunidades" className="space-y-6">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 text-yellow" />
                  <span>Oportunidades de Desarrollo Emocional</span>
                </CardTitle>
                <CardDescription>
                  Áreas específicas donde puedes crecer emocionalmente basadas en tu perfil de IE
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-yellow/5 to-orange/5 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Por qué estas oportunidades son relevantes para ti</h3>
                  <p className="text-sm text-muted mb-4">
                    Tu perfil de Inteligencia Emocional con puntuaciones específicas en cada competencia revela patrones
                    únicos de fortalezas emocionales y áreas de crecimiento. Estas oportunidades están diseñadas para
                    ayudarte a desarrollar una vida más consciente, equilibrada y auténtica emocionalmente.
                  </p>
                </div>

                {/* Área 1: Autoconciencia Profunda */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-blue" />
                      <span>1. Autoconciencia Emocional Profunda</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-blue">
                        {results.competency_scores.self_awareness >= 80
                          ? "Expandir tu ya desarrollada autoconciencia hacia la comprensión de patrones emocionales inconscientes y triggers profundos."
                          : results.competency_scores.self_awareness >= 60
                            ? "Profundizar tu capacidad de reconocer emociones en tiempo real y entender sus causas raíz."
                            : "Desarrollar la habilidad fundamental de identificar y nombrar tus emociones con precisión en el momento presente."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-blue font-bold">→</span>
                          <div>
                            <strong>Escaneo Emocional (3x/día):</strong> Pausa 2 minutos en mañana, mediodía y noche
                            para identificar qué emoción sientes y dónde la sientes en tu cuerpo.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue font-bold">→</span>
                          <div>
                            <strong>Diario de Patrones:</strong> Cada noche, registra una emoción intensa del día: qué
                            la causó, cómo reaccionaste, qué patrón identificas.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue font-bold">→</span>
                          <div>
                            <strong>Vocabulario Emocional:</strong> Aprende 1 nueva palabra emocional por semana (ej:
                            nostalgia, melancolía, euforia) y úsala para describir tus estados.
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue to-blue text-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold mb-1">Recurso Recomendado</p>
                          <p className="text-sm opacity-90">App de Mindfulness para práctica diaria</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 2: Regulación Emocional */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-green" />
                      <span>2. Regulación Emocional Efectiva</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-green">
                        {results.competency_scores.self_regulation >= 80
                          ? "Refinar tu capacidad de regulación para responder (no reaccionar) incluso en situaciones de alta presión."
                          : results.competency_scores.self_regulation >= 60
                            ? "Fortalecer tu habilidad de pausar antes de responder y elegir cómo actuar."
                            : "Construir herramientas básicas para gestionar emociones intensas sin reprimirlas ni explosionar."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-green font-bold">→</span>
                          <div>
                            <strong>Técnica 90 Segundos:</strong> Cuando sientas una emoción intensa, respira y espera
                            90 segundos antes de actuar (tiempo que tarda la química emocional en bajar).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green font-bold">→</span>
                          <div>
                            <strong>Respiración 4-7-8:</strong> Inhala 4 segundos, sostén 7, exhala 8. Hazlo antes de
                            reuniones importantes o conversaciones difíciles.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green font-bold">→</span>
                          <div>
                            <strong>Movimiento Consciente:</strong> Cuando estés abrumado, camina 10 minutos sin
                            celular, sintiendo cada paso.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 3: Empatía y Conexión */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-purple" />
                      <span>3. Empatía y Conexión Auténtica</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-purple">
                        {results.competency_scores.empathy >= 80
                          ? "Expandir tu empatía desde la comprensión hacia la acción compasiva que genera cambio real."
                          : results.competency_scores.empathy >= 60
                            ? "Profundizar tu capacidad de sentir lo que otros sienten sin perder tu propio centro emocional."
                            : "Desarrollar la habilidad de puterte en el lugar del otro, especialmente con quienes son diferentes a ti."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-purple font-bold">→</span>
                          <div>
                            <strong>Escucha Profunda Semanal:</strong> Cada semana, ten una conversación de 30 min donde
                            SOLO escuches sin aconsejar ni interrumpir.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple font-bold">→</span>
                          <div>
                            <strong>Pregunta Empática:</strong> En cada conflicto, pregúntate: "¿Qué dolor o miedo está
                            sintiendo esta persona que la hace actuar así?"
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple font-bold">→</span>
                          <div>
                            <strong>Validación Activa:</strong> Practica decir "Entiendo que sientas..." antes de dar tu
                            opinión o solución.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 4: Resiliencia Emocional */}
                <Card className="border-l-4 border-l-orange">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-orange" />
                      <span>4. Resiliencia y Recuperación Emocional</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-orange">
                        Desarrollar la capacidad de recuperarte rápidamente de adversidades emocionales y encontrar
                        significado incluso en experiencias dolorosas.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-orange font-bold">→</span>
                          <div>
                            <strong>Ritual de Cierre Diario:</strong> Antes de dormir, escribe 3 cosas por las que estás
                            agradecido y 1 aprendizaje del día (incluso si fue difícil).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange font-bold">→</span>
                          <div>
                            <strong>Red de Apoyo Emocional:</strong> Identifica 3 personas a quienes puedas llamar
                            cuando estés en crisis emocional.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange font-bold">→</span>
                          <div>
                            <strong>Reencuadre Activo:</strong> Ante cada problema, pregúntate: "¿Qué oportunidad de
                            crecimiento esconde esto?"
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-yellow to-orange-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Próximo Paso</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Elige UNA oportunidad de desarrollo emocional que resuene contigo y comprométete a practicarla
                    durante 30 días consecutivos. La transformación emocional requiere repetición y constancia.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conexiones" className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-blue" />
                  <span>Conexión con Otros Módulos DTC</span>
                </CardTitle>
                <CardDescription>
                  Cómo Inteligencia Emocional se relaciona con los demás tests del ecosistema DTC
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue/5 to-purple/5 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">El Rol de la IE en Tu Desarrollo Integral</h3>
                  <p className="text-sm text-muted mb-4">
                    La Inteligencia Emocional es el "sistema operativo" de tu vida. Mientras que DISC mide tu
                    comportamiento, MBTI tus preferencias, y RIASEC tus intereses, la IE determina qué tan efectivamente
                    navegas todas esas dimensiones cuando las emociones están involucradas.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* DISC Connection */}
                  <Card className="border-2 border-blue/30">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue/10 rounded-full flex items-center justify-center text-lg">
                          🎯
                        </div>
                        Despega Cerebral (DISC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-blue/5 p-3 rounded text-sm">
                        <strong className="text-blue">Conexión:</strong>
                        <p className="text-blue mt-1">
                          DISC muestra cómo actúas, IE muestra qué tan consciente estás de tus emociones al actuar así.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alto D en DISC + baja Autorregulación en IE = líder impulsivo que toma
                        decisiones rápidas sin considerar el impacto emocional.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/disc")}
                      >
                        Hacer Test DISC
                      </Button>
                    </CardContent>
                  </Card>

                  {/* MBTI Connection */}
                  <Card className="border-2 border-purple-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple/10 rounded-full flex items-center justify-center text-lg">
                          🧠
                        </div>
                        Mapa de Personalidad (MBTI)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-purple/5 p-3 rounded text-sm">
                        <strong className="text-purple">Conexión:</strong>
                        <p className="text-purple mt-1">
                          MBTI muestra tus preferencias cognitivas, IE muestra qué tan bien gestionas las emociones que
                          surgen de esas preferencias.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> INTJ + alta IE = líder visionario que también conecta emocionalmente.
                        INTJ + baja IE = genio aislado.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/mbti")}
                      >
                        Hacer Test MBTI
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Big Five Connection */}
                  <Card className="border-2 border-green-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center text-lg">
                          ⭐
                        </div>
                        5 Dimensiones (Big Five)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-green/5 p-3 rounded text-sm">
                        <strong className="text-green-900">Conexión:</strong>
                        <p className="text-green mt-1">
                          Big Five mide rasgos estables, IE mide habilidades entrenables. IE puede compensar rasgos
                          desafiantes.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Bajo Agreeableness + alta Empatía (IE) = persona directa pero que sabe
                        conectar cuando importa.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/big-five")}
                      >
                        Hacer Test Big Five
                      </Button>
                    </CardContent>
                  </Card>

                  {/* RIASEC Connection */}
                  <Card className="border-2 border-orange-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange/10 rounded-full flex items-center justify-center text-lg">
                          💼
                        </div>
                        Brújula Vocacional (RIASEC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-orange/5 p-3 rounded text-sm">
                        <strong className="text-orange-900">Conexión:</strong>
                        <p className="text-orange mt-1">
                          RIASEC muestra qué tipo de trabajo te motiva, IE determina qué tan bien manejas el estrés y
                          relaciones en ese trabajo.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alto Social en RIASEC + baja IE = quieres ayudar pero te agobias con
                        las emociones de otros.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/riasec")}
                      >
                        Hacer Test RIASEC
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Soft Skills Connection */}
                  <Card className="border-2 border-pink-300">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-red/10 rounded-full flex items-center justify-center text-lg">
                          💡
                        </div>
                        Competencias Blandas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-red/5 p-3 rounded text-sm">
                        <strong className="text-pink-900">Conexión:</strong>
                        <p className="text-red mt-1">
                          IE es la base de TODAS las soft skills. Comunicación, liderazgo, trabajo en equipo dependen de
                          tu inteligencia emocional.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alta IE + entrenamiento en comunicación = comunicador magistral que
                        lee la sala emocionalmente.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/soft-skills")}
                      >
                        Hacer Test Soft Skills
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple" />
                      Casos de Sinergia con IE
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue/5 to-purple/5 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 1: El Líder Técnico que Quiere Crecer</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• DISC: Alto C+D = Analítico y decisivo</li>
                        <li>• IE: Baja empatía, baja conciencia social = Problemas con el equipo</li>
                        <li>• Acción DTC: Desarrollar empatía y habilidades sociales sin perder precisión técnica</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green/5 to-blue/5 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 2: La Persona Altamente Empática que se Agota</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• RIASEC: Alto Social = Vocación de ayudar</li>
                        <li>• IE: Alta empatía, baja autorregulación = Burnout emocional</li>
                        <li>• Acción DTC: Entrenar límites emocionales y técnicas de protección energética</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple/5 to-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 3: El Emprendedor Impulsivo</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• DISC: Alto D+I = Energético y persuasivo</li>
                        <li>• IE: Baja autorregulación = Decisiones emocionales que generan caos</li>
                        <li>• Acción DTC: Desarrollar pausa reflexiva y gestión del estrés</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-blue to-purple text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Recomendación DTC</h3>
                  <p className="text-sm opacity-90 mb-4">
                    La Inteligencia Emocional es la competencia más importante para el éxito en vida y carrera. Te
                    recomendamos completar al menos 2 tests adicionales (DISC + MBTI o RIASEC) para entender cómo tu IE
                    impacta tu comportamiento y vocación.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => router.push("/test")}>
                    Ver Todos los Tests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflexion" className="space-y-6">
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-red" />
                  <span>Preguntas de Reflexión Profunda</span>
                </CardTitle>
                <CardDescription>Explora tu inteligencia emocional más allá de los números del test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-red/5 to-purple/5 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">La importancia de la reflexión emocional</h3>
                  <p className="text-sm text-muted mb-4">
                    La verdadera inteligencia emocional no se mide solo con un test, sino con la capacidad de
                    reflexionar honestamente sobre tu vida emocional. Estas preguntas te invitan a explorar dimensiones
                    que ningún cuestionario puede capturar completamente.
                  </p>
                  <div className="bg-white p-4 rounded border-l-4 border-pink-500">
                    <p className="text-sm italic text-muted">
                      Tip: Escribe tus respuestas sin juzgarte. La honestidad emocional es el primer paso hacia la
                      madurez emocional.
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="autoconocimiento">
                    <AccordionTrigger className="bg-blue/5 px-4 rounded-lg hover:bg-blue/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔍</span>
                        <span className="font-semibold">Autoconocimiento Emocional</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue">
                            1. ¿Cuál es la emoción que más me cuesta reconocer en mí mismo?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Muchas personas evitan sentir tristeza, miedo o vergüenza. Identificar qué emoción reprimes
                            te ayuda a recuperar partes negadas de ti.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue">
                            2. ¿En qué situaciones mi cuerpo me avisa que estoy emocionalmente sobrepasado (antes de que
                            mi mente lo reconozca)?
                          </h4>
                          <p className="text-sm text-muted/60">
                            El cuerpo siempre sabe primero: tensión en hombros, nudo en el estómago, mandíbula apretada.
                            Reconocer estas señales te da ventaja para actuar.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue">
                            3. ¿Qué historia me cuento sobre mis emociones? (ej: "No debo sentir miedo", "La tristeza es
                            debilidad")
                          </h4>
                          <p className="text-sm text-muted/60">
                            Todos tenemos creencias sobre qué emociones son "aceptables". Cuestionar esas creencias es
                            liberador.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="regulacion">
                    <AccordionTrigger className="bg-green/5 px-4 rounded-lg hover:bg-green/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⚖️</span>
                        <span className="font-semibold">Regulación y Gestión Emocional</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-green-900">
                            4. ¿Cuándo fue la última vez que reaccioné emocionalmente y me arrepentí? ¿Qué habría hecho
                            diferente?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Revisar errores emocionales sin culpa, solo con curiosidad, es cómo aprendes
                            autorregulación.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-green-900">
                            5. ¿Qué técnicas uso actualmente para calmarme cuando estoy alterado? ¿Funcionan realmente?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Diferencia entre estrategias saludables (respirar, caminar, hablar) y evasivas (alcohol,
                            redes sociales, comer compulsivamente).
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-green-900">
                            6. ¿Qué emoción tiendo a reprimir o evitar sistemáticamente? ¿Qué temo que pase si la siento
                            plenamente?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Las emociones reprimidas no desaparecen, solo se acumulan. Sentirlas conscientemente las
                            libera.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="empatia">
                    <AccordionTrigger className="bg-purple/5 px-4 rounded-lg hover:bg-purple/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">❤️</span>
                        <span className="font-semibold">Empatía y Conexión</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple">
                            7. ¿Con qué tipo de personas me cuesta más empatizar? ¿Por qué?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Todos tenemos "puntos ciegos" de empatía. Reconocerlos te permite expandir tu compasión.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple">
                            8. ¿Alguna vez alguien me ha dicho que "no entiendo" sus emociones? ¿Qué pasó?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Los momentos donde fallamos en empatizar son oportunidades de aprendizaje sobre nuestras
                            limitaciones emocionales.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple">
                            9. ¿Cómo equilibro el cuidar de otros sin perder mi propio bienestar emocional?
                          </h4>
                          <p className="text-sm text-muted/60">
                            La empatía sin límites lleva al agotamiento. La compasión saludable incluye autocuidado.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="impacto">
                    <AccordionTrigger className="bg-orange/5 px-4 rounded-lg hover:bg-orange/10">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌊</span>
                        <span className="font-semibold">Impacto Emocional en Otros</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-orange-900">
                            10. ¿Cómo crees que tu estado emocional afecta a las personas más cercanas a ti?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Las emociones son contagiosas. Tu ansiedad, alegría o irritación impactan directamente a
                            quienes te rodean.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-orange-900">
                            11. ¿Alguna vez he dañado una relación importante por no gestionar bien mis emociones?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Reconocer el daño emocional que hemos causado (sin defensas) es un acto de madurez y
                            responsabilidad.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-orange-900">
                            12. ¿Qué legado emocional quiero dejar en las personas que me importan?
                          </h4>
                          <p className="text-sm text-muted/60">
                            Más allá de logros, ¿qué quieres que la gente sienta cuando piense en ti? ¿Seguridad?
                            ¿Inspiración? ¿Amor?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="bg-gradient-to-r from-red to-purple text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Comparte tu reflexión con tu Coach IA</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Las reflexiones más profundas emergen en conversación. Habla con Sofia o Dani para explorar tus
                    respuestas y descubrir insights que no habías considerado.
                  </p>
                  <Button variant="secondary" size="sm">
                    Hablar con Coach IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan-90-dias" className="space-y-6">
            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-green" />
                  <span>Plan de Acción de 90 Días - Inteligencia Emocional</span>
                </CardTitle>
                <CardDescription>
                  Tu hoja de ruta personalizada para desarrollar tu inteligencia emocional en los próximos 3 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-green/5 to-blue/5 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Plan de 90 Días Estructurado</h3>
                  <p className="text-sm text-muted mb-4">
                    Este plan está diseñado para tu perfil de Inteligencia Emocional con enfoque en:
                  </p>
                  <ul className="space-y-2 text-sm text-muted">
                    <li>
                      • <strong>Mes 1 (Semanas 1-4):</strong> Autoconciencia Emocional - Conoce y nombra tus emociones
                    </li>
                    <li>
                      • <strong>Mes 2 (Semanas 5-8):</strong> Regulación Emocional - Aprende a gestionar tus emociones
                    </li>
                    <li>
                      • <strong>Mes 3 (Semanas 9-12):</strong> Empatía y Conexión - Conecta auténticamente con otros
                    </li>
                  </ul>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="bg-blue/5">
                      <CardTitle className="text-lg">Mes 1: Autoconciencia</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2 text-sm">
                        <li>✓ Diario emocional diario</li>
                        <li>✓ Escaneo corporal 2x/día</li>
                        <li>✓ Identificar patrones y triggers</li>
                        <li>✓ Crear mapa emocional personal</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-green/5">
                      <CardTitle className="text-lg">Mes 2: Regulación</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2 text-sm">
                        <li>✓ Técnicas de respiración 4-7-8</li>
                        <li>✓ Pausa de 90 segundos</li>
                        <li>✓ Reencuadre cognitivo ABC</li>
                        <li>✓ Protocolo personal de regulación</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="bg-purple/5">
                      <CardTitle className="text-lg">Mes 3: Empatía</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2 text-sm">
                        <li>✓ Escucha activa profunda</li>
                        <li>✓ Ponerse en zapatos del otro</li>
                        <li>✓ Comunicación "Yo siento..."</li>
                        <li>✓ Manifiesto personal de IE</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-green to-blue text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Próximos Pasos</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Visita tu Dashboard para trackear tu progreso semanal y acceder al plan detallado con checkboxes
                    interactivos.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard")}>
                    Ir al Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <EnhancedCoachFlow
              testType="Emotional Intelligence"
              testResults={{
                self_awareness: ieResult?.self_awareness,
                self_regulation: ieResult?.self_regulation,
                motivation: ieResult?.motivation,
                empathy: ieResult?.empathy,
                social_skills: ieResult?.social_skills,
                total_score: ieResult?.total_score,
              }}
              userEmail={user?.email || ""}
            />
          </TabsContent>

          <TabsContent value="biblioteca-dtc" className="space-y-8">
            <Card className="border-2 border-purple/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple/5 to-pink-50">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Book className="h-7 w-7 text-purple" />
                  <span>Biblioteca DTC Recomendada</span>
                </CardTitle>
                <p className="text-muted/60 mt-2">
                  Recursos específicos para fortalecer tu inteligencia emocional en la vida real
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-purple/5">
                        <th className="border border-purple/20 p-3 text-left font-semibold text-purple">
                          Área de Desarrollo
                        </th>
                        <th className="border border-purple/20 p-3 text-left font-semibold text-purple">
                          Recurso Recomendado
                        </th>
                        <th className="border border-purple/20 p-3 text-left font-semibold text-purple">
                          Por qué es relevante
                        </th>
                        <th className="border border-purple/20 p-3 text-left font-semibold text-purple">
                          Mini Desafío
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-purple/5 transition-colors">
                        <td className="border border-purple/20 p-3 font-medium text-purple">
                          Autoconciencia Emocional
                        </td>
                        <td className="border border-purple/20 p-3">
                          <div>
                            <p className="font-semibold text-gray-800">Inteligencia Emocional - Daniel Goleman</p>
                            <p className="text-sm text-muted/60">Libro • Psicología</p>
                          </div>
                        </td>
                        <td className="border border-purple/20 p-3 text-muted">
                          Te enseña a identificar tus emociones en tiempo real y entender cómo influyen en tus
                          decisiones y relaciones personales.
                        </td>
                        <td className="border border-purple/20 p-3 text-sm text-muted">
                          Lleva un "diario emocional" durante 7 días: cada noche escribe 3 emociones que sentiste y qué
                          las provocó.
                        </td>
                      </tr>
                      <tr className="hover:bg-purple/5 transition-colors">
                        <td className="border border-purple/20 p-3 font-medium text-purple">
                          Regulación Emocional
                        </td>
                        <td className="border border-purple/20 p-3">
                          <div>
                            <p className="font-semibold text-gray-800">El Poder del Ahora - Eckhart Tolle</p>
                            <p className="text-sm text-muted/60">Libro • Mindfulness</p>
                          </div>
                        </td>
                        <td className="border border-purple/20 p-3 text-muted">
                          Aprenderás a no dejarte arrastrar por emociones intensas, observándolas sin juzgarlas ni
                          reaccionar impulsivamente.
                        </td>
                        <td className="border border-purple/20 p-3 text-sm text-muted">
                          Cuando sientas una emoción intensa, haz una pausa de 5 respiraciones profundas antes de
                          responder.
                        </td>
                      </tr>
                      <tr className="hover:bg-purple/5 transition-colors">
                        <td className="border border-purple/20 p-3 font-medium text-purple">Empatía</td>
                        <td className="border border-purple/20 p-3">
                          <div>
                            <p className="font-semibold text-gray-800">Comunicación No Violenta - Marshall Rosenberg</p>
                            <p className="text-sm text-muted/60">Libro • Comunicación</p>
                          </div>
                        </td>
                        <td className="border border-purple/20 p-3 text-muted">
                          Te muestra cómo entender las emociones de otros sin juzgar, creando conexiones más profundas
                          con familia, pareja y amigos.
                        </td>
                        <td className="border border-purple/20 p-3 text-sm text-muted">
                          En tu próxima conversación, practica reformular lo que la otra persona dice para confirmar que
                          entendiste.
                        </td>
                      </tr>
                      <tr className="hover:bg-purple/5 transition-colors">
                        <td className="border border-purple/20 p-3 font-medium text-purple">
                          Habilidades Sociales
                        </td>
                        <td className="border border-purple/20 p-3">
                          <div>
                            <p className="font-semibold text-gray-800">Conversaciones Cruciales - Kerry Patterson</p>
                            <p className="text-sm text-muted/60">Libro • Comunicación</p>
                          </div>
                        </td>
                        <td className="border border-purple/20 p-3 text-muted">
                          Herramientas prácticas para comunicar tus emociones en situaciones difíciles sin romper la
                          relación.
                        </td>
                        <td className="border border-purple/20 p-3 text-sm text-muted">
                          Elige una conversación pendiente y prepárala usando el modelo "Cuando [X], yo sentí [Y],
                          necesito [Z]".
                        </td>
                      </tr>
                      <tr className="hover:bg-purple/5 transition-colors">
                        <td className="border border-purple/20 p-3 font-medium text-purple">Motivación Interna</td>
                        <td className="border border-purple/20 p-3">
                          <div>
                            <p className="font-semibold text-gray-800">Fluir (Flow) - Mihaly Csikszentmihalyi</p>
                            <p className="text-sm text-muted/60">Libro • Psicología Positiva</p>
                          </div>
                        </td>
                        <td className="border border-purple/20 p-3 text-muted">
                          Conecta con actividades que te generan satisfacción genuina, fortaleciendo tu motivación desde
                          adentro.
                        </td>
                        <td className="border border-purple/20 p-3 text-sm text-muted">
                          Identifica 3 actividades que te hacen "perder la noción del tiempo" y dedícales al menos 2
                          horas semanales.
                        </td>
                      </tr>
                      <tr className="hover:bg-purple/5 transition-colors">
                        <td className="border border-purple/20 p-3 font-medium text-purple">
                          Gestión de Conflictos
                        </td>
                        <td className="border border-purple/20 p-3">
                          <div>
                            <p className="font-semibold text-gray-800">Conversaciones Difíciles - Douglas Stone</p>
                            <p className="text-sm text-muted/60">Libro • Relaciones</p>
                          </div>
                        </td>
                        <td className="border border-purple/20 p-3 text-muted">
                          Aprende a manejar conversaciones tensas con pareja, familia o jefe sin escalar el conflicto.
                        </td>
                        <td className="border border-purple/20 p-3 text-sm text-muted">
                          Practica el ejercicio de "tercera historia": describe un conflicto sin culpar a nadie, solo
                          hechos observables.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Alert className="mt-6 bg-purple/5 border-purple/20">
                  <BookOpen className="h-5 w-5 text-purple" />
                  <AlertTitle className="text-purple">Enfoque Integral: Personal + Trabajo</AlertTitle>
                  <AlertDescription className="text-purple">
                    Todos estos recursos están pensados para mejorar primero tu bienestar personal, tus relaciones
                    familiares y tu paz interior. Si además mejoran tu desempeño laboral, es un beneficio adicional,
                    pero no el objetivo principal. Tu vida personal importa más que tu carrera.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="text-center mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">¿Qué sigue?</h2>
          <p className="text-muted/60 max-w-2xl mx-auto">
            Usa estos resultados para desarrollar tu inteligencia emocional y mejorar tus relaciones personales y
            profesionales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              Ver Dashboard Completo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={() => router.push("/test")} variant="outline" size="lg" className="bg-white">
              Realizar Más Tests
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
