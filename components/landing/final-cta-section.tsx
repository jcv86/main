'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const TEAL = 'rgb(80, 160, 170)'

export default function FinalCtaSection() {
  return (
    <section className="relative py-32 border-t border-white/[0.06] overflow-hidden">
      {/* Glow background */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[100px] opacity-[0.1]"
          style={{ backgroundColor: TEAL }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: TEAL }}
        >
          El siguiente paso es tuyo
        </p>

        <h2
          className="font-bold text-white text-balance leading-tight tracking-tight mb-6"
          style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
        >
          Empieza hoy.
          <br />
          <span
            style={{
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundImage: `linear-gradient(135deg, ${TEAL}, #7dd3d8)`,
            }}
          >
            Es gratis.
          </span>
        </h2>

        <p className="max-w-xl mx-auto text-base text-white/50 leading-relaxed mb-10">
          El diagnóstico inicial es gratuito. Vera te acompaña los primeros 7 días sin costo. Si no es para ti, no pagas nada.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ backgroundColor: TEAL }}
          >
            Comenzar mi diagnóstico
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/como-funciona"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-all"
          >
            Ver cómo funciona
          </Link>
        </div>

        <p className="mt-8 text-xs text-white/30">
          Sin tarjeta de crédito · Garantía 7 días · Cancela cuando quieras
        </p>
      </div>
    </section>
  )
}
