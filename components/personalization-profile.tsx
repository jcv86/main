"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, Compass, BarChart3, Settings } from "lucide-react"

interface DISCProfile {
  disc_profile?: {
    D: number
    I: number
    S: number
    C: number
  }
  dominant_pattern?: string
  secondary_pattern?: string
}

const DISC_DESCRIPTIONS: Record<string, { name: string; color: string; description: string }> = {
  D: {
    name: "Dominancia",
    color: "bg-red/50/10",
    description: "Orientado a resultados, directo y decisivo",
  },
  I: {
    name: "Influencia",
    color: "bg-blue/50/10",
    description: "Comunicativo, entusiasta y orientado a las personas",
  },
  S: {
    name: "Estabilidad",
    color: "bg-green/50/10",
    description: "Cooperativo, confiable y orientado al equipo",
  },
  C: {
    name: "Consciencia",
    color: "bg-purple/50/10",
    description: "Analítico, preciso y orientado a la calidad",
  },
}

export function PersonalizationProfile() {
  // Placeholder data
  const discProfile: DISCProfile = {
    disc_profile: { D: 45, I: 55, S: 35, C: 50 },
    dominant_pattern: "I",
    secondary_pattern: "C",
  }

  return (
    <div className="space-y-4">
      {/* DISC Profile Card */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <CardTitle>Tu Perfil DISC</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(DISC_DESCRIPTIONS).map(([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded-lg ${value.color} ${`}
                  discProfile.disc_profile?.[key as keyof typeof discProfile.disc_profile] || 0 > 50
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <div className="font-bold text-lg mb-1">{key}</div>
                <div className="text-xs font-medium">{value.name}</div>
                <Progress
                  value={discProfile.disc_profile?.[key as keyof typeof discProfile.disc_profile] || 0}
                  className="mt-2 h-1"
                />
              </div>
            ))}
          </div>

          {discProfile.dominant_pattern && (
            <div className="p-4 bg-purple/5 rounded-[28px] border border-purple/20">
              <div className="text-sm text-muted-foreground mb-1">Patrón Dominante:</div>
              <div className="text-lg font-semibold text-purple">
                {DISC_DESCRIPTIONS[discProfile.dominant_pattern]?.name} (
                {DISC_DESCRIPTIONS[discProfile.dominant_pattern]?.description})
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personalization Settings */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <CardTitle>Preferencias de Contenido</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profundidad de Análisis</span>
              <Badge variant="outline">Profundo</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Recibirás análisis detallados con múltiples perspectivas
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Formato Preferido</span>
              <Badge variant="outline">Mixto</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Combinación de artículos, videos y infografías
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Ritmo de Aprendizaje</span>
              <Badge variant="outline">Moderado</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Contenido consistente sin abrumar
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Content */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5" />
            <CardTitle>Contenido Recomendado para Ti</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Basado en tu perfil {DISC_DESCRIPTIONS[discProfile.dominant_pattern || "I"]?.name}, te recomendamos:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Análisis de casos de estudio complejos</li>
              <li>Entrevistas con líderes de industria</li>
              <li>Investigaciones profundas sobre tendencias emergentes</li>
              <li>Reportes detallados del mercado laboral</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
