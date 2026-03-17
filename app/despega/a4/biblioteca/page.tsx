"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"

export default function BibliotecaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Link href="/despega/a4">
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a A4
            </Button>
          </Link>
          <div className="max-w-3xl">
            <Badge className="mb-4">
              <BookOpen className="w-3 h-3 mr-2" />
              Biblioteca
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Biblioteca Curada de Recursos</h1>
            <p className="text-lg text-muted-foreground">
              Libros, artículos y recursos seleccionados para tu crecimiento profesional e intelectual.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Libros Recomendados</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Selección de libros sobre economía, negocios y desarrollo profesional
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Artículos Clave</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Artículos académicos y de investigación sobre tendencias laborales
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Podcasts & Videos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Contenido de audio y video de expertos de la industria
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reportes Industriales</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reportes y estudios de las principales consultoras
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cursos Online</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Plataformas y cursos recomendados para profundizar temas
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <Badge className="w-fit">Próximamente</Badge>
            </CardHeader>
            <CardContent className="text-sm">
              <p>Búsqueda avanzada</p>
              <p>Listas personalizadas</p>
              <p>Notas y highlights</p>
              <p>Badges de lectura</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
