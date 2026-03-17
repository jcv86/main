"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, User } from "lucide-react"

export default function NoticiasPersonalizadasPage() {
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
              <User className="w-3 h-3 mr-2" />
              Noticias Personalizadas
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Tu Feed Personalizado</h1>
            <p className="text-lg text-muted-foreground">
              Noticias seleccionadas según tu perfil Despega, industrias de interés y ruta de desarrollo.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtros Aplicados</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-sm">Perfil Detectado</p>
                <p className="text-sm text-muted-foreground">Tu perfil de personalidad Despega</p>
              </div>
              <div>
                <p className="font-medium text-sm">Ruta Seleccionada</p>
                <p className="text-sm text-muted-foreground">Tu camino profesional en A2</p>
              </div>
              <div>
                <p className="font-medium text-sm">Intereses Marcados</p>
                <p className="text-sm text-muted-foreground">Industrias y temas de tu interés</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <Badge className="w-fit">Próximamente</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>Feed en tiempo real</p>
              <p>Recomendaciones inteligentes</p>
              <p>Historial de lectura</p>
              <p>Compartir artículos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
