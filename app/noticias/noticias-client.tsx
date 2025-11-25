"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Briefcase,
  Brain,
  Heart,
  Users,
  Target,
  DollarSign,
  Compass,
  Clock,
  BookOpen,
  Star,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Filter,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

// Types
interface Article {
  id: string
  title: string
  summary: string
  category: Category
  readTime: number
  source: string
  imageQuery: string
  relevanceScore: number
  publishedAt: string
  tags: string[]
  relatedTests: string[]
  actionItems: string[]
  saved?: boolean
  read?: boolean
}

type Category = "trabajo" | "psicologia" | "bienestar" | "relaciones" | "habitos" | "dinero" | "proposito"

const categories: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "trabajo", label: "Trabajo", icon: <Briefcase className="h-4 w-4" />, color: "bg-blue-500" },
  { id: "psicologia", label: "Psicología", icon: <Brain className="h-4 w-4" />, color: "bg-purple-500" },
  { id: "bienestar", label: "Bienestar", icon: <Heart className="h-4 w-4" />, color: "bg-green-500" },
  { id: "relaciones", label: "Relaciones", icon: <Users className="h-4 w-4" />, color: "bg-pink-500" },
  { id: "habitos", label: "Hábitos", icon: <Target className="h-4 w-4" />, color: "bg-orange-500" },
  { id: "dinero", label: "Dinero", icon: <DollarSign className="h-4 w-4" />, color: "bg-emerald-500" },
  { id: "proposito", label: "Propósito", icon: <Compass className="h-4 w-4" />, color: "bg-indigo-500" },
]

