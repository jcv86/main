'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { A2ChatCoach } from '@/components/a2-chat-coach'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, MessageCircle, BookOpen, Lightbulb } from 'lucide-react'

export default function A2ChatCoachPage() {
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [a1Results, setA1Results] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadData = async () => {
      try {
        console.log('[v0] A2 Coach loading data...')
        
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/signin')
          return
        }

        // Load user profile
        const { data: profileData } = await supabase
          .from('despega_user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        console.log('[v0] Profile loaded:', profileData?.id)
        setUserProfile(profileData)

        // Load A1 results
        if (profileData?.a1_test_id) {
          const { data: a1Data } = await supabase
            .from('unified_test_results')
            .select('*')
            .eq('id', profileData.a1_test_id)
            .single()

          console.log('[v0] A1 results loaded:', a1Data?.pattern_identified)
          setA1Results(a1Data)
        }
      } catch (error) {
        console.error('[v0] Error loading A2 coach data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [mounted, supabase, router])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted/5 to-muted/10 dark:from-background dark:to-muted/90 flex items-center justify-center">
        <div className="text-center space-y-3">
          <MessageCircle className="w-8 h-8 animate-pulse text-blue mx-auto" />
          <p className="text-muted/60 dark:text-muted/40">Iniciando tu sesión con el Coach...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/5 to-muted/10 dark:from-background dark:to-muted/90">
      {/* Header */}
      <div className="border-b border-muted/20 dark:border-muted/80 bg-white dark:bg-background sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/despega/a2/dashboard" className="p-2 hover:bg-muted/10 dark:hover:bg-muted/80 rounded-lg transition">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue dark:text-blue/40" />
                <h1 className="text-2xl font-bold text-muted/90 dark:text-muted/5">Chat Coach</h1>
              </div>
              <p className="text-sm text-muted/60 dark:text-muted/40">
                Profundización Cognitiva - Sofía & Dani
              </p>
            </div>
            <Badge variant="outline" className="bg-blue/5 dark:bg-blue-950 text-blue dark:text-blue/20 border-blue/30 dark:border-blue/10">
              A2 – Disponible 24/7
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6" ref={scrollRef}>
        
        {/* Info Cards */}
        {!a1Results && (
          <Card className="border-0 shadow-sm bg-yellow/5 dark:bg-amber-950/20 border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Nota:</strong> Para acceder al Chat Coach, primero necesitas completar tu evaluación A1 (Despega Cerebral).
              </p>
              <Button asChild className="mt-3" size="sm" variant="outline">
                <Link href="/despega/onboarding">Completar A1 ahora</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* About A2 Coach */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Cómo funciona el Coach</CardTitle>
            <CardDescription>Tu acompañante en profundización cognitiva</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-muted/90 dark:text-muted/5">Profundización</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">
                      Exploramos cómo tu patrón se manifiesta en diferentes contextos
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-muted/90 dark:text-muted/5">Sin etiquetas</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">
                      No diagnosticamos, explicamos variaciones y flexibilidad
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-purple/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-muted/90 dark:text-muted/5">Conversacional</p>
                    <p className="text-sm text-muted/60 dark:text-muted/40">
                      Haz preguntas libremente sobre tu patrón y contextos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat Coach Component */}
        {a1Results && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue dark:text-blue/40" />
              <h2 className="text-lg font-semibold text-muted/90 dark:text-muted/5">
                Sesión de Profundización
              </h2>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden">
              <A2ChatCoach
                a1Pattern={a1Results.pattern_identified || 'No especificado'}
                variantContexts={a1Results.variant_contexts || []}
                internalTensions={a1Results.internal_tensions || []}
              />
            </Card>
          </div>
        )}

        {/* Tips Card */}
        <Card className="border-0 shadow-sm bg-muted/5 dark:bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Preguntas útiles para explorar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted/70 dark:text-muted/30">
              <p>• ¿Cómo varía mi patrón según el contexto laboral o personal?</p>
              <p>• ¿Qué tensiones internas he notado entre lo que siento y lo que hago?</p>
              <p>• ¿En qué situaciones actúo diferente a mi patrón típico?</p>
              <p>• ¿Cómo puedo usar esta flexibilidad a mi favor?</p>
              <p>• ¿Qué me gustaría explorar para mi transformación en los próximos 90 días?</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
