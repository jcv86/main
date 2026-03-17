"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Radar } from "lucide-react"

export default function RadarPage() {
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
              <Radar className="w-3 h-3 mr-2" />
              Radar Estratégico
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Análisis Estructurado de Noticias</h1>
            <p className="text-lg text-muted-foreground">
              Entiende qué está pasando realmente en Chile con un análisis de 7 capas cognitivas.
            </p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 7 Capas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Las 7 Capas del Análisis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="font-medium">1. Delta vs Ayer</p>
                <p className="text-sm text-muted-foreground">Qué cambió con respecto al día anterior</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">2. Impacto Potencial</p>
                <p className="text-sm text-muted-foreground">Consecuencias económicas y laborales</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">3. Narrativa vs Realidad</p>
                <p className="text-sm text-muted-foreground">Lo que dicen vs lo que realmente pasó</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">4. Weak Signals</p>
                <p className="text-sm text-muted-foreground">Señales débiles que podrían ser importantes</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">5. Tu Energía</p>
                <p className="text-sm text-muted-foreground">Cómo esto afecta tu bienestar</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">6. Acción Sugerida</p>
                <p className="text-sm text-muted-foreground">Qué puedes hacer al respecto</p>
              </div>
              <div className="space-y-2">
                <p className="font-medium">7. Tu Watchlist</p>
                <p className="text-sm text-muted-foreground">Monitorea temas de tu interés</p>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon */}
          <Card className="bg-muted/50">
            <CardHeader>
              <Badge className="w-fit">Próximamente</Badge>
              <CardTitle className="text-xl mt-2">Funcionalidades En Desarrollo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span>▸</span>
                  <span>Noticias curadas diariamente con análisis editorial</span>
                </li>
                <li className="flex gap-2">
                  <span>▸</span>
                  <span>Personalización por tu perfil Despega</span>
                </li>
                <li className="flex gap-2">
                  <span>▸</span>
                  <span>Matriz interactiva de las 7 capas</span>
                </li>
                <li className="flex gap-2">
                  <span>▸</span>
                  <span>Integración con indicadores económicos</span>
                </li>
                <li className="flex gap-2">
                  <span>▸</span>
                  <span>Alertas para weak signals importante</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
