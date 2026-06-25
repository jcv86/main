'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X } from 'lucide-react'
import { COLORS, GRADIENT, GRADIENT_BTN, ROUTES } from './theme'

const LINKS = [
  { label: 'Pruébalo', href: '#perfil-vivo' },
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Empleo', href: ROUTES.empleo },
  { label: 'Instituciones', href: ROUTES.instituciones },
  { label: 'Preguntas', href: '#preguntas' },
]

export default function DtcNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docH > 0 ? (y / docH) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
        <div
          className="h-full transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%`, background: GRADIENT }}
        />
      </div>

      <header
        className="fixed top-[3px] left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(5,6,14,0.82)' : 'rgba(5,6,14,0.35)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: scrolled ? `1px solid ${COLORS.border}` : '1px solid transparent',
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-[#05060e] text-lg"
              style={{ background: GRADIENT }}
            >
              D
            </span>
            <span className="text-[15px] leading-tight font-semibold text-white">
              Despega<span className="block text-[11px] font-normal" style={{ color: COLORS.textMuted }}>TuCarrera</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm transition-colors hover:text-white"
                style={{ color: COLORS.textMuted }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={ROUTES.pruebaEnVivo}
              className="text-sm font-medium px-3 py-2 rounded-lg transition-colors hover:text-white"
              style={{ color: COLORS.text }}
            >
              Pruébalo en vivo
            </Link>
            <Link
              href={ROUTES.diagnostico}
              className="group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#05060e] transition-transform hover:scale-[1.03]"
              style={{ background: GRADIENT_BTN }}
            >
              Comenzar mi diagnóstico
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex items-center justify-center h-10 w-10 rounded-lg border"
            style={{ borderColor: COLORS.border, color: COLORS.text }}
            aria-label="Abrir menú"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div
            className="lg:hidden border-t px-4 py-4 space-y-1"
            style={{ borderColor: COLORS.border, background: 'rgba(5,6,14,0.96)' }}
          >
            {LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
                style={{ color: COLORS.textMuted }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={ROUTES.diagnostico}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#05060e]"
              style={{ background: GRADIENT_BTN }}
            >
              Comenzar mi diagnóstico
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </header>
    </>
  )
}
