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
    let t = 0
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    type P = { x: number; y: number; vx: number; vy: number }
    // Twinkling star: r = radius, tw = twinkle speed, ph = phase, hue tint
    type Star = { x: number; y: number; r: number; tw: number; ph: number; base: number; tint: string }
    // Shooting star
    type Shot = { x: number; y: number; vx: number; vy: number; life: number; len: number }

    let points: P[] = []
    let stars: Star[] = []
    let shots: Shot[] = []
    let nextShot = 0

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const TINTS = ['255,255,255', '186,201,255', '198,244,236', '214,197,255']

    function resize() {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * DPR
      canvas.height = h * DPR
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

      // constellation nodes (kept subtle)
      const count = Math.min(70, Math.floor((w * h) / 24000))
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
      }))

      // twinkling starfield (denser, multi-depth)
      const starCount = Math.min(320, Math.floor((w * h) / 5200))
      stars = Array.from({ length: starCount }, () => {
        const depth = Math.random()
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: depth * 1.5 + 0.4,
          tw: Math.random() * 1.8 + 0.4,
          ph: Math.random() * Math.PI * 2,
          base: depth * 0.55 + 0.45,
          tint: TINTS[Math.floor(Math.random() * TINTS.length)],
        }
      })
    }

    function spawnShot() {
      const fromLeft = Math.random() > 0.5
      const startX = fromLeft ? Math.random() * w * 0.4 : w * 0.6 + Math.random() * w * 0.4
      const speed = Math.random() * 5 + 6
      const angle = (Math.random() * 0.4 + 0.15) * (fromLeft ? 1 : -1)
      shots.push({
        x: startX,
        y: Math.random() * h * 0.4,
        vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1),
        vy: Math.sin(Math.abs(angle) + 0.2) * speed,
        life: 1,
        len: Math.random() * 80 + 90,
      })
    }

    function draw() {
      t += 0.016
      ctx.clearRect(0, 0, w, h)

      // ---- twinkling stars ----
      for (const s of stars) {
        const tw = reduceMotion ? 0.8 : 0.65 + 0.35 * Math.sin(t * s.tw + s.ph)
        const op = Math.max(0, Math.min(1, s.base * tw))
        ctx.fillStyle = `rgba(${s.tint},${op})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        // soft glow for the brighter stars
        if (s.r > 1.1) {
          ctx.fillStyle = `rgba(${s.tint},${op * 0.12})`
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ---- constellation network ----
      for (const p of points) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i]
          const b = points[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 130) {
            const op = (1 - dist / 130) * 0.14
            ctx.strokeStyle = `rgba(124,124,255,${op})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      for (const p of points) {
        ctx.fillStyle = 'rgba(160,180,255,0.4)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2)
        ctx.fill()
      }

      // ---- shooting stars ----
      if (!reduceMotion) {
        if (t > nextShot) {
          nextShot = t + Math.random() * 6 + 4
          spawnShot()
        }
        for (const sh of shots) {
          sh.x += sh.vx
          sh.y += sh.vy
          sh.life -= 0.012
          const tailX = sh.x - (sh.vx / Math.hypot(sh.vx, sh.vy)) * sh.len
          const tailY = sh.y - (sh.vy / Math.hypot(sh.vx, sh.vy)) * sh.len
          const grad = ctx.createLinearGradient(sh.x, sh.y, tailX, tailY)
          grad.addColorStop(0, `rgba(255,255,255,${Math.max(0, sh.life)})`)
          grad.addColorStop(0.4, `rgba(120,190,255,${Math.max(0, sh.life) * 0.5})`)
          grad.addColorStop(1, 'rgba(120,190,255,0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.6
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(sh.x, sh.y)
          ctx.lineTo(tailX, tailY)
          ctx.stroke()
        }
        shots = shots.filter((s) => s.life > 0 && s.y < h + 50 && s.x > -50 && s.x < w + 50)
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    if (reduceMotion) {
      draw()
      cancelAnimationFrame(raf)
    } else {
      draw()
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
      <canvas ref={canvasRef} className="h-full w-full opacity-90" />
    </div>
  )
}
