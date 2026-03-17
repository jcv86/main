"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, CheckSquare } from "lucide-react"

export default function PruebasContextoPage() {
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
              <CheckSquare className="w-3 h-3 mr-2" />
              Pruebas & Contexto
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Tests de Contexto y Análisis</h1>
            <p className="text-lg text-muted-foreground">
              Pruebas prácticas para desarrollar tu capacidad de análisis contextual y toma de decisiones.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipos de Pruebas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-sm">Análisis de Casos</p>
                <p className="text-xs text-muted-foreground">Escenarios reales del mercado laboral</p>
              </div>
              <div>
                <p className="font-medium text-sm">Interpretación de Datos</p>
                <p className="text-xs text-muted-foreground">Lee gráficos y extrae conclusiones</p>
              </div>
              <div>
                <p className="font-medium text-sm">Mini Decisiones</p>
                <p className="text-xs text-muted-foreground">Elige la mejor opción en situaciones profesionales</p>
              </div>
              <div>
                <p className="font-medium text-sm">Weak Signal Detection</p>
                <p className="text-xs text-muted-foreground">Identifica señales débiles importante</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <Badge className="w-fit">Próximamente</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>✓ Tests adaptativos a tu nivel</p>
              <p>✓ Retroalimentación instantánea</p>
              <p>✓ Explicaciones detalladas</p>
              <p>✓ Certificados de competencia</p>
              <p>✓ Benchmarking comunitario</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
