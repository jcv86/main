'use client'

import React, { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

const PROBLEMS = [
  'Aplicando a empleos que no son para ti (waste de tiempo)',
  'Atascado en un rol que no te hace feliz',
  'Buscando mentor pero no sabiendo qué preguntarle',
  'Comparándote con otros en LinkedIn',
  'Gastando energía en opciones equivocadas en lugar de en lo que te importa',
]

export default function ProblemasReveal() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(0)
  const [started, setStarted] = useState(false)

  // Trigger reveal when section enters viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Reveal problems one by one
  useEffect(() => {
    if (!started) return
    if (revealed >= PROBLEMS.length) return
    const t = setTimeout(() => setRevealed((r) => r + 1), revealed === 0 ? 300 : 650)
    return () => clearTimeout(t)
  }, [started, revealed])

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {PROBLEMS.map((_, idx) => (
          <span
            key={idx}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: idx < revealed ? 28 : 12,
              backgroundColor: idx < revealed ? 'rgb(248,113,113)' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>

      <div className="space-y-4">
        {PROBLEMS.map((problem, idx) => {
          const isVisible = idx < revealed
          return (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-full border transition-all duration-500 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
                borderColor: isVisible ? 'rgba(248,113,113,0.35)' : 'rgba(255,255,255,0.08)',
                backgroundColor: isVisible ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.02)',
                boxShadow: isVisible ? '0 0 24px rgba(248,113,113,0.12)' : 'none',
              }}
            >
              <span
                className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: isVisible ? 'rgba(248,113,113,0.18)' : 'transparent',
                  transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.5)',
                }}
              >
                <X className="h-4 w-4 text-red-400" />
              </span>
              <p className="text-foreground/80 text-left">{problem}</p>
            </div>
          )
        })}
      </div>

      {/* Closing line appears after all problems revealed */}
      <p
        className="text-center text-sm text-foreground/50 mt-8 transition-all duration-700"
        style={{
          opacity: revealed >= PROBLEMS.length ? 1 : 0,
          transform: revealed >= PROBLEMS.length ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        Suena familiar, ¿cierto? Hay una mejor forma.
      </p>
    </div>
  )
}
