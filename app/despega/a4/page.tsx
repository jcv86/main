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
import { useV1Analytics } from "@/lib/v1-analytics/use-v1-analytics"

export default function A4HubPage() {
  const { user, loading } = useAuthRedirect()
  const [activeTab, setActiveTab] = useState("radar")
  const [isCheckingPrerequisites, setIsCheckingPrerequisites] = useState(true)
  const router = useRouter()
  const { trackEvent } = useV1Analytics()

  useEffect(() => {
    if (loading || !user?.id) return
    trackEvent('a4_page_viewed')

    const checkPrerequisites = async () => {
      try {
        // Check prerequisites using centralized logic
        const nextPage = await getNextRequiredPage(user.id)
        if (!nextPage.includes('/a4')) {
          console.log('[v0] User not ready for A4, redirecting to:', nextPage)
          trackEvent('error_occurred', { errorType: 'prerequisite_failed' })
          router.push(nextPage)
          return
        }

        setIsCheckingPrerequisites(false)
      } catch (error) {
        console.error('[v0] Error checking A4 prerequisites:', error)
        trackEvent('error_occurred', { errorType: error instanceof Error ? error.message : 'unknown' })
        setIsCheckingPrerequisites(false)
      }
    }

    checkPrerequisites()
  }, [user?.id, loading, router, trackEvent])

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
        {/* Tab Change Handler */}
        {activeTab && (
          <script>{`console.log('[v0] A4 tab changed to:', '${activeTab}')`}</script>
        )}
        
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
              Tu Radar Estratégico Integral
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent dark:from-teal-400 dark:to-emerald-400">
              A4: Radar Estratégico
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 text-balance mb-4 font-medium">
              No es solo mercado laboral. Es contexto país, cultura empresarial, noticias, tests, biblioteca y criterio.
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 text-balance">
              7 herramientas integradas para que entiendas el panorama laboral chileno, veas las oportunidades reales y tomes decisiones estratégicas.
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
              <h2 className="text-2xl font-bold">1. Radar Estratégico</h2>
              <p className="text-muted-foreground">
                Análisis profundo del mercado laboral chileno con 7 capas cognitivas: tendencias, sectores crecientes, roles demandados, salarios, ubicación, futuro.
              </p>
            </div>
            <RadarEstrategico />
          </TabsContent>

          {/* Noticias Tab */}
          <TabsContent value="noticias" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">2. Noticias del Mercado</h2>
              <p className="text-muted-foreground">
                Tendencias laborales, cambios en industrias, innovación, oportunidades emergentes. El pulso real de qué está sucediendo ahora.
              </p>
            </div>
            <NoticiasFeed />
          </TabsContent>

          {/* Personalizadas Tab */}
          <TabsContent value="personalizadas" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">3. Cultura General Profesional</h2>
              <p className="text-muted-foreground">
                Contenido adaptado según tu perfil DISC: tendencias de liderazgo, cambio organizacional, disruption, sector específico a tu interés.
              </p>
            </div>
            <PersonalizationProfile />
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">4. Tests Gamificados</h2>
              <p className="text-muted-foreground">
                Aplica tu conocimiento del mercado en escenarios reales, juega, aprende y gana puntos mientras calibras tu comprensión laboral.
              </p>
            </div>
            <GamifiedTests />
          </TabsContent>

          {/* Casos Tab */}
          <TabsContent value="casos" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">5. Casos Reales de Éxito</h2>
              <p className="text-muted-foreground">
                Aprende de historias reales: desafíos, estrategias y resultados de profesionales y empresas que transformaron su posición en el mercado.
              </p>
            </div>
            <PruebasTab />
          </TabsContent>

          {/* Biblioteca Tab */}
          <TabsContent value="biblioteca" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">6. Biblioteca Curada</h2>
              <p className="text-muted-foreground">
                100+ libros, artículos, podcasts, reportes de investigación, papers. Todo seleccionado para deepdive en tu crecimiento profesional.
              </p>
            </div>
            <Biblioteca />
          </TabsContent>

          {/* Insignias Tab */}
          <TabsContent value="badges" className="space-y-4">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">7. Criterio & Gamificación</h2>
              <p className="text-muted-foreground">
                Insignias, puntos, ranking. Métrica de tu comprensión acumulada y evolución como profesional consciente del mercado laboral.
              </p>
            </div>
            <PointsBadgesSystem />
          </TabsContent>
        </Tabs>

        {/* Footer Navigation */}
        <div className="mt-16 space-y-6 border-t pt-8">

          {/* ⭐ A4 V2: CRITERION & DEEP CONTEXT - NEW */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Cómo Desarrollar Criterio Verdadero</h2>
            <Card className="border-2 border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-900/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white dark:bg-slate-900 rounded border-l-4 border-teal-600">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">1. OBSERVAR</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Lee noticias, estudios, reportes. No solo titulares. Busca: ¿por qué cambió esto? ¿Quién se beneficia?</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded border-l-4 border-teal-600">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">2. CONECTAR</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Vincula 3 trends diferentes. ¿Cómo se refuerzan? ¿Dónde ve oportunidad una persona con criterio?</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-900 rounded border-l-4 border-teal-600">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">3. ACTUAR</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Prueba tu hipótesis. Habla con gente en roles/industrias affected. Verifica si tu lectura es real.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ⭐ A4 V2: LABOR MARKET CONTEXT - NEW */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Contexto Laboral: Tendencias Clave 2026</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-emerald-200 dark:border-emerald-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Sectores en Expansión
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                    <p className="font-semibold text-sm">• Tech & IA</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Demanda de skilled engineers, prompt engineers, AI trainers</p>
                  </div>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                    <p className="font-semibold text-sm">• Salud Digital</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Telemedicina, health analytics, reguladores de privacidad</p>
                  </div>
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                    <p className="font-semibold text-sm">• Sostenibilidad</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">ESG officers, carbon tracking, renewable energy</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200 dark:border-red-800">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-red-600" />
                    Competencias Ahora Críticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-sm">• AI Literacy</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">No es opcional. Todo rol pide "comfortable with AI"</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-sm">• Adaptabilidad</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Empresas buscan gente que pivote, no especialistas rígidos</p>
                  </div>
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <p className="font-semibold text-sm">• Comunicación Cruzada</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Equipos distribuidas, multidisciplinarias, remote-first</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ⭐ A4 V2: NOISE vs SIGNAL - NEW */}
          <div>
            <Card className="border-2 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="text-lg">Aprender a Filtrar: Noise vs Signal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">❌ NOISE (Ignorar)</p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Clickbait: "Este 1 truco cambió todo"</li>
                      <li>• Predicciones sin data: "En 5 años todos seran..."</li>
                      <li>• Vendidas: Consultoras diciendo que necesitas SU servicio</li>
                      <li>• Opinión personal: Influencers sin contexto real</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">✓ SIGNAL (Prestar atención)</p>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <li>• Data: Reportes de Banco Central, INE, encuestas verificadas</li>
                      <li>• Historias reales: Profesionales hablando su experiencia</li>
                      <li>• Cambios estructurales: Regulaciones nuevas, fusiones, disrupciones</li>
                      <li>• Patrón repetido: 3+ fuentes dicen lo mismo sin coordinarse</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Standard Footer */}
          <p className="text-center text-muted-foreground">
            A4 es tu centro de aprendizaje continuo sobre el mercado, la economía y las oportunidades laborales en Chile.
          </p>
          <p className="text-xs text-center text-muted-foreground/70">
            Datos actualizados en tiempo real • Análisis estructurado con 7 capas cognitivas • 100+ recursos curados
          </p>
        </div>
      </div>
    </div>
  )
}
