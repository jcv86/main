"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Download, Share2, ArrowRight, Target, TrendingUp, Users, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface BigFiveResults {
  openness: number
  conscientiousness: number
  extraversion: number
  agreeableness: number
  neuroticism: number
}

interface CareerRecommendation {
  title: string
  match: number
  description: string
  salaryRange: string
  companies: string[]
  skills: string[]
}

const traitDescriptions = {
  openness: {
    name: "Apertura",
    icon: "🎨",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    high: "Eres creativo, curioso y abierto a nuevas experiencias. Te atraen los desafíos intelectuales y disfrutas explorando ideas innovadoras. En el contexto laboral chileno, esto te posiciona bien para roles que requieren innovación y adaptabilidad.",
    low: "Prefieres la estabilidad y los métodos probados. Valoras la tradición y te sientes cómodo con rutinas establecidas. En el mercado chileno, esto es valioso en roles que requieren consistencia y atención al detalle.",
    careers: ["Product Manager", "UX Designer", "Consultor de Innovación", "Investigador", "Arquitecto de Software"],
  },
  conscientiousness: {
    name: "Responsabilidad",
    icon: "📋",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    high: "Eres organizado, disciplinado y orientado a objetivos. Cumples compromisos y planificas cuidadosamente. Estas cualidades son altamente valoradas en el mercado laboral chileno, especialmente en roles de liderazgo y gestión.",
    low: "Eres más flexible y espontáneo en tu enfoque. Prefieres adaptarte sobre la marcha y puedes ser más creativo en la resolución de problemas. Esto puede ser valioso en entornos dinámicos y startups chilenas.",
    careers: [
      "Gerente de Proyectos",
      "Analista Financiero",
      "Auditor",
      "Ingeniero de Calidad",
      "Director de Operaciones",
    ],
  },
  extraversion: {
    name: "Extraversión",
    icon: "👥",
    color: "bg-green-100 text-green-800 border-green-200",
    high: "Te energizas con la interacción social y te sientes cómodo liderando. Disfrutas del networking y trabajar en equipo. En Chile, donde las relaciones personales son importantes en los negocios, esta es una gran fortaleza.",
    low: "Prefieres trabajar de forma independiente y reflexionar antes de actuar. Te concentras bien en tareas que requieren análisis profundo. Esto es valioso en roles técnicos y especializados del mercado chileno.",
    careers: ["Gerente de Ventas", "Consultor", "Líder de Equipo", "Relacionador Público", "Gerente de Marketing"],
  },
  agreeableness: {
    name: "Amabilidad",
    icon: "🤝",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "Eres cooperativo, empático y orientado hacia otros. Valoras la armonía y buscas el consenso. En la cultura laboral chilena, donde se valora el buen trato y la colaboración, esto es una gran ventaja.",
    low: "Eres más directo y competitivo. Priorizas la eficiencia sobre la armonía y no temes tomar decisiones difíciles. Esto puede ser valioso en roles de liderazgo que requieren decisiones tough en el mercado chileno.",
    careers: [
      "Recursos Humanos",
      "Trabajador Social",
      "Mediador",
      "Gerente de Atención al Cliente",
      "Psicólogo Organizacional",
    ],
  },
  neuroticism: {
    name: "Estabilidad Emocional",
    icon: "🧘",
    color: "bg-red-100 text-red-800 border-red-200",
    high: "Tiendes a experimentar emociones intensas y puedes ser más sensible al estrés. Sin embargo, esto también puede traducirse en mayor empatía y conciencia de los riesgos, valiosas en ciertos roles del mercado chileno.",
    low: "Mantienes la calma bajo presión y tienes estabilidad emocional. Te adaptas bien a los cambios y manejas el estrés efectivamente. Estas cualidades son muy valoradas en roles de liderazgo en Chile.",
    careers: ["Gerente de Crisis", "Piloto", "Cirujano", "Negociador", "Director Ejecutivo"],
  },
}

