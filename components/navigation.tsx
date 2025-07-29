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
  Users,
  Award,
  GraduationCap,
  Building,
} from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <Home className="h-4 w-4" />,
    description: "Panel principal con resumen de tu progreso",
  },
  {
    title: "Perfil",
    href: "/profile",
    icon: <User className="h-4 w-4" />,
    description: "Gestiona tu información personal y profesional",
  },
  {
    title: "Evaluaciones",
    icon: <Brain className="h-4 w-4" />,
    items: [
      {
        title: "Evaluación de Habilidades",
        href: "/skills-assessment",
        description: "Evalúa tus competencias técnicas y profesionales",
        icon: <Target className="h-4 w-4" />,
      },
      {
        title: "Test de Personalidad",
        href: "/personality-test",
        description: "Descubre tu tipo de personalidad DISC",
        icon: <Brain className="h-4 w-4" />,
      },
      {
        title: "Big Five",
        href: "/big-five-test",
        description: "Evaluación completa de personalidad",
        icon: <Award className="h-4 w-4" />,
      },
      {
        title: "Habilidades Blandas",
        href: "/soft-skills-test",
        description: "Evalúa tus competencias interpersonales",
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "CV Builder",
    href: "/cv-builder",
    icon: <FileText className="h-4 w-4" />,
    description: "Crea y optimiza tu currículum vitae",
  },
  {
    title: "Búsqueda de Empleo",
    href: "/job-search",
    icon: <Search className="h-4 w-4" />,
    description: "Encuentra oportunidades laborales",
  },
  {
    title: "AI Career Coach",
    href: "/career-coach",
    icon: <MessageSquare className="h-4 w-4" />,
    description: "Tu mentor personal de carrera profesional",
    badge: "NUEVO",
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
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">DTC</span>
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
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
          <ThemeToggle />
          <LanguageToggle />

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl">DTC</span>
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
