"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, TrendingUp, Target, Lightbulb, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImpactArea {
  area: string
  severity: "alto" | "medio" | "bajo"
  description: string
  affectedProfiles: string[]
}

interface PersonalInterpretation {
  heading: string
  insight: string
  actionableItems: string[]
  icon: React.ReactNode
}

export function QueSignificaParaTi() {
  const [loading, setLoading] = useState(true)
  const [todayData, setTodayData] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [selectedProfile, setSelectedProfile] = useState<string>("tu-perfil")
  const { user } = useAuthRedirect()
  const supabase = createClient()

  useEffect(() => {
    if (!user?.id) return

    const loadData = async () => {
      try {
        // Get today's data
        const { data: panorama } = await supabase
          .from("a4_panorama_del_dia")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        setTodayData(panorama)

        // Get user profile
        const { data: profile } = await supabase
          .from("despega_cerebral_perfil")
          .select("*")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle()

        setUserProfile(profile)
      } catch (error) {
        console.error("[v0] Error loading interpretation data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  const impactAreas: ImpactArea[] = [
    {
      area: "Empleo y Salarios",
      severity: "alto",
      description: "Los cambios en política monetaria afectan directamente las decisiones de contratación de empresas",
      affectedProfiles: ["Emprendedor", "Trabajador Independiente", "Ejecutivo"],
    },
    {
      area: "Poder Adquisitivo",
      severity: "alto",
      description: "La inflación y tasas de interés impactan tu capacidad de compra y ahorro",
      affectedProfiles: ["Trabajador Asalariado", "Familia Joven", "Jubilado"],
    },
    {
      area: "Inversiones",
      severity: "medio",
      description: "El desempeño del mercado accionario se relaciona con las políticas del Banco Central",
      affectedProfiles: ["Inversionista", "Emprendedor", "Ejecutivo"],
    },
    {
      area: "Créditos y Deuda",
      severity: "medio",
      description: "Las tasas de interés determinan el costo de tus créditos hipotecarios y personales",
      affectedProfiles: ["Propietario", "Emprendedor", "Deudor"],
    },
  ]

  const interpretations: PersonalInterpretation[] = [
    {
      heading: "Para tu Billetera",
      insight:
        "La evolución actual de las tasas de interés y la inflación define directamente cuánto vale tu dinero. Si ahorras, obtén menos retorno; si gastas, cada peso tiene menor poder.",
      actionableItems: [
        "Revisa tus plazos fijos y compáralos con opciones de fondos mutuos",
        "Evalúa si es buen momento para refinanciar deudas",
        "Considera aumentar tu fondo de emergencia",
      ],
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      heading: "Para tu Trabajo",
      insight:
        "Las decisiones que toma el Banco Central influyen en la salud económica de las empresas. Esto afecta promociones, bonificaciones y estabilidad laboral.",
      actionableItems: [
        "Mantén tu perfil actualizado en plataformas de empleo",
        "Invierte en capacitación en áreas críticas para tu industria",
        "Negocia beneficios más allá del sueldo base",
      ],
      icon: <Target className="w-5 h-5" />,
    },
    {
      heading: "Para tu Futuro",
      insight:
        "Entender estas tendencias es clave para tomar decisiones de largo plazo sobre vivienda, educación, y jubilación.",
      actionableItems: [
        "Define objetivos financieros claros para los próximos 5 años",
        "Considera acciones defensivas si hay incertidumbre",
        "Diversifica tus fuentes de ingreso",
      ],
      icon: <Lightbulb className="w-5 h-5" />,
    },
  ]

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 via-transparent to-accent/5 border-0">
        <CardContent className="pt-12 pb-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Analizando tu contexto personal...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Qué Significa Para Ti</h2>
        <p className="text-muted-foreground">
          Interpretación personalizada basada en tu perfil {userProfile?.tipo_perfil}
        </p>
      </div>

      {/* Profile-based Impact */}
      {userProfile && (
        <Alert className="border-purple/20 bg-purple/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Como <strong>{userProfile.tipo_perfil}</strong>, los cambios económicos que ocurren hoy
            podrían afectar directamente tu estabilidad financiera en los próximos meses.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs for different insights */}
      <Tabs defaultValue="impacto" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="impacto">Áreas de Impacto</TabsTrigger>
          <TabsTrigger value="interpretacion">Mi Interpretación</TabsTrigger>
        </TabsList>

        {/* Impact Areas Tab */}
        <TabsContent value="impacto" className="space-y-4">
          {impactAreas.map((area, idx) => (
            <Card key={idx} className="border-0 bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{area.area}</h4>
                      <Badge
                        className={
                          area.severity === "alto"
                            ? "bg-red/50/10 text-red dark:text-red-400"
                            : area.severity === "medio"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              : "bg-green-500/10 text-green dark:text-green/40"
                        }
                        variant="outline"
                      >
                        Impacto {area.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{area.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {area.affectedProfiles.map((profile, pidx) => (
                        <Badge key={pidx} variant="outline" className="text-xs">
                          {profile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Personal Interpretation Tab */}
        <TabsContent value="interpretacion" className="space-y-4">
          {interpretations.map((interp, idx) => (
            <Card key={idx} className="border-0 bg-card/70 backdrop-blur-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-[28px] bg-purple/20">{interp.icon}</div>
                  <CardTitle className="text-xl">{interp.heading}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm mb-4 leading-relaxed">{interp.insight}</p>
                <div>
                  <h5 className="text-sm font-semibold mb-3 text-purple">Acciones Sugeridas:</h5>
                  <ul className="space-y-2">
                    {interp.actionableItems.map((item, aidx) => (
                      <li key={aidx} className="text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-[20px] bg-purple mt-1.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Key Takeaway */}
      <Card className="border-purple/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="text-lg">Lo Más Importante</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            La información económica de hoy no es noticia para expertos. Es inteligencia que puede cambiar
            cómo tomas decisiones sobre tu dinero, tu trabajo, y tu futuro. No se trata de predecir el futuro,
            sino de entender el presente para actuar con mayor seguridad.
          </p>
        </CardContent>
      </Card>

      {/* CTA to deep dive */}
      <Button className="w-full" asChild>
        <a href="/despega/a4/interpretacion-completa">
          Ver Interpretación Completa y Recomendaciones
        </a>
      </Button>
    </div>
  )
}
