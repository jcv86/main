'use client'

import React, { useState, useEffect } from 'react'
import { Brain, Compass, Dumbbell, Radar, Sparkles } from 'lucide-react'

const TEAL = '#50a0aa'

const STAGES = [
  { title: 'Diagnóstico', sub: 'Quién eres', icon: Brain, color: '#a78bfa', angle: -90 },
  { title: 'Tu Ruta', sub: 'A dónde vas', icon: Compass, color: '#22d3ee', angle: 0 },
  { title: 'Entrenamiento', sub: 'Cómo llegar', icon: Dumbbell, color: '#34d399', angle: 90 },
  { title: 'Estrategia', sub: 'Con quién', icon: Radar, color: '#fb923c', angle: 180 },
]

const STATUS_MESSAGES = [
  'Analizando tu perfil...',
  'Construyendo tu ruta...',
  'Listo para despegar.',
  'Identificando oportunidades...',
  'Ordenando tu foco...',
]

export default function VeraCircularDiagram() {
  const [rotation, setRotation] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  // Slow continuous orbit
  useEffect(() => {
    let frame: number
    let last = 0
    const animate = (ts: number) => {
      if (ts - last > 16) {
        setRotation((r) => (r + 0.12) % 360)
        last = ts
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Rotating status text
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_MESSAGES.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  const orbitRadius = 155

  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: 480, height: 480 }}
    >
      {/* Deep ambient glow — visible even on black */}
      <div
        className="absolute rounded-full"
        style={{
          width: 380,
          height: 380,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${TEAL}18 0%, ${TEAL}08 40%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Outer decorative ring — dashed, faintly visible */}
      <svg
        className="absolute inset-0"
        width="480"
        height="480"
        viewBox="0 0 480 480"
        style={{ pointerEvents: 'none' }}
      >
        {/* Outer dashed orbit track */}
        <circle
          cx="240" cy="240" r="195"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        {/* Inner orbit track */}
        <circle
          cx="240" cy="240" r="155"
          fill="none"
          stroke={`${TEAL}30`}
          strokeWidth="1"
          strokeDasharray="3 6"
        />
        {/* Rotating arc highlight — always visible */}
        <circle
          cx="240" cy="240" r="155"
          fill="none"
          stroke={`url(#arcGrad)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="80 1000"
          strokeDashoffset={`${-rotation * 2.72}`}
        />
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0" />
            <stop offset="50%" stopColor={TEAL} stopOpacity="1" />
            <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Spinning conic ring — glowing color wheel */}
      <div
        className="absolute rounded-full"
        style={{
          width: 272,
          height: 272,
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          background: 'conic-gradient(from 0deg, #fb923c, #f472b6, #a78bfa, #38bdf8, #34d399, #fb923c)',
          mask: 'radial-gradient(circle, transparent 129px, #000 130px)',
          WebkitMask: 'radial-gradient(circle, transparent 129px, #000 130px)',
          opacity: 0.7,
          filter: 'blur(0.5px)',
        }}
      />

      {/* Pulse rings — visible on dark bg */}
      {[0, 1].map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 228,
            height: 228,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            border: `1px solid ${TEAL}`,
            opacity: 0,
            animation: `pulseRingVera 3s ease-out infinite`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}

      {/* Center disc — rich dark with visible content */}
      <div
        className="absolute rounded-full flex flex-col items-center justify-center text-center"
        style={{
          width: 216,
          height: 216,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(145deg, #111318, #0a0c10)',
          border: `1px solid ${TEAL}40`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${TEAL}18`,
        }}
      >
        {/* Vera icon */}
        <div
          className="flex items-center justify-center w-11 h-11 rounded-2xl mb-2"
          style={{
            background: `linear-gradient(135deg, ${TEAL}30, ${TEAL}10)`,
            border: `1px solid ${TEAL}60`,
            boxShadow: `0 0 20px ${TEAL}25`,
          }}
        >
          <Sparkles size={20} style={{ color: TEAL }} />
        </div>

        <p className="text-[22px] font-bold text-white tracking-tight leading-none">Vera</p>
        <p
          className="text-[9px] font-bold tracking-[0.25em] mt-1"
          style={{ color: TEAL }}
        >
          TU COACH IA
        </p>

        {/* Animated status */}
        <div className="mt-3 h-7 flex items-center justify-center px-3">
          <p
            key={statusIndex}
            className="text-[10px] text-white/50 text-center leading-tight"
            style={{ animation: 'vera-fade 0.4s ease both' }}
          >
            {STATUS_MESSAGES[statusIndex]}
          </p>
        </div>

        {/* Online indicator */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: TEAL,
              animation: 'vera-dot 2s infinite',
              boxShadow: `0 0 6px ${TEAL}`,
            }}
          />
          <span className="text-[9px] text-white/30 font-medium tracking-wide">en línea</span>
        </div>
      </div>

      {/* Orbiting stage cards */}
      {STAGES.map((stage, idx) => {
        const Icon = stage.icon
        const angleRad = ((stage.angle + rotation) * Math.PI) / 180
        const x = Math.cos(angleRad) * orbitRadius
        const y = Math.sin(angleRad) * orbitRadius
        const isActive = activeIdx === idx

        return (
          <div
            key={idx}
            className="absolute cursor-pointer"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              zIndex: isActive ? 10 : 1,
            }}
            onMouseEnter={() => setActiveIdx(idx)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            <div
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-2.5 w-[96px] transition-all duration-300"
              style={{
                background: isActive
                  ? `linear-gradient(145deg, ${stage.color}20, ${stage.color}08)`
                  : 'linear-gradient(145deg, #1a1c22, #111318)',
                border: `1px solid ${isActive ? stage.color + '60' : 'rgba(255,255,255,0.12)'}`,
                boxShadow: isActive
                  ? `0 8px 32px rgba(0,0,0,0.6), 0 0 20px ${stage.color}30`
                  : '0 4px 20px rgba(0,0,0,0.5)',
                transform: `scale(${isActive ? 1.1 : 1})`,
              }}
            >
              <div
                className="flex items-center justify-center w-8 h-8 rounded-xl"
                style={{
                  background: `${stage.color}18`,
                  border: `1px solid ${stage.color}50`,
                  boxShadow: `0 0 12px ${stage.color}20`,
                }}
              >
                <Icon size={15} style={{ color: stage.color }} strokeWidth={2} />
              </div>
              <p className="text-[10px] font-bold text-white/90 text-center leading-tight">
                {stage.title}
              </p>
              <p className="text-[9px] text-white/40 text-center leading-tight">
                {stage.sub}
              </p>
            </div>
          </div>
        )
      })}

      {/* Pulse ring keyframes via inline style tag */}
      <style>{`
        @keyframes pulseRingVera {
          0%   { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.35); }
        }
      `}</style>
    </div>
  )
}
