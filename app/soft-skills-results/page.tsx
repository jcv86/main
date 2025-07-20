"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  MessageCircle,
  Lightbulb,
  Target,
  Heart,
  Zap,
  Download,
  Share2,
  Printer,
  Brain,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SoftSkillsResult {
  overall_score: number
  skill_categories: {
    [key: string]: {
      score: number
      description: string
      skills: {
        name: string
        level: number
        feedback: string
      }[]
    }
  }
  strengths: string[]
  improvement_areas: string[]
  recommendations: string[]
  leadership_potential: string
  team_fit: string
  action_plan: string[]
}

interface AIAnalysis {
  analysis: string
  loading: boolean
}

// Custom Radar Chart Component for Soft Skills
const SoftSkillsRadarChart = ({ data }: { data: any[] }) => {
  const size = 350
  const center = size / 2
  const maxRadius = 120
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
    const radius = maxRadius + 30
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
          fill="#10B981"
          fillOpacity="0.3"
          stroke="#10B981"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((item, index) => {
          const pos = getPointPosition(index, item.score)
          return <circle key={index} cx={pos.x} cy={pos.y} r="5" fill="#10B981" stroke="white" strokeWidth="2" />
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
          Soft Skills
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        {data.map((item, index) => (
          <div key={item.name} className="p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-2xl font-bold text-green-600">{item.score}%</div>
            <div className="text-sm text-gray-600">{getSkillLevel(item.score).level}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const getSkillLevel = (score: number) => {
  if (score >= 80) return { level: "Excelente", color: "text-green-600", bgColor: "bg-green-100" }
  if (score >= 60) return { level: "Bueno", color: "text-blue-600", bgColor: "bg-blue-100" }
  if (score >= 40) return { level: "Regular", color: "text-yellow-600", bgColor: "bg-yellow-100" }
  return { level: "Necesita Mejora", color: "text-red-600", bgColor: "bg-red-100" }
}

const getCategoryIcon = (category: string) => {
  const icons = {
    Comunicación: MessageCircle,
    Liderazgo: Target,
    "Trabajo en Equipo": Users,
    Creatividad: Lightbulb,
    "Inteligencia Emocional": Heart,
    Adaptabilidad: Zap,
  }
  return icons[category as keyof typeof icons] || Users
}

export default function SoftSkillsResultsPage() {
  const [results, setResults] = useState<SoftSkillsResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({ analysis: "", loading: false })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockResults: SoftSkillsResult = {
      overall_score: 78,
      skill_categories: {
        Comunicación: {
          score: 85,
          description: "Habilidad para transmitir ideas de manera clara y efectiva",
          skills: [
            { name: "Comunicación Verbal", level: 88, feedback: "Excelente claridad al expresar ideas" },
            { name: "Escucha Activa", level: 82, feedback: "Demuestra atención genuina a los demás" },
            { name: "Comunicación Escrita", level: 85, feedback: "Redacción clara y profesional" },
            { name: "Presentaciones", level: 80, feedback: "Confianza al hablar en público" },
          ],
        },
        Liderazgo: {
          score: 72,
          description: "Capacidad para guiar, motivar e inspirar a otros",
          skills: [
            { name: "Toma de Decisiones", level: 75, feedback: "Decisiones bien fundamentadas" },
            { name: "Delegación", level: 68, feedback: "Puede mejorar la confianza en el equipo" },
            { name: "Motivación de Equipos", level: 74, feedback: "Inspira a otros con su ejemplo" },
            { name: "Visión Estratégica", level: 70, feedback: "Buen entendimiento del panorama general" },
          ],
        },
        "Trabajo en Equipo": {
          score: 82,
          description: "Habilidad para colaborar efectivamente con otros",
          skills: [
            { name: "Colaboración", level: 85, feedback: "Excelente trabajando con otros" },
            { name: "Resolución de Conflictos", level: 78, feedback: "Maneja bien las diferencias" },
            { name: "Apoyo a Compañeros", level: 84, feedback: "Siempre dispuesto a ayudar" },
            { name: "Construcción de Consenso", level: 80, feedback: "Facilita acuerdos grupales" },
          ],
        },
        Creatividad: {
          score: 75,
          description: "Capacidad para generar ideas innovadoras y soluciones originales",
          skills: [
            { name: "Pensamiento Innovador", level: 78, feedback: "Propone soluciones creativas" },
            { name: "Resolución de Problemas", level: 76, feedback: "Enfoque original a los desafíos" },
            { name: "Brainstorming", level: 74, feedback: "Contribuye con ideas valiosas" },
            { name: "Pensamiento Lateral", level: 72, feedback: "Ve conexiones no obvias" },
          ],
        },
        "Inteligencia Emocional": {
          score: 80,
          description: "Habilidad para reconocer y manejar emociones propias y ajenas",
          skills: [
            { name: "Autoconciencia", level: 82, feedback: "Buen conocimiento de sí mismo" },
            { name: "Autorregulación", level: 78, feedback: "Maneja bien el estrés" },
            { name: "Empatía", level: 83, feedback: "Comprende las emociones de otros" },
            { name: "Habilidades Sociales", level: 77, feedback: "Interacciones positivas" },
          ],
        },
        Adaptabilidad: {
          score: 70,
          description: "Capacidad para ajustarse a cambios y nuevas situaciones",
          skills: [
            { name: "Flexibilidad", level: 72, feedback: "Se adapta a cambios menores" },
            { name: "Aprendizaje Continuo", level: 75, feedback: "Busca nuevos conocimientos" },
            { name: "Resiliencia", level: 68, feedback: "Puede mejorar la recuperación ante adversidades" },
            { name: "Gestión del Cambio", level: 65, feedback: "Necesita más confianza en transiciones" },
          ],
        },
      },
      strengths: [
        "Excelentes habilidades de comunicación",
        "Fuerte capacidad de trabajo en equipo",
        "Alta inteligencia emocional",
        "Creatividad para resolver problemas",
        "Empatía y comprensión hacia otros",
        "Liderazgo natural emergente",
      ],
      improvement_areas: [
        "Desarrollar mayor confianza en liderazgo",
        "Mejorar habilidades de delegación",
        "Fortalecer la resiliencia ante cambios",
        "Aumentar la flexibilidad en situaciones nuevas",
        "Desarrollar más visión estratégica",
        "Mejorar la gestión del cambio",
      ],
      recommendations: [
        "Buscar oportunidades de liderazgo en proyectos pequeños",
        "Practicar técnicas de delegación efectiva",
        "Tomar cursos de gestión del cambio",
        "Desarrollar un plan de crecimiento personal",
        "Buscar mentoría en liderazgo",
        "Participar en actividades que desafíen la zona de confort",
      ],
      leadership_potential: "Alto potencial de liderazgo con necesidad de desarrollo en confianza y delegación",
      team_fit: "Excelente miembro de equipo, contribuye positivamente al ambiente laboral",
      action_plan: [
        "Semana 1-2: Identificar oportunidades de liderazgo en proyectos actuales",
        "Semana 3-4: Practicar delegación de tareas menores",
        "Mes 2: Inscribirse en curso de liderazgo o gestión",
        "Mes 3: Buscar feedback regular de supervisores y colegas",
        "Mes 4-6: Aplicar nuevas habilidades en proyectos más grandes",
      ],
    }

    setTimeout(() => {
      setResults(mockResults)
      generateAIAnalysis(mockResults)
      setLoading(false)
    }, 1000)
  }, [])

  const generateAIAnalysis = async (skillsResults: SoftSkillsResult) => {
    setAiAnalysis({ analysis: "", loading: true })

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "soft_skills_analysis",
          model: "gpt-4", // Explicitly use GPT-4
          data: skillsResults,
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

  const downloadResults = () => {
    if (!results) return

    const resultsText = `
SOFT SKILLS ASSESSMENT RESULTS
==============================

Overall Score: ${results.overall_score}%
Leadership Potential: ${results.leadership_potential}
Team Fit: ${results.team_fit}
Generated on: ${new Date().toLocaleDateString()}

SKILL CATEGORIES:
${Object.entries(results.skill_categories)
  .map(
    ([category, data]) => `
${category}: ${data.score}%
${data.description}
${data.skills.map((skill) => `  - ${skill.name}: ${skill.level}% - ${skill.feedback}`).join("\n")}
`,
  )
  .join("\n")}

STRENGTHS:
${results.strengths.map((strength) => `- ${strength}`).join("\n")}

IMPROVEMENT AREAS:
${results.improvement_areas.map((area) => `- ${area}`).join("\n")}

RECOMMENDATIONS:
${results.recommendations.map((rec) => `- ${rec}`).join("\n")}

ACTION PLAN:
${results.action_plan.map((step) => `- ${step}`).join("\n")}

AI ANALYSIS (GPT-4):
${aiAnalysis.analysis}
    `

    const blob = new Blob([resultsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `soft-skills-results-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Results Downloaded",
      description: "Your soft skills assessment results have been downloaded.",
    })
  }

  const printResults = () => {
    window.print()
  }

  const shareResults = async () => {
    if (!results) return

    const topCategories = Object.entries(results.skill_categories)
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(0, 2)
      .map(([category]) => category)

    const shareText = `I just completed a comprehensive soft skills assessment! 🌟

Overall Score: ${results.overall_score}%
Top Areas: ${topCategories.join(", ")}
Leadership Potential: ${results.leadership_potential}

Assess your soft skills: ${window.location.origin}/soft-skills-test`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Soft Skills Assessment Results",
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Analizando tus habilidades blandas...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p>No se encontraron resultados. Por favor, completa la evaluación de habilidades blandas primero.</p>
          <Button className="mt-4">Realizar Evaluación</Button>
        </div>
      </div>
    )
  }

  const radarData = Object.entries(results.skill_categories).map(([category, data]) => ({
    name: category,
    score: data.score,
  }))

  return (
    <div className="container mx-auto p-6 max-w-6xl print:bg-white">
      {/* Header */}
      <div className="mb-8 print:mb-6">
        <div className="flex justify-between items-start mb-4 print:block">
          <div>
            <h1 className="text-3xl font-bold mb-2 print:text-2xl">Evaluación de Habilidades Blandas</h1>
            <p className="text-muted-foreground print:text-sm">Análisis completo de competencias interpersonales</p>
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

        <div className="flex gap-4 items-center">
          <Badge variant="secondary" className="text-lg px-4 py-2 print:bg-white print:text-black print:border">
            Puntuación General: {results.overall_score}%
          </Badge>
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Star className="w-4 h-4 mr-1" />
            Alto Potencial
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 print:hidden">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="radar">Radar</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="development">Desarrollo</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 print:block">
          {/* Overall Score Card */}
          <Card className="print:break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 print:text-black" />
                Resumen de Habilidades Blandas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 print:text-black">{results.overall_score}%</div>
                  <div className="text-sm text-muted-foreground print:text-black">Puntuación General</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600 print:text-black">Alto Potencial</div>
                  <div className="text-sm text-muted-foreground print:text-black">Nivel de Liderazgo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 print:text-black">
                    {Object.keys(results.skill_categories).length}
                  </div>
                  <div className="text-sm text-muted-foreground print:text-black">Áreas Evaluadas</div>
                </div>
              </div>

              <Progress value={results.overall_score} className="h-4 mb-4 print:hidden" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Potencial de Liderazgo</h3>
                  <p className="text-muted-foreground print:text-black">{results.leadership_potential}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Ajuste al Equipo</h3>
                  <p className="text-muted-foreground print:text-black">{results.team_fit}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Categories Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results.skill_categories).map(([category, data]) => {
              const skillLevel = getSkillLevel(data.score)
              const Icon = getCategoryIcon(category)
              return (
                <Card key={category} className="text-center print:break-inside-avoid">
                  <CardContent className="pt-6">
                    <div
                      className={`w-12 h-12 ${skillLevel.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 print:bg-white print:border`}
                    >
                      <Icon className={`w-6 h-6 ${skillLevel.color} print:text-black`} />
                    </div>
                    <h3 className="font-semibold mb-1 text-sm">{category}</h3>
                    <div className="text-2xl font-bold mb-2">{data.score}%</div>
                    <div className={`text-sm ${skillLevel.color} print:text-black`}>{skillLevel.level}</div>
                    <Progress value={data.score} className="h-2 mt-2 print:hidden" />
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
                <Target className="w-5 h-5 text-green-600 print:text-black" />
                Análisis Radar de Habilidades Blandas
              </CardTitle>
              <CardDescription>Vista integral de tus competencias interpersonales y de liderazgo</CardDescription>
            </CardHeader>
            <CardContent>
              <SoftSkillsRadarChart data={radarData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6 print:block">
          <div className="space-y-6">
            {Object.entries(results.skill_categories).map(([category, data]) => {
              const skillLevel = getSkillLevel(data.score)
              const Icon = getCategoryIcon(category)
              return (
                <Card key={category} className="print:break-inside-avoid">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${skillLevel.color} print:text-black`} />
                      {category}
                    </CardTitle>
                    <CardDescription>{data.description}</CardDescription>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={`${skillLevel.bgColor} ${skillLevel.color} print:bg-white print:text-black print:border`}
                      >
                        {data.score}% - {skillLevel.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={data.score} className="h-3 mb-4 print:hidden" />

                    <div className="grid md:grid-cols-2 gap-4">
                      {data.skills.map((skill, index) => {
                        const skillLevelInfo = getSkillLevel(skill.level)
                        return (
                          <div key={index} className="p-3 bg-muted/50 rounded-lg print:bg-white print:border">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{skill.name}</span>
                              <span className={`text-sm ${skillLevelInfo.color} print:text-black`}>{skill.level}%</span>
                            </div>
                            <div className="text-sm text-muted-foreground print:text-black mb-2">{skill.feedback}</div>
                            <Progress value={skill.level} className="h-2 print:hidden" />
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="development" className="space-y-6 print:block">
          <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1">
            <Card className="print:break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-green-600 print:text-black flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Fortalezas Principales
                </CardTitle>
                <CardDescription>Habilidades blandas que dominas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 print:text-black" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="print:break-inside-avoid">
              <CardHeader>
                <CardTitle className="text-orange-600 print:text-black flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Áreas de Mejora
                </CardTitle>
                <CardDescription>Habilidades que puedes desarrollar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.improvement_areas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0 print:text-black" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="print:break-inside-avoid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 print:text-black" />
                Plan de Acción Personalizado
              </CardTitle>
              <CardDescription>Pasos específicos para desarrollar tus habilidades blandas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg print:bg-white print:border">
                  <h4 className="font-semibold mb-2">Recomendaciones Generales:</h4>
                  <ul className="text-sm space-y-1">
                    {results.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg print:bg-white print:border">
                  <h4 className="font-semibold mb-2">Plan de Acción (6 meses):</h4>
                  <ul className="text-sm space-y-1">
                    {results.action_plan.map((step, index) => (
                      <li key={index}>• {step}</li>
                    ))}
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
              <CardDescription>
                Insights personalizados sobre tu perfil de habilidades blandas generados por inteligencia artificial
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiAnalysis.loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
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
