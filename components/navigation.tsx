"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Menu,
  Home,
  User,
  FileText,
  Search,
  BookOpen,
  Target,
  Calendar,
  Brain,
  Code,
  MessageSquare,
  GraduationCap,
  Building,
  Users,
  Trophy,
  Zap,
  Heart,
  Lightbulb,
  BarChart3,
  UserCheck,
  Briefcase,
} from "lucide-react"

const testItems = [
  {
    title: "Tests Psicométricos",
    items: [
      {
        title: "Test de Personalidad",
        href: "/personality-test",
        description: "Descubre tu tipo de personalidad y características",
        icon: Brain,
      },
      {
        title: "Test DISC",
        href: "/disc-test",
        description: "Evalúa tu estilo de comportamiento y comunicación",
        icon: Users,
      },
      {
        title: "Test Big Five",
        href: "/big-five-test",
        description: "Análisis completo de los cinco grandes factores de personalidad",
        icon: Trophy,
      },
      {
        title: "Habilidades Blandas",
        href: "/soft-skills-test",
        description: "Evalúa tus competencias interpersonales",
        icon: Heart,
      },
    ],
  },
  {
    title: "Tests Técnicos",
    items: [
      {
        title: "Habilidades Técnicas",
        href: "/technical-skills-test",
        description: "Evalúa tus competencias técnicas específicas",
        icon: Code,
      },
      {
        title: "Test Adaptativo",
        href: "/adaptive-skills-test",
        description: "Evaluación que se adapta a tu nivel de conocimiento",
        icon: Zap,
      },
      {
        title: "Evaluación de Habilidades",
        href: "/skills-assessment",
        description: "Análisis integral de tus capacidades profesionales",
        icon: BarChart3,
      },
    ],
  },
]

const educationItems = [
  {
    title: "Carreras UDD",
    href: "/udd-careers",
    description: "Explora las carreras disponibles en la Universidad del Desarrollo",
    icon: GraduationCap,
  },
  {
    title: "Bachillerato",
    href: "/bachillerato",
    description: "Información sobre el programa de Bachillerato",
    icon: Building,
  },
]

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Perfil",
    href: "/profile",
    icon: User,
  },
  {
    title: "Constructor CV",
    href: "/cv-builder",
    icon: FileText,
  },
  {
    title: "Búsqueda de Empleo",
    href: "/job-search",
    icon: Search,
  },
  {
    title: "Biblioteca",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "Metas",
    href: "/goals",
    icon: Target,
  },
  {
    title: "Calendario",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Coach Profesional",
    href: "/career-coach",
    icon: MessageSquare,
  },
  {
    title: "Simulador de Entrevistas",
    href: "/interview-simulator",
    icon: UserCheck,
  },
  {
    title: "Sistema Mirix",
    href: "/mirix",
    icon: Lightbulb,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex items-center space-x-4">
      {/* Desktop Navigation */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/dashboard" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <Brain className="mr-2 h-4 w-4" />
              Tests
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                {testItems.map((category) => (
                  <div key={category.title} className="space-y-3">
                    <h4 className="text-sm font-medium leading-none">{category.title}</h4>
                    {category.items.map((item) => (
                      <NavigationMenuLink key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            pathname === item.href && "bg-accent text-accent-foreground",
                          )}
                        >
                          <div className="flex items-center space-x-2">
                            <item.icon className="h-4 w-4" />
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <GraduationCap className="mr-2 h-4 w-4" />
              Educación
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[400px] gap-3 p-4">
                {educationItems.map((item) => (
                  <NavigationMenuLink key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        pathname === item.href && "bg-accent text-accent-foreground",
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                    </Link>
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/cv-builder" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <FileText className="mr-2 h-4 w-4" />
                CV Builder
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/job-search" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <Briefcase className="mr-2 h-4 w-4" />
                Empleos
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/career-coach" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Coach
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile Navigation */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Principal</h4>
              {mainNavItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Tests Psicométricos</h4>
              {testItems[0].items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Tests Técnicos</h4>
              {testItems[1].items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Educación</h4>
              {educationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Herramientas</h4>
              {mainNavItems.slice(4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
