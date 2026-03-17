"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, TrendingUp } from "lucide-react"

export default function NoticiasMercadoPage() {
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
              <TrendingUp className="w-3 h-3 mr-2" />
              Noticias Mercado
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Noticias del Mercado Laboral y Económico</h1>
            <p className="text-lg text-muted-foreground">
              Tendencias laborales, cambios en industrias y oportunidades emergentes en Chile.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categorías</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">• Mercado Laboral</p>
              <p className="text-sm">• Industrias en Crecimiento</p>
              <p className="text-sm">• Startups & Innovación</p>
              <p className="text-sm">• Economía General</p>
              <p className="text-sm">• Tendencias Globales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fuentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">• Medios nacionales</p>
              <p className="text-sm">• Reportes de industria</p>
              <p className="text-sm">• Análisis académico</p>
              <p className="text-sm">• Estudios de mercado</p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <Badge className="w-fit">Próximamente</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Archivo completo de noticias</p>
              <p>Filtros avanzados</p>
              <p>Búsqueda por palabra clave</p>
              <p>Suscripción a alertas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
