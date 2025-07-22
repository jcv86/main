"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  User,
  Brain,
  Target,
  MessageSquare,
  FileText,
  Search,
  GraduationCap,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

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
    icon: Target,
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

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navigationItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              mobile && "w-full",
            )}
            onClick={() => mobile && setIsOpen(false)}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}

      <div className={cn("border-t pt-4 mt-4", mobile && "w-full")}>
        {userMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                mobile && "w-full",
              )}
              onClick={() => mobile && setIsOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}

        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium w-full justify-start text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            mobile && "w-full",
          )}
          onClick={() => {
            console.log("Cerrar sesión")
            if (mobile) setIsOpen(false)
          }}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:bg-background md:border-r md:p-6">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Carrera Pro</span>
        </div>

        <div className="flex flex-col gap-2">
          <NavItems />
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex items-center justify-between p-4 border-b bg-background">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">Carrera Pro</span>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-6">
              <div className="flex items-center gap-2 mb-8">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Carrera Pro</span>
              </div>

              <div className="flex flex-col gap-2">
                <NavItems mobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}
