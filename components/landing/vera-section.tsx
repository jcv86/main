'use client'

import React from 'react'
import VeraCircularDiagram from '@/components/vera-circular-diagram'
import VeraChatLive from '@/components/vera-chat-live'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

const TEAL = '#50a0aa'

export default function VeraSection() {
  const { ref, inView } = useScrollReveal({ threshold: 0.05 })

  return (
    <section
      ref={ref}
      className="relative py-28 border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background treatment — subtle gradient to give the section its own depth */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(80,160,170,0.03) 50%, transparent 100%)',
        }}
      />
      {/* Centered teal glow behind the diagram */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: '25%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${TEAL}12, transparent 65%)`,
          opacity: inView ? 1 : 0,
          transition: 'opacity 1.4s ease',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className="text-center max-w-2xl mx-auto mb-16"
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
            Vera — IA Coach 24/7
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance"
          >
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
          <p className="mt-4 text-base text-white/50 leading-relaxed text-balance">
            Vera tiene contexto completo de quién eres. Disponible a las 3am cuando no puedes dormir pensando en tu carrera, y lista para preparar esa entrevista del jueves.
          </p>
        </div>

        {/* Main two-column layout: Diagram LEFT · Chat RIGHT */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* LEFT — Orbit diagram in its own card */}
          <div
            className="flex items-center justify-center rounded-3xl p-8"
            style={{
              background: 'linear-gradient(145deg, #0f1014, #0a0c10)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: `0 0 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)`,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(-32px)',
              transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
            }}
          >
            <div className="relative">
              <VeraCircularDiagram />

              {/* Floating stat badges */}
              <div
                className="absolute -top-4 -right-6 rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 hidden xl:block"
                style={{
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(-10px)',
                  transition: 'opacity 0.7s ease 0.7s, transform 0.7s ease 0.7s',
                }}
              >
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Respuesta</p>
                <p className="text-sm font-bold text-white">{'<'} 2 segundos</p>
              </div>

              <div
                className="absolute -bottom-4 -left-6 rounded-xl border border-white/10 bg-[#0f1014] px-4 py-2 hidden xl:block"
                style={{
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 0.7s ease 0.8s, transform 0.7s ease 0.8s',
                }}
              >
                <p className="text-[9px] text-white/40 uppercase tracking-widest">Disponibilidad</p>
                <p className="text-sm font-bold" style={{ color: TEAL }}>24 / 7 / 365</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Chat live */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateX(0)' : 'translateX(32px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
            }}
          >
            <VeraChatLive />
          </div>
        </div>
      </div>
    </section>
  )
}
