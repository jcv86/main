"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"
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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import SofiaDaniCoach from "@/components/sofia-dani-coach"
import { aiCoach } from "@/lib/ai-coach"
import { useSession } from "@/components/session-wrapper"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Brain, Target, Users, Award, BookOpen, Zap, Sparkles, Download, Share2, MessageCircle, BarChart3, PieChartIcon, Activity, Lightbulb, Star, CheckCircle, AlertCircle, Calendar, Clock, TrendingUp, CheckCircle2, ArrowRight, Plus } from 'lucide-react'

interface MBTIResult {
  type: string
  type_name: string
  type_description: string
  scores: {
    E: number
    I: number
    S: number
    N: number
    T: number
    F: number
    J: number
    P: number
  }
  dominant_function: string
  auxiliary_function: string
  tertiary_function: string
  inferior_function: string
  traits: string[]
  strengths: string[]
  challenges: string[]
  career_recommendations: string[]
  famous_people: string[]
  compatibility: {
    best_matches: string[]
    challenging_matches: string[]
  }
  development_areas: string[]
  leadership_style: string
  communication_style: string
  open_responses?: Record<string, string>
}

function MBTIResultsContent() {
  const [results, setResults] = useState<MBTIResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [aiInterpretation, setAiInterpretation] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [hybridInsights, setHybridInsights] = useState<any>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([])
  const [userGoals, setUserGoals] = useState<any[]>([])
  const [completedTests, setCompletedTests] = useState<string[]>([])
  const { user } = useSession()
  const { toast } = useToast()

  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    if (isDemo) {
      loadDemoResults()
    } else {
      checkUserAndLoadResults()
    }
  }, [isDemo])

  const checkUserAndLoadResults = async () => {
    try {
      const localSession = localStorage.getItem("dtc_session")
      if (localSession) {
        const sessionData = JSON.parse(localSession)
        if (sessionData.authenticated && sessionData.user) {
          setUserEmail(sessionData.user.email)
          await loadUserResults(sessionData.user.email)
          return
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
        await loadUserResults(user.email || "")
      } else {
        router.push("/auth")
      }
    } catch (error) {
      console.error("Error checking user session:", error)
      router.push("/auth")
    }
  }

  const loadUserResults = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", email)
        .eq("test_name", "MBTI")
        .order("completed_at", { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        setResults(data[0].results)
        await loadAIInterpretation(email)
        // Cargar datos de Hybrid Insights y otros DTC
        await loadHybridInsights(email)
        await loadRecommendedBooks(email)
        await loadUserGoals(email)
        await loadCompletedTests(email)
      } else {
        router.push("/test/mbti")
      }
    } catch (error) {
      console.error("Error loading results:", error)
      router.push("/test/mbti")
    } finally {
      setLoading(false)
    }
  }

  const loadDemoResults = () => {
    const demoResults: MBTIResult = {
      type: "ENFP",
      type_name: "El Activista",
      type_description:
        "Entusiasta, creativo y sociable. Siempre busca nuevas posibilidades y conexiones entre ideas y personas.",
      scores: { E: 18, I: 9, S: 8, N: 19, T: 11, F: 16, J: 9, P: 18 },
      dominant_function: "Intuición Extrovertida (Ne)",
      auxiliary_function: "Sentimiento Introvertido (Fi)",
      tertiary_function: "Pensamiento Extrovertido (Te)",
      inferior_function: "Sensación Introvertida (Si)",
      traits: ["Entusiasta", "Creativo", "Empático", "Flexible", "Inspirador"],
      strengths: [
        "Excelente capacidad para generar ideas innovadoras",
        "Habilidad natural para motivar e inspirar a otros",
        "Adaptabilidad y flexibilidad ante cambios",
        "Fuerte empatía y comprensión interpersonal",
        "Visión optimista y orientada al futuro",
      ],
      challenges: [
        "Tendencia a procrastinar en tareas rutinarias",
        "Dificultad para mantener el foco en proyectos a largo plazo",
        "Puede ser demasiado sensible a las críticas",
        "Tendencia a sobrecomprometerse con múltiples proyectos",
      ],
      career_recommendations: [
        "Consultor de Innovación",
        "Director Creativo",
        "Coach de Vida",
        "Psicólogo Organizacional",
        "Emprendedor Social",
        "Facilitador de Cambio",
      ],
      famous_people: ["Robin Williams", "Ellen DeGeneres", "Walt Disney", "Mark Twain"],
      compatibility: {
        best_matches: ["INTJ", "INFJ", "ENFJ"],
        challenging_matches: ["ISTJ", "ESTJ", "ISFJ"],
      },
      development_areas: [
        "Mejorar habilidades de planificación y organización",
        "Desarrollar mayor tolerancia a la rutina",
        "Fortalecer la capacidad de seguimiento en proyectos",
        "Aprender a manejar mejor las críticas constructivas",
      ],
      leadership_style: "Inspiracional y visionario, motiva a través del entusiasmo y la creatividad",
      communication_style:
        "Expresivo, empático y orientado a las personas, prefiere conversaciones profundas y significativas",
    }

    setResults(demoResults)
    setUserEmail("demo@example.com")
    // Cargar datos de Hybrid Insights y otros DTC en demo
    setHybridInsights({
      "ENFP": {
        "executive_summary": "Tu visión y creatividad son tus mayores activos. Enfócate en canalizar esta energía para proyectos concretos y de impacto.",
        "top_5_ideas": [
          "Aprovecha tu habilidad natural para inspirar a otros en roles de liderazgo o formación.",
          "Desarrolla estructuras y planes de acción para tus ideas innovadoras.",
          "Busca ambientes de trabajo dinámicos que fomenten la experimentación.",
          "Conecta tu empatía con la resolución de problemas, buscando soluciones centradas en las personas.",
          "Lee sobre gestión de proyectos para dar estructura a tu entusiasmo."
        ],
        "next_steps": [
          { "title": "Test de Inteligencia Emocional", "description": "Complementa tu MBTI con habilidades emocionales.", "link": "/test/emotional-intelligence" },
          { "title": "Test RIASEC", "description": "Identifica carreras alineadas con tu MBTI.", "link": "/test/riasec" }
        ]
      }
    });
    setRecommendedBooks([
      { title: "Creativity, Inc.", author: "Ed Catmull", type: "ENFP" },
      { title: "Mindset: The New Psychology of Success", author: "Carol S. Dweck", type: "ENFP" }
    ]);
    setUserGoals([
      { id: 1, name: "Lanzar un proyecto personal creativo", status: "active", type: "ENFP" },
      { id: 2, name: "Mejorar mis habilidades de planificación", status: "active", type: "ENFP" }
    ]);
    setCompletedTests(["MBTI", "EI", "RIASEC"]);
    setLoading(false)
  }

  const loadAIInterpretation = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("ai_interpretations")
        .select("*")
        .eq("user_email", email)
        .eq("test_name", "MBTI")
        .order("generated_at", { ascending: false })
        .limit(1)

      if (error) throw error

      if (data && data.length > 0) {
        setAiInterpretation(data[0].interpretation)
      } else {
        await generateAIInterpretation(email)
      }
    } catch (error) {
      console.error("Error loading AI interpretation:", error)
    }
  }

  const generateAIInterpretation = async (email: string) => {
    if (!results) return

    try {
      setLoadingAI(true)
      const interpretation = await aiCoach.interpretTestResults(email, "MBTI", results)
      setAiInterpretation(interpretation)

      // Save to database
      await supabase.from("ai_interpretations").insert({
        user_email: email,
        test_name: "MBTI",
        test_results: results,
        interpretation: interpretation,
        model_version: "gpt-4o",
      })
    } catch (error) {
      console.error("Error generating AI interpretation:", error)
      setAiInterpretation("No se pudo generar la interpretación con IA en este momento.")
    } finally {
      setLoadingAI(false)
    }
  }

  // Funciones para cargar datos DTC
  const loadHybridInsights = async (email: string) => {
    setLoadingInsights(true)
    try {
      const { data, error } = await supabase
        .from("hybrid_insights")
        .select("*")
        .eq("user_email", email)
        .eq("test_name", "MBTI")
        .order("created_at", { ascending: false })
        .limit(1)

      if (error) throw error
      if (data && data.length > 0) {
        setHybridInsights(data[0])
      } else {
        // Si no hay insights guardados, generarlos
        await generateHybridInsights(email)
      }
    } catch (error) {
      console.error("Error loading hybrid insights:", error)
    } finally {
      setLoadingInsights(false)
    }
  }

  const generateHybridInsights = async (email: string) => {
    if (!results) return

    try {
      setLoadingInsights(true)
      const insights = await aiCoach.generateHybridInsights(email, "MBTI", results)
      setHybridInsights(insights)

      // Guardar en la base de datos
      await supabase.from("hybrid_insights").insert({
        user_email: email,
        test_name: "MBTI",
        test_results: results,
        ...insights,
      })
    } catch (error) {
      console.error("Error generating hybrid insights:", error)
      toast({
        title: "Error",
        description: "No se pudo generar tu resumen ejecutivo con IA.",
        variant: "destructive",
      })
    } finally {
      setLoadingInsights(false)
    }
  }

  const loadRecommendedBooks = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("recommended_books")
        .select("*")
        .eq("user_email", email)
        .eq("test_name", "MBTI")
        .order("created_at", { ascending: false })
        .limit(5) // Limitar a 5 libros

      if (error) throw error
      if (data && data.length > 0) {
        setRecommendedBooks(data)
      }
    } catch (error) {
      console.error("Error loading recommended books:", error)
    }
  }

  const loadUserGoals = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_email", email)
        .eq("related_test", "MBTI")
        .order("created_at", { ascending: false })
        .limit(5) // Limitar a 5 metas

      if (error) throw error
      if (data && data.length > 0) {
        setUserGoals(data)
      }
    } catch (error) {
      console.error("Error loading user goals:", error)
    }
  }

  const loadCompletedTests = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("completed_tests")
        .select("test_name")
        .eq("user_email", email)
        .order("completed_at", { ascending: false })

      if (error) throw error
      if (data && data.length > 0) {
        setCompletedTests(data.map(t => t.test_name))
      }
    } catch (error) {
      console.error("Error loading completed tests:", error)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus resultados MBTI...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">Completa el test MBTI para ver tus resultados</p>
            <Button onClick={() => router.push("/test/mbti")}>Realizar Test</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Preparar datos para gráficos
  const dimensionData = [
    {
      name: "E vs I",
      E: results.scores.E,
      I: results.scores.I,
      preference: results.scores.E > results.scores.I ? "Extraversión" : "Introversión",
    },
    {
      name: "S vs N",
      S: results.scores.S,
      N: results.scores.N,
      preference: results.scores.S > results.scores.N ? "Sensación" : "Intuición",
    },
    {
      name: "T vs F",
      T: results.scores.T,
      F: results.scores.F,
      preference: results.scores.T > results.scores.F ? "Pensamiento" : "Sentimiento",
    },
    {
      name: "J vs P",
      J: results.scores.J,
      P: results.scores.P,
      preference: results.scores.J > results.scores.P ? "Juicio" : "Percepción",
    },
  ]

  const radarData = [
    { dimension: "Extraversión", value: results.scores.E, fullMark: 27 },
    { dimension: "Intuición", value: results.scores.N, fullMark: 27 },
    { dimension: "Sentimiento", value: results.scores.F, fullMark: 27 },
    { dimension: "Percepción", value: results.scores.P, fullMark: 27 },
  ]

  const pieData = [
    { name: "Extraversión", value: results.scores.E, color: "#10B981" },
    { name: "Introversión", value: results.scores.I, color: "#06B6D4" },
    { name: "Sensación", value: results.scores.S, color: "#8B5CF6" },
    { name: "Intuición", value: results.scores.N, color: "#F59E0B" },
    { name: "Pensamiento", value: results.scores.T, color: "#EF4444" },
    { name: "Sentimiento", value: results.scores.F, color: "#84CC16" },
    { name: "Juicio", value: results.scores.J, color: "#F97316" },
    { name: "Percepción", value: results.scores.P, color: "#EC4899" },
  ]

  const functionData = [
    { name: "Dominante", function: results.dominant_function, strength: 90 },
    { name: "Auxiliar", function: results.auxiliary_function, strength: 70 },
    { name: "Terciaria", function: results.tertiary_function, strength: 40 },
    { name: "Inferior", function: results.inferior_function, strength: 20 },
  ]

  const COLORS = ["#10B981", "#06B6D4", "#8B5CF6", "#F59E0B", "#EF4444", "#84CC16", "#F97316", "#EC4899"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Resultados MBTI</h1>
              <p className="text-gray-600">Tu tipo de personalidad Myers-Briggs completo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDemo && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Modo Demo
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Type Overview */}
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {results.type}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{results.type_name}</h2>
                  <p className="text-gray-600">{results.type_description}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-green-100 text-green-700 mb-2">
                  Tipo de Personalidad
                </Badge>
                <div className="flex flex-wrap gap-1 justify-end">
                  {results.traits.slice(0, 3).map((trait, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="executive">DTC</TabsTrigger>
            <TabsTrigger value="plan90">Plan 90d</TabsTrigger>
            <TabsTrigger value="biblioteca">Libros</TabsTrigger>
            <TabsTrigger value="metas">Metas</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
            <TabsTrigger value="ai-coach">Coach IA</TabsTrigger>
            <TabsTrigger value="next-steps">Siguientes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dimension Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    Preferencias por Dimensión
                  </CardTitle>
                  <CardDescription>Tus tendencias en cada par de dimensiones MBTI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dimensionData.map((dimension, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{dimension.name}</span>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            {dimension.preference}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{dimension.name.split(" vs ")[0]}</span>
                              <span>
                                {dimension.name === "E vs I"
                                  ? dimension.E
                                  : dimension.name === "S vs N"
                                    ? dimension.S
                                    : dimension.name === "T vs F"
                                      ? dimension.T
                                      : dimension.J}
                              </span>
                            </div>
                            <Progress
                              value={
                                dimension.name === "E vs I"
                                  ? (dimension.E / 27) * 100
                                  : dimension.name === "S vs N"
                                    ? (dimension.S / 27) * 100
                                    : dimension.name === "T vs F"
                                      ? (dimension.T / 27) * 100
                                      : (dimension.J / 27) * 100
                              }
                              className="h-2"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{dimension.name.split(" vs ")[1]}</span>
                              <span>
                                {dimension.name === "E vs I"
                                  ? dimension.I
                                  : dimension.name === "S vs N"
                                    ? dimension.N
                                    : dimension.name === "T vs F"
                                      ? dimension.F
                                      : dimension.P}
                              </span>
                            </div>
                            <Progress
                              value={
                                dimension.name === "E vs I"
                                  ? (dimension.I / 27) * 100
                                  : dimension.name === "S vs N"
                                    ? (dimension.N / 27) * 100
                                    : dimension.name === "T vs F"
                                      ? (dimension.F / 27) * 100
                                      : (dimension.P / 27) * 100
                              }
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Functions Hierarchy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                    Jerarquía de Funciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {functionData.map((func, index) => (
                      <Card
                        key={index}
                        className={`border-l-4 ${index === 0 ? "border-l-green-500" : index === 1 ? "border-l-blue-500" : index === 2 ? "border-l-yellow-500" : "border-l-red-500"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{func.name}</h3>
                            <Badge variant="secondary">{func.strength}%</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{func.function}</p>
                          <Progress value={func.strength} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Challenges */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Fortalezas Naturales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Desafíos a Considerar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="executive" className="space-y-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Resumen Ejecutivo DTC - {results?.type}
                </CardTitle>
                <CardDescription>
                  Tu foto rápida de personalidad MBTI y plan de acción en una página
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foto Rápida */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    📸 Foto Rápida de tu Personalidad MBTI
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Tu Tipo</p>
                      <p className="text-2xl font-bold text-green-700">{results?.type} - {results?.type_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Función Dominante</p>
                      <p className="font-medium text-green-600">{results?.dominant_function}</p>
                    </div>
                  </div>
                </div>

                {/* Top 5 Ideas Clave */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">🎯 Top 5 Ideas Clave para Tu Carrera</h3>
                  <div className="space-y-3">
                    {results && getMBTIKeyInsights(results.type).map((insight, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-muted/50 rounded-lg border">
                        <span className="font-bold text-primary text-lg">{idx + 1}.</span>
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan DTC en Una Página */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">📋 Tu Plan DTC en Una Página</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-600" />
                          <p className="font-medium text-sm">Esta Semana</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Completa el test de Inteligencia Emocional para complementar tu perfil MBTI
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <p className="font-medium text-sm">Este Mes</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Lee 1 libro recomendado de tu biblioteca personalizada según tu tipo
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <p className="font-medium text-sm">Este Trimestre</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Define 1 meta de desarrollo que aproveche tus fortalezas MBTI
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Perfil de Personalidad (Radar)
                  </CardTitle>
                  <CardDescription>Visualización de tus preferencias dominantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dimension" />
                        <PolarRadiusAxis angle={90} domain={[0, 27]} />
                        <Radar name="Puntuación" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Comparación de Dimensiones
                  </CardTitle>
                  <CardDescription>Puntuaciones por cada dimensión MBTI</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dimensionData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 27]} />
                        <YAxis dataKey="name" type="category" width={60} />
                        <Tooltip />
                        <Bar dataKey="E" stackId="a" fill="#10B981" />
                        <Bar dataKey="I" stackId="a" fill="#06B6D4" />
                        <Bar dataKey="S" stackId="b" fill="#8B5CF6" />
                        <Bar dataKey="N" stackId="b" fill="#F59E0B" />
                        <Bar dataKey="T" stackId="c" fill="#EF4444" />
                        <Bar dataKey="F" stackId="c" fill="#84CC16" />
                        <Bar dataKey="J" stackId="d" fill="#F97316" />
                        <Bar dataKey="P" stackId="d" fill="#EC4899" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-purple-600" />
                  Distribución de Puntuaciones
                </CardTitle>
                <CardDescription>Proporción de cada característica en tu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Communication and Leadership Style */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    Estilo de Comunicación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{results.communication_style}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Estilo de Liderazgo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{results.leadership_style}</p>
                </CardContent>
              </Card>
            </div>

            {/* Open Responses */}
            {results.open_responses && Object.keys(results.open_responses).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Tus Respuestas Abiertas
                  </CardTitle>
                  <CardDescription>Análisis de tus respuestas personalizadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results.open_responses).map(([questionId, response], index) => {
                      const questionTexts = {
                        "7": "Situación energizante en el trabajo",
                        "14": "Enfoque para proyectos nuevos",
                        "21": "Decisión difícil que afectaba a otros",
                        "27": "Organización y gestión del tiempo",
                      }
                      return (
                        <div key={questionId} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h4 className="font-semibold text-yellow-800 mb-2">
                            {questionTexts[questionId as keyof typeof questionTexts] || `Pregunta ${questionId}`}
                          </h4>
                          <p className="text-yellow-700 text-sm italic">"{response}"</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Function Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Explicación de Funciones Cognitivas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700">Función Dominante</h4>
                    <p className="text-sm text-gray-600 mb-2">{results.dominant_function}</p>
                    <p className="text-xs text-gray-500">
                      Tu función más fuerte y desarrollada, la que usas con mayor frecuencia y confianza.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-700">Función Auxiliar</h4>
                    <p className="text-sm text-gray-600 mb-2">{results.auxiliary_function}</p>
                    <p className="text-xs text-gray-500">
                      Tu función de apoyo, que equilibra y complementa tu función dominante.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-yellow-700">Función Terciaria</h4>
                    <p className="text-sm text-gray-600 mb-2">{results.tertiary_function}</p>
                    <p className="text-xs text-gray-500">
                      Se desarrolla en la mediana edad, puede ser fuente de crecimiento personal.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700">Función Inferior</h4>
                    <p className="text-sm text-gray-600 mb-2">{results.inferior_function}</p>
                    <p className="text-xs text-gray-500">
                      Tu punto débil, pero también fuente de aspiración y desarrollo.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Analysis Tab */}
          <TabsContent value="ai-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  Interpretación Personalizada con IA
                </CardTitle>
                <CardDescription>Análisis detallado generado por inteligencia artificial</CardDescription>
              </CardHeader>
              <CardContent>
                {!isDemo ? (
                  loadingAI ? (
                    <div className="flex items-center gap-3 py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="text-gray-600">Generando interpretación personalizada con IA...</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-5 w-5 text-purple-600" />
                          <span className="font-semibold text-purple-800">Análisis IA - GPT-4o</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{aiInterpretation}</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Análisis IA no disponible en modo demo</h3>
                    <p className="text-gray-600 mb-4">
                      Completa el test real para obtener un análisis personalizado con IA
                    </p>
                    <Button onClick={() => router.push("/test/mbti")}>
                      <Brain className="h-4 w-4 mr-2" />
                      Realizar Test Real
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Coach Tab */}
          <TabsContent value="ai-coach" className="space-y-6">
            {!isDemo ? (
              <SofiaDaniCoach
                conversationCategory="autoconocimiento"
                userContext={{
                  testType: "MBTI",
                  testResults: results,
                  userEmail: userEmail,
                  completedAt: new Date().toISOString(),
                }}
                suggestedAction={`Completa el test DISC para conocer tu estilo de comunicación`}
              />
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Coach IA no disponible en modo demo</h3>
                  <p className="text-gray-600 mb-4">Completa el test real para acceder al coach personalizado</p>
                  <Button onClick={() => router.push("/test/mbti")}>
                    <Brain className="h-4 w-4 mr-2" />
                    Realizar Test Real
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="next-steps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-primary" />
                  Siguientes Pasos en el Ecosistema DTC
                </CardTitle>
                <CardDescription>
                  Completa tu perfil con los otros tests y maximiza tu desarrollo profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Test Recomendado */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge className="bg-blue-600 mb-2">Siguiente Recomendado</Badge>
                      <h3 className="text-xl font-bold text-blue-900">Test de Inteligencia Emocional</h3>
                      <p className="text-sm text-blue-700 mt-1">Complementa tu MBTI con habilidades emocionales</p>
                    </div>
                    <Button onClick={() => router.push('/test/emotional-intelligence')}>
                      Comenzar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Los tipos {results?.type} como tú se benefician especialmente de desarrollar inteligencia emocional para complementar sus fortalezas naturales.
                  </p>
                </div>

                {/* Otros Tests Disponibles */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/test/disc')}>
                    <CardHeader>
                      <CardTitle className="text-base">Test DISC</CardTitle>
                      <CardDescription className="text-xs">Estilo de comportamiento profesional</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Descubre cómo te comunicas y trabajas en equipo
                      </p>
                      <Badge variant="outline">Complementario a MBTI</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/test/big-five')}>
                    <CardHeader>
                      <CardTitle className="text-base">Test Big Five</CardTitle>
                      <CardDescription className="text-xs">5 grandes rasgos de personalidad</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Profundiza en dimensiones clave de tu personalidad
                      </p>
                      <Badge variant="outline">Análisis científico</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/test/riasec')}>
                    <CardHeader>
                      <CardTitle className="text-base">Test RIASEC</CardTitle>
                      <CardDescription className="text-xs">Intereses vocacionales</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Identifica carreras alineadas con tu MBTI
                      </p>
                      <Badge variant="outline">Orientación vocacional</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/test/soft-skills')}>
                    <CardHeader>
                      <CardTitle className="text-base">Test de Soft Skills</CardTitle>
                      <CardDescription className="text-xs">Habilidades blandas clave</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        Evalúa habilidades complementarias a tu tipo
                      </p>
                      <Badge variant="outline">Desarrollo profesional</Badge>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña: Plan 90d (Ejemplo base, se expandirá con más lógica DTC) */}
          <TabsContent value="plan90" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  Tu Plan de Acción DTC (90 Días)
                </CardTitle>
                <CardDescription>Objetivos y tareas para maximizar tu desarrollo</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInsights ? (
                  <div className="flex items-center gap-3 py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="text-gray-600">Cargando tu plan de 90 días...</span>
                  </div>
                ) : hybridInsights?.plan_90_dias && hybridInsights.plan_90_dias.length > 0 ? (
                  <div className="space-y-4">
                    {hybridInsights.plan_90_dias.map((item: any, index: number) => (
                      <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">{item.title}</h4>
                        <p className="text-sm text-green-700 mb-2">{item.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {item.actions.map((action: string, actionIndex: number) => (
                            <Badge key={actionIndex} variant="outline" className="border-green-300 text-green-700">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Plan de 90 días no disponible</h3>
                    <p className="text-gray-600 mb-4">
                      Estamos generando tu plan personalizado. Vuelve pronto o contacta a soporte.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña: Biblioteca de Libros Recomendados */}
          <TabsContent value="biblioteca" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Tu Biblioteca Personalizada
                </CardTitle>
                <CardDescription>Libros seleccionados para complementar tu desarrollo</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedBooks.map((book, index) => (
                      <Card key={index} className="overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                          <h4 className="font-semibold text-indigo-800">{book.title}</h4>
                          <p className="text-sm text-indigo-700 italic">- {book.author}</p>
                          <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                            Para tipo: {book.type || results.type}
                          </Badge>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => window.open(book.amazon_url || '#', '_blank')}>
                              Ver en Amazon
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay libros recomendados aún</h3>
                    <p className="text-gray-600 mb-4">
                      Tus recomendaciones se generarán pronto.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pestaña: Metas Personales */}
          <TabsContent value="metas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Tus Metas de Desarrollo
                </CardTitle>
                <CardDescription>Objetivos que te ayudarán a crecer profesionalmente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userGoals.length > 0 ? (
                    userGoals.map((goal, index) => (
                      <Card key={index} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-purple-800">{goal.name}</h4>
                            <Badge variant={goal.status === "active" ? "default" : "outline"} className={goal.status === "active" ? "bg-purple-100 text-purple-700" : ""}>
                              {goal.status === "active" ? "Activa" : "Completada"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Relacionado con: {goal.related_test || 'General'}</p>
                          {goal.due_date && <p className="text-xs text-gray-500">Fecha límite: {new Date(goal.due_date).toLocaleDateString()}</p>}
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aún no has definido metas</h3>
                      <p className="text-gray-600 mb-4">
                        Define tus objetivos para enfocar tu desarrollo profesional.
                      </p>
                      <Button onClick={() => router.push('/dashboard/goals/new')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Nueva Meta
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Carreras Recomendadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.career_recommendations.map((career, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Target className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-blue-800">{career}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Compatibilidad de Tipos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Mejores Compatibilidades</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.compatibility.best_matches.map((type, index) => (
                          <Badge key={index} variant="secondary" className="bg-green-100 text-green-700">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">Relaciones Desafiantes</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.compatibility.challenging_matches.map((type, index) => (
                          <Badge key={index} variant="outline" className="border-orange-200 text-orange-700">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Personas Famosas con tu Tipo
                </CardTitle>
                <CardDescription>Ejemplos de personas exitosas que comparten tu tipo MBTI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {results.famous_people.map((person, index) => (
                    <div key={index} className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Star className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="font-medium text-purple-800 text-sm">{person}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Plan de Desarrollo Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.development_areas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg"
                    >
                      <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-indigo-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-indigo-800 mb-1">Área de Desarrollo</h4>
                        <p className="text-indigo-700 text-sm">{area}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function MBTIResults() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        </div>
      }
    >
      <MBTIResultsContent />
    </Suspense>
  )
}

function getMBTIKeyInsights(type: string): string[] {
  const insights: Record<string, string[]> = {
    'INTJ': [
      'Tu visión estratégica te permite ver oportunidades que otros no ven - úsala para liderar proyectos de innovación en Chile',
      'Trabaja tu habilidad de comunicar ideas complejas de forma simple - será clave para influenciar stakeholders',
      'Busca roles donde puedas diseñar sistemas y estrategias de largo plazo, como consultoría o product management',
      'Complementa tu análisis con inteligencia emocional para entender mejor las motivaciones del equipo',
      'Lee sobre design thinking para balancear tu enfoque analítico con creatividad práctica'
    ],
    'ENFP': [
      'Tu entusiasmo y creatividad son perfectos para roles de innovación y emprendimiento en startups chilenas',
      'Canaliza tu energía dispersa usando metodologías ágiles y herramientas de productividad como Notion',
      'Busca mentores que te ayuden a aterrizar tus ideas en planes concretos de ejecución',
      'Tu habilidad de conectar con personas te hace ideal para roles de cultura organizacional o people ops',
      'Desarrolla disciplina financiera y de gestión para convertir tu creatividad en negocios sostenibles'
    ],
    'ISTJ': [
      'Tu confiabilidad y atención al detalle son activos valiosos - busca roles en auditoría, gestión de proyectos o finanzas',
      'Desarrolla flexibilidad para adaptarte a cambios organizacionales sin perder tu enfoque en la calidad',
      'Complementa tu eficiencia con habilidades de delegación para liderar equipos más grandes',
      'Busca oportunidades para compartir tu expertise en procesos y mejores prácticas',
      'Lee sobre gestión del cambio para ser más efectivo en transformaciones organizacionales'
    ],
    // Add more types as needed
  }
  
  return insights[type] || [
    'Tu perfil único MBTI te permite aportar valor en múltiples áreas profesionales',
    'Identifica tus fortalezas naturales según tu tipo y busca roles que las potencien',
    'Complementa tu estilo con habilidades de otros tipos para ser más versátil',
    'Lee libros de tu biblioteca personalizada para profundizar en tu desarrollo',
    'Define metas concretas y mide tu progreso trimestral en DTC'
  ]
}