export default function BigFiveResultsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [results, setResults] = useState<BigFiveResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Load results from localStorage
    const savedResults = localStorage.getItem("bigFiveResults")
    if (savedResults) {
      const data = JSON.parse(savedResults)
      setResults(data.results)
    } else {
      router.push("/big-five-test")
    }
    setLoading(false)
  }, [user, router])

  const getTraitLevel = (score: number): string => {
    if (score >= 70) return "Alto"
    if (score >= 30) return "Moderado"
    return "Bajo"
  }

  const getTraitDescription = (trait: keyof BigFiveResults, score: number): string => {
    const traitInfo = traitDescriptions[trait]
    return score >= 50 ? traitInfo.high : traitInfo.low
  }

  const generateCareerRecommendations = (): CareerRecommendation[] => {
    if (!results) return []

    const recommendations: CareerRecommendation[] = []

    // High Openness + High Conscientiousness
    if (results.openness >= 60 && results.conscientiousness >= 60) {
      recommendations.push({
        title: "Product Manager",
        match: 92,
        description:
          "Combina tu creatividad con tu organización para liderar el desarrollo de productos innovadores en el mercado chileno.",
        salaryRange: "$3.500.000 - $6.000.000 CLP",
        companies: ["NotCo", "Fintual", "Cornershop", "Betterfly"],
        skills: ["Product Strategy", "User Research", "Data Analysis", "Leadership"],
      })
    }

    // High Extraversion + High Agreeableness
    if (results.extraversion >= 60 && results.agreeableness >= 60) {
      recommendations.push({
        title: "Gerente de Recursos Humanos",
        match: 88,
        description:
          "Tu habilidad para conectar con personas y crear armonía te hace ideal para liderar equipos en empresas chilenas.",
        salaryRange: "$2.800.000 - $4.500.000 CLP",
        companies: ["Banco de Chile", "Falabella", "Entel", "Cencosud"],
        skills: ["People Management", "Communication", "Conflict Resolution", "Talent Development"],
      })
    }

    // High Conscientiousness + Low Neuroticism
    if (results.conscientiousness >= 60 && results.neuroticism <= 40) {
      recommendations.push({
        title: "Ingeniero de Software Senior",
        match: 85,
        description:
          "Tu disciplina y estabilidad emocional son perfectas para liderar proyectos técnicos complejos en el ecosistema tech chileno.",
        salaryRange: "$3.000.000 - $5.000.000 CLP",
        companies: ["Mercado Libre", "Chiper", "Buk", "Khipu"],
        skills: ["Software Architecture", "Team Leadership", "Problem Solving", "Technical Strategy"],
      })
    }

    // High Openness + High Extraversion
    if (results.openness >= 60 && results.extraversion >= 60) {
      recommendations.push({
        title: "Consultor de Innovación",
        match: 90,
        description:
          "Tu creatividad y habilidades sociales te permiten ayudar a empresas chilenas a transformarse digitalmente.",
        salaryRange: "$3.200.000 - $5.500.000 CLP",
        companies: ["Deloitte Chile", "McKinsey", "EY", "KPMG"],
        skills: ["Strategic Thinking", "Change Management", "Presentation", "Business Analysis"],
      })
    }

    // Default recommendations based on highest traits
    if (recommendations.length === 0) {
      const highestTrait = Object.entries(results).reduce((a, b) =>
        results[a[0] as keyof BigFiveResults] > results[b[0] as keyof BigFiveResults] ? a : b,
      )
      const careers = traitDescriptions[highestTrait[0] as keyof BigFiveResults].careers

      recommendations.push({
        title: careers[0],
        match: 80,
        description: `Basado en tu perfil de personalidad, este rol aprovecha tus fortalezas principales en el mercado laboral chileno.`,
        salaryRange: "$2.500.000 - $4.000.000 CLP",
        companies: ["Empresas líderes en Chile"],
        skills: ["Habilidades relevantes", "Competencias clave"],
      })
    }

    return recommendations.slice(0, 3)
  }

  const getPersonalityInsights = () => {
    if (!results) return []

    const insights = []

    // Leadership potential
    if (results.extraversion >= 60 && results.conscientiousness >= 60) {
      insights.push(
        "🎯 Tienes un fuerte potencial de liderazgo, combinando habilidades sociales con disciplina organizacional.",
      )
    }

    // Innovation capacity
    if (results.openness >= 70) {
      insights.push("💡 Tu alta apertura te hace ideal para roles de innovación y transformación digital en Chile.")
    }

    // Team collaboration
    if (results.agreeableness >= 60 && results.extraversion >= 50) {
      insights.push(
        "🤝 Eres excelente trabajando en equipo y construyendo relaciones, muy valorado en la cultura laboral chilena.",
      )
    }

    // Stress management
    if (results.neuroticism <= 40) {
      insights.push(
        "🧘 Tu estabilidad emocional te permite manejar bien la presión y liderar en situaciones desafiantes.",
      )
    }

    // Reliability
    if (results.conscientiousness >= 70) {
      insights.push(
        "⭐ Tu alta responsabilidad te convierte en un empleado muy confiable y valorado por empleadores chilenos.",
      )
    }

    return insights
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analizando tus resultados...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="text-center py-12">
          <p>No se encontraron resultados. Por favor, realiza el test primero.</p>
          <Button onClick={() => router.push("/big-five-test")} className="mt-4">
            Realizar Test
          </Button>
        </div>
      </div>
    )
  }

  const careerRecommendations = generateCareerRecommendations()
  const personalityInsights = getPersonalityInsights()

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">Resultados Big Five</h1>
            <p className="text-muted-foreground">Tu perfil de personalidad científicamente validado</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="w-4 h-4" />
            Descargar PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Share2 className="w-4 h-4" />
            Compartir
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="traits">Rasgos Detallados</TabsTrigger>
          <TabsTrigger value="careers">Recomendaciones</TabsTrigger>
          <TabsTrigger value="development">Plan de Desarrollo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Personality Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Tu Perfil de Personalidad
              </CardTitle>
              <CardDescription>Basado en el modelo Big Five (OCEAN), el más respaldado científicamente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(results).map(([trait, score]) => {
                  const traitInfo = traitDescriptions[trait as keyof BigFiveResults]
                  return (
                    <div key={trait} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{traitInfo.icon}</span>
                          <span className="font-medium">{traitInfo.name}</span>
                        </div>
                        <Badge className={traitInfo.color}>{getTraitLevel(score)}</Badge>
                      </div>
                      <Progress value={score} className="h-2" />
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

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Insights Clave
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {personalityInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm">{insight}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traits" className="space-y-6">
          {Object.entries(results).map(([trait, score]) => {
            const traitInfo = traitDescriptions[trait as keyof BigFiveResults]
            return (
              <Card key={trait}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{traitInfo.icon}</span>
                      {traitInfo.name}
                    </CardTitle>
                    <Badge className={traitInfo.color}>
                      {score}% - {getTraitLevel(score)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={score} className="h-3" />
                    <p className="text-gray-700">{getTraitDescription(trait as keyof BigFiveResults, score)}</p>
                    <div>
                      <h4 className="font-medium mb-2">Carreras recomendadas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {traitInfo.careers.map((career, index) => (
                          <Badge key={index} variant="outline">
                            {career}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          <div className="grid gap-6">
            {careerRecommendations.map((career, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      {career.title}
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-800">{career.match}% Match</Badge>
                  </div>
                  <CardDescription>{career.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Rango Salarial</h4>
                      <p className="text-lg font-semibold text-green-600">{career.salaryRange}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Empresas Objetivo</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.companies.map((company, idx) => (
                          <Badge key={idx} variant="outline">
                            {company}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Habilidades Clave</h4>
                      <div className="flex flex-wrap gap-2">
                        {career.skills.map((skill, idx) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="development" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Plan de Desarrollo Personalizado
              </CardTitle>
              <CardDescription>
                Recomendaciones específicas basadas en tu perfil para el mercado chileno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">🎯 Fortalezas a Potenciar</h3>
                  <div className="space-y-2">
                    {Object.entries(results)
                      .filter(([_, score]) => score >= 60)
                      .map(([trait, score]) => (
                        <div key={trait} className="p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{traitDescriptions[trait as keyof BigFiveResults].icon}</span>
                            <span className="font-medium">{traitDescriptions[trait as keyof BigFiveResults].name}</span>
                            <Badge className="bg-green-100 text-green-800">{score}%</Badge>
                          </div>
                          <p className="text-sm text-green-700">
                            Continúa desarrollando esta fortaleza a través de proyectos desafiantes y roles de
                            liderazgo.
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">📈 Áreas de Desarrollo</h3>
                  <div className="space-y-2">
                    {Object.entries(results)
                      .filter(([_, score]) => score < 50)
                      .map(([trait, score]) => (
                        <div key={trait} className="p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{traitDescriptions[trait as keyof BigFiveResults].icon}</span>
                            <span className="font-medium">{traitDescriptions[trait as keyof BigFiveResults].name}</span>
                            <Badge className="bg-yellow-100 text-yellow-800">{score}%</Badge>
                          </div>
                          <p className="text-sm text-yellow-700">
                            Consider desarrollar esta área a través de cursos, mentoring o experiencias específicas.
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">🚀 Próximos Pasos</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Completa tu evaluación DISC</p>
                        <p className="text-sm text-muted-foreground">
                          Combina ambos perfiles para recomendaciones más precisas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Explora oportunidades laborales</p>
                        <p className="text-sm text-muted-foreground">
                          Busca roles que se alineen con tu perfil de personalidad
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Desarrolla habilidades específicas</p>
                        <p className="text-sm text-muted-foreground">
                          Enfócate en las competencias clave identificadas en tus recomendaciones de carrera
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={() => router.push("/disc-test")} className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Realizar Test DISC
            </Button>
            <Button variant="outline" onClick={() => router.push("/job-search")} className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Explorar Empleos
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Ver Dashboard
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
