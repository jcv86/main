"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, Mail } from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 to-purple-50 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-2 border-blue/20">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue/10 rounded-lg flex items-center justify-center mb-4">
              <Building className="w-8 h-8 text-blue" />
            </div>
            <CardTitle className="text-3xl">Estamos Construyendo</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-lg text-gray-700">
              La sección de carreras está en desarrollo. Estamos definiendo nuestro equipo y estructura organizacional de la mano con nuestros usuarios.
            </p>
            
            <p className="text-gray-600">
              Si estás interesado en ser parte de Despega Tu Carrera, nos encantaría conectar contigo.
            </p>

            <div className="bg-blue/5 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-3">Envíanos tu interés a:</p>
              <a 
                href="mailto:equipo@despegatucarrera.cl"
                className="inline-flex items-center gap-2 text-blue hover:text-blue font-semibold"
              >
                <Mail className="w-4 h-4" />
                equipo@despegatucarrera.cl
              </a>
            </div>

            <div className="pt-4">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
