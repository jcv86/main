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
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-2xl">
              🌍
            </div>
            <div>
              <h1 className="text-2xl font-bold">A4 Base - Contexto Profesional</h1>
              <p className="text-muted-foreground">Noticias, tendencias y módulos de aprendizaje sobre el mercado profesional</p>
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

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="noticias">
              <Newspaper className="w-4 h-4 mr-2" />
              Noticias
            </TabsTrigger>
            <TabsTrigger value="modulos">
              <BookOpen className="w-4 h-4 mr-2" />
              Módulos
            </TabsTrigger>
            <TabsTrigger value="recursos">
              <Bookmark className="w-4 h-4 mr-2" />
              Recursos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="noticias" className="space-y-6">
            <A4NewsFeed items={newsItems} onSave={handleSaveNews} />
          </TabsContent>

          <TabsContent value="modulos" className="space-y-6">
            <A4LearningModules modules={modules} onCompleteModule={handleCompleteModule} />
          </TabsContent>

          <TabsContent value="recursos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Biblioteca de Recursos
                </CardTitle>
                <CardDescription>
                  Colección curada de libros, artículos, herramientas y más
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Los recursos se cargarán aquí. Sistema en desarrollo.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6 flex gap-3">
            <div className="w-5 h-5 flex-shrink-0 text-blue-600">💡</div>
            <div>
              <div className="font-medium text-blue-900 mb-1">Cómo usar A4 Base</div>
              <div className="text-sm text-blue-800">
                Mantente actualizado con noticias relevantes a tu carrera, aprende sobre el contexto del mercado chileno, 
                y desarrolla tu comprensión de tendencias profesionales. Cada módulo completo te proporciona puntos y feedback personalizado.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
