'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Compass, Dumbbell, Radar, Sparkles } from 'lucide-react'

const TEAL = 'rgb(80, 160, 170)'

const STAGES = [
  { title: 'Despega Cerebral', icon: Brain, color: '#a78bfa', angle: -90 },
  { title: 'Tu Ruta', icon: Compass, color: '#22d3ee', angle: 0 },
  { title: 'Entrenamiento', icon: Dumbbell, color: '#34d399', angle: 90 },
  { title: 'Radar Estratégico', icon: Radar, color: '#fb923c', angle: 180 },
]

const STATUS_MESSAGES = [
  'Ordenando tu foco...',
  'Analizando tu perfil...',
  'Listo para despegar.',
  'Construyendo tu ruta...',
  'Identificando oportunidades...',
]

// Small dots orbiting at different radii for particle effect
const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  angle: (i / 8) * 360,
  radius: 230,
  size: i % 3 === 0 ? 3 : 2,
  speed: i % 2 === 0 ? 1 : -0.7,
  opacity: 0.3 + (i % 3) * 0.15,
}))

export default function VeraCircularDiagram() {
  const [rotation, setRotation] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)
  const [pulse, setPulse] = useState(false)

  // Slow continuous orbit
  useEffect(() => {
    let frame: number
    const animate = () => {
      setRotation((r) => (r + 0.1) % 360)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Rotating status text
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const orbitRadius = 168

  return (
    <div
      className="relative mx-auto flex items-center justify-center select-none"
      style={{ width: 540, height: 540 }}
    >
      {/* Outermost ambient glow */}
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 460,
          height: 460,
          background: 'radial-gradient(circle, rgba(56,189,248,0.12), rgba(167,139,250,0.08), transparent 70%)',
        }}
      />

      {/* Outer particle ring (dashed) */}
      <div
        className="absolute rounded-full border border-dashed border-white/[0.07]"
        style={{ width: 480, height: 480 }}
      />

      {/* Particle dots on outer ring */}
      {PARTICLES.map((p, i) => {
        const angleRad = ((p.angle + rotation * p.speed) * Math.PI) / 180
        const x = Math.cos(angleRad) * p.radius
        const y = Math.sin(angleRad) * p.radius
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: i % 2 === 0 ? TEAL : '#a78bfa',
              opacity: p.opacity,
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          />
        )
      })}

      {/* Mid orbit track */}
      <div
        className="absolute rounded-full border border-white/[0.05]"
        style={{ width: 380, height: 380 }}
      />

      {/* Spinning conic gradient ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 308,
          height: 308,
          background: 'conic-gradient(from 0deg, #fb923c, #f472b6, #a78bfa, #38bdf8, #34d399, #fb923c)',
          animation: 'vera-spin 20s linear infinite',
          boxShadow: '0 0 50px rgba(168,85,247,0.2)',
          mask: 'radial-gradient(circle, transparent 145px, #000 146px)',
          WebkitMask: 'radial-gradient(circle, transparent 145px, #000 146px)',
        }}
      />

      {/* Pulse rings emanating from center */}
      <div
        className="absolute rounded-full border"
        style={{
          width: 268,
          height: 268,
          borderColor: `${TEAL}25`,
          animation: 'pulse-ring 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        }}
      />
      <div
        className="absolute rounded-full border"
        style={{
          width: 268,
          height: 268,
          borderColor: `${TEAL}15`,
          animation: 'pulse-ring 3s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite 1s',
        }}
      />

      {/* Dark center disc */}
      <div
        className="absolute rounded-full flex flex-col items-center justify-center text-center px-8"
        style={{
          width: 288,
          height: 288,
          background: 'radial-gradient(circle at 40% 35%, #0f1015, #06060a)',
          boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
        }}
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-2xl mb-3"
          style={{ backgroundColor: `${TEAL}20`, border: `1px solid ${TEAL}40` }}
        >
          <Sparkles className="h-5 w-5" style={{ color: TEAL }} />
        </div>

        <p className="text-3xl font-bold text-white tracking-tight">Vera</p>
        <p
          className="text-[10px] font-semibold tracking-[0.22em] mt-1"
          style={{ color: TEAL }}
        >
          TU COACH IA
        </p>

        <div className="mt-4 h-6 flex items-center justify-center px-4">
          <p
            key={statusIndex}
            className="text-[11px] text-white/60 text-center leading-tight"
            style={{ animation: 'vera-fade 0.5s ease both' }}
          >
            {STATUS_MESSAGES[statusIndex]}
          </p>
        </div>

        {/* Active pulse dot */}
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: TEAL }}
          />
          <span className="text-[10px] text-white/30">en línea</span>
        </div>
      </div>

      {/* Orbiting stage cards */}
      {STAGES.map((stage, idx) => {
        const Icon = stage.icon
        const angleRad = ((stage.angle + rotation) * Math.PI) / 180
        const x = Math.cos(angleRad) * orbitRadius
        const y = Math.sin(angleRad) * orbitRadius
        return (
          <div
            key={idx}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          >
            <div
              className="group flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md px-3.5 py-3 w-[100px] transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:scale-105"
              style={{
                boxShadow: `0 8px 28px rgba(0,0,0,0.5), inset 0 0 0 1px ${stage.color}18`,
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${stage.color}20`, border: `1px solid ${stage.color}40` }}
              >
                <Icon size={16} style={{ color: stage.color }} strokeWidth={2} />
              </div>
              <span className="text-[10px] font-semibold leading-tight text-center text-white/80">
                {stage.title}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
