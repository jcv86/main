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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
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
                <Zap className="w-6 h-6 text-purple-600" />
                ¿Qué es esta Evaluación?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                El Análisis Cerebral es una evaluación de comportamiento inspirada en metodologías reconocidas que identifica tu estilo natural de comunicación y liderazgo. Basado en cuatro dimensiones principales:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="font-semibold text-red-900 dark:text-red-100 mb-1">Impulsor</p>
                  <p className="text-sm text-red-800 dark:text-red-200">Enfocado en resultados, decisivo, impulsivo</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">Catalizador</p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">Comunicativo, entusiasta, orientado a personas</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-1">Estabilizador</p>
                  <p className="text-sm text-green-800 dark:text-green-200">Estable, cooperativo, confiable, paciente</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Arquitecto</p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Analítico, detallista, exigente con calidad</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                ¿Cómo funciona el test?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">28 preguntas</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Responde 28 preguntas simples sobre tu comportamiento</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Dos selecciones por pregunta</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Para cada pregunta, selecciona la opción que más y menos te describe</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Análisis automático</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Obtendrás tu perfil cerebral personalizado con insights sobre tu comunicación y liderazgo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Example Question */}
          <Card className="border-0 shadow-lg bg-slate-900 dark:bg-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white">Ejemplo Real de Pregunta</CardTitle>
              <CardDescription className="text-slate-400">Así funciona el formato MÁS/MENOS que verás en el test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-800 dark:bg-slate-700 p-8 rounded-lg border border-slate-700">
                <p className="text-xl font-semibold text-white mb-8 text-center">
                  "Cuando enfrento un desafío importante, tiendo a ser más:"
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* MÁS column */}
                  <div>
                    <p className="text-sm font-semibold text-green-400 mb-4 flex items-center gap-2">
                      <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">+</span>
                      MÁS como yo
                    </p>
                    <div className="space-y-3">
                      <button className="w-full p-4 border-2 border-green-600 bg-green-600/20 rounded-lg text-left hover:bg-green-600/30 transition-all">
                        <p className="font-medium text-white">Decidido y directo</p>
                        <p className="text-xs text-slate-400 mt-1">Impulsor</p>
                      </button>
                      <button className="w-full p-4 border-2 border-slate-600 rounded-lg text-left hover:bg-slate-700 transition-all">
                        <p className="text-slate-300">Optimista e inspirador</p>
                        <p className="text-xs text-slate-500 mt-1">Catalizador</p>
                      </button>
                      <button className="w-full p-4 border-2 border-slate-600 rounded-lg text-left hover:bg-slate-700 transition-all">
                        <p className="text-slate-300">Paciente y considerado</p>
                        <p className="text-xs text-slate-500 mt-1">Estabilizador</p>
                      </button>
                      <button className="w-full p-4 border-2 border-slate-600 rounded-lg text-left hover:bg-slate-700 transition-all">
                        <p className="text-slate-300">Analítico y preciso</p>
                        <p className="text-xs text-slate-500 mt-1">Arquitecto</p>
                      </button>
                    </div>
                  </div>

                  {/* MENOS column */}
                  <div>
                    <p className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2">
                      <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">−</span>
                      MENOS como yo
                    </p>
                    <div className="space-y-3">
                      <button className="w-full p-4 border-2 border-slate-600 rounded-lg text-left hover:bg-slate-700 transition-all">
                        <p className="text-slate-300">Decidido y directo</p>
                        <p className="text-xs text-slate-500 mt-1">Impulsor</p>
                      </button>
                      <button className="w-full p-4 border-2 border-slate-600 rounded-lg text-left hover:bg-slate-700 transition-all">
                        <p className="text-slate-300">Optimista e inspirador</p>
                        <p className="text-xs text-slate-500 mt-1">Catalizador</p>
                      </button>
                      <button className="w-full p-4 border-2 border-slate-600 rounded-lg text-left hover:bg-slate-700 transition-all">
                        <p className="text-slate-300">Paciente y considerado</p>
                        <p className="text-xs text-slate-500 mt-1">Estabilizador</p>
                      </button>
                      <button className="w-full p-4 border-2 border-red-600 bg-red-600/20 rounded-lg text-left hover:bg-red-600/30 transition-all">
                        <p className="font-medium text-white">Analítico y preciso</p>
                        <p className="text-xs text-slate-400 mt-1">Arquitecto</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <span className="font-semibold">¿Cómo funciona?</span> Cada pregunta tiene 4 opciones que representan los 4 estilos: Directo, Inspirador, Seguro y Consciente. Seleccionas cuál te describe MÁS y cuál te describe MENOS. El sistema cuenta tus selecciones y determina tu perfil dominante.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">
                ¿Por qué es importante?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-blue-900 dark:text-blue-100">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Entiende tu estilo de comunicación natural</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Identifica tus fortalezas en situaciones de entrevista</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Reconoce áreas de desarrollo personal</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                <p>Adapta tu comunicación según el contexto laboral</p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Button */}
          <div className="flex gap-4 justify-center mt-12">
            <Button
              onClick={() => router.push('/despega/a1-cerebral')}
              size="lg"
              className="px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white"
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
