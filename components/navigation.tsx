"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
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
  LayoutDashboard,
  Brain,
  Target,
  MessageSquare,
  Search,
  FileText,
  BookOpen,
  Calendar,
  Trophy,
  User,
  Settings,
} from "lucide-react"

const navigationItems = [
  {
    title: "Panel Principal",
    href: "/dashboard",
    icon: LayoutDashboard,
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
    title: "Búsqueda de Empleo",
    href: "/job-search",
    icon: Search,
  },
  {
    title: "Constructor de CV",
    href: "/cv-builder",
    icon: FileText,
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
    icon: Trophy,
  },
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
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                {item.href === "/dashboard" || item.href === "/cv-builder" || item.href === "/job-search" ? (
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                        isActive(item.href) && "bg-accent text-accent-foreground",
                      )}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                ) : (
                  <NavigationMenuTrigger>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </NavigationMenuTrigger>
                )}
              </NavigationMenuItem>
            ))}
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
                <Settings className="h-4 w-4 mr-2" />
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
                      <Settings className="h-4 w-4 mr-2" />
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
