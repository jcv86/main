"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Clock,
  Users,
  MessageSquare,
  Target,
  Heart,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  Award,
  ArrowRight,
  BarChart3,
  PieChart,
  ArrowLeft,
  Sparkles,
  Calendar,
  BookOpen,
  MapPin,
  Briefcase,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from "recharts"
import { AiInsightsPanel } from "@/components/ai-insights-panel"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useSession } from "@/components/session-wrapper"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { EnhancedCoachFlow } from "@/components/enhanced-coach-flow"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const categoryIcons = {
  comunicacion: MessageSquare,
  liderazgo: Target,
  trabajo_equipo: Users,
  resolucion_problemas: Lightbulb,
  adaptabilidad: Brain,
  inteligencia_emocional: Heart,
  gestion_tiempo: Clock,
  pensamiento_critico: CheckCircle,
}

const categoryColors = {
  comunicacion: "#3B82F6",
  liderazgo: "#8B5CF6",
  trabajo_equipo: "#10B981",
  resolucion_problemas: "#F59E0B",
  adaptabilidad: "#14B8A6",
  inteligencia_emocional: "#EC4899",
  gestion_tiempo: "#6366F1",
  pensamiento_critico: "#EF4444",
}

const categoryNames = {
  comunicacion: "Comunicación",
  liderazgo: "Liderazgo",
  trabajo_equipo: "Trabajo en Equipo",
  resolucion_problemas: "Resolución de Problemas",
  adaptabilidad: "Adaptabilidad",
  inteligencia_emocional: "Inteligencia Emocional",
  gestion_tiempo: "Gestión del Tiempo",
  pensamiento_critico: "Pensamiento Crítico",
}

