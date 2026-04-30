"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { getNextRequiredPage } from "@/lib/redirect-logic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PhaseTransitionHandler } from "@/components/phase-transition-handler"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { useV1Analytics } from "@/lib/v1-analytics/use-v1-analytics"

export default function A2DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [mission, setMission] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()
  const { trackEvent } = useV1Analytics()

  useEffect(() => {
    trackEvent('a2_dashboard_viewed')
    
    const loadData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push("/auth/signin")
          return
        }

        const nextPage = await getNextRequiredPage(user.id)
        if (nextPage !== '/despega/a2/dashboard' && !nextPage.includes('/a2')) {
          trackEvent('error_occurred', { errorType: 'prerequisite_failed' })
          router.push(nextPage)
          return
        }

        const { error: updateError } = await supabase
          .from('despega_user_profiles')
          .upsert({
            user_id: user.id,
            a3_unlocked: true,
            a3_unlocked_at: new Date().toISOString()
          }, { onConflict: 'user_id' })
        
        if (updateError) {
          console.error('[v0] Error unlocking A3:', updateError)
        }

        const { data: profileData } = await supabase
          .from("despega_user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (profileData?.a2_mission_id) {
          setUserProfile(profileData)
          trackEvent('a2_sprint_viewed', {})

          const { data: missionData } = await supabase
            .from("a2_user_missions")
            .select("*")
            .eq("id", profileData.a2_mission_id)
            .single()

          if (missionData) {
            setMission(missionData)
          }
        }
      } catch (error) {
        console.error('[v0] Error loading A2 dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, router, trackEvent])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
          <p className="text-muted-foreground">Cargando tu exploración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto py-8 space-y-8">
        
        {/* WELCOME SECTION */}
        <div className="bg-background">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Lora, serif' }}>Tu Misión de 90 Días</h1>
            <p className="text-orange/80 text-lg">3 sprints diseñados para transformar tu perfil en plan concreto</p>
          </div>
        </div>

        {/* MISSION OVERVIEW */}
        {mission && (
          <Card className="bg-transparent border-muted/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-white" style={{ fontFamily: 'Lora, serif' }}>Misión: {mission.mission_title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">{mission.mission_description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/80 rounded-surface-lg border border-muted/70">
                  <p className="text-3xl font-bold text-orange">90</p>
                  <p className="text-sm text-muted-foreground">Días</p>
                </div>
                <div className="text-center p-4 bg-muted/80 rounded-surface-lg border border-muted/70">
                  <p className="text-3xl font-bold text-orange">3</p>
                  <p className="text-sm text-muted-foreground">Sprints</p>
                </div>
                <div className="text-center p-4 bg-muted/80 rounded-surface-lg border border-muted/70">
                  <p className="text-3xl font-bold text-orange">0%</p>
                  <p className="text-sm text-muted-foreground">Progreso</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SPRINTS SECTION */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Lora, serif' }}>Los 3 Sprints</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((sprintNum) => (
              <Link key={sprintNum} href={`/despega/a2/sprint-${sprintNum}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-orange bg-transparent border-muted/80 hover:border-l-orange hover:bg-muted/80">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      Sprint {sprintNum}: {sprintNum === 1 ? "Fundamentos" : sprintNum === 2 ? "Profundización" : "Consolidación"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Días {(sprintNum - 1) * 30 + 1}-{sprintNum * 30}</p>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-orange text-black">{sprintNum === 1 ? "En progreso" : sprintNum === 2 ? "Próximo" : "Futuro"}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* ⭐ A2 V2: SMART CHECKPOINTS */}
        <div>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-muted/90 dark:text-muted/5 mb-1">Checkpoints del Sprint Actual</h2>
            <p className="text-muted-foreground dark:text-muted-foreground text-sm">Hitos de verificación que marcan el avance real</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 border-green/20 dark:border-green">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[20px] bg-green/50 flex items-center justify-center text-white text-xs font-bold">1</div>
                  Semana 1: Fundamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-sm">Identifica 3 áreas de enfoque claro</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Establece ritual de revisión diaria</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Completa primera acción de Energía</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow/30 dark:border-yellow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[20px] bg-yellow/50 flex items-center justify-center text-white text-xs font-bold">2</div>
                  Semana 2: Profundización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Verifica patrón de avance/freno</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Ajusta plan si hay desalineación</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Revisa feedback de pares/coach</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple/30 dark:border-purple">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[20px] bg-purple/50 flex items-center justify-center text-white text-xs font-bold">3</div>
                  Semana 3: Consolidación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Evidencia de progreso en 3 áreas</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Rituales establecidos y funcionando</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Plan para Sprint 2 definido</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue/30 dark:border-blue/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[20px] bg-blue/50 flex items-center justify-center text-white text-xs font-bold">✓</div>
                  Revisión del Sprint 1
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Prepárate para la revisión con tu Coach. Trae datos de tu progreso y aprende qué ajustar.</p>
                <Button className="w-full mt-2 bg-blue/80 hover:bg-blue/70">Programar Revisión</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ⭐ A2 V2: WEEKLY REVIEW RITUAL */}
        <div>
          <Card className="border-2 border-blue/30 dark:border-blue bg-blue/5/30 dark:bg-blue/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                📋 Tu Ritual Semanal de Revisión
              </CardTitle>
              <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-2 font-normal">Cada domingo, dedica 15 min a revisar la semana</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-white dark:bg-background rounded border-l-4 border-indigo-600">
                  <p className="font-semibold text-sm text-muted/90 dark:text-muted/10">1. Evalúa: ¿Qué hizo clic?</p>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">¿Dónde avanzaste? ¿Qué energía sintió más real?</p>
                </div>
                <div className="p-3 bg-white dark:bg-background rounded border-l-4 border-indigo-600">
                  <p className="font-semibold text-sm text-muted/90 dark:text-muted/10">2. Identifica: ¿Qué frenó?</p>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">¿Dónde se bloqueó? ¿Qué necesita ajuste?</p>
                </div>
                <div className="p-3 bg-white dark:bg-background rounded border-l-4 border-indigo-600">
                  <p className="font-semibold text-sm text-muted/90 dark:text-muted/10">3. Ajusta: ¿Qué cambia la próxima?</p>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1">Pequeño cambio para semana 2. Una cosa. Máximo.</p>
                </div>
              </div>
              <Button className="w-full bg-blue hover:bg-indigo-700">Abrir Revisión Semanal</Button>
            </CardContent>
          </Card>
        </div>

        {/* Phase Transition to A3 */}
        <PhaseTransitionHandler
          currentPhase="a2"
          isComplete={true}
          nextPhaseLabel="Entrenamiento: Simulación Intensiva"
          nextPhaseUrl="/despega/a3"
        />

      </div>
    </div>
  )
}
