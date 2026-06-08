'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Target, BookOpen, Map, Radar } from 'lucide-react'

export default function VeraCircularDiagram() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const stages = [
    {
      id: 0,
      title: 'Despega Cerebral',
      label: 'DIAGNÓSTICO',
      weeks: 'Semanas 1-2',
      position: 'bottom',
      icon: Target,
      gradient: 'from-pink-500/20 to-pink-600/10',
      border: 'border-pink-400/40',
      text: 'text-pink-300',
      description: 'Descubre quién eres realmente'
    },
    {
      id: 1,
      title: 'Tu Ruta',
      label: 'DIRECCIÓN',
      weeks: 'Semanas 3-4',
      position: 'left',
      icon: Map,
      gradient: 'from-green-500/20 to-green-600/10',
      border: 'border-green-400/40',
      text: 'text-green-300',
      description: 'Traza tu camino único'
    },
    {
      id: 2,
      title: 'Entrenamiento',
      label: 'PRÁCTICA',
      weeks: 'Semanas 5-8',
      position: 'right',
      icon: BookOpen,
      gradient: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-400/40',
      text: 'text-purple-300',
      description: 'Entrena con precisión'
    },
    {
      id: 3,
      title: 'Radar Estratégico',
      label: 'CONTEXTO',
      weeks: 'Semanas 9-12',
      position: 'top',
      icon: Radar,
      gradient: 'from-cyan-500/20 to-cyan-600/10',
      border: 'border-cyan-400/40',
      text: 'text-cyan-300',
      description: 'Contextualiza tu mercado'
    }
  ]

  const getPositionClasses = (position: string) => {
    const baseClasses = 'absolute transition-all duration-500 ease-out'
    switch (position) {
      case 'top':
        return `${baseClasses} top-0 left-1/2 -translate-x-1/2 -translate-y-full`
      case 'right':
        return `${baseClasses} right-0 top-1/2 -translate-y-1/2 translate-x-full`
      case 'bottom':
        return `${baseClasses} bottom-0 left-1/2 -translate-x-1/2 translate-y-full`
      case 'left':
        return `${baseClasses} left-0 top-1/2 -translate-y-1/2 -translate-x-full`
      default:
        return baseClasses
    }
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <style>{`
        @keyframes orbitGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(80, 160, 170, 0.4));
          }
          50% { 
            filter: drop-shadow(0 0 40px rgba(80, 160, 170, 0.8));
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulseRing {
          0% {
            r: 180;
            opacity: 0.8;
            stroke-width: 2;
          }
          100% {
            r: 220;
            opacity: 0;
            stroke-width: 1;
          }
        }

        @keyframes staggerIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .vera-orbit {
          animation: orbitGlow 3s ease-in-out infinite;
        }

        .vera-center {
          animation: float 3s ease-in-out infinite;
        }

        .vera-stage {
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .vera-stage:hover {
          transform: translateY(-8px) !important;
          filter: brightness(1.2) drop-shadow(0 15px 30px rgba(80, 160, 170, 0.3));
        }

        .vera-stage-icon {
          transition: all 0.3s ease;
        }

        .vera-stage:hover .vera-stage-icon {
          transform: scale(1.2) rotate(10deg);
        }

        .pulse-ring {
          animation: pulseRing 2s ease-out infinite;
        }
      `}</style>

      {/* Background gradient orb (optional) */}
      <div className="absolute inset-0 -top-20 -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl -z-10" />

      {/* Main diagram container */}
      <div className="relative w-full aspect-square flex items-center justify-center">
        {/* Animated SVG Background */}
        <svg className="absolute inset-0 vera-orbit" viewBox="0 0 500 500">
          <defs>
            <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(230, 126, 200, 0.6)" />
              <stop offset="25%" stopColor="rgba(147, 112, 219, 0.6)" />
              <stop offset="50%" stopColor="rgba(80, 160, 170, 0.6)" />
              <stop offset="75%" stopColor="rgba(147, 112, 219, 0.6)" />
              <stop offset="100%" stopColor="rgba(230, 126, 200, 0.6)" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Outer ring with glow */}
          <circle cx="250" cy="250" r="200" fill="none" stroke="url(#orbitGrad)" strokeWidth="3" filter="url(#glow)" opacity="0.8" />

          {/* Middle orbit line */}
          <circle
            cx="250"
            cy="250"
            r="130"
            fill="none"
            stroke="rgba(80, 160, 170, 0.15)"
            strokeWidth="1"
            strokeDasharray="8,4"
          />

          {/* Connecting lines to stages */}
          <line x1="250" y1="50" x2="250" y2="30" stroke="rgba(230, 126, 200, 0.3)" strokeWidth="2" strokeLinecap="round" />
          <line x1="250" y1="470" x2="250" y2="450" stroke="rgba(230, 126, 200, 0.3)" strokeWidth="2" strokeLinecap="round" />
          <line x1="450" y1="250" x2="470" y2="250" stroke="rgba(147, 112, 219, 0.3)" strokeWidth="2" strokeLinecap="round" />
          <line x1="30" y1="250" x2="50" y2="250" stroke="rgba(100, 200, 150, 0.3)" strokeWidth="2" strokeLinecap="round" />

          {/* Subtle pulse ring */}
          <circle cx="250" cy="250" r="180" fill="none" stroke="rgba(80, 160, 170, 0.4)" strokeWidth="2" className="pulse-ring" />
        </svg>

        {/* Stage Boxes */}
        {stages.map((stage, idx) => {
          const Icon = stage.icon
          const isHovered = hovered === idx
          return (
            <div
              key={stage.id}
              className={getPositionClasses(stage.position)}
              style={{
                width: '140px',
                animation: `staggerIn 0.6s ease-out ${0.1 + idx * 0.1}s both`,
              }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className={`vera-stage p-4 rounded-xl backdrop-blur-sm cursor-pointer group bg-gradient-to-br ${stage.gradient} border ${stage.border} hover:shadow-2xl`}>
                {/* Icon */}
                <div className="flex justify-center mb-3">
                  <div className={`p-2.5 rounded-lg bg-white/5 ${stage.text} vera-stage-icon`}>
                    <Icon size={20} />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center space-y-1">
                  <div className={`text-xs font-bold tracking-wider ${stage.text}`}>
                    {stage.label}
                  </div>
                  <div className="text-sm font-semibold text-white leading-tight">
                    {stage.title}
                  </div>
                  <div className="text-xs text-foreground/60 mt-2">
                    {stage.weeks}
                  </div>

                  {/* Expanded hover state */}
                  {isHovered && (
                    <div className="mt-2 pt-2 border-t border-white/10 text-xs text-foreground/80">
                      {stage.description}
                    </div>
                  )}
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-1 h-1 rounded-full ${stage.text.replace('text-', 'bg-')}`} />
              </div>
            </div>
          )
        })}

        {/* CENTER VERA - Enhanced */}
        <div className="absolute flex flex-col items-center gap-3 vera-center z-10">
          {/* Animated halo rings */}
          <div className="absolute w-24 h-24 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDuration: '8s', animationDirection: 'reverse' }} />
          <div className="absolute w-20 h-20 rounded-full border border-purple-400/30 animate-spin" style={{ animationDuration: '5s' }} />

          {/* Avatar circle - Enhanced gradient */}
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl z-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/40 via-purple-400/30 to-pink-400/20 blur-xl" />
            <div
              className="relative w-full h-full rounded-full flex items-center justify-center border-2 backdrop-blur-md"
              style={{
                borderImage: 'linear-gradient(135deg, rgba(80, 160, 170, 1), rgba(147, 112, 219, 1)) 1',
                background: 'linear-gradient(135deg, rgba(80, 160, 170, 0.2), rgba(147, 112, 219, 0.2))',
              }}
            >
              <span className="text-4xl animate-pulse">✨</span>
            </div>
          </div>

          {/* Label - Enhanced typography */}
          <div className="text-center">
            <div className="text-xs font-black tracking-widest bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              TU COACH
            </div>
            <div className="text-xs font-black tracking-widest bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              IA 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Bottom metrics - Responsive */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 px-4 md:px-0">
        {[
          { value: '4', label: 'etapas' },
          { value: '30', label: 'días' },
          { value: '24/7', label: 'Vera' },
          { value: '100%', label: 'desde ti' },
        ].map((metric, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border border-white/10 text-center backdrop-blur-sm hover:border-cyan-400/50 transition-colors"
            style={{
              background: 'rgba(80, 160, 170, 0.05)',
            }}
          >
            <div className="text-sm font-bold text-cyan-400">{metric.value}</div>
            <div className="text-xs text-foreground/60">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
