import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowRight, TrendingUp, BookOpen, Lightbulb, Globe, Radar, CheckCircle } from "lucide-react"

export default async function A4HubPage() {
  // Get session - use getServerSession with proper auth config
  const session = await getServerSession()
  
  console.log('[v0] A4 Session check - User:', session?.user?.email, 'Session exists:', !!session)
  
  if (!session?.user?.email) {
    console.log('[v0] A4: No session found, redirecting to login')
    redirect("/auth/signin")
  }

  console.log('[v0] A4 User authenticated:', session.user.email)

  let newsCount = 0
  let resourcesCount = 0
  let userProfile: any = null

  try {
    const supabase = createClient()

    // Get user from database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single()

    if (userError) {
      console.log('[v0] User not found in Supabase (this is okay on first visit):', userError.message)
    }

    if (userData?.id) {
      const userId = userData.id

      // Get user Despega profile
      const { data: despegarProfile } = await supabase
        .from("despega_cerebral_perfil")
        .select("tipo_perfil")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (despegarProfile) {
        console.log('[v0] User Despega profile:', despegarProfile.tipo_perfil)
        userProfile = despegarProfile
      }
    }

    // Load featured news/resources
    const { count: newsData, error: newsError } = await supabase
      .from("biblioteca")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true)

    if (newsError) {
      console.log('[v0] Error loading featured news:', newsError.message)
    }

    // Load all resources
    const { count: resourcesData, error: resourcesError } = await supabase
      .from("biblioteca")
      .select("*", { count: "exact", head: true })

    if (resourcesError) {
      console.log('[v0] Error loading all resources:', resourcesError.message)
    }

    newsCount = newsData || 0
    resourcesCount = resourcesData || 0
  } catch (error) {
    console.error('[v0] Error loading A4 data:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
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
        </div>

        {/* Additional Resources Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-8">Más Recursos de Aprendizaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    Contenido filtrado según tu perfil Despega, industrias de interés, y ruta de desarrollo profesional.
                  </p>
                  <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Mis Noticias <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/despega" className="group">
              <Card className="h-full border-0 bg-card/70 hover:bg-card backdrop-blur-sm transition-all duration-300 hover:shadow-lg cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <Badge variant="secondary" className="text-xs">Volver</Badge>
                  </div>
                  <CardTitle className="text-xl">Mi Progreso</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Regresa al dashboard principal para ver tu progreso en A1, A2, A3 y A4. Continúa donde dejaste.
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Ver Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
