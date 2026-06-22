'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Moon, MessageSquare, Compass, Heart } from 'lucide-react'

type Msg = { from: 'vera' | 'user'; text: string }

const CONVERSATION: Msg[] = [
  { from: 'user', text: '¿Es realista el cambio a strategy?' },
  {
    from: 'vera',
    text: 'He notado que te interesa strategy pero tu carrera ha sido ejecución. Hablemos sobre transiciones reales en tu industria.',
  },
  { from: 'user', text: 'No sé qué decir en la entrevista del jueves.' },
  {
    from: 'vera',
    text: 'Tranquilo. Preparemos 3 historias de impacto con tu experiencia. Empieza por el proyecto que lideraste el último trimestre.',
  },
  { from: 'user', text: 'A veces siento que no avanzo.' },
  {
    from: 'vera',
    text: 'Tu progreso es real, aunque no lo sientas. En 30 días completaste 2 hitos. Vamos por el siguiente, paso a paso.',
  },
]

const BENEFITS = [
  { icon: Moon, text: 'Preguntas en medio de la noche (sin esperar a mañana)' },
  { icon: MessageSquare, text: 'Decisiones en entrevistas (qué preguntar, cómo negociar)' },
  { icon: Compass, text: 'Dudas sobre tu ruta (es normal, Vera las ha escuchado 10,000 veces)' },
  { icon: Heart, text: 'Motivación cuando baja (tu progreso es real, aunque no lo sientas)' },
]

export default function VeraChatLive() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  const [visible, setVisible] = useState<Msg[]>([])
  const [typing, setTyping] = useState(false)

  // reveal on scroll — start chat animation when in view
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Only hide if element is below the fold initially
    const rect = el.getBoundingClientRect()
    if (rect.top >= window.innerHeight) setInView(false)
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // animate the conversation
  useEffect(() => {
    if (!inView) return
    let cancelled = false
    let timers: ReturnType<typeof setTimeout>[] = []

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms)
        timers.push(t)
      })

    const run = async () => {
      while (!cancelled) {
        setVisible([])
        await wait(600)
        for (const msg of CONVERSATION) {
          if (cancelled) return
          if (msg.from === 'vera') {
            setTyping(true)
            await wait(1300)
            if (cancelled) return
            setTyping(false)
          } else {
            await wait(700)
          }
          if (cancelled) return
          setVisible((prev) => [...prev, msg])
          await wait(msg.from === 'vera' ? 2200 : 900)
        }
        await wait(2600)
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [inView])

  // keep chat scrolled to bottom
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [visible, typing])

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {/* Header */}
      <div
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <p className="text-xs font-semibold tracking-[0.2em] text-teal-400 mb-2">VERA · IA COACH 24/7</p>
        <h3 className="text-2xl font-bold text-white leading-snug">Un coach que entiende tu contexto.</h3>
        <p className="mt-2 text-sm text-white/50 leading-relaxed">
          No es un chat genérico. Vera entiende tu perfil, tu contexto, tus miedos.
        </p>
      </div>

      {/* Benefit pills */}
      <ul className="flex flex-col gap-2">
        {BENEFITS.map((b, idx) => (
          <li
            key={idx}
            className="flex gap-3 items-start rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 hover:border-teal-400/30 transition-colors"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.5s ease ${idx * 80 + 200}ms, transform 0.5s ease ${idx * 80 + 200}ms`,
            }}
          >
            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-teal-500/10 border border-teal-500/20">
              <b.icon className="h-3.5 w-3.5 text-teal-400" />
            </span>
            <span className="text-xs text-white/70 leading-relaxed pt-0.5">{b.text}</span>
          </li>
        ))}
      </ul>

      {/* Live chat window */}
      <div
        className="rounded-2xl border bg-[#0a0a0f] overflow-hidden shadow-2xl"
        style={{
          borderColor: 'rgba(80, 160, 170, 0.3)',
          boxShadow: '0 0 50px rgba(45,212,191,0.10)',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(16px)',
        }}
      >
        {/* header */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 bg-white/[0.02]">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500/30 to-blue-500/20 text-[11px] font-bold text-teal-200">
            V
            <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-teal-400 border-2 border-[#0a0a0f]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-white">Chat con Vera</p>
            <p className="text-[11px] text-teal-400">En línea · responde al instante</p>
          </div>
        </div>

        {/* messages */}
        <div ref={scrollRef} className="h-[320px] overflow-hidden px-4 py-4 flex flex-col gap-3">
          {visible.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              style={{ animation: 'vera-msg-in 0.4s ease both' }}
            >
              <div
                className={
                  msg.from === 'vera'
                    ? 'max-w-[85%] rounded-2xl rounded-tl-sm bg-teal-500/15 border border-teal-500/25 px-4 py-2.5'
                    : 'max-w-[85%] rounded-2xl rounded-tr-sm bg-white/[0.06] border border-white/10 px-4 py-2.5'
                }
              >
                <p
                  className={`text-[11px] font-semibold mb-1 ${
                    msg.from === 'vera' ? 'text-teal-300' : 'text-foreground/50'
                  }`}
                >
                  {msg.from === 'vera' ? 'Vera' : 'Tú'}
                </p>
                <p className={`text-sm leading-relaxed ${msg.from === 'vera' ? 'text-teal-50' : 'text-foreground/80'}`}>
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start" style={{ animation: 'vera-msg-in 0.3s ease both' }}>
              <div className="rounded-2xl rounded-tl-sm bg-teal-500/15 border border-teal-500/25 px-4 py-3">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300/80" style={{ animation: 'vera-dot 1s infinite', animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300/80" style={{ animation: 'vera-dot 1s infinite', animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-300/80" style={{ animation: 'vera-dot 1s infinite', animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* fake input */}
        <div className="border-t border-white/10 px-4 py-3 bg-white/[0.02]">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2">
            <span className="text-sm text-foreground/40 flex-1">Escribe tu pregunta…</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500/80">
              <Check className="h-3.5 w-3.5 text-black" />
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes vera-msg-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes vera-dot {
          0%,
          60%,
          100% {
            opacity: 0.3;
            transform: translateY(0);
          }
          30% {
            opacity: 1;
            transform: translateY(-3px);
          }
        }
      `}</style>
    </div>
  )
}
