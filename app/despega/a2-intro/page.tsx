'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Compass, CheckCircle2, Zap } from 'lucide-react'
import { StepHeader } from '@/components/step-header'

export default function A2IntroPage() {
  const [authOk, setAuthOk] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      // Check if user exists in Supabase or is a demo user
      let userId = user?.id
      if (!user) {
        // Check if demo user exists in localStorage
        const demoUserStr = typeof window !== 'undefined' ? localStorage.getItem('demo_user') : null
        if (demoUserStr) {
          try {
            const demoUser = JSON.parse(demoUserStr)
            userId = demoUser.id
            console.log('[v0] Demo user found:', demoUser.email)
          } catch (e) {
            console.error('[v0] Error parsing demo user:', e)
            router.push('/auth/signin')
            return
          }
        } else {
          router.push('/auth/signin')
          return
        }
      }
      
      // Mark A2 intro as seen (CANONICAL FLAG)
      const { error: updateError } = await supabase
        .from('despega_user_profiles')
        .upsert({
          user_id: userId,
          a2_intro_seen: true,
          a2_intro_seen_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (updateError) {
        console.error('[v0] [CANONICAL] Error marking A2 intro seen:', updateError)
      } else {
        console.log('[v0] [CANONICAL] A2 intro marked as seen')
      }
      
      setAuthOk(true)
    }
    check()
  }, [supabase, router])

  if (!authOk) {
    return <div className="min-h-screen flex items-center justify-center"><p>Verificando...</p></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <StepHeader
          stepNumber={2}
          pillarName="Exploración"
          title="Tu Ruta de Transformación"
          description="Un plan personalizado de 90 días con micro-acciones adaptadas a tu estilo único. Diseñado para generar momentum real y sostenible."
          estimatedTime="~5 min"
          pillarColor="purple"
        />

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is A2 */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2" style={{ color: 'rgba(90, 90, 150, 0.6)', fontWeight: '500' }}>
                <Zap className="w-6 h-6" style={{ color: 'rgba(90, 90, 150, 0.6)' }} />
                ¿Qué es esta Etapa?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-white/90 leading-relaxed" style={{ fontSize: '14px', fontWeight: '400' }}>
                La Exploración es tu plan de acción de 90 días diseñado específicamente según tu perfil Despega Cerebral. Cada día, micro-acciones concretas que se adaptan a tu estilo natural.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-[rgba(80,160,170,0.5)]/20 dark:bg-[rgba(80,160,170,0.5)]/25 border-2 border-[rgb(80,160,170)] rounded-xl" style={{ borderColor: 'rgba(255, 0, 0, 0.4)', backgroundColor: 'rgba(255, 0, 0, 0.15)', borderRadius: '2px' }}>
                  <p className="font-bold text-[rgb(80,160,170)] mb-2 text-lg" style={{ color: '#ffffff', fontWeight: '500' }}>📋 Rutas Personalizadas</p>
                  <p className="text-white/85 text-sm">3 sprints de 30 días adaptados a tu perfil</p>
                </div>
                <div className="p-5 bg-yellow/20 dark:bg-yellow/25 border-2 border-yellow rounded-xl" style={{ borderColor: 'rgba(255, 200, 0, 0.4)', backgroundColor: 'rgba(255, 200, 0, 0.15)', borderRadius: '2px' }}>
                  <p className="font-bold text-yellow mb-2 text-lg" style={{ color: '#ffffff', fontWeight: '500' }}>⚡ Micro-Acciones</p>
                  <p className="text-white/85 text-sm">5 a 120 minutos diarios, nunca abrumador</p>
                </div>
                <div className="p-5 bg-green/20 dark:bg-green/25 border-2 border-green rounded-xl" style={{ borderColor: 'rgba(0, 128, 0, 0.4)', backgroundColor: 'rgba(0, 128, 0, 0.15)', borderRadius: '2px' }}>
                  <p className="font-bold text-green mb-2 text-lg" style={{ color: '#ffffff', fontWeight: '500' }}>📊 Tu Bitácora</p>
                  <p className="text-white/85 text-sm">Reflexión semanal para consolidar progreso</p>
                </div>
                <div className="p-5 bg-blue/20 dark:bg-blue/25 border-2 border-blue rounded-xl" style={{ borderColor: 'rgba(0, 0, 255, 0.4)', backgroundColor: 'rgba(0, 0, 255, 0.15)', borderRadius: '2px' }}>
                  <p className="font-bold text-blue mb-2 text-lg" style={{ color: '#ffffff', fontWeight: '500' }}>🎯 Tu Coach</p>
                  <p className="text-white/85 text-sm">Guía inteligente basada en tu progreso</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2" style={{ color: 'rgba(90, 90, 150, 0.8)', fontWeight: '500' }}>
                <CheckCircle2 className="w-6 h-6" style={{ color: 'rgba(90, 90, 150, 0.6)' }} />
                ¿Cómo funciona tu Exploración?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(90, 90, 150, 0.4)' }}>1</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white">Comprende tu patrón</p>
                    <p className="text-sm text-white/75 dark:text-white/75">Tu perfil Despega Cerebral define cómo priorizas, comunicas y ejecutas</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(90, 90, 150, 0.4)' }}>2</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white">Acciones alineadas</p>
                    <p className="text-sm text-white/75 dark:text-white/75">Cada día recibes micro-acciones diseñadas específicamente para ti</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: 'rgba(90, 90, 150, 0.4)' }}>3</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white">Momentum Real</p>
                    <p className="text-sm text-white/75 dark:text-white/75">Pequeños pasos consistentes generan cambios duraderos en 90 días</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3-Sprint Overview */}
          <Card className="border-0 shadow-lg bg-muted/90 dark:bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white">Los 3 Sprints de Transformación</CardTitle>
              <CardDescription className="text-white/75">90 días divididos en 3 fases estratégicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-8 rounded-[28px]" style={{ borderRadius: '2px', backgroundColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid rgba(90, 90, 150, 0.6)' }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-base font-bold text-[rgb(80,160,170)] mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-[rgba(80,160,170,0.5)] text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                      ATERRIZAJE
                    </p>
                    <p className="text-white/85 text-sm leading-relaxed">Días 1-30: Tomar velocidad, establecer rutinas, descubrir tu ritmo natural</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-yellow mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-yellow text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                      CONSOLIDACIÓN
                    </p>
                    <p className="text-white/85 text-sm leading-relaxed">Días 31-60: Profundizar habilidades, resolver obstáculos, acelerar transformación</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-green mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 bg-green text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                      MAESTRÍA
                    </p>
                    <p className="text-white/85 text-sm leading-relaxed">Días 61-90: Integración definitiva, preparación para A3, nuevo estándar</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why it Works */}
          <Card className="border-0 shadow-lg border-l-4" style={{ borderRadius: '2px', backgroundColor: 'rgba(90, 90, 150, 0.4)', borderColor: 'rgba(90, 90, 150, 0.8)' }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white flex items-center gap-2" style={{ color: 'rgba(90, 90, 150)' }}>
                <Zap className="w-6 h-6" style={{ color: 'rgba(90, 90, 150)' }} />
                ¿Por qué funciona?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-white/85">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(90, 90, 150)' }} />
                <p className="leading-relaxed">Acciones diseñadas para tu estilo natural, no contra él</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(90, 90, 150)' }} />
                <p className="leading-relaxed">Micro-acciones que se adaptan a tu disponibilidad y energía</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(90, 90, 150)' }} />
                <p className="leading-relaxed">Momentum gradual que genera cambios duraderos</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(90, 90, 150)' }} />
                <p className="leading-relaxed">Coach inteligente que se ajusta a tu progreso real</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <div className="flex gap-4 justify-center mt-12">
            <Button
              onClick={() => router.push('/despega/conozcamonos-2')}
              size="lg"
              className="px-8 text-lg text-white"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.6)', borderRadius: '20px' }}
            >
              Comenzar mi Exploración
            </Button>
            <Button
              onClick={() => router.push('/despega')}
              size="lg"
              variant="outline"
              className="px-8 text-lg"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.4)', borderRadius: '20px' }}
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
