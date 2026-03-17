"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowRight, TrendingUp, BookOpen, Lightbulb, Globe, Radar, CheckCircle } from "lucide-react"

export default function A4HubPage() {
  const [activeTab, setActiveTab] = useState("radar")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm">
              <Globe className="w-3 h-3 mr-2" />
              Fase A4: Radar Estratégico
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
              Entiende el Mercado en Tiempo Real
            </h1>
            <p className="text-xl text-muted-foreground text-balance mb-8">
              Análisis estructurado de noticias con 7 capas cognitivas. Entiende qué está pasando realmente en Chile y cómo te afecta.
            </p>
          </div>
        </div>

        {/* Main Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
            <TabsTrigger value="radar" className="text-xs md:text-sm">Radar</TabsTrigger>
            <TabsTrigger value="noticias" className="text-xs md:text-sm">Noticias</TabsTrigger>
            <TabsTrigger value="personalizadas" className="text-xs md:text-sm">Personalizadas</TabsTrigger>
            <TabsTrigger value="cultura" className="text-xs md:text-sm">Cultura</TabsTrigger>
            <TabsTrigger value="pruebas" className="text-xs md:text-sm">Pruebas</TabsTrigger>
            <TabsTrigger value="biblioteca" className="text-xs md:text-sm">Biblioteca</TabsTrigger>
          </TabsList>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Radar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Radar Estratégico</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Análisis estructurado de noticias con 7 capas cognitivas para entender qué está pasando realmente.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">7 Capas de Análisis:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Qué cambió vs ayer</li>
                      <li>Impacto potencial</li>
                      <li>Narrativa vs realidad</li>
                      <li>Weak signals</li>
                      <li>Tu energía hoy</li>
                      <li>Acción sugerida</li>
                      <li>Watchlist personal</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Beneficios:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Contexto real, no titulares</li>
                      <li>Impacto laboral directo</li>
                      <li>Interpretación estructurada</li>
                      <li>Acciones claras</li>
                      <li>Curación editorial diaria</li>
                      <li>Análisis sin sesgos</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-amber-600 bg-amber-500/10 p-3 rounded-lg">
                  Próximamente: Radar diario actualizado con análisis en profundidad
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Noticias Tab */}
          <TabsContent value="noticias" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl">Noticias del Mercado</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Tendencias laborales, cambios en industrias, oportunidades emergentes y análisis del mercado en tiempo real.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Categorías</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Mercado Laboral</li>
                      <li>Industrias</li>
                      <li>Economía</li>
                      <li>Tendencias Globales</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Fuentes</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Medios principales</li>
                      <li>Análisis especializados</li>
                      <li>LinkedIn Pro</li>
                      <li>Reportes industriales</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Frecuencia</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Actualización diaria</li>
                      <li>Análisis semanal</li>
                      <li>Reportes mensuales</li>
                      <li>Deep dives</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-amber-600 bg-amber-500/10 p-3 rounded-lg">
                  Próximamente: Feed de noticias curado en vivo
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalizadas Tab */}
          <TabsContent value="personalizadas" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-purple-500/10 rounded-lg">
                    <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl">Noticias Personalizadas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Contenido filtrado según tu perfil Despega, industrias de interés y ruta de desarrollo.
                </p>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Tu feed se personaliza por:</h4>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Tu perfil Despega (Dominador, Influenciador, Concienzudo, Estable)</li>
                    <li>Tu ruta de desarrollo (A1→A4)</li>
                    <li>Industrias de interés</li>
                    <li>Nivel de profundidad preferido</li>
                    <li>Temas que guardas</li>
                  </ul>
                </div>
                <p className="text-sm text-amber-600 bg-amber-500/10 p-3 rounded-lg">
                  Próximamente: Algoritmo de personalización inteligente basado en tu engagement
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cultura General Tab */}
          <TabsContent value="cultura" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-2xl">Cultura General & Entrenamient</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Tests gamificados sobre economía, industrias, tendencias laborales y cultura profesional.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Temas de Tests:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Economía Básica</li>
                      <li>Tendencias Industriales</li>
                      <li>Mercado Laboral</li>
                      <li>Cultura Organizacional</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Gamificación:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Puntos por respuestas correctas</li>
                      <li>Badges por temas dominados</li>
                      <li>Leaderboard semanal</li>
                      <li>Explicaciones detalladas</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-amber-600 bg-amber-500/10 p-3 rounded-lg">
                  Próximamente: 50+ tests con análisis profundo
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pruebas Tab */}
          <TabsContent value="pruebas" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-red-500/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-2xl">Pruebas & Análisis de Contexto</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Mini pruebas rápidas para evaluar tu comprensión del contexto económico y laboral actual.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Pruebas Disponibles:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Análisis de casos reales</li>
                      <li>Interpretación de datos</li>
                      <li>Toma de decisiones</li>
                      <li>Identificación de oportunidades</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Formato:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>5-10 min por test</li>
                      <li>Feedback inmediato</li>
                      <li>Explicaciones detalladas</li>
                      <li>Contexto de referencia</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-amber-600 bg-amber-500/10 p-3 rounded-lg">
                  Próximamente: Sistema de evaluación adaptativo
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Biblioteca Tab */}
          <TabsContent value="biblioteca" className="space-y-4">
            <Card className="border-0 bg-card/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <CardTitle className="text-2xl">Biblioteca Curada</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Libros, artículos y recursos seleccionados para tu crecimiento profesional.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Tipos de Recursos:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Libros recomendados</li>
                      <li>Artículos en profundidad</li>
                      <li>Podcasts clave</li>
                      <li>Reportes de investigación</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Características:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Resúmenes ejecutivos</li>
                      <li>Notas destacadas</li>
                      <li>Progreso de lectura</li>
                      <li>Colecciones temáticas</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Temas Curados:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Liderazgo</li>
                      <li>Innovación</li>
                      <li>Negociación</li>
                      <li>Mentalidad de crecimiento</li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-amber-600 bg-amber-500/10 p-3 rounded-lg">
                  Próximamente: 100+ recursos curados con acceso directo
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Navigation */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">
            A4 es tu centro de aprendizaje continuo sobre el mercado, la economía y las oportunidades laborales.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/despega">
              <Button variant="outline">Volver a Despega</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
