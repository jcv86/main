'use client'

import React, { useState, useEffect } from 'react'

export default function VeraCircularDiagram() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-square flex items-center justify-center">
      <style>{`
        @keyframes rotateGradient {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromBottom {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromLeft {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .vera-box-top {
          animation: slideInFromTop 0.8s ease-out 0.2s both;
        }
        
        .vera-box-right {
          animation: slideInFromRight 0.8s ease-out 0.4s both;
        }
        
        .vera-box-bottom {
          animation: slideInFromBottom 0.8s ease-out 0.6s both;
        }
        
        .vera-box-left {
          animation: slideInFromLeft 0.8s ease-out 0.8s both;
        }
      `}</style>

      {/* Outer rotating circle with gradient border */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 400 400"
        style={{
          filter: 'drop-shadow(0 0 40px rgba(80, 160, 170, 0.2))',
        }}
      >
        <defs>
          <linearGradient
            id="circleGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
            gradientTransform={`rotate(${rotation})`}
          >
            <stop offset="0%" stopColor="rgba(230, 126, 200, 0.6)" />
            <stop offset="33%" stopColor="rgba(147, 112, 219, 0.6)" />
            <stop offset="66%" stopColor="rgba(80, 160, 170, 0.6)" />
            <stop offset="100%" stopColor="rgba(230, 126, 200, 0.6)" />
          </linearGradient>
        </defs>

        {/* Outer circle */}
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="url(#circleGradient)"
          strokeWidth="3"
        />

        {/* Inner circle (subtle) */}
        <circle
          cx="200"
          cy="200"
          r="100"
          fill="none"
          stroke="rgba(80, 160, 170, 0.1)"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
      </svg>

      {/* TOP: Radar Estratégico */}
      <div className="vera-box-top absolute top-0 transform -translate-y-full -translate-x-1/2 left-1/2 w-32">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(80, 160, 170, 0.1)', border: '1px solid rgba(80, 160, 170, 0.3)' }}>
          <div className="text-xs font-semibold text-cyan-400 mb-1">Radar Estratégico</div>
          <div className="text-[10px] text-foreground/60">Weeks 9-12</div>
        </div>
      </div>

      {/* RIGHT: Entrenamiento */}
      <div className="vera-box-right absolute right-0 transform translate-x-full top-1/2 -translate-y-1/2 w-32">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(147, 112, 219, 0.1)', border: '1px solid rgba(147, 112, 219, 0.3)' }}>
          <div className="text-xs font-semibold text-purple-400 mb-1">Entrenamiento</div>
          <div className="text-[10px] text-foreground/60">Weeks 5-8</div>
        </div>
      </div>

      {/* BOTTOM: Despega Cerebral */}
      <div className="vera-box-bottom absolute bottom-0 transform translate-y-full -translate-x-1/2 left-1/2 w-32">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(230, 126, 200, 0.1)', border: '1px solid rgba(230, 126, 200, 0.3)' }}>
          <div className="text-xs font-semibold text-pink-400 mb-1">Despega Cerebral</div>
          <div className="text-[10px] text-foreground/60">Weeks 1-2</div>
        </div>
      </div>

      {/* LEFT: Tu Ruta */}
      <div className="vera-box-left absolute left-0 transform -translate-x-full top-1/2 -translate-y-1/2 w-32">
        <div className="p-3 rounded-lg text-center" style={{ backgroundColor: 'rgba(100, 200, 150, 0.1)', border: '1px solid rgba(100, 200, 150, 0.3)' }}>
          <div className="text-xs font-semibold text-green-400 mb-1">Tu Ruta</div>
          <div className="text-[10px] text-foreground/60">Weeks 3-4</div>
        </div>
      </div>

      {/* CENTER: Vera Avatar */}
      <div className="absolute flex flex-col items-center gap-2">
        {/* Avatar circle */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(80, 160, 170, 0.3) 0%, rgba(147, 112, 219, 0.3) 100%)',
            border: '2px solid rgba(80, 160, 170, 0.6)',
          }}
        >
          <div className="text-3xl">✨</div>
        </div>

        {/* Label */}
        <div className="text-center">
          <div className="text-xs font-bold text-cyan-400 tracking-wide">TU COACH</div>
          <div className="text-xs font-bold text-cyan-400 tracking-wide">IA</div>
        </div>
      </div>

      {/* Animated lines connecting center to boxes */}
      <svg className="absolute w-full h-full" viewBox="0 0 400 400" pointerEvents="none">
        {/* Top line */}
        <line
          x1="200"
          y1="100"
          x2="200"
          y2="40"
          stroke="rgba(80, 160, 170, 0.2)"
          strokeWidth="1"
        />
        {/* Right line */}
        <line
          x1="290"
          y1="200"
          x2="350"
          y2="200"
          stroke="rgba(147, 112, 219, 0.2)"
          strokeWidth="1"
        />
        {/* Bottom line */}
        <line
          x1="200"
          y1="300"
          x2="200"
          y2="360"
          stroke="rgba(230, 126, 200, 0.2)"
          strokeWidth="1"
        />
        {/* Left line */}
        <line
          x1="110"
          y1="200"
          x2="50"
          y2="200"
          stroke="rgba(100, 200, 150, 0.2)"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}
