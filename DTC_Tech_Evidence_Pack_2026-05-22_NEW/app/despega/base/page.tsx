"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft, Newspaper, Globe, BookOpen, TrendingUp } from "lucide-react"

const CATEGORIAS_BASE = [
  {
    id: "noticias",
    name: "Noticias del Día",
    description: "Mantente informado de lo relevante",
    icon: Newspaper,
    color: "bg-red/50",
    lightColor: "bg-red/10",
    textColor: "text-red",
  },
  {
    id: "cultura",
    name: "Cultura General",
    description: "Conocimiento que marca la diferencia",
    icon: Globe,
    color: "bg-blue/50",
    lightColor: "bg-blue/10",
    textColor: "text-blue",
  },
  {
    id: "lecturas",
    name: "Lecturas Recomendadas",
    description: "Libros y artículos clave",
    icon: BookOpen,
    color: "bg-green/50",
    lightColor: "bg-green/10",
    textColor: "text-green",
  },
  {
    id: "tendencias",
    name: "Tendencias",
    description: "Lo que viene en tu industria",
    icon: TrendingUp,
    color: "bg-purple/50",
    lightColor: "bg-purple/10",
    textColor: "text-purple",
  },
]

const NOTICIAS_EJEMPLO = [
  {
    id: 1,
    titulo: "Tendencias del mercado laboral 2024",
    resumen: "Las habilidades más demandadas y cómo prepararte",
    categoria: "tendencias",
    fecha: "Hoy",
    puntos: 5,
  },
  {
    id: 2,
    titulo: "Inteligencia Artificial en el trabajo",
    resumen: "Cómo adaptarte y aprovechar las nuevas herramientas",
    categoria: "noticias",
    fecha: "Hoy",
    puntos: 5,
  },
  {
    id: 3,
    titulo: "Economía chilena: perspectivas",
    resumen: "Análisis del panorama económico actual",
    categoria: "cultura",
    fecha: "Ayer",
    puntos: 5,
  },
]

