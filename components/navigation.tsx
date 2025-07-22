"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  User,
  FileText,
  MessageSquare,
  BarChart3,
  Briefcase,
  BookOpen,
  Settings,
  LogOut,
  Brain,
  Code,
  Heart,
  Users,
  TestTube,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Evaluaciones",
    icon: TestTube,
    items: [
      {
        title: "Tests de Personalidad",
        items: [
          {
            title: "Test de Personalidad",
            href: "/personality-test",
            description: "Análisis completo de tu personalidad profesional",
            icon: Brain,
          },
          {
            title: "Test DISC",
            href: "/disc-test",
            description: "Evalúa tu estilo de comportamiento",
            icon: Target,
          },
        ],
      },
      {
        title: "Habilidades Técnicas",
        items: [
          {
            title: "Evaluación Técnica",
            href: "/technical-skills-test",
            description: "Mide tus conocimientos técnicos",
            icon: Code,
          },
          {
            title: "Evaluación General",
            href: "/skills-assessment",
            description: "Competencias profesionales integrales",
            icon: BarChart3,
          },
        ],
      },
      {
        title: "Habilidades Blandas",
        items: [
          {
            title: "Test de Habilidades Blandas",
            href: "/soft-skills-test",
            description: "Comunicación, liderazgo y trabajo en equipo",
            icon: Heart,
          },
        ],
      },
      {
        title: "Preparación Profesional",
        items: [
          {
            title: "Simulador de Entrevistas",
            href: "/interview-simulator",
            description: "Practica entrevistas con IA",
            icon: Users,
          },
        ],
      },
    ],
  },
  {
    title: "Herramientas",
    icon: Briefcase,
    items: [
      {
        title: "Constructor de CV",
        href: "/cv-builder",
        description: "Crea tu currículum perfecto",
        icon: FileText,
      },
      {
        title: "Coach de Carrera",
        href: "/career-coach",
        description: "Consejos personalizados con IA",
        icon: MessageSquare,
      },
      {
        title: "Búsqueda de Empleos",
        href: "/job-search",
        description: "Encuentra oportunidades laborales",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Biblioteca",
    href: "/library",
    icon: BookOpen,
  },
]

export function Navigation() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  if (!user) {
    return null
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DC</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Despega tu Carrera</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          "h-9 px-4 py-2",
                          item.items.some((group) =>
                            group.items ? group.items.some((subItem) => isActive(subItem.href)) : isActive(group.href),
                          ) && "bg-accent text-accent-foreground",
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                          {item.items.map((group) => (
                            <div key={group.title}>
                              <h4 className="mb-2 text-sm font-medium leading-none">{group.title}</h4>
                              <div className="space-y-1">
                                {group.items ? (
                                  group.items.map((subItem) => (
                                    <NavigationMenuLink key={subItem.title} asChild>
                                      <Link
                                        href={subItem.href}
                                        className={cn(
                                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                          isActive(subItem.href) && "bg-accent text-accent-foreground",
                                        )}
                                      >
                                        <div className="flex items-center space-x-2">
                                          <subItem.icon className="h-4 w-4" />
                                          <div className="text-sm font-medium leading-none">{subItem.title}</div>
                                        </div>
                                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                          {subItem.description}
                                        </p>
                                      </Link>
                                    </NavigationMenuLink>
                                  ))
                                ) : (
                                  <NavigationMenuLink asChild>
                                    <Link
                                      href={group.href}
                                      className={cn(
                                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                        isActive(group.href) && "bg-accent text-accent-foreground",
                                      )}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <group.icon className="h-4 w-4" />
                                        <div className="text-sm font-medium leading-none">{group.title}</div>
                                      </div>
                                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                        {group.description}
                                      </p>
                                    </Link>
                                  </NavigationMenuLink>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                          isActive(item.href) && "bg-accent text-accent-foreground",
                        )}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
            <div className="px-7">
              <Link href="/dashboard" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">DC</span>
                </div>
                <span className="font-bold">Despega tu Carrera</span>
              </Link>
            </div>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <div key={item.title}>
                    {item.items ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-muted-foreground px-2 py-1">{item.title}</h4>
                        {item.items.map((group) => (
                          <div key={group.title} className="pl-4 space-y-1">
                            <h5 className="font-medium text-xs text-muted-foreground px-2 py-1">{group.title}</h5>
                            {group.items ? (
                              group.items.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={cn(
                                    "flex items-center space-x-2 px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                                    isActive(subItem.href) && "bg-accent text-accent-foreground",
                                  )}
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
                                </Link>
                              ))
                            ) : (
                              <Link
                                href={group.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                  "flex items-center space-x-2 px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                                  isActive(group.href) && "bg-accent text-accent-foreground",
                                )}
                              >
                                <group.icon className="h-4 w-4" />
                                <span>{group.title}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-2 px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
                          isActive(item.href) && "bg-accent text-accent-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/dashboard" className="flex items-center space-x-2 md:hidden">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">DC</span>
              </div>
              <span className="font-bold">Despega tu Carrera</span>
            </Link>
          </div>
          <nav className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}
