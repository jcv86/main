"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { SofiaDaniCoach } from "@/components/sofia-dani-coach"
import {
  Target,
  Brain,
  Palette,
  Users,
  TrendingUp,
  FileText,
  BarChart3,
  LucidePieChart as RechartsPieChart,
  Radar,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingDown,
  AlertCircle,
} from "lucide-react"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
  PieChart,
  Pie,
} from "recharts"

interface RIASECResults {
  R: number
  I: number
  A: number
  S: number
  E: number
  C: number
  holland_code: string
  overall_score: number // Changed from total_score and percentage
  top_categories: string[] // Kept for potential future use, but not used in current display
  career_matches: string[] // Kept for potential future use, but not used in current display
  strengths: string[] // Kept for potential future use, but not used in current display
  development_areas: string[] // Kept for potential future use, but not used in current display
  reflective_responses: Record<string, string> // Kept for potential future use, but not used in current display
}

export default function RIASECResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get("demo") === "true"

  const [results, setResults] = useState<RIASECResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const localResults = localStorage.getItem("riasec_results")
      if (localResults) {
        setResults(JSON.parse(localResults))
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("test_type", "riasec")
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (!error && data) {
        // Ensure the data structure matches the updated interface
        const processedResults: RIASECResults = {
          R: data.results.R,
          I: data.results.I,
          A: data.results.A,
          S: data.results.S,
          E: data.results.E,
          C: data.results.C,
          holland_code: data.results.holland_code,
          overall_score: data.results.percentage || 0, // Use 'percentage' or default to 0
          // Assign empty arrays or default values for fields not present in the database
          top_categories: data.results.top_categories || [],
          career_matches: data.results.career_matches || [],
          strengths: data.results.strengths || [],
          development_areas: data.results.development_areas || [],
          reflective_responses: data.results.reflective_responses || {},
        }
        setResults(processedResults)
      } else if (error) {
        console.error("Error loading results from Supabase:", error)
      }
    } catch (error) {
      console.error("Error loading results:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      R: Target,
      I: Brain,
      A: Palette,
      S: Users,
      E: TrendingUp,
      C: FileText,
    }
    return icons[category as keyof typeof icons] || FileText
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      R: "#ef4444",
      I: "#3b82f6",
      A: "#8b5cf6",
      S: "#10b981",
      E: "#f59e0b",
      C: "#6b7280",
    }
    return colors[category as keyof typeof colors] || "#6b7280"
  }

  const getCategoryName = (category: string) => {
    const names = {
      R: "Realista",
      I: "Investigativo",
      A: "Artístico",
      S: "Social",
      E: "Emprendedor",
      C: "Convencional",
    }
    return names[category as keyof typeof names] || category
  }

  const getRadarData = () => {
    if (!results) return []
    return [
      { category: "Realista", value: results.R, fullMark: 100 },
      { category: "Investigativo", value: results.I, fullMark: 100 },
      { category: "Artístico", value: results.A, fullMark: 100 },
      { category: "Social", value: results.S, fullMark: 100 },
      { category: "Emprendedor", value: results.E, fullMark: 100 },
      { category: "Convencional", value: results.C, fullMark: 100 },
    ]
  }

  const getBarData = () => {
    if (!results) return []
    return [
      { name: "R", value: results.R, color: getCategoryColor("R") },
      { name: "I", value: results.I, color: getCategoryColor("I") },
      { name: "A", value: results.A, color: getCategoryColor("A") },
      { name: "S", value: results.S, color: getCategoryColor("S") },
      { name: "E", value: results.E, color: getCategoryColor("E") },
      { name: "C", value: results.C, color: getCategoryColor("C") },
    ]
  }

  const getPieData = () => {
    if (!results) return []
    return [
      { name: "Realista", value: results.R, color: getCategoryColor("R") },
      { name: "Investigativo", value: results.I, color: getCategoryColor("I") },
      { name: "Artístico", value: results.A, color: getCategoryColor("A") },
      { name: "Social", value: results.S, color: getCategoryColor("S") },
      { name: "Emprendedor", value: results.E, color: getCategoryColor("E") },
      { name: "Convencional", value: results.C, color: getCategoryColor("C") },
    ]
  }

  const getHollandCodeDescription = (code: string) => {
    const descriptions: Record<string, string> = {
      RIE: "Ingeniero Práctico - Combinas habilidades técnicas con análisis y liderazgo. Ideal para ingeniería, desarrollo de productos y gestión técnica.",
      RIA: "Artesano Creativo - Mezclas habilidades manuales con creatividad y análisis. Perfecto para diseño industrial, arquitectura y artes aplicadas.",
      RIS: "Técnico Social - Combinas habilidades prácticas con servicio a otros. Excelente para terapia ocupacional, educación técnica y servicios de salud.",
      IAS: "Investigador Creativo - Análisis profundo con creatividad y empatía. Ideal para investigación UX, psicología y ciencias sociales aplicadas.",
      IAE: "Innovador Estratégico - Investigación con creatividad y visión empresarial. Perfecto para consultoría de innovación y desarrollo de productos.",
      IES: "Consultor Analítico - Análisis con liderazgo y orientación social. Excelente para consultoría estratégica y gestión de cambio organizacional.",
      AES: "Emprendedor Creativo - Creatividad con liderazgo y orientación social. Ideal para startups creativas, marketing y gestión cultural.",
      AEI: "Director Creativo - Creatividad con visión empresarial y análisis. Perfecto para dirección de arte, branding y estrategia creativa.",
      ASE: "Comunicador Creativo - Creatividad con orientación social y liderazgo. Excelente para comunicación corporativa y relaciones públicas.",
      SEI: "Líder Educativo - Orientación social con liderazgo y análisis. Ideal para gestión educativa, capacitación corporativa y desarrollo organizacional.",
      SEA: "Facilitador Creativo - Servicio a otros con liderazgo y creatividad. Perfecto para coaching, facilitación y desarrollo de talento.",
      SIA: "Consejero Analítico - Orientación social con análisis y creatividad. Excelente para psicología, trabajo social y consejería.",
      ECS: "Gerente Organizacional - Liderazgo con organización y orientación social. Ideal para gestión de operaciones y recursos humanos.",
      ECI: "Ejecutivo Estratégico - Liderazgo con organización y análisis. Perfecto para dirección general y consultoría de negocios.",
      ESC: "Líder de Equipos - Liderazgo con orientación social y organización. Excelente para gestión de proyectos y coordinación de equipos.",
      CSE: "Administrador Estratégico - Organización con orientación social y liderazgo. Ideal para administración pública y gestión de servicios.",
      CES: "Coordinador Ejecutivo - Organización con liderazgo y orientación social. Perfecto para gestión administrativa y coordinación institucional.",
      CIS: "Analista de Sistemas - Organización con análisis y orientación social. Excelente para análisis de procesos y mejora continua.",
    }
    return (
      descriptions[code] ||
      `Tu código ${code} representa una combinación única de intereses que te posiciona para roles especializados en la intersección de estas áreas.`
    )
  }

  const getCareerRecommendations = (code: string): string[] => {
    const careers: Record<string, string[]> = {
      RIE: [
        "Ingeniero de Software",
        "Ingeniero Mecánico",
        "Arquitecto de Sistemas",
        "Ingeniero de Datos",
        "Gerente Técnico",
      ],
      RIA: [
        "Diseñador Industrial",
        "Arquitecto",
        "Diseñador de Producto",
        "Carpintero de Precisión",
        "Restaurador de Arte",
      ],
      RIS: [
        "Terapeuta Ocupacional",
        "Educador Técnico",
        "Técnico de Laboratorio",
        "Asistente Médico",
        "Ortesista/Protesista",
      ],
      IAS: [
        "Científico de Datos",
        "Investigador UX",
        "Psicólogo Investigador",
        "Analista de Comportamiento",
        "Diseñador de Investigación",
      ],
      IAE: [
        "Consultor de Innovación",
        "Especialista en Desarrollo de Producto",
        "Gerente de Tecnología",
        "Analista de Mercados",
        "Arquitecto de Soluciones",
      ],
      IES: [
        "Consultor de Estrategia",
        "Analista de Negocios Senior",
        "Gestor de Proyectos de TI",
        "Líder de Transformación Digital",
        "Especialista en Gestión del Cambio",
      ],
      AES: [
        "Director Creativo",
        "Fundador de Startup Creativa",
        "Productor de Contenido",
        "Consultor de Marca",
        "Diseñador de Experiencias",
      ],
      AEI: [
        "Director de Arte",
        "Gerente de Marca",
        "Estratega de Marketing Digital",
        "Diseñador de Comunicación",
        "Líder de Contenido",
      ],
      ASE: [
        "Especialista en Relaciones Públicas",
        "Gerente de Comunicaciones Corporativas",
        "Asesor de Imagen",
        "Portavoz",
        "Consultor de Crisis",
      ],
      SEI: [
        "Director de Capacitación",
        "Consultor Educativo",
        "Coach Ejecutivo",
        "Gerente de Desarrollo de Talento",
        "Facilitador",
      ],
      SEA: [
        "Coach Profesional",
        "Facilitador de Talleres",
        "Consultor de Desarrollo Personal",
        "Orador Motivacional",
        "Terapeuta de Grupo",
      ],
      SIA: [
        "Psicólogo Clínico",
        "Trabajador Social",
        "Consejero Vocacional",
        "Analista de Políticas Sociales",
        "Investigador Social",
      ],
      ECS: [
        "Gerente de Operaciones",
        "Director de Proyectos",
        "Gerente de RRHH",
        "Consultor Organizacional",
        "Gerente de Calidad",
      ],
      ECI: [
        "Director General (CEO)",
        "Consultor de Gestión",
        "Gerente de Planificación Estratégica",
        "Director de Operaciones",
        "Analista Financiero Senior",
      ],
      ESC: [
        "Líder de Equipo",
        "Supervisor de Producción",
        "Coordinador de Proyectos",
        "Gerente de Turno",
        "Jefe de Departamento",
      ],
      CSE: [
        "Administrador Público",
        "Gerente de Servicios Comunitarios",
        "Analista de Políticas Públicas",
        "Coordinador de Programas",
        "Director de ONG",
      ],
      CES: [
        "Gerente Administrativo",
        "Coordinador de Eventos",
        "Asistente Ejecutivo Senior",
        "Gerente de Oficina",
        "Coordinador de Logística",
      ],
      CIS: [
        "Analista de Sistemas de Información",
        "Analista de Procesos",
        "Especialista en Optimización",
        "Gerente de Proyectos de TI",
        "Consultor de Eficiencia",
      ],
    }
    return (
      careers[code] || [
        "Consultor Profesional",
        "Especialista en tu área",
        "Gerente de Proyectos",
        "Analista Senior",
        "Coordinador de Equipos",
        "Líder de Innovación",
      ]
    )
  }

  const getStrengths = (code: string): string[] => {
    const strengthsMap: Record<string, string[]> = {
      R: [
        "Habilidades técnicas y prácticas",
        "Resolución de problemas concretos",
        "Trabajo con herramientas y tecnología",
        "Orientación a la acción y resultados tangibles",
      ],
      I: [
        "Pensamiento analítico",
        "Investigación y análisis de datos",
        "Resolución de problemas complejos",
        "Curiosidad intelectual",
        "Habilidad para identificar patrones",
      ],
      A: [
        "Creatividad e innovación",
        "Expresión artística",
        "Pensamiento original",
        "Sensibilidad estética",
        "Flexibilidad y adaptabilidad",
      ],
      S: [
        "Empatía y comprensión",
        "Trabajo en equipo",
        "Comunicación interpersonal",
        "Habilidad para escuchar",
        "Orientación al servicio",
      ],
      E: [
        "Liderazgo y toma de decisiones",
        "Visión estratégica",
        "Persuasión y negociación",
        "Iniciativa y proactividad",
        "Resiliencia ante el fracaso",
      ],
      C: [
        "Organización y planificación",
        "Atención al detalle",
        "Gestión de procesos",
        "Cumplimiento de normas",
        "Eficiencia y método",
      ],
    }

    const topCategories = code.split("")
    const strengths: string[] = []
    topCategories.forEach((cat) => {
      strengths.push(...(strengthsMap[cat] || []))
    })
    // Return a maximum of 6 strengths, ensuring no duplicates
    return Array.from(new Set(strengths)).slice(0, 6)
  }

  const getDevelopmentAreas = (results: RIASECResults): string[] => {
    const scores = [
      { cat: "R", score: results.R },
      { cat: "I", score: results.I },
      { cat: "A", value: results.A },
      { cat: "S", score: results.S },
      { cat: "E", score: results.E },
      { cat: "C", score: results.C },
    ]

    // Sort by score in ascending order and take the top 2 (lowest scores)
    const lowest = scores.sort((a, b) => (a.score || a.value || 0) - (b.score || b.value || 0)).slice(0, 2)

    const developmentMap: Record<string, string> = {
      R: "Desarrollar habilidades técnicas y prácticas aplicadas a la resolución de problemas concretos.",
      I: "Fortalecer capacidades de análisis e investigación, profundizando en metodologías y herramientas.",
      A: "Cultivar la creatividad y la expresión artística, explorando nuevas formas de innovación y diseño.",
      S: "Mejorar habilidades interpersonales y de trabajo en equipo, enfocándose en la empatía y la comunicación efectiva.",
      E: "Desarrollar liderazgo y habilidades empresariales, buscando oportunidades para tomar decisiones y persuadir.",
      C: "Mejorar organización y atención al detalle, implementando sistemas de gestión y planificación eficientes.",
    }

    return lowest.map((item) => developmentMap[item.cat])
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span>Cargando resultados RIASEC...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">Parece que aún no has completado el test RIASEC.</p>
            <Button onClick={() => router.push("/test/riasec")}>Realizar Test RIASEC</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const careerRecommendations = getCareerRecommendations(results.holland_code)
  const strengths = getStrengths(results.holland_code)
  const developmentAreas = getDevelopmentAreas(results)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-blue-900 mb-2">
                  Resultados Test RIASEC
                  <Badge className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    Código Holland: {results.holland_code}
                  </Badge>
                  {isDemoMode && (
                    <Badge variant="outline" className="ml-2">
                      Modo Demo
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-lg">{getHollandCodeDescription(results.holland_code)}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{results.overall_score}%</div>
                <div className="text-sm text-gray-500">Puntuación General</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">Resumen</span>
                </TabsTrigger>
                <TabsTrigger value="charts" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Gráficos</span>
                </TabsTrigger>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Análisis</span>
                </TabsTrigger>
                <TabsTrigger value="career" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Carrera</span>
                </TabsTrigger>
                <TabsTrigger value="coach" className="flex items-center gap-2 hidden lg:flex">
                  <Sparkles className="h-4 w-4" />
                  Coach Dani
                </TabsTrigger>
                <TabsTrigger value="action" className="flex items-center gap-2 hidden lg:flex">
                  <Target className="h-4 w-4" />
                  Plan
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Holland Code Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Tu Código Holland: {results.holland_code}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.holland_code.split("").map((letter, index) => {
                      const IconComponent = getCategoryIcon(letter)
                      const score = results[letter as keyof typeof results] as number
                      const percentage = Math.round((score / 100) * 100) // Assuming score is out of 100 now
                      return (
                        <div key={letter} className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: getCategoryColor(letter) }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <IconComponent className="h-4 w-4" style={{ color: getCategoryColor(letter) }} />
                              <span className="font-semibold">{getCategoryName(letter)}</span>
                              <Badge variant="outline">{score}/100 puntos</Badge>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Fortalezas Principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {strengths.slice(0, 4).map((strength, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Matches (now Recommendations) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Carreras Sugeridas
                </CardTitle>
                <CardDescription>
                  Basado en tu código Holland {results.holland_code}, estas carreras son altamente compatibles con tu
                  perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {careerRecommendations.map((career, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-blue-900">{career}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Development Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  Áreas de Desarrollo
                </CardTitle>
                <CardDescription>Aspectos en los que puedes enfocar tu crecimiento profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {developmentAreas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-orange-800">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radar className="h-5 w-5 text-blue-600" />
                    Perfil RIASEC - Vista Radar
                  </CardTitle>
                  <CardDescription>Visualización completa de tus puntuaciones en las 6 dimensiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} /> {/* domain updated to 100 */}
                        <RechartsRadar
                          name="Puntuación"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Puntuaciones por Categoría
                  </CardTitle>
                  <CardDescription>Comparación directa de tus puntuaciones RIASEC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getBarData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} /> {/* domain updated to 100 */}
                        <Tooltip formatter={(value, name) => [`${value} puntos`, getCategoryName(name as string)]} />
                        <Bar dataKey="value" fill="#8884d8">
                          {getBarData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RechartsPieChart className="h-5 w-5 text-purple-600" />
                  Distribución de Intereses
                </CardTitle>
                <CardDescription>Proporción de cada tipo de interés en tu perfil profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Detailed Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Análisis Detallado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Tu Perfil {results.holland_code}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {getHollandCodeDescription(results.holland_code)}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Fortalezas Clave</h4>
                    <div className="space-y-2">
                      {strengths.map((strength, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Oportunidades de Crecimiento</h4>
                    <div className="space-y-2">
                      {developmentAreas.map((area, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Desglose de Puntuaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results)
                      .filter(([key]) => ["R", "I", "A", "S", "E", "C"].includes(key))
                      .sort(([, a], [, b]) => (b as number) - (a as number)) // Sort descending
                      .map(([category, score], index) => {
                        const IconComponent = getCategoryIcon(category)
                        const percentage = Math.round(((score as number) / 100) * 100) // Assuming score is out of 100
                        const isTop3 = index < 3
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" style={{ color: getCategoryColor(category) }} />
                                <span className="font-medium">{getCategoryName(category)}</span>
                                {isTop3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    Top {index + 1}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{score}/100</div>
                                <div className="text-xs text-gray-500">{percentage}%</div>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reflective Tab */}
          <TabsContent value="reflective" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Tus Respuestas Reflexivas
                </CardTitle>
                <CardDescription>
                  Análisis de tus respuestas abiertas que proporcionan insights adicionales sobre tu perfil profesional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {results.reflective_responses &&
                    Object.entries(results.reflective_responses).map(([questionKey, response]) => {
                      const questionTexts: Record<string, string> = {
                        q31: "¿Qué tipo de actividades te motivan más en el trabajo?",
                        q32: "¿Cómo te ves profesionalmente en 5 años?",
                        q33: "¿Cuál ha sido tu mayor logro personal o profesional?",
                        q34: "¿Cómo sueles enfrentar los desafíos o problemas?",
                        q35: "¿De qué manera contribuyes mejor en un equipo de trabajo?",
                      }
                      return (
                        <div key={questionKey} className="p-4 bg-gray-50 rounded-lg border">
                          <h4 className="font-semibold text-gray-900 mb-2">{questionTexts[questionKey]}</h4>
                          <p className="text-gray-700 text-sm leading-relaxed">{response}</p>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach Dani Tab */}
          <TabsContent value="coach" className="space-y-6">
            <SofiaDaniCoach
              conversationCategory="orientacion_carrera"
              userContext={{
                testType: "RIASEC",
                testResults: results,
                userEmail: isDemoMode ? "demo@example.com" : "user@example.com",
                completedAt: new Date().toISOString(),
              }}
              suggestedAction={`Investiga las carreras sugeridas: ${careerRecommendations.slice(0, 2).join(", ")}`}
            />
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Short Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Corto Plazo (0-2 años)
                  </CardTitle>
                  <CardDescription>Primeros pasos en tu carrera profesional</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerRecommendations.slice(0, 2).map(
                      (
                        career,
                        index, // Display first 2 as immediate
                      ) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-green-800">{career}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Medium Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Mediano Plazo (2-5 años)
                  </CardTitle>
                  <CardDescription>Roles de crecimiento y especialización</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerRecommendations.slice(2, 4).map(
                      (
                        career,
                        index, // Display next 2 as medium
                      ) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200"
                        >
                          <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-blue-800">{career}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Long Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Largo Plazo (5+ años)
                  </CardTitle>
                  <CardDescription>Posiciones de liderazgo y expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {careerRecommendations.slice(4).map(
                      (
                        career,
                        index, // Display remaining as long term
                      ) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-purple-50 rounded border border-purple-200"
                        >
                          <Star className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          <span className="text-sm text-purple-800">{career}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Plan de Acción Personalizado
                </CardTitle>
                <CardDescription>
                  Pasos concretos para desarrollar tu carrera según tu perfil {results.holland_code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Habilidades a Desarrollar</h4>
                    <div className="space-y-2">
                      {developmentAreas.map((area, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Próximos Pasos Sugeridos</h4>
                    <div className="space-y-2">
                      {[
                        "Investigar programas de formación o certificaciones relevantes.",
                        "Buscar mentores en las áreas de interés profesional.",
                        "Participar en proyectos que permitan aplicar y desarrollar nuevas habilidades.",
                        "Asistir a conferencias o webinars del sector.",
                        "Explorar oportunidades de voluntariado o prácticas en campos relacionados.",
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Plan Tab (for the hidden lg:flex trigger) */}
          <TabsContent value="action" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Plan de Acción Personalizado
                </CardTitle>
                <CardDescription>
                  Pasos concretos para desarrollar tu carrera según tu perfil {results.holland_code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Habilidades a Desarrollar</h4>
                    <div className="space-y-2">
                      {developmentAreas.map((area, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Próximos Pasos Sugeridos</h4>
                    <div className="space-y-2">
                      {[
                        "Investigar programas de formación o certificaciones relevantes.",
                        "Buscar mentores en las áreas de interés profesional.",
                        "Participar en proyectos que permitan aplicar y desarrollar nuevas habilidades.",
                        "Asistir a conferencias o webinars del sector.",
                        "Explorar oportunidades de voluntariado o prácticas en campos relacionados.",
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => router.push("/dashboard")} variant="outline">
                Volver al Dashboard
              </Button>
              <Button onClick={() => router.push("/test")} variant="outline">
                Ver Todos los Tests
              </Button>
              <Button onClick={() => window.print()} variant="outline">
                Imprimir Resultados
              </Button>
              <Button
                onClick={() => router.push("/test/soft-skills")}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Siguiente: Test de Soft Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
