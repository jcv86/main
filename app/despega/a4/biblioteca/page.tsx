"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, BookOpen, AlertCircle } from "lucide-react"

export default function BibliotecaPage() {
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuthRedirect()

  useEffect(() => {
    if (authLoading || !user?.id) return
    
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 300))
        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading biblioteca:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [authLoading, user?.id])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Biblioteca Curada</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Recursos seleccionados para tu crecimiento profesional
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {["Todos", "Libros", "Artículos", "Podcasts", "Cursos", "Reportes"].map((filter) => (
            <Button 
              key={filter} 
              variant={filter === "Todos" ? "default" : "outline"}
              size="sm"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Economía", resources: 12 },
            { title: "Mercado Laboral", resources: 8 },
            { title: "Tecnología", resources: 15 },
            { title: "Liderazgo", resources: 10 },
            { title: "Innovación", resources: 7 },
            { title: "Finanzas", resources: 9 },
          ].map((cat) => (
            <Card key={cat.title} className="border-0 bg-card/70 hover:bg-card transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{cat.title}</span>
                  <Badge variant="secondary">{cat.resources}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" size="sm" className="w-full">Ver recursos</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tu Actividad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Recursos guardados</span>
                <Badge>0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">En progreso</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Completados</span>
                <Badge variant="outline">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon */}
        <Card className="border-0 bg-amber-500/10 backdrop-blur-sm">
          <CardContent className="pt-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Próximamente</p>
              <p className="text-sm text-muted-foreground mt-1">
                La biblioteca completa con recursos curados está siendo preparada. Pronto tendrás acceso a libros, artículos, podcasts y cursos seleccionados.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
