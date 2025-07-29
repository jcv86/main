"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  Home,
  User,
  FileText,
  Search,
  BookOpen,
  MessageSquare,
  Settings,
  Brain,
  Target,
  TrendingUp,
  Award,
  GraduationCap,
  Building,
  Calendar,
  LogOut,
  Code,
  Heart,
  Zap,
  TestTube,
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { NotificationsBell } from "./notifications-bell"
import { useAuth } from "@/contexts/auth-context"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4" />,
    description: "Panel principal con resumen de tu progreso",
  },
  {
    title: "Evaluaciones",
    icon: <Brain className="h-4 w-4" />,
    items: [
      {
        title: "Test de Personalidad DISC",
        href: "/disc-test",
        description: "Descubre tu estilo de personalidad dominante",
        icon: <Brain className="h-4 w-4" />,
        badge: "Popular",
      },
      {
        title: "Big Five Personalidad",
        href: "/big-five-test",
        description: "Evaluación completa de los 5 grandes factores",
        icon: <Award className="h-4 w-4" />,
      },
      {
        title: "Coach de Personalidad",
        href: "/personality-coach-test",
        description: "Test con análisis de IA personalizado",
        icon: <MessageSquare className="h-4 w-4" />,
        badge: "IA",
      },
      {
        title: "Habilidades Técnicas",
        href: "/technical-skills-test",
        description: "Evalúa tus competencias técnicas",
        icon: <Code className="h-4 w-4" />,
      },
      {
        title: "Habilidades Blandas",
        href: "/soft-skills-test",
        description: "Competencias interpersonales y sociales",
        icon: <Heart className="h-4 w-4" />,
      },
      {
        title: "Evaluación de Habilidades",
        href: "/skills-assessment",
        description: "Assessment completo de competencias",
        icon: <Target className="h-4 w-4" />,
      },
      {
        title: "Test Adaptativo",
        href: "/adaptive-skills-test",
        description: "Evaluación que se adapta a tu nivel",
        icon: <Zap className="h-4 w-4" />,
        badge: "Nuevo",
      },
    ],
  },
  {
    title: "CV Builder",
    href: "/cv-builder",
    icon: <FileText className="h-4 w-4" />,
    description: "Crea y optimiza tu currículum vitae",
    badge: "Mejorado",
  },
  {
    title: "IA Generativa",
    icon: <MessageSquare className="h-4 w-4" />,
    items: [
      {
        title: "Career Coach IA",
        href: "/career-coach",
        description: "Tu mentor personal de carrera profesional",
        icon: <MessageSquare className="h-4 w-4" />,
        badge: "IA",
      },
      {
        title: "Generador CV IA",
        href: "/cv-ai-generator",
        description: "Crea CVs optimizados con inteligencia artificial",
        icon: <FileText className="h-4 w-4" />,
        badge: "IA",
      },
      {
        title: "Simulador de Entrevistas",
        href: "/interview-simulator",
        description: "Practica entrevistas con IA",
        icon: <TestTube className="h-4 w-4" />,
        badge: "Beta",
      },
    ],
  },
  {
    title: "Búsqueda de Empleo",
    href: "/job-search",
    icon: <Search className="h-4 w-4" />,
    description: "Encuentra oportunidades laborales en Chile",
  },
  {
    title: "Biblioteca",
    href: "/library",
    icon: <BookOpen className="h-4 w-4" />,
    description: "Recursos y libros para tu desarrollo profesional",
  },
  {
    title: "Educación",
    icon: <GraduationCap className="h-4 w-4" />,
    items: [
      {
        title: "Carreras UDD",
        href: "/udd-careers",
        description: "Explora carreras de la Universidad del Desarrollo",
        icon: <Building className="h-4 w-4" />,
      },
      {
        title: "Bachillerato",
        href: "/bachillerato",
        description: "Información sobre programas de bachillerato",
        icon: <GraduationCap className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Herramientas",
    icon: <Target className="h-4 w-4" />,
    items: [
      {
        title: "Calendario",
        href: "/calendar",
        description: "Organiza tu desarrollo profesional",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        title: "Metas y Objetivos",
        href: "/goals",
        description: "Define y sigue tus objetivos de carrera",
        icon: <Target className="h-4 w-4" />,
      },
      {
        title: "Mi Perfil",
        href: "/profile",
        description: "Gestiona tu información personal y profesional",
        icon: <User className="h-4 w-4" />,
      },
    ],
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut, isDemoMode } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none">Despega tu Carrera</span>
            {isDemoMode && (
              <Badge variant="secondary" className="text-xs w-fit">
                Modo Demo
              </Badge>
            )}
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
                        {item.items.map((subItem) => (
                          <li key={subItem.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="flex items-center gap-2 text-sm font-medium leading-none">
                                  {subItem.icon}
                                  {subItem.title}
                                  {subItem.badge && (
                                    <Badge variant="secondary" className="text-xs">
                                      {subItem.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {subItem.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link href={item.href!} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 ${
                        pathname === item.href ? "bg-accent text-accent-foreground" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        {item.title}
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                    </NavigationMenuLink>
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <ThemeToggle />
          <LanguageToggle />

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.email || ""} />
                    <AvatarFallback>
                      {user.email
                        ? user.email
                            .split("@")[0]
                            .split(".")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user.user_metadata?.first_name || user.email?.split("@")[0] || "Usuario"}
                    </p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    {isDemoMode && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        Usuario Demo
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">Despega tu Carrera</span>
                </div>

                {navigationItems.map((item) => (
                  <div key={item.title}>
                    {item.items ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
                          {item.icon}
                          {item.title}
                        </div>
                        <div className="ml-6 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 text-sm hover:text-primary"
                            >
                              <div className="flex items-center gap-2">
                                {subItem.icon}
                                {subItem.title}
                                {subItem.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {subItem.badge}
                                  </Badge>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 py-2 text-sm hover:text-primary ${
                          pathname === item.href ? "text-primary font-medium" : ""
                        }`}
                      >
                        {item.icon}
                        {item.title}
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
