"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BarChart3,
  Brain,
  FileText,
  MessageSquare,
  Search,
  User,
  Settings,
  LogOut,
  Menu,
  GraduationCap,
  Home,
} from "lucide-react"
import { useState } from "react"

const navigationItems = [
  {
    title: "Panel Principal",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Test de Personalidad",
    href: "/personality-test",
    icon: Brain,
  },
  {
    title: "Evaluación de Habilidades",
    href: "/skills-assessment",
    icon: BarChart3,
  },
  {
    title: "Coach Profesional",
    href: "/career-coach",
    icon: MessageSquare,
  },
  {
    title: "Constructor de CV",
    href: "/cv-builder",
    icon: FileText,
  },
  {
    title: "Búsqueda de Empleo",
    href: "/job-search",
    icon: Search,
  },
  {
    title: "Carreras UDD",
    href: "/udd-careers",
    icon: GraduationCap,
  },
]

const userMenuItems = [
  {
    title: "Mi Perfil",
    href: "/profile",
    icon: User,
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">CareerLaunch UDD</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/dashboard" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">CareerLaunch UDD</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80",
                      pathname === item.href ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                ))}
                <div className="border-t pt-3">
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                  <button className="flex items-center space-x-2 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/80">
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/dashboard" className="flex items-center space-x-2 md:hidden">
              <GraduationCap className="h-6 w-6" />
              <span className="font-bold">CareerLaunch UDD</span>
            </Link>
          </div>

          {/* Desktop User Menu */}
          <nav className="hidden md:flex items-center space-x-2">
            {userMenuItems.map((item) => (
              <Button key={item.href} variant="ghost" size="sm" asChild>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </Link>
              </Button>
            ))}
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
