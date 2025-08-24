"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, ChevronDown, FileText, BookOpen, GraduationCap, Library } from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Tests", href: "/personality-test" },
  { name: "CV Builder", href: "/cv-builder" },
  { name: "Búsqueda de Empleo", href: "/job-search" },
  { name: "Coach IA", href: "/career-coach" },
  { name: "Biblioteca", href: "/library" },
]

const documentosItems = [
  {
    name: "Especificación Técnica",
    href: "/knowledge-base/dtc-technical-specification",
    icon: FileText,
    description: "Documentación técnica completa",
  },
  {
    name: "Guía de Inicio",
    href: "/knowledge-base/getting-started",
    icon: BookOpen,
    description: "Aprende a usar la plataforma",
  },
  {
    name: "Guía de Carreras",
    href: "/knowledge-base/careers-guide",
    icon: GraduationCap,
    description: "Mercado laboral chileno",
  },
  {
    name: "Base de Conocimiento",
    href: "/knowledge-base/knowledge-base",
    icon: Library,
    description: "Recursos generales",
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/" || pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  const isDocumentosActive = () => {
    return pathname.startsWith("/knowledge-base")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">Despega Tu Carrera</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  isActive(item.href) ? "text-foreground" : "text-foreground/60",
                )}
              >
                {item.name}
              </Link>
            ))}

            {/* Documentos Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "h-auto p-0 text-sm font-medium transition-colors hover:text-foreground/80",
                    isDocumentosActive() ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  Documentos
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {documentosItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-start space-x-3 p-3 hover:bg-accent">
                        <Icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuItem asChild>
                  <Link
                    href="/knowledge-base"
                    className="flex items-center justify-center p-3 text-sm font-medium text-primary hover:bg-accent"
                  >
                    Ver todos los documentos →
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link className="flex items-center" href="/" onClick={() => setIsOpen(false)}>
              <span className="font-bold">Despega Tu Carrera</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "transition-colors hover:text-foreground/80",
                      isActive(item.href) ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Documentos Section */}
                <div className="pt-4">
                  <h4 className="mb-2 text-sm font-semibold text-foreground">Documentos</h4>
                  <div className="flex flex-col space-y-2 pl-4">
                    {documentosItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center space-x-2 text-sm text-foreground/60 hover:text-foreground/80"
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      )
                    })}
                    <Link
                      href="/knowledge-base"
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Ver todos →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link className="inline-block md:hidden" href="/">
              <span className="font-bold">DTC</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
