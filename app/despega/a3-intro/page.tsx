'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Target, MessageSquare, Zap, ArrowRight } from 'lucide-react'
import { StepHeader } from '@/components/step-header'

export default function A3IntroPage() {
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
            console.log('[v0] Demo user found for a3-intro:', demoUser.email)
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
      
      const { error: updateError } = await supabase
        .from('despega_user_profiles')
        .upsert({
          user_id: userId,
          a3_intro_seen: true,
          a3_intro_seen_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (updateError) {
        console.error('[v0] Error marking A3 intro seen:', updateError)
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
          stepNumber={3}
          pillarName="Entrenamiento Intensivo"
          title="Prepárate para Entrevistas Reales"
          description="Simulaciones prácticas, feedback de IA en tiempo real, y ajustes iterativos. Aquí transformas conocimiento en confianza bajo presión."
          estimatedTime="~60-90 min"
          pillarColor="orange"
        />

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Target className="w-6 h-6 text-orange" />
                ¿Qué es Entrenamiento Intensivo?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white leading-relaxed text-lg">
                Esta es tu fase de práctica de alto impacto. Realizarás simulaciones de entrevistas estructuradas donde recibirás feedback inmediato de IA y podrás iterar tu desempeño hasta llegar a la confianza de nivel profesional.
              </p>
              <div className="bg-orange/10 p-6 rounded-xl border-2 border-orange/40">
                <p className="text-white font-semibold text-lg">
                  <span className="text-orange">Tu objetivo aquí:</span> Pasar de "conozco las respuestas" a "puedo responder con seguridad bajo presión".
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-orange" />
                Las 3 Modalidades de Entrenamiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-orange/5 dark:bg-orange/30 rounded-[28px] border border-orange/20 dark:border-orange">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center font-bold">1</div>
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-white">Simulación Guiada</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Con hints y orientación. Perfecto para aprender técnicas nuevas.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-orange/10 dark:bg-orange/40 rounded-[28px] border border-orange/30 dark:border-orange">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange/80 text-white rounded-full flex items-center justify-center font-bold">2</div>
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-white">Simulación Estructurada</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Preguntas realistas sin ayuda. Te prepara para el verdadero escenario.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-orange/15 dark:bg-orange/50 rounded-[28px] border border-orange/40 dark:border-orange">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange/60 text-white rounded-full flex items-center justify-center font-bold">3</div>
                    <div>
                      <p className="font-semibold text-muted/90 dark:text-white">Simulación Desafiante</p>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground">Preguntas difíciles bajo presión de tiempo. Máxima dificultad.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-muted/90 dark:bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-orange" />
                El Ciclo de Mejora
              </CardTitle>
              <CardDescription className="text-muted-foreground">Cada simulación sigue este proceso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-muted/80/50 p-4 rounded-[28px] border border-muted/70 text-center">
                  <div className="text-3xl font-bold text-orange mb-2">1</div>
                  <p className="text-sm font-semibold text-white mb-1">Responde</p>
                  <p className="text-xs text-white/70">Simulación completa</p>
                </div>
                <div className="bg-muted/80/50 p-4 rounded-[28px] border border-muted/70 text-center">
                  <div className="text-3xl font-bold text-orange mb-2">2</div>
                  <p className="text-sm font-semibold text-white mb-1">Analiza</p>
                  <p className="text-xs text-white/70">Feedback de IA</p>
                </div>
                <div className="bg-muted/80/50 p-4 rounded-[28px] border border-muted/70 text-center">
                  <div className="text-3xl font-bold text-orange mb-2">3</div>
                  <p className="text-sm font-semibold text-white mb-1">Ajusta</p>
                  <p className="text-xs text-white/70">Mejora tu respuesta</p>
                </div>
                <div className="bg-muted/80/50 p-4 rounded-[28px] border border-muted/70 text-center">
                  <div className="text-3xl font-bold text-orange mb-2">4</div>
                  <p className="text-sm font-semibold text-white mb-1">Repite</p>
                  <p className="text-xs text-white/70">Vuelve a simular</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange" />
                Lo que Practicarás
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-muted/5 dark:bg-card/30 rounded-[28px] border border-muted/20 dark:border-card">
                  <p className="font-semibold text-muted/90 dark:text-white text-sm">Respuestas estructuradas STAR</p>
                </div>
                <div className="p-3 bg-muted/5 dark:bg-card/30 rounded-[28px] border border-muted/20 dark:border-card">
                  <p className="font-semibold text-muted/90 dark:text-white text-sm">Manejo de presión y tiempo</p>
                </div>
                <div className="p-3 bg-muted/5 dark:bg-card/30 rounded-[28px] border border-muted/20 dark:border-card">
                  <p className="font-semibold text-muted/90 dark:text-white text-sm">Comunicación clara y concisa</p>
                </div>
                <div className="p-3 bg-muted/5 dark:bg-card/30 rounded-[28px] border border-muted/20 dark:border-card">
                  <p className="font-semibold text-muted/90 dark:text-white text-sm">Técnicas de cierre y preguntas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 bg-orange/10 border-2 border-orange/40 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-4">Listo para Entrenar?</h3>
            <p className="text-white/90 text-lg mb-6">Entra al dashboard, elige tu modalidad de entrenamiento y comienza a simular entrevistas reales.</p>
            <Button 
              onClick={() => router.push('/despega/a3')}
              className="w-full bg-orange hover:bg-orange/80 text-white font-bold text-lg py-6"
            >
              Ir a Entrenamiento Intensivo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
