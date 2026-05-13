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
// Note: Ritual now uses the custom ritual color variable to match navbar branding
const phaseStyles: Record<string, {
  text: string; border: string; leftBorder: string; bg: string
  activeBg: string; activeText: string
  pillBg: string; pillText: string
  hoverBg: string; hoverText: string
}> = {
  ritual:      { text: 'text-ritual',         border: 'border-ritual/30',  leftBorder: 'border-l-4 border-l-ritual',   bg: 'bg-ritual/10',  activeBg: 'bg-ritual/20',   activeText: 'text-ritual',  pillBg: 'bg-ritual',  pillText: 'text-white', hoverBg: 'hover:bg-ritual/10',  hoverText: 'hover:text-ritual'  },
  exploration: { text: 'text-exploration',        border: 'border-exploration/30',    leftBorder: 'border-l-4 border-l-exploration',     bg: 'bg-exploration/10',    activeBg: 'bg-exploration/20',     activeText: 'text-exploration',    pillBg: 'bg-exploration',    pillText: 'text-white', hoverBg: 'hover:bg-exploration/10',    hoverText: 'hover:text-exploration'    },
  training:    { text: 'text-training',       border: 'border-training/30',  leftBorder: 'border-l-4 border-l-training',   bg: 'bg-training/10',  activeBg: 'bg-training/20',   activeText: 'text-training',  pillBg: 'bg-training',  pillText: 'text-white', hoverBg: 'hover:bg-training/10',  hoverText: 'hover:text-training'  },
  reality:     { text: 'text-reality',        border: 'border-reality/30',    leftBorder: 'border-l-4 border-l-reality',     bg: 'bg-reality/10',    activeBg: 'bg-reality/20',     activeText: 'text-reality',    pillBg: 'bg-reality',    pillText: 'text-white', hoverBg: 'hover:bg-reality/10',    hoverText: 'hover:text-reality'    },
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
  
  // Check if this is a demo user
  const isDemoUser = typeof window !== 'undefined' ? localStorage.getItem('demo_user') !== null : false

  // Only fetch XP data for real authenticated users, not demo users
  const { data: xpData, isLoading: xpLoading } = useSWR<XPData>(
    isDemoUser ? null : '/api/gamification/global',
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
    if (pathname.includes('a3-') || pathname.includes('interview') || pathname === '/despega/a3') return 'training'
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
    // Clear demo user from localStorage if exists
    localStorage.removeItem('demo_user')
    document.cookie = 'demo_user=; path=/; max-age=0'
    
    // Try to sign out from Supabase if there's a real session
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch (err) {
      console.error('[v0] Error signing out:', err)
    }
    
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

              // Custom colors for each phase
              const phaseColors: Record<string, string> = {
                ritual: 'rgb(80, 160, 170)',      // teal
                exploration: 'rgb(90, 90, 150)',   // deep purple
                training: 'rgb(170, 70, 170)',     // magenta
                reality: 'rgb(225, 120, 130)',     // salmon rose
                info: 'currentColor'
              }

              return (
                <div key={stage.name} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : stage.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 hover:bg-white/5"
                    style={{ 
                      color: isActivePhase || hasActiveRoute ? phaseColors[stage.phase] : 'white',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActivePhase && !hasActiveRoute) {
                        e.currentTarget.style.color = phaseColors[stage.phase]
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActivePhase && !hasActiveRoute) {
                        e.currentTarget.style.color = 'white'
                      }
                    }}
                  >
                    <stage.icon 
                      className="w-3.5 h-3.5 flex-shrink-0" 
                      style={{ 
                        color: isActivePhase || hasActiveRoute ? phaseColors[stage.phase] : 'white',
                        transition: 'color 0.15s'
                      }} 
                    />
                    <span>{stage.name}</span>
                    <ChevronDown 
                      className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} 
                      style={{ 
                        color: isActivePhase || hasActiveRoute ? phaseColors[stage.phase] : 'white',
                        transition: 'color 0.15s'
                      }} 
                    />
                  </button>

                  {/* Dropdown — solid bg, left-border accent, no heavy colored header */}
                  {isOpen && (
                    <div className={`absolute left-0 top-full mt-2 w-56 rounded-xl border shadow-2xl z-[9999] overflow-hidden bg-[#0a0a0a] ${style.border}`}>
                      <div className="px-2 pb-2 space-y-0.5">
                        {stage.routes.map((route) => {
                          // Only mark as active if this stage's dropdown is open AND the route matches
                          // OR if we're truly on this route
                          const isActive = pathname === route.href
                          if (isActive) {
                            console.log(`[v0] ACTIVE ROUTE DETECTED: stage="${stage.name}" route="${route.label}" href="${route.href}" matches pathname="${pathname}"`)
                          }
                          
                          // Get phase-specific colors for hover highlighting
                          const pillColors: Record<string, string> = {
                            ritual: 'rgba(80, 160, 170, 0.3)',
                            exploration: 'rgba(90, 90, 150, 0.3)',
                            training: 'rgba(170, 70, 170, 0.3)',
                            reality: 'rgba(225, 120, 130, 0.3)',
                          }
                          
                          const textColors: Record<string, string> = {
                            ritual: 'rgb(80, 160, 170)',
                            exploration: 'rgb(90, 90, 150)',
                            training: 'rgb(170, 70, 170)',
                            reality: 'rgb(225, 120, 130)',
                          }
                          
                          return (
                            <Link key={route.href} href={route.href} className="no-underline">
                              <div 
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap no-underline text-white/60"
                                style={{
                                  borderColor: textColors[stage.phase] || 'currentColor',
                                } as React.CSSProperties & Record<string, any>}
                                onMouseEnter={(e) => {
                                  const el = e.currentTarget as HTMLElement
                                  el.style.backgroundColor = pillColors[stage.phase] || 'transparent'
                                  el.style.color = textColors[stage.phase] || 'currentColor'
                                  el.style.borderStyle = 'solid'
                                  el.style.borderWidth = '1px'
                                }}
                                onMouseLeave={(e) => {
                                  const el = e.currentTarget as HTMLElement
                                  el.style.backgroundColor = 'transparent'
                                  el.style.color = ''
                                  el.style.borderStyle = ''
                                  el.style.borderWidth = ''
                                }}
                              >
                                {isActive && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-current" style={{ backgroundColor: textColors[stage.phase] }} />}
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
              <div 
                className="w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)', border: 'none' }}
              >
                <User className="w-4 h-4 text-white/80" />
              </div>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl z-[9999] overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)', border: 'none' }}
                    >
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
                  <Link href="/despega/profile" onClick={() => setProfileOpen(false)}>
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                      <User className="w-4 h-4" />
                      Mi Perfil
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

              <Link href="/despega/profile">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-white/60 hover:text-white hover:bg-white/5">
                  <User className="w-4 h-4" />
                  Mi Perfil
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