export default function SoftSkillsResults() {
  const [testResult, setTestResult] = useState<any>(null)
  const [openResponses, setOpenResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const { session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const user = session?.user

  useEffect(() => {
    loadResults()
  }, [user])

  const loadResults = async () => {
    try {
      setLoading(true)

      const email = user?.email
      if (!email) {
        toast({
          title: "No autenticado",
          description: "Debes iniciar sesión para ver tus resultados.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const result = await UnifiedTestSystem.loadTestResult(email, "Competencias Blandas Despega")

      if (result.success && result.data) {
        setTestResult(result.data)
      } else {
        toast({
          title: "No se encontraron resultados",
          description: "No tienes resultados guardados para este test.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error loading soft skills results:", error)
      toast({
        title: "Error al cargar resultados",
        description: "Hubo un problema cargando tus resultados.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Resultados: Competencias Blandas Despega</h1>
            <p className="text-xl text-gray-600">No se encontraron resultados para esta evaluación.</p>
          </div>
        </div>
      </div>
    )
  }

  const results = testResult.results
  const categoryScores = results.category_scores || {}

  // Prepare data for charts
  const barChartData = Object.entries(categoryScores).map(([category, score]) => ({
    category: categoryNames[category as keyof typeof categoryNames] || category,
    score: score,
    color: categoryColors[category as keyof typeof categoryColors] || "#6B7280",
  }))

  const radarChartData = Object.entries(categoryScores).map(([category, score]) => ({
    category: categoryNames[category as keyof typeof categoryNames] || category,
    score: score,
    fullMark: 100,
  }))

  const pieChartData = Object.entries(categoryScores).map(([category, score]) => ({
    name: categoryNames[category as keyof typeof categoryNames] || category,
    value: score,
    color: categoryColors[category as keyof typeof categoryColors] || "#6B7280",
  }))

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente"
    if (score >= 60) return "Bueno"
    return "Necesita Mejora"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // Dynamically determine top skills for overview and library sections
  const sortedSkills = Object.entries(categoryScores)
    .map(([key, value]) => ({ skill: categoryNames[key as keyof typeof categoryNames] || key, score: value as number }))
    .sort((a, b) => b.score - a.score)

  const topSkills = sortedSkills

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Tests
          </Button>
          <Badge variant="secondary" className="text-sm">
            Competencias Blandas Despega
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resultados: Competencias Blandas Despega</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tu perfil completo de competencias interpersonales y profesionales
          </p>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">{results.overall_score}%</div>
              <div className="text-2xl text-gray-700 mb-4">Puntuación General</div>
              <Badge className={`text-lg px-6 py-2 ${getScoreBadgeColor(results.overall_score)}`}>
                {getScoreLabel(results.overall_score)}
              </Badge>
              <div className="mt-4 max-w-2xl mx-auto">
                <Progress value={results.overall_score} className="h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PUENTE DE TRANSICION SECTION */}
        <Card className="mb-8 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Tu Puente de Desarrollo de Competencias
            </CardTitle>
            <CardDescription>
              Tus competencias ahora. Cómo evolucionan hacia el siguiente nivel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-lg mb-2">Eres Ahora</h4>
                <p className="text-sm text-muted-foreground mb-3">Tu nivel de competencias actual</p>
                <div className="text-2xl font-bold text-blue-600">{results.overall_score}%</div>
                <p className="text-xs text-muted-foreground mt-2">{getScoreLabel(results.overall_score)}</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-lg mb-2">Puedes Ser</h4>
                <p className="text-sm text-muted-foreground mb-3">Competencias más avanzadas</p>
                <div className="text-xs space-y-1">
                  <p>• Mayor profundidad en cada área</p>
                  <p>• Versatilidad interpersonal</p>
                  <p>• Liderazgo más auténtico</p>
                </div>
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-lg mb-2">Cómo Llegas</h4>
                <p className="text-sm text-muted-foreground mb-3">Tu plan de desarrollo</p>
                <ul className="text-xs space-y-1">
                  <li>1. Identifica brecha principal</li>
                  <li>2. Practica deliberadamente</li>
                  <li>3. Busca feedback real</li>
                  <li>4. Integra nuevas formas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="competencies" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Competencias
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Análisis IA
            </TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            <TabsTrigger value="biblioteca" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Biblioteca DTC
            </TabsTrigger>
            <TabsTrigger value="conexiones">Conexiones</TabsTrigger>
            <TabsTrigger value="reflexion">Reflexión</TabsTrigger>
            <TabsTrigger value="plan-90-dias">Plan 90 Días</TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Coach IA
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Resumen Ejecutivo Integral DTC
                </CardTitle>
                <CardDescription>
                  Tu foto 360° de competencias blandas: cómo te relacionas, lideras y colaboras
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foto 360° del Perfil */}
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Tu Perfil de Competencias
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Fortalezas Dominantes</p>
                      <p className="text-sm">
                        {topSkills
                          .slice(0, 2)
                          .map((s) => s.skill)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Áreas en Desarrollo</p>
                      <p className="text-sm">
                        {topSkills
                          .slice(-2)
                          .map((s) => s.skill)
                          .join(", ")}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Enfoque Sugerido</p>
                      <p className="text-sm">Relaciones interpersonales y comunicación</p>
                    </div>
                  </div>
                </div>

                {/* Top 5 Ideas Clave */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />5 Ideas Clave sobre tus Competencias
                  </h3>
                  <div className="space-y-2">
                    <div className="flex gap-3 items-start">
                      <Badge variant="outline" className="mt-1">
                        1
                      </Badge>
                      <p className="text-sm">
                        <strong>Cómo te relacionas:</strong>{" "}
                        {topSkills[0]?.skill === "Comunicación"
                          ? "Priorizas la claridad y el diálogo abierto"
                          : "Buscas construir confianza y colaboración genuina"}
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Badge variant="outline" className="mt-1">
                        2
                      </Badge>
                      <p className="text-sm">
                        <strong>Cómo te ves:</strong> Valoras {topSkills[0]?.skill.toLowerCase()} como herramienta para
                        conectar con otros
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Badge variant="outline" className="mt-1">
                        3
                      </Badge>
                      <p className="text-sm">
                        <strong>Cómo te ven:</strong> Los demás reconocen tu {topSkills[1]?.skill.toLowerCase()} en
                        situaciones de grupo
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Badge variant="outline" className="mt-1">
                        4
                      </Badge>
                      <p className="text-sm">
                        <strong>Tu impacto:</strong> Generas ambientes donde las personas se sienten escuchadas y
                        valoradas
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <Badge variant="outline" className="mt-1">
                        5
                      </Badge>
                      <p className="text-sm">
                        <strong>Tu zona de fricción:</strong> Situaciones de conflicto o crítica pueden desafiarte a
                        mantener el balance emocional
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mapa de Impacto */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Mapa de Impacto en tu Vida
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-background dark:from-blue-950/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Heart className="h-4 w-4 text-blue-600" />
                          Vida Personal
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p>• Relaciones familiares más armoniosas</p>
                        <p>• Mayor autoconocimiento emocional</p>
                        <p>• Límites más claros y sanos</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-50 to-background dark:from-purple-950/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          Relaciones
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p>• Comunicación más auténtica con pareja</p>
                        <p>• Amistades más profundas</p>
                        <p>• Capacidad de resolver conflictos</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-50 to-background dark:from-green-950/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-green-600" />
                          Trabajo
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <p>• Liderazgo más efectivo y empático</p>
                        <p>• Mejor colaboración en equipo</p>
                        <p>• Gestión de conflictos laborales</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* 3 Movimientos Clave para 90 días */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />3 Movimientos Clave para los Próximos 90 Días
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <Badge variant="outline" className="w-fit">
                          Personal
                        </Badge>
                        <CardTitle className="text-base mt-2">Práctica de Escucha Activa</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Dedica 15 min diarios a conversaciones profundas con familia, sin distracciones ni juicios
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                      <CardHeader className="pb-3">
                        <Badge variant="outline" className="w-fit">
                          Relacional
                        </Badge>
                        <CardTitle className="text-base mt-2">Expresión Emocional Honesta</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Comparte con tu pareja/amigos cercanos una emoción difícil por semana, practicando
                        vulnerabilidad
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <Badge variant="outline" className="w-fit">
                          Laboral
                        </Badge>
                        <CardTitle className="text-base mt-2">Feedback Constructivo</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        Solicita feedback 360° a tu equipo sobre tus fortalezas relacionales y áreas de mejora
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Alert className="bg-primary/5 border-primary/20">
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>Recuerda el enfoque DTC</AlertTitle>
                  <AlertDescription>
                    Las competencias blandas son para vivir mejor, no solo para trabajar mejor. Prioriza el impacto en
                    tus relaciones personales, bienestar emocional y calidad de vida. El éxito laboral es una
                    consecuencia natural del desarrollo personal integral.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Puntuaciones por Competencia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={11} interval={0} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, "Puntuación"]} labelStyle={{ color: "#374151" }} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Perfil de Competencias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarChartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" fontSize={10} />
                      <PolarRadiusAxis domain={[0, 100]} tick={false} />
                      <Radar
                        name="Puntuación"
                        dataKey="score"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Areas for Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Award className="h-5 w-5" />
                    Fortalezas Principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.strengths?.slice(0, 3).map((strength: string, index: number) => {
                      const CategoryIcon = categoryIcons[strength as keyof typeof categoryIcons]
                      const score = categoryScores[strength]
                      const analysis = results.detailed_analysis?.[strength]
                      return (
                        <div key={strength} className="bg-white p-4 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                                <span className="text-green-700 font-bold text-sm">{index + 1}</span>
                              </div>
                              {CategoryIcon && <CategoryIcon className="h-5 w-5 text-green-600" />}
                              <span className="font-semibold text-green-800">
                                {categoryNames[strength as keyof typeof categoryNames]}
                              </span>
                            </div>
                            <Badge className="bg-green-100 text-green-800 font-bold">{score}%</Badge>
                          </div>
                          {analysis && (
                            <div className="text-sm text-green-700 mt-2">
                              <p className="mb-2">{analysis.feedback}</p>
                              <div className="flex flex-wrap gap-1">
                                {analysis.examples?.map((example: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-green-300">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <TrendingUp className="h-5 w-5" />
                    Áreas de Mejora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.areas_for_improvement?.slice(0, 3).map((area: string, index: number) => {
                      const CategoryIcon = categoryIcons[area as keyof typeof categoryIcons]
                      const score = categoryScores[area]
                      const analysis = results.detailed_analysis?.[area]
                      return (
                        <div key={area} className="bg-white p-4 rounded-lg border border-orange-200">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                                <span className="text-orange-700 font-bold text-sm">{index + 1}</span>
                              </div>
                              {CategoryIcon && <CategoryIcon className="h-5 w-5 text-orange-600" />}
                              <span className="font-semibold text-orange-800">
                                {categoryNames[area as keyof typeof categoryNames]}
                              </span>
                            </div>
                            <Badge className="bg-orange-100 text-orange-800 font-bold">{score}%</Badge>
                          </div>
                          {analysis && (
                            <div className="text-sm text-orange-700 mt-2">
                              <p className="mb-2">{analysis.feedback}</p>
                              <div className="flex flex-wrap gap-1">
                                {analysis.examples?.map((example: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-orange-300">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Open Responses Analysis */}
            {openResponses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Análisis de Respuestas Detalladas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {openResponses.map((response) => (
                      <Card key={response.id} className="border-purple-200 bg-purple-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-purple-800">{response.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                            <p className="line-clamp-3">{response.response}</p>
                          </div>
                          {response.ai_analysis && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-purple-700">Análisis IA:</span>
                                <Badge className="bg-purple-100 text-purple-800">{response.ai_analysis.score}%</Badge>
                              </div>
                              <p className="text-xs text-purple-700">{response.ai_analysis.feedback}</p>
                              <div className="flex flex-wrap gap-1">
                                {response.ai_analysis.strengths?.map((strength: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs border-purple-300">
                                    {strength}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="competencies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categoryScores).map(([category, score]) => {
                const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons]
                const categoryName = categoryNames[category as keyof typeof categoryNames]
                const color = categoryColors[category as keyof typeof categoryColors]
                const analysis = results.detailed_analysis?.[category]

                return (
                  <Card key={category} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {CategoryIcon && <CategoryIcon className="h-6 w-6" style={{ color }} />}
                          <CardTitle className="text-lg">{categoryName}</CardTitle>
                        </div>
                        <Badge className={`font-bold ${getScoreBadgeColor(score)}`}>{score}%</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Progress value={score} className="h-3" />

                      <div className="text-sm">
                        <div className="font-medium mb-2 flex items-center gap-2">
                          <span className={getScoreColor(score)}>{getScoreLabel(score)}</span>
                        </div>

                        {analysis && (
                          <div className="space-y-3">
                            <p className="text-gray-700">{analysis.feedback}</p>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Evidencias:</h4>
                              <div className="flex flex-wrap gap-1">
                                {analysis.examples?.map((example: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: color, opacity: 0.6 }}
                    />
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <AiInsightsPanel testType="soft-skills" results={results} responses={openResponses} />
          </TabsContent>

          <TabsContent value="oportunidades" className="space-y-6">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                  Oportunidades de Desarrollo en Soft Skills
                </CardTitle>
                <CardDescription>Cómo expandir tus competencias blandas más allá del trabajo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Por qué las Soft Skills trascienden lo laboral</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Las competencias blandas no son solo habilidades profesionales, son capacidades de vida que afectan
                    tus relaciones, tu bienestar emocional y tu impacto en el mundo. Tu perfil actual muestra fortalezas
                    en {results.strengths?.slice(0, 2).join(" y ")}, pero el desarrollo integral requiere crecer en
                    todas las dimensiones.
                  </p>
                </div>

                {/* Área 1: Fortalezas para Profundizar */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-600" />
                      1. Llevar tus Fortalezas al Siguiente Nivel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-green-800">
                        Tus fortalezas actuales en {results.strengths?.slice(0, 2).join(" y ")} son excelentes, pero
                        pueden evolucionar de habilidades personales a capacidades de impacto social y mentoría.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Mentoría Activa:</strong> Identifica a 2 personas que podrían beneficiarse de tus
                            fortalezas y ofréceles mentoría informal (30 min/mes).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Enseñanza Pública:</strong> Escribe un artículo, da una charla o crea contenido
                            sobre tus competencias más fuertes para compartir tu conocimiento.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Desafío de Maestría:</strong> En tu área más fuerte, busca un desafío 10x más
                            difícil que tu uso actual (ejemplo: si eres buen comunicador, presenta en un TEDx).
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 2: Competencias en Desarrollo */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      2. Acelerar Competencias en Desarrollo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-orange-800">
                        Las áreas de mejora ({results.areas_for_improvement?.slice(0, 2).join(", ")}) representan tus
                        mayores oportunidades de crecimiento exponencial.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Entrenamiento Intensivo (21 días):</strong> Elige UNA competencia débil y practícala
                            deliberadamente 15 min/día durante 21 días consecutivos.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Modelo a Seguir:</strong> Identifica a alguien que domine tu área débil y estudia
                            sus comportamientos específicos. Imita 3 acciones concretas.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Accountability Partner:</strong> Encuentra a alguien que te rinda cuentas
                            semanalmente sobre tu progreso en esa competencia.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 3: Integración Vida-Trabajo */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      3. Integración en tu Vida Personal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-blue-800">
                        Las soft skills no son solo para el trabajo. Aplicarlas en tu vida personal transforma tus
                        relaciones, tu familia y tu comunidad.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Comunicación en Casa:</strong> Aplica tus mejores habilidades de comunicación en
                            conversaciones difíciles con familia (no solo en el trabajo).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Liderazgo Comunitario:</strong> Lidera un proyecto en tu comunidad, barrio o grupo
                            social (voluntariado, organización de eventos, etc.).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Empatía Radical:</strong> Durante 1 semana, practica escucha activa 100% con tu
                            pareja, amigos o familia (sin celular, sin interrupciones).
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 4: Impacto y Legado */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      4. Construcción de Impacto y Legado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-purple-800">
                        Las soft skills son el vehículo para crear impacto duradero. ¿Cómo puedes usar tus competencias
                        para dejar un legado positivo?
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Proyecto de Impacto Social:</strong> Inicia o únete a un proyecto que use tus soft
                            skills para resolver un problema real en tu comunidad.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Sistema de Mentoría:</strong> Crea un programa informal de mentoría en tu área de
                            expertise (puede ser online, gratis, 1 hora/mes).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Documentación de Aprendizaje:</strong> Comparte tu proceso de desarrollo de soft
                            skills en un blog, podcast o canal de YouTube para inspirar a otros.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Próximo Paso</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Elige UNA oportunidad de las 4 áreas que más resuene contigo y comprométete a trabajarla durante 30
                    días.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("coach")}>
                    Hablar con Coach IA sobre esto
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
                <CardDescription>Cómo Soft Skills se relaciona con los demás tests del ecosistema DTC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">Soft Skills: Las Habilidades que Multiplican Todo</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Los otros tests te dicen QUIÉN ERES (personalidad, emociones, intereses). Soft Skills te dice QUÉ
                    TAN BIEN PUEDES TRADUCIR ESO EN ACCIÓN EFECTIVA. Son las habilidades entrenables que convierten tu
                    potencial en resultados reales.
                  </p>
                </div>

                {/* Connection Map */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg">
                        Soft Skills (Competencias Entrenables)
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Habilidades que puedes desarrollar con práctica</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* DISC Connection */}
                      <Card className="border-2 border-blue-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                              🎯
                            </div>
                            Despega Cerebral (DISC)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded text-sm">
                            <strong className="text-blue-900">Conexión:</strong>
                            <p className="text-blue-800 mt-1">
                              DISC mide tu estilo natural, Soft Skills mide cuán bien has desarrollado habilidades para
                              adaptarte a otros estilos.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alto D en DISC + alta Comunicación en Soft Skills = Líder directo
                            pero diplomático. Alto D + baja Empatía en Soft Skills = Líder efectivo pero abrasivo.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/disc")}
                          >
                            Ver Test DISC
                          </Button>
                        </CardContent>
                      </Card>

                      {/* IE Connection */}
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
                              IE mide tu capacidad emocional innata, Soft Skills mide cómo la aplicas en el mundo real.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alta IE + baja Comunicación en Soft Skills = Entiendes emociones
                            pero no sabes expresarlas. Baja IE + alta Comunicación = Hablas bien pero sin profundidad
                            emocional.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/emotional-intelligence")}
                          >
                            Ver Test IE
                          </Button>
                        </CardContent>
                      </Card>

                      {/* MBTI Connection */}
                      <Card className="border-2 border-purple-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                              🧠
                            </div>
                            Mapa de Personalidad (MBTI)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-purple-50 p-3 rounded text-sm">
                            <strong className="text-purple-900">Conexión:</strong>
                            <p className="text-purple-800 mt-1">
                              MBTI muestra tus preferencias cognitivas, Soft Skills muestra cuán flexible eres para
                              trabajar fuera de ellas.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> INTJ + alta Colaboración en Soft Skills = Estratega que trabaja
                            bien en equipo. ENFP + baja Gestión del Tiempo = Creativo disperso sin ejecución.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/mbti")}
                          >
                            Ver Test MBTI
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Big Five Connection */}
                      <Card className="border-2 border-green-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">
                              ⭐
                            </div>
                            5 Dimensiones (Big Five)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-green-50 p-3 rounded text-sm">
                            <strong className="text-green-900">Conexión:</strong>
                            <p className="text-green-800 mt-1">
                              Big Five mide rasgos estables, Soft Skills mide habilidades que cambian con entrenamiento.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Baja Extraversion (Big Five) + alta Comunicación (Soft Skills) =
                            Introvertido que aprendió a comunicar bien. Alta Neuroticism + alta Resiliencia = Persona
                            ansiosa pero funcional.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/big-five")}
                          >
                            Ver Test Big Five
                          </Button>
                        </CardContent>
                      </Card>

                      {/* RIASEC Connection */}
                      <Card className="border-2 border-orange-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-lg">
                              💼
                            </div>
                            Brújula Vocacional (RIASEC)
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-orange-50 p-3 rounded text-sm">
                            <strong className="text-orange-900">Conexión:</strong>
                            <p className="text-orange-800 mt-1">
                              RIASEC muestra tus intereses vocacionales, Soft Skills muestra si tienes las competencias
                              para ejecutarlos.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alto Social (RIASEC) + baja Empatía (Soft Skills) = Quieres
                            trabajar con gente pero te falta la habilidad. Alto Investigador + baja Colaboración =
                            Científico brillante pero aislado.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/riasec")}
                          >
                            Ver Test RIASEC
                          </Button>
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
                      Casos de Sinergia: Soft Skills como Multiplicador
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 1: El Líder Técnico que No Conecta</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>DISC:</strong> Alto D+C = Decisivo y analítico
                        </li>
                        <li>
                          • <strong>RIASEC:</strong> Alto Investigador = Ama resolver problemas complejos
                        </li>
                        <li>
                          • <strong>Soft Skills:</strong> Baja Empatía + baja Comunicación = No logra influenciar
                        </li>
                        <li>
                          • <strong>Consecuencia:</strong> Brillante técnicamente pero no asciende a liderazgo senior
                        </li>
                        <li>
                          • <strong>Acción DTC:</strong> Entrenar Empatía y Comunicación para desbloquear su potencial
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 2: El Creativo Sin Estructura</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>MBTI:</strong> ENFP = Innovador y entusiasta
                        </li>
                        <li>
                          • <strong>Big Five:</strong> Alta Openness + Baja Conscientiousness = Ideas sin ejecución
                        </li>
                        <li>
                          • <strong>Soft Skills:</strong> Baja Gestión del Tiempo + baja Resolución de Problemas
                        </li>
                        <li>
                          • <strong>Consecuencia:</strong> Muchos proyectos iniciados, pocos terminados
                        </li>
                        <li>
                          • <strong>Acción DTC:</strong> Desarrollar Gestión del Tiempo para convertir ideas en realidad
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 3: El Colaborador Invisible</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>DISC:</strong> Alto S = Leal, paciente, trabajador en equipo
                        </li>
                        <li>
                          • <strong>IE:</strong> Alta empatía pero baja autoafirmación
                        </li>
                        <li>
                          • <strong>Soft Skills:</strong> Alta Colaboración pero baja Liderazgo + baja Comunicación
                        </li>
                        <li>
                          • <strong>Consecuencia:</strong> Hace todo el trabajo pero otros reciben el crédito
                        </li>
                        <li>
                          • <strong>Acción DTC:</strong> Entrenar Asertividad y Comunicación para visibilizar su valor
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">La Clave del Desarrollo Integral</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Soft Skills son las únicas que puedes entrenar directamente. Tu personalidad (MBTI, Big Five) es
                    relativamente estable, tus intereses (RIASEC) cambian lentamente, pero tus competencias blandas
                    pueden mejorar dramáticamente en 90 días con práctica deliberada.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("oportunidades")}>
                    Ver Oportunidades de Desarrollo
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
                  Preguntas de Reflexión Profunda
                </CardTitle>
                <CardDescription>Convierte tus resultados de Soft Skills en autoconocimiento aplicado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">De Números a Narrativa Personal</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Un test te da puntuaciones, pero solo la reflexión profunda convierte esos números en transformación
                    real. Estas preguntas te ayudarán a entender el "por qué" detrás de tus resultados y diseñar
                    acciones específicas.
                  </p>
                </div>

                {/* Reflexión sobre Fortalezas */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-green-600" />
                      Reflexión sobre tus Fortalezas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        Tus fortalezas principales son: <strong>{results.strengths?.slice(0, 3).join(", ")}</strong>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">
                          1. ¿Cómo desarrollaste estas fortalezas? ¿Fueron naturales o las entrenaste?
                        </h4>
                        <textarea
                          placeholder="Reflexiona sobre el origen de tus fortalezas..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">
                          2. ¿Cuándo fue la última vez que usaste estas fortalezas para ayudar a alguien más?
                        </h4>
                        <textarea
                          placeholder="Describe una situación específica..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">
                          3. ¿Cómo podrías llevar estas fortalezas al siguiente nivel de maestría?
                        </h4>
                        <textarea
                          placeholder="Piensa en desafíos 10x más grandes..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reflexión sobre Áreas de Mejora */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Reflexión sobre Áreas de Mejora
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-sm text-orange-800">
                        Tus mayores oportunidades de crecimiento:{" "}
                        <strong>{results.areas_for_improvement?.slice(0, 3).join(", ")}</strong>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">
                          4. ¿Cuál de tus áreas débiles te ha costado más (oportunidades perdidas, conflictos, etc.)?
                        </h4>
                        <textarea
                          placeholder="Sé honesto sobre el impacto real..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">
                          5. ¿Qué creencias limitantes tienes sobre tu capacidad de mejorar estas áreas?
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          (Ejemplo: "No soy bueno para comunicar", "Nunca he sido organizado", "Eso no es para mí")
                        </p>
                        <textarea
                          placeholder="Identifica tus creencias autolimitantes..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">
                          6. Si dedicaras 15 minutos diarios durante 30 días a UNA competencia, ¿cuál elegirías y por
                          qué?
                        </h4>
                        <textarea
                          placeholder="Elige una y explica tu razonamiento..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reflexión sobre Impacto */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      Reflexión sobre Impacto y Propósito
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">
                          7. ¿Cómo cambiaría tu vida si tuvieras un 10/10 en TODAS las soft skills?
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          (Qué lograrías, qué relaciones mejorarían, qué oportunidades aparecerían)
                        </p>
                        <textarea
                          placeholder="Visualiza tu versión 10/10..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">
                          8. ¿Qué competencia blanda, si la dominaras, multiplicaría más tu impacto en el mundo?
                        </h4>
                        <textarea
                          placeholder="Piensa en impacto, no solo éxito personal..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">
                          9. ¿Quién en tu vida podría beneficiarse más si mejoras tus soft skills? ¿Cómo?
                        </h4>
                        <textarea
                          placeholder="Piensa en personas específicas..."
                          className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reflexión sobre Acción */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      De Reflexión a Acción
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-purple-900 mb-2">
                          10. Si tuvieras que elegir UNA competencia para entrenar intensivamente los próximos 90 días,
                          ¿cuál sería y cuál sería tu primera acción mañana?
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          (Sé ultra específico: no "mejorar comunicación", sino "practicar escucha activa 10 min/día con
                          mi pareja")
                        </p>
                        <textarea
                          placeholder="Compromiso específico y acción inmediata..."
                          className="w-full min-h-[120px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Convierte Reflexión en Acción</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Tus respuestas son solo el inicio. Compártelas con tu Coach IA para diseñar un plan de acción
                    personalizado basado en tus reflexiones.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("coach")}>
                    Hablar con Coach IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan-90-dias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Plan de Acción 90 Días - Desarrollo de Soft Skills
                </CardTitle>
                <CardDescription>
                  Potencia tus habilidades blandas con práctica deliberada durante los próximos 3 meses
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
                  {/* Mes 1: Comunicación y Colaboración */}
                  <AccordionItem value="mes-1">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          1
                        </div>
                        Mes 1: Comunicación y Colaboración
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Mejora tu capacidad de comunicarte efectivamente y trabajar en equipo
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 1-2: Comunicación Efectiva</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m1s1-1" />
                                <label htmlFor="ss-m1s1-1">
                                  Practicar escucha activa: repetir lo escuchado antes de responder
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m1s1-2" />
                                <label htmlFor="ss-m1s1-2">
                                  Dar feedback usando el modelo SBI (Situación-Comportamiento-Impacto)
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m1s1-3" />
                                <label htmlFor="ss-m1s1-3">
                                  Preparar y dar una presentación de 5 minutos sobre un tema profesional
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 3-4: Trabajo en Equipo</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m1s2-1" />
                                <label htmlFor="ss-m1s2-1">Liderar una reunión de equipo o proyecto grupal</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m1s2-2" />
                                <label htmlFor="ss-m1s2-2">Ofrecer ayuda proactiva a 3 colegas en sus proyectos</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m1s2-3" />
                                <label htmlFor="ss-m1s2-3">
                                  Facilitar la resolución de un conflicto o desacuerdo en el equipo
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> 1 presentación completada, 3 feedbacks dados con modelo SBI
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 2: Liderazgo y Adaptabilidad */}
                  <AccordionItem value="mes-2">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          2
                        </div>
                        Mes 2: Liderazgo y Adaptabilidad
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Desarrolla tu capacidad de influir positivamente y adaptarte al cambio
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 5-6: Habilidades de Liderazgo</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m2s1-1" />
                                <label htmlFor="ss-m2s1-1">Mentorear o guiar a un colega junior por 2 semanas</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m2s1-2" />
                                <label htmlFor="ss-m2s1-2">
                                  Tomar la iniciativa en un proyecto sin que te lo pidan
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m2s1-3" />
                                <label htmlFor="ss-m2s1-3">
                                  Practicar delegar una tarea importante y dar seguimiento
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 7-8: Adaptabilidad y Resiliencia</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m2s2-1" />
                                <label htmlFor="ss-m2s2-1">
                                  Aprender una nueva herramienta o tecnología en tu campo
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m2s2-2" />
                                <label htmlFor="ss-m2s2-2">
                                  Documentar cómo manejaste un cambio inesperado y qué aprendiste
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m2s2-3" />
                                <label htmlFor="ss-m2s2-3">
                                  Pedir feedback sobre tu flexibilidad y áreas de mejora
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> 1 persona mentoreada, 1 nueva herramienta dominada
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 3: Pensamiento Crítico e Integración */}
                  <AccordionItem value="mes-3">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          3
                        </div>
                        Mes 3: Pensamiento Crítico e Integración
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Agudiza tu pensamiento analítico e integra todas tus soft skills
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 9-10: Pensamiento Crítico</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m3s1-1" />
                                <label htmlFor="ss-m3s1-1">
                                  Analizar un problema complejo usando el método de los 5 Porqués
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m3s1-2" />
                                <label htmlFor="ss-m3s1-2">
                                  Proponer una mejora de proceso basada en datos y análisis
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m3s1-3" />
                                <label htmlFor="ss-m3s1-3">
                                  Practicar tomar decisiones documentando pros, contras y criterios
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 11-12: Integración de Soft Skills</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m3s2-1" />
                                <label htmlFor="ss-m3s2-1">
                                  Crear un portafolio de evidencias de tus soft skills desarrolladas
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m3s2-2" />
                                <label htmlFor="ss-m3s2-2">Obtener testimonios de 3 colegas sobre tu crecimiento</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="ss-m3s2-3" />
                                <label htmlFor="ss-m3s2-3">
                                  Diseñar plan de desarrollo continuo para el próximo trimestre
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Portafolio de soft skills + 3 testimonios + plan siguiente
                          trimestre
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biblioteca" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Biblioteca DTC Recomendada
                </CardTitle>
                <CardDescription>
                  Recursos seleccionados específicamente para desarrollar tus competencias blandas en la vida real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Área de Desarrollo</TableHead>
                        <TableHead>Recurso Recomendado</TableHead>
                        <TableHead>¿Por qué es relevante para ti?</TableHead>
                        <TableHead className="w-[300px]">Mini-Desafío (7 días)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="mb-1">
                            Comunicación
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Cómo te relacionas</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">📘 "Comunicación No Violenta" - Marshall Rosenberg</p>
                            <p className="text-xs text-muted-foreground">Libro + Guía práctica</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          Tu perfil muestra fortaleza en {topSkills[0]?.skill}. Este libro te ayudará a profundizar en
                          comunicación empática, especialmente útil en conversaciones difíciles con familia o pareja.
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-2">
                            <p className="font-medium">Aplicación inmediata:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                              <li>Identifica 3 necesidades no expresadas en tu relación más importante</li>
                              <li>Practica escucha sin juzgar durante 1 conversación diaria</li>
                              <li>Expresa una emoción difícil usando el método CNV</li>
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="mb-1">
                            Inteligencia Emocional
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Autoconocimiento</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">🎧 Podcast "The Happiness Lab" - Dr. Laurie Santos</p>
                            <p className="text-xs text-muted-foreground">Yale University</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          Complementa tu desarrollo en {topSkills[1]?.skill} con ciencia del bienestar aplicada.
                          Episodios de 30 min sobre emociones, relaciones y propósito personal.
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-2">
                            <p className="font-medium">Mini-desafío:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                              <li>Escucha 3 episodios sobre manejo emocional</li>
                              <li>Implementa 1 práctica de gratitud diaria durante 7 días</li>
                              <li>Comparte 1 insight con alguien cercano</li>
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="mb-1">
                            Liderazgo
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Influencia positiva</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">🎥 Curso "Liderar con Propósito" - Simón Sinek</p>
                            <p className="text-xs text-muted-foreground">MasterClass</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          Tu fortaleza en {topSkills[2]?.skill} te posiciona como líder natural. Este curso te ayudará a
                          liderar primero en tu familia/comunidad, luego en lo laboral.
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-2">
                            <p className="font-medium">Acción concreta:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                              <li>Define tu "por qué" personal (más allá del trabajo)</li>
                              <li>Lidera 1 proyecto familiar o comunitario</li>
                              <li>Aplica principios de liderazgo empático en 3 conversaciones</li>
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="mb-1">
                            Trabajo en Equipo
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Colaboración efectiva</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">📚 "Los 5 Lenguajes del Amor" - Gary Chapman</p>
                            <p className="text-xs text-muted-foreground">Aplicable a todas las relaciones</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          Aunque el título menciona "amor", este libro es fundamental para entender colaboración en
                          cualquier relación (pareja, familia, equipo). Alinea con tu perfil relacional.
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-2">
                            <p className="font-medium">Experimento:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                              <li>Identifica tu lenguaje principal y el de 3 personas cercanas</li>
                              <li>Practica 1 acción en el lenguaje de cada persona durante 7 días</li>
                              <li>Observa cambios en calidad de las interacciones</li>
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="mb-1">
                            Resolución de Conflictos
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Conversaciones difíciles</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">🎬 Taller Online "Difficult Conversations" - Harvard</p>
                            <p className="text-xs text-muted-foreground">2 horas de video + ejercicios</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          Basándote en tu área de desarrollo, este taller te dará herramientas prácticas para
                          conversaciones incómodas en familia, pareja o trabajo sin dañar la relación.
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-2">
                            <p className="font-medium">Práctica real:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                              <li>Prepara 1 conversación difícil pendiente usando el framework</li>
                              <li>Practica con un amigo antes de la conversación real</li>
                              <li>Ten la conversación y reflexiona sobre el proceso</li>
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          <Badge variant="outline" className="mb-1">
                            Desarrollo Integral
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">Crecimiento holístico</p>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm">📱 App "Headspace" - Meditación y Mindfulness</p>
                            <p className="text-xs text-muted-foreground">+ Módulos de relaciones</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          Las competencias blandas requieren presencia y autoconciencia. Esta app tiene módulos
                          específicos sobre relaciones, comunicación y manejo emocional aplicados a tu vida diaria.
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="space-y-2">
                            <p className="font-medium">Rutina de 7 días:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                              <li>10 min de meditación matutina antes de revisar el celular</li>
                              <li>Completa módulo "Relaciones Conscientes"</li>
                              <li>Practica 1 ejercicio de respiración antes de conversaciones importantes</li>
                            </ul>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <Alert className="mt-6 bg-primary/5 border-primary/20">
                  <BookOpen className="h-4 w-4" />
                  <AlertTitle>Enfoque DTC en Recursos</AlertTitle>
                  <AlertDescription>
                    Todos estos recursos están seleccionados con enfoque "vida personal primero". Los mini-desafíos te
                    invitan a aplicar las competencias en tus relaciones familiares, pareja y bienestar personal antes
                    que en el contexto laboral. El desarrollo profesional será una consecuencia natural de tu
                    crecimiento personal.
                  </AlertDescription>
                </Alert>

                <div className="mt-6 flex gap-4">
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href="/recursos">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver Biblioteca Completa
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href="/metas">
                      <Target className="h-4 w-4 mr-2" />
                      Crear Meta de Aprendizaje
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <EnhancedCoachFlow testType="Soft Skills" testResults={results} userEmail={user?.email || ""} />
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-8 border-t">
          <Button
            onClick={() => (window.location.href = "/test/soft-skills")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Repetir Evaluación
          </Button>
          <Button onClick={() => (window.location.href = "/dashboard")} className="flex items-center gap-2">
            Volver al Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => (window.location.href = "/test")}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Otras Evaluaciones
          </Button>
        </div>
      </div>
    </div>
  )
}
