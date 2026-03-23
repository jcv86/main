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
    color: "bg-red-500/10",
    description: "Orientado a resultados, directo y decisivo",
  },
  I: {
    name: "Influencia",
    color: "bg-blue-500/10",
    description: "Comunicativo, entusiasta y orientado a las personas",
  },
  S: {
    name: "Estabilidad",
    color: "bg-green-500/10",
    description: "Cooperativo, confiable y orientado al equipo",
  },
  C: {
    name: "Consciencia",
    color: "bg-purple-500/10",
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
                className={`p-3 rounded-lg ${value.color} ${
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
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Patrón Dominante:</div>
              <div className="text-lg font-semibold text-primary">
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return
    loadData()
  }, [session?.user?.id])

  const loadData = async () => {
    if (!session?.user?.id) return

    try {
      const [profile, feeds] = await Promise.all([
        getUserDISCProfile(session.user.id),
        getPersonalizedFeedSettings(session.user.id),
      ])

      setDiscProfile(profile)
      setFeedSettings(feeds)
    } catch (error) {
      console.error("[v0] Error loading personalization data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardContent className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <Card className="border-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/10 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500/10 rounded-lg">
              <User className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <CardTitle>Tu Perfil Personalizado</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Contenido curado según tu estilo DISC
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* DISC Profile */}
      {discProfile?.disc_profile ? (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Tu Perfil DISC</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(discProfile.disc_profile).map(([type, value]) => {
              const info = DISC_DESCRIPTIONS[type as keyof typeof DISC_DESCRIPTIONS]
              return (
                <div key={type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{info.name}</h4>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3">
                      {Math.round(value * 100)}%
                    </Badge>
                  </div>
                  <Progress value={value * 100} className="h-2" />
                </div>
              )
            })}

            {/* Pattern Interpretation */}
            <div className="pt-4 border-t border-border/50 space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Patrón Dominante</p>
                <Badge className="text-sm">
                  {DISC_DESCRIPTIONS[discProfile.dominant_pattern as keyof typeof DISC_DESCRIPTIONS]?.name ||
                    discProfile.dominant_pattern}
                </Badge>
              </div>

              {discProfile.secondary_pattern && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Patrón Secundario</p>
                  <Badge variant="outline" className="text-sm">
                    {DISC_DESCRIPTIONS[discProfile.secondary_pattern as keyof typeof DISC_DESCRIPTIONS]?.name ||
                      discProfile.secondary_pattern}
                  </Badge>
                </div>
              )}

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 mt-3">
                <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1">💡 Recomendación</p>
                <p className="text-xs text-muted-foreground">
                  {discProfile.dominant_pattern === "D"
                    ? "Tu contenido está optimizado para análisis rápidos y conclusiones directas"
                    : discProfile.dominant_pattern === "I"
                      ? "Tu contenido incluye narrativas atractivas e historias de impacto"
                      : discProfile.dominant_pattern === "S"
                        ? "Tu contenido enfatiza estabilidad, consistencia y colaboración"
                        : "Tu contenido se enfoca en precisión, datos y análisis detallado"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardContent className="py-8 text-center">
            <Compass className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Completa tu evaluación DISC para obtener contenido personalizado
            </p>
          </CardContent>
        </Card>
      )}

      {/* Personalized Feed Settings */}
      {feedSettings.length > 0 && (
        <Card className="border-0 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Fuentes Personalizadas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedSettings.map((feed) => (
              <div
                key={feed.id}
                className="p-3 bg-muted/50 rounded-lg border border-border/50 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{feed.feed_name}</h4>
                  <p className="text-xs text-muted-foreground">{feed.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {feed.priority === "high" ? "⭐⭐⭐" : feed.priority === "medium" ? "⭐⭐" : "⭐"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Content Preferences */}
      <Card className="border-0 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base">Preferencias de Contenido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Análisis Profundos</span>
              <Badge variant="outline" className="text-xs">
                ✓ Activo
              </Badge>
            </div>
            <Progress value={85} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Historias de Impacto</span>
              <Badge variant="outline" className="text-xs">
                ✓ Activo
              </Badge>
            </div>
            <Progress value={70} className="h-1.5" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Datos Actualizados</span>
              <Badge variant="outline" className="text-xs">
                ✓ Activo
              </Badge>
            </div>
            <Progress value={95} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
