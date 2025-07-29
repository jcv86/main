"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { siteConfig } from "@/config/site"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"

interface NavItem {
  title: string
  href: string
  icon?: keyof typeof Icons
  description?: string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "user",
    description: "Vista general de tu progreso",
  },
  {
    title: "Evaluaciones",
    href: "/assessments",
    icon: "user",
    description: "Tests de personalidad y habilidades",
  },
  {
    title: "CV Builder",
    href: "/cv-builder",
    icon: "page",
    description: "Crea tu currículum profesional",
  },
  {
    title: "Coach de Carrera",
    href: "/career-coach",
    icon: "user",
    description: "Orientación personalizada",
  },
  {
    title: "Búsqueda de Empleo",
    href: "/job-search",
    icon: "user",
    description: "Encuentra oportunidades laborales",
  },
  {
    title: "Biblioteca",
    href: "/library",
    icon: "post",
    description: "Recursos de desarrollo profesional",
  },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.slice(0, 4).map((item) => (
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

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Icons.ellipsis className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
              <Icons.logo className="mr-2 h-4 w-4" />
              <span className="font-bold">{siteConfig.name}</span>
            </Link>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => {
                  const Icon = Icons[item.icon || "user"]
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80",
                        pathname === item.href ? "text-foreground" : "text-foreground/60",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden">
              <Icons.logo className="h-6 w-6" />
              <span className="font-bold">{siteConfig.name}</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
            <Button variant="ghost" size="sm">
              <Icons.user className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Icons.settings className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}

// Also export MainNav and MobileNav for backward compatibility
export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <div className={cn("mr-4 hidden md:flex", className)}>
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {navItems.slice(0, 4).map((item) => (
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
  )
}

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
            className,
          )}
        >
          <Icons.ellipsis className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-bold">{siteConfig.name}</span>
        </Link>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const Icon = Icons[item.icon || "user"]
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
