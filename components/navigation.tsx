"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  Home,
  User,
  FileText,
  Search,
  BookOpen,
  Calendar,
  Target,
  Settings,
  Brain,
  Code,
  MessageSquare,
  BarChart3,
  Users,
  GraduationCap,
  Building2,
  TestTube,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { NotificationsBell } from "@/components/notifications-bell"
import { SearchDialog } from "@/components/search-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

const navigationItems = [
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
    title: "Tests y Evaluaciones",
    icon: TestTube,
    children: [
      {
        title: "Test de Personalidad DISC",
        href: "/disc-test",
        icon: Brain,
      },
      {
        title: "Test Big Five",
        href: "/big-five-test",
        icon: Brain,
      },
      {
        title: "Test de Habilidades Blandas",
        href: "/soft-skills-test",
        icon: Users,
      },
      {
        title: "Test de Habilidades Técnicas",
        href: "/technical-skills-test",
        icon: Code,
      },
      {
        title: "Evaluación de Habilidades",
        href: "/skills-assessment",
        icon: BarChart3,
      },
      {
        title: "Test Adaptativo",
        href: "/adaptive-skills-test",
        icon: Brain,
      },
      {
        title: "Coach de Personalidad",
        href: "/personality-coach-test",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "CV Builder",
    href: "/cv-builder",
    icon: FileText,
  },
  {
    title: "Generador CV IA",
    href: "/cv-ai-generator",
    icon: Brain,
  },
  {
    title: "Búsqueda de Empleo",
    href: "/job-search",
    icon: Search,
  },
  {
    title: "Coach de Carrera",
    href: "/career-coach",
    icon: MessageSquare,
  },
  {
    title: "Simulador de Entrevistas",
    href: "/interview-simulator",
    icon: Users,
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
  {
    title: "Carreras UDD",
    href: "/udd-careers",
    icon: GraduationCap,
  },
  {
    title: "Bachillerato",
    href: "/bachillerato",
    icon: Building2,
  },
  {
    title: "Sistema Mirix",
    href: "/mirix",
    icon: Brain,
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const NavItem = ({ item, mobile = false }: { item: any; mobile?: boolean }) => {
    if (item.children) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "justify-start gap-2",
                mobile ? "w-full" : "",
                pathname.startsWith(item.href) && "bg-accent text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
              <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {item.children.map((child: any) => (
              <DropdownMenuItem key={child.href} asChild>
                <Link
                  href={child.href}
                  className={cn(
                    "flex items-center gap-2 w-full",
                    pathname === child.href && "bg-accent text-accent-foreground",
                  )}
                  onClick={() => mobile && setIsOpen(false)}
                >
                  <child.icon className="h-4 w-4" />
                  {child.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button
        variant="ghost"
        className={cn(
          "justify-start gap-2",
          mobile ? "w-full" : "",
          pathname === item.href && "bg-accent text-accent-foreground",
        )}
        asChild
      >
        <Link href={item.href} onClick={() => mobile && setIsOpen(false)}>
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      </Button>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Desarrollo Profesional</span>
          </Link>
          <nav className="flex items-center space-x-1 text-sm font-medium">
            {navigationItems.slice(0, 4).map((item) => (
              <NavItem key={item.href || item.title} item={item} />
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  Más
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {navigationItems.slice(4).map((item) => (
                  <div key={item.href || item.title}>
                    {item.children ? (
                      <div>
                        <div className="px-2 py-1.5 text-sm font-semibold">{item.title}</div>
                        {item.children.map((child: any) => (
                          <DropdownMenuItem key={child.href} asChild>
                            <Link
                              href={child.href}
                              className={cn(
                                "flex items-center gap-2 w-full pl-4",
                                pathname === child.href && "bg-accent text-accent-foreground",
                              )}
                            >
                              <child.icon className="h-4 w-4" />
                              {child.title}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </div>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2 w-full",
                            pathname === item.href && "bg-accent text-accent-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
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
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <span className="font-bold">Desarrollo Profesional</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <NavItem key={item.href || item.title} item={item} mobile />
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchDialog />
          </div>
          <nav className="flex items-center space-x-2">
            <NotificationsBell />
            <ThemeToggle />
            <LanguageToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
