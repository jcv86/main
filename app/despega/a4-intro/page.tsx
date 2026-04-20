'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Newspaper, MapPin, Zap, Brain, ArrowRight, Radar } from 'lucide-react'
import { StepHeader } from '@/components/step-header'

export default function A4IntroPage() {
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
          pillarName="La Realidad"
          title="Ejecución + Contexto de Mercado"
          description="Tu coach IA 24/7 que monitorea el mercado laboral, te proporciona inteligencia competitiva y te guía en decisiones estratégicas reales."
          estimatedTime="Acceso continuo"
          pillarColor="cyan"
        />

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Radar className="w-6 h-6 text-blue" />
                ¿Qué es La Realidad?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground dark:text-white/85">
                A4 es tu fase final de ejecución continuada. No terminas aquí - aquí EMPIEZAS a aplicar todo lo que aprendiste. 
                Tu coach IA 24/7 te proporciona contexto real del mercado laboral, tendencias de industria, inteligencia competitiva 
                y decisiones estratégicas para que entres al mercado con ventaja.
              </p>
              <div className="bg-teal-50 dark:bg-teal-950 p-4 rounded-[28px] border border-blue/20 dark:border-teal-800">
                <p className="text-sm text-teal-900 dark:text-teal-100">
                  <span className="font-semibold">Tu objetivo en A4:</span> Ejecutar tu plan con inteligencia del mercado. Conocer antes que los demás, decidir mejor, actuar con confianza.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green" />
                Tus 7 Herramientas de Inteligencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-blue/5 dark:bg-blue/30 rounded-[28px] border border-blue/30 dark:border-blue/10">
                  <div className="flex gap-3">
                    <Newspaper className="w-6 h-6 text-blue flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-white">Noticias y Tendencias</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Alertas sobre industria, empresas y roles en tu área.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-purple/5 dark:bg-purple/30 rounded-[28px] border border-purple/30 dark:border-purple">
                  <div className="flex gap-3">
                    <MapPin className="w-6 h-6 text-purple flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-white">Radar de Oportunidades</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Empresas contratando, posiciones abiertas, crecimiento de equipos.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-red/5 dark:bg-red/30 rounded-[28px] border border-red/20 dark:border-red">
                  <div className="flex gap-3">
                    <Brain className="w-6 h-6 text-red flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-white">Análisis de Mercado</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Salarios, demanda de skills, tendencias de carrera.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-yellow/5 dark:bg-yellow/30 rounded-[28px] border border-yellow/20 dark:border-yellow">
                  <div className="flex gap-3">
                    <Zap className="w-6 h-6 text-yellow flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-white">Benchmark Competitivo</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Cómo te comparas con otros perfiles en el mercado.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green/5 dark:bg-green/30 rounded-[28px] border border-green/20 dark:border-green">
                  <div className="flex gap-3">
                    <TrendingUp className="w-6 h-6 text-green flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-white">Decisiones Estratégicas</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Recomendaciones personalizadas basadas en tu perfil y mercado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-muted/90 dark:bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white">El Flujo de A4</CardTitle>
              <CardDescription className="text-muted-foreground">Cómo funciona tu ejecución continua</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/80/50 p-4 rounded-[28px] border border-muted/70">
                  <div className="text-3xl font-bold text-teal-400 mb-2">1</div>
                  <p className="text-sm font-semibold text-white mb-1">Monitorea</p>
                  <p className="text-xs text-muted-foreground">Tu coach IA rastrea el mercado 24/7</p>
                </div>
                <div className="bg-muted/80/50 p-4 rounded-[28px] border border-muted/70">
                  <div className="text-3xl font-bold text-teal-400 mb-2">2</div>
                  <p className="text-sm font-semibold text-white mb-1">Analiza</p>
                  <p className="text-xs text-muted-foreground">Te proporciona insights estratégicos</p>
                </div>
                <div className="bg-muted/80/50 p-4 rounded-[28px] border border-muted/70">
                  <div className="text-3xl font-bold text-teal-400 mb-2">3</div>
                  <p className="text-sm font-semibold text-white mb-1">Ejecuta</p>
                  <p className="text-xs text-muted-foreground">Tú actúas con inteligencia de mercado</p>
                </div>
              </div>
              <div className="bg-blue/20 border border-teal-600/50 p-4 rounded-[28px] mt-4">
                <p className="text-sm text-teal-100">
                  <span className="font-semibold">Coach IA 24/7:</span> Tu asistente personal que nunca duerme, siempre actualizado, siempre disponible para ayudarte a tomar las mejores decisiones.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Radar className="w-6 h-6 text-blue" />
                Tipos de Decisiones que Tomarás
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-muted/5 dark:bg-card/30 rounded-[28px] border border-muted/20 dark:border-card">
                  <p className="font-semibold text-muted/90 dark:text-white text-sm">¿A qué empresas aplicar primero?</p>
                </div>
                <div className="p-3 bg-muted/5 dark:bg-card/30 rounded-[28px] border border-muted/20 dark:border-card">
                  <p className="font-semibold text-muted/90 dark:text-white text-sm">¿Qué roles están creciendo?</p>
                </div>
                <div className="p-3 bg-muted/5 dark:bg-card/30 rounded-[28px] border border-muted/20 dark:border-card">
                  <p className="font-semibold text-muted/90 dark:text-white text-sm">¿Cuándo es el mejor momento para cambiar?</p>
                </div>
                <div className="p-3 bg-muted/5 dark:bg-card/30 rounded-[28px] border border-muted/20 dark:border-card">
                  <p className="font-semibold text-muted/90 dark:text-white text-sm">¿Qué skills necesito para crecer?</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-background">
            <h3 className="text-xl font-bold text-white mb-2">Bienvenido a La Realidad</h3>
            <p className="text-teal-100 mb-6">Aquí es donde todo tu trabajo cobra vida. Entra al dashboard y comienza tu ejecución estratégica.</p>
            <Button 
              onClick={() => router.push('/despega/a4')}
              className="w-full bg-white text-teal-700 hover:bg-teal-50 font-semibold"
            >
              Ir a La Realidad
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
