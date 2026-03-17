"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Brain } from "lucide-react"

export default function CulturaGeneralPage() {
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
              <Brain className="w-3 h-3 mr-2" />
              Cultura General
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Entrenamiento Cognitivo Gamificado</h1>
            <p className="text-lg text-muted-foreground">
              Tests sobre economía, industrias, trends laborales y cultura profesional. Aprende jugando.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Economía 101</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Conceptos fundamentales de economía y mercados
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Industrias de Hoy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Conoce las principales industrias de Chile y el mundo
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trends Laborales</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Las tendencias que están moldeando el mercado laboral
            </CardContent>
          </Card>

          <Card className="lg:col-span-3 bg-muted/50">
            <CardHeader>
              <Badge className="w-fit">Próximamente</Badge>
              <CardTitle className="text-lg mt-2">Sistema de Gamificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Tests interactivos con múltiples niveles</p>
              <p>• Sistema de puntos y badges</p>
              <p>• Leaderboard comunitario</p>
              <p>• Explicaciones detalladas para cada respuesta</p>
              <p>• Seguimiento de progreso</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
