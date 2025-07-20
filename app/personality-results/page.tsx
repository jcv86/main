"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Heart, Zap, Shield, Eye, TrendingUp, Users, Target, Download, Share2, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

interface AIAnalysis {
  analysis: string
  loading: boolean
}

// Custom Radar Chart Component for Personality
const PersonalityRadarChart = ({ data }: { data: any[] }) => {
  const size = 300
  const center = size / 2
  const maxRadius = 100
  const levels = 5

  const angleStep = (2 * Math.PI) / data.length

  const getPointPosition = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2
    const radius = (value / 100) * maxRadius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }

  const getLabelPosition = (index: number) => {
    const angle = angleStep * index - Math.PI / 2
    const radius = maxRadius + 25
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="border rounded-lg bg-white">
        {/* Grid circles */}
        {Array.from({ length: levels }, (_, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(maxRadius / levels) * (i + 1)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Grid lines */}
        {data.map((_, index) => {
          const pos = getPointPosition(index, 100)
          return <line key={index} x1={center} y1={center} x2={pos.x} y2={pos.y} stroke="#e5e7eb" strokeWidth="1" />
        })}

        {/* Data polygon */}
        <polygon
          points={data
            .map((item, index) => {
              const pos = getPointPosition(index, item.score)
              return `${pos.x},${pos.y}`
            })
            .join(" ")}
          fill="#8B5CF6"
          fillOpacity="0.3"
          stroke="#8B5CF6"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((item, index) => {
          const pos = getPointPosition(index, item.score)
          return <circle key={index} cx={pos.x} cy={pos.y} r="4" fill="#8B5CF6" stroke="white" strokeWidth="2" />
        })}

        {/* Labels */}
        {data.map((item, index) => {
          const pos = getLabelPosition(index)
          return (
            <text
              key={index}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-medium fill-gray-700"
            >
              {item.name}
            </text>
          )
        })}

        {/* Center label */}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-sm font-bold fill-gray-900"
        >
          Personality
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        {data.map((item, index) => (
          <div key={item.name} className="p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-2xl font-bold text-purple-600">{item.score}%</div>
            <div className="text-sm text-gray-600">{getScoreLevel(item.score).level}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const getScoreLevel = (score: number) => {
  if (score >= 70) return { level: "Alto", color: "text-green-600" }
  if (score >= 40) return { level: "Medio", color: "text-yellow-600" }
  return { level: "Bajo", color: "text-red-600" }
}

export default function PersonalityResultsPage() {
  const [results, setResults] = useState<PersonalityResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({ analysis: "", loading: false })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

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
      generateAIAnalysis(mockResults)
      setLoading(false)
    }, 1000)
  }, [])

  const generateAIAnalysis = async (personalityResults: PersonalityResult) => {
    setAiAnalysis({ analysis: "", loading: true })

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "personality_analysis",
          model: "gpt-4",
          data: personalityResults,
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

  const downloadResults = () => {
    if (!results) return

    const resultsText = `
PERSONALITY ASSESSMENT RESULTS
==============================

Test Type: ${results.test_type}
Generated on: ${new Date().toLocaleDateString()}

PERSONALITY TRAITS:
${Object.entries(results.traits)
  .map(([trait, score]) => {
    const traitInfo = getTraitInfo(trait)
    return `${traitInfo.name}: ${score}%`
  })
  .join("\n")}

SUMMARY:
${results.summary}

STRENGTHS:
${results.strengths.map((strength) => `- ${strength}`).join("\n")}

CHALLENGES:
${results.challenges.map((challenge) => `- ${challenge}`).join("\n")}

CAREER RECOMMENDATIONS:
${results.career_recommendations.map((rec) => `- ${rec}`).join("\n")}

WORK STYLE:
${results.work_style}

COMMUNICATION STYLE:
${results.communication_style}

AI ANALYSIS (GPT-4):
${aiAnalysis.analysis}
    `

    const blob = new Blob([resultsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `personality-results-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Results Downloaded",
      description: "Your personality assessment results have been downloaded.",
    })
  }

  const printResults = () => {
    window.print()
  }

  const shareResults = async () => {
    if (!results) return

    const topTraits = Object.entries(results.traits)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([trait]) => getTraitInfo(trait).name)

    const shareText = `I just completed a comprehensive personality assessment! 🧠

Top Traits: ${topTraits.join(", ")}
Test: ${results.test_type}

Discover your personality profile: ${window.location.origin}/personality-test`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Personality Assessment Results",
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

  const radarData = Object.entries(results.traits).map(([trait, score]) => ({
    name: getTraitInfo(trait).name,
    score: score,
  }))

  return (
    <div className="container mx-auto p-6 max-w-6xl print:bg-white">
      {/* Header */}
      <div className="mb-8 print:mb-6">
        <div className="flex justify-between items-start mb-4 print:block">
          <div>
            <h1 className="text-3xl font-bold mb-2 print:text-2xl">Análisis de Personalidad</h1>
            <p className="text-muted-foreground print:text-sm">Resultados basados en el modelo de los Cinco Grandes</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={shareResults}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm" onClick={downloadResults}>
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
            <Button variant="outline" size="sm" onClick={printResults}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </div>
        </div>

        <Badge variant="secondary" className="text-lg px-4 py-2 print:bg-white print:text-black print:border">
          Evaluación: {results.test_type}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 print:hidden">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
          <TabsTrigger value="traits">Rasgos</TabsTrigger>
          <TabsTrigger value="strengths">Fortalezas</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 print:block">
          {/* Summary Card */}
          <Card className="print:break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 print:text-black" />
                Tu Perfil de Personalidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed mb-6">{results.summary}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Estilo de Trabajo</h3>
                  <p className="text-muted-foreground print:text-black">{results.work_style}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Estilo de Comunicación</h3>
                  <p className="text-muted-foreground print:text-black">{results.communication_style}</p>
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
                <Card key={trait} className="text-center print:break-inside-avoid">
                  <CardContent className="pt-6">
                    <div
                      className={`w-12 h-12 ${traitInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 print:bg-white print:border`}
                    >
                      <Icon className={`w-6 h-6 ${traitInfo.color} print:text-black`} />
                    </div>
                    <h3 className="font-semibold mb-1">{traitInfo.name}</h3>
                    <div className="text-2xl font-bold mb-2">{score}%</div>
                    <div className={`text-sm ${scoreLevel.color} print:text-black`}>{scoreLevel.level}</div>
                    <Progress value={score} className="h-2 mt-2 print:hidden" />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="radar" className="space-y-6 print:block">
          <Card className="print:break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600 print:text-black" />
                Análisis Radar de Personalidad
              </CardTitle>
              <CardDescription>
                Vista integral de tus rasgos de personalidad según el modelo de los Cinco Grandes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalityRadarChart data={radarData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6 print:block">
          <div className="space-y-6">
            {Object.entries(results.traits).map(([trait, score]) => {
              const traitInfo = getTraitInfo(trait)
              const scoreLevel = getScoreLevel(score)
              const Icon = traitInfo.icon
              return (
                <Card key={trait} className="print:break-inside-avoid">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 ${traitInfo.bgColor} rounded-full flex items-center justify-center flex-shrink-0 print:bg-white print:border`}
                      >
                        <Icon className={`w-6 h-6 ${traitInfo.color} print:text-black`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-semibold">{traitInfo.name}</h3>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{score}%</div>
                            <div className={`text-sm ${scoreLevel.color} print:text-black`}>{scoreLevel.level}</div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-4 print:text-black">{traitInfo.description}</p>
                        <Progress value={score} className="h-3 print:hidden" />

                        <div className="mt-4 p-4 bg-muted/50 rounded-lg print:bg-white print:border">
                          <h4 className="font-medium mb-2">Interpretación:</h4>
                          <p className="text-sm">
                            {score >= 70 &&
                              `Tu puntuación alta en ${traitInfo.name.toLowerCase()} indica que tienes una fuerte tendencia hacia este rasgo, lo que se manifiesta en tu comportamiento diario y decisiones profesionales.`}
                            {score >= 40 &&
                              score < 70 &&
                              `Tu puntuación moderada en ${traitInfo.name.toLowerCase()} sugiere un equilibrio en este aspecto, adaptándote según las situaciones.`}
                            {score < 40 &&
                              `Tu puntuación baja en ${traitInfo.name.toLowerCase()} muestra que este rasgo es menos dominante en tu personalidad, lo que puede ser una ventaja en ciertos contextos.`}
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

        <TabsContent value="strengths" className="space-y-6 print:block">
          <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1">
            <Card className="print:break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-green-600 print:text-black">Fortalezas Principales</CardTitle>
                <CardDescription>Aspectos que te destacan y puedes potenciar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 print:text-black" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="print:break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-orange-600 print:text-black">Áreas de Desarrollo</CardTitle>
                <CardDescription>Aspectos en los que puedes trabajar para crecer</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.challenges.map((challenge, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0 print:text-black" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="print:break-inside-avoid">
            <CardHeader>
              <CardTitle>Recomendaciones de Carrera</CardTitle>
              <CardDescription>Roles y ambientes de trabajo que se alinean con tu personalidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1">
                <div>
                  <h3 className="font-semibold mb-4">Tipos de Roles Ideales:</h3>
                  <ul className="space-y-2">
                    {results.career_recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0 print:text-black" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Ambientes de Trabajo Preferidos:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-green-500 mt-1 flex-shrink-0 print:text-black" />
                      <span>Equipos colaborativos y dinámicos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0 print:text-black" />
                      <span>Proyectos que requieren creatividad</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0 print:text-black" />
                      <span>Oportunidades de crecimiento y aprendizaje</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-red-500 mt-1 flex-shrink-0 print:text-black" />
                      <span>Objetivos claros y medibles</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6 print:block">
          <Card className="print:break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600 print:text-black" />
                Análisis AI con GPT-4
              </CardTitle>
              <CardDescription>Insights personalizados generados por inteligencia artificial</CardDescription>
            </CardHeader>
            <CardContent>
              {aiAnalysis.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Generando análisis con GPT-4...</span>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{aiAnalysis.analysis}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
