'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowRight, TrendingUp, BookOpen, Lightbulb, Globe } from 'lucide-react'

export default function A4HubPage() {
  const [loading, setLoading] = useState(true)
  const [newsCount, setNewsCount] = useState(0)
  const [resourcesCount, setResourcesCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const { count: newsData } = await supabase
      .from('biblioteca')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true)

    const { count: resourcesData } = await supabase
      .from('biblioteca')
      .select('*', { count: 'exact', head: true })

    setNewsCount(newsData || 0)
    setResourcesCount(resourcesData || 0)
    setLoading(false)
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

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{newsCount}</p>
                  <p className="text-sm text-muted-foreground">Artículos Destacados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">{resourcesCount}</p>
                  <p className="text-sm text-muted-foreground">Recursos Curados</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary mb-1">∞</p>
                  <p className="text-sm text-muted-foreground">Oportunidades</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
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
    </div>
  )
}
