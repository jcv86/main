'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
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
  LogOut
} from 'lucide-react'
import { XPNavbarBadge } from './xp-navbar-badge'

const stages = [
  {
    name: 'Información',
    icon: Home,
    routes: [
      { label: 'Bienvenida', href: '/despega/bienvenida' },
      { label: 'Dashboard', href: '/despega' },
    ]
  },
  {
    name: 'El Ritual',
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
    icon: MapPin,
    routes: [
      { label: 'Define Tus Objetivos', href: '/despega/conozcamonos-2' },
      { label: 'Tu Ruta Personalizada', href: '/despega/a2-routes' },
    ]
  },
  {
    name: 'Entrenamiento',
    icon: Zap,
    routes: [
      { label: 'Prepárate para Entrevistas', href: '/despega/a3-intro' },
      { label: 'Entrenamientos y Feedback', href: '/despega/a3-dashboard' },
    ]
  },
  {
    name: 'La Realidad',
    icon: Radar,
    routes: [
      { label: 'Contexto del Mercado', href: '/despega/a4-intro' },
      { label: 'Tu Dashboard Ejecutivo', href: '/despega/a4' },
    ]
  },
]

export function DespeganNavbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedStage, setExpandedStage] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Determine current phase for progress indicator
  const getCurrentPhase = () => {
    if (pathname.includes('conozcamonos') || pathname.includes('a1-cerebral') || pathname.includes('a1-report')) return 'ritual'
    if (pathname.includes('conozcamonos-2') || pathname.includes('a2-')) return 'exploration'
    if (pathname.includes('a3-') || pathname.includes('interview')) return 'training'
    if (pathname.includes('a4-') || pathname === '/despega/a4') return 'reality'
    return null
  }

  const currentPhase = getCurrentPhase()

  const phaseOrder = [
    { key: 'ritual', label: 'El Ritual', color: 'bg-purple' },
    { key: 'exploration', label: 'Exploración', color: 'bg-blue' },
    { key: 'training', label: 'Entrenamiento', color: 'bg-orange' },
    { key: 'reality', label: 'La Realidad', color: 'bg-red' }
  ]

  const handleLogout = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/auth/signin')
  }

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-muted/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/despega" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
              <span className="text-lg font-black text-white">D</span>
            </div>
            <span className="font-bold text-lg text-white" style={{ fontFamily: 'var(--font-playfair-display)' }}>
              Despega
            </span>
          </Link>

          {/* Phase Progress Indicator - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {phaseOrder.map((phase, idx) => {
              const isCompleted = false // TODO: Get from user data
              const isActive = currentPhase === phase.key
              return (
                <div key={phase.key} className="flex items-center">
                  <button
                    onClick={() => {
                      if (phase.key === 'ritual') router.push('/despega/a1-cerebral')
                      else if (phase.key === 'exploration') router.push('/despega/conozcamonos-2')
                      else if (phase.key === 'training') router.push('/despega/a3-intro')
                      else if (phase.key === 'reality') router.push('/despega/a4-intro')
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold text-sm transition-all ${
                      isActive ? `${phase.color} text-white shadow-lg` : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                    title={phase.label}
                  >
                    {idx + 1}
                  </button>
                  {idx < phaseOrder.length - 1 && <div className="w-2 h-0.5 bg-white/20 mx-1"></div>}
                </div>
              )
            })}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/despega">
              <Button 
                variant={pathname === '/despega' ? 'default' : 'ghost'}
                size="sm"
                className={pathname === '/despega' ? 'bg-purple text-white hover:bg-purple/90' : 'text-muted-foreground hover:text-foreground hover:bg-transparent'}
              >
                Dashboard
              </Button>
            </Link>

            {stages.map((stage) => {
              const stagePhaseMap = {
                'Información': 'info',
                'El Ritual': 'ritual',
                'Exploración': 'exploration',
                'Entrenamiento': 'training',
                'La Realidad': 'reality'
              }
              const phaseAccent = {
                'ritual': 'text-purple hover:text-purple',
                'exploration': 'text-blue hover:text-blue',
                'training': 'text-orange hover:text-orange',
                'reality': 'text-red hover:text-red',
                'info': 'text-muted hover:text-foreground'
              }[stagePhaseMap[stage.name as keyof typeof stagePhaseMap] || 'info']
              
              return (
                <div key={stage.name} className="relative group">
                  <Button variant="ghost" size="sm" className={`flex items-center gap-1 ${phaseAccent}`}>
                    <stage.icon className="w-4 h-4" />
                    {stage.name}
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {/* Dropdown - Colored background based on phase */}
                  <div className={`absolute left-0 mt-0 w-48 border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                    stagePhaseMap[stage.name as keyof typeof stagePhaseMap] === 'ritual' 
                      ? 'bg-purple/15 border-purple/40'
                      : stagePhaseMap[stage.name as keyof typeof stagePhaseMap] === 'exploration'
                      ? 'bg-blue/15 border-blue/40'
                      : stagePhaseMap[stage.name as keyof typeof stagePhaseMap] === 'training'
                      ? 'bg-orange/15 border-orange/40'
                      : stagePhaseMap[stage.name as keyof typeof stagePhaseMap] === 'reality'
                      ? 'bg-red/15 border-red/40'
                      : 'bg-muted/10 border-muted/40'
                  }`}>
                    {stage.routes.map((route) => (
                      <Link key={route.href} href={route.href}>
                        <Button
                          variant={pathname === route.href ? 'default' : 'ghost'}
                          size="sm"
                          className={`w-full justify-start rounded-none first:rounded-t-lg last:rounded-b-lg ${
                            pathname === route.href ? 'bg-muted/80 text-white' : 'text-muted-foreground hover:text-white hover:bg-muted/80'
                          }`}
                        >
                          {route.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop XP Badge + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <XPNavbarBadge />
            <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2 border-muted-foreground text-muted-foreground hover:bg-transparent hover:text-white">
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-muted-foreground hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Phase Progress Indicator - Mobile */}
        <div className="md:hidden flex items-center justify-center gap-1 pb-3">
          {phaseOrder.map((phase, idx) => (
            <div key={phase.key} className="flex items-center">
              <button
                onClick={() => {
                  if (phase.key === 'ritual') router.push('/despega/a1-cerebral')
                  else if (phase.key === 'exploration') router.push('/despega/conozcamonos-2')
                  else if (phase.key === 'training') router.push('/despega/a3-intro')
                  else if (phase.key === 'reality') router.push('/despega/a4-intro')
                }}
                className={`w-8 h-8 rounded-full font-bold text-xs transition-all flex items-center justify-center ${
                  currentPhase === phase.key ? `${phase.color} text-white shadow-lg` : 'bg-white/10 text-white/60'
                }`}
              >
                {idx + 1}
              </button>
              {idx < phaseOrder.length - 1 && <div className="w-1 h-0.5 bg-white/20 mx-0.5"></div>}
            </div>
          ))}
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 max-h-96 overflow-y-auto">
            <Link href="/despega">
              <Button variant="ghost" className="w-full justify-start mb-2 text-muted-foreground hover:text-white hover:bg-transparent">
                Dashboard
              </Button>
            </Link>

            {stages.map((stage) => (
              <div key={stage.name}>
                <button
                  onClick={() => setExpandedStage(expandedStage === stage.name ? null : stage.name)}
                  className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-muted/80 font-semibold text-muted-foreground hover:text-white"
                >
                  <div className="flex items-center gap-2">
                    <stage.icon className="w-4 h-4" />
                    {stage.name}
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${expandedStage === stage.name ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedStage === stage.name && (
                  <div className="ml-4 space-y-1">
                    {stage.routes.map((route) => (
                      <Link key={route.href} href={route.href}>
                        <Button
                          variant={pathname === route.href ? 'default' : 'ghost'}
                          size="sm"
                          className={`w-full justify-start text-sm ${
                            pathname === route.href ? 'bg-muted/80 text-white' : 'text-muted-foreground hover:text-white hover:bg-transparent'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {route.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="w-full justify-start gap-2 mt-4 border-muted-foreground text-muted-foreground hover:bg-transparent hover:text-white"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
