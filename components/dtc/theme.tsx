'use client'

import React, { useEffect, useRef, useState } from 'react'

/* ============================================================
   DTC Landing — Shared design system (replica of dtc-home-v10)
   ============================================================ */

export const COLORS = {
  bg: '#05060e',
  bgAlt: '#080a16',
  text: '#eceefb',
  textMuted: 'rgba(236,238,251,0.62)',
  textFaint: 'rgba(236,238,251,0.42)',
  purple: '#7c5cff',
  blue: '#3fa9ff',
  teal: '#36e0c0',
  border: 'rgba(255,255,255,0.08)',
  cardBg: 'rgba(255,255,255,0.025)',
}

export const GRADIENT = `linear-gradient(100deg, ${COLORS.purple}, ${COLORS.blue} 55%, ${COLORS.teal})`
export const GRADIENT_BTN = `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.blue})`

/* Routes used by all CTAs */
export const ROUTES = {
  diagnostico: '/comenzar',
  pruebaEnVivo: '/demo',
  empleo: '/careers',
  instituciones: '/convenios-universidades',
  preguntas: '/faq',
}

/* Gradient text helper */
export function GradientText({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={className}
      style={{
        backgroundImage: GRADIENT,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  )
}

/* Small uppercase eyebrow label */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-bold uppercase mb-4"
      style={{ letterSpacing: '0.22em', color: COLORS.teal }}
    >
      {children}
    </p>
  )
}

/* Scroll reveal wrapper — starts visible if already in viewport */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  as?: any
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top >= window.innerHeight) setShown(false)
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -50px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}

/* Animated constellation background — fixed, behind everything */
export function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    type P = { x: number; y: number; vx: number; vy: number }
    let points: P[] = []

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * DPR
      canvas.height = h * DPR
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      const count = Math.min(90, Math.floor((w * h) / 18000))
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }))
    }

    function draw() {
      ctx.clearRect(0, 0, w, h)
      for (const p of points) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }
      // lines
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i]
          const b = points[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            const op = (1 - dist / 130) * 0.18
            ctx.strokeStyle = `rgba(124,124,255,${op})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      // dots
      for (const p of points) {
        ctx.fillStyle = 'rgba(160,180,255,0.55)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }

    resize()
    if (!reduceMotion) {
      draw()
    } else {
      // static single frame
      draw()
      cancelAnimationFrame(raf)
    }
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10"
      style={{
        background: `radial-gradient(1200px 700px at 70% -10%, rgba(124,92,255,0.16), transparent 60%), radial-gradient(900px 600px at 10% 20%, rgba(63,169,255,0.10), transparent 55%), ${COLORS.bg}`,
      }}
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
    </div>
  )
}
