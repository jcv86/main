'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Newspaper, MapPin, Zap, Brain, ArrowRight, Radar } from 'lucide-react'
import { StepHeader } from '@/components/step-header'

export default function ContinuousExecutionIntroPage() {
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
      
      const { error: updateError } = await supabase
        .from('despega_user_profiles')
        .upsert({
          user_id: user.id,
          a4_intro_seen: true,
          a4_intro_seen_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (updateError) {
        console.error('[v0] Error marking A4 intro seen:', updateError)
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
          stepNumber={4}
          pillarName="Ejecución Continua"
          title="Tu Coach IA 24/7 - Inteligencia de Mercado"
          description="Monitorea el mercado laboral, obtén inteligencia competitiva y toma decisiones estratégicas con confianza. Tu ejecución comienza aquí."
          estimatedTime="Acceso continuo"
          pillarColor="red"
        />

        <div className="space-y-8">
          <Card className="bg-red/10 border-2 border-red/40 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3 text-white">
                <Radar className="w-8 h-8 text-red" />
                Tu Coach IA 24/7
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-white/90 text-lg leading-relaxed">
                Esta es tu fase de ejecución continua. No terminas en entrenamiento - aquí EMPIEZAS a aplicar todo. Tu coach IA personal te proporciona contexto real del mercado laboral, tendencias de industria, inteligencia competitiva y decisiones estratégicas para que entres al mercado con ventaja.
              </p>
              <div className="bg-red/25 p-6 rounded-xl border-2 border-red/50">
                <p className="text-white font-bold text-lg">
                  Tu objetivo: Ejecutar tu plan con inteligencia del mercado. Conocer antes que los demás, decidir mejor, actuar con confianza.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red/10 border-2 border-red/40 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3 text-white">
                <TrendingUp className="w-8 h-8 text-red" />
                Tus 7 Herramientas de Inteligencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { icon: Newspaper, label: 'Noticias y Tendencias', desc: 'Alertas sobre industria, empresas y roles en tu área', color: 'red' },
                  { icon: MapPin, label: 'Radar de Oportunidades', desc: 'Empresas contratando, posiciones abiertas, crecimiento', color: 'red' },
                  { icon: Brain, label: 'Análisis de Mercado', desc: 'Salarios, demanda de skills, tendencias de carrera', color: 'red' },
                  { icon: Zap, label: 'Benchmark Competitivo', desc: 'Cómo te comparas con otros perfiles en el mercado', color: 'red' },
                  { icon: TrendingUp, label: 'Decisiones Estratégicas', desc: 'Recomendaciones personalizadas para tu perfil y mercado', color: 'red' }
                ].map((tool, idx) => {
                  const IconComponent = tool.icon
                  return (
                    <div key={idx} className={`p-5 bg-red/15 border-2 border-red/40 rounded-xl flex gap-4 hover:shadow-lg transition-all`}>
                      <IconComponent className={`w-7 h-7 text-red flex-shrink-0 mt-1`} />
                      <div className="flex-1">
                        <p className="font-bold text-white text-lg">{tool.label}</p>
                        <p className="text-white/85 text-base">{tool.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red/10 border-2 border-red/40 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl text-white">Tu Flujo de Ejecución</CardTitle>
              <CardDescription className="text-white/75 text-lg">Cómo funciona tu ejecución continua</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { num: '1', label: 'Monitorea', desc: 'Tu coach IA rastrea el mercado 24/7' },
                  { num: '2', label: 'Analiza', desc: 'Te proporciona insights estratégicos personalizados' },
                  { num: '3', label: 'Ejecuta', desc: 'Tú actúas con inteligencia de mercado real' }
                ].map((step, idx) => (
                  <div key={idx} className="bg-background/50 border-2 border-white/20 p-6 rounded-xl text-center hover:border-red/50 transition-all">
                    <div className="text-5xl font-black text-red mb-3">{step.num}</div>
                    <p className="font-bold text-white text-xl mb-2">{step.label}</p>
                    <p className="text-white/85 text-base">{step.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-red/30 border-2 border-red/50 p-6 rounded-xl">
                <p className="text-white text-lg font-semibold text-center">
                  <span className="text-red">Coach IA 24/7:</span> Tu asistente personal que nunca duerme, siempre actualizado, siempre disponible para ayudarte a tomar las mejores decisiones.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange/20 to-red/20 border-2 border-orange/40 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl flex items-center gap-3 text-white">
                <Radar className="w-8 h-8 text-orange" />
                Tipos de Decisiones que Tomarás
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  '¿A qué empresas aplicar primero?',
                  '¿Qué roles están creciendo?',
                  '¿Cuándo es el mejor momento para cambiar?',
                  '¿Qué skills necesito para crecer?'
                ].map((q, idx) => (
                  <div key={idx} className="p-5 bg-orange/15 border-2 border-orange/40 rounded-xl">
                    <p className="font-semibold text-white text-lg">{q}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="p-8 bg-red/10 border-2 border-red/40 rounded-xl shadow-lg">
            <h3 className="text-3xl font-bold text-white mb-3">Bienvenido a Tu Ejecución Continua</h3>
            <p className="text-white/90 text-lg mb-8">Aquí es donde todo tu trabajo cobra vida. Entra al dashboard y comienza tu ejecución con inteligencia de mercado.</p>
            <Button 
              onClick={() => router.push('/despega/a4')}
              className="w-full bg-red hover:bg-red/80 text-white font-bold text-lg py-6"
            >
              Ir a Ejecución Continua
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
