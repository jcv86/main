'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CONOZCAMONOS_1_QUESTIONS } from '@/lib/canon-conozcamonos-1-questions'

export default function Conozcamonos1Page() {
  const [idx,setIdx] = useState(0)
  const [resp,setResp] = useState<Record<number,string>>({})
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const [authOk,setAuthOk] = useState(false)
  const router = useRouter()
  const sb = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await sb.auth.getUser()
      if (!user) { router.push('/auth/signin'); return }
      setAuthOk(true)
    }
    check()
  }, [sb, router])

  if (!authOk) return <div className="min-h-screen flex items-center justify-center"><p>Verificando...</p></div>

  const q = CONOZCAMONOS_1_QUESTIONS[idx]
  const answered = !!resp[q.id]
  const isLast = idx === CONOZCAMONOS_1_QUESTIONS.length - 1

  const handleNext = async () => {
    if (!resp[q.id]) { setError('Responde esta pregunta'); return }
    if (isLast) {
      setLoading(true)
      try {
        const { data: { user } } = await sb.auth.getUser()
        if (!user) { router.push('/auth/signin'); return }
        const { error: e } = await sb.from('canon_conozcamonos_1_responses').insert({
          user_id: user.id,
          responses: resp,
          completed_at: new Date().toISOString()
        })
        if (e) throw e
        router.push('/despega/a1-cerebral')
      } catch (err) {
        console.error('[v0] Error:', err)
        setError('Error al guardar')
      } finally {
        setLoading(false)
      }
    } else {
      setIdx(idx + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Conozcámonos 1</h1>
            <span className="text-muted-foreground text-sm">{idx + 1}/{CONOZCAMONOS_1_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2"><div className="h-full bg-primary" style={{ width: `${((idx + 1) / CONOZCAMONOS_1_QUESTIONS.length) * 100}%` }} /></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{q.question}</h2>
          <div className="space-y-3">
            {q.options?.map((opt) => (
              <button key={opt} onClick={() => { setResp(prev => ({ ...prev, [q.id]: opt })); setError('') }} className={`w-full text-left p-4 rounded-lg border-2 transition-all ${resp[q.id] === opt ? 'border-primary bg-primary/10' : 'border-border'}`}>
                <span className="text-foreground">{opt}</span>
              </button>
            ))}
          </div>
          {error && <p className="text-destructive text-sm mt-4">{error}</p>}
        </div>
        <div className="flex gap-4">
          <Button onClick={() => idx > 0 && setIdx(idx - 1)} variant="outline" disabled={idx === 0} className="flex-1">Atrás</Button>
          <Button onClick={handleNext} disabled={!answered || loading} className="flex-1">{loading ? 'Guardando...' : isLast ? 'Continuar' : 'Siguiente'}</Button>
        </div>
      </div>
    </div>
  )
}