// Mock articles based on user profile
const generateArticles = (): Article[] => [
  // Trabajo
  {
    id: "1",
    title: "Cómo usar tu perfil DISC para destacar en entrevistas laborales",
    summary:
      "Aprende a comunicar tus fortalezas de manera efectiva según tu estilo de personalidad DISC. Estrategias específicas para cada tipo.",
    category: "trabajo",
    readTime: 8,
    source: "DTC Insights",
    imageQuery: "professional interview success",
    relevanceScore: 95,
    publishedAt: "2024-01-15",
    tags: ["DISC", "entrevistas", "carrera"],
    relatedTests: ["DISC", "Soft Skills"],
    actionItems: ["Practica tu pitch personal", "Identifica 3 logros clave", "Prepara ejemplos STAR"],
  },
  {
    id: "2",
    title: "Tendencias del mercado laboral 2024: Habilidades más demandadas",
    summary:
      "Las soft skills superan a las técnicas. Descubre qué competencias buscan los empleadores y cómo desarrollarlas.",
    category: "trabajo",
    readTime: 6,
    source: "DTC Research",
    imageQuery: "modern workplace technology",
    relevanceScore: 88,
    publishedAt: "2024-01-14",
    tags: ["tendencias", "habilidades", "empleabilidad"],
    relatedTests: ["Soft Skills", "RIASEC"],
    actionItems: ["Actualiza tu CV", "Identifica brechas de habilidades", "Planifica capacitación"],
  },
  // Psicología
  {
    id: "3",
    title: "Neurociencia del autoconocimiento: Por qué los tests de personalidad funcionan",
    summary: "La ciencia detrás de las evaluaciones psicométricas y cómo el cerebro procesa la autorreflexión.",
    category: "psicologia",
    readTime: 10,
    source: "DTC Academy",
    imageQuery: "brain neural connections",
    relevanceScore: 82,
    publishedAt: "2024-01-13",
    tags: ["neurociencia", "personalidad", "autoconocimiento"],
    relatedTests: ["MBTI", "Big Five"],
    actionItems: ["Revisa tus resultados de tests", "Identifica patrones de comportamiento", "Reflexiona sobre sesgos"],
  },
  {
    id: "4",
    title: "El poder del mindset de crecimiento en el desarrollo profesional",
    summary:
      "Investigaciones de Carol Dweck aplicadas al mundo laboral. Cómo cambiar tu mentalidad puede transformar tu carrera.",
    category: "psicologia",
    readTime: 7,
    source: "DTC Insights",
    imageQuery: "growth mindset success",
    relevanceScore: 90,
    publishedAt: "2024-01-12",
    tags: ["mindset", "crecimiento", "desarrollo"],
    relatedTests: ["Big Five", "IE"],
    actionItems: ["Identifica creencias limitantes", "Practica el 'todavía no'", "Celebra el proceso"],
  },
  // Bienestar
  {
    id: "5",
    title: "Balance vida-trabajo: Estrategias según tu tipo de personalidad",
    summary:
      "No existe una fórmula única. Aprende a encontrar equilibrio según tu perfil MBTI y necesidades específicas.",
    category: "bienestar",
    readTime: 9,
    source: "DTC Wellness",
    imageQuery: "work life balance peaceful",
    relevanceScore: 85,
    publishedAt: "2024-01-11",
    tags: ["balance", "bienestar", "MBTI"],
    relatedTests: ["MBTI", "IE"],
    actionItems: ["Define tus prioridades", "Establece límites claros", "Programa descanso activo"],
  },
  {
    id: "6",
    title: "Técnicas de regulación emocional para profesionales de alto rendimiento",
    summary: "Herramientas prácticas basadas en IE para manejar el estrés y mantener el enfoque en momentos críticos.",
    category: "bienestar",
    readTime: 8,
    source: "DTC Academy",
    imageQuery: "meditation calm professional",
    relevanceScore: 92,
    publishedAt: "2024-01-10",
    tags: ["emociones", "estrés", "rendimiento"],
    relatedTests: ["IE", "Soft Skills"],
    actionItems: ["Practica respiración 4-7-8", "Identifica triggers emocionales", "Crea rutina de descompresión"],
  },
  // Relaciones
  {
    id: "7",
    title: "Comunicación efectiva en parejas: El rol de la inteligencia emocional",
    summary: "Cómo la IE impacta tus relaciones románticas y estrategias para mejorar la conexión con tu pareja.",
    category: "relaciones",
    readTime: 11,
    source: "DTC Relationships",
    imageQuery: "couple communication love",
    relevanceScore: 78,
    publishedAt: "2024-01-09",
    tags: ["pareja", "comunicación", "IE"],
    relatedTests: ["IE", "DISC"],
    actionItems: ["Practica escucha activa", "Expresa necesidades claramente", "Programa tiempo de calidad"],
  },
  {
    id: "8",
    title: "Networking auténtico: Conecta según tu estilo de personalidad",
    summary: "No todos los profesionales deben hacer networking igual. Descubre estrategias alineadas con tu DISC.",
    category: "relaciones",
    readTime: 7,
    source: "DTC Career",
    imageQuery: "professional networking event",
    relevanceScore: 86,
    publishedAt: "2024-01-08",
    tags: ["networking", "conexiones", "carrera"],
    relatedTests: ["DISC", "Big Five"],
    actionItems: ["Identifica tu estilo de networking", "Prepara tu elevator pitch", "Define metas de conexión"],
  },
  // Hábitos
  {
    id: "9",
    title: "Atomic Habits aplicado: Construye hábitos según tu perfil Big Five",
    summary: "Las técnicas de James Clear personalizadas según tu nivel de responsabilidad, apertura y otros rasgos.",
    category: "habitos",
    readTime: 12,
    source: "DTC Academy",
    imageQuery: "habit building routine",
    relevanceScore: 94,
    publishedAt: "2024-01-07",
    tags: ["hábitos", "Big Five", "productividad"],
    relatedTests: ["Big Five", "DISC"],
    actionItems: ["Identifica un hábito clave", "Diseña el entorno", "Usa habit stacking"],
  },
  {
    id: "10",
    title: "Rutina matutina óptima según tu cronotipo y personalidad",
    summary: "No todos somos madrugadores. Descubre cómo diseñar una mañana productiva según tu biología.",
    category: "habitos",
    readTime: 6,
    source: "DTC Wellness",
    imageQuery: "morning routine productive",
    relevanceScore: 81,
    publishedAt: "2024-01-06",
    tags: ["rutina", "mañana", "productividad"],
    relatedTests: ["Big Five", "MBTI"],
    actionItems: ["Identifica tu cronotipo", "Diseña tu rutina ideal", "Prueba por 7 días"],
  },
  // Dinero
  {
    id: "11",
    title: "Psicología del dinero: Tu personalidad y tus finanzas",
    summary: "Cómo tu perfil de personalidad influye en tus decisiones financieras y cómo tomar mejores decisiones.",
    category: "dinero",
    readTime: 9,
    source: "DTC Finance",
    imageQuery: "financial planning money",
    relevanceScore: 76,
    publishedAt: "2024-01-05",
    tags: ["finanzas", "personalidad", "decisiones"],
    relatedTests: ["Big Five", "DISC"],
    actionItems: ["Revisa tu relación con el dinero", "Identifica patrones de gasto", "Crea presupuesto realista"],
  },
  {
    id: "12",
    title: "Negociación salarial: Técnicas según tu estilo DISC",
    summary: "Estrategias personalizadas para pedir un aumento o negociar tu salario según tu perfil de comunicación.",
    category: "dinero",
    readTime: 8,
    source: "DTC Career",
    imageQuery: "salary negotiation professional",
    relevanceScore: 89,
    publishedAt: "2024-01-04",
    tags: ["salario", "negociación", "carrera"],
    relatedTests: ["DISC", "Soft Skills"],
    actionItems: ["Investiga rangos salariales", "Prepara tu caso", "Practica con simulación"],
  },
  // Propósito
  {
    id: "13",
    title: "Ikigai profesional: Encuentra tu propósito con RIASEC",
    summary:
      "Combina tu perfil de intereses vocacionales con el concepto japonés de ikigai para encontrar trabajo significativo.",
    category: "proposito",
    readTime: 10,
    source: "DTC Purpose",
    imageQuery: "purpose meaning life career",
    relevanceScore: 91,
    publishedAt: "2024-01-03",
    tags: ["propósito", "ikigai", "vocación"],
    relatedTests: ["RIASEC", "MBTI"],
    actionItems: ["Completa el ejercicio de ikigai", "Identifica intersecciones", "Define tu declaración de propósito"],
  },
  {
    id: "14",
    title: "Diseña tu vida: Principios de design thinking para tu carrera",
    summary: "Aplica metodología de Stanford para prototipar diferentes versiones de tu futuro profesional.",
    category: "proposito",
    readTime: 11,
    source: "DTC Academy",
    imageQuery: "design thinking creative",
    relevanceScore: 84,
    publishedAt: "2024-01-02",
    tags: ["diseño", "carrera", "futuro"],
    relatedTests: ["RIASEC", "Big Five"],
    actionItems: ["Crea 3 prototipos de vida", "Haz una entrevista de odyssey", "Experimenta en pequeño"],
  },
]

