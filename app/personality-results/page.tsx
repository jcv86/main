"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Heart, Zap, Shield, Eye, TrendingUp, Users, Target, Download, Share2 } from "lucide-react"

interface PersonalityResult {
  test_type: string
  traits: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  summary: string
  strengths: string[]
  challenges: string[]
  career_recommendations: string[]
  work_style: string
  communication_style: string
}

export default function PersonalityResultsPage() {
  const [results, setResults] = useState<PersonalityResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockResults: PersonalityResult = {
      test_type: "Big Five",
      traits: {
        openness: 78,
        conscientiousness: 85,
        extraversion: 72,
        agreeableness: 65,
        neuroticism: 32,
      },
      summary:
        "Tu perfil muestra una personalidad equilibrada con alta consciencia y apertura a nuevas experiencias. Eres una persona organizada, creativa y sociable, con buena estabilidad emocional.",
      strengths: [
        "Alta creatividad e innovación",
        "Excelente organización y planificación",
        "Habilidades sociales desarrolladas",
        "Estabilidad emocional",
        "Adaptabilidad al cambio",
        "Orientación al logro",
      ],
      challenges: [
        "Puede ser demasiado crítico consigo mismo",
        "Tendencia a sobreanalizar situaciones",
        "Necesita equilibrar perfeccionismo",
        "Puede ser impaciente con procesos lentos",
      ],
      career_recommendations: [
        "Roles de liderazgo e innovación",
        "Posiciones que requieren creatividad",
        "Trabajos con interacción social",
        "Proyectos complejos y desafiantes",
        "Ambientes dinámicos y cambiantes",
      ],
      work_style: "Colaborativo y orientado a objetivos, con preferencia por ambientes estructurados pero flexibles.",
      communication_style: "Directo pero empático, con habilidad para adaptar el mensaje según la audiencia.",
    }

    setTimeout(() => {
      setResults(mockResults)
      setLoading(false)
    }, 1000)
  }, [])

  const getTraitInfo = (trait: string) => {
    const traits = {
      openness: {
        name: "Apertura",
        icon: Eye,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        description: "Creatividad, curiosidad intelectual, apertura a nuevas experiencias",
      },
      conscientiousness: {
        name: "Responsabilidad",
        icon: Target,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        description: "Organización, disciplina, orientación al logro",
      },
      extraversion: {
        name: "Extraversión",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-100",
        description: "Sociabilidad, asertividad, búsqueda de estimulación",
      },
      agreeableness: {
        name: "Amabilidad",
        icon: Heart,
        color: "text-pink-600",
        bgColor: "bg-pink-100",
        description: "Cooperación, confianza, empatía",
      },
      neuroticism: {
        name: "Neuroticismo",
        icon: Zap,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        description: "Estabilidad emocional, manejo del estrés",
      },
    }
    return traits[trait as keyof typeof traits]
  }

  const getScoreLevel = (score: number) => {
    if (score >= 70) return { level: "Alto", color: "text-green-600" }
    if (score >= 40) return { level: "Medio", color: "text-yellow-600" }
    return { level: "Bajo", color: "text-red-600" }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analizando tu personalidad...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p>No se encontraron resultados. Por favor, completa la evaluación de personalidad primero.</p>
          <Button className="mt-4">Realizar Evaluación</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Análisis de Personalidad</h1>
            <p className="text-muted-foreground">Resultados basados en el modelo de los Cinco Grandes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>

        <Badge variant="secondary" className="text-lg px-4 py-2">
          Evaluación: {results.test_type}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="traits">Rasgos</TabsTrigger>
          <TabsTrigger value="strengths">Fortalezas</TabsTrigger>
          <TabsTrigger value="career">Carrera</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Tu Perfil de Personalidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed mb-6">{results.summary}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Estilo de Trabajo</h3>
                  <p className="text-muted-foreground">{results.work_style}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Estilo de Comunicación</h3>
                  <p className="text-muted-foreground">{results.communication_style}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Traits Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(results.traits).map(([trait, score]) => {
              const traitInfo = getTraitInfo(trait)
              const scoreLevel = getScoreLevel(score)
              const Icon = traitInfo.icon
              return (
                <Card key={trait} className="text-center">
                  <CardContent className="pt-6">
                    <div
                      className={`w-12 h-12 ${traitInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-3`}
                    >
                      <Icon className={`w-6 h-6 ${traitInfo.color}`} />
                    </div>
                    <h3 className="font-semibold mb-1">{traitInfo.name}</h3>
                    <div className="text-2xl font-bold mb-2">{score}%</div>
                    <div className={`text-sm ${scoreLevel.color}`}>{scoreLevel.level}</div>
                    <Progress value={score} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6">
          <div className="space-y-6">
            {Object.entries(results.traits).map(([trait, score]) => {
              const traitInfo = getTraitInfo(trait)
              const scoreLevel = getScoreLevel(score)
              const Icon = traitInfo.icon
              return (
                <Card key={trait}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 ${traitInfo.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-6 h-6 ${traitInfo.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold">{traitInfo.name}</h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{score}%</div>
                            <div className={`text-sm ${scoreLevel.color}`}>{scoreLevel.level}</div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4">{traitInfo.description}</p>
                        <Progress value={score} className="h-3" />

                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">Interpretación:</h4>
                          <p className="text-sm">
                            {score >= 70 && `Tu puntuación alta en ${traitInfo.name.toLowerCase()} indica que...`}
                            {score >= 40 &&
                              score < 70 &&
                              `Tu puntuación moderada en ${traitInfo.name.toLowerCase()} sugiere que...`}
                            {score < 40 && `Tu puntuación baja en ${traitInfo.name.toLowerCase()} muestra que...`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="strengths" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">Fortalezas Principales</CardTitle>
                <CardDescription>Aspectos que te destacan y puedes potenciar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">Áreas de Desarrollo</CardTitle>
                <CardDescription>Aspectos en los que puedes trabajar para crecer</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Plan de Desarrollo Personal</CardTitle>
              <CardDescription>Recomendaciones específicas basadas en tu perfil</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Desarrollo a Corto Plazo (1-3 meses):</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Identifica situaciones donde puedas aplicar tus fortalezas principales</li>
                    <li>• Practica técnicas de mindfulness para mejorar la autoconciencia</li>
                    <li>• Busca feedback regular de colegas y supervisores</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Desarrollo a Largo Plazo (6-12 meses):</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Toma cursos o talleres relacionados con tus áreas de desarrollo</li>
                    <li>• Busca un mentor que complemente tu perfil de personalidad</li>
                    <li>• Participa en proyectos que desafíen tus zonas de confort</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Carrera</CardTitle>
              <CardDescription>Roles y ambientes de trabajo que se alinean con tu personalidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Tipos de Roles Ideales:</h3>
                  <ul className="space-y-2">
                    {results.career_recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Ambientes de Trabajo Preferidos:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Equipos colaborativos y dinámicos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                      <span>Proyectos que requieren creatividad</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <span>Oportunidades de crecimiento y aprendizaje</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                      <span>Objetivos claros y medibles</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compatibilidad con Equipos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-green-800">Trabajas mejor con:</h4>
                  <p className="text-sm text-green-700">
                    Personas organizadas y orientadas a objetivos, equipos que valoran la innovación y la colaboración
                    abierta.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-800">Puede requerir adaptación:</h4>
                  <p className="text-sm text-yellow-700">
                    Ambientes muy rígidos o con poca autonomía, equipos que evitan el cambio o la experimentación.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
