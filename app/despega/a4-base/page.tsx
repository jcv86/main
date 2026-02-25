"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useCoach } from "@/contexts/coach-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Newspaper, BookOpen, Bookmark, Zap, Trophy, TrendingUp, Brain } from "lucide-react"
import { A4NewsFeed } from "@/components/a4-news-feed"
import { A4LearningModules } from "@/components/a4-learning-modules"
import { A4GamifiedTests } from "@/components/a4-gamified-tests"
import { A4ResourceLibrary } from "@/components/a4-resource-library"
import { A4RadarEstrategico } from "@/components/a4-radar-estrategico"

export default function A4Page() {
  const [loading, setLoading] = useState(true)
  const [newsItems, setNewsItems] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("dashboard")
  const [userStats, setUserStats] = useState({
    pointsEarned: 0,
    testsCompleted: 0,
    resourcesUsed: 0,
    streak: 0,
    badges: [],
  })
  const { progress } = useCoach()
  const supabase = createClient()

  useEffect(() => {
    loadData()
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Load user's A4 progress stats
      const { data: stats } = await supabase
        .from("despega_pilar_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("pilar", "a4")
        .single()

      if (stats) {
        setUserStats(prev => ({
          ...prev,
          pointsEarned: stats.score || 0,
          streak: stats.ciclo_dia || 0,
        }))
      }
    } catch (error) {
      console.log("[v0] Error loading user stats:", error)
    }
  }

  const loadData = async () => {
    // Load news
    const { data: newsData } = await supabase
      .from("despega_a4_news_feed")
      .select("*")
      .eq("es_active", true)
      .order("publicado_en", { ascending: false })
      .limit(50)

    if (newsData) setNewsItems(newsData)

    // Load modules
    const { data: modulesData } = await supabase
      .from("despega_a4_modules")
      .select("*")
      .eq("es_active", true)
      .order("orden")

    if (modulesData) setModules(modulesData)

    setLoading(false)
  }

  const handleSaveNews = async (itemId: string) => {
    setSavedResources(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const handleCompleteModule = async (moduleId: string, responses: string[]) => {
    console.log("Module completed:", moduleId, responses)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        
        {/* WELCOME HERO - A4 VERSION */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-800 dark:to-blue-800 rounded-lg p-8 text-white shadow-lg">
          <div className="max-w-3xl">
            <p className="text-cyan-100 text-sm font-semibold uppercase tracking-wider mb-2">Fase A4: La Realidad y Contexto Estratégico</p>
            <h1 className="text-4xl font-bold mb-3">Entiende el mundo en el que compites</h1>
            <p className="text-lg text-cyan-50 mb-4">
              A4 es tu conexión con la realidad: datos económicos, tendencias del mercado, oportunidades ocultas y contexto cultural. 
              No estás transformándote en el vacío. Estás transformándote para un mercado específico, con desafíos específicos, 
              en un momento específico. A4 te da esa inteligencia.
            </p>
            <div className="flex gap-3">
              <Button className="bg-white text-cyan-700 hover:bg-cyan-50 font-semibold" size="lg">
                Explorar Radar Estratégico
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
                Ver Guía A4
              </Button>
            </div>
          </div>
        </div>

        {/* QUICK START GUIDE - A4 VERSION */}
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="text-2xl">🔍</span> Cómo Usar A4 - Primeros Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Revisa tu Radar Estratégico</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Detecta señales estructurales, tácticas y contextuales en tu industria. El Radar te muestra qué está pasando antes de que sea obvio.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Lee Noticias Personalizadas</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Accede a noticias filtradas por tu perfil. No es ruido. Es context específico para tu transformación.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Estudia Módulos de Contexto</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Entiende la cultura corporativa, dinámicas de industria, y como posicionarte estratégicamente.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Guarda Recursos y Crea tu Biblioteca</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Construye tu base de conocimiento. A4 es para referencia continua durante tu transformación.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Original Header - Simplified */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl">
              🌍
            </div>
            <div>
              <h2 className="text-2xl font-bold">Tu Dashboard A4</h2>
              <p className="text-muted-foreground">Radar, Noticias, Módulos y Recursos</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Newspaper className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <div className="text-2xl font-bold">{newsItems.length}</div>
                <div className="text-sm text-muted-foreground">Noticias activas</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <div className="text-2xl font-bold">{modules.length}</div>
                <div className="text-sm text-muted-foreground">Módulos de contexto</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Bookmark className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <div className="text-2xl font-bold">{savedResources.size}</div>
                <div className="text-sm text-muted-foreground">Guardados</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tab Triggers */}
        <Tabs defaultValue="radar" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="radar" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Radar
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="noticias" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            Noticias
          </TabsTrigger>
          <TabsTrigger value="modulos" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Módulos
          </TabsTrigger>
          <TabsTrigger value="biblioteca" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Biblioteca
          </TabsTrigger>
        </TabsList>

        {/* Radar Estratégico Tab */}
        <TabsContent value="radar" className="space-y-6">
          <A4RadarEstrategico />
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Advanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Puntos Acumulados</p>
                    <div className="text-3xl font-bold">{userStats.pointsEarned}</div>
                  </div>
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tests Completados</p>
                    <div className="text-3xl font-bold">{userStats.testsCompleted}</div>
                  </div>
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Recursos Usados</p>
                    <div className="text-3xl font-bold">{userStats.resourcesUsed}</div>
                  </div>
                  <BookOpen className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Racha Actual</p>
                    <div className="text-3xl font-bold">{userStats.streak} días</div>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Card */}
          <Card className="border-2 border-cyan-200 bg-gradient-to-r from-cyan-50 via-blue-50 to-purple-50 dark:from-cyan-900/30 dark:via-blue-900/30 dark:to-purple-900/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                Bienvenido a A4: Tu Identidad en Acción
              </CardTitle>
              <CardDescription>
                Aquí te conectas con la realidad del mercado, aprendes contexto profesional y vives tu transformación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">A4 es donde tu nueva identidad cobra vida. Explora noticias relevantes, completa tests de contexto, accede a recursos curados y aprende de tu coach IA.</p>
              <div className="flex flex-wrap gap-2">
                <Badge>Noticias en Tiempo Real</Badge>
                <Badge>Tests Gamificados</Badge>
                <Badge>Biblioteca Curada</Badge>
                <Badge>Coach IA Contextual</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Newspaper className="w-5 h-5" />
                  Últimas Noticias
                </CardTitle>
                <CardDescription>Contexto del mercado que importa</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Lee noticias relevantes al mercado y completa preguntas reflexivas para ganar puntos.</p>
                <Link href="/despega/a4/noticias">
                  <Button className="w-full">Ir a Noticias</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5" />
                  Cultura General
                </CardTitle>
                <CardDescription>Expande tu contexto profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Tests sobre economía, tecnología, negocios y futuro del trabajo. Gana puntos y badges.</p>
                <Link href="/despega/a4/cultura-general">
                  <Button className="w-full">Hacer Tests</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bookmark className="w-5 h-5" />
                  Biblioteca Curada
                </CardTitle>
                <CardDescription>Recursos de calidad verificada</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Accede a artículos, libros, podcasts y videos recomendados para tu contexto.</p>
                <Link href="/despega/a4/biblioteca">
                  <Button className="w-full">Ver Biblioteca</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="w-5 h-5" />
                  Mis Logros
                </CardTitle>
                <CardDescription>Badges y reconocimientos</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{userStats.badges.length} badges desbloqueados. Sigue aprendiendo para ganar más.</p>
                <Button className="w-full" disabled>Ver Logros (próximamente)</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="noticias" className="space-y-6">
          <A4NewsFeed items={newsItems} onSave={handleSaveNews} />
        </TabsContent>

        <TabsContent value="modulos" className="space-y-6">
          <A4LearningModules modules={modules} onCompleteModule={handleCompleteModule} />
        </TabsContent>

        <TabsContent value="biblioteca" className="space-y-6">
          <A4ResourceLibrary />
        </TabsContent>
      </Tabs>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800">
          <CardContent className="pt-6 flex gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-cyan-600 text-lg">💡</div>
            <div>
              <div className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">A4 - El Contexto Real: Tu Nueva Identidad en Acción</div>
              <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1">
                <li>✓ <strong>Dashboard:</strong> Tu progreso, puntos y logros en tiempo real</li>
                <li>✓ <strong>Noticias:</strong> Contexto del mercado donde vivirá tu nueva identidad</li>
                <li>✓ <strong>Módulos:</strong> Aprende habilidades específicas para tu transformación</li>
                <li>✓ <strong>Biblioteca:</strong> Recursos curados y verificados para tu aprendizaje</li>
                <li>✓ <strong>Coach IA (Sidebar):</strong> Sofia y Dani siempre disponibles para guiarte</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
