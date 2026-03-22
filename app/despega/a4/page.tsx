"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowRight, TrendingUp, BookOpen, Lightbulb, Globe, Radar, CheckCircle, ArrowLeft } from "lucide-react"
import { useAuthRedirect } from "@/lib/hooks/useAuthRedirect"
import { A4NewsFeed } from "@/components/a4-news-feed"
import { A4RadarEstrategico } from "@/components/a4-radar-estrategico"
import { A4GamifiedTests } from "@/components/a4-gamified-tests"
import { getA4News, getUserTotalPoints, getUserA4Badges, getA4NewsByCategory } from "@/lib/supabase/a4-queries"

export default function A4HubPage() {
  const router = useRouter()
  const { user, loading } = useAuthRedirect()
  const [activeTab, setActiveTab] = useState("radar")
  const [newsData, setNewsData] = useState<any[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [badges, setBadges] = useState<any[]>([])
  const [testsData, setTestsData] = useState<any[]>([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [testsLoading, setTestsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        const [news, points, userBadges] = await Promise.all([
          getA4News(20),
          getUserTotalPoints(user.id),
          getUserA4Badges(user.id),
        ])
        
        setNewsData(news)
        setTotalPoints(points)
        setBadges(userBadges || [])
      } catch (error) {
        console.error('[v0] Error loading A4 news data:', error)
      } finally {
        setNewsLoading(false)
      }
    }

    const loadTests = async () => {
      try {
        const response = await fetch('/api/despega/a4-tests')
        if (!response.ok) throw new Error('Failed to fetch tests')
        const data = await response.json()
        setTestsData(data.tests || [])
      } catch (error) {
        console.error('[v0] Error loading A4 tests:', error)
      } finally {
        setTestsLoading(false)
      }
    }

    loadData()
    loadTests()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/despega">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Despega
            </Button>
          </Link>
          <div className="text-sm text-muted-foreground">
            Fase <Badge variant="secondary">A4: Radar Estratégico</Badge>
          </div>
          <div className="text-sm">
            <Badge variant="outline" className="mr-2">
              {totalPoints} puntos
            </Badge>
            <Badge variant="outline">
              {badges.length} logros
            </Badge>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
              <Radar className="w-3 h-3 mr-2" />
              Centro de Inteligencia de Mercado
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
              Tu Radar Estratégico
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8">
              Análisis profundo del mercado laboral chileno con 7 capas cognitivas de interpretación. Entiende qué está pasando realmente y cómo aprovechar oportunidades.
            </p>
          </div>
        </div>

        {/* Main Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8 gap-1">
            <TabsTrigger value="radar" className="text-xs md:text-sm">
              <Radar className="w-3 h-3 md:mr-1" />
              <span className="hidden md:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="noticias" className="text-xs md:text-sm">
              <TrendingUp className="w-3 h-3 md:mr-1" />
              <span className="hidden md:inline">Noticias</span>
            </TabsTrigger>
            <TabsTrigger value="personalizadas" className="text-xs md:text-sm">
              <Globe className="w-3 h-3 md:mr-1" />
              <span className="hidden md:inline">Personalizadas</span>
            </TabsTrigger>
            <TabsTrigger value="cultura" className="text-xs md:text-sm">
              <Lightbulb className="w-3 h-3 md:mr-1" />
              <span className="hidden md:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="pruebas" className="text-xs md:text-sm">
              <CheckCircle className="w-3 h-3 md:mr-1" />
              <span className="hidden md:inline">Pruebas</span>
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="text-xs md:text-sm">
              <BookOpen className="w-3 h-3 md:mr-1" />
              <span className="hidden md:inline">Biblioteca</span>
            </TabsTrigger>
          </TabsList>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-4">
            <A4RadarEstrategico />
          </TabsContent>

          {/* Noticias Tab */}
          <TabsContent value="noticias" className="space-y-4">
            {newsLoading ? (
              <Card>
                <CardContent className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
              </Card>
            ) : (
              <A4NewsFeed items={newsData} />
            )}
          </TabsContent>

          {/* Personalizadas Tab */}
          <TabsContent value="personalizadas" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl">Noticias Personalizadas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Tu feed se personaliza automáticamente según:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <h4 className="font-medium">Criterios de Personalización</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Tu perfil Despega (DISC)</li>
                      <li>Ruta de desarrollo actual</li>
                      <li>Industrias de interés</li>
                      <li>Patrones de engagement</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <h4 className="font-medium">Próximamente</h4>
                    <p className="text-sm text-muted-foreground">
                      Sistema de IA que aprende de tus preferencias y proporciona noticias 100% relevantes para tu carrera.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultura General Tab */}
          <TabsContent value="cultura" className="space-y-4">
            {testsLoading ? (
              <Card>
                <CardContent className="py-12 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
              </Card>
            ) : testsData.length > 0 ? (
              <A4GamifiedTests tests={testsData} />
            ) : (
              <Card className="border-0 bg-card/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-green-500/10 rounded-lg">
                      <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl">Tests de Cultura General</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Tests gamificados para dominar el contexto del mercado laboral chileno.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Temas de Tests:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>✓ Economía Básica</li>
                        <li>✓ Tendencias Industriales</li>
                        <li>✓ Mercado Laboral 2024-2025</li>
                        <li>✓ Cultura Organizacional</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Sistema de Gamificación:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>🎯 +10 puntos por test completado</li>
                        <li>🏆 Badges por dominar temas</li>
                        <li>📊 Leaderboard semanal</li>
                        <li>💡 Explicaciones detalladas</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Pronto habrá tests disponibles. ¡Mantente atento!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Pruebas Tab */}
          <TabsContent value="pruebas" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-2xl">Análisis de Casos Reales</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Mini pruebas rápidas para evaluar tu comprensión del contexto económico actual.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Tipos de Pruebas:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Análisis de casos reales</li>
                      <li>Interpretación de datos</li>
                      <li>Toma de decisiones</li>
                      <li>Identificación de oportunidades</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Formato:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>5-10 min por test</li>
                      <li>Feedback inmediato con IA</li>
                      <li>Explicaciones contextuales</li>
                      <li>Recomendaciones personalizadas</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full" variant="default">
                  Intentar Prueba →
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Biblioteca Tab */}
          <TabsContent value="biblioteca" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-2xl">Biblioteca de Recursos Curados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  100+ libros, artículos y recursos seleccionados para tu crecimiento profesional continuo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Tipos de Recursos:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>📚 Libros recomendados</li>
                      <li>📄 Artículos en profundidad</li>
                      <li>🎧 Podcasts clave</li>
                      <li>📊 Reportes de investigación</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Temas Curados:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Liderazgo estratégico</li>
                      <li>Innovación & adaptación</li>
                      <li>Negociación efectiva</li>
                      <li>Mentalidad de crecimiento</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Características:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Resúmenes ejecutivos</li>
                      <li>Notas destacadas</li>
                      <li>Progreso de lectura</li>
                      <li>Colecciones temáticas</li>
                    </ul>
                  </div>
                </div>
                <Button className="w-full" variant="default">
                  Ver Biblioteca →
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Navigation */}
        <div className="mt-16 text-center space-y-4 border-t pt-8">
          <p className="text-muted-foreground">
            A4 es tu centro de aprendizaje continuo sobre el mercado, la economía y las oportunidades laborales en Chile.
          </p>
          <p className="text-xs text-muted-foreground/70">
            Datos actualizados en tiempo real • Análisis estructurado con 7 capas cognitivas • 100+ recursos curados
          </p>
        </div>
      </div>
    </div>
  )
}
