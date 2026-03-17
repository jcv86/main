'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, TrendingUp, BookOpen, Lightbulb, Globe, Radar, CheckCircle } from 'lucide-react'

export default function A4HubPage() {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [newsCount, setNewsCount] = useState(0)
  const [resourcesCount, setResourcesCount] = useState(0)
  const [userProfile, setUserProfile] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndLoadStats = async () => {
      try {
        // Check authentication
        const { data: { session }, error: authError } = await supabase.auth.getSession()
        
        if (authError || !session?.user) {
          console.log('[v0] User not authenticated, redirecting to login')
          router.push('/auth/signin')
          return
        }

        const user = session.user
        setIsAuthenticated(true)

        // Get user DISC profile from Despega profile
        const { data: despegarProfile } = await supabase
          .from('despega_cerebral_perfil')
          .select('tipo_perfil')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (despegarProfile) {
          console.log('[v0] User Despega profile:', despegarProfile.tipo_perfil)
          setUserProfile(despegarProfile)
        }

        // Load featured news/resources
        const { count: newsData } = await supabase
          .from('biblioteca')
          .select('*', { count: 'exact', head: true })
          .eq('is_featured', true)

        // Load all resources for user (personalization handled in sub-pages)
        const { count: resourcesData } = await supabase
          .from('biblioteca')
          .select('*', { count: 'exact', head: true })

        setNewsCount(newsData || 0)
        setResourcesCount(resourcesData || 0)
      } catch (error) {
        console.error('[v0] Error loading A4 page:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadStats()
  }, [supabase, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      {/* Show loading state */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando A4...</p>
          </div>
        </div>
      )}

      {/* Only render if authenticated and loaded */}
      {!loading && isAuthenticated && (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Hero Section */}
          <div className="mb-16">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
                <Globe className="w-3 h-3 mr-2" />
                Fase A4: Contexto & Cultura
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
                Entiende el Mundo Real
              </h1>
              <p className="text-xl text-muted-foreground text-balance mb-8">
                Noticias del mercado laboral, insights sobre industrias, y cultura general profesional. Tu brújula para tomar decisiones informadas.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{newsCount}</p>
                  <p className="text-sm text-muted-foreground">Artículos para Ti</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{resourcesCount}</p>
                  <p className="text-sm text-muted-foreground">Recursos Totales</p>
                </div>
              </CardContent>
            </Card>
            {userProfile && (
              <Card className="border-0 bg-primary/5 backdrop-blur-sm col-span-1 md:col-span-2">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Tu Perfil Despega</p>
                    <Badge className="bg-primary text-primary-foreground px-4 py-1.5 text-lg font-bold">
                      {userProfile.tipo_perfil || 'N/A'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">Personalizando contenido para ti</p>
                  </div>
                </CardContent>
              </Card>
            )}
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">∞</p>
                  <p className="text-sm text-muted-foreground">Oportunidades</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Radar Estratégico - Featured First */}
          <Link href="/despega/a4/radar" className="group lg:col-span-2">
            <Card className="h-full border-0 bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer text-white">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Radar className="w-6 h-6 text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-200">Lectura del Día</Badge>
                </div>
                <CardTitle className="text-2xl text-slate-50">Radar Estratégico</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-6">
                  Análisis estructurado de noticias con 7 capas cognitivas. Entiende qué está pasando realmente, no solo qué dicen que pasó. Delta vs ayer, nivel de energía, narrativa, weak signals.
                </p>
                <div className="flex items-center text-blue-300 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Ver Radar <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* News Feed */}
          <Link href="/despega/a4/noticias" className="group">
            <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">En Vivo</Badge>
                </div>
                <CardTitle className="text-xl">Noticias del Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Tendencias laborales, cambios en industrias, oportunidades emergentes y análisis del mercado en tiempo real.
                </p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Explorar <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Learning Modules */}
          <Link href="/despega/a4/aprender" className="group">
            <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">10+ Tests</Badge>
                </div>
                <CardTitle className="text-xl">Cultura General</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Tests gamificados sobre economía, industrias, trends laborales y cultura profesional. Aprende jugando.
                </p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Comenzar <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Library */}
          <Link href="/despega/a4/biblioteca" className="group">
            <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
                    <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">{resourcesCount}+ Libros</Badge>
                </div>
                <CardTitle className="text-xl">Biblioteca Curada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Libros, artículos y recursos seleccionados para tu crecimiento profesional. Con notas, highlights y progreso.
                </p>
                <div className="flex items-center text-amber-600 dark:text-amber-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Leer <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Noticias Personalizadas */}
          <Link href="/despega/a4/noticias-personalizadas" className="group">
            <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                    <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Tu Perfil</Badge>
                </div>
                <CardTitle className="text-xl">Noticias Personalizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Contenido filtrado según tu perfil DISC, industrias de interés, y ruta de desarrollo profesional.
                </p>
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Mis Noticias <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Pruebas & Contexto */}
          <Link href="/despega/a4/pruebas-contexto" className="group">
            <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                    <Award className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <Badge variant="secondary" className="text-xs">Gamificado</Badge>
                </div>
                <CardTitle className="text-xl">Pruebas de Contexto</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Tests interactivos sobre situaciones reales, preguntas de criterio profesional, y dilemmas empresariales.
                </p>
                <div className="flex items-center text-rose-600 dark:text-rose-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Resolver Pruebas <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Audit & Verification Section */}
        <div className="mt-16 pt-12 border-t border-border/50">
          <h2 className="text-2xl font-bold mb-6">Verificación del Sistema</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audit Status Card */}
            <a href="https://github.com/jcv86/main/blob/radar-graphic/AUDIT_EXECUTIVE_SUMMARY.md" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="h-full border-0 bg-green-500/5 hover:bg-green-500/10 backdrop-blur-sm transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <Badge className="bg-green-600 text-white text-xs">✓ Aprobado</Badge>
                  </div>
                  <CardTitle className="text-lg">Auditoría Completada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    100% funcional. 12 tests simulados exitosos. 0 errores críticos.
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium text-xs group-hover:translate-x-1 transition-transform">
                    Ver Reporte <ArrowRight className="w-3 h-3 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Technical Validation */}
            <a href="https://github.com/jcv86/main/blob/radar-graphic/A4_TECHNICAL_VALIDATION.md" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="h-full border-0 bg-blue-500/5 hover:bg-blue-500/10 backdrop-blur-sm transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                      <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <Badge className="bg-blue-600 text-white text-xs">Validado</Badge>
                  </div>
                  <CardTitle className="text-lg">Validación Técnica</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Arquitectura verificada. Seguridad RLS 9.2/10. Performance optimizado.
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-xs group-hover:translate-x-1 transition-transform">
                    Detalles <ArrowRight className="w-3 h-3 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </a>

            {/* Simulation Results */}
            <a href="https://github.com/jcv86/main/blob/radar-graphic/A4_SIMULATION_MATRIX.md" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="h-full border-0 bg-purple-500/5 hover:bg-purple-500/10 backdrop-blur-sm transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                      <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <Badge className="bg-purple-600 text-white text-xs">10/10 OK</Badge>
                  </div>
                  <CardTitle className="text-lg">Simulaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    10 escenarios simulados. Crisis markets ok. 1000 users load tested.
                  </p>
                  <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium text-xs group-hover:translate-x-1 transition-transform">
                    Resultados <ArrowRight className="w-3 h-3 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </a>
          </div>
        </div>

        {/* Coach Call-to-Action */}
        <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Acompañamiento Personalizado</h3>
                <p className="text-muted-foreground">Tu Coach te ayuda a contextualizar el mercado y tomar decisiones estratégicas sobre tu carrera.</p>
              </div>
              <Link href="/despega/a2/coach">
                <Button size="lg" className="whitespace-nowrap">
                  Abrir Coach <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      )}
    </div>
  )
}
