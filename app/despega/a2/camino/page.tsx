"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Heart, Briefcase, Zap, Check } from "lucide-react"

const CAMINOS = [
  {
    id: "persona",
    icon: Heart,
    name: "Camino Persona",
    description: "Transforma tu ser, tus relaciones y tu bienestar",
    color: "from-pink-500 to-rose-500",
    lightColor: "from-pink-50 to-rose-50",
    borderColor: "border-pink-200 dark:border-pink-800",
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
    textColor: "text-pink-900 dark:text-pink-100",
    examples: [
      "Autoconocimiento profundo",
      "Relaciones más significativas",
      "Equilibrio vida-trabajo",
      "Gestión del estrés",
      "Identidad personal"
    ],
    recomendacion: "Ideal si tu enfoque es en cambio personal y bienestar"
  },
  {
    id: "profesional",
    icon: Briefcase,
    name: "Camino Profesional",
    description: "Domina tu carrera, liderazgo y ejecución",
    color: "from-blue-500 to-cyan-500",
    lightColor: "from-blue-50 to-cyan-50",
    borderColor: "border-blue-200 dark:border-blue-800",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-900 dark:text-blue-100",
    examples: [
      "Estrategia de carrera",
      "Liderazgo y decisiones",
      "Productividad y enfoque",
      "Comunicación ejecutiva",
      "Pensamiento estratégico"
    ],
    recomendacion: "Ideal si buscas avanzar y transformar tu rol profesional"
  },
  {
    id: "hibrido",
    icon: Zap,
    name: "Camino Híbrido",
    description: "Integra lo personal y profesional en tu transformación",
    color: "from-emerald-500 to-teal-500",
    lightColor: "from-emerald-50 to-teal-50",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-900 dark:text-emerald-100",
    examples: [
      "Autoconocimiento + Carrera",
      "Bienestar + Liderazgo",
      "Relaciones + Equipos",
      "Propósito + Dirección",
      "Integración vida completa"
    ],
    recomendacion: "Ideal si quieres transformación completa e integrada"
  }
]

export default function CaminoSelectorPage() {
  const [loading, setLoading] = useState(true)
  const [selectedCamino, setSelectedCamino] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profileData } = await supabase
        .from("despega_user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileData) {
        setUserProfile(profileData)
        // Si ya tiene un camino seleccionado, mostrar ese
        if (profileData.a2_camino) {
          setSelectedCamino(profileData.a2_camino)
        }
      }

      setLoading(false)
    }

    loadData()
  }, [supabase, router])

  const handleSelectCamino = async (caminoId: string) => {
    if (!userProfile) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Save camino selection
      await supabase
        .from("despega_user_profiles")
        .update({ a2_camino: caminoId })
        .eq("user_id", user.id)

      setSelectedCamino(caminoId)
      
      // Navigate to route recommendations
      setTimeout(() => {
        router.push("/despega/a2/recomendaciones")
      }, 300)
    } catch (error) {
      console.error("Error saving camino:", error)
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Preparando tus opciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="mx-auto">
            Elige tu Camino
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">
            ¿Hacia dónde quieres transformarte?
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Selecciona el camino que mejor se alinea con tu objetivo. Puedes cambiar después si lo necesitas.
          </p>
        </div>

        {/* Camino Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {CAMINOS.map((camino) => {
            const IconComponent = camino.icon
            const isSelected = selectedCamino === camino.id
            
            return (
              <Card
                key={camino.id}
                className={`cursor-pointer transition-all border-2 overflow-hidden ${
                  isSelected
                    ? `${camino.borderColor} shadow-lg scale-105`
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
                onClick={() => handleSelectCamino(camino.id)}
              >
                <CardContent className="p-6 space-y-4">
                  {/* Icon + Title */}
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${camino.color} flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">
                        {camino.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {camino.description}
                      </p>
                    </div>
                  </div>

                  {/* Examples */}
                  <div className={`p-3 rounded-lg ${camino.bgColor}`}>
                    <p className={`text-xs font-semibold ${camino.textColor} mb-2`}>
                      Explorarás:
                    </p>
                    <ul className="space-y-1">
                      {camino.examples.map((example, idx) => (
                        <li key={idx} className={`text-xs ${camino.textColor} flex items-start gap-2`}>
                          <span className="mt-0.5">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendation */}
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-700 dark:text-slate-300">
                    💡 {camino.recomendacion}
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="flex items-center justify-center gap-2 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                        Seleccionado
                      </span>
                    </div>
                  )}

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectCamino(camino.id)}
                    disabled={submitting}
                    className={`w-full ${
                      isSelected
                        ? "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                        : ""
                    }`}
                  >
                    {isSelected ? (
                      <>
                        Continuar con este Camino <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Explorar este Camino <ArrowRight className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Info Box */}
        <Card className="border-0 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>💡 Nota:</strong> No es una decisión permanente. Puedes explorar múltiples caminos. Ahora selecciona el que quieres comenzar primero.
            </p>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Link href="/despega/a2/intro" className="flex-1">
            <Button variant="outline" className="w-full">
              Volver
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
