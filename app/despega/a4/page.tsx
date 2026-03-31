"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, Radar, TrendingUp, Globe, Lightbulb, CheckCircle, BookOpen } from "lucide-react"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { getNextRequiredPage } from "@/lib/redirect-logic"
import { RadarEstrategico } from "@/components/radar-estrategico"
import { NoticiasFeed } from "@/components/noticias-feed"
import { GamifiedTests } from "@/components/gamified-tests"
import { PruebasTab } from "@/components/pruebas-tab"
import { Biblioteca } from "@/components/biblioteca"
import { EngagementDashboard } from "@/components/engagement-dashboard"
import { PersonalizationProfile } from "@/components/personalization-profile"
import { PointsBadgesSystem } from "@/components/points-badges-system"

export default function A4HubPage() {
  const { user, loading } = useAuthRedirect()
  const [activeTab, setActiveTab] = useState("radar")
  const [isCheckingPrerequisites, setIsCheckingPrerequisites] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (loading || !user?.id) return

    const checkPrerequisites = async () => {
      try {
        // Check prerequisites using centralized logic
        const nextPage = await getNextRequiredPage(user.id)
        if (!nextPage.includes('/a4')) {
          console.log('[v0] User not ready for A4, redirecting to:', nextPage)
          router.push(nextPage)
          return
        }

        setIsCheckingPrerequisites(false)
      } catch (error) {
        console.error('[v0] Error checking A4 prerequisites:', error)
        setIsCheckingPrerequisites(false)
      }
    }

    checkPrerequisites()
  }, [user?.id, loading, router])

  if (loading || isCheckingPrerequisites) {
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/despega">
            <Button variant="ghost" size="sm" className="hover:bg-slate-200 dark:hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Despega
            </Button>
          </Link>
          <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            Fase <Badge className="bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-200 ml-2">A4: La Realidad</Badge>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 px-4 py-1.5 text-sm bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-200">
              <Radar className="w-3 h-3 mr-2" />
              Centro de Inteligencia de Mercado
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              Tu Radar Estratégico
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 text-balance mb-8 font-medium">
              Análisis profundo del mercado laboral chileno con 7 capas cognitivas de interpretación. Entiende qué está pasando realmente y cómo aprovechar oportunidades.
            </p>
          </div>
        </div>

        {/* Main Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8 gap-1 bg-background/50 backdrop-blur-sm border border-border">
            <TabsTrigger value="radar" className="text-xs sm:text-sm">
              <Radar className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Radar</span>
            </TabsTrigger>
            <TabsTrigger value="noticias" className="text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Noticias</span>
            </TabsTrigger>
            <TabsTrigger value="personalizadas" className="text-xs sm:text-sm">
              <Globe className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Personalizadas</span>
            </TabsTrigger>
            <TabsTrigger value="tests" className="text-xs sm:text-sm">
              <Lightbulb className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Tests</span>
            </TabsTrigger>
            <TabsTrigger value="casos" className="text-xs sm:text-sm">
              <CheckCircle className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Casos</span>
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="text-xs sm:text-sm">
              <BookOpen className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Biblioteca</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-xs sm:text-sm">
              <span>🏆</span>
              <span className="hidden sm:inline ml-1">Insignias</span>
            </TabsTrigger>
          </TabsList>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Radar Estratégico</h2>
              <p className="text-muted-foreground">
                Análisis profundo con 7 capas cognitivas de las tendencias del mercado laboral chileno
              </p>
            </div>
            <RadarEstrategico />
          </TabsContent>

          {/* Noticias Tab */}
          <TabsContent value="noticias" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Noticias del Mercado</h2>
              <p className="text-muted-foreground">
                Tendencias laborales, cambios en industrias y oportunidades emergentes
              </p>
            </div>
            <NoticiasFeed />
          </TabsContent>

          {/* Personalizadas Tab */}
          <TabsContent value="personalizadas" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Noticias Personalizadas</h2>
              <p className="text-muted-foreground">
                Contenido adaptado según tu perfil DISC y preferencias de desarrollo
              </p>
            </div>
            <PersonalizationProfile />
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Pruebas Gamificadas</h2>
              <p className="text-muted-foreground">
                Completa pruebas interactivas para reforzar tu aprendizaje y ganar puntos
              </p>
            </div>
            <GamifiedTests />
          </TabsContent>

          {/* Casos Tab */}
          <TabsContent value="casos" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Casos de Estudio</h2>
              <p className="text-muted-foreground">
                Aprende de casos reales: desafíos, estrategias y resultados de empresas exitosas
              </p>
            </div>
            <PruebasTab />
          </TabsContent>

          {/* Biblioteca Tab */}
          <TabsContent value="biblioteca" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Biblioteca Curada</h2>
              <p className="text-muted-foreground">
                100+ libros, artículos, podcasts y recursos seleccionados para tu crecimiento profesional
              </p>
            </div>
            <Biblioteca />
          </TabsContent>

          {/* Insignias Tab */}
          <TabsContent value="badges" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">Insignias y Puntos</h2>
              <p className="text-muted-foreground">
                Desbloquea insignias, gana puntos y compite en el ranking global
              </p>
            </div>
            <PointsBadgesSystem />
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
