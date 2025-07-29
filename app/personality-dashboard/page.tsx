"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Brain,
  TrendingUp,
  Users,
  Target,
  BookOpen,
  MessageSquare,
  Download,
  RefreshCw,
  Calendar,
  Award,
  Lightbulb,
  BarChart3,
  Zap,
  Heart,
  Shield,
  Briefcase,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface PersonalityProfile {
  disc: {
    primary: string
    secondary: string
    scores: { D: number; I: number; S: number; C: number }
    completedAt: string
  } | null
  bigFive: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
    completedAt: string
  } | null
  mbti: {
    type: string
    preferences: { E_I: number; S_N: number; T_F: number; J_P: number }
    completedAt: string
  } | null
  enneagram: {
    type: number
    wing: number
    completedAt: string
  } | null
}

interface PersonalityInsight {
  id: string
  type: "strength" | "growth" | "career" | "development"
  title: string
  description: string
  actionable: boolean
  priority: "high" | "medium" | "low"
}

interface BookRecommendation {
  id: string
  title: string
  author: string
  category: string
  coverUrl: string
  relevantTrait: string
  reason: string
  priority: number
}

export default function PersonalityDashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile>({
    disc: null,
    bigFive: null,
    mbti: null,
    enneagram: null,
  })
  const [insights, setInsights] = useState<PersonalityInsight[]>([])
  const [bookRecommendations, setBookRecommendations] = useState<BookRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeframe, setSelectedTimeframe] = useState("current")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadPersonalityData()
  }, [user, router])

  const loadPersonalityData = async () => {
    try {
      setIsLoading(true)

      // Load personality test results from localStorage (in real app, from API)
      const discResults = localStorage.getItem("discResults")
      const bigFiveResults = localStorage.getItem("bigFiveResults")
      const personalityResults = localStorage.getItem("personalityResults")

      const profile: PersonalityProfile = {
        disc: discResults ? JSON.parse(discResults) : null,
        bigFive: bigFiveResults ? JSON.parse(bigFiveResults) : null,
        mbti: null, // No MBTI test implemented yet
        enneagram: null, // No Enneagram test implemented yet
      }

      setPersonalityProfile(profile)

      // Generate insights based on available data
      const generatedInsights = generatePersonalityInsights(profile)
      setInsights(generatedInsights)

      // Generate book recommendations
      const recommendations = generateBookRecommendations(profile)
      setBookRecommendations(recommendations)
    } catch (error) {
      console.error("Error loading personality data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generatePersonalityInsights = (profile: PersonalityProfile): PersonalityInsight[] => {
    const insights: PersonalityInsight[] = []

    // DISC insights
    if (profile.disc) {
      const primaryType = profile.disc.primary
      const dominantScore = Math.max(...Object.values(profile.disc.scores))

      if (primaryType === "D" && dominantScore >= 70) {
        insights.push({
          id: "disc-leadership",
          type: "strength",
          title: "Potencial de Liderazgo Natural",
          description:
            "Tu perfil DISC Dominante indica fuertes habilidades de liderazgo. Considera roles donde puedas dirigir equipos y tomar decisiones estratégicas.",
          actionable: true,
          priority: "high",
        })
      }

      if (profile.disc.scores.I >= 60 && profile.disc.scores.S >= 60) {
        insights.push({
          id: "disc-collaboration",
          type: "strength",
          title: "Excelente Colaborador",
          description:
            "Tu combinación de Influencia y Estabilidad te hace ideal para roles que requieren trabajo en equipo y construcción de relaciones.",
          actionable: true,
          priority: "medium",
        })
      }

      if (profile.disc.scores.C >= 70) {
        insights.push({
          id: "disc-quality",
          type: "strength",
          title: "Orientación a la Calidad",
          description:
            "Tu alta puntuación en Cumplimiento indica atención al detalle y estándares de calidad. Considera roles analíticos o de control de calidad.",
          actionable: true,
          priority: "medium",
        })
      }
    }

    // Big Five insights
    if (profile.bigFive) {
      if (profile.bigFive.openness >= 70) {
        insights.push({
          id: "bigfive-innovation",
          type: "strength",
          title: "Alta Capacidad de Innovación",
          description:
            "Tu alta apertura a experiencias te posiciona bien para roles creativos e innovadores en el mercado chileno.",
          actionable: true,
          priority: "high",
        })
      }

      if (profile.bigFive.conscientiousness >= 75) {
        insights.push({
          id: "bigfive-reliability",
          type: "strength",
          title: "Altamente Confiable",
          description:
            "Tu alta responsabilidad te convierte en un empleado muy valorado. Los empleadores chilenos aprecian enormemente esta cualidad.",
          actionable: false,
          priority: "medium",
        })
      }

      if (profile.bigFive.neuroticism >= 60) {
        insights.push({
          id: "bigfive-stress",
          type: "growth",
          title: "Manejo del Estrés",
          description:
            "Considera desarrollar técnicas de manejo del estrés y resiliencia para mejorar tu bienestar laboral.",
          actionable: true,
          priority: "high",
        })
      }

      if (profile.bigFive.extraversion <= 40) {
        insights.push({
          id: "bigfive-networking",
          type: "development",
          title: "Oportunidad de Networking",
          description:
            "Desarrollar habilidades de networking podría abrir nuevas oportunidades profesionales en Chile.",
          actionable: true,
          priority: "medium",
        })
      }
    }

    // Cross-assessment insights
    if (profile.disc && profile.bigFive) {
      if (profile.disc.primary === "D" && profile.bigFive.conscientiousness >= 70) {
        insights.push({
          id: "cross-executive",
          type: "career",
          title: "Perfil Ejecutivo Ideal",
          description:
            "Tu combinación de liderazgo natural (DISC D) y alta responsabilidad (Big Five) te posiciona para roles ejecutivos senior.",
          actionable: true,
          priority: "high",
        })
      }
    }

    return insights
  }

  const generateBookRecommendations = (profile: PersonalityProfile): BookRecommendation[] => {
    const recommendations: BookRecommendation[] = []

    // DISC-based recommendations
    if (profile.disc) {
      if (profile.disc.primary === "D") {
        recommendations.push({
          id: "leadership-book",
          title: "Los 7 Hábitos de la Gente Altamente Efectiva",
          author: "Stephen R. Covey",
          category: "Liderazgo",
          coverUrl: "/placeholder.svg?height=200&width=150&text=7%20Hábitos",
          relevantTrait: "DISC Dominante",
          reason: "Potencia tus habilidades naturales de liderazgo con principios probados",
          priority: 1,
        })
      }

      if (profile.disc.scores.I >= 60) {
        recommendations.push({
          id: "communication-book",
          title: "Conversaciones Cruciales",
          author: "Kerry Patterson",
          category: "Comunicación",
          coverUrl: "/placeholder.svg?height=200&width=150&text=Conversaciones%20Cruciales",
          relevantTrait: "DISC Influencia",
          reason: "Mejora tu capacidad natural de influencia con técnicas de comunicación avanzada",
          priority: 2,
        })
      }
    }

    // Big Five-based recommendations
    if (profile.bigFive) {
      if (profile.bigFive.neuroticism >= 60) {
        recommendations.push({
          id: "mindfulness-book",
          title: "El Poder del Ahora",
          author: "Eckhart Tolle",
          category: "Bienestar",
          coverUrl: "/placeholder.svg?height=200&width=150&text=Poder%20del%20Ahora",
          relevantTrait: "Manejo del Estrés",
          reason: "Desarrolla técnicas de mindfulness para mejorar tu estabilidad emocional",
          priority: 1,
        })
      }

      if (profile.bigFive.openness >= 70) {
        recommendations.push({
          id: "innovation-book",
          title: "El Innovador",
          author: "Clayton Christensen",
          category: "Innovación",
          coverUrl: "/placeholder.svg?height=200&width=150&text=El%20Innovador",
          relevantTrait: "Alta Apertura",
          reason: "Canaliza tu creatividad natural hacia la innovación empresarial",
          priority: 2,
        })
      }
    }

    return recommendations.sort((a, b) => a.priority - b.priority).slice(0, 4)
  }

  const getPersonalityCompletion = () => {
    let completed = 0
    const total = 4 // DISC, Big Five, MBTI, Enneagram

    if (personalityProfile.disc) completed++
    if (personalityProfile.bigFive) completed++
    if (personalityProfile.mbti) completed++
    if (personalityProfile.enneagram) completed++

    return { completed, total, percentage: Math.round((completed / total) * 100) }
  }

  const renderDISCChart = () => {
    if (!personalityProfile.disc) return null

    const { scores } = personalityProfile.disc
    const maxScore = Math.max(...Object.values(scores))

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-center">Perfil DISC</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(scores).map(([type, score]) => {
            const isHighest = score === maxScore
            return (
              <div key={type} className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    isHighest ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <span className="text-lg font-bold">{type}</span>
                </div>
                <div className="text-sm font-medium">{score}%</div>
                <div className="text-xs text-muted-foreground">
                  {type === "D" && "Dominante"}
                  {type === "I" && "Influyente"}
                  {type === "S" && "Estable"}
                  {type === "C" && "Cumplidor"}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderBigFiveChart = () => {
    if (!personalityProfile.bigFive) return null

    const traits = [
      { key: "openness", name: "Apertura", icon: Brain, color: "bg-purple-500" },
      { key: "conscientiousness", name: "Responsabilidad", icon: Target, color: "bg-blue-500" },
      { key: "extraversion", name: "Extraversión", icon: Users, color: "bg-green-500" },
      { key: "agreeableness", name: "Amabilidad", icon: Heart, color: "bg-pink-500" },
      { key: "neuroticism", name: "Neuroticismo", icon: Shield, color: "bg-red-500" },
    ]

    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-center">Perfil Big Five</h3>
        <div className="space-y-3">
          {traits.map((trait) => {
            const score = personalityProfile.bigFive![trait.key as keyof typeof personalityProfile.bigFive] as number
            const Icon = trait.icon
            return (
              <div key={trait.key} className="flex items-center gap-3">
                <div className={`w-8 h-8 ${trait.color} rounded-full flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{trait.name}</span>
                    <span>{score}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const completion = getPersonalityCompletion()
  const { disc, bigFive } = personalityProfile

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando tu perfil de personalidad...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Personalidad</h1>
            <p className="text-muted-foreground">Tu perfil psicológico completo para el desarrollo profesional</p>
          </div>
        </div>

        {/* Completion Status */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Progreso de Evaluación
              </CardTitle>
              <Badge variant={completion.percentage >= 75 ? "default" : "secondary"}>
                {completion.completed}/{completion.total} Completado
              </Badge>
            </div>
            <Progress value={completion.percentage} className="w-full" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    disc ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Target className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">DISC</div>
                <div className="text-xs text-muted-foreground">{disc ? "Completado" : "Pendiente"}</div>
              </div>
              <div className="text-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    bigFive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <Brain className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">Big Five</div>
                <div className="text-xs text-muted-foreground">{bigFive ? "Completado" : "Pendiente"}</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 bg-gray-100 text-gray-400">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">MBTI</div>
                <div className="text-xs text-muted-foreground">Próximamente</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 bg-gray-100 text-gray-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium">Eneagrama</div>
                <div className="text-xs text-muted-foreground">Próximamente</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="evolution">Evolución</TabsTrigger>
          <TabsTrigger value="integration">Integración</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DISC Chart */}
            {disc && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    DISC Profile
                  </CardTitle>
                  <CardDescription>Completado el {new Date(disc.completedAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderDISCChart()}
                  <div className="mt-4 text-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      Perfil: {disc.primary}
                      {disc.secondary}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Big Five Chart */}
            {bigFive && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Big Five Profile
                  </CardTitle>
                  <CardDescription>Completado el {new Date(bigFive.completedAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>{renderBigFiveChart()}</CardContent>
              </Card>
            )}

            {/* Missing Tests */}
            {!disc && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-muted-foreground" />
                    Test DISC
                  </CardTitle>
                  <CardDescription>Evalúa tu estilo de comunicación y comportamiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Descubre tu perfil DISC para entender mejor cómo te relacionas con otros y trabajas en equipo.
                  </p>
                  <Link href="/disc-test">
                    <Button className="w-full">Realizar Test DISC</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {!bigFive && (
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-muted-foreground" />
                    Test Big Five
                  </CardTitle>
                  <CardDescription>Evaluación científica de personalidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Obtén un análisis profundo de tu personalidad basado en el modelo más respaldado científicamente.
                  </p>
                  <Link href="/big-five-test">
                    <Button className="w-full">Realizar Test Big Five</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card
                key={insight.id}
                className={`border-l-4 ${
                  insight.type === "strength"
                    ? "border-l-green-500"
                    : insight.type === "growth"
                      ? "border-l-orange-500"
                      : insight.type === "career"
                        ? "border-l-blue-500"
                        : "border-l-purple-500"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {insight.type === "strength" && <TrendingUp className="w-5 h-5 text-green-600" />}
                      {insight.type === "growth" && <Target className="w-5 h-5 text-orange-600" />}
                      {insight.type === "career" && <Briefcase className="w-5 h-5 text-blue-600" />}
                      {insight.type === "development" && <Lightbulb className="w-5 h-5 text-purple-600" />}
                      {insight.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          insight.priority === "high"
                            ? "destructive"
                            : insight.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {insight.priority === "high" ? "Alta" : insight.priority === "medium" ? "Media" : "Baja"}
                      </Badge>
                      {insight.actionable && <Badge variant="outline">Accionable</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{insight.description}</p>
                  {insight.actionable && (
                    <div className="mt-4">
                      <Button size="sm" variant="outline">
                        Ver Acciones Recomendadas
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {insights.length === 0 && (
              <Card className="text-center py-8">
                <CardContent>
                  <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay insights disponibles</h3>
                  <p className="text-muted-foreground mb-4">
                    Completa más evaluaciones de personalidad para recibir insights personalizados
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Link href="/disc-test">
                      <Button variant="outline">Test DISC</Button>
                    </Link>
                    <Link href="/big-five-test">
                      <Button variant="outline">Test Big Five</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Book Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Libros Recomendados
              </CardTitle>
              <CardDescription>
                Basado en tu perfil de personalidad, estos libros pueden ayudarte a desarrollarte profesionalmente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookRecommendations.map((book) => (
                  <div key={book.id} className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50">
                    <img
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{book.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">por {book.author}</p>
                      <Badge variant="outline" className="text-xs mb-2">
                        {book.category}
                      </Badge>
                      <p className="text-xs text-gray-600 mb-2">{book.reason}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {book.relevantTrait}
                        </Badge>
                        <Link href={`/library/reader/${book.id}`}>
                          <Button size="sm" variant="outline" className="text-xs bg-transparent">
                            Leer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Coach Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Conversación con tu Coach IA
              </CardTitle>
              <CardDescription>Habla con tu coach personalizado sobre tus resultados de personalidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      ¡Hola! He analizado tu perfil de personalidad y tengo insights específicos para ti.
                      {disc &&
                        ` Veo que tienes un perfil DISC ${disc.primary}, lo cual indica ${
                          disc.primary === "D"
                            ? "liderazgo natural"
                            : disc.primary === "I"
                              ? "habilidades de influencia"
                              : disc.primary === "S"
                                ? "orientación al trabajo en equipo"
                                : "atención al detalle"
                        }.`}
                      ¿Te gustaría explorar cómo aplicar esto en tu carrera?
                    </p>
                  </div>
                </div>
                <Link href="/career-coach">
                  <Button className="w-full">Conversar con Coach IA</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Evolución de tu Personalidad
              </CardTitle>
              <CardDescription>Seguimiento de cambios en tu perfil a lo largo del tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Historial en Desarrollo</h3>
                <p className="text-muted-foreground mb-4">
                  Repite las evaluaciones periódicamente para ver cómo evoluciona tu personalidad
                </p>
                <p className="text-sm text-muted-foreground">
                  Recomendamos repetir las evaluaciones cada 6-12 meses para tracking de desarrollo personal
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <div className="grid gap-6">
            {/* CV Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Integración con tu CV
                </CardTitle>
                <CardDescription>Tu personalidad influye en cómo presentas tu perfil profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disc && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Recomendación para CV - Perfil DISC {disc.primary}</h4>
                      <p className="text-sm text-green-800">
                        {disc.primary === "D" &&
                          "Enfatiza tu capacidad de liderazgo, toma de decisiones y orientación a resultados en tu resumen profesional."}
                        {disc.primary === "I" &&
                          "Destaca tus habilidades de comunicación, trabajo en equipo y capacidad de influencia en otros."}
                        {disc.primary === "S" &&
                          "Resalta tu confiabilidad, capacidad de colaboración y estabilidad en roles de largo plazo."}
                        {disc.primary === "C" &&
                          "Enfatiza tu atención al detalle, análisis riguroso y compromiso con la calidad."}
                      </p>
                    </div>
                  )}

                  {bigFive && bigFive.openness >= 70 && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Recomendación - Alta Apertura</h4>
                      <p className="text-sm text-purple-800">
                        Incluye proyectos innovadores y experiencias creativas. Menciona tu capacidad de adaptación y
                        pensamiento fuera de la caja.
                      </p>
                    </div>
                  )}

                  <Link href="/cv-builder">
                    <Button className="w-full">Actualizar mi CV</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Interview Preparation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Preparación de Entrevistas
                </CardTitle>
                <CardDescription>Simula entrevistas adaptadas a tu perfil de personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Nuestro simulador de entrevistas se adapta a tu personalidad para prepararte mejor:
                  </p>

                  {disc && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">Enfoque de Entrevista - DISC {disc.primary}</h4>
                      <p className="text-sm text-blue-800">
                        {disc.primary === "D" &&
                          "Te haremos preguntas sobre liderazgo, toma de decisiones bajo presión y gestión de resultados."}
                        {disc.primary === "I" &&
                          "Nos enfocaremos en situaciones de trabajo en equipo, comunicación y resolución de conflictos."}
                        {disc.primary === "S" &&
                          "Practicaremos preguntas sobre colaboración, adaptabilidad y manejo de cambios organizacionales."}
                        {disc.primary === "C" &&
                          "Te prepararemos con preguntas técnicas, análisis de casos y situaciones que requieren precisión."}
                      </p>
                    </div>
                  )}

                  <Link href="/interview-simulator">
                    <Button className="w-full">Practicar Entrevistas</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Job Matching */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Matching de Empleos
                </CardTitle>
                <CardDescription>Encuentra trabajos que se alineen con tu personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Nuestro algoritmo considera tu personalidad para recomendar empleos más compatibles
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {disc?.primary === "D" && <Badge variant="outline">Roles de liderazgo</Badge>}
                    {disc?.primary === "I" && <Badge variant="outline">Roles de comunicación</Badge>}
                    {disc?.primary === "S" && <Badge variant="outline">Roles colaborativos</Badge>}
                    {disc?.primary === "C" && <Badge variant="outline">Roles analíticos</Badge>}
                    {bigFive?.openness && bigFive.openness >= 70 && <Badge variant="outline">Roles creativos</Badge>}
                    {bigFive?.conscientiousness && bigFive.conscientiousness >= 70 && (
                      <Badge variant="outline">Roles de responsabilidad</Badge>
                    )}
                  </div>

                  <Link href="/job-search">
                    <Button className="w-full">Buscar Empleos Compatibles</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mt-8">
        <Button onClick={() => window.print()} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Descargar Reporte
        </Button>
        <Link href="/career-coach">
          <Button className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Hablar con Coach IA
          </Button>
        </Link>
      </div>
    </div>
  )
}
