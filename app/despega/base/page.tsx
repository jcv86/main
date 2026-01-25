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
    color: "bg-red-500",
    lightColor: "bg-red-100",
    textColor: "text-red-800",
  },
  {
    id: "cultura",
    name: "Cultura General",
    description: "Conocimiento que marca la diferencia",
    icon: Globe,
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
    textColor: "text-blue-800",
  },
  {
    id: "lecturas",
    name: "Lecturas Recomendadas",
    description: "Libros y artículos clave",
    icon: BookOpen,
    color: "bg-green-500",
    lightColor: "bg-green-100",
    textColor: "text-green-800",
  },
  {
    id: "tendencias",
    name: "Tendencias",
    description: "Lo que viene en tu industria",
    icon: TrendingUp,
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
    textColor: "text-purple-800",
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/despega" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver al Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl">
              📚
            </div>
            <div>
              <h1 className="text-2xl font-bold">Base</h1>
              <p className="text-muted-foreground">Noticias y cultura general para destacar</p>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center mb-4">
              <div>
                <div className="text-2xl font-bold">{pilarProgress?.progreso || 0}%</div>
                <div className="text-sm text-muted-foreground">Progreso</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{pilarProgress?.score || 0}</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{noticiasLeidas.size}</div>
                <div className="text-sm text-muted-foreground">Artículos Hoy</div>
              </div>
            </div>
            <Progress value={pilarProgress?.progreso || 0} className="h-3" />
          </CardContent>
        </Card>

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
                    className={`p-4 border rounded-lg ${leida ? "bg-green-50 border-green-200" : ""}`}
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
                        <span className="text-sm font-medium text-primary">+{noticia.puntos} pts</span>
                        {leida ? (
                          <Badge className="bg-green-500">Leído</Badge>
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
