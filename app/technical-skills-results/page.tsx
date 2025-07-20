"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  Database,
  Globe,
  Smartphone,
  Cloud,
  Shield,
  Download,
  Share2,
  Printer,
  Brain,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TechnicalSkillsResult {
  overall_score: number
  skill_categories: {
    [key: string]: {
      score: number
      skills: {
        name: string
        level: number
        experience: string
      }[]
    }
  }
  strengths: string[]
  improvement_areas: string[]
  recommendations: string[]
  career_level: string
  next_steps: string[]
}

interface AIAnalysis {
  analysis: string
  loading: boolean
}

// Custom Radar Chart Component for Technical Skills
const TechnicalSkillsRadarChart = ({ data }: { data: any[] }) => {
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
          fill="#3B82F6"
          fillOpacity="0.3"
          stroke="#3B82F6"
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((item, index) => {
          const pos = getPointPosition(index, item.score)
          return <circle key={index} cx={pos.x} cy={pos.y} r="5" fill="#3B82F6" stroke="white" strokeWidth="2" />
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
          Technical Skills
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        {data.map((item, index) => (
          <div key={item.name} className="p-2 bg-gray-50 rounded-lg">
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-2xl font-bold text-blue-600">{item.score}%</div>
            <div className="text-sm text-gray-600">{getSkillLevel(item.score).level}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const getSkillLevel = (score: number) => {
  if (score >= 80) return { level: "Experto", color: "text-green-600", bgColor: "bg-green-100" }
  if (score >= 60) return { level: "Avanzado", color: "text-blue-600", bgColor: "bg-blue-100" }
  if (score >= 40) return { level: "Intermedio", color: "text-yellow-600", bgColor: "bg-yellow-100" }
  return { level: "Principiante", color: "text-red-600", bgColor: "bg-red-100" }
}

const getCategoryIcon = (category: string) => {
  const icons = {
    "Frontend Development": Globe,
    "Backend Development": Database,
    "Mobile Development": Smartphone,
    "DevOps & Cloud": Cloud,
    "Data Science": Brain,
    Cybersecurity: Shield,
    "Programming Languages": Code,
  }
  return icons[category as keyof typeof icons] || Code
}

export default function TechnicalSkillsResultsPage() {
  const [results, setResults] = useState<TechnicalSkillsResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({ analysis: "", loading: false })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockResults: TechnicalSkillsResult = {
      overall_score: 72,
      skill_categories: {
        "Frontend Development": {
          score: 85,
          skills: [
            { name: "React", level: 90, experience: "3+ años" },
            { name: "JavaScript", level: 88, experience: "4+ años" },
            { name: "CSS/SCSS", level: 82, experience: "3+ años" },
            { name: "TypeScript", level: 78, experience: "2+ años" },
          ],
        },
        "Backend Development": {
          score: 68,
          skills: [
            { name: "Node.js", level: 75, experience: "2+ años" },
            { name: "Python", level: 70, experience: "2+ años" },
            { name: "SQL", level: 65, experience: "1+ años" },
            { name: "API Design", level: 62, experience: "1+ años" },
          ],
        },
        "DevOps & Cloud": {
          score: 55,
          skills: [
            { name: "Docker", level: 60, experience: "1+ años" },
            { name: "AWS", level: 55, experience: "< 1 año" },
            { name: "CI/CD", level: 50, experience: "< 1 año" },
            { name: "Kubernetes", level: 45, experience: "< 1 año" },
          ],
        },
        "Mobile Development": {
          score: 45,
          skills: [
            { name: "React Native", level: 50, experience: "< 1 año" },
            { name: "Flutter", level: 40, experience: "< 1 año" },
            { name: "iOS Development", level: 35, experience: "< 1 año" },
            { name: "Android Development", level: 55, experience: "1+ años" },
          ],
        },
      },
      strengths: [
        "Sólida experiencia en desarrollo Frontend",
        "Dominio avanzado de React y JavaScript",
        "Buenas prácticas de desarrollo web",
        "Capacidad de aprendizaje rápido",
        "Conocimiento de tecnologías modernas",
      ],
      improvement_areas: [
        "Fortalecer conocimientos en DevOps y Cloud",
        "Ampliar experiencia en desarrollo Backend",
        "Desarrollar habilidades en desarrollo móvil",
        "Mejorar conocimientos en bases de datos",
        "Aprender más sobre arquitectura de sistemas",
      ],
      recommendations: [
        "Enfocarse en proyectos full-stack",
        "Obtener certificaciones en AWS o Azure",
        "Practicar con proyectos de desarrollo móvil",
        "Contribuir a proyectos open source",
        "Tomar cursos especializados en áreas débiles",
      ],
      career_level: "Desarrollador Semi-Senior",
      next_steps: [
        "Completar un proyecto full-stack personal",
        "Obtener certificación AWS Cloud Practitioner",
        "Desarrollar una aplicación móvil completa",
        "Participar en hackathons o competencias",
        "Buscar mentoría en áreas de mejora",
      ],
    }

    setTimeout(() => {
      setResults(mockResults)
      generateAIAnalysis(mockResults)
      setLoading(false)
    }, 1000)
  }, [])

  const generateAIAnalysis = async (skillsResults: TechnicalSkillsResult) => {
    setAiAnalysis({ analysis: "", loading: true })

    try {
      const response = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "technical_skills_analysis",
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
TECHNICAL SKILLS ASSESSMENT RESULTS
===================================

Overall Score: ${results.overall_score}%
Career Level: ${results.career_level}
Generated on: ${new Date().toLocaleDateString()}

SKILL CATEGORIES:
${Object.entries(results.skill_categories)
  .map(
    ([category, data]) => `
${category}: ${data.score}%
${data.skills.map((skill) => `  - ${skill.name}: ${skill.level}% (${skill.experience})`).join("\n")}
`,
  )
  .join("\n")}

STRENGTHS:
${results.strengths.map((strength) => `- ${strength}`).join("\n")}

IMPROVEMENT AREAS:
${results.improvement_areas.map((area) => `- ${area}`).join("\n")}

RECOMMENDATIONS:
${results.recommendations.map((rec) => `- ${rec}`).join("\n")}

NEXT STEPS:
${results.next_steps.map((step) => `- ${step}`).join("\n")}

AI ANALYSIS (GPT-4):
${aiAnalysis.analysis}
    `

    const blob = new Blob([resultsText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `technical-skills-results-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Results Downloaded",
      description: "Your technical skills assessment results have been downloaded.",
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

    const shareText = `I just completed a comprehensive technical skills assessment! 💻

Overall Score: ${results.overall_score}%
Top Areas: ${topCategories.join(", ")}
Level: ${results.career_level}

Assess your technical skills: ${window.location.origin}/technical-skills-test`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Technical Skills Assessment Results",
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
          <p>Analizando tus habilidades técnicas...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p>No se encontraron resultados. Por favor, completa la evaluación técnica primero.</p>
          <Button className="mt-4">Realizar Evaluación</Button>
        </div>
      </div>
    )
  }

  const radarData = Object.entries(results.skill_categories).map(([category, data]) => ({
    name: category.replace(" Development", "").replace(" & ", "/"),
    score: data.score,
  }))

  return (
    <div className="container mx-auto p-6 max-w-6xl print:bg-white">
      {/* Header */}
      <div className="mb-8 print:mb-6">
        <div className="flex justify-between items-start mb-4 print:block">
          <div>
            <h1 className="text-3xl font-bold mb-2 print:text-2xl">Evaluación de Habilidades Técnicas</h1>
            <p className="text-muted-foreground print:text-sm">Análisis completo de competencias tecnológicas</p>
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
            {results.career_level}
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
                <Code className="w-5 h-5 print:text-black" />
                Resumen de Habilidades Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 print:text-black">{results.overall_score}%</div>
                  <div className="text-sm text-muted-foreground print:text-black">Puntuación General</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 print:text-black">{results.career_level}</div>
                  <div className="text-sm text-muted-foreground print:text-black">Nivel Profesional</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 print:text-black">
                    {Object.keys(results.skill_categories).length}
                  </div>
                  <div className="text-sm text-muted-foreground print:text-black">Áreas Evaluadas</div>
                </div>
              </div>

              <Progress value={results.overall_score} className="h-4 mb-4 print:hidden" />

              <p className="text-muted-foreground print:text-black">
                Tu perfil técnico muestra fortalezas en desarrollo frontend con oportunidades de crecimiento en áreas
                como DevOps y desarrollo móvil. El análisis detallado te ayudará a planificar tu desarrollo profesional.
              </p>
            </CardContent>
          </Card>

          {/* Quick Categories Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Target className="w-5 h-5 text-blue-600 print:text-black" />
                Análisis Radar de Habilidades Técnicas
              </CardTitle>
              <CardDescription>Vista integral de tus competencias técnicas por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <TechnicalSkillsRadarChart data={radarData} />
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
                            <div className="text-sm text-muted-foreground print:text-black mb-2">
                              Experiencia: {skill.experience}
                            </div>
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
                  Fortalezas Técnicas
                </CardTitle>
                <CardDescription>Habilidades que dominas y puedes aprovechar</CardDescription>
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
                Plan de Desarrollo de 30 Días
              </CardTitle>
              <CardDescription>Pasos concretos para mejorar tus habilidades técnicas</CardDescription>
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
                  <h4 className="font-semibold mb-2">Próximos Pasos:</h4>
                  <ul className="text-sm space-y-1">
                    {results.next_steps.map((step, index) => (
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
                Insights personalizados sobre tu perfil técnico generados por inteligencia artificial
              </CardDescription>
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
