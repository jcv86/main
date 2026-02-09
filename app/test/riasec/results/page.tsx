"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { EnhancedCoachFlow } from "@/components/enhanced-coach-flow"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
  Compass,
  Lightbulb,
  Rocket,
  Network,
  Calendar,
  Heart,
  Home,
  ExternalLink,
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
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useSession } from "@/components/session-wrapper"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox" // Added Checkbox
import Link from "next/link" // Added Link
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Added Alert

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
  const { session } = useSession()
  const { toast } = useToast()

  const [results, setResults] = useState<RIASECResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const email = session?.user?.email
      if (!email) {
        toast({
          title: "No autenticado",
          description: "Debes iniciar sesión para ver tus resultados.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const result = await UnifiedTestSystem.loadTestResult(email, "Brújula Vocacional Despega")

      if (result.success && result.data) {
        // Ensure the data structure matches the updated interface
        const processedResults: RIASECResults = {
          R: result.data.results.R,
          I: result.data.results.I,
          A: result.data.results.A,
          S: result.data.results.S,
          E: result.data.results.E,
          C: result.data.results.C,
          holland_code: result.data.results.holland_code,
          overall_score: result.data.results.percentage || 0, // Use 'percentage' or default to 0
          // Assign empty arrays or default values for fields not present in the database
          top_categories: result.data.results.top_categories || [],
          career_matches: result.data.results.career_matches || [],
          strengths: result.data.results.strengths || [],
          development_areas: result.data.results.development_areas || [],
          reflective_responses: result.data.results.reflective_responses || {},
        }
        setResults(processedResults)
      } else {
        toast({
          title: "No se encontraron resultados",
          description: "No tienes resultados guardados para este test.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error loading results:", error)
      toast({
        title: "Error al cargar resultados",
        description: "Hubo un problema cargando tus resultados.",
        variant: "destructive",
      })
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
              <span>Cargando resultados Brújula Vocacional Despega...</span>
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
            <p className="text-gray-600 mb-4">Parece que aún no has completado el test Brújula Vocacional Despega.</p>
            <Button onClick={() => router.push("/test/riasec")}>Realizar Test Brújula Vocacional Despega</Button>
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
                  Resultados Brújula Vocacional Despega
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

        {/* PUENTE DE TRANSICION SECTION */}
        <Card className="mb-6 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Tu Puente de Transición Vocacional
            </CardTitle>
            <CardDescription>
              Tu código Holland es tu brújula hoy. Pero puedes expandir hacia nuevas orientaciones profesionales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-lg mb-2">Eres Ahora</h4>
                <p className="text-sm text-muted-foreground mb-3">Tu orientación vocacional actual</p>
                <div className="text-2xl font-bold text-blue-600">{results.holland_code}</div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-lg mb-2">Puedes Ser</h4>
                <p className="text-sm text-muted-foreground mb-3">Nuevas opciones profesionales</p>
                <div className="text-xs space-y-1">
                  <p>• Orientaciones complementarias</p>
                  <p>• Carreras multidimensionales</p>
                  <p>• Roles más integrados</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-lg mb-2">Cómo Llegas</h4>
                <p className="text-sm text-muted-foreground mb-3">Tu puente de carrera</p>
                <ul className="text-xs space-y-1">
                  <li>1. Explora roles nuevos</li>
                  <li>2. Desarrolla habilidades</li>
                  <li>3. Construye portfolio</li>
                  <li>4. Transiciona estratégicamente</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10 gap-2">
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
                <TabsTrigger value="oportunidades" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Oportunidades</span>
                </TabsTrigger>
                <TabsTrigger value="conexiones" className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  <span className="hidden sm:inline">Conexiones</span>
                </TabsTrigger>
                <TabsTrigger value="reflexion" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span className="hidden sm:inline">Reflexión</span>
                </TabsTrigger>
                <TabsTrigger value="biblioteca" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Biblioteca</span>
                </TabsTrigger>
                <TabsTrigger value="plan-90-dias" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Plan 90 Días</span>
                </TabsTrigger>
                {/* <TabsTrigger value="coach" className="flex items-center gap-2 hidden lg:flex">
                  <Sparkles className="h-4 w-4" />
                  Coach Dani
                </TabsTrigger> */}
                <TabsTrigger value="action" className="flex items-center gap-2 hidden lg:flex">
                  <Target className="h-4 w-4" />
                  Plan
                </TabsTrigger>
                {/* <TabsTrigger value="biblioteca" className="flex items-center gap-2 hidden lg:flex">
                  <BookOpen className="h-4 w-4" />
                  Biblioteca
                </TabsTrigger> */}
              </TabsList>
            </CardContent>
          </Card>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  Resumen Ejecutivo Integral DTC
                </CardTitle>
                <CardDescription>Tu foto 360° vocacional: lo que descubrimos sobre ti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foto 360° del perfil */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600">
                  <h3 className="font-semibold text-lg mb-4 text-blue-900">📸 Tu Foto 360° Vocacional</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-blue-800">Código Holland:</span>
                      <p className="text-gray-700">
                        {results.holland_code} -{" "}
                        {results.holland_code
                          .split("")
                          .map((l) => getCategoryName(l))
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-800">Interés dominante:</span>
                      <p className="text-gray-700">
                        {getCategoryName(results.holland_code[0])} (
                        {results[results.holland_code[0] as keyof typeof results]}/100)
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-800">Perfil:</span>
                      <p className="text-gray-700">
                        {results.holland_code.includes("R") && results.holland_code.includes("I")
                          ? "Pensador práctico"
                          : results.holland_code.includes("A") && results.holland_code.includes("S")
                            ? "Creativo empático"
                            : results.holland_code.includes("E") && results.holland_code.includes("C")
                              ? "Líder organizado"
                              : "Perfil único"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top 5 ideas sobre ti */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-lg mb-4 text-blue-900">💡 Top 5 Ideas Sobre Ti</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Badge className="bg-blue-600">1</Badge>
                      <p className="text-gray-700">
                        <strong>Qué te energiza:</strong>{" "}
                        {results.holland_code[0] === "R"
                          ? "Trabajar con las manos, resolver problemas prácticos, ver resultados tangibles"
                          : results.holland_code[0] === "I"
                            ? "Investigar, analizar datos, entender cómo funcionan las cosas"
                            : results.holland_code[0] === "A"
                              ? "Crear, expresarte, imaginar nuevas posibilidades"
                              : results.holland_code[0] === "S"
                                ? "Ayudar a otros, enseñar, construir relaciones significativas"
                                : results.holland_code[0] === "E"
                                  ? "Liderar proyectos, influir en otros, lograr objetivos ambiciosos"
                                  : "Organizar sistemas, mantener orden, trabajar con precisión"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="bg-blue-600">2</Badge>
                      <p className="text-gray-700">
                        <strong>Cómo te ves:</strong> Como alguien que{" "}
                        {results.holland_code.includes("A")
                          ? "ve el mundo diferente y aporta creatividad"
                          : results.holland_code.includes("S")
                            ? "hace diferencia en la vida de otros"
                            : results.holland_code.includes("E")
                              ? "puede lograr grandes cosas y liderar equipos"
                              : "contribuye con habilidades únicas y valiosas"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="bg-blue-600">3</Badge>
                      <p className="text-gray-700">
                        <strong>Cómo te ven:</strong>{" "}
                        {results.holland_code.includes("R")
                          ? "Práctico, confiable, alguien que resuelve problemas reales"
                          : results.holland_code.includes("I")
                            ? "Analítico, curioso, la persona que tiene las respuestas"
                            : results.holland_code.includes("C")
                              ? "Organizado, detallista, alguien en quien se puede confiar"
                              : "Como alguien con talentos distintivos que aporta valor"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="bg-blue-600">4</Badge>
                      <p className="text-gray-700">
                        <strong>Tu impacto natural:</strong>{" "}
                        {results.holland_code.includes("S")
                          ? "Mejoras el bienestar y desarrollo de las personas a tu alrededor"
                          : results.holland_code.includes("E")
                            ? "Movilizas recursos y personas hacia objetivos importantes"
                            : results.holland_code.includes("A")
                              ? "Inspiras creatividad y nuevas formas de ver el mundo"
                              : "Generas valor a través de tus intereses y habilidades únicas"}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Badge className="bg-blue-600">5</Badge>
                      <p className="text-gray-700">
                        <strong>Tu zona de fricción:</strong>{" "}
                        {results.holland_code.includes("A") && !results.holland_code.includes("C")
                          ? "Estructuras rígidas y rutinas repetitivas te agotan"
                          : results.holland_code.includes("I") && !results.holland_code.includes("S")
                            ? "Situaciones con mucha interacción social constante pueden cansarte"
                            : results.holland_code.includes("E") && !results.holland_code.includes("S")
                              ? "Tareas que no tienen impacto visible pueden frustrarte"
                              : "Actividades que van contra tus intereses naturales drenan tu energía"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mapa de impacto */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-2 border-purple-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Heart className="w-4 h-4 text-purple-600" />
                        Vida Personal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <p>
                        Dedica tiempo a hobbies y actividades que reflejen tu código Holland. Tu vocación no es solo
                        trabajo, es tu forma de vivir.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        Relaciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <p>
                        Comparte tus pasiones con otros. Busca personas que compartan tus intereses para conexiones más
                        profundas.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-green-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-green-600" />
                        Trabajo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700">
                      <p>Busca roles que honren tu código Holland. El trabajo correcto no se siente como trabajo.</p>
                    </CardContent>
                  </Card>
                </div>

                {/* 3 movimientos clave */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-lg mb-4 text-gray-900">🎯 Tus 3 Movimientos Clave (90 días)</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-purple-900">Personal:</p>
                        <p className="text-gray-700 text-sm">
                          Dedica 3 horas semanales a una actividad que refleje tu interés dominante (
                          {getCategoryName(results.holland_code[0])})
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">Relacional:</p>
                        <p className="text-gray-700 text-sm">
                          Conecta con 2-3 personas que compartan tu código Holland para aprender y crecer juntos
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-green-900">Laboral:</p>
                        <p className="text-gray-700 text-sm">
                          Evalúa si tu trabajo actual honra tu perfil. Si no, explora opciones más alineadas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="w-6 h-6 text-purple-600" />
                  Impacto en tu Vida Personal
                </CardTitle>
                <CardDescription>
                  Cómo tus intereses vocacionales influyen en tu vida más allá del trabajo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Users className="w-5 h-5" />
                      Propósito y Satisfacción
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {results.holland_code.includes("S")
                        ? "Tu perfil Social significa que encuentras satisfacción ayudando a otros. Busca formas de servir en tu comunidad, familia y círculo cercano, no solo en el trabajo."
                        : results.holland_code.includes("A")
                          ? "Tu perfil Artístico indica que necesitas expresión creativa para sentirte pleno. Dedica tiempo a hobbies creativos que nutran tu alma, no solo proyectos laborales."
                          : "Tu código Holland revela qué te hace sentir vivo. Asegúrate de que tus actividades diarias (no solo tu trabajo) estén alineadas con estos intereses."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Home className="w-5 h-5" />
                      Relaciones y Familia
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {results.holland_code.includes("E")
                        ? "Tu perfil Emprendedor puede llevar a priorizar logros sobre relaciones. Recuerda que el éxito sin conexión humana está vacío."
                        : results.holland_code.includes("C")
                          ? "Tu perfil Convencional valora el orden y la estabilidad. En familia, equilibra estructura con espontaneidad para crear recuerdos significativos."
                          : "Tus intereses vocacionales influyen en cómo te relacionas. Comparte tus pasiones con tus seres queridos para crear vínculos más profundos."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Heart className="w-5 h-5" />
                      Bienestar Personal
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {results.holland_code.includes("I")
                        ? "Tu perfil Investigador necesita tiempo de reflexión y aprendizaje constante. Dedica tiempo a la lectura y exploración intelectual para tu salud mental."
                        : results.holland_code.includes("R")
                          ? "Tu perfil Realista se beneficia de actividades físicas y trabajo con las manos. El ejercicio y proyectos manuales son esenciales para tu bienestar."
                          : "Tu bienestar personal depende de alimentar tus intereses genuinos. No pospongas lo que te hace feliz 'para después de trabajar'."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Sparkles className="w-5 h-5" />
                      Desarrollo Personal
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Tu código Holland ({results.holland_code}) no solo define tu carrera ideal, sino el tipo de
                      persona que estás destinado a ser. Desarrolla estas facetas en TODOS los aspectos de tu vida:
                      voluntariado, hobbies, relaciones, aprendizaje.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-l-4 border-purple-600">
                  <h3 className="font-semibold text-lg mb-3 text-purple-900">
                    Tu vocación es más que un trabajo, es tu forma de vivir
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    El test RIASEC no es solo para elegir carrera. Es para entender qué te da energía, qué te hace
                    sentir vivo, y cómo puedes diseñar una vida completa que honre tus intereses genuinos. Integra tu
                    código Holland en tus relaciones, tu tiempo libre, y tu crecimiento personal, no solo en tu CV.
                  </p>
                </div>
              </CardContent>
            </Card>

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

          <TabsContent value="plan-90-dias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Plan de Acción 90 Días - Exploración Vocacional RIASEC
                </CardTitle>
                <CardDescription>
                  Explora y valida tu dirección profesional con acciones concretas durante los próximos 3 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Progreso Total del Plan</span>
                    <span className="text-sm text-muted-foreground">0/12 semanas completadas</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {/* Mes 1: Exploración de Intereses */}
                  <AccordionItem value="mes-1">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          1
                        </div>
                        Mes 1: Exploración Profunda de tus Intereses
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">Valida y profundiza en tu código RIASEC dominante</p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 1-2: Validación de Intereses</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m1s1-1" />
                                <label htmlFor="ri-m1s1-1">
                                  Investigar 10 carreras relacionadas con tu código RIASEC dominante
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m1s1-2" />
                                <label htmlFor="ri-m1s1-2">
                                  Realizar 2 entrevistas informativas con profesionales de esas carreras
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m1s1-3" />
                                <label htmlFor="ri-m1s1-3">
                                  Documentar qué aspectos de cada carrera te atraen más y por qué
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 3-4: Experiencias Exploratorias</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m1s2-1" />
                                <label htmlFor="ri-m1s2-1">
                                  Hacer job shadowing o visitar un lugar de trabajo de tu interés
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m1s2-2" />
                                <label htmlFor="ri-m1s2-2">
                                  Tomar un curso online introductorio de un área de interés
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m1s2-3" />
                                <label htmlFor="ri-m1s2-3">
                                  Participar como voluntario en un proyecto relacionado con tu código
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> 2 entrevistas informativas + 1 experiencia práctica exploratoria
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 2: Desarrollo de Habilidades */}
                  <AccordionItem value="mes-2">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          2
                        </div>
                        Mes 2: Desarrollo de Habilidades Clave
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Construye las competencias necesarias para tu dirección vocacional
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 5-6: Identificación de Gaps</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m2s1-1" />
                                <label htmlFor="ri-m2s1-1">
                                  Listar las habilidades más demandadas en tu área de interés
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m2s1-2" />
                                <label htmlFor="ri-m2s1-2">Evaluar tu nivel actual en cada habilidad (1-10)</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m2s1-3" />
                                <label htmlFor="ri-m2s1-3">
                                  Priorizar las 3 habilidades más importantes a desarrollar
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 7-8: Plan de Desarrollo</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m2s2-1" />
                                <label htmlFor="ri-m2s2-1">
                                  Inscribirse en un curso o certificación de una habilidad clave
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m2s2-2" />
                                <label htmlFor="ri-m2s2-2">
                                  Crear un proyecto personal para practicar las habilidades
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m2s2-3" />
                                <label htmlFor="ri-m2s2-3">Buscar un mentor en tu área de interés</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> 1 curso iniciado + proyecto personal en marcha + mentor
                          identificado
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 3: Plan de Carrera */}
                  <AccordionItem value="mes-3">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          3
                        </div>
                        Mes 3: Plan de Carrera Definido
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Consolida tu dirección profesional con un plan de acción concreto
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 9-10: Definición de Metas</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m3s1-1" />
                                <label htmlFor="ri-m3s1-1">
                                  Definir tu meta profesional a 1, 3 y 5 años usando formato SMART
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m3s1-2" />
                                <label htmlFor="ri-m3s1-2">
                                  Crear roadmap de pasos necesarios para alcanzar cada meta
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m3s1-3" />
                                <label htmlFor="ri-m3s1-3">
                                  Identificar posibles obstáculos y estrategias para superarlos
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 11-12: Acción y Networking</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m3s2-1" />
                                <label htmlFor="ri-m3s2-1">
                                  Actualizar CV y LinkedIn alineados con tu dirección profesional
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m3s2-2" />
                                <label htmlFor="ri-m3s2-2">Conectar con 10 profesionales de tu área en LinkedIn</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ri-m3s2-3" />
                                <label htmlFor="ri-m3s2-3">
                                  Aplicar a 3 oportunidades (trabajo, pasantía, voluntariado) en tu área
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Plan de carrera documentado + 10 conexiones + 3 aplicaciones
                          enviadas
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <EnhancedCoachFlow testType="RIASEC" testResults={results} />
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

          <TabsContent value="oportunidades" className="space-y-6">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                  Oportunidades de Desarrollo Vocacional
                </CardTitle>
                <CardDescription>
                  Áreas de crecimiento basadas en tu código Holland {results.holland_code}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Por qué estas oportunidades son relevantes para ti</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Tu perfil vocacional {results.holland_code} con puntuaciones R:{results.R}, I:{results.I}, A:
                    {results.A}, S:{results.S}, E:{results.E}, C:{results.C} indica tus intereses naturales. Estas
                    oportunidades están diseñadas para expandir tu potencial más allá de tu zona de confort.
                  </p>
                </div>

                {/* Área 1: Exploración de Intereses */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Compass className="h-5 w-5 text-blue-600" />
                      1. Exploración de Intereses Complementarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-blue-800">
                        {results.holland_code[0] === "R"
                          ? "Explora el lado artístico o social de tu trabajo técnico. Considera proyectos que combinen tu habilidad práctica con creatividad."
                          : results.holland_code[0] === "I"
                            ? "Aplica tu capacidad analítica a contextos más prácticos o emprendedores. Busca oportunidades donde la investigación se convierta en acción."
                            : results.holland_code[0] === "A"
                              ? "Desarrolla estructura y método en tu creatividad. Aprende gesti��n de proyectos creativos o emprendimiento artístico."
                              : results.holland_code[0] === "S"
                                ? "Integra competencias de liderazgo o emprendimiento en tu vocación de servicio. Considera roles donde puedas iniciar programas sociales."
                                : results.holland_code[0] === "E"
                                  ? "Profundiza en el análisis y la planificación estratégica. Desarrolla tu lado investigativo para tomar mejores decisiones empresariales."
                                  : "Incorpora creatividad e innovación en tu trabajo sistemático. Busca formas de aplicar tu precisión a proyectos disruptivos."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Proyecto Híbrido (1 mes):</strong> Identifica un proyecto que combine tu interés
                            principal con uno de tus intereses más bajos. Ejemplo: Si eres Alto R, haz un proyecto de
                            construcción con impacto social.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Curso de Ampliación:</strong> Toma un curso de 4-8 semanas en un área vocacional
                            diferente a tu código Holland principal.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Job Shadowing:</strong> Pasa un día observando a alguien cuyo código Holland sea tu
                            código invertido (tu letra más baja).
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold mb-1">Recurso Recomendado DTC</p>
                          <p className="text-sm opacity-90">
                            Test de Soft Skills para medir competencias complementarias
                          </p>
                        </div>
                        <Button size="sm" variant="secondary" onClick={() => router.push("/test/soft-skills")}>
                          Hacer Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 2: Desarrollo de Carrera */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-green-600" />
                      2. Aceleración de Carrera
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-green-800">
                        Identifica las 3 carreras sugeridas que más te interesan y crea un plan de desarrollo de 2 años
                        para llegar a la primera de ellas.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Entrevistas Informacionales (5 conversaciones):</strong> Habla con 5 personas que
                            trabajen en las carreras que te interesan. Pregúntales cómo llegaron ahí.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Mapa de Competencias:</strong> Lista las 10 habilidades clave para tu carrera
                            objetivo. Evalúa cuáles tienes y cuáles necesitas desarrollar.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Proyecto de Portfolio:</strong> Crea un proyecto tangible que demuestre tus
                            capacidades en el campo que quieres ingresar.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 3: Networking Estratégico */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      3. Networking Estratégico Vocacional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-purple-800">
                        Construye una red profesional en los campos que te interesan, incluso antes de trabajar en
                        ellos.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>LinkedIn Activo:</strong> Conecta con 20 profesionales en tu campo de interés.
                            Comenta en sus publicaciones durante 30 días.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Comunidades Profesionales:</strong> Únete a 2-3 grupos online (Slack, Discord,
                            foros) de tu industria objetivo.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Eventos y Conferencias:</strong> Asiste a 1 evento presencial o virtual trimestral
                            en tu área de interés vocacional.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 4: Emprendimiento Vocacional */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Rocket className="h-5 w-5 text-orange-600" />
                      4. Emprendimiento Vocacional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-orange-800">
                        No esperes a que alguien te contrate. Crea tu propia oportunidad alineada con tu código Holland.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Proyecto Freelance:</strong> Ofrece tus servicios en Upwork, Fiverr o plataformas
                            locales en tu área de interés vocacional.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Side Project de 90 días:</strong> Dedica 5 horas/semana a un proyecto personal que
                            aplique tu código Holland (blog, app, consultoria, arte, etc.).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Validación de Idea:</strong> Identifica un problema en tu campo de interés y propón
                            una solución. Valídala con 10 personas.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Próximo Paso</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Elige UNA oportunidad de desarrollo vocacional y conviértela en una meta específica con plazo en la
                    sección de Plan de Acción.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("action")}>
                    Ir a Plan de Acción
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conexiones" className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  Conexión con Otros Módulos DTC
                </CardTitle>
                <CardDescription>
                  Cómo la Brújula Vocacional se relaciona con los demás tests del ecosistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">El Ecosistema Completo de Orientación Vocacional</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    RIASEC te muestra QUÉ te interesa, pero necesitas los otros tests para saber CÓMO lo harías, CON
                    QUIÉN trabajarías mejor, y POR QUÉ te motivaría. Juntosthey crear un mapa completo de tu carrera
                    ideal.
                  </p>
                </div>

                {/* Connection Map */}
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-bold text-lg">
                        Brújula Vocacional (RIASEC)
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Tus intereses y vocación profesional</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* DISC */}
                      <Card className="border-2 border-blue-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                              🧭
                            </div>
                            Despega Cerebral (DISC)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded text-sm">
                            <strong className="text-blue-900">Conexión:</strong>
                            <p className="text-blue-800 mt-1">
                              RIASEC te dice QUÉ tipo de trabajo te interesa, DISC te dice CÓMO te comportas en ese
                              trabajo.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alto I (Investigador) en RIASEC + Alto C en DISC = Científico
                            meticuloso. Alto I en RIASEC + Alto D en DISC = Investigador emprendedor que lidera
                            proyectos.
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

                      {/* IE */}
                      <Card className="border-2 border-red-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-lg">
                              ❤️
                            </div>
                            Inteligencia Emocional Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-red-50 p-3 rounded text-sm">
                            <strong className="text-red-900">Conexión:</strong>
                            <p className="text-red-800 mt-1">
                              RIASEC te muestra tus intereses, IE muestra si tienes las competencias emocionales para
                              prosperar en ellos.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alto S (Social) en RIASEC pero baja empatía en IE = necesitas
                            desarrollar IE para trabajar efectivamente con personas.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/emotional-intelligence")}
                          >
                            Hacer Test IE
                          </Button>
                        </CardContent>
                      </Card>

                      {/* MBTI */}
                      <Card className="border-2 border-purple-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                              🧠
                            </div>
                            Mapa de Personalidad Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-purple-50 p-3 rounded text-sm">
                            <strong className="text-purple-900">Conexión:</strong>
                            <p className="text-purple-800 mt-1">
                              RIASEC es sobre intereses externos, MBTI sobre preferencias cognitivas internas.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alto A (Artístico) + INFP = Artista introspectivo. Alto A + ESFP =
                            Artista performático que necesita audiencia.
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

                      {/* Big Five */}
                      <Card className="border-2 border-yellow-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                              ⭐
                            </div>
                            5 Dimensiones Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-yellow-50 p-3 rounded text-sm">
                            <strong className="text-yellow-900">Conexión:</strong>
                            <p className="text-yellow-800 mt-1">
                              Big Five predice si tendrás éxito sostenible en las carreras que RIASEC sugiere.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alto E (Emprendedor) + baja Conscientiousness = riesgo de
                            proyectos sin terminar. Alto E + alta Conscientiousness = emprendedor exitoso y
                            estructurado.
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

                      {/* Soft Skills */}
                      <Card className="border-2 border-pink-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-lg">
                              💡
                            </div>
                            Competencias Blandas Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-pink-50 p-3 rounded text-sm">
                            <strong className="text-pink-900">Conexión:</strong>
                            <p className="text-pink-800 mt-1">
                              RIASEC muestra intereses naturales, Soft Skills muestra habilidades entrenables que puedes
                              desarrollar.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Bajo S (Social) en RIASEC no significa mala comunicación. Soft
                            Skills puede revelar que has desarrollado excelentes habilidades interpersonales a pesar de
                            tu bajo interés por carreras sociales.
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

                      {/* Placeholder */}
                      <Card className="border-2 border-gray-300 opacity-60">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                              🔮
                            </div>
                            Más Tests Próximamente
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            Próximamente: Test de Valores para alinear tu vocación con lo que realmente importa para ti.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Synergy Examples */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Casos de Sinergia Entre Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 1: El Investigador Emprendedor</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>RIASEC:</strong> Alto I + Alto E = Interés en investigación aplicada al negocio
                        </li>
                        <li>
                          • <strong>DISC:</strong> Alto D = Decide rápido, toma riesgos
                        </li>
                        <li>
                          • <strong>Big Five:</strong> Alta Apertura + Alta Conscientiousness = Innovador pero
                          estructurado
                        </li>
                        <li>
                          • <strong>Carrera Ideal:</strong> Fundador de startup tech, Director de I+D, Científico de
                          datos en startups
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 2: El Artista Realista</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>RIASEC:</strong> Alto A + Alto R = Creatividad aplicada a lo tangible
                        </li>
                        <li>
                          • <strong>MBTI:</strong> ISFP = Artista sensorial práctico
                        </li>
                        <li>
                          • <strong>Soft Skills:</strong> Alta resolución de problemas, baja delegación
                        </li>
                        <li>
                          • <strong>Carrera Ideal:</strong> Diseñador industrial, arquitecto, artesano de lujo,
                          diseñador UX
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 3: El Líder Social</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>RIASEC:</strong> Alto S + Alto E = Quiere ayudar y liderar
                        </li>
                        <li>
                          • <strong>IE:</strong> Alta empatía + alta influencia social
                        </li>
                        <li>
                          • <strong>DISC:</strong> Alto I + Alto S = Carismático y colaborativo
                        </li>
                        <li>
                          • <strong>Carrera Ideal:</strong> Director de ONG, HR Executive, Coach ejecutivo, Consultor
                          organizacional
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Recomendación DTC</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Para una orientación vocacional completa, combina RIASEC (intereses) + DISC (comportamiento laboral)
                    + Soft Skills (competencias entrenables). Esto te dará una visión integral de tu carrera ideal.
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
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-pink-600" />
                  Preguntas de Reflexión Vocacional Profunda
                </CardTitle>
                <CardDescription>
                  Conecta los resultados de tu Brújula Vocacional con tu vida y propósito
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Por qué reflexionar sobre tu vocación es crucial</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    RIASEC te muestra tus intereses, pero tu vocación real emerge cuando reflexionas sobre POR QUÉ te
                    interesan, QUÉ significan para ti, y CÓMO se conectan con tu propósito de vida. Estas preguntas
                    están diseñadas para convertir números en claridad vocacional.
                  </p>
                  <div className="bg-white p-4 rounded border-l-4 border-pink-500">
                    <p className="text-sm italic text-gray-700">
                      Tip: Responde con honestidad brutal. No escribas lo que crees que deberías sentir, sino lo que
                      realmente sientes.
                    </p>
                  </div>
                </div>

                {/* Categoría 1: Alineación Vocacional */}
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="alineacion">
                    <AccordionTrigger className="bg-blue-50 px-4 rounded-lg hover:bg-blue-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎯</span>
                        <span className="font-semibold">Alineación Vocacional</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue-900">
                            1. ¿Mi trabajo actual aprovecha mi código Holland {results.holland_code}? ¿En qué
                            porcentaje?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Si tu respuesta es menos del 50%, estás dejando más de la mitad de tu potencial sin usar.
                            ¿Qué cambios puedes hacer?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue-900">
                            2. ¿Qué me impide seguir las carreras sugeridas por mi código Holland?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Si tu respuesta es menos del 50%, estás dejando más de la mitad de tu potencial sin usar.
                            ¿Qué cambios puedes hacer?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue-900">
                            3. ¿Qué actividades del último mes me dieron más energía? ¿Coinciden con mi código Holland?
                          </h4>
                          <p className="text-sm text-gray-600">
                            La vocación auténtica te da energía, no te la quita. Si hay desconexión, ¿por qué?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="barreras">
                    <AccordionTrigger className="bg-orange-50 px-4 rounded-lg hover:bg-orange-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚧</span>
                        <span className="font-semibold">Barreras y Creencias Limitantes</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-orange-900">
                            4. ¿Qué me impide seguir las carreras sugeridas por mi código Holland?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Identifica si son barreras reales (falta de formación) o creencias limitantes ("no soy lo
                            suficientemente bueno").
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
                            5. ¿Qué dirían mis padres/pareja sobre las carreras que me interesan? ¿Me importa su opinión
                            más que la mía?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Muchas personas siguen carreras para complacer a otros, no a sí mismas. ¿Es tu caso?
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
                            6. ¿Tengo miedo de seguir mi vocación real? ¿De qué tengo miedo específicamente?
                          </h4>
                          <p className="text-sm text-gray-600">
                            El miedo más común: "no voy a ganar suficiente dinero". Pero, ¿es eso cierto o es una
                            excusa?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="proposito">
                    <AccordionTrigger className="bg-purple-50 px-4 rounded-lg hover:bg-purple-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">✨</span>
                        <span className="font-semibold">Propósito y Contribución</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple-900">
                            7. ¿Qué problema del mundo me gustaría resolver usando mi código Holland?
                          </h4>
                          <p className="text-sm text-gray-600">
                            La vocación más satisfactoria conecta tus intereses con contribución significativa. ¿Cuál es
                            la tuya?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple-900">
                            8. Si tuviera éxito total en mi vocación, ¿cómo sería el mundo 10 años después?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Piensa en grande. Tu vocación no es solo un trabajo, es tu manera de dejar huella.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple-900">
                            9. ¿A quién admiro que tenga un código Holland similar al mío? ¿Qué puedo aprender de su
                            carrera?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Estudiar trayectorias de éxito en tu área vocacional te muestra posibilidades que no habías
                            considerado.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="accion">
                    <AccordionTrigger className="bg-green-50 px-4 rounded-lg hover:bg-green-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚀</span>
                        <span className="font-semibold">Plan de Acción</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-green-900">
                            10. Si tuviera que dar UN paso concreto hoy hacia mi vocación ideal, ¿cuál sería?
                          </h4>
                          <p className="text-sm text-gray-600">
                            No pienses en grandes cambios. ¿Qué acción pequeña puedes tomar HOY que te acerque a tu
                            código Holland?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Habla con tu Coach IA sobre tu vocación</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Las mejores decisiones vocacionales emergen del diálogo. Comparte tus reflexiones con Dani para
                    obtener perspectivas y un plan de acción personalizado.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("coach")}>
                    Hablar con Coach Dani
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Biblioteca DTC Tab */}
          <TabsContent value="biblioteca" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  Biblioteca DTC Recomendada
                </CardTitle>
                <CardDescription>Recursos personalizados para tu código Holland {results.holland_code}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-3 text-left font-semibold">Área de Desarrollo</th>
                        <th className="border p-3 text-left font-semibold">Recurso Recomendado</th>
                        <th className="border p-3 text-left font-semibold">Por qué te sirve</th>
                        <th className="border p-3 text-left font-semibold">Mini-desafío (7 días)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-3 font-medium text-purple-900">Exploración Vocacional</td>
                        <td className="border p-3">
                          <Link
                            href="/biblioteca/que-hago-con-mi-vida"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            ¿Qué hago con mi vida?
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="border p-3 text-sm">
                          Te ayuda a conectar tus intereses RIASEC con decisiones vocacionales concretas y superar el
                          miedo a elegir "mal"
                        </td>
                        <td className="border p-3 text-sm">
                          Escribe 3 escenarios de vida posibles basados en tu código Holland. ¿Cuál te emociona más?
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border p-3 font-medium text-blue-900">Autoconocimiento Profundo</td>
                        <td className="border p-3">
                          <Link
                            href="/biblioteca/ikigai"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Ikigai: Tu razón de ser
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="border p-3 text-sm">
                          Integra tus intereses RIASEC con tu propósito de vida, no solo con opciones de carrera
                        </td>
                        <td className="border p-3 text-sm">
                          Dibuja tu diagrama Ikigai colocando tu código Holland en el centro. ¿Qué descubres?
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 font-medium text-green-900">Diseño de Carrera</td>
                        <td className="border p-3">
                          <Link
                            href="/biblioteca/designing-your-life"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            Designing Your Life
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="border p-3 text-sm">
                          Usa design thinking para crear múltiples prototipos de vida alineados con tu perfil vocacional
                        </td>
                        <td className="border p-3 text-sm">
                          Crea 3 "planes de vida" alternativos que honren tu código {results.holland_code}. Prueba uno
                          por una semana.
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border p-3 font-medium text-orange-900">Fortalezas Personales</td>
                        <td className="border p-3">
                          <Link
                            href="/biblioteca/gallup-strengthsfinder"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            StrengthsFinder 2.0
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="border p-3 text-sm">
                          Complementa tu código Holland con tus 5 fortalezas naturales para un perfil completo
                        </td>
                        <td className="border p-3 text-sm">
                          Identifica cómo tus fortalezas Gallup se conectan con tu interés{" "}
                          {getCategoryName(results.holland_code[0])}
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 font-medium text-red-900">Toma de Decisiones</td>
                        <td className="border p-3">
                          <Link
                            href="/biblioteca/the-defining-decade"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            The Defining Decade
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="border p-3 text-sm">
                          Te reta a tomar decisiones vocacionales ahora, no "cuando estés listo". Tu perfil RIASEC es tu
                          brújula.
                        </td>
                        <td className="border p-3 text-sm">
                          Toma UNA decisión pequeña esta semana que te acerque a una carrera alineada con tu código
                          Holland
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border p-3 font-medium text-indigo-900">Integración Vida-Trabajo</td>
                        <td className="border p-3">
                          <Link href="/recursos" className="text-blue-600 hover:underline flex items-center gap-1">
                            Explora más recursos DTC
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                        <td className="border p-3 text-sm">
                          Descubre cómo integrar tus intereses vocacionales en TODA tu vida, no solo en el trabajo
                        </td>
                        <td className="border p-3 text-sm">
                          Encuentra una forma de expresar tu código Holland fuera del trabajo (hobby, voluntariado,
                          proyecto personal)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Alert className="mt-6">
                  <Lightbulb className="h-4 w-4" />
                  <AlertTitle>Recuerda</AlertTitle>
                  <AlertDescription>
                    La biblioteca DTC no es para "consumir información", sino para APLICAR lo aprendido a tu vida real.
                    Completa los mini-desafíos y observa cómo tu autoconocimiento se convierte en transformación
                    tangible.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Action Tab */}
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
