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
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import type { MainNavItem } from "@/types"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

const navigationItems: MainNavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Panel principal con resumen de tu progreso",
  },
  {
    title: "Perfil",
    href: "/profile",
    description: "Gestiona tu información personal y profesional",
  },
  {
    title: "Evaluaciones",
    items: [
      {
        title: "Hub de Evaluaciones",
        href: "/assessments",
        description: "Centro de todas tus evaluaciones y resultados",
      },
      {
        title: "Evaluación de Habilidades",
        href: "/skills-assessment",
        description: "Evalúa tus competencias técnicas y profesionales",
      },
      {
        title: "Test de Personalidad",
        href: "/personality-test",
        description: "Descubre tu tipo de personalidad DISC",
      },
      {
        title: "Big Five",
        href: "/big-five-test",
        description: "Evaluación completa de personalidad",
      },
      {
        title: "Habilidades Blandas",
        href: "/soft-skills-test",
        description: "Evalúa tus competencias interpersonales",
      },
      {
        title: "Habilidades Técnicas",
        href: "/technical-skills-test",
        description: "Evaluación de competencias técnicas especializadas",
      },
    ],
  },
  {
    title: "CV Builder",
    href: "/cv-builder",
    description: "Crea y optimiza tu currículum vitae",
  },
  {
    title: "Búsqueda de Empleo",
    href: "/job-search",
    description: "Encuentra oportunidades laborales",
  },
  {
    title: "AI Career Coach",
    href: "/career-coach",
    description: "Tu mentor personal de carrera profesional",
    label: "NUEVO",
  },
  {
    title: "Biblioteca",
    href: "/library",
    description: "Recursos y libros para tu desarrollo profesional",
  },
  {
    title: "Educación",
    items: [
      {
        title: "Carreras UDD",
        href: "/udd-careers",
        description: "Explora carreras de la Universidad del Desarrollo",
      },
      {
        title: "Bachillerato",
        href: "/bachillerato",
        description: "Información sobre programas de bachillerato",
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
          <Icons.logo className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="flex items-center gap-2">{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.items.map((subItem) => (
                          <li key={subItem.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={subItem.href!}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{subItem.title}</div>
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
                        {item.title}
                        {item.label && (
                          <Badge variant="secondary" className="text-xs">
                            {item.label}
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
                <Icons.settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Icons.settings className="h-4 w-4 mr-2" />
                  Configuración
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Icons.user className="h-4 w-4 mr-2" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Icons.menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <Icons.logo className="h-6 w-6" />
                  <span className="font-bold text-xl">{siteConfig.name}</span>
                </div>

                {navigationItems.map((item) => (
                  <div key={item.title}>
                    {item.items ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 font-medium text-sm text-muted-foreground">
                          {item.title}
                        </div>
                        <div className="ml-6 space-y-1">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href!}
                              onClick={() => setIsOpen(false)}
                              className="block py-2 text-sm hover:text-primary"
                            >
                              {subItem.title}
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
                        {item.title}
                        {item.label && (
                          <Badge variant="secondary" className="text-xs">
                            {item.label}
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
