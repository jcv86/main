'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, CheckCircle2, Zap } from 'lucide-react'
import { StepHeader } from '@/components/step-header'

export default function A1CerebralIntroPage() {
  const [authOk, setAuthOk] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }
      
      // Mark A1 intro as seen (CANONICAL FLAG)
      const { error: updateError } = await supabase
        .from('despega_user_profiles')
        .upsert({
          user_id: user.id,
          a1_cerebral_intro_seen: true,
          a1_cerebral_intro_seen_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (updateError) {
        console.error('[v0] [CANONICAL] Error marking A1 intro seen:', updateError)
      } else {
        console.log('[v0] [CANONICAL] A1 intro marked as seen')
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
          stepNumber={1}
          pillarName="El Ritual"
          title="Descubre Tu Perfil Cerebral"
          description="Una evaluación profunda de cómo funcionas, tu estilo de comunicación y tu potencial único. Responde 28 preguntas simples y obtén insights personalizados sobre tu perfil."
          estimatedTime="~10 min"
          pillarColor="purple"
        />

        {/* Main Content */}
        <div className="space-y-8">
          {/* What is Cerebral Assessment */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple" />
                ¿Qué es esta Evaluación?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-white/90 leading-relaxed">
                El Análisis Cerebral identifica tu estilo natural de comunicación y liderazgo según cuatro dimensiones:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-red/20 dark:bg-red/25 border-2 border-red rounded-xl">
                  <p className="font-bold text-red mb-2 text-lg">🔴 Impulsor</p>
                  <p className="text-white/85 text-sm">Enfocado en resultados, decisivo, impulsivo</p>
                </div>
                <div className="p-5 bg-yellow/20 dark:bg-yellow/25 border-2 border-yellow rounded-xl">
                  <p className="font-bold text-yellow mb-2 text-lg">🟡 Catalizador</p>
                  <p className="text-white/85 text-sm">Comunicativo, entusiasta, orientado a personas</p>
                </div>
                <div className="p-5 bg-green/20 dark:bg-green/25 border-2 border-green rounded-xl">
                  <p className="font-bold text-green mb-2 text-lg">🟢 Estabilizador</p>
                  <p className="text-white/85 text-sm">Estable, cooperativo, confiable, paciente</p>
                </div>
                <div className="p-5 bg-blue/20 dark:bg-blue/25 border-2 border-blue rounded-xl">
                  <p className="font-bold text-blue mb-2 text-lg">🔵 Arquitecto</p>
                  <p className="text-white/85 text-sm">Analítico, detallista, exigente con calidad</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green" />
                ¿Cómo funciona el test?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white">28 preguntas</p>
                    <p className="text-sm text-white/75 dark:text-white/75">Responde 28 preguntas simples sobre tu comportamiento</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white">Dos selecciones por pregunta</p>
                    <p className="text-sm text-white/75 dark:text-white/75">Para cada pregunta, selecciona la opción que más y menos te describe</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-muted/90 dark:text-white">Análisis automático</p>
                    <p className="text-sm text-white/75 dark:text-white/75">Obtendrás tu perfil cerebral personalizado con insights sobre tu comunicación y liderazgo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Question */}
          <Card className="border-0 shadow-lg bg-muted/90 dark:bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white">Ejemplo Real de Pregunta</CardTitle>
              <CardDescription className="text-white/75">Así funciona el formato MÁS/MENOS que verás en el test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-8 rounded-[28px] border border-white/10">
                <p className="text-xl font-semibold text-white mb-8 text-center">
                  "Cuando enfrento un desafío importante, tiendo a ser más:"
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* MÁS column */}
                  <div>
                    <p className="text-base font-bold text-green mb-6 flex items-center gap-2">
                      <span className="bg-green text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">+</span>
                      MÁS como yo
                    </p>
                    <div className="space-y-3">
                      <button className="w-full p-4 border-2 border-green bg-green/20 rounded-lg text-left hover:bg-green/30 transition-all">
                        <p className="font-medium text-white">Decidido y directo</p>
                        <p className="text-xs text-white/75 mt-1">Impulsor</p>
                      </button>
                      <button className="w-full p-4 border-2 border-muted/60 rounded-lg text-left hover:bg-muted/70 transition-all">
                        <p className="text-white/85">Optimista e inspirador</p>
                        <p className="text-xs text-white/75 mt-1">Catalizador</p>
                      </button>
                      <button className="w-full p-4 border-2 border-muted/60 rounded-lg text-left hover:bg-muted/70 transition-all">
                        <p className="text-white/85">Paciente y considerado</p>
                        <p className="text-xs text-white/75 mt-1">Estabilizador</p>
                      </button>
                      <button className="w-full p-4 border-2 border-muted/60 rounded-lg text-left hover:bg-muted/70 transition-all">
                        <p className="text-white/85">Analítico y preciso</p>
                        <p className="text-xs text-white/75 mt-1">Arquitecto</p>
                      </button>
                    </div>
                  </div>

                  {/* MENOS column */}
                  <div>
                    <p className="text-base font-bold text-red mb-6 flex items-center gap-2">
                      <span className="bg-red text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">−</span>
                      MENOS como yo
                    </p>
                    <div className="space-y-3">
                      <button className="w-full p-4 border-2 border-muted/60 rounded-lg text-left hover:bg-muted/70 transition-all">
                        <p className="text-white/85">Decidido y directo</p>
                        <p className="text-xs text-white/75 mt-1">Impulsor</p>
                      </button>
                      <button className="w-full p-4 border-2 border-muted/60 rounded-lg text-left hover:bg-muted/70 transition-all">
                        <p className="text-white/85">Optimista e inspirador</p>
                        <p className="text-xs text-white/75 mt-1">Catalizador</p>
                      </button>
                      <button className="w-full p-4 border-2 border-muted/60 rounded-lg text-left hover:bg-muted/70 transition-all">
                        <p className="text-white/85">Paciente y considerado</p>
                        <p className="text-xs text-white/75 mt-1">Estabilizador</p>
                      </button>
                      <button className="w-full p-4 border-2 border-red bg-red/20 rounded-lg text-left hover:bg-red/30 transition-all">
                        <p className="font-medium text-white">Analítico y preciso</p>
                        <p className="text-xs text-white/75 mt-1">Arquitecto</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple/20 p-4 rounded-[28px] border border-purple/30">
                <p className="text-sm text-purple/90 dark:text-white">
                  <span className="font-semibold">¿Cómo funciona?</span> Cada pregunta tiene 4 opciones que representan los 4 estilos: Directo, Inspirador, Seguro y Consciente. Seleccionas cuál te describe MÁS y cuál te describe MENOS. El sistema cuenta tus selecciones y determina tu perfil dominante.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-0 shadow-lg bg-purple dark:bg-purple/30 border-l-4 border-purple">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Zap className="w-6 h-6 text-purple" />
                ¿Por qué es importante?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-white/85">
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green mt-0.5" />
                <p className="leading-relaxed">Entiende tu estilo de comunicación natural para adaptarte mejor en entrevistas</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green mt-0.5" />
                <p className="leading-relaxed">Identifica tus fortalezas clave que los empleadores buscan</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green mt-0.5" />
                <p className="leading-relaxed">Reconoce áreas de desarrollo personal para mejorar continuamente</p>
              </div>
              <div className="flex gap-3 items-start">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green mt-0.5" />
                <p className="leading-relaxed">Personaliza tus respuestas según el tipo de rol y empresa</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <div className="flex gap-4 justify-center mt-12">
            <Button
              onClick={() => router.push('/despega/a1-cerebral')}
              size="lg"
              className="px-8 text-lg bg-purple hover:bg-purple text-white"
            >
              Comenzar Análisis Cerebral
            </Button>
            <Button
              onClick={() => router.push('/despega')}
              size="lg"
              variant="outline"
              className="px-8 text-lg"
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
