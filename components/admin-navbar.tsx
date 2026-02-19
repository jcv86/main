'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Settings,
  BarChart3,
  BookOpen,
  Brain,
  MessageSquare,
  Users,
  HelpCircle,
  LogOut,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'

export function AdminNavbar() {
  return (
    <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">DESPEGA</div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Tu Carrera</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard/tests" className="text-sm font-medium hover:text-primary">
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Tests
            </Link>
            <Link href="/dashboard/biblioteca" className="text-sm font-medium hover:text-primary">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Biblioteca
            </Link>
            <Link href="/dashboard/coaching" className="text-sm font-medium hover:text-primary">
              <Brain className="w-4 h-4 inline mr-2" />
              Coaching
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Ayuda
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link href="/test">
              <Button variant="ghost" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tests</span>
              </Button>
            </Link>
            <Link href="/biblioteca">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Biblioteca</span>
              </Button>
            </Link>
            <Link href="/personalized-learning">
              <Button variant="ghost" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Aprender</span>
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="ghost" size="sm">
                <Trophy className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Ranking</span>
              </Button>
            </Link>
            <Link href="/learning-flow-onboarding">
              <Button variant="ghost" size="sm">
                <Zap className="h-4 w-4 mr-2 text-amber-500" />
                <span className="hidden sm:inline">Flujo</span>
              </Button>
            </Link>
            <Link href="/ai-coach">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Coach IA</span>
              </Button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Admin Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/coaching-analytics" className="cursor-pointer">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Análisis de Coaching
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/prompt-management" className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />
                    Gestión de Prompts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/critical-logs" className="cursor-pointer">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Logs Críticos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/review-workflow" className="cursor-pointer">
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Workflow de Revisión
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/ab-test-results" className="cursor-pointer">
                    <Trophy className="h-4 w-4 mr-2" />
                    Resultados A/B Testing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/kpi-dashboard" className="cursor-pointer">
                    <Target className="h-4 w-4 mr-2" />
                    KPI Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/executive-summary" className="cursor-pointer">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Resumen Ejecutivo
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/prompt-bank" className="cursor-pointer">
                    <Database className="h-4 w-4 mr-2" />
                    Banco de Prompts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/documentacion" className="cursor-pointer">
                    <FileText className="h-4 w-4 mr-2" />📄 Documentación Técnica
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/documentacion-funcional" className="cursor-pointer">
                    <Book className="h-4 w-4 mr-2" />📘 Documentación Funcional
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/preguntas-operacionales" className="cursor-pointer">
                    <HelpCircle className="h-4 w-4 mr-2" />❓ Preguntas Operacionales
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/test-metrics" className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Métricas de Coaching
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/users" className="cursor-pointer">
                    <Users className="h-4 w-4 mr-2" />
                    Usuarios
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