export default function BasePage() {
  const [loading, setLoading] = useState(true)
  const [pilarProgress, setPilarProgress] = useState<any>(null)
  const [noticiasLeidas, setNoticiasLeidas] = useState<Set<number>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: progressData } = await supabase
        .from("despega_pilar_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("pilar", "base")
        .single()

      if (progressData) setPilarProgress(progressData)

      setLoading(false)
    }

    loadData()
  }, [supabase])

  const handleLeerNoticia = (noticiaId: number) => {
    setNoticiasLeidas(prev => new Set([...prev, noticiaId]))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        
        {/* JOURNEY PROGRESS - BIG VISUAL */}
        <div className="bg-background">
          <h1 className="text-3xl font-bold mb-2">Tu Viaje DespegarTuCarrera</h1>
          <p className="text-white mb-6">90 días de transformación profesional. Aquí está dónde estás:</p>
          
          {/* Journey Map */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* A1 */}
              <Link href="/despega/a1-cerebral" className="flex-1">
                <div className="bg-white/20 backdrop-blur hover:bg-white/30 transition-all p-4 rounded-[28px] cursor-pointer border border-white/30 text-center">
                  <div className="text-2xl mb-2"></div>
                  <h3 className="font-bold text-sm">A1: Autoconocimiento</h3>
                  <p className="text-xs text-white mt-1">Descubre tu perfil DISC</p>
                  <Badge className="mt-2 bg-white text-indigo-700 text-xs">Completado</Badge>
                </div>
              </Link>
              
              {/* Arrow */}
              <div className="text-2xl">→</div>
              
              {/* A2 */}
              <Link href="/despega/a2/dashboard" className="flex-1">
                <div className="bg-white/20 backdrop-blur hover:bg-white/30 transition-all p-4 rounded-[28px] cursor-pointer border-2 border-white/70 text-center ring-2 ring-white/50">
                  <div className="text-2xl mb-2">🏗️</div>
                  <h3 className="font-bold text-sm">A2: Exploración</h3>
                  <p className="text-xs text-white mt-1">Construye tu plan de 90 días</p>
                  <Badge className="mt-2 bg-yellow/40 text-yellow text-xs">En Progreso</Badge>
                </div>
              </Link>
              
              {/* Arrow */}
              <div className="text-2xl opacity-50">→</div>
              
              {/* A3 */}
              <Link href="/despega/a3" className="flex-1">
                <div className="bg-white/10 backdrop-blur hover:bg-white/20 transition-all p-4 rounded-[28px] cursor-pointer border border-white/20 text-center opacity-70">
                  <div className="text-2xl mb-2"></div>
                  <h3 className="font-bold text-sm">A3: Aterrizaje</h3>
                  <p className="text-xs text-indigo-200 mt-1">Entrena con simulaciones</p>
                  <Badge variant="outline" className="mt-2 text-xs bg-white/10">Próximo</Badge>
                </div>
              </Link>
              
              {/* Arrow */}
              <div className="text-2xl opacity-30">→</div>
              
              {/* A4 */}
              <Link href="/despega/a4-base" className="flex-1">
                <div className="bg-white/10 backdrop-blur hover:bg-white/20 transition-all p-4 rounded-[28px] cursor-pointer border border-white/20 text-center opacity-70">
                  <div className="text-2xl mb-2">🌍</div>
                  <h3 className="font-bold text-sm">A4: La Realidad</h3>
                  <p className="text-xs text-indigo-200 mt-1">Contexto estratégico</p>
                  <Badge variant="outline" className="mt-2 text-xs bg-white/10">Futuro</Badge>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Progreso General</span>
              <span className="text-sm font-bold">50%</span>
            </div>
            <Progress value={50} className="h-2 bg-white/30" />
            <p className="text-xs text-white mt-2">Completaste A1. Actualmente en A2. Te faltan A3 y A4.</p>
          </div>
        </div>

        {/* NEXT STEPS - PROMINENT */}
        <Card className="border-2 border-green bg-green/5 dark:bg-green/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl"></span> Tu Próximo Paso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground dark:text-white/85 mb-4">
              Estás en <strong>Sprint 1: Fundamentos</strong> (días 1-30). Continúa con tus acciones diarias y aprenderás los pilares básicos de tu transformación.
            </p>
            <div className="flex gap-3">
              <Link href="/despega/a2/dashboard" className="flex-1">
                <Button className="w-full bg-green/80 hover:bg-green/70 text-white font-semibold" size="lg">
                  Continuar en A2 Sprint 1
                </Button>
              </Link>
              <Link href="/despega/a2/coach" className="flex-1">
                <Button variant="outline" className="w-full" size="lg">
                  Hablar con Coach
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-blue">1/4</div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">Fases Completadas</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-yellow">5/30</div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">Días Sprint 1</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-purple">12</div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">Acciones Totales</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green">7/7</div>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">Racha Días</p>
            </CardContent>
          </Card>
        </div>

        {/* Section Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Centro de Recursos</h2>
          <p className="text-muted-foreground dark:text-muted-foreground">Acceso rápido a noticias, cultura y recursos para tu transformación</p>
        </div>

        {/* Categorías */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {CATEGORIAS_BASE.map((cat) => {
            const Icon = cat.icon
            return (
              <Card key={cat.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-lg ${cat.lightColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${cat.textColor}`} />
                  </div>
                  <h3 className="font-medium text-sm">{cat.name}</h3>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Contenido del Día */}
        <Card>
          <CardHeader>
            <CardTitle>Contenido del Día</CardTitle>
            <CardDescription>Lee al menos 3 artículos para ganar puntos extra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {NOTICIAS_EJEMPLO.map((noticia) => {
                const leida = noticiasLeidas.has(noticia.id)
                return (
                  <div 
                    key={noticia.id}
                    className={`p-4 border rounded-lg ${leida ? "bg-green/5 border-green/20" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {noticia.categoria}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{noticia.fecha}</span>
                        </div>
                        <h3 className="font-medium">{noticia.titulo}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{noticia.resumen}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-purple">+{noticia.puntos} pts</span>
                        {leida ? (
                          <Badge className="bg-green/50">Leído</Badge>
                        ) : (
                          <Button size="sm" onClick={() => handleLeerNoticia(noticia.id)}>
                            Leer
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Link a Biblioteca */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Explora la Biblioteca Completa</h3>
                <p className="text-sm text-muted-foreground">64+ libros de desarrollo profesional</p>
              </div>
              <Button asChild>
                <Link href="/biblioteca">Ver Biblioteca</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
