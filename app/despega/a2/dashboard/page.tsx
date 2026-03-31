"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { getNextRequiredPage } from "@/lib/redirect-logic"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
          <p className="mt-4 text-slate-600 dark:text-slate-400">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto py-8 space-y-8">
        
        {/* WELCOME SECTION */}
        <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 dark:from-blue-600 dark:via-cyan-600 dark:to-teal-600 rounded-lg p-8 text-white shadow-xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-2">Tu Misión de 90 Días</h1>
            <p className="text-blue-100 text-lg">3 sprints diseñados para transformar tu perfil en plan concreto</p>
          </div>
        </div>

        {/* MISSION OVERVIEW */}
        {mission && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Misión: {mission.mission_title}</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{mission.mission_description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">90</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Días</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-3xl font-bold text-cyan-600">3</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Sprints</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <p className="text-3xl font-bold text-teal-600">0%</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Progreso</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SPRINTS SECTION */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Los 3 Sprints</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((sprintNum) => (
              <Link key={sprintNum} href={`/despega/a2/sprint-${sprintNum}`}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Sprint {sprintNum}: {sprintNum === 1 ? "Fundamentos" : sprintNum === 2 ? "Profundización" : "Consolidación"}
                    </CardTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Días {(sprintNum - 1) * 30 + 1}-{sprintNum * 30}</p>
                  </CardHeader>
                  <CardContent>
                    <Badge className="bg-blue-600">{sprintNum === 1 ? "En progreso" : sprintNum === 2 ? "Próximo" : "Futuro"}</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA TO A3 */}
        <Card className="border-2 border-primary/30 dark:border-primary/40 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                  Listo para A3: Entrenamientos Especializados?
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Accede a entrenamientos especializados, práctica de entrevistas y feedback de IA.
                </p>
              </div>
              <Link href="/despega/a3" className="flex-shrink-0">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base shadow-lg">
                  Explorar A3 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
