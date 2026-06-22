'use client'

import React from 'react'
import VeraCircularDiagram from '@/components/vera-circular-diagram'
import VeraChatLive from '@/components/vera-chat-live'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

const TEAL = 'rgb(80, 160, 170)'

export default function VeraSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.05 })

  return (
    <section ref={ref} className="relative py-24 border-t border-white/[0.06] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(ellipse, ${TEAL}0a, transparent 70%)`,
            opacity: inView ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="text-center max-w-2xl mx-auto mb-20"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: TEAL }}
          >
            Vera — tu coach IA 24/7
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
            Un acompañamiento que{' '}
            <span
              style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundImage: `linear-gradient(135deg, ${TEAL}, #7dd3d8)`,
              }}
            >
              no se apaga.
            </span>
          </h2>
          <p className="mt-4 text-base text-white/50 leading-relaxed">
            Vera tiene contexto completo de quién eres. Está disponible a las 3am cuando no puedes dormir pensando en tu carrera, y lista para ayudarte a preparar esa entrevista del jueves.
          </p>
        </div>

        {/* Vera orbit diagram — centered, full-width showcase */}
        <div
          className="flex justify-center mb-20"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0) scale(1)' : 'translateY(32px) scale(0.96)',
            transition: 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s',
          }}
        >
          <div className="relative">
            <VeraCircularDiagram />

            {/* Floating stat badges around the diagram */}
            <div
              className="absolute -left-4 top-1/4 -translate-y-1/2 rounded-xl border border-white/10 bg-black/80 backdrop-blur-sm px-4 py-2.5 hidden xl:block"
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(-20px)',
                transition: 'opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s',
              }}
            >
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Respuesta</p>
              <p className="text-sm font-bold text-white">&lt; 2 segundos</p>
            </div>

            <div
              className="absolute -right-4 bottom-1/4 translate-y-1/2 rounded-xl border border-white/10 bg-black/80 backdrop-blur-sm px-4 py-2.5 hidden xl:block"
              style={{
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateX(0)' : 'translateX(20px)',
                transition: 'opacity 0.8s ease 0.7s, transform 0.8s ease 0.7s',
              }}
            >
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Disponibilidad</p>
              <p className="text-sm font-bold" style={{ color: TEAL }}>24 / 7 / 365</p>
            </div>
          </div>
        </div>

        {/* Live chat demo below */}
        <div
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
          }}
        >
          <VeraChatLive />
        </div>
      </div>
    </section>
  )
}
