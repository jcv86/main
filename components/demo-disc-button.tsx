"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BarChart3, Play, Brain, Target } from "lucide-react"

export default function DemoDISCButton() {
  const router = useRouter()

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue">
          <BarChart3 className="h-6 w-6" />
          Dashboard Moderno con Gráficos
        </CardTitle>
        <CardDescription className="text-blue">
          Explora nuestros gráficos de radar interactivos, análisis con IA y visualizaciones avanzadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <div className="w-10 h-10 bg-blue/10 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue" />
            </div>
            <div>
              <p className="font-medium text-sm">Gráficos Interactivos</p>
              <p className="text-xs text-muted/60">Radar, barras y circulares</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <div className="w-10 h-10 bg-purple/10 rounded-full flex items-center justify-center">
              <Brain className="h-5 w-5 text-purple" />
            </div>
            <div>
              <p className="font-medium text-sm">Análisis con IA</p>
              <p className="text-xs text-muted/60">Insights personalizados</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <div className="w-10 h-10 bg-green/10 rounded-full flex items-center justify-center">
              <Target className="h-5 w-5 text-green" />
            </div>
            <div>
              <p className="font-medium text-sm">Perfil Completo</p>
              <p className="text-xs text-muted/60">DISC detallado</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <div className="w-10 h-10 bg-orange/10 rounded-full flex items-center justify-center">
              <Play className="h-5 w-5 text-orange" />
            </div>
            <div>
              <p className="font-medium text-sm">Demo Interactivo</p>
              <p className="text-xs text-muted/60">Prueba inmediata</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => router.push("/test/disc/results?demo=true")} size="lg" className="flex-1">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Dashboard Completo
          </Button>
          <Button variant="outline" onClick={() => router.push("/test/disc")} size="lg" className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Realizar Test DISC
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
