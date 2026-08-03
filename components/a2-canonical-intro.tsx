'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, BookOpen, Loader2, Target, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export interface A2IntroProfile {
  energia: number
  enfoque: number
  relaciones: number
  planEjecutivo: number
  primaryName: string
  primaryScore: number
}

interface TransitionPayload {
  success?: boolean
  nextPath?: string
  error?: string
}

export function A2CanonicalIntro({ profile }: { profile: A2IntroProfile }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const beginRoute = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/journey/transition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ step: 'a2_intro' }),
      })
      const payload = (await response.json().catch(() => ({}))) as TransitionPayload
      if (!response.ok || !payload.nextPath) {
        throw new Error(payload.error || 'No pudimos iniciar Tu Ruta.')
      }

      router.push(payload.nextPath)
      router.refresh()
    } catch (transitionError) {
      console.error('[v0] A2 intro transition error:', transitionError)
      setError(
        transitionError instanceof Error
          ? transitionError.message
          : 'No pudimos iniciar Tu Ruta.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const dimensions = [
    ['Energía', profile.energia],
    ['Enfoque', profile.enfoque],
    ['Relaciones', profile.relaciones],
    ['Plan Ejecutivo', profile.planEjecutivo],
  ] as const

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-4 text-center">
          <Badge variant="secondary">A2 · Tu Ruta</Badge>
          <h1 className="text-4xl font-semibold text-white md:text-6xl">
            Convierte tu diagnóstico en acción
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65">
            A1 ya explicó cómo funcionas y qué contexto estás enfrentando. Tu Ruta
            traduce esa información en un primer ciclo de 30 días, ampliable a 60 y
            90 cuando decidas continuar.
          </p>
        </header>

        <Card className="border-white/10 bg-white/5">
          <CardContent className="space-y-6 pt-7">
            <p className="text-lg text-white/80">
              Tu dimensión dominante es <strong>{profile.primaryName}</strong> con{' '}
              <strong>{Math.round(profile.primaryScore)}%</strong>. Las misiones usarán
              esa tendencia como punto de partida, sin convertirla en una etiqueta.
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {dimensions.map(([label, score]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/40">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {Math.round(score)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-cyan-500/20 bg-cyan-500/5">
            <CardHeader>
              <Zap className="h-6 w-6 text-cyan-300" />
              <CardTitle>Ciclo inicial</CardTitle>
              <CardDescription>30 días</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-white/65">
              Acciones concretas, evidencia y revisiones para establecer una base real.
            </CardContent>
          </Card>
          <Card className="border-purple-500/20 bg-purple-500/5">
            <CardHeader>
              <Target className="h-6 w-6 text-purple-300" />
              <CardTitle>Extensión opcional</CardTitle>
              <CardDescription>60 días</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-white/65">
              Profundización basada en tus resultados, no una obligación automática.
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader>
              <BookOpen className="h-6 w-6 text-emerald-300" />
              <CardTitle>Integración</CardTitle>
              <CardDescription>90 días</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-white/65">
              Consolidación, mercado real y checkpoints progresivos de Entrenamiento.
            </CardContent>
          </Card>
        </section>

        <Card className="border-indigo-500/30 bg-indigo-500/10 p-6">
          <p className="text-sm leading-relaxed text-indigo-50/80">
            Entrenamiento no espera al final de Tu Ruta: se abre en checkpoints desde
            el Día 7. Cada módulo utiliza la evidencia que construiste en A1 y A2.
          </p>
        </Card>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </p>
        )}

        <Button
          onClick={() => void beginRoute()}
          disabled={submitting}
          className="h-14 w-full bg-indigo-600 text-base font-semibold text-white hover:bg-indigo-500"
        >
          {submitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ArrowRight className="mr-2 h-5 w-5" />
          )}
          Comenzar Tu Ruta de 30 días
        </Button>
      </div>
    </main>
  )
}
