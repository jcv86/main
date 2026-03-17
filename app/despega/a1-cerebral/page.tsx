'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'

export default function A1CerebralPage() {
  const [idx, setIdx] = useState(0)
  const [more, setMore] = useState<Record<number, string>>({})
  const [less, setLess] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authOk, setAuthOk] = useState(false)
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

  const q = DISC_TEST_QUESTIONS[idx]
  const bothAnswered = !!more[q.id] && !!less[q.id]
  const isLast = idx === DISC_TEST_QUESTIONS.length - 1

  const calculateScores = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }
    for (const qid in more) {
      const question = DISC_TEST_QUESTIONS.find(x => x.id === Number(qid))
      if (question) {
        const moreOpt = question.opciones.find(o => o.texto === more[qid])
        const lessOpt = question.opciones.find(o => o.texto === less[qid])
        if (moreOpt) scores[moreOpt.dimension]++
        if (lessOpt) scores[lessOpt.dimension]--
      }
    }
    return scores
  }

  const handleNext = async () => {
    if (!bothAnswered) { setError('Selecciona ambas opciones'); return }
    if (isLast) {
      setLoading(true)
      try {
        const { data: { user } } = await sb.auth.getUser()
        if (!user) { router.push('/auth/signin'); return }
        const scores = calculateScores()
        const { error: e } = await sb.from('despega_a1_test_results').insert({
          user_id: user.id,
          dimensions: scores,
          completed_at: new Date().toISOString()
        })
        if (e) throw e
        router.push('/despega/a1-report')
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
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Evaluación DISC Despega</h1>
            <span className="text-muted-foreground text-sm">{idx + 1}/{DISC_TEST_QUESTIONS.length}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2"><div className="h-full bg-primary" style={{ width: `${((idx + 1) / DISC_TEST_QUESTIONS.length) * 100}%` }} /></div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-8 text-center">{q.pregunta}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4 text-center">MÁS como yo</p>
              <div className="space-y-3">
                {q.opciones.map((opt) => (
                  <button key={`more-${opt.texto}`} onClick={() => { setMore(p => ({ ...p, [q.id]: opt.texto })); setError('') }} className={`w-full text-left p-4 rounded-lg border-2 transition-all text-sm ${more[q.id] === opt.texto ? 'border-green-600 bg-green-50 dark:bg-green-950' : 'border-border'}`}>
                    {opt.texto}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4 text-center">MENOS como yo</p>
              <div className="space-y-3">
                {q.opciones.map((opt) => (
                  <button key={`less-${opt.texto}`} onClick={() => { setLess(p => ({ ...p, [q.id]: opt.texto })); setError('') }} className={`w-full text-left p-4 rounded-lg border-2 transition-all text-sm ${less[q.id] === opt.texto ? 'border-red-600 bg-red-50 dark:bg-red-950' : 'border-border'}`}>
                    {opt.texto}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {error && <p className="text-destructive text-sm mt-4 text-center">{error}</p>}
        </div>
        <div className="flex gap-4">
          <Button onClick={() => idx > 0 && setIdx(idx - 1)} variant="outline" disabled={idx === 0} className="flex-1">Anterior</Button>
          <Button onClick={handleNext} disabled={!bothAnswered || loading} className="flex-1">{loading ? 'Guardando...' : isLast ? 'Ver Resultados' : 'Siguiente'}</Button>
        </div>
      </div>
    </div>
  )
}
