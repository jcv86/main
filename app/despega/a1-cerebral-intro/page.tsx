'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageContainer, PageHeader, PageStack } from '@/components/layout/page-foundation'

const EXAMPLE = [
  { label: 'Decidido y directo', selection: 'MÁS como yo' },
  { label: 'Optimista e inspirador', selection: null },
  { label: 'Paciente y considerado', selection: null },
  { label: 'Analítico y preciso', selection: 'MENOS como yo' },
]

export default function A1CerebralIntroPage() {
  const [authOk, setAuthOk] = useState(false)
  const [baselineCompleted, setBaselineCompleted] = useState(false)
  const [outcomeStatusReady, setOutcomeStatusReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [supabase] = useState(() => createClient())
  const router = useRouter()

  useEffect(() => {
    let active = true
    const controller = new AbortController()
    setLoadError(false)
    setOutcomeStatusReady(false)
    async function load() {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (!active) return
        if (error) throw error
        if (!user) { router.replace('/auth/signin'); return }
        setAuthOk(true)
        // Preserve the canonical entry marker without inventing assessment completion.
        await supabase.from('despega_user_profiles').upsert({
          user_id: user.id,
          a1_cerebral_intro_seen: true,
          a1_cerebral_intro_seen_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        const response = await fetch('/api/outcomes/a1-status', {
          cache: 'no-store', credentials: 'include', signal: controller.signal,
        })
        if (!response.ok) throw new Error('Status unavailable')
        const status = await response.json()
        if (typeof status.baselineCompleted !== 'boolean') throw new Error('Invalid status')
        if (active) { setBaselineCompleted(status.baselineCompleted); setOutcomeStatusReady(true) }
      } catch {
        if (active) setLoadError(true)
      }
    }
    void load()
    return () => { active = false; controller.abort() }
  }, [supabase, router, retry])

  if (!authOk) {
    return <PageContainer className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <p role="status">{loadError ? 'No pudimos recuperar tu sesión.' : 'Verificando tu sesión…'}</p>
      {loadError && <Button variant="outline" onClick={() => setRetry(value => value + 1)}>Reintentar</Button>}
    </PageContainer>
  }

  return <PageContainer><PageStack>
    <PageHeader
      title="Despega Cerebral: revisa tus preferencias"
      description="Responde 28 preguntas sobre situaciones cotidianas. Después podrás revisar qué reconoces en tus respuestas y qué necesita más contexto."
      actions={<Badge variant="outline">Aproximadamente 10 minutos</Badge>}
    />

    <Card><CardHeader><CardTitle>Un punto de partida para conocerte</CardTitle></CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        <p>Elegirás cómo sueles actuar o comunicarte en distintas situaciones. Tus respuestas ayudan a formular preguntas y elegir algo concreto para practicar.</p>
        <p>El resultado refleja lo que declaras en este momento y puede cambiar según el contexto. No es un diagnóstico, una medición del cerebro ni una prueba de tus capacidades o de tu idoneidad para un trabajo.</p>
        <p>Las cuatro dimensiones del cuestionario organizan tus elecciones: tomar la iniciativa, interactuar con otras personas, mantener la continuidad y atender a criterios o detalles. Ninguna es mejor que otra y pueden aparecer combinaciones o empates.</p>
      </CardContent>
    </Card>

    <Card><CardHeader><CardTitle>Cómo responder</CardTitle></CardHeader>
      <CardContent><ol className="list-decimal space-y-3 pl-5 text-sm leading-relaxed">
        <li>Lee las cuatro opciones de cada una de las 28 preguntas.</li>
        <li>Elige una opción que te describa <strong>MÁS</strong> y otra distinta que te describa <strong>MENOS</strong>.</li>
        <li>Piensa en situaciones recientes. Responde con lo que reconoces en ti, aunque ninguna opción encaje perfectamente.</li>
        <li>Al revisar el informe, podrás señalar matices o desacuerdos. Tus ejemplos y aclaraciones también forman parte del recorrido.</li>
      </ol></CardContent>
    </Card>

    <Card><CardHeader><CardTitle>Ejemplo del formato MÁS / MENOS</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">Ante un desafío, ¿qué opción se parece más y cuál se parece menos a tu forma de actuar?</p>
        <ul className="grid gap-3 sm:grid-cols-2" aria-label="Ejemplo ilustrativo con dos opciones seleccionadas">
          {EXAMPLE.map(option => <li key={option.label} className="flex min-w-0 flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-muted/40 p-4 text-sm">
            <span>{option.label}</span>
            {option.selection && <span className="rounded-md bg-[#3730a3] px-2 py-1 text-xs font-semibold text-white">{option.selection}</span>}
          </li>)}
        </ul>
        <p className="text-sm text-muted-foreground">Estas selecciones sólo ilustran el formato. El ejemplo no se guarda y no hay una respuesta correcta.</p>
      </CardContent>
    </Card>

    <Card><CardHeader><CardTitle>Tu objetivo, a tu ritmo</CardTitle></CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed">
        <p>Si quieres orientar una búsqueda laboral, puedes guardar ahora el cargo, el área y las condiciones que te interesan, o indicar que todavía estás explorando. Podrás retomarlo y editarlo en el Radar.</p>
        <Link href="/despega/objetivo-laboral" className="inline-flex min-h-11 items-center rounded-md px-2 font-medium text-foreground underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Definir o revisar mi objetivo laboral</Link>
        <p className="text-muted-foreground">Este paso es opcional. También puedes continuar con un objetivo de desarrollo personal.</p>
      </CardContent>
    </Card>

    {loadError && <div role="alert" className="space-y-3 rounded-xl border border-border p-4 text-sm">
      <p>No pudimos comprobar si ya guardaste tu punto de partida. Reintenta para continuar con el registro correcto.</p>
      <Button variant="outline" onClick={() => setRetry(value => value + 1)}>Reintentar comprobación</Button>
    </div>}
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button
        onClick={() => router.push(baselineCompleted ? '/despega/a1-cerebral' : '/despega/a1-outcome-baseline')}
        disabled={!outcomeStatusReady}
        className="min-h-11 whitespace-normal bg-[#3730a3] px-6 text-white hover:bg-[#312e81] hover:text-white"
      >{!outcomeStatusReady ? 'Comprobando tu punto de partida…' : baselineCompleted ? 'Comenzar las 28 preguntas' : 'Registrar mi punto de partida'}</Button>
      <Button asChild variant="outline" className="min-h-11"><Link href="/despega">Volver a mi recorrido</Link></Button>
    </div>
  </PageStack></PageContainer>
}
