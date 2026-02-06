"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Newspaper, BookOpen, Bookmark } from "lucide-react"
import { A4NewsFeed } from "@/components/a4-news-feed"
import { A4LearningModules } from "@/components/a4-learning-modules"

export default function A4Page() {
  const [loading, setLoading] = useState(true)
  const [newsItems, setNewsItems] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [savedResources, setSavedResources] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState("noticias")
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

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

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="noticias">
              <Newspaper className="w-4 h-4 mr-2" />
              Noticias
            </TabsTrigger>
            <TabsTrigger value="modulos">
              <BookOpen className="w-4 h-4 mr-2" />
              Módulos
            </TabsTrigger>
            <TabsTrigger value="coaching">
              <span className="mr-2">🎯</span>
              Coaching
            </TabsTrigger>
            <TabsTrigger value="plan">
              <span className="mr-2">📋</span>
              Tu Plan
            </TabsTrigger>
          </TabsList>

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
