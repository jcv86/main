'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Compass, Dumbbell, Radar } from 'lucide-react'

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
]

export default function VeraCircularDiagram() {
  const [rotation, setRotation] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)

  // Slow continuous orbit
  useEffect(() => {
    let frame: number
    const animate = () => {
      setRotation((r) => (r + 0.12) % 360)
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Rotating status text
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length)
    }, 2600)
    return () => clearInterval(interval)
  }, [])

  const radius = 195 // orbit radius for cards

  return (
    <div className="relative mx-auto flex items-center justify-center" style={{ width: 540, height: 540 }}>
      {/* Ambient glow behind everything */}
      <div
        className="absolute rounded-full blur-3xl opacity-30"
        style={{
          width: 380,
          height: 380,
          background:
            'radial-gradient(circle, rgba(56,189,248,0.5), rgba(168,85,247,0.3), transparent 70%)',
        }}
      />

      {/* Thick gradient ring (spinning) */}
      <div
        className="absolute rounded-full"
        style={{
          width: 300,
          height: 300,
          background:
            'conic-gradient(from 0deg, #fb923c, #f472b6, #a78bfa, #38bdf8, #34d399, #fb923c)',
          animation: 'vera-spin 16s linear infinite',
          boxShadow: '0 0 60px rgba(168,85,247,0.35)',
          mask: 'radial-gradient(circle, transparent 142px, #000 142px)',
          WebkitMask: 'radial-gradient(circle, transparent 142px, #000 142px)',
        }}
      />

      {/* Dark center disc (static) */}
      <div
        className="absolute rounded-full bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-8"
        style={{ width: 288, height: 288 }}
      >
        <p className="text-3xl font-bold text-white tracking-tight">Vera</p>
        <p className="text-[10px] font-semibold tracking-[0.25em] text-cyan-400 mt-1.5">
          TU COACH IA
        </p>
        <div className="mt-5 h-5">
          <p
            key={statusIndex}
            className="text-sm text-white/70"
            style={{ animation: 'vera-fade 0.6s ease' }}
          >
            {STATUS_MESSAGES[statusIndex]}
          </p>
        </div>
      </div>

      {/* Orbiting stage cards */}
      {STAGES.map((stage, idx) => {
        const Icon = stage.icon
        const angleRad = ((stage.angle + rotation) * Math.PI) / 180
        const x = Math.cos(angleRad) * radius
        const y = Math.sin(angleRad) * radius
        return (
          <div
            key={idx}
            className="absolute"
            style={{
              transform: `translate(${x}px, ${y}px)`,
              left: '50%',
              top: '50%',
              marginLeft: -54,
              marginTop: -38,
            }}
          >
            <div
              className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md px-4 py-3.5 w-[108px] hover:border-white/30 hover:bg-white/[0.08] transition-colors duration-300"
              style={{ boxShadow: '0 8px 28px rgba(0,0,0,0.45)' }}
            >
              <div
                className="flex items-center justify-center w-9 h-9 rounded-xl"
                style={{ background: `${stage.color}1a` }}
              >
                <Icon size={18} style={{ color: stage.color }} strokeWidth={2} />
              </div>
              <span className="text-[11px] font-semibold leading-tight text-center text-white">
                {stage.title}
              </span>
            </div>
          </div>
        )
      })}

      <style jsx>{`
        @keyframes vera-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes vera-fade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
