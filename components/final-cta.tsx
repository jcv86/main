'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, CreditCard, Clock } from 'lucide-react'

const trustItems = [
  { icon: ShieldCheck, label: '7 días de garantía' },
  { icon: CreditCard, label: 'Sin tarjeta para empezar' },
  { icon: Clock, label: 'Diagnóstico en 30 min' },
]

export default function FinalCta() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="container mx-auto px-4 py-20 border-t border-white/10">
      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto overflow-hidden rounded-3xl border border-teal-400/20 px-6 py-16 md:px-16 md:py-20 text-center transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          background:
            'radial-gradient(120% 120% at 50% 0%, rgba(80, 160, 170, 0.14) 0%, rgba(80, 160, 170, 0.03) 45%, transparent 80%)',
        }}
      >
        {/* Glow accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[28rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: 'rgba(80, 160, 170, 0.18)' }}
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-sm font-medium text-teal-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
            </span>
            Tu claridad empieza hoy
          </span>

          <h2 className="mt-6 text-4xl md:text-5xl font-light text-balance">
            Da el primer paso hacia tu claridad.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/70 text-pretty leading-relaxed">
            7 días, sin costo si no es para ti. Pero basándose en nuestros datos:{' '}
            <span className="font-semibold text-teal-300">9 de cada 10 continúan.</span>
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signin" prefetch={true}>
              <Button
                size="lg"
                className="group rounded-full px-10 py-7 text-base font-medium text-white shadow-lg shadow-teal-500/20 transition-all hover:shadow-teal-500/30"
                style={{ backgroundColor: 'rgba(80, 160, 170, 0.9)' }}
              >
                Comenzar diagnóstico gratis
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/auth/signin" prefetch={true}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-teal-400/40 bg-transparent px-10 py-7 text-base font-medium text-teal-200 hover:bg-teal-400/10 hover:text-teal-100"
              >
                Ya tengo cuenta
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustItems.map((item, idx) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 text-sm text-foreground/60 transition-all duration-500 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
                style={{ transitionDelay: `${300 + idx * 120}ms` }}
              >
                <item.icon className="h-4 w-4 text-teal-400" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
