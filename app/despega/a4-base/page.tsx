"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useCoach } from "@/contexts/coach-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Newspaper, BookOpen, Bookmark, Zap, Trophy, TrendingUp } from "lucide-react"
import { A4NewsFeed } from "@/components/a4-news-feed"
import { A4LearningModules } from "@/components/a4-learning-modules"

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
    // TODO: Save to database
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
    // TODO: Save module completion to database
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
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl">
              🌍
            </div>
            <div>
              <h1 className="text-3xl font-bold">La Realidad - Dónde Vive Tu Identidad</h1>
              <p className="text-muted-foreground">A4: El mercado, las oportunidades, tu contexto profesional + coaching personalizado</p>
            </div>
          </div>
          <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
            Fase A4: Tu identidad en el mundo real
          </Badge>
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
        <TabsList className="grid w-full grid-cols-4">
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
                <Button className="w-full">Ir a Noticias</Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5" />
                  Módulos de Aprendizaje
                </CardTitle>
                <CardDescription>Habilidades para tu nueva identidad</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">Aprende sobre mercado, negociación, liderazgo y más con módulos interactivos.</p>
                <Button className="w-full">Explorar Módulos</Button>
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
                <Button className="w-full">Ver Biblioteca</Button>
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
                <Button className="w-full">Ver Logros</Button>
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

          <TabsContent value="coaching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  Tu Coach IA - Guía de Transición
                </CardTitle>
                <CardDescription>
                  Sofia & Dani acompañan tu transformación. Pregunta sobre cualquier aspecto de tu nueva identidad en el contexto real.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Sofia</CardTitle>
                      <CardDescription>Coach de Transición Personal</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">Especializada en guiar tu transformación de identidad con empatía y profundidad emocional.</p>
                      <Button variant="outline" className="w-full">Hablar con Sofia</Button>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Dani</CardTitle>
                      <CardDescription>Coach de Transición Profesional</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">Experto en navegar el mercado y transformar tu identidad profesional en oportunidades reales.</p>
                      <Button variant="outline" className="w-full">Hablar con Dani</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Tu Plan de Acción - Elige Tu Ritmo
                </CardTitle>
                <CardDescription>
                  Pasos concretos para vivir tu nueva identidad. Elige 30, 60 o 90 días según tu disponibilidad y ritmo de transición.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Plan 30 días */}
                  <Card className="border-2 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg">30 Días - Intenso</CardTitle>
                      <CardDescription>Transformación acelerada</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-orange-900 dark:text-orange-100">Semana 1: Asentamiento</div>
                        <p className="text-muted-foreground">Diagnóstico y comunicación de cambios</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-orange-900 dark:text-orange-100">Semana 2-3: Exploración Activa</div>
                        <p className="text-muted-foreground">Oportunidades y práctica intensiva</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-orange-900 dark:text-orange-100">Semana 4: Decisión</div>
                        <p className="text-muted-foreground">Primer cambio concreto implementado</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plan 60 días */}
                  <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                    <CardHeader>
                      <CardTitle className="text-lg">60 Días - Balanceado</CardTitle>
                      <CardDescription>Transición sostenible</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-blue-900 dark:text-blue-100">Semana 1-2: Asentamiento</div>
                        <p className="text-muted-foreground">Consolidar nuevo entendimiento</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-blue-900 dark:text-blue-100">Semana 3-7: Exploración Activa</div>
                        <p className="text-muted-foreground">Búsqueda profunda y networking</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-blue-900 dark:text-blue-100">Semana 8-9: Integración</div>
                        <p className="text-muted-foreground">Implementar cambios principales</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Plan 90 días */}
                  <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-300 dark:ring-green-700">
                    <CardHeader>
                      <CardTitle className="text-lg">90 Días - Completo</CardTitle>
                      <CardDescription>Transformación profunda (Recomendado)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-green-900 dark:text-green-100">Semana 1-2: Asentamiento</div>
                        <p className="text-muted-foreground">Consolidar tu nuevo entendimiento</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-green-900 dark:text-green-100">Semana 3-6: Exploración Activa</div>
                        <p className="text-muted-foreground">Buscar oportunidades, conectar, practicar</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-semibold text-green-900 dark:text-green-100">Semana 7-12: Integración</div>
                        <p className="text-muted-foreground">Decisiones finales y vivir tu nueva identidad</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      <strong>¿Cuál elegir?</strong> Si es tu primera transición importante, recomendamos 90 días. Si ya tienes experiencia, 30-60 días puede ser suficiente. Tu coach IA te puede ayudar a elegir según tu contexto.
                    </p>
                    <Button className="w-full">Crear Mi Plan Personalizado</Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800">
          <CardContent className="pt-6 flex gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-cyan-600 text-lg">💡</div>
            <div>
              <div className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">A4 - La Realidad: Tu Identidad en Acción</div>
              <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1">
                <li>✓ <strong>Noticias:</strong> Entiende el contexto del mercado donde vivirá tu nueva identidad</li>
                <li>✓ <strong>Coaching:</strong> Sofia y Dani te guían en decisiones reales y transiciones concretas</li>
                <li>✓ <strong>Tu Plan:</strong> 90 días estructurados para que tu transformación sea real, no teórica</li>
                <li>✓ <strong>Módulos:</strong> Aprende habilidades específicas para tu nueva identidad profesional</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
