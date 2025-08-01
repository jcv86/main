"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchDialog } from "@/components/search-dialog"
import { NotificationsBell } from "@/components/notifications-bell"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import {
  Menu,
  Home,
  User,
  FileText,
  Briefcase,
  MessageSquare,
  BookOpen,
  Calendar,
  Target,
  GraduationCap,
  Brain,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react"

const testItems = [
  {
    title: "Tests Psicométricos",
    items: [
      {
        title: "Test de Personalidad",
        href: "/personality-test",
        description: "Descubre tu tipo de personalidad",
        icon: Brain,
      },
      {
        title: "Test DISC",
        href: "/disc-test",
        description: "Evalúa tu estilo de comportamiento",
        icon: User,
      },
      {
        title: "Big Five",
        href: "/big-five-test",
        description: "Los cinco grandes factores de personalidad",
        icon: Brain,
      },
      {
        title: "Habilidades Blandas",
        href: "/soft-skills-test",
        description: "Evalúa tus competencias interpersonales",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Tests Técnicos",
    items: [
      {
        title: "Habilidades Técnicas",
        href: "/technical-skills-test",
        description: "Evalúa tus competencias técnicas",
        icon: Settings,
      },
      {
        title: "Test Adaptativo",
        href: "/adaptive-skills-test",
        description: "Evaluación que se adapta a tu nivel",
        icon: Sparkles,
      },
    ],
  },
]

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "CV Builder",
    href: "/cv-builder",
    icon: FileText,
  },
  {
    title: "Búsqueda de Empleo",
    href: "/job-search",
    icon: Briefcase,
  },
  {
    title: "Coach de Carrera",
    href: "/career-coach",
    icon: MessageSquare,
  },
  {
    title: "Simulador de Entrevistas",
    href: "/interview-simulator",
    icon: User,
  },
  {
    title: "Biblioteca",
    href: "/library",
    icon: BookOpen,
  },
  {
    title: "Calendario",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Metas",
    href: "/goals",
    icon: Target,
  },
]

const educationItems = [
  {
    title: "Carreras UDD",
    href: "/udd-careers",
    description: "Explora las carreras de la Universidad del Desarrollo",
    icon: GraduationCap,
  },
  {
    title: "Bachillerato",
    href: "/bachillerato",
    description: "Información sobre programas de bachillerato",
    icon: BookOpen,
  },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">CareerDev</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    isActive("/dashboard") && "bg-accent text-accent-foreground",
                  )}
                >
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
                <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                  {testItems.map((category) => (
                    <div key={category.title} className="space-y-3">
                      <h4 className="text-sm font-medium leading-none text-muted-foreground">{category.title}</h4>
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center space-x-2">
                              <item.icon className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/cv-builder" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    isActive("/cv-builder") && "bg-accent text-accent-foreground",
                  )}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  CV Builder
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/job-search" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    isActive("/job-search") && "bg-accent text-accent-foreground",
                  )}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Empleos
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <GraduationCap className="mr-2 h-4 w-4" />
                Educación
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px]">
                  {educationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex items-center space-x-2">
                        <item.icon className="h-4 w-4" />
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side items */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchDialog />
          </div>
          <nav className="flex items-center space-x-2">
            {user && <NotificationsBell />}
            <ThemeToggle />
            <LanguageToggle />

            {user ? (
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden md:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            ) : (
              <Button asChild size="sm" className="hidden md:flex">
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetHeader>
              <SheetTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span>CareerDev</span>
              </SheetTitle>
              <SheetDescription>Tu plataforma de desarrollo profesional</SheetDescription>
            </SheetHeader>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive(item.href) ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}

                <div className="pt-4">
                  <h4 className="mb-2 text-sm font-semibold">Tests</h4>
                  {testItems.map((category) => (
                    <div key={category.title} className="mb-4">
                      <h5 className="mb-2 text-xs font-medium text-muted-foreground">{category.title}</h5>
                      {category.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            "flex items-center space-x-2 text-sm transition-colors hover:text-primary pl-4 py-1",
                            isActive(item.href) ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          <item.icon className="h-3 w-3" />
                          <span>{item.title}</span>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <h4 className="mb-2 text-sm font-semibold">Educación</h4>
                  {educationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 text-sm transition-colors hover:text-primary pl-4 py-1",
                        isActive(item.href) ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="h-3 w-3" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>

                {user && (
                  <div className="pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Salir
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
