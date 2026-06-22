'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

const COLUMNS = ['DTC', 'Test estándar', 'Bolsa de empleos', 'Coach suelto'] as const

const ROWS: { feature: string; values: [boolean, boolean, boolean, boolean] }[] = [
  { feature: 'Comienza desde ti (no desde vacantes)', values: [true, false, false, true] },
  { feature: 'IA + Humano', values: [true, false, false, false] },
  { feature: 'Ruta clara de 90 días', values: [true, false, false, true] },
  { feature: 'CV ATS armado', values: [true, false, false, false] },
  { feature: 'Garantía 7 días', values: [true, false, false, false] },
  { feature: 'Transparencia de precios', values: [true, true, true, false] },
]

function Cell({ on, highlight, delay, visible }: { on: boolean; highlight?: boolean; delay: number; visible: boolean }) {
  return (
    <div
      className="flex items-center justify-center transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.5)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {on ? (
        <span
          className="flex items-center justify-center h-7 w-7 rounded-full"
          style={{
            backgroundColor: highlight ? 'rgba(45,212,191,0.18)' : 'rgba(45,212,191,0.08)',
          }}
        >
          <Check className={`h-4 w-4 ${highlight ? 'text-teal-300' : 'text-teal-400/80'}`} strokeWidth={3} />
        </span>
      ) : (
        <span className="flex items-center justify-center h-7 w-7 rounded-full bg-white/[0.03]">
          <X className="h-4 w-4 text-foreground/25" strokeWidth={2.5} />
        </span>
      )}
    </div>
  )
}

export default function ComparisonTable() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top >= window.innerHeight) setVisible(false)
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="max-w-4xl mx-auto">
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1.6fr_repeat(4,1fr)] items-stretch border-b border-white/10">
          <div className="py-5 px-5 text-xs uppercase tracking-wider text-foreground/50 flex items-end">
            Característica
          </div>
          {COLUMNS.map((col, i) => (
            <div
              key={col}
              className={`py-5 px-2 text-center text-sm font-semibold flex flex-col items-center justify-end gap-1 transition-colors ${
                i === 0 ? 'text-teal-300' : 'text-foreground/55'
              }`}
              style={
                i === 0
                  ? {
                      background: 'linear-gradient(to bottom, rgba(45,212,191,0.12), rgba(45,212,191,0.02))',
                    }
                  : undefined
              }
            >
              {i === 0 && <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />}
              {col}
            </div>
          ))}
        </div>

        {/* Rows */}
        {ROWS.map((row, rowIdx) => (
          <div
            key={row.feature}
            className="grid grid-cols-[1.6fr_repeat(4,1fr)] items-center border-b border-white/[0.06] last:border-0 transition-colors hover:bg-white/[0.03] group"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              transitionDelay: `${rowIdx * 90}ms`,
            }}
          >
            <div className="py-4 px-5 text-sm text-foreground/80 group-hover:text-foreground transition-colors">
              {row.feature}
            </div>
            {row.values.map((val, colIdx) => (
              <div
                key={colIdx}
                className="py-4 px-2"
                style={
                  colIdx === 0
                    ? { background: 'linear-gradient(to bottom, rgba(45,212,191,0.06), rgba(45,212,191,0.06))' }
                    : undefined
                }
              >
                <Cell on={val} highlight={colIdx === 0} delay={rowIdx * 90 + colIdx * 60} visible={visible} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