export default function NoticiasClient() {
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set())
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set())
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [preferences, setPreferences] = useState<Set<Category>>(new Set(categories.map((c) => c.id)))
  const [showPreferences, setShowPreferences] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading articles
    setLoading(true)
    setTimeout(() => {
      setArticles(generateArticles())
      setLoading(false)
    }, 800)
  }, [])

  const filteredArticles =
    selectedCategory === "all"
      ? articles.filter((a) => preferences.has(a.category))
      : articles.filter((a) => a.category === selectedCategory)

  const sortedArticles = [...filteredArticles].sort((a, b) => b.relevanceScore - a.relevanceScore)

  const toggleSave = (id: string) => {
    setSavedArticles((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const markAsRead = (id: string) => {
    setReadArticles((prev) => new Set(prev).add(id))
  }

  const togglePreference = (category: Category) => {
    setPreferences((prev) => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }

  const getCategoryInfo = (category: Category) => {
    return categories.find((c) => c.id === category)
  }

  const stats = {
    total: articles.length,
    saved: savedArticles.size,
    read: readArticles.size,
    unread: articles.length - readArticles.size,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-amber-500" />
                Tu Feed Personalizado
              </h1>
              <p className="text-gray-500 text-sm">Contenido seleccionado según tu perfil y tests completados</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreferences(!showPreferences)}>
                <Filter className="h-4 w-4 mr-1" />
                Preferencias
              </Button>
              <Button variant="outline" size="sm" onClick={() => setArticles(generateArticles())}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Actualizar
              </Button>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              Todos
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="flex items-center gap-1"
              >
                {cat.icon}
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences panel */}
      {showPreferences && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h3 className="font-semibold text-amber-800 mb-3">Personaliza tu feed</h3>
            <div className="flex flex-wrap gap-4">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked={preferences.has(cat.id)} onCheckedChange={() => togglePreference(cat.id)} />
                  <span className="text-sm flex items-center gap-1">
                    {cat.icon}
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - Articles */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs defaultValue="feed">
              <TabsList>
                <TabsTrigger value="feed" className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Para ti ({stats.unread} nuevos)
                </TabsTrigger>
                <TabsTrigger value="saved" className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  Guardados ({stats.saved})
                </TabsTrigger>
                <TabsTrigger value="read" className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Leídos ({stats.read})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="mt-4 space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-200 rounded w-full mb-1" />
                          <div className="h-3 bg-gray-200 rounded w-2/3" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : sortedArticles.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-500">No hay artículos para mostrar.</p>
                      <p className="text-sm text-gray-400 mt-1">Ajusta tus preferencias para ver más contenido.</p>
                    </CardContent>
                  </Card>
                ) : (
                  sortedArticles.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      saved={savedArticles.has(article.id)}
                      read={readArticles.has(article.id)}
                      onSave={() => toggleSave(article.id)}
                      onRead={() => markAsRead(article.id)}
                      onSelect={() => setSelectedArticle(article)}
                      categoryInfo={getCategoryInfo(article.category)}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="saved" className="mt-4 space-y-4">
                {articles
                  .filter((a) => savedArticles.has(a.id))
                  .map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      saved={true}
                      read={readArticles.has(article.id)}
                      onSave={() => toggleSave(article.id)}
                      onRead={() => markAsRead(article.id)}
                      onSelect={() => setSelectedArticle(article)}
                      categoryInfo={getCategoryInfo(article.category)}
                    />
                  ))}
                {savedArticles.size === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No has guardado artículos todavía.</p>
                      <p className="text-sm text-gray-400 mt-1">Guarda artículos para leerlos después.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="read" className="mt-4 space-y-4">
                {articles
                  .filter((a) => readArticles.has(a.id))
                  .map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      saved={savedArticles.has(article.id)}
                      read={true}
                      onSave={() => toggleSave(article.id)}
                      onRead={() => markAsRead(article.id)}
                      onSelect={() => setSelectedArticle(article)}
                      categoryInfo={getCategoryInfo(article.category)}
                    />
                  ))}
                {readArticles.size === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No has leído artículos todavía.</p>
                      <p className="text-sm text-gray-400 mt-1">Tu historial de lectura aparecerá aquí.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Article detail / Quick stats */}
            {selectedArticle ? (
              <Card className="sticky top-24">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryInfo(selectedArticle.category)?.color}>
                      {getCategoryInfo(selectedArticle.category)?.label}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
                      Cerrar
                    </Button>
                  </div>
                  <CardTitle className="text-lg mt-2">{selectedArticle.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={`/.jpg?height=200&width=400&query=${selectedArticle.imageQuery}`}
                    alt={selectedArticle.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <p className="text-gray-600 text-sm">{selectedArticle.summary}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedArticle.readTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      {selectedArticle.relevanceScore}% relevante
                    </span>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Tests relacionados</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedArticle.relatedTests.map((test) => (
                        <Badge key={test} variant="outline" className="text-xs">
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Acciones sugeridas</h4>
                    <ul className="space-y-1">
                      {selectedArticle.actionItems.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" onClick={() => markAsRead(selectedArticle.id)}>
                      <BookOpen className="h-4 w-4 mr-1" />
                      Leer artículo
                    </Button>
                    <Button variant="outline" onClick={() => toggleSave(selectedArticle.id)}>
                      {savedArticles.has(selectedArticle.id) ? (
                        <BookmarkCheck className="h-4 w-4" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Stats card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tu actividad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Artículos disponibles</span>
                      <span className="font-semibold">{stats.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Guardados</span>
                      <span className="font-semibold">{stats.saved}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Leídos</span>
                      <span className="font-semibold">{stats.read}</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full mt-2">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${(stats.read / stats.total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      {Math.round((stats.read / stats.total) * 100)}% completado esta semana
                    </p>
                  </CardContent>
                </Card>

                {/* Quick links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Acceso rápido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Link href="/recursos">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Biblioteca de Recursos
                      </Button>
                    </Link>
                    <Link href="/metas">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Target className="h-4 w-4 mr-2" />
                        Mis Metas SMART
                      </Button>
                    </Link>
                    <Link href="/simulaciones">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Users className="h-4 w-4 mr-2" />
                        Simulaciones
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Mi Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Recommendation */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      Recomendación del día
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 mb-3">
                      Basado en tu perfil DISC, te recomendamos practicar la simulación de{" "}
                      <strong>Negociación Salarial</strong> para mejorar tu comunicación asertiva.
                    </p>
                    <Link href="/simulaciones">
                      <Button size="sm" className="w-full">
                        Ir a Simulaciones
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Article Card Component
function ArticleCard({
  article,
  saved,
  read,
  onSave,
  onRead,
  onSelect,
  categoryInfo,
}: {
  article: Article
  saved: boolean
  read: boolean
  onSave: () => void
  onRead: () => void
  onSelect: () => void
  categoryInfo?: (typeof categories)[number]
}) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${read ? "opacity-75 bg-gray-50" : ""}`}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={`/.jpg?height=100&width=150&query=${article.imageQuery}`}
            alt={article.title}
            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`${categoryInfo?.color} text-xs`}>{categoryInfo?.label}</Badge>
              {article.relevanceScore >= 90 && (
                <Badge variant="outline" className="text-xs border-amber-300 text-amber-700">
                  <Star className="h-3 w-3 mr-1" />
                  Alta relevancia
                </Badge>
              )}
              {read && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Leído
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{article.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">{article.summary}</p>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {article.readTime} min
                </span>
                <span>{article.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSave()
                  }}
                >
                  {saved ? <BookmarkCheck className="h-4 w-4 text-blue-500" /> : <Bookmark className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
