'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Cómo funciona', href: '/como-funciona' },
    { label: 'Para Empresas', href: '/para-empresas' },
    { label: 'Precios', href: '#precios' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b bg-black/90 backdrop-blur-md border-white/[0.08]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-black font-bold text-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'rgb(80, 160, 170)' }}
            >
              D
            </div>
            <span className="font-semibold text-sm text-white/90 hidden sm:block">
              Despega<span style={{ color: 'rgb(80, 160, 170)' }}>TuCarrera</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2 rounded-lg"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ backgroundColor: 'rgb(80, 160, 170)' }}
            >
              Comenzar gratis
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-black/95 backdrop-blur-md">
          <nav className="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-white transition-colors py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-2 border-t border-white/[0.08]">
              <Link
                href="/auth/signin"
                className="text-sm text-center text-white/70 border border-white/20 rounded-lg py-2.5 hover:bg-white/5 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/signin"
                className="text-sm text-center font-semibold text-black rounded-full py-2.5 transition-all hover:opacity-90"
                style={{ backgroundColor: 'rgb(80, 160, 170)' }}
              >
                Comenzar gratis
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
