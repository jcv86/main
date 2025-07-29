"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import {
  Brain,
  Download,
  Share2,
  MessageSquare,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Star,
  Lightbulb,
  Award,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface PersonalityResults {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
  overallScore: number
}

interface Recommendation {
  id: string
  type: "book" | "course" | "skill" | "career"
  title: string
  description: string
  reason: string
  priority: 1 | 2 | 3
  itemId?: string
}

export default function PersonalityCoachResultsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [results, setResults] = useState<PersonalityResults | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<string>("")
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadResults()
  }, [user, router])

  const loadResults = () => {
    try {
      const savedResults = localStorage.getItem("personalityCoachResults")
      if (savedResults) {
        const data = JSON.parse(savedResults)
        setResults(data.results)
        setAiAnalysis(data.aiAnalysis || "")
        setRecommendations(data.recommendations || [])
      } else {
        router.push("/personality-coach-test")
      }
    } catch (error) {
      console.error("Error loading results:", error)
      toast.error("Error al cargar los resultados")
      router.push("/personality-coach-test")
    } finally {
      setLoading(false)
    }
  }

  const handleStartCoachConversation = () => {
    // Navigate to coach with personality context
    router.push("/career-coach?context=personality_results")
  }

  const handleViewRecommendation = (recommendation: Recommendation) => {
    if (recommendation.type === "book" && recommendation.itemId) {
      router.push(`/library/reader/${recommendation.itemId}`)
    } else if (recommendation.type === "course") {
      // Open Coursera or external course link
      window.open(`https://www.coursera.org/search?query=${encodeURIComponent(recommendation.title)}`, "_blank")
    } else if (recommendation.type === "career") {
      router.push("/job-search")
    } else if (recommendation.type === "skill") {
      router.push("/skills-assessment")
    }
  }

  const getTraitLevel = (score: number): string => {
    if (score >= 70) return "Alto"
    if (score >= 30) return "Moderado"
    return "Bajo"
  }

  const getTraitColor = (score: number): string => {
    if (score >= 70) return "text-green-600"
    if (score >= 30) return "text-blue-600"
    return "text-orange-600"
  }

  const getTraitDescription = (trait: string, score: number): string => {
    const descriptions = {
      openness: {
        high: "Eres altamente creativo, curioso y abierto a nuevas experiencias. Te adaptas bien a los cambios y disfrutas explorando ideas innovadoras.",
        medium:
          "Tienes un equilibrio saludable entre apertura a lo nuevo y preferencia por lo familiar. Puedes adaptarte cuando es necesario.",
        low: "Prefieres la estabilidad y los métodos probados. Valoras la tradición y te sientes cómodo con rutinas establecidas.",
      },
      conscientiousness: {
        high: "Eres muy organizado, disciplinado y orientado a objetivos. Cumples compromisos y planificas cuidadosamente.",
        medium:
          "Tienes un buen equilibrio entre organización y flexibilidad. Puedes ser estructurado cuando es necesario.",
        low: "Eres más flexible y espontáneo. Prefieres adaptarte sobre la marcha y puedes ser más creativo en la resolución de problemas.",
      },
      extraversion: {
        high: "Te energizas con la interacción social y te sientes cómodo liderando. Disfrutas del networking y trabajar en equipo.",
        medium:
          "Tienes un equilibrio entre sociabilidad e independencia. Puedes trabajar bien tanto en equipo como solo.",
        low: "Prefieres trabajar de forma independiente y reflexionar antes de actuar. Te concentras bien en tareas que requieren análisis profundo.",
      },
      agreeableness: {
        high: "Eres cooperativo, empático y orientado hacia otros. Valoras la armonía y buscas el consenso en las decisiones.",
        medium:
          "Tienes un equilibrio entre cooperación y asertividad. Puedes colaborar efectivamente mientras defiendes tus ideas.",
        low: "Eres más directo y competitivo. Priorizas la eficiencia sobre la armonía y no temes tomar decisiones difíciles.",
      },
      neuroticism: {
        high: "Tiendes a experimentar emociones intensas y puedes ser más sensible al estrés. También puedes tener mayor empatía y conciencia de riesgos.",
        medium:
          "Tienes una estabilidad emocional adecuada. Puedes manejar la mayoría de situaciones con calma y profesionalismo.",
        low: "Mantienes la calma bajo presión y tienes excelente estabilidad emocional. Te adaptas bien a los cambios y manejas el estrés efectivamente.",
      },
    }

    const level = score >= 70 ? "high" : score >= 30 ? "medium" : "low"
    return descriptions[trait as keyof typeof descriptions]?.[level] || "Descripción no disponible"
  }

  const traitNames = {
    openness: "Apertura",
    conscientiousness: "Responsabilidad",
    extraversion: "Extraversión",
    agreeableness: "Amabilidad",
    neuroticism: "Neuroticismo",
  }

  const traitIcons = {
    openness: Brain,
    conscientiousness: Target,
    extraversion: Users,
    agreeableness: Users,
    neuroticism: TrendingUp,
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Cargando tus resultados de personalidad...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <p>No se encontraron resultados. Por favor, realiza la evaluación primero.</p>
          <Button onClick={() => router.push("/personality-coach-test")} className="mt-4">
            Realizar Evaluación
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Análisis de Personalidad con IA</h1>
            <p className="text-muted-foreground">Resultados de tu conversación personalizada</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleStartCoachConversation} className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Conversar con tu Coach IA
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Descargar Informe
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Compartir Resultados
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analysis">Análisis IA</TabsTrigger>
          <TabsTrigger value="traits">Rasgos</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="development">Desarrollo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Tu Perfil de Personalidad
              </CardTitle>
              <CardDescription>
                Puntuación general basada en el modelo Big Five y análisis conversacional con IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-6xl font-bold text-purple-600 mb-2">{results.overallScore}%</div>
                <p className="text-lg text-muted-foreground">Puntuación General de Personalidad</p>
                <Badge variant="secondary" className="mt-2">
                  Evaluación Conversacional con IA
                </Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(results)
                  .filter(([key]) => key !== "overallScore")
                  .map(([trait, score]) => {
                    const TraitIcon = traitIcons[trait as keyof typeof traitIcons]
                    return (
                      <div key={trait} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TraitIcon className="w-5 h-5 text-purple-600" />
                            <span className="font-medium">{traitNames[trait as keyof typeof traitNames]}</span>
                          </div>
                          <Badge variant="outline" className={getTraitColor(score as number)}>
                            {getTraitLevel(score as number)}
                          </Badge>
                        </div>
                        <Progress value={score as number} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>0%</span>
                          <span className="font-medium">{score}%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Insights */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  Fortalezas Principales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.entries(results)
                    .filter(([key, score]) => key !== "overallScore" && (score as number) >= 70)
                    .map(([trait, score]) => (
                      <li key={trait} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>
                          {traitNames[trait as keyof typeof traitNames]} ({score}%)
                        </span>
                      </li>
                    ))}
                  {Object.entries(results).filter(([key, score]) => key !== "overallScore" && (score as number) >= 70)
                    .length === 0 && (
                    <li className="text-muted-foreground">Perfil equilibrado sin rasgos dominantes</li>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Target className="w-5 h-5" />
                  Áreas de Desarrollo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {Object.entries(results)
                    .filter(([key, score]) => key !== "overallScore" && (score as number) < 50)
                    .map(([trait, score]) => (
                      <li key={trait} className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span>
                          {traitNames[trait as keyof typeof traitNames]} ({score}%)
                        </span>
                      </li>
                    ))}
                  {Object.entries(results).filter(([key, score]) => key !== "overallScore" && (score as number) < 50)
                    .length === 0 && (
                    <li className="text-muted-foreground">No se identificaron áreas críticas de desarrollo</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Análisis Personalizado con IA
              </CardTitle>
              <CardDescription>
                Análisis profundo generado por inteligencia artificial basado en tu conversación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiAnalysis ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{aiAnalysis}</div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>El análisis con IA se está generando...</p>
                  <p className="text-sm">Esto puede tomar unos momentos.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6">
          {Object.entries(results)
            .filter(([key]) => key !== "overallScore")
            .map(([trait, score]) => {
              const TraitIcon = traitIcons[trait as keyof typeof traitIcons]
              return (
                <Card key={trait}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <TraitIcon className="w-5 h-5" />
                        {traitNames[trait as keyof typeof traitNames]}
                      </CardTitle>
                      <Badge variant="outline" className={getTraitColor(score as number)}>
                        {score}% - {getTraitLevel(score as number)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Progress value={score as number} className="h-3" />
                      <p className="text-gray-700 leading-relaxed">{getTraitDescription(trait, score as number)}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {["book", "skill", "career", "course"].map((type) => {
                const typeRecommendations = recommendations.filter((r) => r.type === type)
                if (typeRecommendations.length === 0) return null

                const typeInfo = {
                  book: { title: "Libros Recomendados", icon: BookOpen, color: "text-blue-600" },
                  skill: { title: "Habilidades a Desarrollar", icon: Award, color: "text-green-600" },
                  career: { title: "Oportunidades de Carrera", icon: Briefcase, color: "text-purple-600" },
                  course: { title: "Cursos Sugeridos", icon: ExternalLink, color: "text-orange-600" },
                }

                const info = typeInfo[type as keyof typeof typeInfo]
                const Icon = info.icon

                return (
                  <Card key={type}>
                    <CardHeader>
                      <CardTitle className={`flex items-center gap-2 ${info.color}`}>
                        <Icon className="w-5 h-5" />
                        {info.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {typeRecommendations.map((rec) => (
                          <div key={rec.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold">{rec.title}</h3>
                              <Badge variant={rec.priority === 1 ? "default" : "secondary"}>
                                {rec.priority === 1 ? "Alta" : rec.priority === 2 ? "Media" : "Baja"} Prioridad
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{rec.description}</p>
                            <p className="text-sm text-muted-foreground mb-3">
                              <strong>Por qué:</strong> {rec.reason}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewRecommendation(rec)}
                              className="flex items-center gap-2 bg-transparent"
                            >
                              <ArrowRight className="w-3 h-3" />
                              {rec.type === "book"
                                ? "Leer ahora"
                                : rec.type === "course"
                                  ? "Ver curso"
                                  : rec.type === "career"
                                    ? "Explorar oportunidades"
                                    : "Ver más"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Las recomendaciones personalizadas se están generando...</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Plan de Desarrollo Personalizado
              </CardTitle>
              <CardDescription>Estrategias específicas para potenciar tu perfil profesional en Chile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Immediate Actions */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Acciones Inmediatas (Próximas 2 semanas)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Conversa con tu Coach IA sobre cómo aplicar estos insights en tu búsqueda laboral actual
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Actualiza tu CV destacando las fortalezas identificadas en tu personalidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Comienza a leer uno de los libros recomendados específicamente para tu perfil</span>
                  </li>
                </ul>
              </div>

              {/* Medium-term Goals */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  Objetivos a Mediano Plazo (Próximos 3 meses)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Desarrolla las habilidades específicas recomendadas para tu perfil de personalidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Participa en eventos de networking alineados con tu estilo de personalidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Busca oportunidades laborales en las empresas y roles recomendados</span>
                  </li>
                </ul>
              </div>

              {/* Long-term Vision */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Visión a Largo Plazo (Próximos 12 meses)
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>
                      Establécete como un profesional reconocido en tu área, aprovechando tus fortalezas naturales
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Desarrolla un liderazgo auténtico basado en tu perfil de personalidad único</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Considera roles de mayor responsabilidad que se alineen con tu personalidad</span>
                  </li>
                </ul>
              </div>

              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recuerda:</strong> Tu Coach IA ahora conoce tu perfil de personalidad y puede darte consejos
                  personalizados en cada conversación. ¡Aprovecha esta ventaja para acelerar tu desarrollo profesional!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
