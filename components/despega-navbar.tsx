'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import useSWR from 'swr'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  ChevronDown,
  Home,
  CheckCircle2,
  MapPin,
  Zap,
  Radar,
  LogOut,
  User,
  Settings
} from 'lucide-react'

interface XPData {
  total_xp: number
  current_level: number
  xp_to_next_level: number
  daily_streak: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const stages = [
  {
    name: 'Información',
    phase: 'info',
    icon: Home,
    routes: [
      { label: 'Bienvenida', href: '/despega/bienvenida' },
      { label: 'Dashboard', href: '/despega' },
    ]
  },
  {
    name: 'El Ritual',
    phase: 'ritual',
    icon: CheckCircle2,
    routes: [
      { label: 'Inicia Tu Jornada', href: '/despega/conozcamonos-1' },
      { label: 'Descubre Tu Potencial', href: '/despega/a1-cerebral-intro' },
      { label: 'Identifica Tu Estilo', href: '/despega/a1-cerebral' },
      { label: 'Tu Análisis Personal', href: '/despega/a1-report' },
    ]
  },
  {
    name: 'Exploración',
    phase: 'exploration',
    icon: MapPin,
    routes: [
      { label: 'Define Tus Objetivos', href: '/despega/conozcamonos-2' },
      { label: 'Tu Ruta Personalizada', href: '/despega/a2-routes' },
    ]
  },
  {
    name: 'Entrenamiento',
    phase: 'training',
    icon: Zap,
    routes: [
      { label: 'Prepárate para Entrevistas', href: '/despega/a3-intro' },
      { label: 'Entrenamientos y Feedback', href: '/despega/a3' },
    ]
  },
  {
    name: 'La Realidad',
    phase: 'reality',
    icon: Radar,
    routes: [
      { label: 'Contexto del Mercado', href: '/despega/a4-intro' },
      { label: 'Tu Dashboard Ejecutivo', href: '/despega/a4' },
    ]
  },
]

// Per brandbook pillar colors — all classes must be static strings (no template interpolation) for Tailwind purge
const phaseStyles: Record<string, {
  text: string; border: string; leftBorder: string; bg: string
  activeBg: string; activeText: string
  pillBg: string; pillText: string
  hoverBg: string; hoverText: string
}> = {
  ritual:      { text: 'text-purple',           border: 'border-purple/30',  leftBorder: 'border-l-4 border-l-purple',   bg: 'bg-purple/10',  activeBg: 'bg-purple/20',   activeText: 'text-purple',  pillBg: 'bg-purple',  pillText: 'text-white', hoverBg: 'hover:bg-purple/10',  hoverText: 'hover:text-purple'  },
  exploration: { text: 'text-blue',             border: 'border-blue/30',    leftBorder: 'border-l-4 border-l-blue',     bg: 'bg-blue/10',    activeBg: 'bg-blue/20',     activeText: 'text-blue',    pillBg: 'bg-blue',    pillText: 'text-white', hoverBg: 'hover:bg-blue/10',    hoverText: 'hover:text-blue'    },
  training:    { text: 'text-orange',           border: 'border-orange/30',  leftBorder: 'border-l-4 border-l-orange',   bg: 'bg-orange/10',  activeBg: 'bg-orange/20',   activeText: 'text-orange',  pillBg: 'bg-orange',  pillText: 'text-white', hoverBg: 'hover:bg-orange/10',  hoverText: 'hover:text-orange'  },
  reality:     { text: 'text-red',              border: 'border-red/30',     leftBorder: 'border-l-4 border-l-red',      bg: 'bg-red/10',     activeBg: 'bg-red/20',      activeText: 'text-red',     pillBg: 'bg-red',     pillText: 'text-white', hoverBg: 'hover:bg-red/10',     hoverText: 'hover:text-red'     },
  info:        { text: 'text-white/60',         border: 'border-white/10',   leftBorder: 'border-l-4 border-l-white/20', bg: 'bg-white/5',    activeBg: 'bg-white/10',    activeText: 'text-white',   pillBg: 'bg-white/10',pillText: 'text-white', hoverBg: 'hover:bg-white/5',    hoverText: 'hover:text-white'   },
}

export function DespegaNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedStage, setExpandedStage] = useState<string | null>(null)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  
  const { user } = useAuthRedirect()

  const { data: xpData, isLoading: xpLoading } = useSWR<XPData>(
    '/api/gamification/global',
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 5000,
      dedupingInterval: 2000,
    }
  )

  const getCurrentPhase = () => {
    if (pathname.includes('conozcamonos-1') || pathname.includes('a1-cerebral') || pathname.includes('a1-report')) return 'ritual'
    if (pathname.includes('conozcamonos-2') || pathname.includes('a2-')) return 'exploration'
    if (pathname.includes('a3-') || pathname.includes('interview')) return 'training'
    if (pathname.includes('a4-') || pathname === '/despega/a4') return 'reality'
    return null
  }

  const currentPhase = getCurrentPhase()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null)
    setIsOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/auth/signin')
  }

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-0.5" ref={dropdownRef}>
            <Link href="/despega">
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm ${
                  pathname === '/despega'
                    ? 'text-white bg-white/10'
                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                }`}
              >
                Dashboard
              </Button>
            </Link>

            {stages.map((stage) => {
              const style = phaseStyles[stage.phase]
              const isActivePhase = currentPhase === stage.phase
              const isOpen = openDropdown === stage.name
              const hasActiveRoute = stage.routes.some(r => pathname === r.href)

              return (
                <div key={stage.name} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : stage.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                      hasActiveRoute || isActivePhase
                        ? `${style.pillBg} ${style.pillText}`
                        : `${style.text} hover:bg-white/5`
                    }`}
                  >
                    <stage.icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{stage.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown — solid bg, left-border accent, no heavy colored header */}
                  {isOpen && (
                    <div className={`absolute left-0 top-full mt-2 w-56 rounded-xl border shadow-2xl z-[9999] overflow-hidden bg-[#0a0a0a] ${style.border}`}>
                      {/* Minimal label */}
                      <div className="px-4 pt-3 pb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.15em] ${style.text}`}>{stage.name}</span>
                      </div>
                      <div className="px-2 pb-2 space-y-0.5">
                        {stage.routes.map((route) => {
                          const isActive = pathname === route.href
                          return (
                            <Link key={route.href} href={route.href} className="no-underline">
                              <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap no-underline ${
                                isActive
                                  ? `${style.activeBg} ${style.activeText}`
                                  : `text-white/60 ${style.hoverBg} ${style.hoverText}`
                              }`}>
                                {isActive && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current" />}
                                {route.label}
                              </div>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Desktop right side — Profile Menu */}
          <div ref={profileRef} className="hidden md:flex items-center gap-4 relative">
            {/* Profile Button */}
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex flex-col items-end gap-0.5">
                {!xpLoading && xpData && (
                  <>
                    <span className="text-xs font-bold text-white">L{xpData.current_level}</span>
                    <span className="text-[10px] text-white/60">{(xpData.total_xp / 1000).toFixed(1)}k XP</span>
                  </>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue/40 to-purple/40 border border-white/20 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white/80" />
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl z-[9999] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue/40 to-purple/40 border border-white/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-white/80" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}</p>
                      {!xpLoading && xpData && (
                        <p className="text-xs text-white/60">Lvl {xpData.current_level}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-2 py-2 space-y-1">
                  {/* XP & Stats */}
                  {!xpLoading && xpData && (
                    <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-xs text-white/60 mb-1">Estadísticas</div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/70">XP Total</span>
                          <span className="font-semibold text-white">{(xpData.total_xp / 1000).toFixed(1)}k</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/70">Racha</span>
                          <span className="font-semibold text-orange-400">{xpData.daily_streak} días</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Menu Items */}
                  <Link href="/despega/progress" onClick={() => setProfileOpen(false)}>
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                      <Zap className="w-4 h-4" />
                      Mi Progreso
                    </div>
                  </Link>

                  <Link href="/despega/settings" onClick={() => setProfileOpen(false)}>
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                      <Settings className="w-4 h-4" />
                      Preferencias
                    </div>
                  </Link>
                </div>

                <div className="px-2 py-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setProfileOpen(false)
                      handleLogout()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Salir
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <button
            className="md:hidden text-white/60 hover:text-white p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 max-h-[80vh] overflow-y-auto border-t border-white/10 pt-3">
            <Link href="/despega">
              <Button variant="ghost" size="sm" className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5">
                Dashboard
              </Button>
            </Link>

            {stages.map((stage) => {
              const style = phaseStyles[stage.phase]
              const isActivePhase = currentPhase === stage.phase

              return (
                <div key={stage.name}>
                  <button
                    onClick={() => setExpandedStage(expandedStage === stage.name ? null : stage.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      isActivePhase ? `${style.pillBg} ${style.pillText}` : `${style.text} hover:bg-white/5`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <stage.icon className="w-4 h-4" />
                      {stage.name}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedStage === stage.name ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedStage === stage.name && (
                    <div className={`ml-4 mt-1 rounded-lg border overflow-hidden ${style.border}`}>
                      {stage.routes.map((route) => {
                        const isActive = pathname === route.href
                        return (
                          <Link key={route.href} href={route.href} onClick={() => setIsOpen(false)}>
                            <div className={`px-3 py-2.5 text-sm transition-colors ${
                              isActive
                                ? `${style.activeBg} ${style.activeText} font-semibold`
                                : `text-white/60 hover:text-white hover:${style.bg}`
                            }`}>
                              {route.label}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Mobile Profile Section */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-white/60 mb-1">Tu Nombre</p>
                <p className="text-sm font-semibold text-white truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'}</p>
              </div>

              {!xpLoading && xpData && (
                <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-white/60 mb-1">Tu Nivel</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">Nivel {xpData.current_level}</span>
                      <span className="font-semibold text-white">{(xpData.total_xp / 1000).toFixed(1)}k XP</span>
                    </div>
                  </div>
                </div>
              )}

              <Link href="/despega/progress">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/5">
                  <Zap className="w-4 h-4" />
                  Mi Progreso
                </Button>
              </Link>

              <Link href="/despega/settings">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/5">
                  <Settings className="w-4 h-4" />
                  Preferencias
                </Button>
              </Link>

              <Button
                onClick={() => {
                  setIsOpen(false)
                  handleLogout()
                }}
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 border-white/20 text-red-400/80 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
